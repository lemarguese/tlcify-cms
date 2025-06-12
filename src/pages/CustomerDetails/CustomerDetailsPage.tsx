import './CustomerDetailsPage.scss';
import Page from '../../layout/Page/Page.tsx';
import AvatarImage from '../../assets/images/avatar.jpg';
import Table from "../../components/Table/Table.tsx";
import { customerTableHeaders } from "../Customer/utils/customer.tsx";
import { Button, Modal } from "antd";
import { BaseSyntheticEvent, useCallback, useEffect, useState } from "react";
import Input from "../../components/Input/Input.tsx";
import DatePicker from "../../components/Date/Date.tsx";
import dayjs, { Dayjs } from "dayjs";
import { useSearchParams } from "react-router";
import { instance } from "../../api/axios.ts";
import type { IDriverCreate } from "../../types/driver/main.ts";
import { newDriverFormInitialState } from "./utils/driver.ts";

const CustomerDetailContactSection = () => {
  return <div className='customer_details_page_contacts_section'>
    <div className='customer_details_page_contacts_section_icon'></div>
    <div className='customer_details_page_contacts_section_content'>
      <h6>Email</h6>
      <p>abcd123@gmail.com</p>
    </div>
  </div>
}

const CustomerDetailStatisticsItem = () => {
  return <div className='customer_details_page_statistics_item'>
    <div className='customer_details_page_statistics_item_header'>
      <div className='customer_details_page_statistics_item_header_icon_block'>
        <div className='customer_details_page_statistics_item_header_icon_block_icon'/>
        <p>Total Points</p>
      </div>
      <p>300</p>
    </div>
    <div className='customer_details_page_statistics_item_footer'>
      <div className='customer_details_page_statistics_item_footer_content'>
        <h6>Points Used</h6>
        <p>150</p>
      </div>
      <div className='customer_details_page_statistics_item_footer_content'>
        <h6>Points Used</h6>
        <p>150</p>
      </div>
    </div>
  </div>
}

const CustomerDetailProfile = () => {
  return <div className='customer_details_page_profile'>
    <div className='customer_details_page_profile_header'>
      <img alt='customer-profile-avatar' src={AvatarImage} className='customer_details_page_profile_header_image'/>
      <div className='customer_details_page_profile_header_info'>
        <p>Andreas Iniesta</p>
        <p>+8801774286074</p>
      </div>
    </div>
    <div className='customer_details_page_profile_footer'>
      <div className='customer_details_page_profile_footer_section'>
        <div className='customer_details_page_profile_footer_section_icon'></div>
        <div className='customer_details_page_profile_footer_section_content'>
          <p>Birthday</p>
          <p>Aug 20, 1997</p>
        </div>
      </div>
      <div className='customer_details_page_profile_footer_section'>
        <div className='customer_details_page_profile_footer_section_icon'></div>
        <div className='customer_details_page_profile_footer_section_content'>
          <p>Gender</p>
          <p>Male</p>
        </div>
      </div>
    </div>
  </div>
}

const CustomerDetailsPage = () => {

  const [params, _] = useSearchParams();
  const customerId = params.get('id');

  const [newDriverForm, setNewDriverForm] = useState<IDriverCreate>(newDriverFormInitialState);

  const [drivers, setDrivers] = useState([]);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const addNewDriverButton = <Button onClick={() => setIsCreateModalOpen(true)}>Create Driver</Button>

  useEffect(() => {
    fetchDrivers();
  }, []);

  const fetchDrivers = useCallback(async () => {
    const all = await instance.get('/driver/byCustomer', { params: { id: '68487f869826decb29d97865' } });
    setDrivers(all.data);
  }, [customerId])

  const changeDriverFormData = useCallback((key: keyof Omit<IDriverCreate, 'dateOfBirth' | 'tlcExp' | 'defensiveDriverCourseExp' | 'driverLicenseExp'>) => {
    return (val: BaseSyntheticEvent) => {
      setNewDriverForm(prev => ({
        ...prev,
        [key]: val.target.value
      }))
    }
  }, []);

  const changeDriverFormTime = useCallback((key: keyof Pick<IDriverCreate, 'dateOfBirth' | 'tlcExp' | 'defensiveDriverCourseExp' | 'driverLicenseExp'>) => {
    return (val: Dayjs) => {
      const date = val ? val.format('MM/DD/YYYY') : null
      setNewDriverForm(prev => ({
        ...prev,
        [key]: date
      }))
    }
  }, []);

  const submitForm = useCallback(async () => {
    await instance.post('/driver', { ...newDriverForm, customerId: '68487f869826decb29d97865' });
    setNewDriverForm(newDriverFormInitialState);
    setIsCreateModalOpen(false);
    await fetchDrivers();
  }, [newDriverForm])

  return <Page>
    <div className='customer_details_page'>
      <div className='customer_details_page_container'>
        <div className='customer_details_page_contacts'>
          <CustomerDetailContactSection/>
          <CustomerDetailContactSection/>
          <CustomerDetailContactSection/>
          <CustomerDetailContactSection/>
        </div>
        <div className='customer_details_page_statistics'>
          <CustomerDetailStatisticsItem/>
          <CustomerDetailStatisticsItem/>
          <CustomerDetailStatisticsItem/>
        </div>
        <CustomerDetailProfile/>
      </div>
      <Table title='Drivers' actions={addNewDriverButton} heads={customerTableHeaders} data={drivers}/>
    </div>
    <Modal open={isCreateModalOpen} onOk={submitForm} onCancel={() => setIsCreateModalOpen(false)}>
      <div className='customer_page_create_container'>
        <div className='customer_page_create'>
          <Input placeholder={'First name'} value={newDriverForm.firstName}
                 onChange={changeDriverFormData('firstName')} label={'First Name'}/>
          <Input placeholder={'Last name'} value={newDriverForm.lastName}
                 onChange={changeDriverFormData('lastName')} label={'Last Name'}/>
        </div>
        <div>
          <Input placeholder={'Phone number'} value={newDriverForm.phoneNumber}
                 onChange={changeDriverFormData('phoneNumber')} addonBefore={'+1'}
                 label={'Phone number'}/>
          <Input placeholder={'Address'} value={newDriverForm.address} onChange={changeDriverFormData('address')}
                 label={'Address'}/>
          <Input placeholder={'Email'} value={newDriverForm.email} onChange={changeDriverFormData('email')}
                 label={'Email'}/>
        </div>
        <div>
          <DatePicker label='Date of birth'
                      value={newDriverForm.dateOfBirth ? dayjs(newDriverForm.dateOfBirth) : undefined}
                      onChange={changeDriverFormTime('dateOfBirth')}/>
        </div>
        <div className='customer_page_tlc'>
          <Input placeholder={'TLC Number'} value={newDriverForm.tlcNumber} label={'TLC Number'}
                 onChange={changeDriverFormData('tlcNumber')}/>
          <DatePicker label={'TLC Expiration'}
                      value={newDriverForm.tlcExp ? dayjs(newDriverForm.tlcExp) : undefined}
                      onChange={changeDriverFormTime('tlcExp')}/>
        </div>
        <div className='customer_page_tlc'>
          <Input placeholder={'DL Number'} label={'DL Number'} value={newDriverForm.driverLicenseNumber}
                 onChange={changeDriverFormData('driverLicenseNumber')}/>
          <DatePicker label={'DL Expiration'}
                      value={newDriverForm.driverLicenseExp ? dayjs(newDriverForm.driverLicenseExp) : undefined}
                      onChange={changeDriverFormTime('driverLicenseExp')}/>
        </div>
        <div>
          <Input placeholder={'Last 5 Digits of SSN'} value={newDriverForm.lastSSN} label={'Last 5 Digits of SSN'}
                 onChange={changeDriverFormData('lastSSN')}/>
        </div>
        <div>
          <DatePicker label={'Defensive Driver Course expiration'}
                      value={newDriverForm.defensiveDriverCourseExp ? dayjs(newDriverForm.defensiveDriverCourseExp) : undefined}
                      onChange={changeDriverFormTime('defensiveDriverCourseExp')}/>
        </div>
      </div>
    </Modal>
  </Page>
}

export default CustomerDetailsPage;
