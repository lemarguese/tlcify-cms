import './Range.scss';

import { DatePicker } from "antd";
import type { RangePickerProps } from "antd/es/date-picker";

const { RangePicker } = DatePicker;

interface RangeProps extends RangePickerProps {
  label: string;
}

const Range = ({ label, ...props }: RangeProps) => {
  return <div className='range'>
    <label className='range_label'>{label}</label>
    <RangePicker format={'MM/DD/YYYY'} {...props}/>
  </div>
}

export default Range;
