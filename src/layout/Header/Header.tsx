import { Select, Layout, Input } from 'antd';
import './Header.scss';

import { MenuUnfoldOutlined, NotificationOutlined } from '@ant-design/icons';

const { Header: AntHeader } = Layout;

const Header = () => {
  return <div className='header'>
    <AntHeader className='header_container'>
      <MenuUnfoldOutlined className='header_sidebar_icon'/>
      <Input.Search rootClassName='header_center_search' />
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
