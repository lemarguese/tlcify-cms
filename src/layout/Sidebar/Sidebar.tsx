import './Sidebar.scss';
import type { FC } from "react";
import { Layout, Menu } from 'antd';
import { UserOutlined, MoneyCollectOutlined } from '@ant-design/icons';

const { Sider } = Layout;

interface SidebarProps {
}

const Sidebar: FC<SidebarProps> = () => {
  // const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <aside className='sidebar'>
      <Sider trigger={null}  className='sidebar_container'>
        <div className='sidebar_logo'>
          <h2 className='sidebar_logo_text'>TLCify</h2>
        </div>
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
