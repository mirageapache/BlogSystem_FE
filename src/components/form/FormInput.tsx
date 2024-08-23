/* eslint-disable react/require-default-props */
import React, { useState } from 'react';
import { isEmpty } from 'lodash';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { icon } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FORM_CONTROL } from 'constants/LayoutConstants';

/** FormInputProps 型別 */
interface FormInputPropsType {
  name: string;
  type: string;
  value: string;
  ispwd: boolean;
  placeholder: string;
  classname?: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
}

function FormInput({
  name,
  type,
  value,
  ispwd,
  placeholder,
  classname = '',
  setValue,
}: FormInputPropsType) {
  const [hidePassword, setHidePassword] = useState(ispwd); // 隱藏密碼
  const [showErrorTip, setShowErrorTip] = useState(false); // 顯示/隱藏欄位錯誤提示
  const pwdtype = hidePassword ? 'password' : 'text'; // 控制密碼顯示/隱藏的input type
  const inputType = ispwd ? pwdtype : type;

  // 顯示/隱藏密碼控制
  const showToggle = hidePassword ? (
    <FontAwesomeIcon
      icon={icon({ name: 'eye-slash', style: 'solid' })}
      className="absolute mt-3.5 right-0 h-6 w-6 text-gray-700 cursor-pointer"
      onClick={() => {
        setHidePassword(false);
      }}
    />
  ) : (
    <FontAwesomeIcon
      icon={icon({ name: 'eye', style: 'solid' })}
      className="absolute mt-3.5 right-0 h-6 w-6 text-gray-700 cursor-pointer"
      onClick={() => {
        setHidePassword(true);
      }}
    />
  );

  function onBlur() {
    // if (!isEmpty(meta.error)) setShowErrorTip(true);
    // input.onBlur(); // 觸發原生input事件(觸發meta.touch)
  }

  function onFocus() {
    setShowErrorTip(false);
  }

  return (
    <div className="relative">
      {showErrorTip ? (
        <>
          <span className="relative">
            <input
              name={name}
              type={inputType}
              placeholder={placeholder}
              className={`${FORM_CONTROL} border-b-2 border-red-500 bg-yellow-100 dark:bg-gray-950 focus:border-b-2 ${classname} `}
              onBlur={onBlur}
              onFocus={onFocus}
              onChange={(e) => setValue(e.target.value)}
              value={value}
            />
            {ispwd && showToggle}
          </span>
          {/* <p className="text-red-500 text-sm">{meta.error}</p> */}
        </>
      ) : (
        <span>
          <input
            name={name}
            type={inputType}
            placeholder={placeholder}
            className={`${FORM_CONTROL} border-b-[1px] border-gray-400 dark:border-gray-700 dark:bg-gray-950 focus:border-b-2 ${classname} `}
            onBlur={onBlur}
            onFocus={onFocus}
            onChange={(e) => setValue(e.target.value)}
            value={value}
          />
          {ispwd && showToggle}
        </span>
      )}
    </div>
  );
}

export default FormInput;
