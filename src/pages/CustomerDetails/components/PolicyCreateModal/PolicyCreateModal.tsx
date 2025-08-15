import './PolicyCreateModal.scss';

import { Divider } from "antd";
import type { RadioChangeEvent, TimelineItemProps } from 'antd';
import Selector from "@/components/Selector/Selector.tsx";
import Date from "@/components/Date/Date.tsx";
import Input from "@/components/Input/Input.tsx";
import Timeline from "@/components/Timeline/Timeline.tsx";
import Radio from "@/components/Radio/Radio.tsx";
import { useEffect, useMemo, useState } from "react";
import type { BaseSyntheticEvent, Dispatch, SetStateAction } from 'react';

import type { IPolicyCreate, IPolicyFeeCreate } from "@/types/policy/main.ts";
import dayjs, { Dayjs } from "dayjs";
import advancedFormat from 'dayjs/plugin/advancedFormat';
import {
  newPolicyFormInitialState,
  policyStatusSelectionOptions,
  policyTypeSelectionOptions
} from "@/pages/CustomerDetails/utils/policy.tsx";
import { getInsuranceFunctions } from "@/pages/Insurance/utils/insurance.tsx";
import PolicyFeeCreateModal from "@/pages/CustomerDetails/components/PolicyFeeCreateModal/PolicyFeeCreateModal.tsx";
import { getPolicyFeeFunctions } from "@/pages/CustomerDetails/utils/fee.tsx";
import Button from "@/components/Button/Button.tsx";
import Modal from "@/components/Modal/Modal.tsx";

import { ClockCircleOutlined } from "@ant-design/icons";

interface PolicyCreateModalProps {
  open: boolean;
  cancel: () => void;
  submit: (value: IPolicyCreate, resetForm: Dispatch<SetStateAction<IPolicyCreate>>) => void;
  changePolicyFormTime: (val: keyof Pick<IPolicyCreate, 'effectiveDate'>, callback: Dispatch<SetStateAction<IPolicyCreate>>) => (val: Dayjs) => void;
  changePolicyFormData: (val: keyof Omit<IPolicyCreate, 'expirationDate' | 'effectiveDate'>, callback: Dispatch<SetStateAction<IPolicyCreate>>) => (val: BaseSyntheticEvent | RadioChangeEvent | string) => void;
  addPolicyFee: (value: IPolicyFeeCreate, callback: Dispatch<SetStateAction<IPolicyCreate>>) => void;
  removePolicyFee: (value: number, callback: Dispatch<SetStateAction<IPolicyCreate>>) => void;
}

dayjs.extend(advancedFormat);

const PolicyCreateModal = ({
                             open,
                             changePolicyFormData,
                             changePolicyFormTime,
                             cancel,
                             submit,
                             addPolicyFee,
                             // removePolicyFee
                           }: PolicyCreateModalProps) => {
  const [newPolicyForm, setNewPolicyForm] = useState<IPolicyCreate>(newPolicyFormInitialState);
  const { insurances, fetchInsurances } = getInsuranceFunctions();

  const {
    isPolicyFeeCreateModalOpen, openPolicyFeeModal, closePolicyFeeModal,
    changePolicyFeeFormTime, changePolicyFeeFormData
  } = getPolicyFeeFunctions();

  useEffect(() => {
    if (open) fetchInsurances();
  }, [open]);

  const selectionFormedInsurance = useMemo(() => {
    return insurances.map(insurance => {
      return { label: insurance.name, value: insurance._id }
    })
  }, [insurances]);

  const { policyFees, feesWithInsurance } = useMemo(() => {
    const insurance = insurances.find(ins => ins._id === newPolicyForm.insuranceId);
    const insuranceFee = insurance ? insurance.commissionFee : 0;
    const feesWithInsurance = +newPolicyForm.premiumPrice * insuranceFee / 100;

    const policyFees = newPolicyForm.fees.reduce((acc, item) => Number(item.amount) + acc, 0)

    return {
      policyFees,
      feesWithInsurance
    };
  }, [newPolicyForm.fees, insurances, newPolicyForm.insuranceId, newPolicyForm.premiumPrice]);

  const timelineOptions = useMemo(() => {
    let premiumPrice = +newPolicyForm.premiumPrice; // 8k
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

    let i = +newPolicyForm.deposit ? 1 : 0;

    if (+newPolicyForm.deposit) {
      installmentArray[0] = {
        label: dayjs(newPolicyForm.effectiveDate).format('Do MMMM, YYYY'),
        children: `$ ${newPolicyForm.deposit}`
      }

      premiumPrice -= +newPolicyForm.deposit;
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
        children: `$ ${+newPolicyForm.monthlyPayment ? +newPolicyForm.monthlyPayment : premiumPrice / installmentCountForDeposit} ${feesWarningText}`
      }

      if (matchingFees.length) {
        installmentArray[i].dot = <ClockCircleOutlined/>;
        installmentArray[i].color = 'red';
      }
    }

    if (+newPolicyForm.monthlyPayment) {
      const lastDueDate = dayjs(effectiveDate).add(+newPolicyForm.installmentCount - 1, 'month').startOf('day');

      const matchingFees = newPolicyForm.fees.filter(fee => {
        return Math.abs(dayjs(fee.dueDate).diff(lastDueDate, 'day')) <= 7;
      });
      const matchingFeesSum = matchingFees.reduce((acc, item) => acc + Number(item.amount), 0);
      const feesWarningText = matchingFees.length ? `(${matchingFees[0].type} fee: $ ${matchingFeesSum})` : ''

      const lastPaymentPrice = premiumPrice - (+newPolicyForm.installmentCount - (+newPolicyForm.deposit ? 2 : 1)) * newPolicyForm.monthlyPayment;
      installmentArray[+newPolicyForm.installmentCount - 1].children = `$ ${lastPaymentPrice} ${feesWarningText}`;
    }

    return Object.values(installmentArray)
  }, [newPolicyForm.installmentCount, newPolicyForm.premiumPrice, newPolicyForm.effectiveDate, newPolicyForm.deposit, newPolicyForm.monthlyPayment, newPolicyForm.fees, insurances, newPolicyForm.insuranceId])

  const validForm = useMemo(() => {
    const options = {
      insuranceCompanyValid: !!newPolicyForm.insuranceId,
      policyTypeValid: !!newPolicyForm.type,
      policyStatusValid: !!newPolicyForm.status,
      policyTermsValid: !!newPolicyForm.policyTerm,
      policyInstallmentCountValid: !!newPolicyForm.installmentCount,
      effectiveDateValid: !!newPolicyForm.effectiveDate,
      expirationDateValid: !!newPolicyForm.expirationDate,
      policyNumberValid: !!newPolicyForm.policyNumber.trim(),
      policyPremiumDepositValid: !!newPolicyForm.premiumPrice,
    };

    return Object.values(options).every(el => el);
  }, [newPolicyForm]);

  const openPolicyFeeModalButton = <div className='policy_create_modal_footer'>
    <Button className='policy_create_modal_footer_fee'
            onClick={openPolicyFeeModal}>Create fee for this
      policy</Button>
    <Button className='policy_create_modal_footer_cancel' onClick={cancel}>Cancel</Button>
    <Button className='policy_create_modal_footer_submit' disabled={!validForm}
            onClick={() => submit(newPolicyForm, setNewPolicyForm)}>Create
      policy</Button>
  </div>

  return <>
    <Modal width={800} footer={openPolicyFeeModalButton} onCancel={cancel}
           open={open}>
      <div className='policy_create_modal'>
        <div className='policy_create_modal_container'>
          <div className='policy_create_modal_information'>
            <Selector label='Insurance company' value={newPolicyForm.insuranceId} required
                      onChange={changePolicyFormData('insuranceId', setNewPolicyForm)}
                      options={selectionFormedInsurance}/>
            <div className='policy_create_modal_information_horizontal'>
              <Selector label='Type' value={newPolicyForm.type} required
                        options={policyTypeSelectionOptions}
                        onChange={changePolicyFormData('type', setNewPolicyForm)}/>
              <Selector label='Status' value={newPolicyForm.status} required
                        options={policyStatusSelectionOptions}
                        onChange={changePolicyFormData('status', setNewPolicyForm)}/>
            </div>
            <Divider/>
            <div className='policy_create_modal_information_vertical'>
              <Radio label='Policy terms (months)' block optionType='button'
                     value={newPolicyForm.policyTerm} defaultValue='3'
                     onChange={changePolicyFormData('policyTerm', setNewPolicyForm)} buttonStyle='solid' options={[
                { label: '3', value: '3' },
                { label: '6', value: '6' },
                { label: '12', value: '12' },
                { label: '24', value: '24' },
              ]}/>
              <Selector label='Installment count' value={newPolicyForm.installmentCount} required
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
            <div className='policy_create_modal_information_horizontal'>
              <Date label='Effective date' allowClear={false} required
                    value={newPolicyForm.effectiveDate ? dayjs(newPolicyForm.effectiveDate) : null}
                    onChange={changePolicyFormTime('effectiveDate', setNewPolicyForm)}/>
              <Date label='Expiration date' disabled
                    value={newPolicyForm.expirationDate ? dayjs(newPolicyForm.expirationDate) : undefined}/>
            </div>
            <div className='policy_create_modal_information_vertical'>
              <Input label='Policy number' placeholder='Ex. C813P05' required value={newPolicyForm.policyNumber}
                     onChange={changePolicyFormData('policyNumber', setNewPolicyForm)}/>
              <Input label='Premium' addonBefore='$' required value={newPolicyForm.premiumPrice}
                     onChange={changePolicyFormData('premiumPrice', setNewPolicyForm)}/>
            </div>
            <div className='policy_create_modal_information_horizontal'>
              <Input label='Deposit' addonBefore='$' value={newPolicyForm.deposit}
                     onChange={changePolicyFormData('deposit', setNewPolicyForm)}/>
              <Input label='Monthly payment' addonBefore='$' value={newPolicyForm.monthlyPayment}
                     onChange={changePolicyFormData('monthlyPayment', setNewPolicyForm)}/>
            </div>
          </div>
          <div className='policy_create_modal_installment'>
            <div className='policy_create_modal_installment_graph'>
              <label className='policy_create_modal_installment_label'>Installments
                for {newPolicyForm.installmentCount} pays</label>
              {newPolicyForm.installmentCount && newPolicyForm.effectiveDate && newPolicyForm.premiumPrice ?
                <Timeline items={timelineOptions}/> : undefined}
            </div>
            <div className='policy_create_modal_installment_footer'>
              <div>
                <p>Premiums: </p>
                <p> Commission: </p>
                <p>Tax and Fees: </p>
                <p>Total Policy Cost: </p>
              </div>
              <div>
                <p>$ {newPolicyForm.premiumPrice}</p>
                <p>$ {feesWithInsurance}</p>
                <p>$ {policyFees}</p>
                <p>$ {Number(newPolicyForm.premiumPrice) + policyFees}</p>
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

export default PolicyCreateModal;
