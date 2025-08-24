import Input from "@/components/Input/Input.tsx";
import GoogleAutocompleteInput from "@/components/GoogleAutocompleteInput/GoogleAutocompleteInput.tsx";
import DatePicker from "@/components/Date/Date.tsx";
import Modal from '@/components/Modal/Modal.tsx';

import dayjs, { Dayjs } from "dayjs";
import type { BaseSyntheticEvent } from "react";
import type { ICustomer, ICustomerUpdate } from "@/types/customer/main.ts";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import { newCustomerFormInitialState } from "@/pages/Customer/utils/customer.tsx";
import { instance } from "@/api/axios.ts";

import './CustomerUpdateModal.scss';
import type { ICustomerCreate } from "@/types/customer/main.ts";
import { useNotify } from "@/hooks/useNotify/useNotify.tsx";

interface CustomerUpdateModalProps {
  cancel: () => void;
  open: boolean;
  selectedCustomer?: ICustomer;
  dateChange: (val: keyof Pick<ICustomerUpdate, 'dateOfBirth' | 'tlcExp' | 'defensiveDriverCourseExp' | 'driverLicenseExp'>, callback: Dispatch<SetStateAction<ICustomerCreate>>) => (val: Dayjs) => void;
  formChange: (val: keyof Omit<ICustomerUpdate, 'dateOfBirth' | 'tlcExp' | 'defensiveDriverCourseExp' | 'driverLicenseExp'>, callback: Dispatch<SetStateAction<ICustomerCreate>>) => (val: BaseSyntheticEvent) => void;
}

const CustomerUpdateModal = ({ cancel, open, selectedCustomer, formChange, dateChange }: CustomerUpdateModalProps) => {
  const { success, error } = useNotify()
  const [updateCustomerForm, setUpdateCustomerForm] = useState<ICustomerUpdate>(newCustomerFormInitialState);

  useEffect(() => {
    if (selectedCustomer) {
      const { _id, ...customerForm } = selectedCustomer;
      setUpdateCustomerForm(customerForm);
    }
  }, [selectedCustomer]);

  const submitForm = useCallback(async () => {
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
      setUpdateCustomerForm(newCustomerFormInitialState);
      success('Customer successfully updated!');
    } catch (e) {
      error('There is something with update. Try again.');
    } finally {
      cancel();
    }
  }, [selectedCustomer, updateCustomerForm]);

  const validForm = useMemo(() => {
    const options = {
      firstNameValid: !!updateCustomerForm.firstName.trim(),
      lastNameValid: !!updateCustomerForm.lastName.trim(),
      phoneNumberValid: !!updateCustomerForm.phoneNumber.trim(),
      addressValid: !!updateCustomerForm.address.trim(),
      emailValid: !!updateCustomerForm.email.trim(),
      dateOfBirthValid: !!updateCustomerForm.dateOfBirth,
      tlcNumberValid: !!updateCustomerForm.tlcNumber.trim(),
      tlcExpirationValid: !!updateCustomerForm.tlcExp,
      dlNumberValid: !!updateCustomerForm.driverLicenseNumber.trim(),
      dlExpirationValid: !!updateCustomerForm.driverLicenseExp,
    };

    return Object.values(options).every(el => el);
  }, [updateCustomerForm]);

  return <Modal open={open} onOk={submitForm} okButtonProps={{ disabled: !validForm }} onCancel={cancel}>
    <div className='customer_update_modal_container'>
      <div className='customer_update_modal'>
        <Input placeholder={'First name'} value={updateCustomerForm.firstName} required
               onChange={formChange('firstName', setUpdateCustomerForm)} label={'First Name'}/>
        <Input placeholder={'Last name'} value={updateCustomerForm.lastName} required
               onChange={formChange('lastName', setUpdateCustomerForm)} label={'Last Name'}/>
      </div>
      <div>
        <Input placeholder={'Phone number'} value={updateCustomerForm.phoneNumber} required
               onChange={formChange('phoneNumber', setUpdateCustomerForm)} addonBefore={'+1'}
               label={'Phone number'}/>
        <GoogleAutocompleteInput placeholder={'Address'} value={updateCustomerForm.address} required
                                 onChange={formChange('address', setUpdateCustomerForm)}
                                 label={'Address'}/>
        <Input placeholder={'Email'} value={updateCustomerForm.email} required
               onChange={formChange('email', setUpdateCustomerForm)}
               label={'Email'}/>
      </div>
      <div>
        <DatePicker label='Date of birth' required
                    value={updateCustomerForm.dateOfBirth ? dayjs(updateCustomerForm.dateOfBirth) : undefined}
                    onChange={dateChange('dateOfBirth', setUpdateCustomerForm)}/>
      </div>
      <div className='customer_update_modal_tlc'>
        <Input placeholder={'TLC Number'} value={updateCustomerForm.tlcNumber} required label={'TLC Number'}
               onChange={formChange('tlcNumber', setUpdateCustomerForm)}/>
        <DatePicker label={'TLC Expiration'} required
                    value={updateCustomerForm.tlcExp ? dayjs(updateCustomerForm.tlcExp) : undefined}
                    onChange={dateChange('tlcExp', setUpdateCustomerForm)}/>
      </div>
      <div className='customer_update_modal_tlc'>
        <Input placeholder={'DL Number'} label={'DL Number'} required value={updateCustomerForm.driverLicenseNumber}
               onChange={formChange('driverLicenseNumber', setUpdateCustomerForm)}/>
        <DatePicker label={'DL Expiration'} required
                    value={updateCustomerForm.driverLicenseExp ? dayjs(updateCustomerForm.driverLicenseExp) : undefined}
                    onChange={dateChange('driverLicenseExp', setUpdateCustomerForm)}/>
      </div>
      <div>
        <Input placeholder={'Last 5 Digits of SSN'} value={updateCustomerForm.lastSSN} label={'Last 5 Digits of SSN'}
               onChange={formChange('lastSSN', setUpdateCustomerForm)}/>
      </div>
      <div>
        <DatePicker label={'Defensive Driver Course expiration'}
                    value={updateCustomerForm.defensiveDriverCourseExp ? dayjs(updateCustomerForm.defensiveDriverCourseExp) : undefined}
                    onChange={dateChange('defensiveDriverCourseExp', setUpdateCustomerForm)}/>
      </div>
    </div>
  </Modal>
}

export default CustomerUpdateModal;
