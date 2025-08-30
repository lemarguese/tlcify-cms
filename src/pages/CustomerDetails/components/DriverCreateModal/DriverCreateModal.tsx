import './DriverCreateModal.scss';

import Input from "@/components/Input/Input.tsx";
import GoogleAutocompleteInput from "@/components/GoogleAutocompleteInput/GoogleAutocompleteInput.tsx";
import DatePicker from "@/components/Date/Date.tsx";
import Modal from '@/components/Modal/Modal.tsx';

import dayjs, { Dayjs } from "dayjs";
import { useEffect, useMemo, useState } from "react";
import type { BaseSyntheticEvent, Dispatch, SetStateAction } from 'react';

import {
  getDriversUpdateAndCreateFunctions,
  newDriverFormInitialState
} from "@/pages/CustomerDetails/utils/driver.tsx";
import type { IDriverCreate } from "@/types/driver/main.ts";

interface DriverCreateModalProps {
  open: boolean;
  cancel: () => void;
  submit: (value: IDriverCreate, resetForm: Dispatch<SetStateAction<IDriverCreate>>) => void;
}

const DriverCreateModal = ({ open, cancel, submit }: DriverCreateModalProps) => {
  const [newDriverForm, setNewDriverForm] = useState<IDriverCreate>(newDriverFormInitialState);

  const { changeDriverFormData, changeDriverFormTime, fetchVehicleInformation } = getDriversUpdateAndCreateFunctions();

  useEffect(() => {
    if (open) fetchVehicleInformation();
  }, [open]);

  const validForm = useMemo(() => {
    const options = {
      firstNameValid: !!newDriverForm.firstName.trim(),
      lastNameValid: !!newDriverForm.lastName.trim(),
      phoneNumberValid: !!newDriverForm.phoneNumber.trim(),
      addressValid: !!newDriverForm.address.trim(),
      emailValid: !!newDriverForm.email.trim(),
      dateOfBirthValid: !!newDriverForm.dateOfBirth,
      tlcNumberValid: !!newDriverForm.tlcNumber.trim(),
      tlcFhvExpirationValid: !!newDriverForm.tlcExp,
      driverLicenseNumberValid: !!newDriverForm.driverLicenseNumber.trim(),
      driverLicenseExpirationValid: !!newDriverForm.driverLicenseExp,
    };

    return Object.values(options).every(el => el);
  }, [newDriverForm]);

  return <Modal open={open} onOk={() => submit(newDriverForm, setNewDriverForm)}
                okButtonProps={{ disabled: !validForm }} onCancel={cancel}>
    <div className='driver_create_modal_container'>
      <div className='driver_create_modal_horizontal'>
        <Input placeholder={'TLC Number'} value={newDriverForm.tlcNumber} label={'TLC Number'}
               onChange={changeDriverFormData('tlcNumber', setNewDriverForm)}/>
      </div>
      <div className='driver_create_modal_horizontal'>
        <Input placeholder={'First name'} value={newDriverForm.firstName} required
               onChange={changeDriverFormData('firstName', setNewDriverForm)} label={'First Name'}/>
        <Input placeholder={'Last name'} value={newDriverForm.lastName} required
               onChange={changeDriverFormData('lastName', setNewDriverForm)} label={'Last Name'}/>
        <DatePicker label='Date of birth' required
                    value={newDriverForm.dateOfBirth ? dayjs(newDriverForm.dateOfBirth) : undefined}
                    onChange={changeDriverFormTime('dateOfBirth', setNewDriverForm)}/>
      </div>
      <div className='driver_create_modal_horizontal'>
        <Input placeholder={'Phone number'} value={newDriverForm.phoneNumber} required
               onChange={changeDriverFormData('phoneNumber', setNewDriverForm)}
               label={'Phone number'}/>
        <Input placeholder={'Email'} value={newDriverForm.email}
               onChange={changeDriverFormData('email', setNewDriverForm)}
               label={'Email'}/>
      </div>
      <div className='driver_create_modal_horizontal'>
        <GoogleAutocompleteInput placeholder={'Address'} value={newDriverForm.address} required
                                 onChange={changeDriverFormData('address', setNewDriverForm)}
                                 label={'Address'}/>
        <Input placeholder={'Apartment / Suite number'} value={newDriverForm.apartmentNumber} required
               onChange={changeDriverFormData('apartmentNumber', setNewDriverForm)}
               label={'Apartment / Suite number'}/>
      </div>
      <div className='driver_create_modal_horizontal'>
        <DatePicker label={'TLC Expiration'}
                    value={newDriverForm.tlcExp ? dayjs(newDriverForm.tlcExp) : undefined}
                    onChange={changeDriverFormTime('tlcExp', setNewDriverForm)}/>
      </div>
      <div className='driver_create_modal_horizontal'>
        <Input placeholder={'DL Number'} label={'DL Number'} value={newDriverForm.driverLicenseNumber}
               onChange={changeDriverFormData('driverLicenseNumber', setNewDriverForm)}/>
        <DatePicker label={'DL Expiration'}
                    value={newDriverForm.driverLicenseExp ? dayjs(newDriverForm.driverLicenseExp) : undefined}
                    onChange={changeDriverFormTime('driverLicenseExp', setNewDriverForm)}/>
      </div>
      <div className='driver_create_modal_horizontal'>
        <Input placeholder={'Last 5 Digits of SSN'} value={newDriverForm.lastSSN} label={'Last 5 Digits of SSN'}
               onChange={changeDriverFormData('lastSSN', setNewDriverForm)}/>
        <DatePicker label={'Defensive Driver Course expiration'}
                    value={newDriverForm.defensiveDriverCourseExp ? dayjs(newDriverForm.defensiveDriverCourseExp) : undefined}
                    onChange={changeDriverFormTime('defensiveDriverCourseExp', setNewDriverForm)}/>
      </div>
    </div>
  </Modal>
}

export default DriverCreateModal;
