import './DriverUpdateModal.scss';

import Input from "@/components/Input/Input.tsx";
import GoogleAutocompleteInput from "@/components/GoogleAutocompleteInput/GoogleAutocompleteInput.tsx";
import DatePicker from "@/components/Date/Date.tsx";
import Modal from '@/components/Modal/Modal.tsx';

import dayjs from "dayjs";
import { useEffect, useMemo, useState } from "react";

import {
  getDriversUpdateAndCreateFunctions,
  newDriverFormInitialState
} from "@/pages/CustomerDetails/utils/driver.tsx";
import type { IDriver, IDriverCreate, IDriverUpdate } from "@/types/driver/main.ts";

interface DriverUpdateModalProps {
  open: boolean;
  cancel: () => void;
  submit: (value: IDriverCreate) => void;
  selectedDriver?: IDriver;
}

const DriverUpdateModal = ({ open, cancel, submit, selectedDriver }: DriverUpdateModalProps) => {
  const [updateDriverForm, setUpdateDriverForm] = useState<IDriverUpdate>(newDriverFormInitialState);

  useEffect(() => {
    if (selectedDriver) {
      const { customer, ...data } = selectedDriver;
      setUpdateDriverForm({
        customer: customer._id,
        ...data
      })
    }
  }, [selectedDriver]);

  const { changeDriverFormData, changeDriverFormTime, changeDriverTLCNumber } = getDriversUpdateAndCreateFunctions();

  const validForm = useMemo(() => {
    const options = {
      firstNameValid: !!updateDriverForm.firstName.trim(),
      phoneNumberValid: !!updateDriverForm.phoneNumber.trim(),
      addressValid: !!updateDriverForm.address.trim(),
      emailValid: !!updateDriverForm.email.trim(),
      dateOfBirthValid: !!updateDriverForm.dateOfBirth,
      tlcNumberValid: !!updateDriverForm.tlcNumber.trim(),
      tlcFhvExpirationValid: !!updateDriverForm.tlcExp,
      driverLicenseNumberValid: !!updateDriverForm.driverLicenseNumber.trim(),
      driverLicenseExpirationValid: !!updateDriverForm.driverLicenseExp,
    };

    return Object.values(options).every(el => el);
  }, [updateDriverForm]);

  return <Modal open={open} onOk={() => submit(updateDriverForm)}
                okButtonProps={{ disabled: !validForm }} onCancel={cancel}>
    <div className='driver_update_modal_container'>
      <div className='driver_update_modal_horizontal'>
        <Input placeholder={'TLC Number'} value={updateDriverForm.tlcNumber} label={'TLC Number'}
               onChange={(e) => {
                 setUpdateDriverForm(prev => ({
                   ...prev,
                   tlcNumber: e.target.value
                 }));

                 changeDriverTLCNumber(e, setUpdateDriverForm)
               }}/>
      </div>
      <div className='driver_update_modal_horizontal'>
        <Input placeholder={'First name'} value={updateDriverForm.firstName} required
               onChange={changeDriverFormData('firstName', setUpdateDriverForm)} label={'First Name'}/>
        <Input placeholder={'Last name'} value={updateDriverForm.lastName}
               onChange={changeDriverFormData('lastName', setUpdateDriverForm)} label={'Last Name'}/>
        <DatePicker label='Date of birth' required
                    value={updateDriverForm.dateOfBirth ? dayjs(updateDriverForm.dateOfBirth) : undefined}
                    onChange={changeDriverFormTime('dateOfBirth', setUpdateDriverForm)}/>
      </div>
      <div className='driver_update_modal_horizontal'>
        <Input placeholder={'Phone number'} value={updateDriverForm.phoneNumber} required
               onChange={changeDriverFormData('phoneNumber', setUpdateDriverForm)}
               label={'Phone number'}/>
        <Input placeholder={'Email'} value={updateDriverForm.email}
               onChange={changeDriverFormData('email', setUpdateDriverForm)}
               label={'Email'}/>
      </div>
      <div className='driver_update_modal_horizontal'>
        <GoogleAutocompleteInput placeholder={'Address'} value={updateDriverForm.address} required
                                 onChange={changeDriverFormData('address', setUpdateDriverForm)}
                                 label={'Address'}/>
        <Input placeholder={'Apartment / Suite number'} value={updateDriverForm.apartmentNumber} required
               onChange={changeDriverFormData('apartmentNumber', setUpdateDriverForm)}
               label={'Apartment / Suite number'}/>
      </div>
      <div className='driver_update_modal_horizontal'>
        <DatePicker label={'TLC Expiration'}
                    value={updateDriverForm.tlcExp ? dayjs(updateDriverForm.tlcExp) : undefined}
                    onChange={changeDriverFormTime('tlcExp', setUpdateDriverForm)}/>
      </div>
      <div className='driver_update_modal_horizontal'>
        <Input placeholder={'DL Number'} label={'DL Number'} value={updateDriverForm.driverLicenseNumber}
               onChange={changeDriverFormData('driverLicenseNumber', setUpdateDriverForm)}/>
        <DatePicker label={'DL Expiration'}
                    value={updateDriverForm.driverLicenseExp ? dayjs(updateDriverForm.driverLicenseExp) : undefined}
                    onChange={changeDriverFormTime('driverLicenseExp', setUpdateDriverForm)}/>
      </div>
      <div className='driver_update_modal_horizontal'>
        <Input placeholder={'Last 5 Digits of SSN'} value={updateDriverForm.lastSSN} label={'Last 5 Digits of SSN'}
               onChange={changeDriverFormData('lastSSN', setUpdateDriverForm)}/>
        <DatePicker label={'Defensive Driver Course expiration'}
                    value={updateDriverForm.defensiveDriverCourseExp ? dayjs(updateDriverForm.defensiveDriverCourseExp) : undefined}
                    onChange={changeDriverFormTime('defensiveDriverCourseExp', setUpdateDriverForm)}/>
      </div>
    </div>
  </Modal>
}

export default DriverUpdateModal;
