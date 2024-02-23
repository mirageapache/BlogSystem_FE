import { useState } from 'react';
import { isEmpty } from 'lodash';
import { fieldInputPropTypes, fieldMetaPropTypes } from 'redux-form';
import PropTypes from 'prop-types';
interface FormInputPorpsType {
  name: string;
  text: string;
  placeholder: string;
  classname: string;
  input: fieldInputPropTypes;
  meta: fieldMetaPropTypes;
}

function FormInput({ name, text, placeholder, classname, input, meta }: FormInputPorpsType) {
  const [showErrorTip, setShowErrorTip] = useState(false);
  

  function onBlur() {
    setShowErrorTip(true);
    meta.touched = true;
    input.onBlur();
  }

  function onFocus() {
    setShowErrorTip(false);
  }

  return (
    <div>
      {showErrorTip && meta.touched && !isEmpty(meta.error) ?
        <input
          name={name}
          type={text}
          placeholder={placeholder}
          className={`w-full border-b-[1px] border-gray-300 outline-none mt-2 px-2 py-1 ${classname}`}
          onBlur={onBlur}
          onFocus={onFocus}
        />
      :
        <>
          <input
            name={name}
            type={text}
            placeholder={placeholder}
            className={`w-full border-b-2 border-red-500 bg- outline-none mt-2 px-2 py-1 ${classname}`}
            onBlur={onBlur}
            onFocus={onFocus}
          />
          <p className="text-red-500 text-sm">{meta.error}</p>
        </>
      }
    </div>
  );
}

export default FormInput;
