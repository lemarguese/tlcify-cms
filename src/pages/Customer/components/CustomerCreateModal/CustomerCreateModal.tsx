import './CustomerCreateModal.scss';

import Input from "@/components/Input/Input.tsx";
import GoogleAutocompleteInput from "@/components/GoogleAutocompleteInput/GoogleAutocompleteInput.tsx";
import DatePicker from "@/components/Date/Date.tsx";
import dayjs from "dayjs";
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react";
import {
  getCustomerUpdateAndCreateFunctions,
  newCustomerFormInitialState
} from "@/pages/Customer/utils/customer.tsx";
import type { ICustomerCreate } from "@/types/customer/main.ts";

import Modal from '@/components/Modal/Modal.tsx';

interface CustomerCreateModalProps {
  cancel: () => void;
  open: boolean;
  submit: (value: ICustomerCreate) => void;
}

const CustomerCreateModal = ({ cancel, open, submit }: CustomerCreateModalProps) => {
  const {
    changeCustomerFormData,
    changeCustomerFormTime,
    fetchVehicleInformation
  } = getCustomerUpdateAndCreateFunctions();

  useEffect(() => {
    if (open) fetchVehicleInformation();
  }, [open])

  const [newCustomerForm, setNewCustomerForm] = useState<ICustomerCreate>(newCustomerFormInitialState)

  const validForm = useMemo(() => {
    const options = {
      firstNameValid: !!newCustomerForm.firstName.trim(),
      lastNameValid: !!newCustomerForm.lastName.trim(),
      phoneNumberValid: !!newCustomerForm.phoneNumber.trim(),
      addressValid: !!newCustomerForm.address.trim(),
      emailValid: !!newCustomerForm.email.trim(),
      dateOfBirthValid: !!newCustomerForm.dateOfBirth,
      tlcFhvNumberValid: !!newCustomerForm.tlcFhvNumber.trim(),
      tlcFhvExpirationValid: !!newCustomerForm.tlcFhvExpiration,
      driverLicenseNumberValid: !!newCustomerForm.driverLicenseNumber.trim(),
      driverLicenseExpirationValid: !!newCustomerForm.driverLicenseExpiration,
      dmvExpirationValid: !!newCustomerForm.dmvExpiration,
      dmvPlaceNumberValid: !!newCustomerForm.dmvPlaceNumber.trim(),
      vehicleVINValid: !!newCustomerForm.vehicleVIN.trim(),
    };

    return Object.values(options).every(el => el);
  }, [newCustomerForm]);

  return <Modal open={open} width={800} okButtonProps={{ disabled: !validForm }}
                onOk={() => submit(newCustomerForm)} onCancel={cancel}>
    <div className='customer_create_modal_container'>
      <div className='customer_create_modal_horizontal'>
        <Input placeholder={'TLC FHV'} value={newCustomerForm.tlcFhvNumber} label={'TLC FHV'} required
               onChange={changeCustomerFormData('tlcFhvNumber', setNewCustomerForm)}/>
      </div>
      <div className='customer_create_modal_horizontal'>
        <Input placeholder={'First name'} value={newCustomerForm.firstName} required
               onChange={changeCustomerFormData('firstName', setNewCustomerForm)} label={'First Name'}/>
        <Input placeholder={'Last name'} value={newCustomerForm.lastName} required
               onChange={changeCustomerFormData('lastName', setNewCustomerForm)} label={'Last Name'}/>
        <DatePicker label='Date of birth' required
                    value={newCustomerForm.dateOfBirth ? dayjs(newCustomerForm.dateOfBirth) : undefined}
                    onChange={changeCustomerFormTime('dateOfBirth', setNewCustomerForm)}/>
      </div>
      <div className='customer_create_modal_horizontal'>
        <Input placeholder={'Phone number'} value={newCustomerForm.phoneNumber} required
               onChange={changeCustomerFormData('phoneNumber', setNewCustomerForm)} addonBefore={'+1'}
               label={'Phone number'}/>
        <Input placeholder={'Email'} value={newCustomerForm.email} required
               onChange={changeCustomerFormData('email', setNewCustomerForm)}
               label={'Email'}/>
      </div>
      <div className='customer_create_modal_horizontal'>
        <GoogleAutocompleteInput placeholder={'Address'} value={newCustomerForm.address} required
                                 onChange={changeCustomerFormData('address', setNewCustomerForm)}
                                 label={'Address'}/>
        <Input placeholder={'Apartment / Suite number'} value={newCustomerForm.apartmentNumber} required
               onChange={changeCustomerFormData('apartmentNumber', setNewCustomerForm)}
               label={'Apartment / Suite number'}/>
      </div>
      <div className='customer_create_modal_horizontal'>
        <DatePicker label={'TLC Expiration'} required
                    value={newCustomerForm.tlcFhvExpiration ? dayjs(newCustomerForm.tlcFhvExpiration) : undefined}
                    onChange={changeCustomerFormTime('tlcFhvExpiration', setNewCustomerForm)}/>
        <Input placeholder={'DMV Number'} label={'DMV Number'} required value={newCustomerForm.dmvPlaceNumber}
               onChange={changeCustomerFormData('dmvPlaceNumber', setNewCustomerForm)}/>
        <Input placeholder={'VIN Number'} label={'VIN Number'} required value={newCustomerForm.vehicleVIN}
               onChange={changeCustomerFormData('vehicleVIN', setNewCustomerForm)}/>
        <DatePicker label={'DMV Expiration'} required
                    value={newCustomerForm.dmvExpiration ? dayjs(newCustomerForm.dmvExpiration) : undefined}
                    onChange={changeCustomerFormTime('dmvExpiration', setNewCustomerForm)}/>
      </div>
      <div className='customer_create_modal_horizontal'>
        <Input placeholder={'DL Number'} label={'DL Number'} required value={newCustomerForm.driverLicenseNumber}
               onChange={changeCustomerFormData('driverLicenseNumber', setNewCustomerForm)}/>
        <DatePicker label={'DL Expiration'} required
                    value={newCustomerForm.driverLicenseExpiration ? dayjs(newCustomerForm.driverLicenseExpiration) : undefined}
                    onChange={changeCustomerFormTime('driverLicenseExpiration', setNewCustomerForm)}/>
      </div>
      <div className='customer_create_modal_horizontal'>
        <Input placeholder={'Last 5 Digits of SSN'} value={newCustomerForm.lastSSN} label={'Last 5 Digits of SSN'}
               onChange={changeCustomerFormData('lastSSN', setNewCustomerForm)}/>
        <DatePicker label={'Defensive Driver Course expiration'}
                    value={newCustomerForm.defensiveDriverCourseExpiration ? dayjs(newCustomerForm.defensiveDriverCourseExpiration) : undefined}
                    onChange={changeCustomerFormTime('defensiveDriverCourseExpiration', setNewCustomerForm)}/>
      </div>
    </div>
  </Modal>
}

export default CustomerCreateModal;
