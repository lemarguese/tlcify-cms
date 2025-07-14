import type { ColumnsType } from "antd/es/table";
import { Tag } from "antd";

export const transactionsTableHeaders: ColumnsType = [
  {
    title: "Transaction ID",
    dataIndex: "transactionId",
    key: "transactionId",
  },
  {
    title: "Placed Date",
    dataIndex: "createdAt",
    key: "createdAt",
  },
  { title: "Order By", dataIndex: "phoneNumber", key: "phoneNumber" },
  { title: "Address", dataIndex: "address", key: "address" },
  { title: "Amount", dataIndex: "address", key: "address" },
  {
    title: "Status", dataIndex: "status", key: "status", render: () => <>
      <Tag color={'green'}>Processed</Tag>
    </>,
  }
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
