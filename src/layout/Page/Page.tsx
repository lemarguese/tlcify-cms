import './Page.scss';
import type { FC, ReactNode } from "react";
import { Layout } from "antd";

interface PageProps {
  children: ReactNode;
}

const Page: FC<PageProps> = ({ children }) => {
  return <Layout className='page_container'>
    {children}
  </Layout>
}

export default Page;
