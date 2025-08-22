import type { UploadProps } from "antd";
import type { FC } from "react";
import { Upload } from "antd";
import { InboxOutlined } from '@ant-design/icons'

interface FileDragger extends UploadProps {
}

const FileDragger: FC<FileDragger> = (props) => {
  return <Upload.Dragger {...props}>
    <p className="ant-upload-drag-icon">
      <InboxOutlined/>
    </p>
    <p className="ant-upload-text">Click or drag file to this area to upload</p>
    <p className="ant-upload-hint">
      Support for a single or bulk upload. Strictly prohibited from uploading company data or other
      banned files.
    </p>
  </Upload.Dragger>
}

export default FileDragger;
