import { useState } from 'react';
import { isEmpty } from 'lodash';
import { CommonFieldProps, WrappedFieldMetaProps } from 'redux-form';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { icon } from '@fortawesome/fontawesome-svg-core/import.macro';

/** FileInputPorps 型別 */
interface FileInputPorpsType {
  name: string;
  type: string;
  placeholder: string;
  classname: string;
  input: CommonFieldProps;
  meta: WrappedFieldMetaProps;
}

function FileInput({ name, placeholder, classname, input }: FileInputPorpsType) {

  return (
    <div className="relative">
      <span className="relative">
        <input
          name={name}
          type="file"
          placeholder={placeholder}
          className={`hidden ${classname} `}
          onChange={input.onChange}
        />
      </span>
    </div>
  );
}

export default FileInput;
