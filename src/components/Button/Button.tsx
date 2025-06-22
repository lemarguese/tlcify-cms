import { Button as AntButton } from "antd";
import type { ButtonProps } from "antd";
import type { FC } from "react";

import './Button.scss';

interface CustomButtonProps extends ButtonProps {

}

const Button: FC<CustomButtonProps> = ({ ...props }) => {

  return <div className='button'>
    <AntButton {...props}/>
  </div>
}

export default Button;
