import './Sidebar.scss';
import { Layout, Menu } from 'antd';
import {
  UserOutlined,
  MoneyCollectOutlined,
  SettingOutlined,
  BarChartOutlined,
  ContainerOutlined
} from '@ant-design/icons';
import { useLocation, useNavigate } from "react-router";

const { Sider } = Layout;

interface SidebarProps {
  user_permissions: string[];
}

const sidebarOptions: { [k: string]: string } = {
  'sidebar-customer': '/customers',
  'sidebar-payment': '/payments',
  'sidebar-insurance': '/insurances',
  'sidebar-analytics': '/analytics',
  'sidebar-renewal': '/renewals',
  'sidebar-settings': '/settings'
}

const getNavigationOptions = (location: string) => {
  const options = {
    '/customers': 'sidebar-customer',
    '/payments': 'sidebar-payment',
    '/insurances': 'sidebar-insurance',
    '/analytics': 'sidebar-analytics',
    '/renewals': 'sidebar-renewal',
    '/settings': 'sidebar-settings',
    '/policy': 'sidebar-customer'
  };

  const [key] = Object.entries(options).filter(([k, _]) => {
    return location.includes(k)
  });

  return key;
}

const sidebars = [
  {
    key: 'sidebar-customer',
    icon: <UserOutlined/>,
    label: 'Customer',
    permissions: ['read_customers']
  },
  {
    key: 'sidebar-payment',
    icon: <MoneyCollectOutlined/>,
    label: 'Payment',
    permissions: ['read_payments']
  },
  {
    key: 'sidebar-insurance',
    icon: <MoneyCollectOutlined/>,
    label: 'Insurance',
    permissions: ['create_insurances']
  },
  {
    key: 'sidebar-analytics',
    icon: <BarChartOutlined/>,
    label: 'Analytics',
    permissions: ['read_analytics']
  },
  {
    key: 'sidebar-renewal',
    icon: <ContainerOutlined/>,
    label: 'Renewal',
    permissions: ['read_renewals']
  },
  {
    key: 'sidebar-settings',
    icon: <SettingOutlined/>,
    label: 'Settings',
    permissions: ['update_settings']
  },
]

const Sidebar = ({ user_permissions }: SidebarProps) => {
  const allowedItems = sidebars.filter(item =>
    !item.permissions || item.permissions.some(p => user_permissions.includes(p))
  );

  const navigate = useNavigate();
  const location = useLocation();

  return (
    <aside className='sidebar'>
      <Sider trigger={null} className='sidebar_container'>
        <div className='sidebar_logo'>
          <h2 className='sidebar_logo_text'>TLCify.com</h2>
        </div>
        <Menu
          onSelect={(item) => { navigate(sidebarOptions[item.key]) }}
          style={{ border: 'none' }}
          // theme="dark"
          mode="inline"
          defaultSelectedKeys={getNavigationOptions(location.pathname)}
          items={allowedItems}
        />
      </Sider>
    </aside>
  )
}

export default Sidebar;
