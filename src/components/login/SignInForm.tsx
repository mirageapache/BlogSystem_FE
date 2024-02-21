import React, { useState } from 'react';
import { Field, reduxForm } from 'redux-form';

interface ValueType {
  username: string;
  password: string;
}

// 驗證函式
const validate = (values: ValueType) => {
  let errors = {username: '', password: ''};

  if (!values.username) {
    errors.username = '必填';
  } else if (values.username.length > 20) {
    errors.username = '不能超過20個字';
  }
  if (!values.password) {
    errors.password = '必填';
  } else if (values.password.length > 20) {
    errors.password = '不能超過20個字';
  }
  return errors;
};


// 登入表單組件
function SignInForm() {

  /** 送出登入表單 */
  const submitSignIn: React.FormEventHandler = (event) => {
    event.preventDefault();
    console.log('sign in');
  }

  return (
    <form onSubmit={submitSignIn}>
      <div>
        <label htmlFor="username">帳號:</label>
        <Field name="username" component="input" type="text" />
      </div>
      <div>
        <label htmlFor="password">密碼:</label>
        <Field name="password" component="input" type="password" />
      </div>
      <button type="submit">登入</button>
    </form>
  );
};

export default reduxForm({
  form: 'signin', // 表單名稱
  validate // 驗證函式
})(SignInForm);