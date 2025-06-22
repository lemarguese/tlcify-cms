import { Divider } from "antd";
import Input from "@/components/Input/Input.tsx";
import Checkbox from "@/components/Checkbox/Checkbox.tsx";

import './AuthorizationPage.scss';
import Button from "@/components/Button/Button.tsx";
import PasswordInput from "@/components/PasswordInput/PasswordInput.tsx";

import GoogleIcon from '@/assets/icons/google_icon.svg';
import { BaseSyntheticEvent, useState } from "react";
import type { ILogin } from "@/types/auth/main.ts";
import { instance } from "@/api/axios.ts";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";

const AuthorizationPage = () => {
  const navigate = useNavigate();

  const [loginData, setLoginData] = useState<ILogin>({
    email: '',
    password: ''
  });

  const onSubmit = async () => {
    try {
      const res = await instance.post('/auth/login', loginData);
      if (res.status === 200) navigate('/customers');
    } catch (error) {
      console.log(error);
      const message = error?.response?.data?.message || 'Login failed';
      toast.error(message);
    }
  }

  const onChange = (key: keyof ILogin) => {
    return (val: BaseSyntheticEvent) => {
      setLoginData(prev => ({
        ...prev,
        [key]: val.target.value,
      }))
    }
  }

  return <div className='authorization_page'>
    <div className='authorization_page_container'>
      <div className='authorization_page_header'>
        <h4 className='authorization_page_header_title'>Log in</h4>
        <Button className='authorization_page_buttons_google' icon={
          <img src={GoogleIcon}/>
        }>Log in with Google</Button>
      </div>
      <Divider/>
      <div className='authorization_page_body'>
        <div className='authorization_page_inputs'>
          <Input label='Email' placeholder='leslie@pixsellz.io' onChange={onChange('email')}/>
          <PasswordInput label='Password' onChange={onChange('password')}/>
        </div>
        <Checkbox label='Remember me'/>
        <Button className='authorization_page_buttons_login' onClick={onSubmit}>Log in</Button>
        <Button variant='outlined' className='authorization_page_buttons_forgot'>Forgot password?</Button>
      </div>
      <Divider/>
      <div className='authorization_page_footer'>
        <p className='authorization_page_footer_warning'>Don´t have an account?</p>
        <Button className='authorization_page_buttons_signup'>Sign up</Button>
      </div>
    </div>
  </div>
}

export default AuthorizationPage;
