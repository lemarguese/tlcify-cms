import { useCallback, useState } from "react";
import type { BaseSyntheticEvent, Dispatch, SetStateAction } from 'react';

import type { DriverVehicleLicenseInfo, IDriver, IDriverCreate, IDriverUpdate } from "@/types/driver/main.ts";
import { instance } from "@/api/axios.ts";
import { Dayjs } from "dayjs";
import { useNotify } from "@/hooks/useNotify/useNotify.tsx";
import lodash from "lodash";
import type { AxiosResponse } from "axios";
import type { TableRowSelection } from "antd/es/table/interface";

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
  const [isDriverUpdateModalOpen, setIsDriverUpdateModalOpen] = useState(false);
  const [isDriverDeleteModalOpen, setIsDriverDeleteModalOpen] = useState(false);

  const [selectedDriver, setSelectedDriver] = useState<IDriver>()

  const [driversSelection] = useState<TableRowSelection>({
    onSelect: (_, _s, multipleRows) => {
      const isMultipleSelected = multipleRows.length > 1;
      const [rowSelectedCustomer] = multipleRows as IDriver[];

      setSelectedDriver(!isMultipleSelected ? rowSelectedCustomer : undefined);
    },
  });

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

  const updateDriver = useCallback(async (updateDriverForm: IDriverUpdate) => {
    try {
      const touchedFormFields: { [k: string]: unknown } = {};

      Object.entries(updateDriverForm).forEach(([key, value]) => {
        if (selectedDriver) {
          if (selectedDriver[key as keyof IDriver] !== updateDriverForm[key as keyof IDriverUpdate]) {
            touchedFormFields[key] = value;
          }
        }
      });

      await instance.patch('/driver', touchedFormFields);
      success('Driver was successfully updated!');
    } catch (e) {
      error('There is a problem with driver update. Try again.');
    } finally {
      await cancelUpdateModal();
      await fetchDrivers();
    }
  }, [selectedDriver]);

  const deleteDriver = useCallback(async () => {
    try {
      await instance.delete(`/driver/${selectedDriver!._id}`);
      success('Driver was successfully deleted!');
      await fetchDrivers();
    } catch (e) {
      error('There is a problem with driver deletion. Try again.');
    }
    await cancelDriverDeleteModal();
  }, [selectedDriver]);

  const cancelDriverModal = useCallback(async () => {
    setIsDriverCreateModalOpen(false);
    await fetchDrivers();
  }, []);

  const openDriverModal = useCallback(() => {
    setIsDriverCreateModalOpen(true);
  }, []);

  const openUpdateModal = useCallback(() => {
    setIsDriverUpdateModalOpen(true);
  }, [])

  const cancelUpdateModal = useCallback(() => {
    setIsDriverUpdateModalOpen(false);
  }, []);

  const openDriverDeleteModal = useCallback(() => {
    setIsDriverDeleteModalOpen(true);
  }, []);

  const cancelDriverDeleteModal = useCallback(() => {
    setIsDriverDeleteModalOpen(false);
  }, [])

  return {
    isDriverCreateModalOpen,
    drivers, fetchDrivers,
    cancelDriverModal, createDriver,

    cancelUpdateModal, openUpdateModal, isDriverUpdateModalOpen,
    driversSelection, updateDriver, selectedDriver,

    cancelDriverDeleteModal, openDriverDeleteModal, isDriverDeleteModalOpen, deleteDriver,

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
