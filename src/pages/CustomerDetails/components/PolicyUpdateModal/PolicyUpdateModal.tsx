import './PolicyUpdateModal.scss';

import { Divider } from "antd";
import type { RadioChangeEvent, TimelineItemProps } from 'antd';

import Selector from "@/components/Selector/Selector.tsx";
import Date from "@/components/Date/Date.tsx";
import Input from "@/components/Input/Input.tsx";
import Timeline from "@/components/Timeline/Timeline.tsx";
import Radio from "@/components/Radio/Radio.tsx";

import { useEffect, useMemo, useState } from "react";
import type { BaseSyntheticEvent, Dispatch, SetStateAction } from 'react'

import type { IPolicy, IPolicyFeeCreate, IUpdatePolicy } from "@/types/policy/main.ts";
import dayjs, { Dayjs } from "dayjs";
import advancedFormat from 'dayjs/plugin/advancedFormat';
import { newPolicyFormInitialState } from "@/pages/CustomerDetails/utils/policy.tsx";
import { getInsuranceFunctions } from "@/pages/Insurance/utils/insurance.tsx";
import PolicyFeeCreateModal from "@/pages/CustomerDetails/components/PolicyFeeCreateModal/PolicyFeeCreateModal.tsx";
import { getPolicyFeeFunctions } from "@/pages/CustomerDetails/utils/fee.tsx";
import Button from "@/components/Button/Button.tsx";
import Modal from "@/components/Modal/Modal.tsx";

import { ClockCircleOutlined } from "@ant-design/icons";

interface PolicyCreateModalProps {
  open: boolean;
  cancel: () => void;
  submit: (value: Partial<IUpdatePolicy>, resetForm: Dispatch<SetStateAction<IUpdatePolicy>>) => void;
  changePolicyFormTime: (val: keyof Pick<IUpdatePolicy, 'effectiveDate'>, callback: Dispatch<SetStateAction<IUpdatePolicy>>) => (val: Dayjs) => void;
  changePolicyFormData: (val: keyof Omit<IUpdatePolicy, 'expirationDate' | 'effectiveDate'>, callback: Dispatch<SetStateAction<IUpdatePolicy>>) => (val: BaseSyntheticEvent | RadioChangeEvent | string) => void;
  addPolicyFee: (value: IPolicyFeeCreate, callback: Dispatch<SetStateAction<IUpdatePolicy>>) => void;
  removePolicyFee: (value: number, callback: Dispatch<SetStateAction<IUpdatePolicy>>) => void;

  policyById: IPolicy;
  fetchPolicyById: () => void;
}

dayjs.extend(advancedFormat);

const PolicyUpdateModal = ({
                             open,
                             changePolicyFormData,
                             changePolicyFormTime,
                             cancel,
                             submit,
                             addPolicyFee,
                             // removePolicyFee,
                             fetchPolicyById, policyById
                           }: PolicyCreateModalProps) => {
  const [newPolicyForm, setNewPolicyForm] = useState<IUpdatePolicy>(newPolicyFormInitialState);
  const { insurances, fetchInsurances } = getInsuranceFunctions();

  const {
    isPolicyFeeCreateModalOpen, openPolicyFeeModal, closePolicyFeeModal,
    changePolicyFeeFormTime, changePolicyFeeFormData
  } = getPolicyFeeFunctions();

  const submissionWithTouchedValidation = () => {
    const touchedFields: { [k: string]: Partial<IUpdatePolicy>[keyof Partial<IUpdatePolicy>] } = {};

    for (const key in newPolicyForm) {
      const typedKey = key as keyof IUpdatePolicy;

      const originalValue = key === 'insuranceId'
        ? policyById.insurance._id
        : policyById[key as keyof IPolicy];

      if (newPolicyForm[typedKey] !== originalValue) {
        touchedFields[typedKey] = newPolicyForm[typedKey];
      }
    }

    submit(touchedFields, setNewPolicyForm);
  }

  const openPolicyFeeModalButton = <div className='policy_update_modal_footer'>
    <Button className='policy_update_modal_footer_fee'
            onClick={openPolicyFeeModal}>Create fee for this
      policy</Button>
    <Button className='policy_update_modal_footer_cancel' onClick={cancel}>Cancel</Button>
    <Button className='policy_update_modal_footer_submit'
            onClick={submissionWithTouchedValidation}>Update
      policy</Button>
  </div>

  useEffect(() => {
    if (open) {
      fetchInsurances();
      fetchPolicyById();
    }
  }, [open]);

  useEffect(() => {
    const { insurance, ...updatePolicyFormData } = policyById;
    setNewPolicyForm({
      ...updatePolicyFormData,
      insuranceId: insurance._id
    });
  }, [policyById]);

  const selectionFormedInsurance = useMemo(() => {
    return insurances.map(insurance => {
      return { label: insurance.name, value: insurance._id }
    })
  }, [insurances]);

  const taxesAndFees = useMemo(() => newPolicyForm.fees.reduce((acc, item) => Number(item.amount) + acc, 0), [newPolicyForm.fees]);

  const timelineOptions = useMemo(() => {
    let premiumPrice = newPolicyForm.premiumPrice; // 8k
    let installmentCountForDeposit = +newPolicyForm.installmentCount; // 7

    const effectiveDate = dayjs(newPolicyForm.effectiveDate);
    const installmentArray: { [k: number]: TimelineItemProps } = {};

    if (+newPolicyForm.installmentCount <= 1) {
      installmentArray[0] = {
        label: effectiveDate.set('month', effectiveDate.get('month') + 1).format('Do MMMM, YYYY'),
        children: `$ ${premiumPrice}`
      }

      return [installmentArray[0]];
    }

    let i = newPolicyForm.deposit ? 1 : 0;

    if (newPolicyForm.deposit) {
      installmentArray[0] = {
        label: dayjs(newPolicyForm.effectiveDate).format('Do MMMM, YYYY'),
        children: `$ ${newPolicyForm.deposit}`
      }

      premiumPrice -= newPolicyForm.deposit;
      installmentCountForDeposit -= 1;
    }

    for (i; i < +newPolicyForm.installmentCount; i++) {
      const dueDate = dayjs(effectiveDate).add(i, 'month').startOf('day');

      const matchingFees = newPolicyForm.fees.filter(fee => {
        return Math.abs(dayjs(fee.dueDate).diff(dueDate, 'day')) <= 7;
      });

      const matchingFeesSum = matchingFees.reduce((acc, item) => acc + Number(item.amount), 0);
      const feesWarningText = matchingFees.length ? `(${matchingFees[0].type} fee: $ ${matchingFeesSum})` : ''

      installmentArray[i] = {
        label: effectiveDate.set('month', effectiveDate.get('month') + i).format('Do MMMM, YYYY'),
        children: `$ ${newPolicyForm.monthlyPayment ? newPolicyForm.monthlyPayment : premiumPrice / installmentCountForDeposit} ${feesWarningText}`
      }

      if (matchingFees.length) {
        installmentArray[i].dot = <ClockCircleOutlined/>;
        installmentArray[i].color = 'red';
      }
    }

    if (newPolicyForm.monthlyPayment) {
      const lastDueDate = dayjs(effectiveDate).add(+newPolicyForm.installmentCount - 1, 'month').startOf('day');

      const matchingFees = newPolicyForm.fees.filter(fee => {
        return Math.abs(dayjs(fee.dueDate).diff(lastDueDate, 'day')) <= 7;
      });
      const matchingFeesSum = matchingFees.reduce((acc, item) => acc + Number(item.amount), 0);
      const feesWarningText = matchingFees.length ? `(${matchingFees[0].type} fee: $ ${matchingFeesSum})` : ''

      const lastPaymentPrice = premiumPrice - (+newPolicyForm.installmentCount - (newPolicyForm.deposit ? 2 : 1)) * newPolicyForm.monthlyPayment;
      installmentArray[+newPolicyForm.installmentCount - 1].children = `$ ${lastPaymentPrice} ${feesWarningText}`;
    }

    return Object.values(installmentArray)
  }, [newPolicyForm.installmentCount, newPolicyForm.premiumPrice, newPolicyForm.effectiveDate, newPolicyForm.deposit, newPolicyForm.monthlyPayment, newPolicyForm.fees])

  return <>
    <Modal width={800} footer={openPolicyFeeModalButton} onCancel={cancel} open={open}>
      <div className='policy_update_modal'>
        <div className='policy_update_modal_container'>
          <div className='policy_update_modal_information'>
            <Selector label='Insurance company' value={newPolicyForm.insuranceId}
                      onChange={changePolicyFormData('insuranceId', setNewPolicyForm)}
                      options={selectionFormedInsurance}/>
            <div className='policy_update_modal_information_horizontal'>
              <Selector label='Type' value={newPolicyForm.type}
                        onChange={changePolicyFormData('type', setNewPolicyForm)}/>
              <Selector label='Status' value={newPolicyForm.status}
                        onChange={changePolicyFormData('status', setNewPolicyForm)}/>
            </div>
            <Divider/>
            <div className='policy_update_modal_information_vertical'>
              <Radio label='Policy terms (months)' block optionType='button' value={newPolicyForm.policyTerm}
                     onChange={changePolicyFormData('policyTerm', setNewPolicyForm)} buttonStyle='solid' options={[
                { label: '3', value: '3' },
                { label: '6', value: '6' },
                { label: '12', value: '12' },
                { label: '24', value: '24' },
              ]}/>
              <Selector label='Installment count' value={newPolicyForm.installmentCount}
                        onChange={changePolicyFormData('installmentCount', setNewPolicyForm)} options={[
                { label: '1', value: '1' },
                { label: '2', value: '2' },
                { label: '3', value: '3' },
                { label: '4', value: '4' },
                { label: '5', value: '5' },
                { label: '6', value: '6' },
                { label: '7', value: '7' },
                { label: '8', value: '8' },
                { label: '9', value: '9' },
                { label: '10', value: '10' },
                { label: '11', value: '11' },
                { label: '12', value: '12' },
              ]}/>
            </div>
            <Divider/>
            <div className='policy_update_modal_information_horizontal'>
              <Date label='Effective date' allowClear={false}
                    value={newPolicyForm.effectiveDate ? dayjs(newPolicyForm.effectiveDate) : null}
                    onChange={changePolicyFormTime('effectiveDate', setNewPolicyForm)}/>
              <Date label='Expiration date' disabled
                    value={newPolicyForm.expirationDate ? dayjs(newPolicyForm.expirationDate) : undefined}/>
            </div>
            <div className='policy_update_modal_information_vertical'>
              <Input label='Policy number' placeholder='Ex. C813P05' value={newPolicyForm.policyNumber}
                     onChange={changePolicyFormData('policyNumber', setNewPolicyForm)}/>
              <Input label='Premium' addonBefore='$' value={newPolicyForm.premiumPrice}
                     onChange={changePolicyFormData('premiumPrice', setNewPolicyForm)}/>
            </div>
            <div className='policy_update_modal_information_horizontal'>
              <Input label='Deposit' addonBefore='$' value={newPolicyForm.deposit}
                     onChange={changePolicyFormData('deposit', setNewPolicyForm)}/>
              <Input label='Monthly payment' addonBefore='$' value={newPolicyForm.monthlyPayment}
                     onChange={changePolicyFormData('monthlyPayment', setNewPolicyForm)}/>
            </div>
          </div>
          <div className='policy_update_modal_installment'>
            <div className='policy_update_modal_installment_graph'>
              <label className='policy_update_modal_installment_label'>Installments
                for {newPolicyForm.installmentCount} pays</label>
              {newPolicyForm.installmentCount && newPolicyForm.effectiveDate && newPolicyForm.premiumPrice ?
                <Timeline items={timelineOptions}/> : undefined}
            </div>
            <div className='policy_update_modal_installment_footer'>
              <div>
                <p>Premiums: </p>
                <p>Tax and Fees: </p>
                <p>Total Policy Cost: </p>
              </div>
              <div>
                <p>$ {newPolicyForm.premiumPrice}</p>
                <p>$ {taxesAndFees}</p>
                <p>$ {Number(newPolicyForm.premiumPrice) + taxesAndFees}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
    <PolicyFeeCreateModal open={isPolicyFeeCreateModalOpen} cancel={closePolicyFeeModal}
                          submit={(value) => addPolicyFee(value, setNewPolicyForm)}
                          formChange={changePolicyFeeFormData} dateChange={changePolicyFeeFormTime}/>
  </>
}

export default PolicyUpdateModal;
