import { isEmpty } from 'lodash';
import React from 'react'

interface FormInputPorpsType{
  name: string;
  text: string;
  placeholder: string;
  classname: string;
  meta: {error: string, touched: boolean};
}


function FormInput({name, text, placeholder, classname, meta}: FormInputPorpsType) {
  console.log(meta);

  // const onBlur(e) {
  //   e.preventDefault();
  //   this.setState({
  //     showMemo: false,
  //   });
  //   this.props.input.onBlur(e);
  // }

  // const onFocus(e) {
  //   e.preventDefault();
  //   this.setState({
  //     showMemo: true,
  //     onFocus: true,
  //   });
  // }

  return (
    <div>
      <input 
        name={name}
        type={text}
        placeholder={placeholder} 
        className={`border outline-none mt-2 py-1 ${classname} ${!isEmpty(meta.error && 'border-red-500')}`}
      />
      {meta.touched && !isEmpty(meta.error) &&
        <p className="text-red-500 text-sm">{meta.error}</p>
      }
    </div>
  )
}

export default FormInput