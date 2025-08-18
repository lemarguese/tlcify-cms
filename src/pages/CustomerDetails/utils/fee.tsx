import { useCallback, useState } from "react";
import type { BaseSyntheticEvent, Dispatch, SetStateAction } from 'react';

import type { IPolicyFeeCreate } from "@/types/policy/main.ts";
import { Dayjs } from "dayjs";

export const getPolicyFeeFunctions = () => {
  const [isPolicyFeeCreateModalOpen, setIsPolicyFeeCreateModalOpen] = useState(false);

  const changePolicyFeeFormData = useCallback((key: keyof Omit<IPolicyFeeCreate, 'dueDate'>, callback: Dispatch<SetStateAction<IPolicyFeeCreate>>) => {
    return (val: BaseSyntheticEvent | string) => {
      callback(prev => ({
        ...prev,
        [key]: typeof val === 'string' ? val : val.target.value,
      }))
    }
  }, []);

  const changePolicyFeeFormTime = useCallback((key: keyof Pick<IPolicyFeeCreate, 'dueDate'>, callback: Dispatch<SetStateAction<IPolicyFeeCreate>>) => {
    return (val: Dayjs) => {
      const date = val ? val.format('MM/DD/YYYY') : undefined
      callback(prev => ({
        ...prev,
        [key]: date,
      }))
    }
  }, []);

  const openPolicyFeeModal = () => {
    setIsPolicyFeeCreateModalOpen(true)
  }

  const closePolicyFeeModal = () => {
    setIsPolicyFeeCreateModalOpen(false)
  }

  return {
    changePolicyFeeFormTime, changePolicyFeeFormData,
    isPolicyFeeCreateModalOpen, openPolicyFeeModal, closePolicyFeeModal
  }
}

export const newPolicyFeeFormInitialState: Omit<IPolicyFeeCreate, '_id'> = {
  dueDate: '',
  amount: 0,
  type: 'late'
}

export const feeTypeOptions = [
  { label: 'Late', value: 'late' },
  { label: 'Cancellation', value: 'cancellation' },
  { label: 'Return', value: 'return' },
  { label: 'Reinstatement', value: 'reinstatement' },
  { label: 'Additional invoice', value: 'invoice' },
]
