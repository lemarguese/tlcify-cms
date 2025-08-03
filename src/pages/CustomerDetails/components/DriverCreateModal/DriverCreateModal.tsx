import './DriverCreateModal.scss';

import Input from "@/components/Input/Input.tsx";
import GoogleAutocompleteInput from "@/components/GoogleAutocompleteInput/GoogleAutocompleteInput.tsx";
import DatePicker from "@/components/Date/Date.tsx";
import dayjs, { Dayjs } from "dayjs";
import { Modal } from "antd";
import type { FC } from "react";
import { BaseSyntheticEvent, Dispatch, SetStateAction, useCallback, useState } from "react";
import { instance } from "@/api/axios.ts";
import { newDriverFormInitialState } from "@/pages/CustomerDetails/utils/driver.tsx";
import type { IDriver, IDriverCreate } from "@/types/driver/main.ts";

interface DriverCreateModalProps {
  open: boolean;
  cancel: () => void;
  dateChange: (val: keyof Pick<IDriver, 'dateOfBirth' | 'tlcExp' | 'defensiveDriverCourseExp' | 'driverLicenseExp'>, callback: Dispatch<SetStateAction<IDriverCreate>>) => (val: Dayjs) => void;
  formChange: (val: keyof Omit<IDriver, 'dateOfBirth' | 'tlcExp' | 'defensiveDriverCourseExp' | 'driverLicenseExp'>, callback: Dispatch<SetStateAction<IDriverCreate>>) => (val: BaseSyntheticEvent) => void;
}

const DriverCreateModal: FC<DriverCreateModalProps> = ({ open, cancel, formChange, dateChange }) => {

  const [newDriverForm, setNewDriverForm] = useState<IDriverCreate>(newDriverFormInitialState);

  const submitForm = useCallback(async () => {
    await instance.post('/driver', { ...newDriverForm, customerId });
    setNewDriverForm(newDriverFormInitialState);
    cancel();
  }, [newDriverForm]);

  return <Modal open={open} onOk={submitForm} onCancel={cancel}>
    <div className='driver_create_modal_container'>
      <div className='driver_create_modal'>
        <Input placeholder={'First name'} value={newDriverForm.firstName}
               onChange={formChange('firstName', setNewDriverForm)} label={'First Name'}/>
        <Input placeholder={'Last name'} value={newDriverForm.lastName}
               onChange={formChange('lastName', setNewDriverForm)} label={'Last Name'}/>
      </div>
      <div>
        <Input placeholder={'Phone number'} value={newDriverForm.phoneNumber}
               onChange={formChange('phoneNumber', setNewDriverForm)}
               label={'Phone number'}/>
        <GoogleAutocompleteInput placeholder={'Address'} value={newDriverForm.address}
                                 onChange={formChange('address', setNewDriverForm)}
                                 label={'Address'}/>
        <Input placeholder={'Email'} value={newDriverForm.email} onChange={formChange('email', setNewDriverForm)}
               label={'Email'}/>
      </div>
      <div>
        <DatePicker label='Date of birth'
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
