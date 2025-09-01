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
import { Tag } from "antd";

export const vehicleLicenseColumns: ColumnsType = [
  { title: "Vehicle License Number", dataIndex: "vehicle_license_number", key: "vehicle_license_number" },
  { title: "Name", dataIndex: "name", key: "name" },
  { title: "License Type", dataIndex: "license_type", key: "license_type" },
  { title: "Expiration Date", dataIndex: "expiration_date", key: "expiration_date" },
  { title: "Permit License Number", dataIndex: "permit_license_number", key: "permit_license_number" },
  { title: "DMV License Plate Number", dataIndex: "dmv_license_plate_number", key: "dmv_license_plate_number" },
  { title: "Vehicle VIN Number", dataIndex: "vehicle_vin_number", key: "vehicle_vin_number" },
  { title: "Certification Date", dataIndex: "certification_date", key: "certification_date" },
  { title: "Hack Up Date", dataIndex: "hack_up_date", key: "hack_up_date" },
  { title: "Vehicle Year", dataIndex: "vehicle_year", key: "vehicle_year" },
  { title: "Base Number", dataIndex: "base_number", key: "base_number" },
  { title: "Base Name", dataIndex: "base_name", key: "base_name" },
  { title: "Base Type", dataIndex: "base_type", key: "base_type" },
  { title: "Vehicle Type", dataIndex: "veh", key: "veh" },
  { title: "Base Telephone Number", dataIndex: "base_telephone_number", key: "base_telephone_number" },
  { title: "Base Address", dataIndex: "base_address", key: "base_address" },
  { title: "Reason", dataIndex: "reason", key: "reason" },
  { title: "Last Date Updated", dataIndex: "last_date_updated", key: "last_date_updated" },
  { title: "Last Time Updated", dataIndex: "last_time_updated", key: "last_time_updated" },
  {
    title: "Status", dataIndex: "active", key: "active", render: (isActive) => <>
      <Tag color={isActive ? 'green' : 'red'}>{isActive ? 'Active' : 'Inactive'}</Tag>
    </>,
  },
];


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
  const [policyById, setPolicyById] = useState<IPolicy>(policyInitialState);
  const [paymentsByPolicy, setPaymentsByPolicy] = useState<IPayment[]>([]);

  const [isPolicyFeeDeleteModalOpen, setIsPolicyFeeDeleteModalOpen] = useState(false);
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

  const fetchPaymentsByPolicy = useCallback(async () => {
    const payments = await instance.get(`/payment/byPolicy/${policyId}`);
    setPaymentsByPolicy(payments.data);
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

  const installmentsDescriptionItems: DescriptionsProps['items'] = useMemo(() => {
    const policyCycles = policyById.cycles;

    const { totalScheduledAmount, totalDueNowAmount } = policyCycles.reduce((acc, item) => {
      acc.totalScheduledAmount += item.baseAmount;
      acc.totalDueNowAmount += item.amountRemaining - item.carryOver;

      return acc;
    }, { totalScheduledAmount: 0, totalDueNowAmount: 0 })

    const descriptionItems = policyCycles.map(({
                                                 dueDate,
                                                 baseAmount,
                                                 carryOver,
                                                 amountRemaining,
                                               }, index) => {
      return {
        label: `Cycle ${index + 1}`,
        key: `cycle_${index + 1}`,
        children: <div className='policy_detail_page_body_left_installments_content'>
          <div className='policy_detail_page_body_left_installments_content_item'>
            <strong>Due Date:</strong>
            <p>{dayjs(dueDate).format('MM/DD/YYYY')}</p>
          </div>
          <div className='policy_detail_page_body_left_installments_content_item'>
            <strong>Monthly amount:</strong>
            <p>{baseAmount.toFixed(2)}</p>
          </div>
          <div className='policy_detail_page_body_left_installments_content_item'>
            <strong>Due amount:</strong>
            <p>{amountRemaining - carryOver}</p>
          </div>
          <div className='policy_detail_page_body_left_installments_content_item'>
            <strong>Type:</strong>
            <p>Monthly</p>
          </div>
        </div>
      }
    });

    descriptionItems.push({
      label: '',
      key: 'policy_detail_total_amounts',
      children: <div className='policy_detail_page_body_left_installments_content_footer'>
        <div className='policy_detail_page_body_left_installments_content_footer_item'>
          <strong>Total Scheduled amount: </strong>
          <p>{totalScheduledAmount}</p>
        </div>
        <div className='policy_detail_page_body_left_installments_content_footer_item'>
          <strong>Total Remaining amount: </strong>
          <p>{totalDueNowAmount}</p>
        </div>
      </div>
    })

    return descriptionItems as DescriptionsProps['items'];
  }, [policyById.cycles]);


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
        for (let i = policyById.deposit ? 1 : 0; i < +policyById.installmentCount; i++) {
          everyMonthDueDates.push(effectiveDate.set('month', effectiveDate.get('month') + i));
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

  return {
    fetchPolicyById, policyById,
    policyDescriptionItems,
    policyFeeSelection, selectedPolicyFee,
    calendarTileTypes,
    isPolicyFeeDeleteModalOpen, policyFeeDeletionButton, updatePolicyFee, cancelPolicyFeeModal,

    // payments
    fetchPaymentsByPolicy, paymentsByPolicy,

    // installments

    installmentsDescriptionItems
  }
}
