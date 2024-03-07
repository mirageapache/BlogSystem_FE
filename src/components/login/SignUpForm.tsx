import React, { useState } from 'react';
import { connect, useDispatch } from 'react-redux';
import { Field, reduxForm, getFormMeta, getFormValues, FormState, change } from 'redux-form';
import { required, checkLength, passwordCheck, isEmail } from '../../utils/Validate';
// --- componetns ---
import FormInput from '../form/FormInput';
// --- api / types ---
import { SignUpParamType, SignUp } from '../../api/login';
// --- functions / types ---
import { setSignInPop, setSignUpPop } from '../../redux/loginSlice';

const mapStateToProps = (state: FormState) => ({
  formValues: getFormValues('signup')(state),
  formMeta: getFormMeta('signup')(state),
});

function SignUpForm(props: any) {
  const { handleSubmit, dispatch } = props;
  const sliceDispatch = useDispatch();
  const [errorMsg, setErrorMsg] = useState('');

  /** 導頁至登入 */
  const directSignUp = () => {
    dispatch(change('signup', 'account', ''));
    dispatch(change('signup', 'password', ''));
    sliceDispatch(setSignInPop(true));
    sliceDispatch(setSignUpPop(false));
  };

  /** 送出註冊資料 */
  const submitSignUp = async (form: SignUpParamType) => {
    try {
      const res = await SignUp(form);

      console.log(res);
      if (res.response.status === 200) {
        window.localStorage.setItem('authToken', res.authToken);
        window.location.replace('/');
      } else {
        setErrorMsg(res.response.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <form className="w-full max-w-80" onSubmit={handleSubmit(submitSignUp)}>
      <div className="mb-6 w-full">
        <div>
          <Field
            name="email"
            component={FormInput}
            placeholder="E-mail"
            type="email"
            validate={[required('Email為必填欄位'), isEmail('Email格式錯誤')]}
          />
        </div>
        <div className="my-3">
          <Field
            name="password"
            component={FormInput}
            placeholder="密碼"
            type="password"
            ispwd="true"
            validate={[required('密碼為必填欄位'), checkLength(6, 20, '密碼長度為6～20字')]}
          />
        </div>
        <div className="my-3">
          <Field
            name="confirmPassword"
            component={FormInput}
            placeholder="確認密碼"
            type="password"
            ispwd="true"
            validate={[
              required('確認密碼為必填欄位'),
              checkLength(6, 20, '密碼長度為6～20字'),
              passwordCheck,
            ]}
          />
        </div>
      </div>
      {errorMsg && (
        <div>
          <h3 className="text-red-500">{errorMsg}</h3>
        </div>
      )}
      <div className="mt-4">
        <button
          type="submit"
          className="w-full px-4 py-2 text-lg text-white rounded-md bg-green-600"
        >
          註冊
        </button>
      </div>
      <div className="grid grid-cols-2 gap-4 my-2">
        <span className="flex">
          已有帳戶？
          <button type="button" className="text-blue-600 cursor-pointer" onClick={directSignUp}>
            前往登入
          </button>
        </span>
      </div>
    </form>
  );
}

export default connect(mapStateToProps)(
  reduxForm({
    form: 'signup',
  })(SignUpForm)
);
