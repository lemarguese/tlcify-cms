import Table from "../../components/Table/Table.tsx";
import Page from "../../layout/Page/Page.tsx";

import { BaseSyntheticEvent, useCallback, useEffect, useState } from "react";
import { instance } from "../../api/axios.ts";
import { Button, Modal } from "antd";
import Input from "../../components/Input/Input.tsx";
import DatePicker from "../../components/Date/Date.tsx";
import SalesSection from "./components/SalesSection/SalesSection.tsx";
import type { ICustomerCreate } from "../../types/customer/main.ts";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import './CustomerPage.scss';
import { customerTableHeaders, newCustomerFormInitialState } from "./utils/customer.tsx";

const CustomerPage = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [customers, setCustomers] = useState<ICustomerCreate[]>([]);

  const [newCustomerForm, setNewCustomerForm] = useState<ICustomerCreate>(newCustomerFormInitialState)

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = useCallback(async () => {
    const all = await instance.get('/customer');
    setCustomers(all.data);
  }, [])

  const addButton = <Button onClick={() => setIsCreateModalOpen(true)}>Create customer</Button>

  const changeCustomerFormData = useCallback((key: keyof Omit<ICustomerCreate, 'dateOfBirth' | 'tlcExp' | 'defensiveDriverCourseExp' | 'driverLicenseExp'>) => {
    return (val: BaseSyntheticEvent) => {
      setNewCustomerForm(prev => ({
        ...prev,
        [key]: val.target.value
      }))
    }
  }, []);

  const changeCustomerFormTime = useCallback((key: keyof Pick<ICustomerCreate, 'dateOfBirth' | 'tlcExp' | 'defensiveDriverCourseExp' | 'driverLicenseExp'>) => {
    return (val: Dayjs) => {
      const date = val ? val.format('MM/DD/YYYY') : undefined
      setNewCustomerForm(prev => ({
        ...prev,
        [key]: date
      }))
    }
  }, []);

  const submitForm = useCallback(async () => {
    await instance.post('/customer', newCustomerForm);
    setNewCustomerForm(newCustomerFormInitialState);
    setIsCreateModalOpen(false);
    await fetchCustomers();
  }, [newCustomerForm])

  return <Page>
    <div className='customer_page'>
      {/*<SalesSection />*/}
      <Table heads={customerTableHeaders} data={customers} title='Customers List' actions={addButton}/>
    </div>
    <Modal open={isCreateModalOpen} onOk={submitForm} onCancel={() => setIsCreateModalOpen(false)}>
      <div className='customer_page_create_container'>
        <div className='customer_page_create'>
          <Input placeholder={'First name'} value={newCustomerForm.firstName}
                 onChange={changeCustomerFormData('firstName')} label={'First Name'}/>
          <Input placeholder={'Last name'} value={newCustomerForm.lastName}
                 onChange={changeCustomerFormData('lastName')} label={'Last Name'}/>
        </div>
        <div>
          <Input placeholder={'Phone number'} value={newCustomerForm.phoneNumber}
                 onChange={changeCustomerFormData('phoneNumber')} addonBefore={'+1'}
                 label={'Phone number'}/>
          <Input placeholder={'Address'} value={newCustomerForm.address} onChange={changeCustomerFormData('address')}
                 label={'Address'}/>
          <Input placeholder={'Email'} value={newCustomerForm.email} onChange={changeCustomerFormData('email')}
                 label={'Email'}/>
        </div>
        <div>
          <DatePicker label='Date of birth'
                      value={newCustomerForm.dateOfBirth ? dayjs(newCustomerForm.dateOfBirth) : undefined}
                      onChange={changeCustomerFormTime('dateOfBirth')}/>
        </div>
        <div className='customer_page_tlc'>
          <Input placeholder={'TLC Number'} value={newCustomerForm.tlcNumber} label={'TLC Number'}
                 onChange={changeCustomerFormData('tlcNumber')}/>
          <DatePicker label={'TLC Expiration'}
                      value={newCustomerForm.tlcExp ? dayjs(newCustomerForm.tlcExp) : undefined}
                      onChange={changeCustomerFormTime('tlcExp')}/>
        </div>
        <div className='customer_page_tlc'>
          <Input placeholder={'DL Number'} label={'DL Number'} value={newCustomerForm.driverLicenseNumber}
                 onChange={changeCustomerFormData('driverLicenseNumber')}/>
          <DatePicker label={'DL Expiration'}
                      value={newCustomerForm.driverLicenseExp ? dayjs(newCustomerForm.driverLicenseExp) : undefined}
                      onChange={changeCustomerFormTime('driverLicenseExp')}/>
        </div>
        <div>
          <Input placeholder={'Last 5 Digits of SSN'} value={newCustomerForm.lastSSN} label={'Last 5 Digits of SSN'}
                 onChange={changeCustomerFormData('lastSSN')}/>
        </div>
        <div>
          <DatePicker label={'Defensive Driver Course expiration'}
                      value={newCustomerForm.defensiveDriverCourseExp ? dayjs(newCustomerForm.defensiveDriverCourseExp) : undefined}
                      onChange={changeCustomerFormTime('defensiveDriverCourseExp')}/>
        </div>
      </div>
    </Modal>
  </Page>
}

export default CustomerPage;
