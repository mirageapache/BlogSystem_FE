/* eslint-disable react/require-default-props */
import React, { useState } from 'react';
import isEmpty from 'lodash/isEmpty';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { UseFormRegisterReturn } from 'react-hook-form';
import { FORM_CONTROL } from '../../constants/LayoutConstants';

/** FormInputProps 型別
 * 改為 react-hook-form 相容：欄位狀態與驗證交由 useForm 管理，
 * 透過 registration（register(name) 的回傳）綁定 input，error 由 formState 傳入。
 */
interface FormInputPropsType {
  type: string;
  ispwd: boolean;
  placeholder: string;
  classname?: string;
  registration: UseFormRegisterReturn;
  errorMsg?: string;
  disabled?: boolean;
}

function FormInput({
  type,
  ispwd,
  placeholder,
  classname = '',
  registration,
  errorMsg,
  disabled,
}: FormInputPropsType) {
  const [hidePassword, setHidePassword] = useState(ispwd); // 隱藏密碼
  const pwdtype = hidePassword ? 'password' : 'text'; // 控制密碼顯示/隱藏的input type
  const inputType = ispwd ? pwdtype : type;
  const showErrorTip = !isEmpty(errorMsg); // 由 RHF 的 error 決定是否顯示提示

  /** 顯示/隱藏密碼控制 */
  const showToggle = hidePassword ? (
    <FontAwesomeIcon
      icon={faEyeSlash}
      className="absolute mt-3.5 right-0 h-6 w-6 text-muted hover:text-ink transition-colors cursor-pointer"
      onClick={() => {
        setHidePassword(false);
      }}
    />
  ) : (
    <FontAwesomeIcon
      icon={faEye}
      className="absolute mt-3.5 right-0 h-6 w-6 text-muted hover:text-ink transition-colors cursor-pointer"
      onClick={() => {
        setHidePassword(true);
      }}
    />
  );

  return (
    <div className="relative">
      <span className="relative">
        <input
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...registration}
          type={inputType}
          placeholder={placeholder}
          disabled={disabled}
          className={`${FORM_CONTROL} ${classname} bg-transparent text-ink placeholder:text-muted border-b-2 focus-visible:outline-none
          ${
            showErrorTip
              ? 'border-red-500 bg-red-50 dark:bg-red-500/10'
              : 'border-line-strong focus:border-brand'
          }
          `}
        />
        {ispwd && showToggle}
      </span>
      {showErrorTip && <p className="text-red-500 text-sm mt-1">{errorMsg}</p>}
    </div>
  );
}

export default FormInput;
