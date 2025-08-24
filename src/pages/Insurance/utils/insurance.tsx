import type { ColumnsType } from "antd/es/table";

import { useCallback, useState } from "react";
import type { BaseSyntheticEvent, Dispatch, SetStateAction } from 'react';

import { instance } from "@/api/axios.ts";
import type { IInsurance, IInsuranceCreate } from "@/types/insurance/main.ts";
import Button from "@/components/Button/Button.tsx";
import { useNotify } from "@/hooks/useNotify/useNotify.tsx";

export const insuranceTableHeaders: ColumnsType = [
  {
    title: "Carrier name",
    dataIndex: "name",
    key: "name",
    sorter: (a, b) => a.firstName.localeCompare(b.firstName)
  },
  {
    title: "NAIC Code",
    dataIndex: "naicCode",
    key: "naicCode",
    sorter: (a, b) => a.lastName.localeCompare(b.lastName)
  },
  {
    title: "Commission fee",
    dataIndex: "commissionFee",
    key: "commissionFee",
    sorter: (a, b) => a.lastName.localeCompare(b.lastName)
  },
  {
    title: "Broker code",
    dataIndex: "brokerCode",
    key: "brokerCode",
    sorter: (a, b) => a.lastName.localeCompare(b.lastName)
  },
];

export const insuranceTitles: { [k in keyof Omit<IInsurance, "_id">]: string } = {
  name: 'Carrier name',
  naicCode: 'NAIC Code',
  brokerCode: 'Broker code',
  commissionFee: 'Commission Fee'
}

export const newInsuranceFormInitialState: IInsuranceCreate = {
  name: '',
  naicCode: '',
  brokerCode: '',
  commissionFee: 0
}

export const getInsuranceFunctions = () => {
  const { success, error } = useNotify();
  const [insurances, setInsurances] = useState<IInsurance[]>([]);
  const [isInsuranceModalOpen, setIsInsuranceModalOpen] = useState(false);

  const fetchInsurances = useCallback(async () => {
    const insurances = await instance.get('/insurance');
    setInsurances(insurances.data);
  }, []);

  const addNewInsuranceButton = <div>
    <Button onClick={() => setIsInsuranceModalOpen(true)}>Add insurance carrier</Button>
  </div>

  const submitForm = useCallback(async (newInsuranceForm: IInsuranceCreate, resetForm: Dispatch<SetStateAction<IInsuranceCreate>>) => {
    try {
      await instance.post('/insurance', newInsuranceForm);
      resetForm(newInsuranceFormInitialState);
      success('Insurance was successfully created!');
      await fetchInsurances();
    } catch (e) {
      error('Oops... Seems we have problem with insurance creation. Try again.');
    } finally {
      await cancelInsuranceModal();
    }
  }, []);

  const changeInsuranceFormData = useCallback((key: keyof IInsuranceCreate, callback: Dispatch<SetStateAction<IInsuranceCreate>>) => {
    return (val: BaseSyntheticEvent) => {
      callback(prev => ({
        ...prev,
        [key]: val.target.value
      }))
    }
  }, []);

  const cancelInsuranceModal = useCallback(async () => {
    setIsInsuranceModalOpen(false);
    await fetchInsurances();
  }, [])

  return {
    fetchInsurances,
    insurances,
    addNewInsuranceButton,
    isInsuranceModalOpen,
    cancelInsuranceModal,
    changeInsuranceFormData,
    submitForm
  }
}
