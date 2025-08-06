import { ReactNode, useCallback, useState } from "react";
import { EditOutlined, EllipsisOutlined, SettingOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { instance } from "@/api/axios.ts";
import type { IPolicy } from "@/types/policy/main.ts";
import { policyInitialState } from "@/pages/CustomerDetails/utils/policy.tsx";
import type { DescriptionsProps } from "antd";
import type { IInsurance } from "@/types/insurance/main.ts";
import { insuranceTitles } from "@/pages/Insurance/utils/insurance.tsx";

export const policyDetailActions: ReactNode[] = [
  <EditOutlined key="edit"/>,
  <SettingOutlined key="setting"/>,
  <EllipsisOutlined key="ellipsis"/>,
];

export const policyFeesTableHeaders: ColumnsType = [
  {
    title: "Fee Type",
    dataIndex: 'type',
    key: 'type',
  },
  {
    title: "Amount",
    dataIndex: 'amount',
    key: 'amount',
  },
  {
    title: "Due date",
    dataIndex: 'dueDate',
    key: 'dueDate',
  },
];

export const getPolicyDetailFunctions = (policyId?: string) => {
  const [policyById, setPolicyById] = useState<IPolicy>(policyInitialState);

  const fetchPolicyById = useCallback(async () => {
    const policyById = await instance.get(`/policy/${policyId}`);
    setPolicyById(policyById.data);
  }, [policyId]);

  // slice 1 is for _id
  // TODO Remove slice of -1, when starting from scratch
  // TODO NOT INSURANCE, IT IS INFORMATION OF POLICY
  const insuranceDescriptionItems: DescriptionsProps['items'] = Object.entries(policyById.insurance).slice(1, -1).map(([insuranceKey, insuranceValue]) => {
    return { label: insuranceTitles[insuranceKey], key: insuranceKey, children: insuranceValue }
  })

  return {
    fetchPolicyById, policyById,
    insuranceDescriptionItems
  }
}
