import './ActivityLogModal.scss';
import Modal from "@/components/Modal/Modal.tsx";
import { getAuditLogsFunction } from "@/pages/CustomerDetails/utils/audit_log.tsx";
import { useEffect } from "react";
import type { ICustomerCreate } from "@/types/customer/main.ts";

interface ActivityLogModalProps {
  open: boolean;
  cancel: () => void;
  customer: ICustomerCreate;
  customerId?: string;
}

const ActivityLogModal = ({ open, cancel, customer, customerId }: ActivityLogModalProps) => {
  const { activities, fetchActivities } = getAuditLogsFunction(customerId);

  useEffect(() => {
    fetchActivities();
  }, []);

  return <Modal open={open} onCancel={cancel} onOk={cancel}>
    <div className='activity_log_modal'>
      <label className='activity_log_modal_label'>Activities
        of {customer.firstName && customer.lastName ? `${customer.firstName} ${customer.lastName}` : customer.corporationName}</label>
      {activities.map(act => <div>
        {act.user.email} - {act.message}
      </div>)}
    </div>
  </Modal>
}

export default ActivityLogModal;
