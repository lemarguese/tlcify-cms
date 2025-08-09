import './Selector.scss';

import { Select } from "antd";
import type { SelectProps } from 'antd';
import type { FC, ReactNode } from "react";
import { useMemo, useState } from "react";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import type { InputStatus } from "antd/es/_util/statusUtils";

interface SelectorProps extends SelectProps {
  label: string;
  required?: boolean;
}

const Selector: FC<SelectorProps> = ({ label, required = false, ...props }) => {

  const [isFocused, setIsFocused] = useState(true);

  const validationOptions: { status?: InputStatus, prefix?: ReactNode } = useMemo(() => (required ? {
    status: !isFocused && !props.value ? 'error' : undefined,
    prefix: !isFocused && !props.value ? <ExclamationCircleOutlined/> : undefined
  } : {}), [required, isFocused, props.value]);

  return <div className='selector'>
    <label className='selector_label'>{label}</label>
    <Select {...validationOptions}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            {...props} />
  </div>
}

export default Selector;
