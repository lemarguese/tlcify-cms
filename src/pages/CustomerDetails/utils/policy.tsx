import type { ColumnsType } from "antd/es/table";
import { Button } from "antd";
import type { RadioChangeEvent } from 'antd'

import { useCallback, useState } from "react";
import type { BaseSyntheticEvent, Dispatch, SetStateAction } from 'react';

import { instance } from "@/api/axios.ts";
import dayjs, { Dayjs } from "dayjs";
import type { IPolicy, IPolicyCreate, IPolicyFee, IPolicyFeeCreate, IUpdatePolicy } from "@/types/policy/main.ts";

import type { TableRowSelection } from "antd/es/table/interface";
import { newCustomerFormInitialState } from "@/pages/Customer/utils/customer.tsx";

export const policyInitialStateTemplate: Omit<IPolicy, 'insurance' | '_id' | 'customer'> = {
  installmentCount: '',
  monthlyPayment: 0,
  expirationDate: undefined,
  effectiveDate: undefined,
  status: '',
  deposit: 0,
  type: '',
  fees: [],
  policyTerm: '',
  premiumPrice: 0,
  policyNumber: ''
}

export const newPolicyFormInitialState: IPolicyCreate = {
  ...policyInitialStateTemplate,
  insuranceId: '',
  _id: ''
}

export const policyInitialState: IPolicy = {
  ...policyInitialStateTemplate,
  _id: '',
  insurance: {
    _id: '',
    name: '',
    naicCode: '',
    commissionFee: 0,
    brokerCode: ''
  },
  customer: { _id: '', ...newCustomerFormInitialState },
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
    render: (_, record) => (record as IPolicy).fees.reduce((acc, item) => acc + item.amount, 0),
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
  const [policyById, setPolicyById] = useState<IPolicy>(policyInitialState);

  const [selectedPolicy, setSelectedPolicy] = useState<IPolicy>();

  const [isPolicyCreateModalOpen, setIsPolicyCreateModalOpen] = useState(false);
  const [isPolicyUpdateModalOpen, setIsPolicyUpdateModalOpen] = useState(false);
  const [isPolicyDeleteModalOpen, setIsPolicyDeleteModalOpen] = useState(false);

  const [policiesSelection] = useState<TableRowSelection>({
    onSelect: (_, _s, multipleRows) => {
      const isMultipleSelected = multipleRows.length > 1;
      const [selectedPolicy] = multipleRows as IPolicy[];

      setSelectedPolicy(!isMultipleSelected ? selectedPolicy : undefined);
    },
  })

  const fetchPolicies = useCallback(async () => {
    const policiesByCustomer = await instance.get('/policy/byCustomer', { params: { id: customerId } });
    setPolicies(policiesByCustomer.data);
  }, [customerId]);

  const createPolicy = useCallback(async (newPolicyForm: IPolicyCreate, resetForm: Dispatch<SetStateAction<IPolicyCreate>>) => {
    await instance.post('/policy', { ...newPolicyForm, customerId });
    resetForm(newPolicyFormInitialState);
    await cancelCreatePolicyModal();
  }, [customerId])

  const changePolicyFormData = useCallback((key: keyof Omit<IPolicyCreate, 'effectiveDate' | 'expirationDate'>, callback: Dispatch<SetStateAction<IPolicyCreate>>) => {
    return (val: BaseSyntheticEvent | RadioChangeEvent | string) => {
      callback(prev => ({
        ...prev,
        [key]: typeof val === 'string' ? val : val.target.value,
        ...(key === 'policyTerm' ? {
          expirationDate: prev.effectiveDate ? dayjs(prev.effectiveDate).add(+(val as BaseSyntheticEvent).target.value, 'month').format('MM/DD/YYYY') : undefined
        } : {})
      }))
    }
  }, []);

  // TODO If there will be custom, need to rewrote
  const changePolicyFormTime = useCallback((key: keyof Pick<IPolicyCreate, 'effectiveDate'>, callback: Dispatch<SetStateAction<IPolicyCreate>>) => {
    return (val: Dayjs) => {
      const date = val ? val.format('MM/DD/YYYY') : undefined
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

      // @ts-config

      // TODO value is new one, without _id and casted to IPolicyFee
      fees: prev.fees.concat(value as IPolicyFee)
    }))
  }, []);

  const removePolicyFee = useCallback((feeIndex: number, callback: Dispatch<SetStateAction<IPolicyCreate>>) => {
    callback(prev => ({
      ...prev,
      fees: prev.fees.filter((_, index) => index !== feeIndex)
    }))
  }, []);

  const cancelCreatePolicyModal = useCallback(async () => {
    setIsPolicyCreateModalOpen(false);
    await fetchPolicies();
  }, []);

  const policiesActionButton = <div className='customer_details_page_actions'>
    {selectedPolicy &&
        <Button variant='outlined' color={'danger'} onClick={() => setIsPolicyDeleteModalOpen(true)}>Delete the
            policy</Button>}
    {selectedPolicy && <Button onClick={() => setIsPolicyUpdateModalOpen(true)}>Update the policy</Button>}
    <Button variant='outlined' color={'geekblue'} onClick={() => setIsPolicyCreateModalOpen(true)}>Add policy</Button>
  </div>

  // Get One

  const fetchPolicyById = useCallback(async () => {
    const policyById = await instance.get(`/policy/${selectedPolicy!._id}`);
    setPolicyById(policyById.data);
  }, [selectedPolicy]);

  const cancelUpdatePolicyModal = useCallback(async () => {
    setSelectedPolicy(undefined);
    setIsPolicyUpdateModalOpen(false);
    await fetchPolicies();
  }, []);

  const updatePolicy = useCallback(async (newPolicyForm: Partial<IUpdatePolicy>, resetForm: Dispatch<SetStateAction<IUpdatePolicy>>) => {
    await instance.patch(`/policy/${selectedPolicy!._id}`, newPolicyForm);
    resetForm(newPolicyFormInitialState);
    await cancelUpdatePolicyModal();
  }, [selectedPolicy]);

  // Delete modal

  const cancelDeletePolicyModal = useCallback(async () => {
    setSelectedPolicy(undefined);
    setIsPolicyDeleteModalOpen(false);
    await fetchPolicies();
  }, []);

  const deletePolicy = useCallback(async () => {
    await instance.delete(`/policy/${selectedPolicy!._id}`);
    await cancelDeletePolicyModal();
  }, [selectedPolicy]);

  return {
    // all policies
    policies,
    policiesActionButton,
    changePolicyFormData, changePolicyFormTime,
    addPolicyFee, removePolicyFee,
    isPolicyCreateModalOpen,
    fetchPolicies,
    cancelCreatePolicyModal,
    createPolicy,

    policiesSelection,

    // get one
    updatePolicy,
    fetchPolicyById, policyById,
    isPolicyUpdateModalOpen, cancelUpdatePolicyModal,

    // delete
    cancelDeletePolicyModal, deletePolicy, isPolicyDeleteModalOpen
  }
}

export const policyTypeSelectionOptions = [
  { label: 'New', value: 'new' },
  { label: 'Quote', value: 'quote' },
  { label: 'Renewal', value: 'renewal' }
];

export const policyStatusSelectionOptions = [
  { label: 'New', value: 'new' },
  { label: 'Quote', value: 'quote' },
  { label: 'Bound', value: 'bound' },
  { label: 'Renew', value: 'renew' },
  { label: 'Change', value: 'change' },
  { label: 'Cancel', value: 'cancel' },
]
