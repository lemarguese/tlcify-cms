import { useMemo, useState } from "react";
import type { IInvoice } from "@/types/invoice/main.ts";
import { newCustomerFormInitialState } from "@/pages/Customer/utils/customer.tsx";
import { instance } from "@/api/axios.ts";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import { formatCurrency } from "@/utils/payment.ts";
import { useNotify } from "@/hooks/useNotify/useNotify.tsx";

const invoiceInitialState: IInvoice = {
  _id: '',
  customer: { _id: '', ...newCustomerFormInitialState },
  policies: [],
  invoiceNumber: '',
  currency: 'USD',
  status: 'pending',
  issuedAt: new Date(),
}

export const invoiceDetailTableHeaders: ColumnsType = [
  {
    title: "#",
    dataIndex: "key",
    key: "index",
    render: (_text, _, index) => index + 1,
    width: 50,
  },
  {
    title: "Policy Number",
    dataIndex: "number",
    key: "policyNumber",
  },
  {
    title: "Insurance Carrier",
    dataIndex: "insuranceCarrierName",
    key: "insuranceCarrierName",
  },
  {
    title: "Due Amount",
    dataIndex: "amount",
    key: "dueAmount",
    render: (value: number) => formatCurrency(value),
  },
  {
    title: "Fees by Due",
    dataIndex: "totalDueDateFee",
    key: "totalDueDateFee",
    render: (value: number) => formatCurrency(value),
  },
  {
    title: "Due Date",
    dataIndex: "dueDate",
    key: "dueDate",
    render: (value) => dayjs(value).format('MM/DD/YYYY')
  },
]

export const getInvoiceDetailFunctions = (invoiceId?: string) => {
  const [invoiceById, setInvoiceById] = useState<IInvoice>(invoiceInitialState);

  const fetchInvoiceById = async () => {
    const response = await instance.get(`/invoice/${invoiceId}`);
    setInvoiceById(response.data);
  }

  const { totalDueAmount, totalFeesAmount } = useMemo(() => {
    return invoiceById.policies.reduce((acc, item) => {
      acc.totalDueAmount += item.amount;
      acc.totalFeesAmount += item.totalDueDateFee;
      return acc;
    }, { totalDueAmount: 0, totalFeesAmount: 0 })
  }, [invoiceById.policies]);

  const sendInvoiceThroughEmail = async () => {
    await instance.post('/email/policies-invoice', {
      customerId: invoiceById.customer._id,
      invoiceId
    });

    await fetchInvoiceById();
  }

  return {
    fetchInvoiceById,
    invoiceById,
    totalDueAmount: formatCurrency(totalDueAmount),
    totalFeesAmount: formatCurrency(totalFeesAmount),
    totalPrice: formatCurrency(totalDueAmount + totalFeesAmount),
    sendInvoiceThroughEmail
  }
}
