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
  showErrorTip: boolean;
  setShowErrorTip: (value: boolean) => void;
}

function FormInput({
  name,
  text,
  placeholder,
  classname,
  input,
  meta,
  showErrorTip,
  setShowErrorTip,
}: FormInputPorpsType) {
  const inputStyle =
    'w-full text-lg outline-none mt-2 px-2 py-1 focus:border-blue-500 focus:border-b-2';

  function onBlur() {
    if (!isEmpty(meta.error)) setShowErrorTip(true);
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
            className={`${inputStyle} border-b-2 border-red-500 bg-yellow-100 ${classname}`}
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
          className={`${inputStyle} border-b-[1px] border-gray-400 dark:border-gray-700 ${classname}`}
          onBlur={onBlur}
          onFocus={onFocus}
          onChange={input.onChange}
        />
      )}
    </div>
  );
}

export default FormInput;
