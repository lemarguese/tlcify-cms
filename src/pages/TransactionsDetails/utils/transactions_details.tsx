import { useMemo, useState } from "react";
import type { IPayment } from "@/types/transactions/main.ts";
import { policyInitialState } from "@/pages/CustomerDetails/utils/policy.tsx";
import { instance } from "@/api/axios.ts";
import { useNotify } from "@/hooks/useNotify/useNotify.tsx";
import dayjs from "dayjs";
import { formatCurrency } from "@/utils/payment.ts";
import type { AxiosError } from "axios";

const transactionInitialState: IPayment = {
  _id: '',
  policy: policyInitialState,
  transactionNumber: '',
  cycle: 0,
  dueDate: new Date(),
  currency: 'USD',
  baseAmount: 0,
  discountAmount: 0,
  totalPaid: 0,
  provider: '',
  providerRef: '',
  method: 'other',
  createdAt: new Date(),
  updatedAt: new Date(),
  isDeleted: false,
  deletedAt: new Date()
}

export const getTransactionDetailsFunctions = (transactionId?: string) => {
  const { error } = useNotify();

  const [transactionById, setTransactionById] = useState<IPayment>(transactionInitialState);

  const fetchTransactionById = async () => {
    try {
      const response = await instance.get(`/payment/${transactionId}`);
      setTransactionById(response.data);
    } catch (e: unknown) {
      error((e as AxiosError).message);
    }
  }

  const cellInformation = useMemo(() => {
    return {
      transactionNumber: transactionById.transactionNumber,
      transactionReceivedDate: dayjs(transactionById.paidAt).format('MM/DD/YYYY HH:mm:ss'),
      transactionDueDate: dayjs(transactionById.dueDate).format('MM/DD/YYYY'),

      policyNumber: transactionById.policy.policyNumber,
      policyEffectiveDate: dayjs(transactionById.policy.effectiveDate).format('MM/DD/YYYY'),
      policyExpirationDate: dayjs(transactionById.policy.expirationDate).format('MM/DD/YYYY'),

      customerFullName: transactionById.policy.customer.firstName && transactionById.policy.customer.lastName ? `${transactionById.policy.customer.firstName} ${transactionById.policy.customer.lastName}` : transactionById.policy.customer.corporationName,
      customerAddress: transactionById.policy.customer.address,
      customerEmail: transactionById.policy.customer.email,

      insuranceCarrierName: transactionById.policy.insurance.name,

      subtotalPrice: formatCurrency(transactionById.totalPaid),
      // TODO Taxes??
      taxPrice: formatCurrency(0),
      totalPrice: formatCurrency(transactionById.totalPaid)
    }
  }, [transactionById])

  return {
    fetchTransactionById, cellInformation
  }
}
