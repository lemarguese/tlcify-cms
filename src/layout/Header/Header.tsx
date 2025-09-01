import { Select, Layout, Input, Tooltip } from 'antd';
import './Header.scss';

import { LeftOutlined, NotificationOutlined, UserOutlined } from '@ant-design/icons';
import type { FC, BaseSyntheticEvent } from "react";
import Button from "@/components/Button/Button.tsx";
import { useMemo } from "react";
import { useNavigate } from "react-router";
import { getAuthFunctions } from "@/pages/Authorization/utils/auth.ts";
import Breadcrumbs from "@/components/Breadcrumbs/Breadcrumbs.tsx";

const { Header: AntHeader } = Layout;

interface HeaderProps {
  onSearchChange?: (val: BaseSyntheticEvent) => void;
  onSearchPress?: () => void;
  searchQuery?: string;
  showSearch?: boolean;

  fixed?: boolean;
  logOut: () => void;
}

const Header: FC<HeaderProps> = ({
                                   showSearch = true,
                                   fixed = false,
                                   onSearchChange,
                                   onSearchPress,
                                   searchQuery,
                                   logOut
                                 }) => {
  const navigate = useNavigate();

  const profileTools = useMemo(() => <div>
    <Button onClick={logOut}>Log out</Button>
  </div>, [logOut])

  return <div className='header' style={{ position: fixed ? 'absolute' : 'fixed' }}>
    <AntHeader className='header_container'>
      <Breadcrumbs/>
      {showSearch &&
          <Input.Search value={searchQuery} allowClear={false} onSearch={onSearchPress} onChange={onSearchChange}
                        rootClassName='header_center_search'
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
        <Tooltip title={profileTools} color={'#FFF'}>
          <div className='header_end_avatar'>
            <UserOutlined/>
            {/*{user.avatarUrl ? <img src={user.avatarUrl} className='header_end_avatar_icon'/> :*/}
            {/*  <UserOutlined/>}*/}
          </div>
        </Tooltip>
      </div>
    </AntHeader>
  </div>
}

export default Header;
