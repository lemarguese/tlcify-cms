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
  title?: string;
}

const Page: FC<PageProps> = ({ children, title, fixedHeader = false, ...searchProps }) => {
  return <Layout className='page'>
    <Sidebar/>
    <div className='page_container'>
      <Header fixed={fixedHeader} {...searchProps} />
      <div className='page_container_label'>
        <label className='page_container_label_title'>{title}</label>
      </div>
      {children}
    </div>
  </Layout>
}

export default Page;
