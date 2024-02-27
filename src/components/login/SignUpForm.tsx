import React, { useState } from 'react';
import { connect, useDispatch } from 'react-redux';
import {
  Field,
  reduxForm,
  getFormMeta,
  getFormValues,
  FormState,
  change,
} from 'redux-form';
import { required, maxLength, checkLength, passwordCheck, isEmail } from '../../utils/Validate';
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
  // 目前找不到適合props的型別，故使用any代替
  const { handleSubmit, dispatch } = props;
  const [showErrorTip, setShowErrorTip] = useState(false); // 輸入錯誤顯示判斷
  const sliceDispatch = useDispatch();

  // /** 確認密碼檢核 */
  // const passwordCheck = (value: string, allValues: any) => {
  //   console.log(allValues);
  // }

  /** 導頁至登入 */
  const directSignUp = () => {
    dispatch(change('signup', 'account', ''));
    dispatch(change('signup', 'password', ''));
    sliceDispatch(setSignInPop(true));
    sliceDispatch(setSignUpPop(false));
  };


  /** 送出登入資料 */
  const submitSignUp = async (form: SignUpParamType) => {
    if (!showErrorTip) {
      console.log(form);
      try {
        const res = await SignUp(form);
        console.log(res);
        window.localStorage.setItem('authToken', res.authToken);
        window.location.replace('/');
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <form className="w-full max-w-80" onSubmit={handleSubmit(submitSignUp)}>
      <div className="mb-6 w-full">
        <div>
          <Field
            name="account"
            component={FormInput}
            placeholder="帳號"
            type="text"
            validate={[required('帳號為必填欄位'), maxLength(20, '帳號上限為20字')]}
            showErrorTip={showErrorTip}
            setShowErrorTip={setShowErrorTip}
          />
        </div>
        <div className="my-3">
          <Field
            name="password"
            component={FormInput}
            placeholder="密碼"
            type="password"
            validate={[required('密碼為必填欄位'), checkLength(6, 20, '密碼長度為6～20字')]}
            showErrorTip={showErrorTip}
            setShowErrorTip={setShowErrorTip}
          />
        </div>
        <div className="my-3">
          <Field
            name="confirmPassword"
            component={FormInput}
            placeholder="確認密碼"
            type="password"
            validate={[required('確認密碼為必填欄位'), checkLength(6, 20, '密碼長度為6～20字'), passwordCheck]}
            showErrorTip={showErrorTip}
            setShowErrorTip={setShowErrorTip}
          />
        </div>
        <div className="my-3">
          <Field
            name="email"
            component={FormInput}
            placeholder="E-mail"
            type="email"
            validate={[required('E-mail為必填欄位'), isEmail('Email格式錯誤')]}
            showErrorTip={showErrorTip}
            setShowErrorTip={setShowErrorTip}
          />
        </div>
      </div>
      {/* <div>
        <h3 className="text-red-500">該帳號已被使用!</h3>
      </div> */}
      <div className="grid grid-cols-2 gap-4 my-2">
        <button
          type="button"
          className="px-4 py-2 rounded-md border border-gray-400 dard:border-gray-700"
          onClick={directSignUp}
        >
          前往登入
        </button>
        {/* <button type="button" className="px-4 py-2 rounded-md border border-gray-400 dard:border-gray-700" onClick={findPassword}>忘記密碼</button> */}
      </div>
      <div className="mt-4">
        <button
          type="submit"
          className="w-full px-4 py-2 text-lg text-white rounded-md bg-green-600"
        >
          註冊
        </button>
      </div>
    </form>
  );
}

export default connect(mapStateToProps)(
  reduxForm({
    form: 'signup',
  })(SignUpForm)
);
