import './PolicyCreateModal.scss';
import { Divider, Modal } from "antd";
import type { RadioChangeEvent } from 'antd';
import Selector from "@/components/Selector/Selector.tsx";
import Date from "@/components/Date/Date.tsx";
import Input from "@/components/Input/Input.tsx";
import Timeline from "@/components/Timeline/Timeline.tsx";
import Radio from "@/components/Radio/Radio.tsx";
import { BaseSyntheticEvent, Dispatch, SetStateAction, useEffect, useMemo, useState } from "react";
import type { IPolicyCreate } from "@/types/policy/main.ts";
import dayjs, { Dayjs } from "dayjs";
import advancedFormat from 'dayjs/plugin/advancedFormat';
import { newPolicyFormInitialState } from "@/pages/CustomerDetails/utils/policy.tsx";
import { getInsuranceFunctions } from "@/pages/Insurance/utils/insurance.tsx";

interface PolicyCreateModalProps {
  open: boolean;
  cancel: () => void;
  submit: (value: IPolicyCreate, resetForm: Dispatch<SetStateAction<IPolicyCreate>>) => void;
  dateChange: (val: keyof Pick<IPolicyCreate, 'effectiveDate'>, callback: Dispatch<SetStateAction<IPolicyCreate>>) => (val: Dayjs) => void;
  formChange: (val: keyof Omit<IPolicyCreate, 'expirationDate' | 'effectiveDate'>, callback: Dispatch<SetStateAction<IPolicyCreate>>) => (val: BaseSyntheticEvent | RadioChangeEvent | string) => void;
}

dayjs.extend(advancedFormat);

const PolicyCreateModal = ({ open, formChange, dateChange, cancel, submit }: PolicyCreateModalProps) => {
  const [newPolicyForm, setNewPolicyForm] = useState<IPolicyCreate>(newPolicyFormInitialState);
  const { insurances, fetchInsurances } = getInsuranceFunctions();

  useEffect(() => {
    if (open) fetchInsurances();
  }, [open]);

  const selectionFormedInsurance = useMemo(() => {
    return insurances.map(insurance => {
      return { label: insurance.name, value: insurance._id }
    })
  }, [insurances])

  const timelineOptions = useMemo(() => {
    let premiumPrice = newPolicyForm.premiumPrice; // 8k
    let installmentCountForDeposit = +newPolicyForm.installmentCount; // 7

    const effectiveDate = dayjs(newPolicyForm.effectiveDate);
    const installmentArray: { [k: number]: { label: string, children: string } } = {};

    if (newPolicyForm.installmentCount <= 1) {
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

    for (i; i < newPolicyForm.installmentCount; i++) {
      installmentArray[i] = {
        label: effectiveDate.set('month', effectiveDate.get('month') + i).format('Do MMMM, YYYY'),
        children: `$ ${newPolicyForm.monthlyPayment ? newPolicyForm.monthlyPayment : premiumPrice / installmentCountForDeposit}`
      }
    }

    if (newPolicyForm.monthlyPayment) {
      const lastPaymentPrice = premiumPrice - (newPolicyForm.installmentCount - (newPolicyForm.deposit ? 2 : 1)) * newPolicyForm.monthlyPayment;
      installmentArray[newPolicyForm.installmentCount - 1].children = `$ ${lastPaymentPrice}`;
    }

    return Object.values(installmentArray)
  }, [newPolicyForm.installmentCount, newPolicyForm.premiumPrice, newPolicyForm.effectiveDate, newPolicyForm.deposit, newPolicyForm.monthlyPayment])

  return <Modal width={800} open={open} onCancel={cancel} onOk={() => submit(newPolicyForm, setNewPolicyForm)}>
    <div className='policy_create_modal'>
      <div className='policy_create_modal_container'>
        <div className='policy_create_modal_information'>
          <Selector label='Insurance company' value={newPolicyForm.insuranceId}
                    onChange={formChange('insuranceId', setNewPolicyForm)} options={selectionFormedInsurance}/>
          <div className='policy_create_modal_information_horizontal'>
            <Selector label='Type' value={newPolicyForm.type} onChange={formChange('type', setNewPolicyForm)}/>
            <Selector label='Status' value={newPolicyForm.status} onChange={formChange('status', setNewPolicyForm)}/>
          </div>
          <Divider/>
          <div className='policy_create_modal_information_vertical'>
            <Radio label='Policy terms (months)' block optionType='button' value={newPolicyForm.policyTerm}
                   onChange={formChange('policyTerm', setNewPolicyForm)} buttonStyle='solid' options={[
              { label: '3', value: '3' },
              { label: '6', value: '6' },
              { label: '12', value: '12' },
              { label: '24', value: '24' },
            ]}/>
            <Selector label='Installment count' value={newPolicyForm.installmentCount}
                      onChange={formChange('installmentCount', setNewPolicyForm)} options={[
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
            <Date label='Effective date' allowClear={false}
                  value={newPolicyForm.effectiveDate ? dayjs(newPolicyForm.effectiveDate) : null}
                  onChange={dateChange('effectiveDate', setNewPolicyForm)}/>
            <Date label='Expiration date' disabled
                  value={newPolicyForm.expirationDate ? dayjs(newPolicyForm.expirationDate) : undefined}/>
          </div>
          <div className='policy_create_modal_information_vertical'>
            <Input label='Policy number' placeholder='Ex. C813P05' value={newPolicyForm.policyNumber}
                   onChange={formChange('policyNumber', setNewPolicyForm)}/>
            <Input label='Premium' addonBefore='$' value={newPolicyForm.premiumPrice}
                   onChange={formChange('premiumPrice', setNewPolicyForm)}/>
          </div>
          <div className='policy_create_modal_information_horizontal'>
            <Input label='Deposit' addonBefore='$' value={newPolicyForm.deposit}
                   onChange={formChange('deposit', setNewPolicyForm)}/>
            <Input label='Monthly payment' addonBefore='$' value={newPolicyForm.monthlyPayment}
                   onChange={formChange('monthlyPayment', setNewPolicyForm)}/>
          </div>
        </div>
        <div className='policy_create_modal_installment'>
          <label className='policy_create_modal_installment_label'>Installments
            for {newPolicyForm.installmentCount} pays</label>
          {newPolicyForm.installmentCount && newPolicyForm.effectiveDate && newPolicyForm.premiumPrice ?
            <Timeline items={timelineOptions}/> : undefined}
        </div>
      </div>
    </div>
  </Modal>
}

export default PolicyCreateModal;
