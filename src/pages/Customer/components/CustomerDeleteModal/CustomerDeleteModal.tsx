import './CustomerDeleteModal.scss';

import Modal from "@/components/Modal/Modal.tsx";

interface CustomerDeleteModalProps {
  open: boolean;
  cancel: () => void;
  submit: () => void;
}

const CustomerDeleteModal = ({ open, cancel, submit }: CustomerDeleteModalProps) => {
  return <Modal open={open} onCancel={cancel} onOk={submit}>
    <div className='customer_delete_modal'>
      <p className='customer_delete_modal_title'>You're about to permanently delete a customer.</p>
      <p className='customer_delete_modal_description'>This may affect related invoices, client records, or audit
        history.
        Proceed only if you're certain.</p>
    </div>
  </Modal>
}

export default CustomerDeleteModal;
