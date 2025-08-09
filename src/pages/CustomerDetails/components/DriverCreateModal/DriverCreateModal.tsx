import './DriverCreateModal.scss';

import Input from "@/components/Input/Input.tsx";
import GoogleAutocompleteInput from "@/components/GoogleAutocompleteInput/GoogleAutocompleteInput.tsx";
import DatePicker from "@/components/Date/Date.tsx";
import Modal from '@/components/Modal/Modal.tsx';

import dayjs, { Dayjs } from "dayjs";
import { useState } from "react";
import type { BaseSyntheticEvent, Dispatch, SetStateAction } from 'react';

import { newDriverFormInitialState } from "@/pages/CustomerDetails/utils/driver.tsx";
import type { IDriver, IDriverCreate } from "@/types/driver/main.ts";

interface DriverCreateModalProps {
  open: boolean;
  cancel: () => void;
  submit: (value: IDriverCreate, resetForm: Dispatch<SetStateAction<IDriverCreate>>) => void;
  dateChange: (val: keyof Pick<IDriver, 'dateOfBirth' | 'tlcExp' | 'defensiveDriverCourseExp' | 'driverLicenseExp'>, callback: Dispatch<SetStateAction<IDriverCreate>>) => (val: Dayjs) => void;
  formChange: (val: keyof Omit<IDriver, 'dateOfBirth' | 'tlcExp' | 'defensiveDriverCourseExp' | 'driverLicenseExp'>, callback: Dispatch<SetStateAction<IDriverCreate>>) => (val: BaseSyntheticEvent) => void;
}

const DriverCreateModal = ({ open, cancel, formChange, dateChange, submit }: DriverCreateModalProps) => {
  const [newDriverForm, setNewDriverForm] = useState<IDriverCreate>(newDriverFormInitialState);


  // TODO What fields are required ?
  return <Modal open={open} onOk={() => submit(newDriverForm, setNewDriverForm)} onCancel={cancel}>
    <div className='driver_create_modal_container'>
      <div className='driver_create_modal'>
        <Input placeholder={'First name'} value={newDriverForm.firstName} required
               onChange={formChange('firstName', setNewDriverForm)} label={'First Name'}/>
        <Input placeholder={'Last name'} value={newDriverForm.lastName} required
               onChange={formChange('lastName', setNewDriverForm)} label={'Last Name'}/>
      </div>
      <div>
        <Input placeholder={'Phone number'} value={newDriverForm.phoneNumber} required
               onChange={formChange('phoneNumber', setNewDriverForm)}
               label={'Phone number'}/>
        <GoogleAutocompleteInput placeholder={'Address'} value={newDriverForm.address} required
                                 onChange={formChange('address', setNewDriverForm)}
                                 label={'Address'}/>
        <Input placeholder={'Email'} value={newDriverForm.email} onChange={formChange('email', setNewDriverForm)}
               label={'Email'}/>
      </div>
      <div>
        <DatePicker label='Date of birth' required
                    value={newDriverForm.dateOfBirth ? dayjs(newDriverForm.dateOfBirth) : undefined}
                    onChange={dateChange('dateOfBirth', setNewDriverForm)}/>
      </div>
      <div className='driver_create_modal_tlc'>
        <Input placeholder={'TLC Number'} value={newDriverForm.tlcNumber} label={'TLC Number'}
               onChange={formChange('tlcNumber', setNewDriverForm)}/>
        <DatePicker label={'TLC Expiration'}
                    value={newDriverForm.tlcExp ? dayjs(newDriverForm.tlcExp) : undefined}
                    onChange={dateChange('tlcExp', setNewDriverForm)}/>
      </div>
      <div className='driver_create_modal_tlc'>
        <Input placeholder={'DL Number'} label={'DL Number'} value={newDriverForm.driverLicenseNumber}
               onChange={formChange('driverLicenseNumber', setNewDriverForm)}/>
        <DatePicker label={'DL Expiration'}
                    value={newDriverForm.driverLicenseExp ? dayjs(newDriverForm.driverLicenseExp) : undefined}
                    onChange={dateChange('driverLicenseExp', setNewDriverForm)}/>
      </div>
      <div>
        <Input placeholder={'Last 5 Digits of SSN'} value={newDriverForm.lastSSN} label={'Last 5 Digits of SSN'}
               onChange={formChange('lastSSN', setNewDriverForm)}/>
      </div>
      <div>
        <DatePicker label={'Defensive Driver Course expiration'}
                    value={newDriverForm.defensiveDriverCourseExp ? dayjs(newDriverForm.defensiveDriverCourseExp) : undefined}
                    onChange={dateChange('defensiveDriverCourseExp', setNewDriverForm)}/>
      </div>
    </div>
  </Modal>
}

export default DriverCreateModal;
