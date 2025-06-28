import type { FC } from "react";
import { Input as AntInput } from 'antd';
import type { InputProps } from "antd";
import './Input.scss';

interface CustomInputProps extends InputProps {
  label: string;
}

const Input: FC<CustomInputProps> = ({ label, ...props }) => {
  return <div className='input'>
    <h6 className='input_label'>{label}</h6>
    <AntInput variant='filled' {...props}/>
  </div>
}

export default Input;
