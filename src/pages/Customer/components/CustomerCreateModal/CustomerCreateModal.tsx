import Input from "@/components/Input/Input.tsx";
import GoogleAutocompleteInput from "@/components/GoogleAutocompleteInput/GoogleAutocompleteInput.tsx";
import DatePicker from "@/components/Date/Date.tsx";
import dayjs, { Dayjs } from "dayjs";
import { Modal } from "antd";
import type { BaseSyntheticEvent, Dispatch, FC, SetStateAction } from "react";
import { useCallback, useEffect, useState } from "react";
import { newCustomerFormInitialState } from "@/pages/Customer/utils/customer.tsx";
import { instance } from "@/api/axios.ts";
import type { ICustomerCreate } from "@/types/customer/main.ts";

interface CustomerCreateModalProps {
  cancel: () => void;
  open: boolean;
  dateChange: (val: keyof Pick<ICustomerCreate, 'dateOfBirth' | 'tlcExp' | 'defensiveDriverCourseExp' | 'driverLicenseExp'>, callback: () => Dispatch<SetStateAction<ICustomerCreate>>) => (val: Dayjs) => void;
  formChange: (val: keyof Omit<ICustomerCreate, 'dateOfBirth' | 'tlcExp' | 'defensiveDriverCourseExp' | 'driverLicenseExp'>, callback: () => Dispatch<SetStateAction<ICustomerCreate>>) => (val: BaseSyntheticEvent) => void;
}

const CustomerCreateModal: FC<CustomerCreateModalProps> = ({ cancel, open, formChange, dateChange }) => {
  const [newCustomerForm, setNewCustomerForm] = useState<ICustomerCreate>(newCustomerFormInitialState)

  const submitForm = useCallback(async () => {
    await instance.post('/customer', newCustomerForm);
    setNewCustomerForm(newCustomerFormInitialState);
    cancel();
  }, [newCustomerForm]);

  return <Modal open={open} onOk={submitForm} onCancel={cancel}>
    <div className='customer_create_modal_container'>
      <div className='customer_create_modal'>
        <Input placeholder={'First name'} value={newCustomerForm.firstName}
               onChange={formChange('firstName', setNewCustomerForm)} label={'First Name'}/>
        <Input placeholder={'Last name'} value={newCustomerForm.lastName}
               onChange={formChange('lastName', setNewCustomerForm)} label={'Last Name'}/>
      </div>
      <div>
        <Input placeholder={'Phone number'} value={newCustomerForm.phoneNumber}
               onChange={formChange('phoneNumber', setNewCustomerForm)} addonBefore={'+1'}
               label={'Phone number'}/>
        <GoogleAutocompleteInput placeholder={'Address'} value={newCustomerForm.address}
                                 onChange={formChange('address', setNewCustomerForm)}
                                 label={'Address'}/>
        <Input placeholder={'Email'} value={newCustomerForm.email} onChange={formChange('email', setNewCustomerForm)}
               label={'Email'}/>
      </div>
      <div>
        <DatePicker label='Date of birth'
                    value={newCustomerForm.dateOfBirth ? dayjs(newCustomerForm.dateOfBirth) : undefined}
                    onChange={dateChange('dateOfBirth', setNewCustomerForm)}/>
      </div>
      <div className='customer_page_tlc'>
        <Input placeholder={'TLC Number'} value={newCustomerForm.tlcNumber} label={'TLC Number'}
               onChange={formChange('tlcNumber', setNewCustomerForm)}/>
        <DatePicker label={'TLC Expiration'}
                    value={newCustomerForm.tlcExp ? dayjs(newCustomerForm.tlcExp) : undefined}
                    onChange={dateChange('tlcExp', setNewCustomerForm)}/>
      </div>
      <div className='customer_page_tlc'>
        <Input placeholder={'DL Number'} label={'DL Number'} value={newCustomerForm.driverLicenseNumber}
               onChange={formChange('driverLicenseNumber', setNewCustomerForm)}/>
        <DatePicker label={'DL Expiration'}
                    value={newCustomerForm.driverLicenseExp ? dayjs(newCustomerForm.driverLicenseExp) : undefined}
                    onChange={dateChange('driverLicenseExp', setNewCustomerForm)}/>
      </div>
      <div>
        <Input placeholder={'Last 5 Digits of SSN'} value={newCustomerForm.lastSSN} label={'Last 5 Digits of SSN'}
               onChange={formChange('lastSSN', setNewCustomerForm)}/>
      </div>
      <div>
        <DatePicker label={'Defensive Driver Course expiration'}
                    value={newCustomerForm.defensiveDriverCourseExp ? dayjs(newCustomerForm.defensiveDriverCourseExp) : undefined}
                    onChange={dateChange('defensiveDriverCourseExp', setNewCustomerForm)}/>
      </div>
    </div>
  </Modal>
}

export default CustomerCreateModal;
