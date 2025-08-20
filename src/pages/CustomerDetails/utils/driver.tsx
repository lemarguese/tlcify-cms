import { useCallback, useState } from "react";
import type { BaseSyntheticEvent, Dispatch, SetStateAction } from 'react';

import type { IDriver, IDriverCreate } from "@/types/driver/main.ts";
import { instance } from "@/api/axios.ts";
import { Dayjs } from "dayjs";
import { Button } from "antd";

export const newDriverFormInitialState: IDriverCreate = {
  customerId: '',
  firstName: '',
  lastName: '',
  phoneNumber: '',
  email: '',
  dateOfBirth: new Date(Date.now()).toLocaleDateString(),
  address: '',
  tlcNumber: '',
  tlcExp: new Date(Date.now()).toLocaleDateString(),
  driverLicenseNumber: '',
  driverLicenseExp: new Date(Date.now()).toLocaleDateString(),
  lastSSN: '',
  defensiveDriverCourseExp: new Date(Date.now()).toLocaleDateString(),
}

export const getDriverFunctions = (customerId?: string) => {
  const [isDriverCreateModalOpen, setIsDriverCreateModalOpen] = useState(false);
  const [drivers, setDrivers] = useState<IDriver[]>([]);

  const addNewDriverButton = <Button onClick={() => setIsDriverCreateModalOpen(true)}>Create Driver</Button>

  const fetchDrivers = useCallback(async () => {
    const driversByCustomer = await instance.get('/driver/byCustomer', { params: { id: customerId } });
    setDrivers(driversByCustomer.data);
  }, [customerId]);

  const createDriver = useCallback(async (newDriverForm: IDriverCreate, resetForm: Dispatch<SetStateAction<IDriverCreate>>) => {
    await instance.post('/driver', { ...newDriverForm, customerId });
    resetForm(newDriverFormInitialState);
    await cancelDriverModal();
  }, [customerId]);

  const changeDriverFormData = useCallback((key: keyof Omit<IDriverCreate, 'dateOfBirth' | 'tlcExp' | 'defensiveDriverCourseExp' | 'driverLicenseExp'>, callback: Dispatch<SetStateAction<IDriverCreate>>) => {
    return (val: BaseSyntheticEvent) => {
      callback(prev => ({
        ...prev,
        [key]: val.target.value
      }))
    }
  }, []);

  const changeDriverFormTime = useCallback((key: keyof Pick<IDriverCreate, 'dateOfBirth' | 'tlcExp' | 'defensiveDriverCourseExp' | 'driverLicenseExp'>, callback: Dispatch<SetStateAction<IDriverCreate>>) => {
    return (val: Dayjs) => {
      const date = val ? val.toDate() : null
      callback(prev => ({
        ...prev,
        [key]: date
      }))
    }
  }, []);

  const cancelDriverModal = useCallback(async () => {
    setIsDriverCreateModalOpen(false);
    await fetchDrivers();
  }, []);

  return {
    isDriverCreateModalOpen,
    drivers, fetchDrivers,
    addNewDriverButton,
    changeDriverFormData, changeDriverFormTime,
    cancelDriverModal, createDriver
  }
}
