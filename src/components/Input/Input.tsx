import type { FC } from "react";
import { Input as AntInput } from 'antd';
import type { InputProps } from "antd";
import './Input.scss';

interface CustomInputProps extends InputProps {
  label: string;
}

const Input: FC<CustomInputProps> = ({ label, ...props }) => {
  return <div className='input'>
    <label className='input_label'>{label}</label>
    <AntInput variant='filled' {...props}/>
  </div>
}

export default Input;
