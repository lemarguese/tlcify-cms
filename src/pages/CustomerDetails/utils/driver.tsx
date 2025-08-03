import { BaseSyntheticEvent, Dispatch, SetStateAction, useCallback, useState } from "react";
import type { IDriver, IDriverCreate } from "@/types/driver/main.ts";
import { instance } from "@/api/axios.ts";
import { Dayjs } from "dayjs";
import { Button } from "antd";

export const newDriverFormInitialState = {
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
      const date = val ? val.format('MM/DD/YYYY') : null
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
    cancelDriverModal
  }
}
