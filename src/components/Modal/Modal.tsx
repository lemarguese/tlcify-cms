import type { ModalProps } from "antd";
import { Modal as AntModal } from 'antd';
import type { FC } from "react";

interface CustomModalProps extends ModalProps {

}

const Modal: FC<CustomModalProps> = ({ ...props }) => {
  return <AntModal centered {...props} />
}

export default Modal;
