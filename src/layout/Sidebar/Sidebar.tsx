import './Sidebar.scss';
import type { FC } from "react";
import { Layout, Menu } from 'antd';
import { UserOutlined, MoneyCollectOutlined } from '@ant-design/icons';

import LogoImage from '../../assets/images/logo.jpg';

const { Sider } = Layout;

interface SidebarProps {
}

const Sidebar: FC<SidebarProps> = () => {
  // const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <aside className='sidebar'>
      <Sider trigger={null}  className='sidebar_container'>
        <img alt='sidebar-project-logo' src={LogoImage} className='sidebar_logo'></img>
        <Menu
          style={{ border: 'none' }}
          // theme="dark"
          mode="inline"
          defaultSelectedKeys={['1']}
          items={[
            {
              key: 'sidebar-customer',
              icon: <UserOutlined/>,
              label: 'Customer',
            },
            {
              key: 'sidebar-payment',
              icon: <MoneyCollectOutlined/>,
              label: 'Payment',
            },
          ]}
        />
      </Sider>
    </aside>
  )
}

export default Sidebar;
