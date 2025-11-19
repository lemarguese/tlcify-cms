import type { FC } from "react";
import { Input as AntInput } from 'antd';
import type { InputProps } from "antd";
import './Input.scss';
import { useEffect, useMemo, useState } from "react";

import { ExclamationCircleOutlined } from '@ant-design/icons';

interface CustomInputProps extends InputProps {
  label: string;
  required?: boolean;
}

const Input: FC<CustomInputProps> = ({ label, required = false, ...props }) => {
  const [isFocused, setIsFocused] = useState(true);

  const validationOptions: Pick<CustomInputProps, 'status' | 'prefix'> = useMemo(() => (required ? {
    status: !isFocused && !props.value ? 'error' : undefined,
    prefix: !isFocused && !props.value ? <ExclamationCircleOutlined/> : undefined
  } : {}), [required, isFocused, props.value]);

  useEffect(() => {
    return () => setIsFocused(true)
  }, []);

  return <div className='input'>
    <label className='input_label'>{label}</label>
    <AntInput {...validationOptions} onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              variant='outlined' {...props}/>
  </div>
}

export default Input;
