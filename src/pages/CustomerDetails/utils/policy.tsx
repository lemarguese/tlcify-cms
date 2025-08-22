import type { ColumnsType } from "antd/es/table";
import { Button } from "antd";
import type { RadioChangeEvent } from 'antd'

import { useCallback, useMemo, useState } from "react";
import type { BaseSyntheticEvent, Dispatch, SetStateAction } from 'react';

import { instance } from "@/api/axios.ts";
import dayjs, { Dayjs } from "dayjs";
import type {
  IPolicy,
  IPolicyByCustomer,
  IPolicyCreate,
  IPolicyFee,
  IPolicyFeeCreate,
  IUpdatePolicy
} from "@/types/policy/main.ts";

import { SendOutlined, FieldNumberOutlined, ScheduleOutlined } from '@ant-design/icons'

import type { TableRowSelection } from "antd/es/table/interface";
import { newCustomerFormInitialState } from "@/pages/Customer/utils/customer.tsx";
import type { ICustomerCreate } from "@/types/customer/main.ts";
import type { IDocument, IDocumentCreate } from "@/types/document/main.ts";
import type { IPaymentCreate } from "@/types/transactions/main.ts";
import type { IInvoiceCreate, IInvoicePolicyCreate } from "@/types/invoice/main.ts";
import type { NavigateFunction } from "react-router";

import utc from "dayjs/plugin/utc";

dayjs.extend(utc);

export const policyInitialStateTemplate: Omit<IPolicy, 'insurance' | '_id' | 'customer' | 'matchedFees'> = {
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
  matchedFees: {
    fees: [],
    total: 0
  },
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
    render: (value) => dayjs(value).format('MM/DD/YYYY'),
    sorter: (a, b) => a.firstName.localeCompare(b.firstName)
  },
  {
    title: "Expiration Date",
    dataIndex: "expirationDate",
    key: "expirationDate",
    render: (value) => dayjs(value).format('MM/DD/YYYY'),
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
    render: (value) => dayjs(value).format('MM/DD/YYYY'),
    sorter: (a, b) => a.firstName.localeCompare(b.firstName)
  },
];

export const documentTableHeaders: ColumnsType = [
  {
    title: "URL",
    dataIndex: "url",
    key: "url",
    render: (text, item) => (
      <a href={text} target="_blank" rel="noopener noreferrer">
        {item.type}
      </a>
    ),
  },
  {
    title: "Meta Description",
    dataIndex: "metaDescription",
    key: "metaDescription",
  },
  {
    title: "Type",
    dataIndex: "type",
    key: "type",
  },
];

export const getPolicyFunctions = (customerId?: string) => {
  const [policies, setPolicies] = useState<IPolicyByCustomer[]>([]);
  const [policyById, setPolicyById] = useState<IPolicy>(policyInitialState);

  const [selectedPolicy, setSelectedPolicy] = useState<IPolicy>();

  const [isPolicyCreateModalOpen, setIsPolicyCreateModalOpen] = useState(false);
  const [isPolicyUpdateModalOpen, setIsPolicyUpdateModalOpen] = useState(false);
  const [isPolicyDeleteModalOpen, setIsPolicyDeleteModalOpen] = useState(false);
  const [isPaymentCreateModalOpen, setIsPaymentCreateModalOpen] = useState(false);
  const [isInvoiceConfirmModalOpen, setIsInvoiceConfirmModalOpen] = useState(false);

  const [policiesSelection] = useState<TableRowSelection>({
    onSelect: (_, _s, multipleRows) => {
      const isMultipleSelected = multipleRows.length > 1;
      const [selectedPolicy] = multipleRows as IPolicy[];

      setSelectedPolicy(!isMultipleSelected ? selectedPolicy : undefined);
    },
  });

  const fetchPolicies = useCallback(async () => {
    const policiesByCustomer = await instance.get('/policy/byCustomer', { params: { id: customerId } });
    setPolicies(policiesByCustomer.data);
  }, [customerId]);

  const createPolicy = useCallback(async (newPolicyForm: IPolicyCreate, resetForm: Dispatch<SetStateAction<IPolicyCreate>>) => {
    const { _id, ...policyFormWithoutId } = newPolicyForm;
    await instance.post('/policy', { ...policyFormWithoutId, customerId });
    resetForm(newPolicyFormInitialState);
    await cancelCreatePolicyModal();
  }, [customerId])

  const changePolicyFormData = useCallback((key: keyof Omit<IPolicyCreate, 'effectiveDate' | 'expirationDate'>, callback: Dispatch<SetStateAction<IPolicyCreate>>) => {
    return (val: BaseSyntheticEvent | RadioChangeEvent | string) => {
      callback(prev => ({
        ...prev,
        [key]: typeof val === 'string' ? val : val.target.value,
        ...(key === 'policyTerm' ? {
          expirationDate: prev.effectiveDate ? dayjs(prev.effectiveDate).add(+(val as BaseSyntheticEvent).target.value, 'month').toDate() : undefined
        } : {})
      }))
    }
  }, []);

  // TODO If there will be custom, need to rewrote
  const changePolicyFormTime = useCallback((key: keyof Pick<IPolicyCreate, 'effectiveDate'>, callback: Dispatch<SetStateAction<IPolicyCreate>>) => {
    return (val: Dayjs) => {
      const date = val ? val.toDate() : undefined
      callback(prev => ({
        ...prev,
        [key]: date,
        expirationDate: val.add(+prev.policyTerm, 'month').toDate()
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
    {selectedPolicy && <Button color={'magenta'} variant='solid' onClick={() => setIsPaymentCreateModalOpen(true)}>Create
        payment</Button>}
    <Button variant='outlined' color={'geekblue'} onClick={() => setIsPolicyCreateModalOpen(true)}>Add policy</Button>
    <Button variant='solid' color='green' icon={<SendOutlined/>} onClick={() => setIsInvoiceConfirmModalOpen(true)}>Send
      invoice</Button>
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

  // payment

  const cancelPaymentCreateModal = useCallback(() => {
    setIsPaymentCreateModalOpen(false);
  }, []);

  const createPayment = useCallback(async (paymentForm: IPaymentCreate) => {
    await instance.post('/payment/application', {
      ...paymentForm,
      policyId: selectedPolicy!._id,
      provider: paymentForm.method.toUpperCase(),
    });

    cancelPaymentCreateModal();
  }, [selectedPolicy]);

  // invoice

  const createInvoice = useCallback(async (navigate: NavigateFunction) => {
    const invoiceBody: IInvoiceCreate = {
      customer: customerId!,
      policies: policies.map(p => (
        {
          policy: p._id,
          number: p.policyNumber,
          insuranceCarrierName: p.insurance.name,
          dueDate: p.dueDate,
          amount: p.amountDue,
          totalDueDateFee: p.matchedFees.total
        }
      )) as IInvoicePolicyCreate[],
      issuedAt: new Date(),
    }

    const response = await instance.post('/invoice', invoiceBody);
    setIsInvoiceConfirmModalOpen(false);
    navigate(`/invoice/${response.data._id}`);
  }, [customerId, policies]);

  const cancelInvoiceCreateModal = useCallback(() => {
    setIsInvoiceConfirmModalOpen(false)
  }, []);

  // statistics

  const { totalPaymentAmount, totalFeesAmount, nextDueAmount } = useMemo(() => {
    return policies.reduce((acc, item) => {
      acc.totalPaymentAmount += item.premiumPrice;
      acc.nextDueAmount += item.amountDue;
      acc.totalFeesAmount += item.fees.reduce((a, i) => a + i.amount, 0);
      return acc;
    }, { totalPaymentAmount: 0, nextDueAmount: 0, totalFeesAmount: 0 })
  }, [policies])

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
    cancelDeletePolicyModal, deletePolicy, isPolicyDeleteModalOpen,

    // payment
    cancelPaymentCreateModal, isPaymentCreateModalOpen, createPayment,

    // invoice
    createInvoice, isInvoiceConfirmModalOpen, cancelInvoiceCreateModal,

    // statistics

    totalFeesAmount,
    totalPaymentAmount,
    nextDueAmount
  }
}

export const getCustomerFunction = (customerId?: string) => {
  const [isClientEmailModalOpen, setIsClientEmailModalOpen] = useState(false);
  const [isAutoPayEnabled, setIsAutoPayEnabled] = useState(false);

  const [customerById, setCustomerById] = useState<ICustomerCreate>(newCustomerFormInitialState);

  const contactSections = [
    { title: 'TLC Expiration Date', content: dayjs(customerById.tlcExp).format('MM/DD/YYYY'), icon: <FieldNumberOutlined style={{ fontSize: 32 }} /> },
    { title: 'TLC Number', content: customerById.tlcNumber, icon: <FieldNumberOutlined style={{ fontSize: 32 }} /> },
    {
      title: 'DDC Expiration Date',
      content: dayjs(customerById.defensiveDriverCourseExp).format('MM/DD/YYYY'),
      icon: <ScheduleOutlined style={{ fontSize: 32 }} />
    },
    { title: 'DL Number', content: dayjs(customerById.driverLicenseExp).format('MM/DD/YYYY'), icon: <ScheduleOutlined style={{ fontSize: 32 }} /> },
  ];

  const fetchCustomerById = useCallback(async () => {
    const customer = await instance.get(`/customer/${customerId}`);
    setCustomerById(customer.data);
  }, [customerId]);

  const sendFormToClientEmail = useCallback(async (clientEmail: string) => {
    await instance.post(`/email/payment-request/${customerId}`, { clientEmail });
    cancelClientFormSend();
  }, [customerId]);

  const openClientFormEmail = () => {
    setIsClientEmailModalOpen(true)
  }

  const cancelClientFormSend = useCallback(() => {
    setIsClientEmailModalOpen(false);
  }, []);

  const changeAutoPay = useCallback((value: boolean) => {
    setIsAutoPayEnabled(value);
  }, []);

  return {
    customerById, fetchCustomerById,

    sendFormToClientEmail, openClientFormEmail, cancelClientFormSend,
    changeAutoPay, isAutoPayEnabled, isClientEmailModalOpen,

    contactSections
  }
}

export const newPaymentFormInitialState: IPaymentCreate = {
  discountAmount: 0,
  policyId: '',
  notes: '',
  method: 'other',
  totalPaid: 0,
  paidAt: undefined
}

export const paymentTypeRadioOptions = [
  { label: 'Card', value: 'card' },
  { label: 'Cash', value: 'cash' },
  { label: 'Zelle', value: 'zelle' },
  { label: 'Other', value: 'other' },
];

export const newDocumentFormInitialState: IDocumentCreate = {
  metaDescription: '',
  type: '',
}

export const documentTypeSelectionOptions = [
  { label: 'TLC License', value: 'tlc_license' },
  { label: 'DL License', value: 'dl_license' },
  { label: 'DDC License', value: 'ddc_license' },
  { label: 'Other', value: 'other' }
]

export const getDocumentFunction = (customerId?: string) => {
  const [documents, setDocuments] = useState<IDocument[]>([]);

  const [isDocumentModalOpen, setIsDocumentModalOpen] = useState(false);

  const fetchDocumentsByCustomerId = async () => {
    const response = await instance.get(`/document/customer/${customerId}`);
    setDocuments(response.data);
  }

  const uploadCustomerDocument = useCallback(async (form: IDocumentCreate) => {
    const formData = new FormData();
    formData.set('customer', customerId!);

    for (const [key, value] of Object.entries(form)) {
      formData.set(key, value);
    }

    await instance.post('/document/customer', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    cancelDocumentModal();
    await fetchDocumentsByCustomerId();
  }, [customerId]);

  const addNewDocumentButton =
    <Button variant='outlined' onClick={() => setIsDocumentModalOpen(true)}>Add
      Document</Button>

  const cancelDocumentModal = useCallback(() => {
    setIsDocumentModalOpen(false);
  }, [])

  return {
    fetchDocumentsByCustomerId, documents,
    uploadCustomerDocument,

    cancelDocumentModal, isDocumentModalOpen, addNewDocumentButton
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
