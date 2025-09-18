import { Statistic as AntStatistic } from "antd";
import type { StatisticProps } from "antd";
import type { FC } from "react";
import CountUp from 'react-countup';

interface CustomStatisticProps extends StatisticProps {
}

const formatter: StatisticProps['formatter'] = (value, config) => (
  <CountUp end={value as number} separator="," decimals={config?.precision} />
);

const Statistic: FC<CustomStatisticProps> = (props) => {
  return <AntStatistic {...props} formatter={(value) => formatter(value, { precision: props.precision })}/>
}

export default Statistic;
