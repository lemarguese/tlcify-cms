import './InvoiceCreateModal.scss';

import Modal from "@/components/Modal/Modal.tsx";

interface InvoiceCreateModalProps {
  open: boolean;
  submit: () => void;
  cancel: () => void;
}

const InvoiceCreateModal = ({ open, cancel, submit }: InvoiceCreateModalProps) => {
  return <Modal open={open} okText='Send invoice' onOk={submit} onCancel={cancel}>
    <div className='invoice_create_modal'>
      <h4 className='invoice_create_modal_title'>Confirm Invoice Creation</h4>
      <p className='invoice_create_modal_description'>Once this invoice is sent, it cannot be updated, deleted, or
        undone. Please review all details
        carefully before confirming.</p>
    </div>
  </Modal>
}

export default InvoiceCreateModal;
