import React, { useState } from 'react';
import { isEmpty } from 'lodash';
import { CommonFieldProps, WrappedFieldMetaProps } from 'redux-form';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { icon } from '@fortawesome/fontawesome-svg-core/import.macro';

/** FormTextAreaPropsType 型別 */
interface FormTextAreaPropsType {
  name: string;
  placeholder: string;
  classname: string;
  value: string;
  input: CommonFieldProps;
  meta: WrappedFieldMetaProps;
}

function FormTextArea({name, placeholder, classname, value, input, meta}: FormTextAreaPropsType) {
  const [showErrorTip, setShowErrorTip] = useState(false); // 顯示/隱藏欄位錯誤提示
  const inputStyle = 'w-full rounded-md text-lg outline-none mt-2 px-2 py-1 focus:border-blue-500 focus:border-2 resize-none';
  let activeStyle = '';
  if((showErrorTip && meta.touched && !isEmpty(meta.error)) || meta.submitFailed){
    activeStyle = 'border-2 border-red-500 bg-yellow-100 dark:bg-gray-950' // with error style
  } else {
    activeStyle = 'border-[1px] border-gray-400 dark:border-gray-700 dark:bg-gray-950' // normal style
  }


  function onBlur() {
    if (!isEmpty(meta.error)) setShowErrorTip(true);
    input.onBlur(); // 觸發原生input事件(觸發meta.touch)
  }

  function onFocus() {
    setShowErrorTip(false);
  }


  return (
    <div className="relative">
      <span className="relative">
        <textarea
          name={name}
          placeholder={placeholder}
          className={`${inputStyle} ${activeStyle} ${classname}`}
          rows={3}
          onBlur={onBlur}
          onFocus={onFocus}
          onChange={input.onChange}
        >
          {value}
        </textarea>
      </span>
    </div>
  )
}

export default FormTextArea