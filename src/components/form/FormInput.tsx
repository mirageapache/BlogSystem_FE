/* eslint-disable default-case */
/* eslint-disable react/require-default-props */
import React, { useEffect, useRef, useState } from 'react';
import { isEmpty } from 'lodash';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { icon } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FORM_CONTROL } from 'constants/LayoutConstants';
import validator from 'validator';
import { checkLength } from 'utils/formValidates';

/** FormInputProps 型別 */
interface FormInputPropsType {
  name: string;
  type: string;
  ispwd: boolean;
  placeholder: string;
  classname?: string;
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
  errorMsg: string;
  setErrorMsg: React.Dispatch<React.SetStateAction<string>>;
  handleEnter: (value: string) => void;
}

function FormInput({
  name,
  type,
  ispwd,
  placeholder,
  classname = '',
  value,
  setValue,
  errorMsg,
  setErrorMsg,
  handleEnter,
}: FormInputPropsType) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [hidePassword, setHidePassword] = useState(ispwd); // 隱藏密碼
  const [showErrorTip, setShowErrorTip] = useState(!isEmpty(errorMsg)); // 顯示/隱藏欄位錯誤提示
  const pwdtype = hidePassword ? 'password' : 'text'; // 控制密碼顯示/隱藏的input type
  const inputType = ispwd ? pwdtype : type;

  useEffect(() => {
    if (errorMsg) setShowErrorTip(true);
  }, [errorMsg]);

  /** 顯示/隱藏密碼控制 */
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

  /** input on blur */
  function onBlur(e: any) {
    setErrorMsg('');
    setShowErrorTip(false);
    const formValue = e.target.value;
    let text = '';
    switch (name) {
      case 'email':
        text = 'Email';
        if (!validator.isEmail(value)) {
          setErrorMsg('Email格式錯誤');
          setShowErrorTip(true);
        }
        break;
      case 'password':
        text = '密碼';
        if (checkLength(value, 6, 20)) {
          setErrorMsg('密碼長度須介於6至20字元');
          setShowErrorTip(true);
        }
        break;
      case 'confirmPassword':
        text = '確認密碼';
        if (checkLength(value, 6, 20)) {
          setErrorMsg('確認密碼長度須介於6至20字元');
          setShowErrorTip(true);
        }
        break;
      case 'account':
        text = '帳號';
        break;
    }
    if (isEmpty(formValue)) {
      setErrorMsg(`${text}必填`);
      setShowErrorTip(true);
    }
  }

  /** input on focus */
  function onFocus() {
    setErrorMsg('');
    setShowErrorTip(false);
  }

  return (
    <div className="relative">
      <span className="relative">
        <input
          ref={inputRef}
          name={name}
          type={inputType}
          placeholder={placeholder}
          className={`${FORM_CONTROL} ${classname}
          ${
            showErrorTip
              ? 'border-b-2 border-red-500 bg-yellow-100 dark:bg-gray-950 focus:border-b-2'
              : 'border-b-[1px] border-gray-400 dark:border-gray-700 dark:bg-gray-950 focus:border-b-2'
          }
          `}
          onBlur={onBlur}
          onFocus={onFocus}
          onChange={(e) => {
            setValue(e.target.value);
            setErrorMsg('');
            if (isEmpty(e.target.value)) setErrorMsg(`${name}欄位必填`);
          }}
          onKeyUp={(e) => {
            handleEnter(e.key);
          }}
          value={value}
        />
        {ispwd && showToggle}
      </span>
      {showErrorTip && <p className="text-red-500 text-sm">{errorMsg}</p>}
    </div>
  );
}

export default FormInput;
