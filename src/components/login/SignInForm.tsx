import { useState } from 'react';
import { connect, useDispatch } from 'react-redux';
import { get, isEmpty } from 'lodash';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { icon } from '@fortawesome/fontawesome-svg-core/import.macro';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { useCookies } from 'react-cookie';
import {
  Field,
  reduxForm,
  getFormMeta,
  getFormValues,
  FormState,
  change,
  // InjectedFormProps,
} from 'redux-form';
import { required, maxLength, isEmail } from '../../utils/Validate';
// --- componetns ---
import FormInput from '../form/FormInput';
// --- api / types ---
import { SignInParamType, SignIn } from '../../api/auth';
// --- functions / types ---
import { setSignInPop, setSignUpPop } from '../../redux/loginSlice';

// 原先要指定給props的型別，但會有無法解決的型別錯誤
// type SignInFormType = InjectedFormProps<{}, {}, string> & {
//   formValues: formValuesType;
// };

const mapStateToProps = (state: FormState) => ({
  formValues: getFormValues('signin')(state),
  formMeta: getFormMeta('signin')(state),
});

function SignInForm(props: any) {
  // 目前找不到適合props的型別，故使用any代替
  const { handleSubmit, dispatch } = props;
  const sliceDispatch = useDispatch();
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const swal = withReactContent(Swal);
  const [cookies, setCookie, removeCookie] = useCookies(['_id']);

  /** 清除表單資料 */
  const cleanForm = () => {
    dispatch(change('signin', 'email', ''));
    dispatch(change('signin', 'password', ''));
  };

  /** 導頁至註冊 */
  const directSignUp = () => {
    cleanForm();
    sliceDispatch(setSignInPop(false));
    sliceDispatch(setSignUpPop(true));
  };

  /** 關閉登入Popup */
  const handleClose = () => {
    cleanForm();
    sliceDispatch(setSignInPop(false));
  };

  /** 忘記密碼 */
  const findPassword = () => {
    // console.log('execute find password.');
  };

  /** 送出登入資料 */
  const submitSignIn = async (form: SignInParamType) => {
    setErrorMsg('');
    setIsLoading(true);

    try {
      const res = await SignIn(form);
      console.log(res);
      if (get(res, 'status') === 200) {
        const authToken = get(res, 'data.authToken');
        window.localStorage.setItem('authToken', authToken);
        setCookie('_id', res.data.userId, { path: '/' });
        swal
          .fire({
            title: '登入成功',
            icon: 'success',
            confirmButtonText: '確認',
          })
          .then(() => {
            handleClose();
          });
      } else if (!isEmpty(get(res, 'response.data.message', ''))) {
        setErrorMsg(get(res, 'response.data.message'));
      }
    } catch (error) {
      // console.log(error);
    }
    setIsLoading(false);
  };

  return (
    <form className="w-full max-w-80" onSubmit={handleSubmit(submitSignIn)}>
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
            validate={[required('密碼為必填欄位'), maxLength(20, '密碼上限為20字')]}
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
          {isLoading ? (
            <FontAwesomeIcon
              icon={icon({ name: 'spinner', style: 'solid' })}
              className="animate-spin h-5 w-5 "
            />
          ) : (
            <>登入</>
          )}
        </button>
      </div>
      <div className="flex max-[420px]:flex-col justify-center mt-4">
        <span className="flex">
          沒有帳戶？
          <button type="button" className="text-blue-600 cursor-pointer" onClick={directSignUp}>
            前往註冊
          </button>
        </span>
        <span className="mx-2 hidden min-[421px]:block">|</span>
        <span>
          忘記密碼？
          <button type="button" className="text-blue-600 cursor-pointer" onClick={findPassword}>
            找回密碼
          </button>
        </span>
      </div>
    </form>
  );
}

export default connect(mapStateToProps)(
  reduxForm({
    form: 'signin',
  })(SignInForm)
);
