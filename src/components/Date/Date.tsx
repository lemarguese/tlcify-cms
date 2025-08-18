import { DatePicker } from "antd";
import type { DatePickerProps } from "antd";
import type { FC } from "react";
import './Date.scss';
import dayjs from "dayjs";

interface CustomDatePickerProps extends DatePickerProps {
  label: string;
  required?: boolean;
}

const CustomDatePicker: FC<CustomDatePickerProps> = ({ label, required = false, ...props }) => {
  return <div className='date'>
    <label className='date_label'>{label}</label>
    <DatePicker format={{
      format: 'MM/DD/YYYY',
      type: 'mask',
    }} status={!props.value && required ? 'error' : undefined} {...props} defaultValue={dayjs(new Date(Date.now()))}/>
  </div>;
}

export default CustomDatePicker;
