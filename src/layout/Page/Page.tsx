import './Page.scss';
import type { BaseSyntheticEvent, FC, ReactNode } from "react";
import { Layout } from "antd";
import Sidebar from "../../layout/Sidebar/Sidebar.tsx";
import Header from "../Header/Header.tsx";
import { getAuthFunctions } from "@/pages/Authorization/utils/auth.ts";
import { useEffect } from "react";

interface PageProps {
  children: ReactNode;

  showSearch?: boolean;
  onSearchChange?: (val: BaseSyntheticEvent) => void;
  onSearchPress?: () => void;
  searchQuery?: string;

  fixedHeader?: boolean;
  title?: string;
}

const Page: FC<PageProps> = ({ children, title, fixedHeader = false, ...searchProps }) => {
  const { logOut, user, fetchMyself } = getAuthFunctions();

  // TODO State manager
  useEffect(() => {
    fetchMyself();
  }, []);

  return <Layout className='page'>
    <Sidebar user_permissions={user.permissions}/>
    <div className='page_container'>
      <Header fixed={fixedHeader} logOut={logOut} {...searchProps} />
      <div className='page_container_label'>
        <label className='page_container_label_title'>{title}</label>
      </div>
      {children}
    </div>
  </Layout>
}

export default Page;
