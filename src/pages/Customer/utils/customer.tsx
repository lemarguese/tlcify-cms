import { Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import type { ICustomerCreate, ICustomer, ICustomerUpdate, CustomerVehicleLicenseInfo } from "@/types/customer/main.ts";
import dayjs, { Dayjs } from "dayjs";
import { useNavigate } from "react-router";
import { useCallback, useState } from "react";
import type { BaseSyntheticEvent, Dispatch, SetStateAction } from 'react';
import type { TableRowSelection } from "antd/es/table/interface";
import { instance } from "@/api/axios.ts";
import { useNotify } from "@/hooks/useNotify/useNotify.tsx";

import lodash from 'lodash';
import type { AxiosResponse } from "axios";

export const customerTableHeaders: ColumnsType = [
  {
    title: "First Name",
    dataIndex: "firstName",
    key: "firstName",
    sorter: (a, b) => a.firstName.localeCompare(b.firstName)
  },
  {
    title: "Last Name",
    dataIndex: "lastName",
    key: "lastName",
    sorter: (a, b) => a.lastName.localeCompare(b.lastName)
  },
  { title: "Phone Number", dataIndex: "phoneNumber", key: "phoneNumber" },
  { title: "Address", dataIndex: "address", key: "address" },
  { title: "TCL FHV Number", dataIndex: "tlcFhvNumber", key: "tlcFhvNumber" },
  {
    title: "TLC FHV Expiration.",
    dataIndex: "tlcFhvExpiration",
    key: "tlcFhvExpiration",
    render: (value) => dayjs(value).format('MM/DD/YYYY'),
    sorter: (a, b) => a.tlcFhvExpiration.valueOf() - b.tlcFhvExpiration.valueOf()
  },
  { title: "DL Number", dataIndex: "driverLicenseNumber", key: "driverLicenseNumber" },
  {
    title: "DL Expiration.",
    dataIndex: "driverLicenseExpiration",
    key: "driverLicenseExpiration",
    render: (value) => dayjs(value).format('MM/DD/YYYY'),
    sorter: (a, b) => a.driverLicenseExpiration.valueOf() - b.driverLicenseExpiration.valueOf()
  },
  {
    title: "DDC Expiration.",
    dataIndex: "defensiveDriverCourseExpiration",
    key: "defensiveDriverCourseExpiration",
    render: (value) => dayjs(value).format('MM/DD/YYYY'),
    sorter: (a, b) => new Date(a.defensiveDriverCourseExpiration).valueOf() - new Date(b.defensiveDriverCourseExpiration).valueOf()
  },
  {
    title: "Status", dataIndex: "status", key: "status", render: () => <>
      <Tag color={'green'}>Active</Tag>
    </>,
  }
];

export const newCustomerFormInitialState: ICustomerCreate = {
  firstName: '',
  lastName: '',
  phoneNumber: '',
  email: '',
  dateOfBirth: new Date(Date.now()),
  address: '',
  tlcFhvNumber: '',
  vehicleVIN: '',
  dmvExpiration: new Date(Date.now()),
  dmvPlaceNumber: '',
  tlcFhvExpiration: new Date(Date.now()),
  driverLicenseNumber: '',
  driverLicenseExpiration: new Date(Date.now()),
}

export const getCustomerFunctions = () => {
  const navigate = useNavigate();
  const { success, error } = useNotify();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

  const [customers, setCustomers] = useState<ICustomer[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<ICustomer>();

  const [searchQuery, setSearchQuery] = useState<string>();

  const [customersSelection] = useState<TableRowSelection>({
    onSelect: (_, _s, multipleRows) => {
      const isMultipleSelected = multipleRows.length > 1;
      const [rowSelectedCustomer] = multipleRows as ICustomer[];

      setSelectedCustomer(!isMultipleSelected ? rowSelectedCustomer : undefined);
    },
  });

  const onSearch = useCallback(async () => {
    fetchCustomers(searchQuery);
  }, [searchQuery]);

  const createCustomer = useCallback(async (newCustomerForm: ICustomerCreate) => {
    try {
      await instance.post('/customer', newCustomerForm);
      success('Successfully created new customer!');
    } catch (e) {
      error('There is something with creation. Try again.');
    } finally {
      cancelCreateCustomerModal();
      await fetchCustomers();
    }
  }, []);

  const updateCustomer = useCallback(async (updateCustomerForm: ICustomerUpdate) => {
    try {
      const touchedFormFields: { [k: string]: unknown } = {};

      Object.entries(updateCustomerForm).forEach(([key, value]) => {
        if (selectedCustomer) {
          if (selectedCustomer[key as keyof ICustomer] !== updateCustomerForm[key as keyof ICustomerUpdate]) {
            touchedFormFields[key] = value;
          }
        }
      });

      await instance.put(`/customer/${selectedCustomer?._id}`, touchedFormFields);
      success('Customer successfully updated!');
    } catch (e) {
      error('There is something with update. Try again.');
    } finally {
      cancelUpdateCustomerModal();
      await fetchCustomers();
    }
  }, [selectedCustomer]);

  const fetchCustomers = async (query?: string) => {
    const all = await instance.get('/customer', { params: { search: query } });
    setCustomers(all.data);
  }


  const handleSearchQuery = useCallback((value: BaseSyntheticEvent) => {
    setSearchQuery(value ? value.target.value : undefined);
  }, []);

  const navigateToCustomerDetail = useCallback((customer: ICustomer) => {
    navigate(`${customer._id}`)
  }, []);

  const openCreateCustomerModal = () => {
    setIsCreateModalOpen(true)
  }

  const openUpdateCustomerModal = () => {
    setIsUpdateModalOpen(true)
  }

  const cancelCreateCustomerModal = () => {
    setIsCreateModalOpen(false)
  }

  const cancelUpdateCustomerModal = () => {
    setIsUpdateModalOpen(false)
  }

  return {
    isCreateModalOpen, isUpdateModalOpen, customers, fetchCustomers,
    handleSearchQuery,
    onSearch, customersSelection, navigateToCustomerDetail,
    searchQuery,

    createCustomer, updateCustomer,
    cancelCreateCustomerModal, cancelUpdateCustomerModal, selectedCustomer,

    openCreateCustomerModal, openUpdateCustomerModal
  }
}

export const getCustomerUpdateAndCreateFunctions = () => {
  const changeCustomerFormData = useCallback((key: keyof Omit<ICustomer, 'tlcFhvNumber' | 'dateOfBirth' | 'dmvExpiration' | 'tlcFhvExpiration' | 'defensiveDriverCourseExpiration' | 'driverLicenseExpiration'>, callback: Dispatch<SetStateAction<ICustomerCreate>>) => {
    return (val: BaseSyntheticEvent) => {
      callback(prev => ({
        ...prev,
        [key]: val.target.value
      }))
    }
  }, []);

  const changeCustomerTlcFhvNumber = lodash.debounce(async (val: BaseSyntheticEvent, callback: Dispatch<SetStateAction<ICustomerCreate>>) => {
    const customerVehicleInformation: AxiosResponse<CustomerVehicleLicenseInfo[]> = await instance.get('/for_hire_vehicle/customer', {
      params: {
        vehicle_license_number: val.target.value
      }
    });

    if (customerVehicleInformation.data.length) {
      const [vehicleCustomer] = customerVehicleInformation.data;

      const [firstName, lastName] = vehicleCustomer.name.split(',');
      const vehicleFetchedInformation = {
        tlcFhvNumber: vehicleCustomer.vehicle_license_number,
        firstName,
        lastName: lastName ? lastName : 'COMPANY',
        tlcFhvExpiration: new Date(vehicleCustomer.expiration_date),
        dmvPlaceNumber: vehicleCustomer.dmv_license_plate_number,
        vehicleVIN: vehicleCustomer.vehicle_vin_number,
      }

      return callback(prev => ({
        ...prev,
        ...vehicleFetchedInformation
      }))
    }
  }, 750)

  const changeCustomerFormTime = useCallback((key: keyof Pick<ICustomer, 'dateOfBirth' | 'tlcFhvExpiration' | 'dmvExpiration' | 'defensiveDriverCourseExpiration' | 'driverLicenseExpiration'>, callback: Dispatch<SetStateAction<ICustomerCreate>>) => {
    return (val: Dayjs) => {
      const date = val ? val.toDate() : undefined
      callback(prev => ({
        ...prev,
        [key]: date
      }))
    }
  }, []);

  return {
    changeCustomerFormData, changeCustomerFormTime, changeCustomerTlcFhvNumber
  }
}
