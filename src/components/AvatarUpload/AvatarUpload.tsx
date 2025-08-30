import './AvatarUpload.scss';

import { useEffect, useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { message, Upload } from 'antd';
import type { GetProp, UploadProps } from 'antd';

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

interface AvatarUploadProps extends Omit<UploadProps, 'onChange'> {
  url?: string;
  onChange?: (file: FileType) => void;
}

const AvatarUpload = ({ url, onChange }: AvatarUploadProps) => {
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    if (url) setImageUrl(url);
  }, [url]);

  const beforeUpload: UploadProps["beforeUpload"] = (file) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      message.error("You can only upload JPG/PNG file!");
      return Upload.LIST_IGNORE;
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error("Image must smaller than 2MB!");
      return Upload.LIST_IGNORE;
    }

    const preview = URL.createObjectURL(file);
    onChange!(file);
    setImageUrl(preview);

    return false; // 👈 prevent auto-upload
  };

  const uploadButton = (
    <button style={{ border: 0, background: 'none' }} type="button">
      <PlusOutlined/>
      <div style={{ marginTop: 8 }}>Upload</div>
    </button>
  );

  return (
    <div className='avatar_upload'>
      <Upload
        name="avatar"
        listType="picture-card"
        showUploadList={false}
        beforeUpload={beforeUpload}
      >
        {imageUrl ?
          <img src={imageUrl} alt="avatar" className='avatar_upload_image' style={{ width: '100%' }}/> : uploadButton}
      </Upload>
    </div>
  );
};

export default AvatarUpload;
