import './Selector.scss';

import { Select } from "antd";
import type { SelectProps } from 'antd';
import type { FC } from "react";

interface SelectorProps extends SelectProps {
  label: string;
}

const Selector: FC<SelectorProps> = ({ label,  ...props }) => {
  return <div className='selector'>
    <label className='selector_label'>{label}</label>
    <Select {...props} />
  </div>
}

export default Selector;
