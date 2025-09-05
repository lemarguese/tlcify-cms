import { useCallback, useState } from "react";
import type { BaseSyntheticEvent, Dispatch, SetStateAction } from 'react';

import type { DriverVehicleLicenseInfo, IDriver, IDriverCreate } from "@/types/driver/main.ts";
import { instance } from "@/api/axios.ts";
import { Dayjs } from "dayjs";
import { useNotify } from "@/hooks/useNotify/useNotify.tsx";
import lodash from "lodash";
import type { AxiosResponse } from "axios";

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
  const changeDriverFormData = useCallback((key: keyof Omit<IDriverCreate, 'dateOfBirth' | 'tlcExp' | 'defensiveDriverCourseExp' | 'driverLicenseExp'>, callback: Dispatch<SetStateAction<IDriverCreate>>) => {
    return (val: BaseSyntheticEvent) => {
      callback(prev => ({
        ...prev,
        [key]: val.target.value
      }))
    }
  }, []);

  const changeDriverTLCNumber = lodash.debounce(async (val: BaseSyntheticEvent, callback: Dispatch<SetStateAction<IDriverCreate>>) => {
    const driverVehicleInformation: AxiosResponse<DriverVehicleLicenseInfo[]> = await instance.get('/for_hire_vehicle/driver', {
      params: {
        license_number: val.target.value
      }
    });

    if (driverVehicleInformation.data.length) {
      const [vehicleDriver] = driverVehicleInformation.data;

      const [firstName, lastName] = vehicleDriver.name.split(',');
      const vehicleFetchedInformation = {
        tlcNumber: vehicleDriver.license_number,
        firstName,
        lastName: lastName ? lastName : '',
        tlcExp: new Date(vehicleDriver.expiration_date),
      }

      return callback(prev => ({
        ...prev,
        ...vehicleFetchedInformation
      }))
    }
  }, 750)

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
    changeDriverFormTime, changeDriverFormData, changeDriverTLCNumber
  }
}
