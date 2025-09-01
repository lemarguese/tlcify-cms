import './CustomerDetailsProfile.scss';

import BirthdayIcon from '@/assets/icons/birthday_icon.svg';

import type { FC } from "react";
import dayjs from 'dayjs';

import { UserOutlined } from '@ant-design/icons';

interface CustomerDetailProfileProps {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  dateOfBirth: Date;
}

const CustomerDetailProfile: FC<CustomerDetailProfileProps> = ({ firstName, lastName, phoneNumber, dateOfBirth }) => {
  return <div className='customer_details_page_profile'>
    <div className='customer_details_page_profile_header'>
      <UserOutlined className='customer_details_page_profile_header_image' />
      <div className='customer_details_page_profile_header_info'>
        <p>{firstName} {lastName}</p>
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
        <div className='customer_details_page_profile_footer_section_icon'></div>
        <div className='customer_details_page_profile_footer_section_content'>
          <p>Gender</p>
          <p>Male</p>
        </div>
      </div>
    </div>
  </div>
}

export default CustomerDetailProfile;
