import { useCallback, useState } from "react";
import type { BaseSyntheticEvent, Dispatch, SetStateAction } from 'react';

import type { DriverVehicleLicenseInfo, IDriver, IDriverCreate, IDriverUpdate } from "@/types/driver/main.ts";
import { instance } from "@/api/axios.ts";
import dayjs, { Dayjs } from "dayjs";
import { useNotify } from "@/hooks/useNotify/useNotify.tsx";
import lodash from "lodash";
import type { AxiosResponse } from "axios";
import type { TableRowSelection } from "antd/es/table/interface";
import type { ColumnsType } from "antd/es/table";
import { Tag } from "antd";

export const driversTableHeaders: ColumnsType = [
  {
    title: "Name",
    dataIndex: "fullName",
    key: "fullName",
    render: (_, record) => record.firstName && record.lastName ? `${record.firstName} ${record.lastName}` : record.corporationName,
  },
  { title: "Phone Number", dataIndex: "phoneNumber", key: "phoneNumber" },
  { title: "Address", dataIndex: "address", key: "address" },
  { title: "TCL Number", dataIndex: "tlcNumber", key: "tlcFhvNumber" },
  {
    title: "TLC Expiration.",
    dataIndex: "tlcExp",
    key: "tlcExp",
    render: (value) => dayjs(value).format('MM/DD/YYYY'),
    sorter: (a, b) => new Date(a.tlcExp).getTime() - new Date(b.tlcExp).getTime(),
  },
  { title: "DL Number", dataIndex: "driverLicenseNumber", key: "driverLicenseNumber" },
  {
    title: "DL Expiration.",
    dataIndex: "driverLicenseExp",
    key: "driverLicenseExp",
    render: (value) => dayjs(value).format('MM/DD/YYYY'),
    sorter: (a, b) => new Date(a.driverLicenseExp).getTime() - new Date(b.driverLicenseExp).getTime(),
  },
  {
    title: "DDC Expiration.",
    dataIndex: "defensiveDriverCourseExp",
    key: "defensiveDriverCourseExp",
    render: (value) => dayjs(value).format('MM/DD/YYYY'),
    sorter: (a, b) => new Date(a.defensiveDriverCourseExp).getTime() - new Date(b.defensiveDriverCourseExp).getTime(),
  },
  {
    title: "Status", dataIndex: "status", key: "status", render: () => <>
      <Tag color={'green'}>Active</Tag>
    </>,
  }
];

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

  const [loading, setLoading] = useState(false);

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
    try {
      setLoading(true)
      const driversByCustomer = await instance.get('/driver/byCustomer', { params: { id: customerId } });
      setDrivers(driversByCustomer.data);
    } catch (e) {
      error(`Error while fetching drivers: ${e}`)
    } finally {
      setLoading(false);
    }
  }, [customerId]);

  const createDriver = useCallback(async (newDriverForm: IDriverCreate) => {
    try {
      setLoading(true)
      await instance.post('/driver', { ...newDriverForm, customer: customerId });
      success('Driver was successfully created!');
    } catch (e) {
      error('There is a problem with driver creation. Try again.');
    } finally {
      setLoading(false)
      await cancelDriverModal();
    }
  }, [customerId]);

  const updateDriver = useCallback(async (updateDriverForm: IDriverUpdate) => {
    try {
      setLoading(true)
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
      setLoading(false)
      await cancelUpdateModal();
      await fetchDrivers();
    }
  }, [selectedDriver]);

  const deleteDriver = useCallback(async () => {
    try {
      setLoading(true)
      await instance.delete(`/driver/${selectedDriver!._id}`);
      success('Driver was successfully deleted!');
      await fetchDrivers();
    } catch (e) {
      error('There is a problem with driver deletion. Try again.');
    } finally {
      setLoading(false)
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

    openDriverModal,

    driverLoading: loading,
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
