import './CustomerDetailsProfile.scss';

import BirthdayIcon from '@/assets/icons/birthday_icon.svg';

import type { FC } from "react";
import dayjs from 'dayjs';

import { UserOutlined } from '@ant-design/icons';
import Button from "@/components/Button/Button.tsx";
import Permission from "@/layout/Permission/Permission.tsx";

interface CustomerDetailProfileProps {
  name: string;
  phoneNumber: string;
  dateOfBirth: Date;

  showActivity?: () => void;
  user_permission: string[];
}

const CustomerDetailProfile: FC<CustomerDetailProfileProps> = ({
                                                                 name,
                                                                 showActivity,
                                                                 phoneNumber,
                                                                 dateOfBirth,
                                                                 user_permission
                                                               }) => {
  return <div className='customer_details_page_profile'>
    <div className='customer_details_page_profile_header'>
      <UserOutlined className='customer_details_page_profile_header_image'/>
      <div className='customer_details_page_profile_header_info'>
        <p>{name}</p>
        <p>{phoneNumber}</p>
      </div>
    </div>
    <div className='customer_details_page_profile_footer'>
      <div className='customer_details_page_profile_footer_section'>
        <div className='customer_details_page_profile_footer_section_icon'>
          <img src={BirthdayIcon} alt='customer-details-profile-birthday-icon'/>
        </div>
        <div className='customer_details_page_profile_footer_section_content'>
          <p>Birthday</p>
          <p>{dayjs(dateOfBirth).format('MM/DD/YYYY')}</p>
        </div>
      </div>
      <div className='customer_details_page_profile_footer_section'>
        <Permission permission={['read_audit_logs']} user_permission={user_permission}>
          <Button variant='solid' onClick={showActivity} type='primary'>Show activity logs</Button>
        </Permission>
      </div>
    </div>
  </div>
}

export default CustomerDetailProfile;
