import { Statistic as AntStatistic } from "antd";
import type { StatisticProps } from "antd";
import type { FC } from "react";
import CountUp from 'react-countup';

interface CustomStatisticProps extends StatisticProps {
}

const formatter: StatisticProps['formatter'] = (value) => (
  <CountUp end={value as number} separator=","/>
);

const Statistic: FC<CustomStatisticProps> = (props) => {
  return <AntStatistic {...props} formatter={formatter}/>
}

export default Statistic;
