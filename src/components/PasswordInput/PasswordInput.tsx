import { Input } from "antd";
import type { PasswordProps } from "antd/es/input";
import type { FC } from "react";

import './PasswordInput.scss';

interface PasswordInputProps extends PasswordProps {
  label: string;
}

const PasswordInput: FC<PasswordInputProps> = ({ label, ...props }) => {

  return <div className='password_input'>
    <label className='password_input_label'>{label}</label>
    <Input.Password {...props} />
  </div>
}


export default PasswordInput;
