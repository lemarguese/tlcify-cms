import { useState } from "react";
import type { IAuditLog } from "@/types/audit_log/main.ts";
import { instance } from "@/api/axios.ts";

export const getAuditLogsFunction = (customerId?: string) => {
  const [activities, setActivities] = useState<IAuditLog[]>([]);

  const fetchActivities = async () => {
    const response = await instance.get(`/audit/customer/${customerId}`);
    setActivities(response.data);
  }

  return {
    activities, fetchActivities
  }
}
