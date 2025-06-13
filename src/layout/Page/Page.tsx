import './Page.scss';
import type { FC, ReactNode } from "react";
import { Layout } from "antd";
import Sidebar from "../../layout/Sidebar/Sidebar.tsx";
import Header from "../Header/Header.tsx";

interface PageProps {
  children: ReactNode;
  showSearch?: boolean;
}

const Page: FC<PageProps> = ({ children, showSearch = true }) => {
  return <Layout className='page'>
    <Sidebar/>
    <div className='page_container'>
      <Header showSearch={showSearch}/>
      {children}
    </div>
  </Layout>
}

export default Page;
