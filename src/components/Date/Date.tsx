import { DatePicker } from "antd";
import type { DatePickerProps } from "antd";
import type { FC } from "react";
import './Date.scss';
import dayjs from "dayjs";

interface CustomDatePickerProps extends DatePickerProps {
  label: string;
}

const CustomDatePicker: FC<CustomDatePickerProps> = ({ label, ...props }) => {
  return <div className='date'>
    <h6>{label}</h6>
    <DatePicker  {...props} defaultValue={dayjs(new Date(Date.now()))} format={'MM/DD/YYYY'}/>
  </div>;
}

export default CustomDatePicker;
