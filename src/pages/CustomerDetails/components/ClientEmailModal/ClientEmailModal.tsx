import './ClientEmailModal.scss';

import Modal from "@/components/Modal/Modal.tsx";
import Input from "@/components/Input/Input.tsx";
import { useState } from "react";

interface ClientEmailModalProps {
  open: boolean;
  submit: (value: string) => void;
  cancel: () => void;
}

const ClientEmailModal = ({ open, submit, cancel }: ClientEmailModalProps) => {
  const [clientEmail, setClientEmail] = useState('')

  return <Modal open={open} okButtonProps={{ disabled: !clientEmail }} onOk={() => submit(clientEmail)}
                onCancel={cancel}>
    <div className='client_email_modal'>
      <Input label='Client email address' value={clientEmail} required
             onChange={(e) => setClientEmail(e.target.value)}/>
    </div>
  </Modal>
}

export default ClientEmailModal;
