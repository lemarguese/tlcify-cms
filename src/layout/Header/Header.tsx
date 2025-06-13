import { Select, Layout, Input } from 'antd';
import './Header.scss';

import { MenuUnfoldOutlined, NotificationOutlined } from '@ant-design/icons';
import type { FC } from "react";

const { Header: AntHeader } = Layout;

interface HeaderProps {
  showSearch: boolean;
}

const Header: FC<HeaderProps> = ({ showSearch }) => {
  return <div className='header'>
    <AntHeader className='header_container'>
      <MenuUnfoldOutlined className='header_sidebar_icon'/>
      {showSearch && <Input.Search rootClassName='header_center_search' placeholder={'Search'}/>}
      <div className='header_end'>
        <Select
          showSearch
          placeholder="En"
          optionFilterProp="label"
          options={[
            {
              value: 'en',
              label: 'En',
            },
            {
              value: 'ru',
              label: 'Ru',
            },
            {
              value: 'ch',
              label: 'Ch',
            },
          ]}
        />
        <NotificationOutlined className='header_end_notification'/>
        <div className='header_end_avatar'/>
      </div>
    </AntHeader>
  </div>
}

export default Header;
