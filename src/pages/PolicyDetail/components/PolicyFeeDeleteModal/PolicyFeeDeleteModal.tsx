import './PolicyFeeDeleteModal.scss';

import Modal from "@/components/Modal/Modal.tsx";

interface PolicyFeeDeleteModalProps {
  open: boolean;
  submit: () => void;
  cancel: () => void;
}

const PolicyFeeDeleteModal = ({ open, cancel, submit }: PolicyFeeDeleteModalProps) => {
  return <Modal open={open} onOk={submit} onCancel={cancel}>
    <div className='policy_fee_delete_modal'>
      <p className='policy_fee_delete_modal_title'>This will permanently remove the selected fee from the policy.</p>
      <p className='policy_fee_delete_modal_description'>The associated amount will no longer be included in the
        upcoming payment.
        Are you sure you want to proceed?</p>
    </div>
  </Modal>
}

export default PolicyFeeDeleteModal;
