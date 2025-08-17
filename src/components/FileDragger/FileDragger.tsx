import type { UploadProps } from "antd";
import type { FC } from "react";
import { Upload } from "antd";

interface FileDragger extends UploadProps {}

const FileDragger: FC<FileDragger> = (props) => {
  return <Upload.Dragger {...props}/>
}

export default FileDragger;
