import { useState } from 'react';
import { isEmpty } from 'lodash';
import { CommonFieldProps, WrappedFieldMetaProps } from 'redux-form';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { icon } from '@fortawesome/fontawesome-svg-core/import.macro';

/** FormInputPorps 型別 */
interface FormInputPorpsType {
  name: string;
  type: string;
  ispwd: boolean;
  placeholder: string;
  classname: string;
  input: CommonFieldProps;
  meta: WrappedFieldMetaProps;
}

function FormInput({ name, type, ispwd, placeholder, classname, input, meta }: FormInputPorpsType) {
  const [hidePassword, setHidePassword] = useState(ispwd); // 隱藏密碼
  const [showErrorTip, setShowErrorTip] = useState(false); // 顯示/隱藏欄位錯誤提示
  const pwdtype = hidePassword ? 'password' : 'text'; // 控制密碼顯示/隱藏的input type
  const inputType = ispwd ? pwdtype : type;
  const inputStyle =
    'w-full text-lg outline-none mt-2 px-2 py-1 focus:border-blue-500 focus:border-b-2';

  console.log(meta.submitFailed);

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
    if (!isEmpty(meta.error)) setShowErrorTip(true);
    input.onBlur(); // 觸發原生input事件(觸發meta.touch)
  }

  function onFocus() {
    setShowErrorTip(false);
  }

  return (
    <div className="relative">
      {(showErrorTip && meta.touched && !isEmpty(meta.error)) || meta.submitFailed ? (
        <>
          <span className="relative">
            <input
              name={name}
              type={inputType}
              placeholder={placeholder}
              className={`${inputStyle} border-b-2 border-red-500 bg-yellow-100 dark:bg-gray-950 ${classname} `}
              onBlur={onBlur}
              onFocus={onFocus}
              onChange={input.onChange}
            />
            {ispwd && showToggle}
          </span>
          <p className="text-red-500 text-sm">{meta.error}</p>
        </>
      ) : (
        <span>
          <input
            name={name}
            type={inputType}
            placeholder={placeholder}
            className={`${inputStyle} border-b-[1px] border-gray-400 dark:border-gray-700 dark:bg-gray-950 ${classname} `}
            onBlur={onBlur}
            onFocus={onFocus}
            onChange={input.onChange}
          />
          {ispwd && showToggle}
        </span>
      )}
    </div>
  );
}

export default FormInput;
