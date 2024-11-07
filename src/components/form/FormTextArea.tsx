import React, { useEffect, useState } from 'react';
import { FORM_CONTROL } from 'constants/LayoutConstants';
import { isEmpty } from 'lodash';

/** FormTextAreaPropsType 型別 */
interface FormTextAreaPropsType {
  name: string;
  placeholder: string;
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
  errorMsg: string;
  setErrorMsg: React.Dispatch<React.SetStateAction<string>>;
}

function FormTextArea({
  name,
  placeholder,
  value,
  setValue,
  errorMsg,
  setErrorMsg,
}: FormTextAreaPropsType) {
  const [showErrorTip, setShowErrorTip] = useState(!isEmpty(errorMsg)); // 顯示/隱藏欄位錯誤提示
  let activeStyle = '';
  if (showErrorTip) {
    activeStyle = 'm-1.5 border-2 border-red-500 bg-yellow-100 dark:bg-gray-950'; // with error style
  } else {
    activeStyle = 'border-[1px] border-gray-400 dark:border-gray-700 dark:bg-gray-950'; // normal style
  }

  useEffect(() => {
    if (errorMsg) setShowErrorTip(true);
  }, [errorMsg]);

  function onBlur(e: any) {
    setErrorMsg('');
    setShowErrorTip(false);
    if (e.target.value.length > 200) {
      setErrorMsg('自我介紹最多200字');
      setShowErrorTip(true);
    }
  }

  function onFocus() {
    setShowErrorTip(false);
  }

  return (
    <div className="relative">
      <textarea
        name={name}
        value={value}
        placeholder={placeholder}
        className={`rounded-md resize-none focus:border-2 ${FORM_CONTROL} ${activeStyle}`}
        rows={3}
        onBlur={onBlur}
        onFocus={onFocus}
        onChange={(e) => {
          if (e.target.value.length < 200) setValue(e.target.value);
        }}
      />
      {showErrorTip && <p className="text-red-500 text-sm mt-[-6px]">{errorMsg}</p>}
    </div>
  );
}

export default FormTextArea;
