import './Page.scss';
import type { FC, ReactNode } from "react";
import { Layout } from "antd";
import Sidebar from "../../layout/Sidebar/Sidebar.tsx";
import Header from "../Header/Header.tsx";

interface PageProps {
  children: ReactNode;
}

const Page: FC<PageProps> = ({ children }) => {
  return <Layout className='page'>
    <Sidebar/>
    <div className='page_container'>
      <Header/>
      {children}
    </div>
  </Layout>
}

export default Page;
