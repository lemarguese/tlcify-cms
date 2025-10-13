import './PaymentTypeModal.scss';

import Modal from "@/components/Modal/Modal.tsx";
import type { Dispatch, SetStateAction } from "react";
import Selector from "@/components/Selector/Selector.tsx";

interface PaymentTypeModalProps {
  open: boolean;
  paymentType: 'ach' | 'card' | 'unselected';
  onChange: Dispatch<SetStateAction<'ach' | 'card' | 'unselected'>>,
  cancel: () => void;
}

const PaymentTypeModal = ({ open, cancel, onChange, paymentType }: PaymentTypeModalProps) => {
  return <Modal open={open} okButtonProps={{ disabled: paymentType === 'unselected' }} onOk={cancel} onCancel={cancel}>
    <div className='payment_type_modal'>
      <Selector label='Select payment type:' options={[
        { label: 'Unselected', value: 'unselected' },
        { label: 'Check', value: 'ach' },
        { label: 'Card', value: 'card' }
      ]} onChange={onChange} value={paymentType}/>
    </div>
  </Modal>
}

export default PaymentTypeModal;
