import './CustomerCreateModal.scss';

import Input from "@/components/Input/Input.tsx";
import GoogleAutocompleteInput from "@/components/GoogleAutocompleteInput/GoogleAutocompleteInput.tsx";
import DatePicker from "@/components/Date/Date.tsx";
import dayjs, { Dayjs } from "dayjs";
import type { BaseSyntheticEvent, Dispatch, SetStateAction } from "react";
import { useCallback, useMemo, useState } from "react";
import { newCustomerFormInitialState } from "@/pages/Customer/utils/customer.tsx";
import { instance } from "@/api/axios.ts";
import type { ICustomerCreate } from "@/types/customer/main.ts";

import Modal from '@/components/Modal/Modal.tsx';
import { useNotify } from "@/hooks/useNotify/useNotify.tsx";

interface CustomerCreateModalProps {
  cancel: () => void;
  open: boolean;
  dateChange: (val: keyof Pick<ICustomerCreate, 'dateOfBirth' | 'tlcExp' | 'defensiveDriverCourseExp' | 'driverLicenseExp'>, callback: Dispatch<SetStateAction<ICustomerCreate>>) => (val: Dayjs) => void;
  formChange: (val: keyof Omit<ICustomerCreate, 'dateOfBirth' | 'tlcExp' | 'defensiveDriverCourseExp' | 'driverLicenseExp'>, callback: Dispatch<SetStateAction<ICustomerCreate>>) => (val: BaseSyntheticEvent) => void;
}

const CustomerCreateModal = ({ cancel, open, formChange, dateChange }: CustomerCreateModalProps) => {
  const { success, error } = useNotify()
  const [newCustomerForm, setNewCustomerForm] = useState<ICustomerCreate>(newCustomerFormInitialState)

  const submitForm = useCallback(async () => {
    try {
      await instance.post('/customer', newCustomerForm);
      setNewCustomerForm(newCustomerFormInitialState);
      success('Successfully created new customer!');
    } catch (e) {
      error('There is something with creation. Try again.');
    } finally {
      cancel();
    }
  }, [newCustomerForm]);

  const validForm = useMemo(() => {
    const options = {
      firstNameValid: !!newCustomerForm.firstName.trim(),
      lastNameValid: !!newCustomerForm.lastName.trim(),
      phoneNumberValid: !!newCustomerForm.phoneNumber.trim(),
      addressValid: !!newCustomerForm.address.trim(),
      emailValid: !!newCustomerForm.email.trim(),
      dateOfBirthValid: !!newCustomerForm.dateOfBirth,
      tlcNumberValid: !!newCustomerForm.tlcNumber.trim(),
      tlcExpirationValid: !!newCustomerForm.tlcExp,
      dlNumberValid: !!newCustomerForm.driverLicenseNumber.trim(),
      dlExpirationValid: !!newCustomerForm.driverLicenseExp,
    };

    return Object.values(options).every(el => el);
  }, [newCustomerForm]);

  return <Modal open={open} okButtonProps={{ disabled: !validForm }} onOk={submitForm} onCancel={cancel}>
    <div className='customer_create_modal_container'>
      <div className='customer_create_modal'>
        <Input placeholder={'First name'} value={newCustomerForm.firstName} required
               onChange={formChange('firstName', setNewCustomerForm)} label={'First Name'}/>
        <Input placeholder={'Last name'} value={newCustomerForm.lastName} required
               onChange={formChange('lastName', setNewCustomerForm)} label={'Last Name'}/>
      </div>
      <div>
        <Input placeholder={'Phone number'} value={newCustomerForm.phoneNumber} required
               onChange={formChange('phoneNumber', setNewCustomerForm)} addonBefore={'+1'}
               label={'Phone number'}/>
        <GoogleAutocompleteInput placeholder={'Address'} value={newCustomerForm.address} required
                                 onChange={formChange('address', setNewCustomerForm)}
                                 label={'Address'}/>
        <Input placeholder={'Email'} value={newCustomerForm.email} required
               onChange={formChange('email', setNewCustomerForm)}
               label={'Email'}/>
      </div>
      <div>
        <DatePicker label='Date of birth' required
                    value={newCustomerForm.dateOfBirth ? dayjs(newCustomerForm.dateOfBirth) : undefined}
                    onChange={dateChange('dateOfBirth', setNewCustomerForm)}/>
      </div>
      <div className='customer_create_modal_tlc'>
        <Input placeholder={'TLC Number'} value={newCustomerForm.tlcNumber} label={'TLC Number'} required
               onChange={formChange('tlcNumber', setNewCustomerForm)}/>
        <DatePicker label={'TLC Expiration'} required
                    value={newCustomerForm.tlcExp ? dayjs(newCustomerForm.tlcExp) : undefined}
                    onChange={dateChange('tlcExp', setNewCustomerForm)}/>
      </div>
      <div className='customer_create_modal_tlc'>
        <Input placeholder={'DL Number'} label={'DL Number'} required value={newCustomerForm.driverLicenseNumber}
               onChange={formChange('driverLicenseNumber', setNewCustomerForm)}/>
        <DatePicker label={'DL Expiration'} required
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
