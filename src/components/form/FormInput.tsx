import { useState } from 'react';
import { isEmpty } from 'lodash';
import { CommonFieldProps, WrappedFieldMetaProps } from 'redux-form';

/** FormInputPorps 型別 */
interface FormInputPorpsType {
  name: string;
  text: string;
  placeholder: string;
  classname: string;
  input: CommonFieldProps;
  meta: WrappedFieldMetaProps;
}

function FormInput({ name, text, placeholder, classname, input, meta }: FormInputPorpsType) {
  const [showErrorTip, setShowErrorTip] = useState(false);

  function onBlur() {
    setShowErrorTip(true);
    input.onBlur(); // 觸發原生input事件(觸發meta.touch)
  }

  function onFocus() {
    setShowErrorTip(false);
  }

  return (
    <div>
      {showErrorTip && meta.touched && !isEmpty(meta.error) ? (
        <>
          <input
            name={name}
            type={text}
            placeholder={placeholder}
            className={`w-full border-b-2 border-red-500 bg- outline-none mt-2 px-2 py-1 ${classname}`}
            onBlur={onBlur}
            onFocus={onFocus}
            onChange={input.onChange}
          />
          <p className="text-red-500 text-sm">{meta.error}</p>
        </>
      ) : (
        <input
          name={name}
          type={text}
          placeholder={placeholder}
          className={`w-full border-b-[1px] border-gray-300 outline-none mt-2 px-2 py-1 ${classname}`}
          onBlur={onBlur}
          onFocus={onFocus}
          onChange={input.onChange}
        />
      )}
    </div>
  );
}

export default FormInput;
