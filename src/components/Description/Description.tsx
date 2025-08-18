import { Descriptions as AntDescription } from "antd"
import type { DescriptionsProps } from 'antd';
import type { FC } from "react";

interface CustomDescription extends DescriptionsProps {
}

const Description: FC<CustomDescription> = (props) => {
  return <AntDescription {...props}/>
}

export default Description;
