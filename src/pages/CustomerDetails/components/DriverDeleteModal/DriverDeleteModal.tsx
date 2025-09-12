import './DriverDeleteModal.scss';

import Modal from "@/components/Modal/Modal.tsx";

interface DriverDeleteModalProps {
  open: boolean;
  cancel: () => void;
  submit: () => void;
}

const DriverDeleteModal = ({ open, cancel, submit }: DriverDeleteModalProps) => {
  return <Modal open={open} onCancel={cancel} onOk={submit}>
    <div className='driver_delete_modal'>
      <p className='driver_delete_modal_title'>You're about to permanently delete a driver.</p>
      <p className='driver_delete_modal_description'>This may affect related invoices, client records, or audit history.
        Proceed only if you're certain.</p>
    </div>
  </Modal>
}

export default DriverDeleteModal;
