import './PolicyActivityModal.scss';

import Modal from "@/components/Modal/Modal.tsx";
import dayjs from "dayjs";
import { getPolicyActivityFunctions } from "@/pages/PolicyDetail/utils/policy_detail.tsx";
import type { IPolicy } from "@/types/policy/main.ts";
import { useEffect } from "react";

interface PolicyActivityModalProps {
  open: boolean;
  cancel: () => void;
  policyId?: string;
  policy?: IPolicy;
}

const PolicyActivityModal = ({ open, cancel, policyId, policy }: PolicyActivityModalProps) => {
  const { fetchPolicyActivities, activities } = getPolicyActivityFunctions(policyId);

  useEffect(() => {
    if (open) fetchPolicyActivities()
  }, [open]);

  return <Modal open={open} onCancel={cancel} onOk={cancel}>
    <div className='policy_activity_modal'>
      <label className='policy_activity_modal_label'>Activities
        on {policy?.policyNumber} </label>
      {activities.map(act => <div>
        {dayjs(act.createdAt).format('MM/DD/YYYY HH:mm:ss')}: {act.message} by {act.user.email}
      </div>)}
    </div>
  </Modal>
}

export default PolicyActivityModal;
