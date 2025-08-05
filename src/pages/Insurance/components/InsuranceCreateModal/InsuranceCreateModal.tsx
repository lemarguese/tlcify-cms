import './InsuranceCreateModal.scss';

import type { IInsuranceCreate } from "@/types/insurance/main.ts";

import type { Dispatch, SetStateAction, BaseSyntheticEvent } from "react";
import { useState } from "react";

import { newInsuranceFormInitialState } from "@/pages/Insurance/utils/insurance.tsx";

import Modal from '@/components/Modal/Modal.tsx';
import Input from "@/components/Input/Input.tsx";

interface InsuranceCreateModalProps {
  open: boolean;
  cancel: () => void;
  submit: (value: IInsuranceCreate, resetForm: Dispatch<SetStateAction<IInsuranceCreate>>) => void;
  formChange: (val: keyof IInsuranceCreate, callback: Dispatch<SetStateAction<IInsuranceCreate>>) => (val: BaseSyntheticEvent) => void;
}

const InsuranceCreateModal = ({ open, cancel, submit, formChange }: InsuranceCreateModalProps) => {
  const [newInsuranceForm, setNewInsuranceForm] = useState<IInsuranceCreate>(newInsuranceFormInitialState)

  return <Modal open={open} onCancel={cancel} onOk={() => submit(newInsuranceForm, setNewInsuranceForm)}>
    <div className='insurance_create_modal'>
      <Input label='Carrier name' placeholder='Ex. American Express Company' onChange={formChange('name', setNewInsuranceForm)}/>
      <div className='insurance_create_modal_horizontal'>
        <Input label='NAIC Code' placeholder='Ex. C901324' onChange={formChange('naicCode', setNewInsuranceForm)}/>
        <Input label='Commission Fee' addonBefore='%' onChange={formChange('commissionFee', setNewInsuranceForm)}/>
        <Input label='Broker Code' placeholder='Ex. SAM38' onChange={formChange('brokerCode', setNewInsuranceForm)}/>
      </div>
    </div>
  </Modal>
}

export default InsuranceCreateModal;
