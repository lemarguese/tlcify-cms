import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import { useState } from "react";
import type { IPayment } from "@/types/transactions/main.ts";
import { instance } from "@/api/axios.ts";

export const transactionsTableHeaders: ColumnsType = [
  // TODO What do i need with private fields
  {
    title: "Payment ID",
    dataIndex: "_id",
    key: "_id",
  },
  // {
  //   title: "Policy No.",
  //   dataIndex: ['policy', "policyNumber"],
  //   key: "policyId",
  // },
  // {
  //   title: "Cycle",
  //   dataIndex: "cycle",
  //   key: "cycle",
  // },
  {
    title: "Due Date",
    dataIndex: "dueDate",
    key: "dueDate",
    render: (_, a) => dayjs(a.dueDate).format('MM/DD/YYYY')
  },
  {
    title: "Currency",
    dataIndex: "currency",
    key: "currency",
  },
  {
    title: "Base Amount",
    dataIndex: "baseAmount",
    key: "baseAmount",
  },
  {
    title: "Discount Amount",
    dataIndex: "discountAmount",
    key: "discountAmount",
  },
  {
    title: "Total Paid",
    dataIndex: "totalPaid",
    key: "totalPaid",
  },
  // {
  //   title: "Provider",
  //   dataIndex: "provider",
  //   key: "provider",
  // },
  // {
  //   title: "Provider Ref",
  //   dataIndex: "providerRef",
  //   key: "providerRef",
  // },
  {
    title: "Method",
    dataIndex: "method",
    key: "method",
  },
  {
    title: "Paid At",
    dataIndex: "paidAt",
    key: "paidAt",
    render: (_, a) => dayjs(a.paidAt).format('MM/DD/YYYY')
  },
  {
    title: "Notes",
    dataIndex: "notes",
    key: "notes",
  },
  // {
  //   title: "Created At",
  //   dataIndex: "createdAt",
  //   key: "createdAt",
  // },
  // {
  //   title: "Updated At",
  //   dataIndex: "updatedAt",
  //   key: "updatedAt",
  // }
];

export const transactionsPartialInvoiceHeaders: ColumnsType = [
  {
    title: "No.",
    dataIndex: "index",
    key: "index",
    render: (_, _a, index) => {
      return index + 1;
    }
  },
  {
    title: "Article",
    dataIndex: "productName",
    key: "productName",
  },
  {
    title: "Quantity",
    dataIndex: "productQuantity",
    key: "productQuantity",
    render: (item) => {
      return <div>
        {item}
        <p>Unit(s)</p>
      </div>
    }
  },
  {
    title: "Unit Price",
    dataIndex: "productPrice",
    key: "productPrice",
  },
  {
    title: "VAT",
    dataIndex: "vat",
    key: "vat",
  },
  {
    title: "Amount",
    dataIndex: "amount",
    key: "amount",
  },
  {
    title: "Full Amount",
    dataIndex: "fullAmount",
    key: "fullAmount",
  }
]

export const getTransactionFunctions = () => {
  const [payments, setPayments] = useState<IPayment[]>([]);

  const fetchAllPayments = async () => {
    const rawPayments = await instance.get('/payment');
    setPayments(rawPayments.data);
  };

  return { payments, fetchAllPayments }
}
