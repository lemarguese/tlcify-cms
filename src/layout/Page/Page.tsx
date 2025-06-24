import './Page.scss';
import type { FC, ReactNode } from "react";
import { Layout } from "antd";
import Sidebar from "../../layout/Sidebar/Sidebar.tsx";
import Header from "../Header/Header.tsx";

interface PageProps {
  children: ReactNode;
  showSearch?: boolean;

  setSearchQuery?: (val: string) => void;
  searchQuery?: string;
  back?: () => void;
}

const Page: FC<PageProps> = ({ children, ...searchProps }) => {
  return <Layout className='page'>
    <Sidebar/>
    <div className='page_container'>
      <Header {...searchProps} />
      {children}
    </div>
  </Layout>
}

export default Page;
