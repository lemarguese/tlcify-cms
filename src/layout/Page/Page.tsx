import './Page.scss';
import type { BaseSyntheticEvent, FC, ReactNode } from "react";
import { Layout } from "antd";
import Sidebar from "../../layout/Sidebar/Sidebar.tsx";
import Header from "../Header/Header.tsx";

interface PageProps {
  children: ReactNode;

  showSearch?: boolean;
  onSearchChange?: (val: BaseSyntheticEvent) => void;
  onSearchPress?: () => void;
  searchQuery?: string;

  back?: () => void;

  fixedHeader?: boolean;
}

const Page: FC<PageProps> = ({ children, fixedHeader = false, ...searchProps }) => {
  return <Layout className='page'>
    <Sidebar/>
    <div className='page_container'>
      <Header fixed={fixedHeader} {...searchProps} />
      {children}
    </div>
  </Layout>
}

export default Page;
