import { Select, Layout, Input } from 'antd';
import './Header.scss';

import { MenuUnfoldOutlined, NotificationOutlined, UserOutlined } from '@ant-design/icons';
import type { FC } from "react";

const { Header: AntHeader } = Layout;

interface HeaderProps {
  setSearchQuery?: (val: string) => void;
  searchQuery?: string;
  showSearch: boolean;
}

const Header: FC<HeaderProps> = ({ showSearch, setSearchQuery, searchQuery }) => {
  return <div className='header'>
    <AntHeader className='header_container'>
      <MenuUnfoldOutlined className='header_sidebar_icon'/>
      {showSearch && <Input.Search value={searchQuery} allowClear onSearch={setSearchQuery} rootClassName='header_center_search'
                                   placeholder={'Search'} enterButton/>}
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
        <div className='header_end_avatar'>
          <UserOutlined/>
        </div>
      </div>
    </AntHeader>
  </div>
}

export default Header;
