import './CustomerDetailsPage.scss';
import Page from '../../layout/Page/Page.tsx';
import Table from "../../components/Table/Table.tsx";
import { customerTableHeaders, newCustomerFormInitialState } from "../Customer/utils/customer.tsx";
import { Button, Modal } from "antd";
import { BaseSyntheticEvent, useCallback, useEffect, useState } from "react";
import Input from "../../components/Input/Input.tsx";
import DatePicker from "../../components/Date/Date.tsx";
import dayjs, { Dayjs } from "dayjs";
import { useNavigate, useParams } from "react-router";
import { instance } from "@/api/axios.ts";
import type { IDriverCreate } from "@/types/driver/main.ts";
import { newDriverFormInitialState } from "./utils/driver.ts";


import CustomerDetailContactSection from "./components/CustomerDetailContactSection/CustomerDetailContactSection.tsx";

import EmailIcon from '../../assets/icons/email_icon.svg';
import RegisteredIcon from '../../assets/icons/registered_icon.svg';
import type { ICustomerCreate } from "@/types/customer/main.ts";
import CustomerDetailProfile from "./components/CustomerDetailsProfile/CustomerDetailsProfile.tsx";
import GoogleAutocompleteInput from "../../components/GoogleAutocompleteInput/GoogleAutocompleteInput.tsx";

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

const CustomerDetailsPage = () => {

  const { id: customerId } = useParams();

  const navigate = useNavigate();

  const [newDriverForm, setNewDriverForm] = useState<IDriverCreate>(newDriverFormInitialState);

  const [drivers, setDrivers] = useState([]);
  const [customerById, setCustomerById] = useState<ICustomerCreate>(newCustomerFormInitialState);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const addNewDriverButton = <Button onClick={() => setIsCreateModalOpen(true)}>Create Driver</Button>

  useEffect(() => {
    fetchCustomerById();
    fetchDrivers();
  }, []);

  const fetchDrivers = useCallback(async () => {
    const all = await instance.get('/driver/byCustomer', { params: { id: customerId } });
    setDrivers(all.data);
  }, [customerId]);

  const fetchCustomerById = useCallback(async () => {
    const customer = await instance.get(`/customer/${customerId}`);
    setCustomerById(customer.data);
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
    await instance.post('/driver', { ...newDriverForm, customerId });
    setNewDriverForm(newDriverFormInitialState);
    setIsCreateModalOpen(false);
    await fetchDrivers();
  }, [newDriverForm]);

  const contactSections = [
    { title: 'Email', content: customerById.email, backgroundColor: '#FFF5E0', iconUrl: EmailIcon },
    { title: 'Email', content: customerById.email, backgroundColor: '#FFF5E0', iconUrl: EmailIcon },
    { title: 'Register Since', content: customerById.tlcExp, backgroundColor: '#E7D1F8', iconUrl: RegisteredIcon },
    { title: 'Register Since', content: customerById.tlcExp, backgroundColor: '#E7D1F8', iconUrl: RegisteredIcon },
  ];

  return <Page back={() => navigate(-1)} showSearch={false}>
    <div className='customer_details_page'>
      <div className='customer_details_page_container'>
        <div className='customer_details_page_contacts'>
          {contactSections.map(contactSection => (<CustomerDetailContactSection
            key={`customer-detail-contact-section-${contactSection.title}`} {...contactSection} />))}
        </div>
        <div className='customer_details_page_statistics'>
          <CustomerDetailStatisticsItem key={`1`}/>
          <CustomerDetailStatisticsItem key={`2`}/>
          <CustomerDetailStatisticsItem key={`3`}/>
        </div>
        <CustomerDetailProfile
          firstName={customerById.firstName}
          dateOfBirth={customerById.dateOfBirth}
          lastName={customerById.lastName}
          phoneNumber={customerById.phoneNumber}
        />
      </div>
      <Table title='Drivers' actions={addNewDriverButton} columns={customerTableHeaders} dataSource={drivers}/>
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
                 onChange={changeDriverFormData('phoneNumber')} mask={'number'}
                 label={'Phone number'}/>
          <GoogleAutocompleteInput placeholder={'Address'} value={newDriverForm.address}
                                   onChange={changeDriverFormData('address')}
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
