import './ActivityLogModal.scss';
import Modal from "@/components/Modal/Modal.tsx";
import type { IAuditLog } from "@/types/audit_log/main.ts";
import { getAuditLogsFunction } from "@/pages/CustomerDetails/utils/audit_log.tsx";
import { useEffect } from "react";

interface ActivityLogModalProps {
  open: boolean;
  cancel: () => void;
  customerId?: string;
}

const ActivityLogModal = ({ open, cancel, customerId }: ActivityLogModalProps) => {
  const { activities, fetchActivities } = getAuditLogsFunction(customerId);

  useEffect(() => {
    fetchActivities();
  }, []);

  return <Modal open={open} onCancel={cancel}>
    <div className='activity_log_modal'>
      {activities.map(act => <div>
        {act.user} {act.message}
      </div>)}
    </div>
  </Modal>
}

export default ActivityLogModal;
