import { useCallback, useState } from "react";
import type { BaseSyntheticEvent, Dispatch, SetStateAction } from 'react';

import type { DriverVehicleLicenseInfo, IDriver, IDriverCreate } from "@/types/driver/main.ts";
import { instance } from "@/api/axios.ts";
import { Dayjs } from "dayjs";
import { useNotify } from "@/hooks/useNotify/useNotify.tsx";

export const newDriverFormInitialState: IDriverCreate = {
  customer: '',
  firstName: '',
  lastName: '',
  phoneNumber: '',
  email: '',
  dateOfBirth: new Date(Date.now()),
  apartmentNumber: '',
  address: '',
  tlcNumber: '',
  tlcExp: new Date(Date.now()),
  driverLicenseNumber: '',
  driverLicenseExp: new Date(Date.now()),
  lastSSN: '',
  defensiveDriverCourseExp: new Date(Date.now()),
}

export const getDriverFunctions = (customerId?: string) => {
  const { success, error } = useNotify()
  const [isDriverCreateModalOpen, setIsDriverCreateModalOpen] = useState(false);
  const [drivers, setDrivers] = useState<IDriver[]>([]);

  const fetchDrivers = useCallback(async () => {
    const driversByCustomer = await instance.get('/driver/byCustomer', { params: { id: customerId } });
    setDrivers(driversByCustomer.data);
  }, [customerId]);

  const createDriver = useCallback(async (newDriverForm: IDriverCreate) => {
    try {
      await instance.post('/driver', { ...newDriverForm, customer: customerId });
      success('Driver was successfully created!');
    } catch (e) {
      error('There is a problem with driver creation. Try again.');
    } finally {
      await cancelDriverModal();
    }
  }, [customerId]);

  const cancelDriverModal = useCallback(async () => {
    setIsDriverCreateModalOpen(false);
    await fetchDrivers();
  }, []);

  const openDriverModal = useCallback(() => {
    setIsDriverCreateModalOpen(true);
  }, [])

  return {
    isDriverCreateModalOpen,
    drivers, fetchDrivers,
    cancelDriverModal, createDriver,

    openDriverModal
  }
}

export const getDriversUpdateAndCreateFunctions = () => {
  const [vehicleInformation, setVehicleInformation] = useState<DriverVehicleLicenseInfo[]>([]);
  const fetchVehicleInformation = async () => {
    const response = await instance.get('/for_hire_vehicle/driver');
    setVehicleInformation(response.data);
  }

  const changeDriverFormData = useCallback((key: keyof Omit<IDriverCreate, 'dateOfBirth' | 'tlcExp' | 'defensiveDriverCourseExp' | 'driverLicenseExp'>, callback: Dispatch<SetStateAction<IDriverCreate>>) => {
    return (val: BaseSyntheticEvent) => {
      if (key === 'tlcNumber') {
        const vehicleDriver = vehicleInformation.find(vi => vi.license_number === val.target.value);
        if (vehicleDriver) {
          const [firstName, lastName] = vehicleDriver.name.split(',');
          const vehicleFetchedInformation = {
            tlcNumber: vehicleDriver.license_number,
            firstName,
            lastName,
            tlcExp: new Date(vehicleDriver.expiration_date),
          }

          return callback(prev => ({
            ...prev,
            ...vehicleFetchedInformation,
          }))
        }
      }

      callback(prev => ({
        ...prev,
        [key]: val.target.value
      }))
    }
  }, [vehicleInformation]);

  const changeDriverFormTime = useCallback((key: keyof Pick<IDriverCreate, 'dateOfBirth' | 'tlcExp' | 'defensiveDriverCourseExp' | 'driverLicenseExp'>, callback: Dispatch<SetStateAction<IDriverCreate>>) => {
    return (val: Dayjs) => {
      const date = val ? val.toDate() : undefined
      callback(prev => ({
        ...prev,
        [key]: date
      }))
    }
  }, []);

  return {
    changeDriverFormTime, changeDriverFormData, fetchVehicleInformation
  }
}
