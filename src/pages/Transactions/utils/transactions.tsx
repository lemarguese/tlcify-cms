import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import { useCallback, useMemo, useState } from "react";
import type { IPayment, IPaymentQuery } from "@/types/transactions/main.ts";
import { instance } from "@/api/axios.ts";
import Button from "@/components/Button/Button.tsx";
import { useNotify } from "@/hooks/useNotify/useNotify.tsx";

export const transactionsTableHeaders: ColumnsType = [
  // TODO What do i need with private fields
  // {
  //   title: "Payment ID",
  //   dataIndex: "_id",
  //   key: "_id",
  // },
  {
    title: "Insured Name",
    dataIndex: ['policy', 'customer'],
    key: "policy",
    render: (record) => record.firstName && record.lastName ? `${record.firstName} ${record.lastName}` : record.corporationName
  },
  {
    title: "Policy No.",
    dataIndex: ['policy', "policyNumber"],
    key: "policy",
  },
  {
    title: "Insurance Company",
    dataIndex: ['policy', "insurance", 'name'],
    key: "policy",
  },
  {
    title: "Due Date",
    dataIndex: "dueDate",
    key: "dueDate",
    render: (_, a) => dayjs(a.dueDate).format('MM/DD/YYYY'),
    sorter: (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime(),
  },
  // {
  //   title: "Currency",
  //   dataIndex: "currency",
  //   key: "currency",
  // },
  {
    title: "Base Amount",
    dataIndex: "baseAmount",
    key: "baseAmount",
    render: (value) => value.toFixed(2)
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
];

export const transactionsReportsTableHeaders: ColumnsType = [
  {
    title: "Payment type",
    dataIndex: "paymentType",
    key: "paymentType",
  },
  {
    title: "Premium",
    dataIndex: "premiumPrice",
    key: "premiumPrice",
  },
  {
    title: "Fee",
    dataIndex: "premiumFee",
    key: "premiumFee",
  },
  {
    title: "Total",
    dataIndex: "totalPrice",
    key: "totalPrice",
  },
];

export const transactionsFilterSelectionOptions = [
  { label: 'Venmo', value: 'venmo' },
  { label: 'Zelle', value: 'zelle' },
  { label: 'Cash', value: 'cash' },
  { label: 'Card', value: 'card' },
  { label: 'Other', value: 'other' },
]

export const getTransactionFunctions = () => {
  const { error, success } = useNotify();

  const [payments, setPayments] = useState<IPayment[]>([]);
  const [query, setQuery] = useState<IPaymentQuery>()

  const [loading, setLoading] = useState(false)

  const fetchAllPayments = async () => {
    try {
      setLoading(true);
      const rawPayments = await instance.get('/payment', {
        params: query
      });
      setPayments(rawPayments.data);
    } catch (e) {
      error(`Error while fetching transactions: ${e}`);
    } finally {
      setLoading(false);
    }
  };

  const changeQuerySelector = useCallback((key: keyof IPaymentQuery) => {
    return (val: string) => {
      setQuery(prev => ({
        ...prev,
        [key]: val
      }))
    }
  }, []);

  // todo any
  const changeQueryDate = useCallback((val: any[] | null) => {
    setQuery(prev => ({
      ...prev,
      fromDate: val ? val[0].toDate() : undefined,
      toDate: val ? val[1].toDate() : undefined
    }))
  }, []);

  const resetQuery = useCallback(async () => {
    setQuery(prev => {
      if (prev) {
        fetchAllPayments()
        return undefined;
      }
    })
  }, []);

  const { reportsData, grandTotal } = useMemo(() => {
    const data = payments.reduce((acc, item) => {
      const policy = item.policy;
      const feesAmount = policy.cycles[item.cycle].fees.reduce((acc, f) => acc + f.amount, 0);

      acc.push({
        premiumFee: feesAmount,
        premiumPrice: item.totalPaid - feesAmount,
        paymentType: item.method,
        totalPrice: item.totalPaid
      })

      return acc;
    }, [] as { paymentType: string, premiumPrice: number, premiumFee: number, totalPrice: number }[]);

    const grandTotal = data.reduce((acc, item) => {
      acc.totalPrice += item.totalPrice;
      acc.totalPremiumPrice += item.premiumPrice;
      acc.totalPremiumFee += item.premiumFee;

      return acc;
    }, {
      totalPrice: 0,
      totalPremiumFee: 0,
      totalPremiumPrice: 0
    })

    // todo any
    return {
      grandTotal,
      reportsData: Object.values(
        data.reduce((acc, cur) => {
          if (!acc[cur.paymentType]) {
            acc[cur.paymentType] = {
              paymentType: cur.paymentType,
              premiumFee: 0,
              premiumPrice: 0,
              totalPrice: 0
            };
          }
          acc[cur.paymentType].premiumFee += cur.premiumFee;
          acc[cur.paymentType].premiumPrice += cur.premiumPrice;
          acc[cur.paymentType].totalPrice += cur.totalPrice;
          return acc;
        }, {} as any)) as any[]
    }
  }, [payments]);

  const getPaymentsExcel = async () => {
    try {
      const response = await instance.get('/document/payments-excel', {
        responseType: 'blob',
        params: query
      });

      const blob = new Blob([response.data], { type: response.headers["content-type"] });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.setAttribute("download", "payments.xlsx"); // custom filename
      document.body.appendChild(link);
      link.click();
      link.remove();

      success('Successfully exported excel of transactions!');
    } catch (e) {
      error(`Error while exporting excel of payments: ${e}`)
    }
  }

  const transactionTableActions = <div>
    <Button variant='solid' type='primary' color='green' onClick={getPaymentsExcel}>Get Excel Report</Button>
  </div>

  return {
    payments,
    fetchAllPayments,
    changeQueryDate,
    changeQuerySelector,
    query,
    resetQuery,
    reportsData,
    grandTotal,
    transactionTableActions,

    transactionsLoading: loading
  }
}
