/* eslint-disable no-param-reassign */
import { isEmpty } from 'lodash';
import React from 'react';
import { CommonFieldProps } from 'redux-form';

/** FileInputPorps 型別 */
interface FileInputPorpsType {
  name: string;
  id: string;
  classname: string;
  input: CommonFieldProps & { value: any };
  setAvatarFile: (file: FileList) => void;
  setAvatar: (file: FileList) => void;
}

function FileInput({
  name,
  id,
  classname,
  input,
  setAvatar,
  setAvatarFile,
  dispatch,
}: FileInputPorpsType | any) {
  /** 上傳圖片檔案 */
  const handleFileChange = (event: React.ChangeEvent<any>) => {
    const fileList = event.target.files; // 獲取選擇的檔案列表
    if (!isEmpty(fileList) && fileList?.length) {
      const file = fileList[0];
      setAvatar(URL.createObjectURL(file));
      setAvatarFile(file);
    }
  };

  return (
    <div className="relative">
      <span className="relative">
        <input
          name={name}
          id={id}
          type="file"
          className={`${classname} hidden`}
          onChange={(e) => handleFileChange(e)}
        />
      </span>
    </div>
  );
}

export default FileInput;
