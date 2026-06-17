/* eslint-disable react/require-default-props */
import React from 'react';
import isEmpty from 'lodash/isEmpty';
import { UseFormRegisterReturn } from 'react-hook-form';
import { FORM_CONTROL } from 'constants/LayoutConstants';

/** FormTextAreaPropsType 型別
 * 改為 react-hook-form 相容：欄位狀態與驗證交由 useForm 管理，
 * 透過 registration（register(name) 的回傳）綁定 textarea，error 由 formState 傳入。
 */
interface FormTextAreaPropsType {
  placeholder: string;
  registration: UseFormRegisterReturn;
  errorMsg?: string;
  disabled?: boolean;
}

function FormTextArea({ placeholder, registration, errorMsg, disabled }: FormTextAreaPropsType) {
  const showErrorTip = !isEmpty(errorMsg); // 由 RHF 的 error 決定是否顯示提示
  const activeStyle = showErrorTip
    ? 'm-1.5 border-2 border-red-500 bg-yellow-100 dark:bg-gray-950' // with error style
    : 'border-[1px] border-gray-400 dark:border-gray-700 dark:bg-gray-950'; // normal style

  return (
    <div className="relative">
      <textarea
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...registration}
        placeholder={placeholder}
        className={`rounded-md resize-none focus:border-2 ${FORM_CONTROL} ${activeStyle}`}
        rows={3}
        disabled={disabled}
      />
      {showErrorTip && <p className="text-red-500 text-sm mt-[-6px]">{errorMsg}</p>}
    </div>
  );
}

export default FormTextArea;
