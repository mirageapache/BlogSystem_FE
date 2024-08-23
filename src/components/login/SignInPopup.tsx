/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { get, isEmpty } from 'lodash';
import { icon } from '@fortawesome/fontawesome-svg-core/import.macro';
import { useDispatch } from 'react-redux';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { useCookies } from 'react-cookie';

import { reduxForm, change, getFormValues, FormState } from 'redux-form';
// --- functions / types ---
import { setSignInPop, setSignUpPop } from 'redux/loginSlice';
import { FORM_CONTROL, GRAY_BG_PANEL } from 'constants/LayoutConstants';
import { SignInParamType } from 'types/authType';
import { SignIn } from 'api/auth';
import { setUserData } from 'redux/userSlice';
import FormInput from 'components/form/FormInput';

const mapStateToProps = (state: FormState) => ({
  formValues: getFormValues('signin')(state),
});

function SignInPopup(props: any) {
  // const { handleSubmit, dispatch } = props;
  const sliceDispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const swal = withReactContent(Swal);
  const [cookies, setCookie, removeCookie] = useCookies(['uid']);

  /** 清除表單資料 */
  // const cleanForm = () => {
  //   dispatch(change('signin', 'email', ''));
  //   dispatch(change('signin', 'password', ''));
  // };

  /** 導頁至註冊 */
  const directSignUp = () => {
    // cleanForm();
    sliceDispatch(setSignInPop(false));
    sliceDispatch(setSignUpPop(true));
  };

  /** 關閉登入Popup */
  const handleClose = () => {
    // cleanForm();
    sliceDispatch(setSignInPop(false));
  };

  /** 忘記密碼 */
  const findPassword = () => {
    // console.log('execute find password.');
  };

  /** 送出登入資料 */
  const submitSignIn = async () => {
    const varibales = { email, password };
    // data validate

    setErrorMsg('');
    setIsLoading(true);

    try {
      const res = await SignIn(varibales);
      if (get(res, 'status') === 200) {
        const authToken = get(res, 'data.authToken');
        window.localStorage.setItem('authToken', authToken);
        setCookie('uid', res.data.userData.userId, { path: '/' });
        sliceDispatch(setUserData(res.data.userData));
        swal
          .fire({
            title: '登入成功',
            icon: 'success',
            confirmButtonText: '確認',
          })
          .then(() => {
            const { location } = window;
            const pathname = get(location, 'pathname', '');
            if (pathname === '/user/editProfile') {
              location.href = `${location.host}/user/profile/${res.data.userData.userId}`; // 導到userProfilePage
            }
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
    <div className="fixed w-full h-full z-30 flex justify-center items-center select-none">
      <div className={GRAY_BG_PANEL} onClick={handleClose} />
      <div className="absolute z-10 w-full min-[320px]:w-11/12 max-w-[400px] border bg-white dark:bg-gray-950 dark:border-gray-700 opacity-100 rounded-md">
        {/* popup header */}
        <div className="flex justify-between border-b-[1px] dark:border-gray-700 p-4">
          <h2 className="text-2xl text-orange-500 font-semibold">歡迎回來</h2>
          <button
            aria-label="close"
            type="button"
            className="flex jsutify-center m-1"
            onClick={handleClose}
          >
            <FontAwesomeIcon
              icon={icon({ name: 'xmark', style: 'solid' })}
              className="w-5 h-5 m-1 text-gray-700 dark:text-gray-400"
            />
          </button>
        </div>
        {/* popup body */}
        <div className="pt-4 pb-8 px-6 flex justify-center items-center">
          <form className="w-full max-w-80">
            <div className="mb-6 w-full">
              <div>
                <FormInput
                  type="email"
                  name="email"
                  value={email}
                  ispwd={false}
                  placeholder="E-mail"
                  setValue={setEmail}
                />
                {/* <input
                  type="email"
                  name="email"
                  value={email}
                  className={`${FORM_CONTROL} border-b-2 border-red-500 bg-yellow-100 dark:bg-gray-950 focus:border-b-2`}
                  placeholder="E-mail"
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }} 
                /> */}
              </div>
              <div className="my-3">
                <input
                  type="password"
                  name="password"
                  value={password}
                  className={`${FORM_CONTROL} border-b-2 border-red-500 bg-yellow-100 dark:bg-gray-950 focus:border-b-2`}
                  placeholder="password"
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
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
                className="flex justify-center items-center w-full h-10 px-4 py-2 text-lg text-white rounded-md bg-green-600"
                onClick={() => submitSignIn}
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
                <button
                  type="button"
                  className="text-blue-600 cursor-pointer"
                  onClick={directSignUp}
                >
                  前往註冊
                </button>
              </span>
              <span className="mx-2 hidden min-[421px]:block">|</span>
              <span>
                忘記密碼？
                <button
                  type="button"
                  className="text-blue-600 cursor-pointer"
                  onClick={findPassword}
                >
                  找回密碼
                </button>
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SignInPopup;

// export default connect(mapStateToProps)(
//   reduxForm({
//     form: 'signin',
//   })(SignInPopup)
// );
