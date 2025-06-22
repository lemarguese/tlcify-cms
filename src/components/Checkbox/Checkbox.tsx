import type { FC } from "react";
import type { CheckboxProps } from "antd";
import './Checkbox.scss';

import { Checkbox as AntCheckbox } from "antd";

interface CustomerCheckboxProps extends CheckboxProps {
  label: string;
}

const Checkbox: FC<CustomerCheckboxProps> = ({ label, ...props }) => {
  return <div className='checkbox_container'>
    <AntCheckbox {...props} />
    <p className='checkbox_label'>{label}</p>
  </div>
}

export default Checkbox;
