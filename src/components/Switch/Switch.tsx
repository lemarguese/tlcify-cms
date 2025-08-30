import './Switch.scss';

import { Switch as AntSwitch } from "antd";
import type { SwitchProps } from "antd";
import type { FC } from "react";

interface CustomSwitchProps extends SwitchProps {
  label: string;
}

const Switch: FC<CustomSwitchProps> = (props) => {
  return <div className='switch'>
    <label className='switch_label'>{props.label}</label>
    <AntSwitch {...props}/>
  </div>
}

export default Switch;
