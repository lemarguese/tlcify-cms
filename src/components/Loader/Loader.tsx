import { Spin } from "antd";

import type { SpinProps } from 'antd';
import type { FC } from "react";

interface LoaderProps extends SpinProps {

}

const Loader: FC<LoaderProps> = (props) => {
  return <Spin {...props} size='large' fullscreen/>
}

export default Loader;
