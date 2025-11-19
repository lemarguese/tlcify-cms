import type { FC } from "react";
import { Input as AntInput, InputNumber } from 'antd';
import type { InputProps } from "antd";
import './Input.scss';
import { useEffect, useMemo, useState } from "react";

import { ExclamationCircleOutlined } from '@ant-design/icons';
import { numberFormatter } from "@/utils/common.ts";

interface CustomInputProps extends InputProps {
  label: string;
  required?: boolean;
  type?: 'text' | 'number';
}

const Input: FC<CustomInputProps> = ({ label, required = false, type = 'text', ...props }) => {
  const [isFocused, setIsFocused] = useState(true);

  useEffect(() => {
    return () => setIsFocused(true)
  }, []);

  const TypeElement = type === 'number' ? InputNumber : AntInput;

  const elementProps: CustomInputProps = useMemo(() => {
    const common = {
      variant: 'outlined',
      onBlur: () => setIsFocused(false),
      onFocus: () => setIsFocused(true),
      ...(required ? {
        status: !isFocused && !props.value ? 'error' : undefined,
        prefix: !isFocused && !props.value ? <ExclamationCircleOutlined/> : undefined
      } : {}),
      ...props
    };

    const numberProps = {
      formatter: numberFormatter,
    }

    return type === 'number' ? { ...common, ...numberProps } : { ...common }
  }, [required, type, isFocused, props]);

  return <div className='input'>
    <label className='input_label'>{label}</label>
    <TypeElement {...elementProps}/>
  </div>
}

export default Input;
