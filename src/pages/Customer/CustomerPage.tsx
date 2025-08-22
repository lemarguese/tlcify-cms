import './CustomerPage.scss';

import Table from "../../components/Table/Table.tsx";
import Page from "../../layout/Page/Page.tsx";

import { useCallback, useEffect, useState } from "react";
import type { BaseSyntheticEvent, Dispatch, SetStateAction } from 'react';
import { instance } from "@/api/axios.ts";
import { Button } from "antd";
import type { ICustomer, ICustomerCreate } from "@/types/customer/main.ts";
import type { Dayjs } from "dayjs";
import { customerTableHeaders } from "./utils/customer.tsx";
import { useNavigate } from "react-router";
import CustomerCreateModal from "@/pages/Customer/components/CustomerCreateModal/CustomerCreateModal.tsx";
import CustomerUpdateModal from "@/pages/Customer/components/CustomerUpdateModal/CustomerUpdateModal.tsx";
import type { TableRowSelection } from "antd/es/table/interface";

const CustomerPage = () => {
  const navigate = useNavigate();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

  const [customers, setCustomers] = useState<ICustomer[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<ICustomer>();

  const [searchQuery, setSearchQuery] = useState<string>();

  const [customersSelection] = useState<TableRowSelection>({
    onSelect: (_, _s, multipleRows) => {
      const isMultipleSelected = multipleRows.length > 1;
      const [selectedCustomer] = multipleRows as ICustomer[];

      setSelectedCustomer(!isMultipleSelected ? selectedCustomer : undefined);
    },
  });

  const onSearch = useCallback(async () => {
    fetchCustomers(searchQuery);
  }, [searchQuery]);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = useCallback(async (query?: string) => {
    const all = await instance.get('/customer', { params: { search: query } });
    setCustomers(all.data);
  }, [])

  const addButton = <div>
    {selectedCustomer && <Button onClick={() => setIsUpdateModalOpen(true)}>Update the customer</Button>}
    <Button onClick={() => setIsCreateModalOpen(true)}>Create customer</Button>
  </div>

  const changeCustomerFormData = useCallback((key: keyof Omit<ICustomer, 'dateOfBirth' | 'tlcExp' | 'defensiveDriverCourseExp' | 'driverLicenseExp'>, callback: Dispatch<SetStateAction<ICustomerCreate>>) => {
    return (val: BaseSyntheticEvent) => {
      callback(prev => ({
        ...prev,
        [key]: val.target.value
      }))
    }
  }, []);

  const changeCustomerFormTime = useCallback((key: keyof Pick<ICustomer, 'dateOfBirth' | 'tlcExp' | 'defensiveDriverCourseExp' | 'driverLicenseExp'>, callback: Dispatch<SetStateAction<ICustomerCreate>>) => {
    return (val: Dayjs) => {
      const date = val ? val.toDate() : undefined
      callback(prev => ({
        ...prev,
        [key]: date
      }))
    }
  }, []);

  const handleSearchQuery = useCallback((value: BaseSyntheticEvent) => {
    setSearchQuery(value ? value.target.value : undefined);
  }, []);

  return <Page title='Customers' showSearch onSearchChange={handleSearchQuery} onSearchPress={onSearch} searchQuery={searchQuery}>
    <div className='customer_page'>
      {/*<SalesSection />*/}
      <Table columns={customerTableHeaders} rowSelection={customersSelection} onRow={(item) => {
        return {
          onClick: () => {
            navigate(`${item._id}`)
          },
        }
      }} dataSource={customers} rowKey='_id' label='Customers List' actions={addButton}/>
    </div>
    <CustomerCreateModal open={isCreateModalOpen} cancel={() => setIsCreateModalOpen(false)}
                         dateChange={changeCustomerFormTime} formChange={changeCustomerFormData}/>
    <CustomerUpdateModal open={isUpdateModalOpen} selectedCustomer={selectedCustomer}
                         cancel={() => setIsUpdateModalOpen(false)}
                         dateChange={changeCustomerFormTime} formChange={changeCustomerFormData}/>
  </Page>
}

export default CustomerPage;
