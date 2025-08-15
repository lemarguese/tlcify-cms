import './PaymentTypeModal.scss';

import Modal from "@/components/Modal/Modal.tsx";
import type { Dispatch, SetStateAction } from "react";
import Selector from "@/components/Selector/Selector.tsx";

interface PaymentTypeModalProps {
  open: boolean;
  paymentType: 'check' | 'card' | 'unselected';
  onChange: Dispatch<SetStateAction<'check' | 'card' | 'unselected'>>,
  cancel: () => void;
}

const PaymentTypeModal = ({ open, cancel, onChange, paymentType }: PaymentTypeModalProps) => {
  return <Modal open={open} okButtonProps={{ disabled: paymentType === 'unselected' }} onOk={cancel} onCancel={cancel}>
    <div className='payment_type_modal'>
      <Selector label='Select payment type:' options={[
        { label: 'Unselected', value: 'unselected' },
        { label: 'Check', value: 'check' },
        { label: 'Card', value: 'card' }
      ]} onChange={onChange} value={paymentType}/>
    </div>
  </Modal>
}

export default PaymentTypeModal;
