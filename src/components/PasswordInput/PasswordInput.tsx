import { Input } from "antd";
import type { PasswordProps } from "antd/es/input";
import type { FC } from "react";

import './PasswordInput.scss';

interface PasswordInputProps extends PasswordProps {
  label: string;
}

const PasswordInput: FC<PasswordInputProps> = ({ label, ...props }) => {

  return <div className='password_input'>
    <p className='password_input_label'>{label}</p>
    <Input.Password {...props} />
  </div>
}


export default PasswordInput;
