import { Switch as AntSwitch } from "antd";
import type { SwitchProps } from "antd";
import type { FC } from "react";

interface CustomSwitchProps extends SwitchProps {

}

const Switch: FC<CustomSwitchProps> = (props) => {
  return <AntSwitch {...props}/>
}

export default Switch;
