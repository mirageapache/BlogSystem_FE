import React, { useState } from 'react';
import { Field, reduxForm } from 'redux-form';
import { required, maxLength } from '../../utils/Validate';
// --- componetns ---
import FormInput from '../form/FormInput';

interface ValueType {
  username: string;
  password: string;
}

// 驗證函式
// const validate = (values: ValueType) => {
//   const errors = { username: '', password: '' };

//   if (!values.username) {
//     errors.username = '必填';
//   } else if (values.username.length > 20) {
//     errors.username = '不能超過20個字';
//   }
//   if (!values.password) {
//     errors.password = '必填';
//   } else if (values.password.length > 20) {
//     errors.password = '不能超過20個字';
//   }
//   return errors;
// };

function SignInForm() {
  const [errorMsg, setErrorMsg] = useState('');

  /** 送出登入表單 */
  const submitSignIn: React.FormEventHandler = (event) => {
    event.preventDefault();
    console.log('sign in');
  };

  return (
    <form onSubmit={submitSignIn}>
      <div className="mb-6 w-80">
        <div>
          <Field
            name="username"
            component={FormInput}
            placeholder="帳號"
            type="text"
            validate={[required('帳號為必填欄位'), maxLength(20, '帳號上限為20字')]}
          />
        </div>
        <div className="my-3">
          <Field
            name="password"
            component={FormInput}
            placeholder="密碼"
            type="password"
            validate={[required('密碼為必填欄位')]}
          />
        </div>
      </div>
      <div>
        <button type="submit">登入</button>
      </div>
    </form>
  );
}

export default reduxForm({
  form: 'signin', // 表單名稱
  // validate, // 驗證函式
})(SignInForm);
