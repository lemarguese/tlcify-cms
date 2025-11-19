import './InputNumber.scss';

import { InputNumber as AntInputNumber } from 'antd';
import { useEffect, useMemo, useState } from "react";

import { ExclamationCircleOutlined } from '@ant-design/icons';
import { numberFormatter } from "@/utils/common.ts";

import type { InputNumberProps } from 'antd';

interface CustomInputNumberProps extends InputNumberProps {
  label: string;
  required?: boolean;
}

const InputNumber = ({ label, required = false, ...props }: CustomInputNumberProps) => {
  const [isFocused, setIsFocused] = useState(true);

  useEffect(() => {
    return () => setIsFocused(true)
  }, []);

  const commonProps: Pick<CustomInputNumberProps, 'variant' | 'onBlur' | 'onFocus' | 'status' | 'prefix' | 'formatter'> = useMemo(() => ({
    variant: 'outlined' as CustomInputNumberProps['variant'],
    onBlur: () => setIsFocused(false),
    onFocus: () => setIsFocused(true),
    ...(required ? {
      status: (!isFocused && !props.value ? 'error' : undefined) as CustomInputNumberProps['status'],
      prefix: !isFocused && !props.value ? <ExclamationCircleOutlined/> : undefined
    } : {}),
    formatter: numberFormatter
  }), [required, isFocused, props.value]);

  return <div className='input_number'>
    <label className='input_number_label'>{label}</label>
    <AntInputNumber {...commonProps} {...props}/>
  </div>
}

export default InputNumber;
