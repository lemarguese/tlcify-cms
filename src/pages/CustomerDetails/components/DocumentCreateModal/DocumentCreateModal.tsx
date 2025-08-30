import './DocumentCreateModal.scss';

import Modal from "@/components/Modal/Modal.tsx";
import { useState } from "react";
import type { IDocumentCreate } from "@/types/document/main.ts";
import { documentTypeSelectionOptions, newDocumentFormInitialState } from "@/pages/CustomerDetails/utils/policy.tsx";
import Selector from "@/components/Selector/Selector.tsx";
import Input from "@/components/Input/Input.tsx";
import FileDragger from "@/components/FileDragger/FileDragger.tsx";

interface DocumentCreateModalProps {
  open: boolean;
  submit: (form: IDocumentCreate) => void;
  cancel: () => void;
}

const DocumentCreateModal = ({ open, cancel, submit }: DocumentCreateModalProps) => {
  const [newDocumentForm, setNewDocumentForm] = useState<IDocumentCreate>(newDocumentFormInitialState);

  return <Modal open={open} onCancel={cancel} onOk={() => submit(newDocumentForm)}>
    <div className='document_create_modal'>
      <Selector label='Document Type' onChange={(val) => setNewDocumentForm(prev => ({
        ...prev, type: val
      }))} options={documentTypeSelectionOptions} value={newDocumentForm.type}
                required/>
      <FileDragger multiple={false} beforeUpload={() => false} onChange={(value) => setNewDocumentForm(prev => ({
        ...prev,
        files: value.file
      }))}/>
      <Input label='Description'/>
    </div>
  </Modal>
}

export default DocumentCreateModal;
