import { Breadcrumb } from "antd";
import { Link, useLocation, useParams } from "react-router-dom";
import type { ItemType } from "antd/es/breadcrumb/Breadcrumb";
import { HomeOutlined, UserOutlined } from '@ant-design/icons';

const breadcrumbNameMap: Record<string, string> = {
  "/customers": "Customers",
  "/payments": "Payments",
  "/insurances": "Insurances",
  "/policy": "Policy",
  "/billing": "Billing",
  "/renewals": "Renewals",
  "/analytics": "Analytics",
  "/invoices": "Invoices",
  "/settings": "Settings",
};

const Breadcrumbs = () => {
  const location = useLocation();
  const params = useParams();
  const path = location.pathname;

  let items: ItemType[] = [];

  if (path.startsWith("/customers")) {
    if (!path.includes("/policy")) {
      if (params.customerId) {
        items = [
          { title: <Link to="/customers"><HomeOutlined/></Link> },
          {
            title: <>
              <UserOutlined/>
              <span>Customer details</span>
            </>
          },
        ];
      } else {
        items = [
          { title: <Link to="/customers"><HomeOutlined/></Link> }
        ]
      }
    } else {
      items = [
        { title: <Link to="/customers"><HomeOutlined/></Link> },
        {
          title: <Link to={`/customers/${params.customerId}`}>
            <UserOutlined/>
            <span>Customer details</span>
          </Link>
        },
        { title: `Policy #${params.policyId}` },
      ];
    }
  } else if (path.startsWith("/drivers/")) {
    items = [
      { title: <Link to="/drivers">Drivers</Link> },
      { title: `Driver #${params.driverId}` },
    ];
  } else if (path.startsWith("/invoices/")) {
    items = [
      { title: <Link to="/invoices">Invoices</Link> },
      { title: `Invoice #${params.invoiceId}` },
    ];
  } else if (path.startsWith("/payments/")) {
    items = [
      { title: <Link to="/payments">Payments</Link> },
      { title: `Payment #${params.paymentId}` },
    ];
  } else {
    // fallback for static routes
    const base = breadcrumbNameMap[path];
    if (base) items = [{ title: base }];
  }

  return <Breadcrumb items={items}/>;
};

export default Breadcrumbs;
