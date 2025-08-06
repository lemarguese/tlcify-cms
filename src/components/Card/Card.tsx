import { Card as AntCard } from "antd";
import type { CardProps } from 'antd';
import type { FC } from "react";
import type { CardMetaProps } from "antd/es/card";

interface CustomCardProps extends CardProps {
  avatarProps?: CardMetaProps
}

const Card: FC<CustomCardProps> = ({ avatarProps, ...props }) => {
  return <>
    {avatarProps ? <AntCard {...props}>
      <AntCard.Meta {...avatarProps} />
    </AntCard> : <AntCard {...props}/>}
  </>
}

export default Card
