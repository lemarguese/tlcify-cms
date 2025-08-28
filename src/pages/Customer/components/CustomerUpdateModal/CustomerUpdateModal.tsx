import Input from "@/components/Input/Input.tsx";
import GoogleAutocompleteInput from "@/components/GoogleAutocompleteInput/GoogleAutocompleteInput.tsx";
import DatePicker from "@/components/Date/Date.tsx";
import Modal from '@/components/Modal/Modal.tsx';

import dayjs from "dayjs";
import type { ICustomer, ICustomerUpdate } from "@/types/customer/main.ts";
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react";
import {
  getCustomerUpdateAndCreateFunctions,
  newCustomerFormInitialState
} from "@/pages/Customer/utils/customer.tsx";

import './CustomerUpdateModal.scss';

interface CustomerUpdateModalProps {
  cancel: () => void;
  open: boolean;
  selectedCustomer?: ICustomer;
  submit: (value: ICustomerUpdate, resetForm: Dispatch<SetStateAction<ICustomerUpdate>>) => void;
}

const CustomerUpdateModal = ({ cancel, open, selectedCustomer, submit }: CustomerUpdateModalProps) => {
  const [updateCustomerForm, setUpdateCustomerForm] = useState<ICustomerUpdate>(newCustomerFormInitialState);

  const {
    changeCustomerFormData,
    changeCustomerFormTime,
    fetchVehicleInformation
  } = getCustomerUpdateAndCreateFunctions();

  useEffect(() => {
    if (open) fetchVehicleInformation();
  }, [open]);

  useEffect(() => {
    if (selectedCustomer) {
      const { _id, ...customerForm } = selectedCustomer;
      setUpdateCustomerForm(customerForm);
    }
  }, [selectedCustomer]);

  const validForm = useMemo(() => {
    const options = {
      firstNameValid: !!updateCustomerForm.firstName.trim(),
      lastNameValid: !!updateCustomerForm.lastName.trim(),
      phoneNumberValid: !!updateCustomerForm.phoneNumber.trim(),
      addressValid: !!updateCustomerForm.address.trim(),
      emailValid: !!updateCustomerForm.email.trim(),
      dateOfBirthValid: !!updateCustomerForm.dateOfBirth,
      tlcFhvNumberValid: !!updateCustomerForm.tlcFhvNumber.trim(),
      tlcFhvExpirationValid: !!updateCustomerForm.tlcFhvExpiration,
      driverLicenseNumberValid: !!updateCustomerForm.driverLicenseNumber.trim(),
      driverLicenseExpirationValid: !!updateCustomerForm.driverLicenseExpiration,
      dmvExpirationValid: !!updateCustomerForm.dmvExpiration,
      dmvPlaceNumberValid: !!updateCustomerForm.dmvPlaceNumber.trim(),
      vehicleVINValid: !!updateCustomerForm.vehicleVIN.trim(),
    };

    return Object.values(options).every(el => el);
  }, [updateCustomerForm]);

  return <Modal open={open} width={800} onOk={() => submit(updateCustomerForm, setUpdateCustomerForm)}
                okButtonProps={{ disabled: !validForm }} onCancel={cancel}>
    <div className='customer_update_modal_container'>
      <div>
        <Input placeholder={'TLC FHV'} value={updateCustomerForm.tlcFhvNumber} label={'TLC FHV'} required
               onChange={changeCustomerFormData('tlcFhvNumber', setUpdateCustomerForm)}/>
      </div>
      <div className='customer_update_modal_horizontal'>
        <Input placeholder={'First name'} value={updateCustomerForm.firstName} required
               onChange={changeCustomerFormData('firstName', setUpdateCustomerForm)} label={'First Name'}/>
        <Input placeholder={'Last name'} value={updateCustomerForm.lastName} required
               onChange={changeCustomerFormData('lastName', setUpdateCustomerForm)} label={'Last Name'}/>
        <DatePicker label='Date of birth' required
                    value={updateCustomerForm.dateOfBirth ? dayjs(updateCustomerForm.dateOfBirth) : undefined}
                    onChange={changeCustomerFormTime('dateOfBirth', setUpdateCustomerForm)}/>
      </div>
      <div className='customer_update_modal_horizontal'>
        <Input placeholder={'Phone number'} value={updateCustomerForm.phoneNumber} required
               onChange={changeCustomerFormData('phoneNumber', setUpdateCustomerForm)} addonBefore={'+1'}
               label={'Phone number'}/>
        <Input placeholder={'Email'} value={updateCustomerForm.email} required
               onChange={changeCustomerFormData('email', setUpdateCustomerForm)}
               label={'Email'}/>
      </div>
      <div className='customer_update_modal_horizontal'>
        <GoogleAutocompleteInput placeholder={'Address'} value={updateCustomerForm.address} required
                                 onChange={changeCustomerFormData('address', setUpdateCustomerForm)}
                                 label={'Address'}/>
        <Input placeholder={'Apartment / Suite number'} value={updateCustomerForm.apartmentNumber} required
               onChange={changeCustomerFormData('apartmentNumber', setUpdateCustomerForm)}
               label={'Apartment / Suite number'}/>
      </div>
      <div className='customer_update_modal_horizontal'>
        <DatePicker label={'TLC Expiration'} required
                    value={updateCustomerForm.tlcFhvExpiration ? dayjs(updateCustomerForm.tlcFhvExpiration) : undefined}
                    onChange={changeCustomerFormTime('tlcFhvExpiration', setUpdateCustomerForm)}/>
        <Input placeholder={'DMV Number'} label={'DMV Number'} required value={updateCustomerForm.dmvPlaceNumber}
               onChange={changeCustomerFormData('dmvPlaceNumber', setUpdateCustomerForm)}/>
        <Input placeholder={'VIN Number'} label={'VIN Number'} required value={updateCustomerForm.vehicleVIN}
               onChange={changeCustomerFormData('vehicleVIN', setUpdateCustomerForm)}/>
        <DatePicker label={'DMV Expiration'} required
                    value={updateCustomerForm.dmvExpiration ? dayjs(updateCustomerForm.dmvExpiration) : undefined}
                    onChange={changeCustomerFormTime('dmvExpiration', setUpdateCustomerForm)}/>
      </div>
      <div className='customer_update_modal_tlc'>
        <Input placeholder={'DL Number'} label={'DL Number'} required value={updateCustomerForm.driverLicenseNumber}
               onChange={changeCustomerFormData('driverLicenseNumber', setUpdateCustomerForm)}/>
        <DatePicker label={'DL Expiration'} required
                    value={updateCustomerForm.driverLicenseExpiration ? dayjs(updateCustomerForm.driverLicenseExpiration) : undefined}
                    onChange={changeCustomerFormTime('driverLicenseExpiration', setUpdateCustomerForm)}/>
      </div>
      <div className='customer_update_modal_horizontal'>
        <Input placeholder={'Last 5 Digits of SSN'} value={updateCustomerForm.lastSSN} label={'Last 5 Digits of SSN'}
               onChange={changeCustomerFormData('lastSSN', setUpdateCustomerForm)}/>
        <DatePicker label={'Defensive Driver Course expiration'}
                    value={updateCustomerForm.defensiveDriverCourseExpiration ? dayjs(updateCustomerForm.defensiveDriverCourseExpiration) : undefined}
                    onChange={changeCustomerFormTime('defensiveDriverCourseExpiration', setUpdateCustomerForm)}/>
      </div>
    </div>
  </Modal>
}

export default CustomerUpdateModal;
