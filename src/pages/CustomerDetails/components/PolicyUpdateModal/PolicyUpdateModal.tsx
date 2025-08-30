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
  submit: (value: Partial<IUpdatePolicy>, resetForm: Dispatch<SetStateAction<IUpdatePolicy>>) => void;
  changePolicyFormTime: (val: keyof Pick<IUpdatePolicy, 'effectiveDate' | 'customEffectiveDate'>, callback: Dispatch<SetStateAction<IUpdatePolicy>>) => (val: Dayjs) => void;
  changePolicyFormData: (val: keyof Omit<IUpdatePolicy, 'expirationDate' | 'effectiveDate' | 'customEffectiveDate'>, callback: Dispatch<SetStateAction<IUpdatePolicy>>) => (val: BaseSyntheticEvent | RadioChangeEvent | string) => void;
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

    if (newPolicyForm.fees.length !== policyById.fees.length) touchedFields.fees = newPolicyForm.fees;

    for (let i = 0; 9 < policyById.fees.length; i++) {
      if (newPolicyForm.fees[i]._id !== policyById.fees[i]._id) touchedFields.fees = newPolicyForm.fees;
    }

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

  const validAndTouchedForm = useMemo(() => {
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

    const touchedOptions = {
      insuranceCompanyTouched: newPolicyForm.insuranceId.localeCompare(policyById.insurance._id) !== 0,
      policyTypeTouched: newPolicyForm.type.localeCompare(policyById.type) !== 0,
      policyStatusTouched: newPolicyForm.status.localeCompare(policyById.status) !== 0,
      policyTermsTouched: newPolicyForm.policyTerm.localeCompare(policyById.policyTerm) !== 0,
      policyInstallmentCountTouched: Number(newPolicyForm.installmentCount) !== policyById.installmentCount,
      effectiveDateTouched: (newPolicyForm.effectiveDate ?? '').valueOf() !== (policyById.effectiveDate ?? '').valueOf(),
      customEffectiveDateTouched: (newPolicyForm.customEffectiveDate ?? '').valueOf() !== (policyById.customEffectiveDate ?? '').valueOf(),
      policyNumberTouched: newPolicyForm.policyNumber.localeCompare(policyById.policyNumber) !== 0,
      policyPremiumDepositTouched: Number(newPolicyForm.deposit) !== policyById.deposit,
      policyPremiumPriceTouched: Number(newPolicyForm.premiumPrice) !== policyById.premiumPrice,
      policyFeesTouched: (() => {
        if (newPolicyForm.fees.length !== policyById.fees.length) return true;

        for (let i = 0; 9 < policyById.fees.length; i++) {
          if (newPolicyForm.fees[i]._id !== policyById.fees[i]._id) return true;
        }

        return false;
      })()
    }

    // if some of them touched, and it is filled (or valid)
    return Object.values(touchedOptions).some(el => el) && Object.values(options).every(el => el);
  }, [newPolicyForm, policyById]);

  const openPolicyFeeModalButton = <div className='policy_update_modal_footer'>
    <Button className='policy_update_modal_footer_fee'
            onClick={openPolicyFeeModal}>Create fee for this
      policy</Button>
    <Button className='policy_update_modal_footer_cancel' onClick={cancel}>Cancel</Button>
    <Button className='policy_update_modal_footer_submit' disabled={!validAndTouchedForm}
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
      premiumPrice,
      customEffectiveDate,
      deposit,
      fees,
      monthlyPayment,
      effectiveDate
    } = newPolicyForm;

    const premiumPriceNet = premiumPrice - deposit;

    const effectiveDateWrapped = dayjs(effectiveDate).startOf('day');
    const customEffectiveDateWrapper = dayjs(customEffectiveDate).startOf('day');

    const installmentArray: { [k: number]: TimelineItemProps } = {};

    let installmentAmount = 0;

    for (let index = 0; index < +installmentCount; index++) {
      const date = (index === 0 ? effectiveDateWrapped : customEffectiveDateWrapper);
      const dueDate = date.add(index, 'month');

      const matchingFees = fees.filter(fee => {
        return Math.abs(dayjs(fee.dueDate).diff(dueDate, 'day')) <= 14;
      });

      const matchingFeesSum = matchingFees.reduce((acc, item) => acc + Number(item.amount), 0);
      const feesWarningText = matchingFees.length ? `(${matchingFees[0].type} fee: $ ${matchingFeesSum})` : ''

      installmentAmount = premiumPriceNet / +installmentCount;

      if (+monthlyPayment) {
        if (index === +installmentCount - 1) installmentAmount = premiumPriceNet - (+installmentCount - 1) * +monthlyPayment;
        else installmentAmount = monthlyPayment;
      }

      installmentArray[index] = {
        label: date.add(index, 'month').format('Do MMMM, YYYY'),
        children: `$ ${installmentAmount} ${feesWarningText}`
      }

      if (matchingFees.length) {
        installmentArray[index].dot = <ClockCircleOutlined/>;
        installmentArray[index].color = 'red';
      }
    }

    return Object.values(installmentArray)
  }, [newPolicyForm])

  return <>
    <Modal width={800} footer={openPolicyFeeModalButton} onCancel={cancel} open={open}>
      <div className='policy_update_modal'>
        <div className='policy_update_modal_container'>
          <div className='policy_update_modal_information'>
            <Selector label='Insurance company' value={newPolicyForm.insuranceId}
                      onChange={changePolicyFormData('insuranceId', setNewPolicyForm)} required
                      options={selectionFormedInsurance}/>
            <div className='policy_update_modal_information_horizontal'>
              <Selector label='Type' value={newPolicyForm.type} required options={policyTypeSelectionOptions}
                        onChange={changePolicyFormData('type', setNewPolicyForm)}/>
              <Selector label='Status' value={newPolicyForm.status} required options={policyStatusSelectionOptions}
                        onChange={changePolicyFormData('status', setNewPolicyForm)}/>
            </div>
            <Divider/>
            <div className='policy_update_modal_information_vertical'>
              <Radio label='Policy terms (months)' defaultValue='3' block optionType='button'
                     value={newPolicyForm.policyTerm}
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
            <div className='policy_update_modal_information_horizontal'>
              <Date label='Effective date' allowClear={false} required
                    value={newPolicyForm.effectiveDate ? dayjs(newPolicyForm.effectiveDate) : null}
                    onChange={changePolicyFormTime('effectiveDate', setNewPolicyForm)}/>
              <Date label='Expiration date' disabled
                    value={newPolicyForm.expirationDate ? dayjs(newPolicyForm.expirationDate) : undefined}/>
            </div>
            <div className='policy_update_modal_information_horizontal'>
              <Input label='Policy number' placeholder='Ex. C813P05' required value={newPolicyForm.policyNumber}
                     onChange={changePolicyFormData('policyNumber', setNewPolicyForm)}/>
              <Date label='Custom Effective date'
                    onChange={changePolicyFormTime('customEffectiveDate', setNewPolicyForm)}
                    value={newPolicyForm.customEffectiveDate ? dayjs(newPolicyForm.customEffectiveDate) : null}/>
            </div>
            <div className='policy_update_modal_information_horizontal'>
              <Input label='Premium' addonBefore='$' required value={newPolicyForm.premiumPrice}
                     onChange={changePolicyFormData('premiumPrice', setNewPolicyForm)}/>
            </div>
            <div className='policy_update_modal_information_horizontal'>
              <Input label='Deposit' addonBefore='$' value={newPolicyForm.deposit}
                     onChange={changePolicyFormData('deposit', setNewPolicyForm)}/>
              <Input label='Monthly payment' addonBefore='$' disabled={+newPolicyForm.installmentCount <= 1}
                     value={newPolicyForm.monthlyPayment}
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

export default PolicyUpdateModal;
