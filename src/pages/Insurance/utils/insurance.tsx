import type { ColumnsType } from "antd/es/table";
import { BaseSyntheticEvent, Dispatch, SetStateAction, useCallback, useState } from "react";
import { instance } from "@/api/axios.ts";
import type { IInsurance, IInsuranceCreate } from "@/types/insurance/main.ts";
import Button from "@/components/Button/Button.tsx";
import { newPolicyFormInitialState } from "@/pages/CustomerDetails/utils/policy.tsx";

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

export const newInsuranceFormInitialState: IInsuranceCreate = {
  name: '',
  naicCode: '',
  brokerCode: '',
  commissionFee: 0
}

export const getInsuranceFunctions = () => {
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
    await instance.post('/insurance', newInsuranceForm);
    resetForm(newInsuranceFormInitialState);
    await cancelInsuranceModal();
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
