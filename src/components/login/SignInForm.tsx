import React, { useState } from 'react';
import { connect } from 'react-redux';
import {
  Field,
  reduxForm,
  getFormMeta,
  getFormValues,
  FormState,
  InjectedFormProps,
} from 'redux-form';
import { required, maxLength } from '../../utils/Validate';
// --- componetns ---
import FormInput from '../form/FormInput';

interface formValuesType {
  username: string;
  password: string;
}

type SignInFormType = InjectedFormProps<{}, {}, string> & {
  formValues: formValuesType;
};

const mapStateToProps = (state: FormState) => ({
  formValues: getFormValues('signin')(state),
});

function SignInForm(props: SignInFormType) {
  const { formValues } = props;
  console.log(formValues);

  /** 送出登入表單 */
  const submitSignIn: React.FormEventHandler = (event) => {
    event.preventDefault();
    const meta = getFormMeta('signin');
    console.log(meta);
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
            validate={[required('密碼為必填欄位'), maxLength(20, '密碼上限為20字')]}
          />
        </div>
      </div>
      <div>
        <button type="submit">登入</button>
      </div>
    </form>
  );
}

export default connect(mapStateToProps)(
  reduxForm({
    form: 'signin',
  })(SignInForm)
);
