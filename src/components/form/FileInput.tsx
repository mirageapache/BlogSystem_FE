/* eslint-disable no-param-reassign */
import React from 'react';
import { CommonFieldProps } from 'redux-form';

/** FileInputPorps 型別 */
interface FileInputPorpsType {
  name: string;
  id: string;
  classname: string;
  input: CommonFieldProps & { value: FileList | null };
  setAvatarFile: (file: unknown) => void;
}

function FileInput({ name, id, classname, input, setAvatarFile }: FileInputPorpsType) {
  /** 上傳圖片檔案 */
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files; // 獲取選擇的檔案列表
    console.log(file);
    // input.onChange(file); // 使用 Redux Form 的 onChange 函數更新表單的值
    setAvatarFile(file);
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
