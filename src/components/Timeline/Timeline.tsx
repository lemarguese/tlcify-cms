import './Timeline.scss';

import { Timeline as AntTimeline } from "antd";
import type { TimelineProps } from 'antd';
import type { FC } from "react";

interface CustomTimelineProps extends TimelineProps {

}

const Timeline: FC<CustomTimelineProps> = ({ ...props }) => {
  return <AntTimeline mode='left' {...props} />
}

export default Timeline;
