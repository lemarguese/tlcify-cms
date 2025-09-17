import './PaymentVoidModal.scss';

import Modal from "@/components/Modal/Modal.tsx";

interface PaymentVoidModalProps {
  open: boolean;
  submit: () => void;
  cancel: () => void;
}

const PaymentVoidModal = ({ open, cancel, submit }: PaymentVoidModalProps) => {
  return <Modal open={open} onOk={submit} onCancel={cancel}>
    <div className='payment_void_modal'>
      <p className='payment_void_modal_title'>You're about to void the payment.</p>
      <p className='payment_void_modal_description'>This may affect related invoices, client records, or audit history.
        Proceed only if you're certain.</p>
    </div>
  </Modal>
}

export default PaymentVoidModal;
