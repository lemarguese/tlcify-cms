import './ActivityLogModal.scss';
import Modal from "@/components/Modal/Modal.tsx";
import { getAuditLogsFunction } from "@/pages/CustomerDetails/utils/audit_log.tsx";
import { useEffect } from "react";
import type { ICustomerCreate } from "@/types/customer/main.ts";
import dayjs from "dayjs";
import { formatCustomerName } from "@/utils/customer.ts";

interface ActivityLogModalProps {
  open: boolean;
  cancel: () => void;
  customer: ICustomerCreate;
  customerId?: string;
}

const ActivityLogModal = ({ open, cancel, customer, customerId }: ActivityLogModalProps) => {
  const { activities, fetchActivities } = getAuditLogsFunction(customerId);

  useEffect(() => {
    if (open) fetchActivities();
  }, [open]);

  return <Modal open={open} onCancel={cancel} onOk={cancel}>
    <div className='activity_log_modal'>
      <label className='activity_log_modal_label'>Activities
        on {formatCustomerName(customer)}</label>
      {activities.map(act => <div>
        {dayjs(act.createdAt).format('MM/DD/YYYY HH:mm:ss')}: {act.message} by {act.user.email}
      </div>)}
    </div>
  </Modal>
}

export default ActivityLogModal;
