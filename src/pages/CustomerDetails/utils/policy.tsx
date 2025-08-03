import type { ColumnsType } from "antd/es/table";
import { Button } from "antd";
import type { RadioChangeEvent } from 'antd'
import { BaseSyntheticEvent, Dispatch, SetStateAction, useCallback, useState } from "react";
import { instance } from "@/api/axios.ts";
import { Dayjs } from "dayjs";
import type { IPolicy, IPolicyCreate } from "@/types/policy/main.ts";

export const newPolicyFormInitialState: IPolicyCreate = {
  insuranceId: '',
  installmentCount: '',
  monthlyPayment: 0,
  expirationDate: '',
  effectiveDate: '',
  status: '',
  deposit: 0,
  type: '',
  policyTerm: '',
  premiumPrice: 0,
  policyNumber: ''
}

export const policyTableHeaders: ColumnsType = [
  {
    title: "Insurance carrier",
    dataIndex: "insuranceName",
    key: "insuranceName",
    sorter: (a, b) => a.insuranceName.localeCompare(b.firstName)
  },
  {
    title: "Policy number",
    dataIndex: "policyNumber",
    key: "policyNumber",
    sorter: (a, b) => a.policyNumber.localeCompare(b.firstName)
  },
  {
    title: "Effective Date",
    dataIndex: "effectiveDate",
    key: "effectiveDate",
    sorter: (a, b) => a.firstName.localeCompare(b.firstName)
  },
  {
    title: "Expiration Date",
    dataIndex: "expirationDate",
    key: "expirationDate",
    sorter: (a, b) => a.firstName.localeCompare(b.firstName)
  },
  {
    title: "Policy term",
    dataIndex: "policyTerm",
    key: "policyTerm",
    sorter: (a, b) => a.firstName.localeCompare(b.firstName)
  },
  {
    title: "Premium",
    dataIndex: "premiumPrice",
    key: "premiumPrice",
    sorter: (a, b) => a.firstName.localeCompare(b.firstName)
  },
  {
    title: "Fees",
    dataIndex: "additionalFees",
    key: "additionalFees",
    sorter: (a, b) => a.firstName.localeCompare(b.firstName)
  },
  {
    title: "Amount Due",
    dataIndex: "amountDue",
    key: "amountDue",
    sorter: (a, b) => a.firstName.localeCompare(b.firstName)
  },
  {
    title: "Due Date",
    dataIndex: "dueDate",
    key: "dueDate",
    sorter: (a, b) => a.firstName.localeCompare(b.firstName)
  },
]

export const getPolicyFunctions = (customerId?: string) => {
  const [policies, setPolicies] = useState<IPolicy[]>([]);
  const [isPolicyModalOpen, setIsPolicyModalOpen] = useState(false);

  // const fetchDrivers = useCallback(async () => {
  //   const driversByCustomer = await instance.get('/driver/byCustomer', { params: { id: customerId } });
  //   setDrivers(driversByCustomer.data);
  // }, [customerId]);

  const changePolicyFormData = useCallback((key: keyof Omit<IPolicyCreate, 'effectiveDate' | 'expirationDate'>, callback: Dispatch<SetStateAction<IPolicyCreate>>) => {
    return (val: BaseSyntheticEvent | RadioChangeEvent | string) => {
      callback(prev => ({
        ...prev,
        [key]: typeof val === 'string' ? val : val.target.value
      }))
    }
  }, []);

  const changePolicyFormTime = useCallback((key: keyof Pick<IPolicyCreate, 'effectiveDate' | 'expirationDate'>, callback: Dispatch<SetStateAction<IPolicyCreate>>) => {
    return (val: Dayjs) => {
      const date = val ? val.format('MM/DD/YYYY') : null
      callback(prev => ({
        ...prev,
        [key]: date
      }))
    }
  }, []);

  const cancelPolicyModal = useCallback(async () => {
    setIsPolicyModalOpen(false);
    // await fetchDrivers();
  }, []);

  const addNewPolicyButton = <Button onClick={() => setIsPolicyModalOpen(true)}>Add policy</Button>

  return {
    policies,
    addNewPolicyButton,
    changePolicyFormData, changePolicyFormTime,
    isPolicyModalOpen,
    cancelPolicyModal
  }
}
