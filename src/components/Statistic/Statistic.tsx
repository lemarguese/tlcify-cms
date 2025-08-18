import { Statistic as AntStatistic } from "antd";
import type { StatisticProps } from "antd";
import type { FC } from "react";

interface CustomStatisticProps extends StatisticProps {
}

const Statistic: FC<CustomStatisticProps> = (props) => {
  return <AntStatistic {...props}/>
}

export default Statistic;
