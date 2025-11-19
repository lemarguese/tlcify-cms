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
  submit: (value: IPolicyCreate) => void;
  changePolicyFormTime: (val: keyof Pick<IPolicyCreate, 'effectiveDate' | 'customEffectiveDate'>, callback: Dispatch<SetStateAction<IPolicyCreate>>) => (val: Dayjs) => void;
  changePolicyFormData: (val: keyof Omit<IPolicyCreate, 'expirationDate' | 'effectiveDate' | 'customEffectiveDate'>, callback: Dispatch<SetStateAction<IPolicyCreate>>) => (val: BaseSyntheticEvent | RadioChangeEvent | string | number) => void;
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
    const {
      installmentCount,
      customEffectiveDate,
      premiumPrice,
      deposit,
      fees,
      monthlyPayment,
      effectiveDate
    } = newPolicyForm;
    const premiumPriceNet = premiumPrice - deposit;
    const installmentCountNet = installmentCount - (deposit ? 1 : 0);

    const effectiveDateWrapped = dayjs(effectiveDate).startOf('day');
    const customEffectiveDateWrapper = dayjs(customEffectiveDate).startOf('day');
    const installmentArray: { [k: number]: TimelineItemProps } = {};

    let installmentAmount = 0;

    for (let index = 0; index < +installmentCount; index++) {
      const date = index === 0 ? effectiveDateWrapped : customEffectiveDate ? customEffectiveDateWrapper : effectiveDateWrapped;
      const dueDate = date.add(index, 'month');

      const matchingFees = fees.filter(fee => {
        return Math.abs(dayjs(fee.dueDate).diff(dueDate, 'day')) <= 14;
      });

      const matchingFeesSum = matchingFees.reduce((acc, item) => acc + Number(item.amount), 0);
      const feesWarningText = matchingFees.length ? `(${matchingFees[0].type} fee: $ ${matchingFeesSum})` : ''

      installmentAmount = premiumPriceNet / installmentCountNet;

      if (monthlyPayment) {
        if (index === installmentCount - 1) installmentAmount = premiumPriceNet - (installmentCountNet - 1) * monthlyPayment;
        else installmentAmount = monthlyPayment;
      }

      if (!!deposit && index === 0) installmentAmount = deposit;

      installmentArray[index] = {
        label: date.add(index, 'month').format('Do MMMM, YYYY'),
        children: `$ ${installmentAmount.toFixed(2)} ${feesWarningText}`
      }

      if (matchingFees.length) {
        installmentArray[index].dot = <ClockCircleOutlined/>;
        installmentArray[index].color = 'red';
      }
    }

    return Object.values(installmentArray)
  }, [newPolicyForm])

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
            onClick={() => submit(newPolicyForm)}>Create
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
              <Radio label='Policy terms (months)' block optionType='button' buttonStyle='solid'
                     value={newPolicyForm.policyTerm} defaultValue='3'
                     onChange={changePolicyFormData('policyTerm', setNewPolicyForm)} options={[
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
                    value={newPolicyForm.expirationDate ? dayjs(newPolicyForm.expirationDate) : null}/>
            </div>
            <div className='policy_create_modal_information_horizontal'>
              <Input label='Policy number' placeholder='Ex. C813P05' required value={newPolicyForm.policyNumber}
                     onChange={changePolicyFormData('policyNumber', setNewPolicyForm)}/>
              <Date label='Custom Due Date'
                    onChange={changePolicyFormTime('customEffectiveDate', setNewPolicyForm)}
                    value={newPolicyForm.customEffectiveDate ? dayjs(newPolicyForm.customEffectiveDate) : null}/>
            </div>
            <div className='policy_create_modal_information_vertical'>
              <Input type='number' label='Premium' addonBefore='$' required value={newPolicyForm.premiumPrice}
                     onChange={changePolicyFormData('premiumPrice', setNewPolicyForm)}/>
            </div>
            <div className='policy_create_modal_information_horizontal'>
              <Input type='number' label='Deposit' addonBefore='$' value={newPolicyForm.deposit}
                     onChange={changePolicyFormData('deposit', setNewPolicyForm)}/>
              <Input type='number' label='Monthly payment' addonBefore='$' disabled={+newPolicyForm.installmentCount <= 1}
                     value={newPolicyForm.monthlyPayment}
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
                <p>Commission: </p>
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
