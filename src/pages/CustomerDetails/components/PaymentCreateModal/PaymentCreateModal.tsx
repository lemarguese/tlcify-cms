import './PaymentCreateModal.scss';

import Modal from "@/components/Modal/Modal.tsx";
import type { IPaymentCreate } from "@/types/transactions/main.ts";
import { useMemo, useState } from "react";
import type { ChangeEvent } from 'react'
import { newPaymentFormInitialState, paymentTypeRadioOptions } from "@/pages/CustomerDetails/utils/policy.tsx";
import Input from "@/components/Input/Input.tsx";
import Radio from "@/components/Radio/Radio.tsx";
import type { RadioChangeEvent } from "antd";
import Date from "@/components/Date/Date.tsx";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";

interface PaymentCreateModalProps {
  open: boolean;
  submit: (form: IPaymentCreate) => void;
  cancel: () => void;
}

const PaymentCreateModal = ({ open, cancel, submit }: PaymentCreateModalProps) => {
  const [newPaymentForm, setNewPaymentForm] = useState<IPaymentCreate>(newPaymentFormInitialState);

  const changeRadios = (value: RadioChangeEvent) => {
    setNewPaymentForm(prev => ({
      ...prev,
      method: value.target.value
    }))
  }

  const changeInputFields = (key: keyof IPaymentCreate) => {
    return (value: ChangeEvent<HTMLInputElement>) => {
      setNewPaymentForm(prev => ({
        ...prev,
        [key]: value.target.value
      }))
    }
  }

  const changeTime = (value: Dayjs) => {
    setNewPaymentForm(prev => ({
      ...prev,
      paidAt: value.toDate()
    }))
  }

  const submitValid = useMemo(() => {
    const validation = {
      methodValid: !!newPaymentForm.method,
      totalPaidValid: !!newPaymentForm.totalPaid,
      paidAtValid: !!newPaymentForm.paidAt
    }

    return Object.values(validation).every(el => el);
  }, [newPaymentForm.method, newPaymentForm.totalPaid, newPaymentForm.paidAt])

  return <Modal open={open} onCancel={cancel} okText='Submit' okButtonProps={{ disabled: !submitValid }}
                onOk={() => submit(newPaymentForm)}>
    <div className='payment_create_modal'>
      <Radio label='Payment method' value={newPaymentForm.method} onChange={changeRadios}
             options={paymentTypeRadioOptions} block
             optionType='button' buttonStyle='solid'/>
      <Date label='Paid Date' required allowClear={false}
            value={newPaymentForm.paidAt ? dayjs(newPaymentForm.paidAt) : null}
            onChange={changeTime}/>
      <div className='payment_create_modal_horizontal'>
        <Input label='Payment amount' addonBefore={'$'} value={newPaymentForm.totalPaid}
               onChange={changeInputFields('totalPaid')} required/>
        <Input label='Discount amount' addonBefore={'$'} value={newPaymentForm.discountAmount}
               onChange={changeInputFields('discountAmount')}/>
      </div>
      <Input label='Notes' value={newPaymentForm.notes} onChange={changeInputFields('notes')}/>
    </div>
  </Modal>
}

export default PaymentCreateModal;
