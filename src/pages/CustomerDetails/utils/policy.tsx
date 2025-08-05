import type { ColumnsType } from "antd/es/table";
import { Button } from "antd";
import type { RadioChangeEvent } from 'antd'
import { BaseSyntheticEvent, Dispatch, SetStateAction, useCallback, useState } from "react";
import { instance } from "@/api/axios.ts";
import dayjs, { Dayjs } from "dayjs";
import type { IPolicy, IPolicyCreate, IPolicyFeeCreate } from "@/types/policy/main.ts";

export const newPolicyFormInitialState: IPolicyCreate = {
  insuranceId: '',
  installmentCount: '',
  monthlyPayment: 0,
  expirationDate: '',
  effectiveDate: '',
  status: '',
  deposit: 0,
  type: '',
  fees: [],
  policyTerm: '',
  premiumPrice: 0,
  policyNumber: ''
}

export const policyTableHeaders: ColumnsType = [
  {
    title: "Insurance carrier",
    dataIndex: ['insurance', 'name'],
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
    dataIndex: "fees",
    key: "fees",
    render: (_, record) => record.fees.reduce((acc, item) => acc + item.amount, 0),
  },
  {
    title: "Amount Due",
    dataIndex: "amountDue",
    key: "amountDue",
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

  const fetchPolicies = useCallback(async () => {
    const policiesByCustomer = await instance.get('/policy/byCustomer', { params: { id: customerId } });
    setPolicies(policiesByCustomer.data);
  }, [customerId]);

  const createPolicy = useCallback(async (newPolicyForm: IPolicyCreate, resetForm: Dispatch<SetStateAction<IPolicyCreate>>) => {
    await instance.post('/policy', { ...newPolicyForm, customerId });
    resetForm(newPolicyFormInitialState);
    await cancelPolicyModal();
  }, [customerId])

  const changePolicyFormData = useCallback((key: keyof Omit<IPolicyCreate, 'effectiveDate' | 'expirationDate'>, callback: Dispatch<SetStateAction<IPolicyCreate>>) => {
    return (val: BaseSyntheticEvent | RadioChangeEvent | string) => {
      callback(prev => ({
        ...prev,
        [key]: typeof val === 'string' ? val : val.target.value,
        ...(key === 'policyTerm' ? {
          expirationDate: prev.effectiveDate ? dayjs(prev.effectiveDate).add(+(val as BaseSyntheticEvent).target.value, 'month').format('MM/DD/YYYY') : null
        } : {})
      }))
    }
  }, []);

  // TODO If there will be custom, need to rewrote
  const changePolicyFormTime = useCallback((key: keyof Pick<IPolicyCreate, 'effectiveDate'>, callback: Dispatch<SetStateAction<IPolicyCreate>>) => {
    return (val: Dayjs) => {
      const date = val ? val.format('MM/DD/YYYY') : null
      callback(prev => ({
        ...prev,
        [key]: date,
        expirationDate: val.add(+prev.policyTerm, 'month').format('MM/DD/YYYY')
      }))
    }
  }, []);

  const addPolicyFee = useCallback((value: IPolicyFeeCreate, callback: Dispatch<SetStateAction<IPolicyCreate>>) => {
    callback(prev => ({
      ...prev,
      fees: prev.fees.concat(value)
    }))
  }, []);

  const removePolicyFee = useCallback((feeIndex: number, callback: Dispatch<SetStateAction<IPolicyCreate>>) => {
    callback(prev => ({
      ...prev,
      fees: prev.fees.filter((_, index) => index !== feeIndex)
    }))
  }, [])

  const cancelPolicyModal = useCallback(async () => {
    setIsPolicyModalOpen(false);
    await fetchPolicies();
  }, []);

  const addNewPolicyButton = <Button onClick={() => setIsPolicyModalOpen(true)}>Add policy</Button>

  return {
    policies,
    addNewPolicyButton,
    changePolicyFormData, changePolicyFormTime,
    addPolicyFee, removePolicyFee,
    isPolicyModalOpen,
    fetchPolicies,
    cancelPolicyModal,
    createPolicy
  }
}
