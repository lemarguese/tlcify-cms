import { useCallback, useMemo, useState } from "react";
import type { ColumnsType } from "antd/es/table";
import { instance } from "@/api/axios.ts";
import type { IPolicy, IPolicyFee } from "@/types/policy/main.ts";
import { policyInitialState } from "@/pages/CustomerDetails/utils/policy.tsx";
import type { DescriptionsProps } from "antd";
import dayjs from "dayjs";
import type { TileArgs } from "react-calendar";
import type { TableRowSelection } from "antd/es/table/interface";
import Button from "@/components/Button/Button.tsx";
import type { IPayment } from "@/types/transactions/main.ts";
import type { IAuditLog } from "@/types/audit_log/main.ts";
import { useNotify } from "@/hooks/useNotify/useNotify.tsx";
import type { IPaymentCreate } from "@/types/transactions/main.ts";

export const policyFeesTableHeaders: ColumnsType = [
  {
    title: "Fee Type",
    dataIndex: 'type',
    key: 'type',
  },
  {
    title: "Amount",
    dataIndex: 'amount',
    key: 'amount',
  },
  {
    title: "Due date",
    dataIndex: 'dueDate',
    key: 'dueDate',
    render: (value) => dayjs(value).format('MM/DD/YYYY')
  },
];

export const installmentTableHeaders: ColumnsType = [
  {
    title: "#",
    dataIndex: 'index',
    key: 'index',
    render: (_v, _, i) => i + 1
  },
  {
    title: "Due date",
    dataIndex: 'dueDate',
    key: 'dueDate',
    render: (value) => dayjs(value).format('MM/DD/YYYY')
  },
  {
    title: "Scheduled amount",
    dataIndex: 'monthlyAmount',
    key: 'monthlyAmount',
  },
  {
    title: "Due now",
    dataIndex: 'dueAmount',
    key: 'dueAmount',
  },
  {
    title: "Net to Carrier",
    dataIndex: 'netToCarrier',
    key: 'netToCarrier',
  },
];

export const calendarTileStatuses = [
  { color: '#ef4444', type: 'fee' },
  { color: '#0085FF', type: 'due' },
  { color: '#ffff76', type: 'today' }
];

const policyTitles: { [k in keyof Omit<IPolicy, '_id' | 'cycles' | 'customer' | 'insurance' | 'fees' | 'matchedFees'>]: string } = {
  policyNumber: 'Policy Number',
  type: 'Policy Type',
  status: 'Policy Status',
  effectiveDate: 'Effective Date',
  expirationDate: 'Expiration Date',
  policyTerm: 'Policy Term',
  premiumPrice: 'Premium Price',
  installmentCount: 'Installment count',
  monthlyPayment: 'Monthly Payment',
  deposit: 'Deposit'
}

export const getPolicyDetailFunctions = (policyId?: string) => {
  const { error, success } = useNotify();
  const [policyById, setPolicyById] = useState<IPolicy>(policyInitialState);

  const [isPolicyFeeDeleteModalOpen, setIsPolicyFeeDeleteModalOpen] = useState(false);
  const [isPolicyActivityOpen, setIsPolicyActivityOpen] = useState(false);

  const [isPaymentCreateModalOpen, setIsPaymentCreateModalOpen] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);

  const [selectedPolicyFee, setSelectedPolicyFee] = useState<IPolicyFee>();

  const [policyFeeSelection] = useState<TableRowSelection>({
    onSelect: (_, _s, multipleRows) => {
      const isMultipleSelected = multipleRows.length > 1;
      const [selectedFee] = multipleRows as IPolicyFee[];

      setSelectedPolicyFee(!isMultipleSelected ? selectedFee : undefined);
    },
  });

  const policyFeeDeletionButton =
    selectedPolicyFee ? <div><Button variant='outlined' color='danger'
                                     onClick={() => setIsPolicyFeeDeleteModalOpen(true)}>Delete policy fee</Button>
    </div> : undefined

  const fetchPolicyById = useCallback(async () => {
    const policyById = await instance.get(`/policy/${policyId}`);
    setPolicyById(policyById.data);
  }, [policyId]);

  // TODO __v, createdAt, updatedAt needs to be removed
  const policyDescriptionItems: DescriptionsProps['items'] = Object.entries(policyById)
    .filter(([k, _]) => !['_id', 'insurance', 'customer', 'customEffectiveDate', 'matchedFees', 'cycles', 'amountDue', 'dueDate', 'fees', 'createdAt', 'updatedAt', 'type', 'status'].includes(k))
    .map(([policyKey, policyValue]) => {
      let children = policyValue;
      if (['effectiveDate', 'expirationDate'].includes(policyKey)) children = dayjs(policyValue).format('MM/DD/YYYY');

      return {
        label: policyTitles[policyKey as keyof Omit<IPolicy, '_id' | 'cycles' | 'customer' | 'insurance' | 'fees' | 'matchedFees'>],
        key: policyKey,
        children
      }
    });

  const installmentsTableItems = useMemo(() => {
    const policyCycles = policyById.cycles;
    const carrier = policyById.insurance;

    const { totalScheduledAmount, totalDueNowAmount, totalNetToCarrier } = policyCycles.reduce((acc, item) => {
      acc.totalScheduledAmount += item.baseAmount;
      acc.totalDueNowAmount += item.amountRemaining - item.carryOver;
      acc.totalNetToCarrier += item.baseAmount - item.baseAmount * (carrier.commissionFee / 100)

      return acc;
    }, { totalScheduledAmount: 0, totalDueNowAmount: 0, totalNetToCarrier: 0 });

    return policyCycles.map(el => ({
      dueDate: dayjs(el.dueDate).format('MM/DD/YYYY'),
      monthlyAmount: el.baseAmount.toFixed(2),
      netToCarrier: (el.baseAmount - el.baseAmount * (carrier.commissionFee / 100)).toFixed(2),
      dueAmount: (el.amountRemaining - el.carryOver).toFixed(2),
      totalScheduledAmount: totalScheduledAmount.toFixed(2),
      totalDueNowAmount: totalDueNowAmount.toFixed(2),
      totalNetToCarrier: totalNetToCarrier.toFixed(2)
    }))
  }, [policyById.cycles, policyById.insurance]);

  const calendarTileTypes = (type: 'fee' | 'due') => ({ date, view }: TileArgs) => {
    // Add class to tiles in month view only
    if (view === 'month') {
      if (type === 'fee') {
        if (policyById.fees.find(policyFee => dayjs(policyFee.dueDate).isSame(dayjs(date)))) {
          return 'policy_detail_page_body_right_calendar_tile_fee';
        }
      } else {
        const everyMonthDueDates = [];
        const effectiveDate = dayjs(policyById.effectiveDate);

        const dueDate = dayjs(policyById.customEffectiveDate ? policyById.customEffectiveDate : policyById.effectiveDate);

        for (let i = 0; i < +policyById.installmentCount; i++) {
          if (i === 0 && policyById.deposit) {
            everyMonthDueDates.push(effectiveDate.add(i, 'month'));
            continue;
          }

          everyMonthDueDates.push(dueDate.add(i, 'month'));
        }

        if (everyMonthDueDates.find(dueDate => dueDate.isSame(date))) {
          return 'policy_detail_page_body_right_calendar_tile_due';
        }
      }
    }
  }

  const updatePolicyFee = useCallback(async () => {
    const updatedPolicyFees = policyById.fees.filter(policyFee => policyFee._id !== selectedPolicyFee!._id);
    await instance.patch(`/policy/${policyById._id}`, { fees: updatedPolicyFees });

    await cancelPolicyFeeModal();
    await fetchPolicyById();
  }, []);

  const cancelPolicyFeeModal = useCallback(async () => {
    setSelectedPolicyFee(undefined);
    setIsPolicyFeeDeleteModalOpen(false);
  }, []);

  const cancelPolicyActivity = useCallback(() => {
    setIsPolicyActivityOpen(false);
  }, []);

  const openPolicyActivity = useCallback(() => {
    setIsPolicyActivityOpen(true)
  }, []);

  // payments

  const createPayment = useCallback(async (paymentForm: IPaymentCreate) => {
    try {
      setPaymentLoading(true)
      await instance.post('/payment/application', {
        ...paymentForm,
        policyId: policyId,
        provider: paymentForm.method.toUpperCase(),
      });
      success('Payment successfully created!');
      await fetchPolicyById();
    } catch (e) {
      error('Oops... Problem with payment creation. Try again.');
    } finally {
      setPaymentLoading(false)
      cancelPaymentCreateModal();
    }
  }, []);

  const cancelPaymentCreateModal = () => {
    setIsPaymentCreateModalOpen(false);
  }

  const openPaymentCreateModal = () => {
    setIsPaymentCreateModalOpen(true)
  }

  return {
    fetchPolicyById, policyById,
    policyDescriptionItems,
    policyFeeSelection, selectedPolicyFee,
    calendarTileTypes,
    isPolicyFeeDeleteModalOpen, policyFeeDeletionButton, updatePolicyFee, cancelPolicyFeeModal,

    // installments

    installmentsTableItems,

    // activity
    openPolicyActivity, cancelPolicyActivity, isPolicyActivityOpen,

    // payments

    isPaymentCreateModalOpen, cancelPaymentCreateModal, openPaymentCreateModal, createPayment,

    paymentLoading
  }
}

export const getPolicyPaymentsFunctions = (policyId?: string) => {
  const { error, success } = useNotify();
  const [selectedPayment, setSelectedPayment] = useState<IPayment>();

  const [paymentsByPolicy, setPaymentsByPolicy] = useState<IPayment[]>([]);

  const [isPaymentVoidModalOpen, setIsPaymentVoidModalOpen] = useState(false);

  const [paymentSelection] = useState<TableRowSelection>({
    onSelect: (_, _s, multipleRows) => {
      const isMultipleSelected = multipleRows.length > 1;
      const [rowSelectedPayment] = multipleRows as IPayment[];

      setSelectedPayment(!isMultipleSelected ? rowSelectedPayment : undefined);
    },
    getCheckboxProps: (record) => ({
      disabled: record.isDeleted, // Column configuration not to be checked
    }),
  });

  const fetchPaymentsByPolicy = useCallback(async () => {
    const payments = await instance.get(`/payment/byPolicy/${policyId}`);
    setPaymentsByPolicy(payments.data);
  }, [policyId]);

  const voidPayment = useCallback(async () => {
    try {
      await instance.delete(`/payment/${selectedPayment!._id}`);
      success('Payment successfully voided!');
    } catch (e) {
      error('Error while voiding the payment. Try again...');
    } finally {
      cancelPaymentVoidModal();
    }
  }, [selectedPayment]);

  const sendReceiptForPayment = useCallback(async () => {
    try {
      await instance.post(`/email/payment-receipt`, {
        paymentId: selectedPayment!._id
      });
      success('Receipt successfully sent!');
    } catch (e) {
      console.log(e)
      error('Error while sending receipt. Try again...');
    }
  }, [selectedPayment]);

  const cancelPaymentVoidModal = () => {
    setIsPaymentVoidModalOpen(false);
  }

  const openPaymentVoidModal = () => {
    setIsPaymentVoidModalOpen(true)
  }

  return {
    isPaymentVoidModalOpen, cancelPaymentVoidModal, openPaymentVoidModal,

    selectedPayment, voidPayment, paymentSelection,

    fetchPaymentsByPolicy, paymentsByPolicy,
    sendReceiptForPayment
  }
}

export const getPolicyActivityFunctions = (policyId?: string) => {
  const [activities, setActivities] = useState<IAuditLog[]>([]);

  const fetchPolicyActivities = async () => {
    const response = await instance.get(`/audit/policy/${policyId}`);
    setActivities(response.data);
  }

  return {
    fetchPolicyActivities, activities
  }
}
