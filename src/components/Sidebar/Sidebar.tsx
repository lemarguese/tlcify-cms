import './Sidebar.scss';
import SidebarSection from "./SidebarSection/SidebarSection.tsx";
import { FC, JSX } from "react";

interface SidebarProps {

}

const Sidebar: FC<SidebarProps> = (): JSX.Element => {
  return (
    <aside className='sidebar'>
      <div className='sidebar_container'>
        <div></div>
        <div className='sidebar_sections'>
          <SidebarSection />
          <SidebarSection />
          <SidebarSection />
          <SidebarSection />
          <SidebarSection />
          <SidebarSection />
          <SidebarSection />
        </div>
        <div></div>
      </div>
    </aside>
  )
}

export default Sidebar;
