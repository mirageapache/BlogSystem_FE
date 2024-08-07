import { useState } from 'react';
import { isEmpty } from 'lodash';
import { CommonFieldProps, WrappedFieldMetaProps } from 'redux-form';
import { FORM_CONTROL } from 'constants/LayoutConstants';

/** FormTextAreaPropsType 型別 */
interface FormTextAreaPropsType {
  name: string;
  placeholder: string;
  classname: string;
  value: string;
  input: CommonFieldProps & { value: string };
  meta: WrappedFieldMetaProps;
  normalize: (value: string) => string | number | readonly string[] | undefined;
}

function FormTextArea({
  name,
  placeholder,
  classname,
  value,
  input,
  meta,
  normalize,
}: FormTextAreaPropsType) {
  const [showErrorTip, setShowErrorTip] = useState(false); // 顯示/隱藏欄位錯誤提示
  const normalizedValue = normalize ? normalize(input.value) : input.value;
  let activeStyle = '';
  if (showErrorTip && meta.touched && !isEmpty(meta.error)) {
    activeStyle = 'm-1.5 border-2 border-red-500 bg-yellow-100 dark:bg-gray-950'; // with error style
  } else {
    activeStyle = 'border-[1px] border-gray-400 dark:border-gray-700 dark:bg-gray-950'; // normal style
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
      <textarea
        name={name}
        placeholder={placeholder}
        className={`rounded-md resize-none focus:border-2 ${FORM_CONTROL} ${activeStyle} ${classname}`}
        rows={3}
        onBlur={onBlur}
        onFocus={onFocus}
        onChange={input.onChange}
        value={normalizedValue}
      >
        {value}
      </textarea>
      {showErrorTip && <p className="text-red-500 text-sm mt-[-6px]">{meta.error}</p>}
    </div>
  );
}

export default FormTextArea;
