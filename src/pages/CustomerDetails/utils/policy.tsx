import type { ColumnsType } from "antd/es/table";
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

import { FieldNumberOutlined, ScheduleOutlined } from '@ant-design/icons'

import type { TableRowSelection } from "antd/es/table/interface";
import { newCustomerFormInitialState } from "@/pages/Customer/utils/customer.tsx";
import type { ICustomerCreate } from "@/types/customer/main.ts";
import type { IDocument, IDocumentCreate, IDocumentType } from "@/types/document/main.ts";
import type { IPaymentCreate } from "@/types/transactions/main.ts";
import type { IInvoiceCreate, IInvoicePolicyCreate } from "@/types/invoice/main.ts";
import type { NavigateFunction } from "react-router";

import utc from "dayjs/plugin/utc";
import { useNotify } from "@/hooks/useNotify/useNotify.tsx";

dayjs.extend(utc);

export const policyInitialStateTemplate: Omit<IPolicy, 'insurance' | '_id' | 'customer' | 'matchedFees'> = {
  installmentCount: 0,
  monthlyPayment: 0,
  expirationDate: undefined,
  effectiveDate: undefined,
  customEffectiveDate: undefined,
  cycles: [],
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
  cycles: [],
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
  },
  {
    title: "Policy number",
    dataIndex: "policyNumber",
    key: "policyNumber",
  },
  {
    title: "Effective Date",
    dataIndex: "effectiveDate",
    key: "effectiveDate",
    render: (value) => dayjs(value).format('MM/DD/YYYY'),
    sorter: (a, b) => new Date(a.effectiveDate).getTime() - new Date(b.effectiveDate).getTime()
  },
  {
    title: "Expiration Date",
    dataIndex: "expirationDate",
    key: "expirationDate",
    render: (value) => dayjs(value).format('MM/DD/YYYY'),
    sorter: (a, b) => new Date(a.expirationDate).getTime() - new Date(b.expirationDate).getTime()
  },
  {
    title: "Policy term",
    dataIndex: "policyTerm",
    key: "policyTerm",
  },
  {
    title: "Premium",
    dataIndex: "premiumPrice",
    key: "premiumPrice",
    sorter: (a, b) => a.premiumPrice - b.premiumPrice
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
    render: (value) => {
      if (!value) return 'Paid in full';

      return value.toFixed(2);
    },
    sorter: (a, b) => a.amountDue - b.amountDue
  },
  {
    title: "Due Date",
    dataIndex: "dueDate",
    key: "dueDate",
    render: (value) => {
      if (!value) return 'Paid in full';

      const [date] = value.split('T');
      return dayjs(date).format('MM/DD/YYYY');
    },
    sorter: (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
  },
];

export const documentTableHeaders: ColumnsType = [
  {
    title: "URL",
    dataIndex: "url",
    key: "url",
    render: (text, _, index) => (
      <a href={text} target="_blank" rel="noopener noreferrer">
        Document #{index + 1}
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
    render: (value: IDocumentType) => documentTypeTitleOptions[value]
  },
];

export const documentTypeTitleOptions: { [k in IDocumentType]: string } = {
  ddc_license: 'Driver Defensive Course License',
  tlc_license: 'TLC License',
  dl_license: 'Driver License',
  other: 'Other'
}

export const getPolicyFunctions = (customerId?: string) => {
  const { success, error } = useNotify();
  const [policies, setPolicies] = useState<IPolicyByCustomer[]>([]);
  const [policyById, setPolicyById] = useState<IPolicy>(policyInitialState);

  const [loading, setLoading] = useState(false);

  const [selectedPolicy, setSelectedPolicy] = useState<IPolicy>();

  const [isPolicyCreateModalOpen, setIsPolicyCreateModalOpen] = useState(false);
  const [isPolicyUpdateModalOpen, setIsPolicyUpdateModalOpen] = useState(false);
  const [isPolicyDeleteModalOpen, setIsPolicyDeleteModalOpen] = useState(false);
  const [isInvoiceConfirmModalOpen, setIsInvoiceConfirmModalOpen] = useState(false);

  const [policiesSelection] = useState<TableRowSelection>({
    onSelect: (_, _s, multipleRows) => {
      const isMultipleSelected = multipleRows.length > 1;
      const [selectedPolicy] = multipleRows as IPolicy[];

      setSelectedPolicy(!isMultipleSelected ? selectedPolicy : undefined);
    },
  });

  const fetchPolicies = useCallback(async () => {
    try {
      setLoading(true)
      const policiesByCustomer = await instance.get('/policy/byCustomer', { params: { id: customerId } });
      setPolicies(policiesByCustomer.data);
    } catch (e) {
      error(`Error while fetching customers: ${e}`)
    } finally {
      setLoading(false)
    }
  }, [customerId]);

  const createPolicy = useCallback(async (newPolicyForm: IPolicyCreate) => {
    try {
      const { _id, ...policyFormWithoutId } = newPolicyForm;
      await instance.post('/policy', { ...policyFormWithoutId, customerId });
      success('Policy was created successfully!');
      await fetchPolicies();
    } catch (e) {
      error('There is a problem with policy creation. Try again.');
    } finally {
      await cancelCreatePolicyModal();
    }
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

  const changePolicyFormTime = useCallback((key: keyof Pick<IPolicyCreate, 'effectiveDate' | 'customEffectiveDate'>, callback: Dispatch<SetStateAction<IPolicyCreate>>) => {
    return (val: Dayjs) => {
      const date = val ? val.toDate() : undefined
      callback(prev => ({
        ...prev,
        [key]: date,
        expirationDate: key === 'effectiveDate' ? val.add(+prev.policyTerm, 'month').toDate() : prev.expirationDate
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

  const openCreatePolicyModal = () => {
    setIsPolicyCreateModalOpen(true)
  }

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

  const openUpdatePolicyModal = () => {
    setIsPolicyUpdateModalOpen(true)
  }

  const updatePolicy = useCallback(async (newPolicyForm: Partial<IUpdatePolicy>) => {
    try {
      setLoading(true)
      await instance.patch(`/policy/${selectedPolicy!._id}`, newPolicyForm);
      success('Policy was successfully updated!');
      await fetchPolicies();
    } catch (e) {
      error('There is a problem with policy update. Try again.');
    } finally {
      setLoading(false)
      await cancelUpdatePolicyModal();
    }
  }, [selectedPolicy]);

  // Delete modal

  const cancelDeletePolicyModal = useCallback(async () => {
    setSelectedPolicy(undefined);
    setIsPolicyDeleteModalOpen(false);
    await fetchPolicies();
  }, []);

  const openDeletePolicyModal = () => {
    setIsPolicyDeleteModalOpen(true)
  }

  const deletePolicy = useCallback(async () => {
    try {
      setLoading(true)
      await instance.delete(`/policy/${selectedPolicy!._id}`);
      success('Policy was successfully deleted!');
      await fetchPolicies();
    } catch (e) {
      error('There is a problem with policy delete. Try again.');
    } finally {
      setLoading(false)
    }
    await cancelDeletePolicyModal();
  }, [selectedPolicy]);

  // invoice

  const createInvoice = useCallback(async (navigate: NavigateFunction) => {
    try {
      const unpaidPolicies = policies.filter(p => p.amountDue !== 0);

      const invoiceBody: IInvoiceCreate = {
        customer: customerId!,
        policies: unpaidPolicies.map(p => (
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
    } catch (e) {
      error('Seems like we having problem with sending invoice. Try again.');
    }
  }, [customerId, policies]);

  const cancelInvoiceCreateModal = () => {
    setIsInvoiceConfirmModalOpen(false)
  }

  const openInvoiceCreateModal = () => {
    setIsInvoiceConfirmModalOpen(true)
  }

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
    selectedPolicy,
    changePolicyFormData, changePolicyFormTime,

    addPolicyFee, removePolicyFee,
    isPolicyCreateModalOpen,
    fetchPolicies,
    cancelCreatePolicyModal,
    createPolicy,
    policiesSelection,
    openCreatePolicyModal,

    // get one
    updatePolicy,
    fetchPolicyById, policyById,
    isPolicyUpdateModalOpen, cancelUpdatePolicyModal,
    openUpdatePolicyModal,

    // delete
    cancelDeletePolicyModal, deletePolicy, isPolicyDeleteModalOpen,
    openDeletePolicyModal,

    // invoice
    createInvoice, isInvoiceConfirmModalOpen, cancelInvoiceCreateModal,
    openInvoiceCreateModal,

    // statistics

    totalFeesAmount,
    totalPaymentAmount,
    nextDueAmount,

    // loading
    policyLoading: loading
  }
}

export const getCustomerByIdFunction = (customerId?: string) => {
  const { error, success } = useNotify();

  const [loading, setLoading] = useState(false);

  const [isClientEmailModalOpen, setIsClientEmailModalOpen] = useState(false);
  const [isAutoPayEnabled, setIsAutoPayEnabled] = useState(false);
  const [isActivityLogsOpen, setIsActivityLogsOpen] = useState(false);

  const [customerById, setCustomerById] = useState<ICustomerCreate>(newCustomerFormInitialState);

  const contactSections = [
    {
      title: 'TLC Expiration Date',
      content: dayjs(customerById.tlcFhvExpiration).format('MM/DD/YYYY'),
      icon: <FieldNumberOutlined style={{ fontSize: 32 }}/>
    },
    { title: 'TLC Number', content: customerById.tlcFhvNumber, icon: <FieldNumberOutlined style={{ fontSize: 32 }}/> },
    {
      title: 'DDC Expiration Date',
      content: dayjs(customerById.defensiveDriverCourseExpiration).format('MM/DD/YYYY'),
      icon: <ScheduleOutlined style={{ fontSize: 32 }}/>
    },
    {
      title: 'DL Number',
      content: customerById.driverLicenseNumber,
      icon: <ScheduleOutlined style={{ fontSize: 32 }}/>
    },
  ];

  const fetchCustomerById = useCallback(async () => {
    try {
      setLoading(true)
      const customer = await instance.get(`/customer/${customerId}`);
      setCustomerById(customer.data);
    } catch (e) {
      error(`Error while fetching customer with id. ${e}`)
    } finally {
      setLoading(false)
    }
  }, [customerId]);

  const sendFormToClientEmail = useCallback(async (clientEmail: string) => {
    try {
      await instance.post(`/email/payment-request/${customerId}`, { clientEmail });
      success('Form was successfully sent to the client!');
    } catch (e) {
      error('Problem with sending form to the client. Try again.');
    } finally {
      cancelClientFormSend();
    }
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

  const openActivityModal = useCallback(() => {
    setIsActivityLogsOpen(true)
  }, []);

  const cancelActivityModal = useCallback(() => {
    setIsActivityLogsOpen(false);
  }, [])

  return {
    customerById, fetchCustomerById,

    sendFormToClientEmail, openClientFormEmail, cancelClientFormSend,
    changeAutoPay, isAutoPayEnabled, isClientEmailModalOpen,

    contactSections,

    openActivityModal, cancelActivityModal, isActivityLogsOpen,

    customerByIdLoading: loading
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
  { label: 'Venmo', value: 'venmo' },
  { label: 'Other', value: 'other' },
];

export const newDocumentFormInitialState: IDocumentCreate = {
  metaDescription: '',
  type: 'other',
}

export const documentTypeSelectionOptions = [
  { label: 'TLC License', value: 'tlc_license' },
  { label: 'DL License', value: 'dl_license' },
  { label: 'DDC License', value: 'ddc_license' },
  { label: 'Other', value: 'other' }
]

export const getDocumentFunction = (customerId?: string) => {
  const { success, error } = useNotify();
  const [documents, setDocuments] = useState<IDocument[]>([]);

  const [loading, setLoading] = useState(false);

  const [isDocumentModalOpen, setIsDocumentModalOpen] = useState(false);

  const fetchDocumentsByCustomerId = async () => {
    try {
      setLoading(true);
      const response = await instance.get(`/document/customer/${customerId}`);
      setDocuments(response.data);
    } catch (e) {
      error(`Error while fetching documents: ${e}`)
    } finally {
      setLoading(false)
    }
  }

  const uploadCustomerDocument = useCallback(async (form: IDocumentCreate) => {
    try {
      setLoading(true)
      const formData = new FormData();
      formData.set('customer', customerId!);

      for (const [key, value] of Object.entries(form)) {
        formData.set(key, value);
      }

      await instance.post('/document', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      success('Document successfully uploaded!');
      await fetchDocumentsByCustomerId();
    } catch (e) {
      error('Document upload request have problem. Try again.');
    } finally {
      setLoading(false)
      cancelDocumentModal();
    }
  }, [customerId]);

  const cancelDocumentModal = useCallback(() => {
    setIsDocumentModalOpen(false);
  }, []);

  const openDocumentModal = () => {
    setIsDocumentModalOpen(true)
  }

  return {
    fetchDocumentsByCustomerId, documents,
    uploadCustomerDocument,

    cancelDocumentModal, isDocumentModalOpen, openDocumentModal,

    documentLoading: loading
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
