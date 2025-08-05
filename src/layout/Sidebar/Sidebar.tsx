import './Sidebar.scss';
import { Layout, Menu } from 'antd';
import { UserOutlined, MoneyCollectOutlined } from '@ant-design/icons';
import { useLocation, useNavigate } from "react-router";

const { Sider } = Layout;

interface SidebarProps {
}

const sidebarOptions: { [k: string]: string } = {
  'sidebar-customer': '/customers',
  'sidebar-payment': '/payments',
  'sidebar-insurance': '/insurances'
}

const navigateOptions: { [k: string]: string } = {
  '/customers': 'sidebar-customer',
  '/payments': 'sidebar-payment',
  '/insurances': 'sidebar-insurance'
}

const Sidebar = ({}: SidebarProps) => {
  // const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <aside className='sidebar'>
      <Sider trigger={null} className='sidebar_container'>
        <div className='sidebar_logo'>
          <h2 className='sidebar_logo_text'>TLCify</h2>
        </div>
        <Menu
          onSelect={(item) => { navigate(sidebarOptions[item.key]) }}
          style={{ border: 'none' }}
          // theme="dark"
          mode="inline"
          defaultSelectedKeys={[navigateOptions[location.pathname]]}
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
            {
              key: 'sidebar-insurance',
              icon: <MoneyCollectOutlined/>,
              label: 'Insurance',
            },
          ]}
        />
      </Sider>
    </aside>
  )
}

export default Sidebar;
