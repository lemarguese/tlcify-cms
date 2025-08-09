import './PolicyFeeCreateModal.scss';

import { useMemo, useState } from "react";
import type { Dispatch, SetStateAction, BaseSyntheticEvent } from "react";

import { feeTypeOptions, newPolicyFeeFormInitialState } from "@/pages/CustomerDetails/utils/fee.tsx";
import type { IPolicyFeeCreate } from "@/types/policy/main.ts";

import Input from "@/components/Input/Input.tsx";
import Selector from "@/components/Selector/Selector.tsx";
import Date from "@/components/Date/Date.tsx";
import dayjs, { Dayjs } from "dayjs";

import Modal from '@/components/Modal/Modal.tsx';

interface PolicyFeeCreateModalProps {
  open: boolean;
  cancel: () => void;
  submit: (value: IPolicyFeeCreate) => void;
  dateChange: (val: keyof Pick<IPolicyFeeCreate, 'dueDate'>, callback: Dispatch<SetStateAction<IPolicyFeeCreate>>) => (val: Dayjs) => void;
  formChange: (val: keyof Omit<IPolicyFeeCreate, 'dueDate'>, callback: Dispatch<SetStateAction<IPolicyFeeCreate>>) => (val: BaseSyntheticEvent | string) => void;
}

const PolicyFeeCreateModal = ({ open, cancel, submit, formChange, dateChange }: PolicyFeeCreateModalProps) => {
  const [newPolicyFeeForm, setNewPolicyFeeForm] = useState<IPolicyFeeCreate>(newPolicyFeeFormInitialState);

  const submitPolicyFee = () => {
    submit(newPolicyFeeForm);
    setNewPolicyFeeForm(newPolicyFeeFormInitialState);
    cancel();
  }

  const validForm = useMemo(() => {
    const options = {
      feeTypeValid: !!newPolicyFeeForm.type,
      dueDateValid: !!newPolicyFeeForm.dueDate,
      feeAmountValid: !!newPolicyFeeForm.amount,
    };

    return Object.values(options).every(el => el);
  }, [newPolicyFeeForm]);

  return <Modal open={open} onOk={submitPolicyFee} okButtonProps={{ disabled: !validForm }} onCancel={cancel}>
    <div className='policy_fee_craete_modal'>
      <div className='policy_fee_craete_modal_vertical'>
        <Selector label='Policy Fee Type' required value={newPolicyFeeForm.type} options={feeTypeOptions}
                  onChange={formChange('type', setNewPolicyFeeForm)}/>
        <div className='policy_fee_craete_modal_horizontal'>
          <Date label='Policy fee due date' allowClear={false} required
                value={newPolicyFeeForm.dueDate ? dayjs(newPolicyFeeForm.dueDate) : undefined}
                onChange={dateChange('dueDate', setNewPolicyFeeForm)}/>
          <Input label='Policy fee amount' addonBefore='$' required value={newPolicyFeeForm.amount}
                 onChange={formChange('amount', setNewPolicyFeeForm)}/>
        </div>
      </div>
    </div>
  </Modal>
}

export default PolicyFeeCreateModal;
