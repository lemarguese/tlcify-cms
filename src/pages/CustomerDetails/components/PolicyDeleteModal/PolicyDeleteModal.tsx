import './PolicyDeleteModal.scss';

import Modal from "@/components/Modal/Modal.tsx";

interface PolicyDeleteModalProps {
  open: boolean;
  cancel: () => void;
  submit: () => void;
}

const PolicyDeleteModal = ({open, cancel, submit}: PolicyDeleteModalProps) => {
  return <Modal open={open} onCancel={cancel} onOk={submit}>
    <div className='policy_delete_modal'>
      <p className='policy_delete_modal_title'>You're about to permanently delete a policy.</p>
      <p className='policy_delete_modal_description'>This may affect related invoices, client records, or audit history.
        Proceed only if you're certain.</p>
    </div>
  </Modal>
}

export default PolicyDeleteModal;
