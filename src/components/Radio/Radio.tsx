import './Radio.scss';

import { Radio as AntRadio } from "antd";
import type { RadioGroupProps } from 'antd';
import type { FC } from "react";

interface CustomRadioProps extends RadioGroupProps {
  label: string;
}

const Radio: FC<CustomRadioProps> = ({ label, ...props }) => {
  return <div className='radio'>
    <label className='radio_label'>{label}</label>
    <AntRadio.Group {...props} />
  </div>
}

export default Radio;
