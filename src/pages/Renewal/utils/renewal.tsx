import type { ColumnsType } from "antd/es/table";
import { useState } from "react";
import type { IRenewal } from "@/types/renewal/main.ts";
import { instance } from "@/api/axios.ts";

export const renewalTableHeaders: ColumnsType = [
  { title: "First Name", dataIndex: "firstName", key: "firstName" },
  { title: "Last Name", dataIndex: "lastName", key: "lastName" },
  { title: "TLC Number", dataIndex: "tlcNumber", key: "tlcNumber" },
  { title: "TLC Exp. Date", dataIndex: "tlcExp", key: "tlcExp" },
  { title: "DDC Exp. Date", dataIndex: "driverDefensiveCourseExp", key: "driverDefensiveCourseExp" },
];

export const getRenewalsFunction = () => {
  const [renewals, setRenewals] = useState<IRenewal[]>([])

  const fetchRenewalsOfCustomers = async () => {
    const response = await instance.get('/customer/renewals');
    setRenewals(response.data);
  }

  return {
    fetchRenewalsOfCustomers, renewals,
  }
}

