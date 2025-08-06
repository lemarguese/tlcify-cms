import { Tabs as AntTab } from "antd";
import type { TabsProps } from "antd";
import type { FC } from "react";

interface CustomTabs extends TabsProps {

}

const Tabs: FC<CustomTabs> = (props) => {
  return <AntTab {...props}/>
}

export default Tabs;
