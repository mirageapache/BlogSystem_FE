/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { icon } from '@fortawesome/fontawesome-svg-core/import.macro';
import { useDispatch } from 'react-redux';
import { get, isEmpty, isEqual } from 'lodash';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
// --- functions / types ---
import { SignUp } from '../../api/auth';
import { errorAlert, handleStatus } from '../../utils/fetch';
import { setSignInPop, setSignUpPop } from '../../redux/loginSlice';
import { GRAY_BG_PANEL } from '../../constants/LayoutConstants';
// --- components ---
import FormInput from '../../components/form/FormInput';

function SignUpPopup() {
  const sliceDispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const swal = withReactContent(Swal);

  /** 導頁至登入 */
  const directSignUp = () => {
    sliceDispatch(setSignInPop(true));
    sliceDispatch(setSignUpPop(false));
  };

  /** 關閉註冊Popup */
  const handleClose = () => {
    sliceDispatch(setSignUpPop(false));
  };

  /** 送出註冊資料 */
  const submitSignUp = async () => {
    setErrorMsg('');
    setIsLoading(true);
    if (isEmpty(email)) {
      setEmailError('Email為必填欄位');
      setIsLoading(false);
      return;
    }
    if (isEmpty(password)) {
      setPasswordError('密碼為必填欄位');
      setIsLoading(false);
      return;
    }
    if (isEmpty(confirmPassword)) {
      setConfirmPasswordError('確認密碼為必填欄位');
      setIsLoading(false);
      return;
    }
    if (!isEqual(password, confirmPassword)) {
      setConfirmPasswordError('確認密碼與密碼不相符');
      setIsLoading(false);
      return;
    }

    if (isEmpty(emailError) && isEmpty(passwordError) && isEmpty(confirmPasswordError)) {
      const variables = { email, password, confirmPassword };
      try {
        const res = await SignUp(variables);
        if (handleStatus(get(res, 'status', 0)) === 2) {
          swal
            .fire({
              title: '註冊成功🎉',
              text: '歡迎加入ReactBlog',
              icon: 'success',
              confirmButtonText: '確認',
            })
            .then(() => {
              handleClose();
            });
        } else if (handleStatus(get(res, 'status', 0)) === 4) {
          setErrorMsg(get(res, 'data.message', ''));
        } else {
          errorAlert();
        }
      } catch (error) {
        // console.log(error);
      }
    }
    setIsLoading(false);
  };

  /** handleEnter */
  const handleEnter = (value: string) => {
    if (value === 'Enter') submitSignUp();
  };

  return (
    <div className="fixed w-screen h-screen z-30 flex justify-center items-center">
      <div className={GRAY_BG_PANEL} onClick={handleClose} />
      <div className="absolute z-10 w-full min-[320px]:w-11/12 max-w-[400px] border bg-white dark:bg-gray-950 dark:border-gray-700 opacity-100 rounded-md">
        {/* popup header */}
        <div className="flex justify-between border-b-[1px] dark:border-gray-700 p-4">
          <h2 className="text-2xl text-orange-500 font-semibold">歡迎加入</h2>
          <button
            aria-label="close"
            type="button"
            className="flex jsutify-center m-1"
            onClick={handleClose}
          >
            <FontAwesomeIcon
              icon={icon({ name: 'xmark', style: 'solid' })}
              className="w-5 h-5 m-1 text-gray-900 dark:text-gray-100"
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
                  ispwd={false}
                  placeholder="E-mail"
                  value={email}
                  setValue={setEmail}
                  errorMsg={emailError}
                  setErrorMsg={setEmailError}
                  handleEnter={() => {}}
                />
              </div>
              <div className="my-3">
                <FormInput
                  type="password"
                  name="password"
                  ispwd
                  placeholder="密碼"
                  value={password}
                  setValue={setPassword}
                  errorMsg={passwordError}
                  setErrorMsg={setPasswordError}
                  handleEnter={() => {}}
                />
              </div>
              <div className="my-3">
                <FormInput
                  type="password"
                  name="confirmPassword"
                  ispwd
                  placeholder="確認密碼"
                  value={confirmPassword}
                  setValue={setConfirmPassword}
                  errorMsg={confirmPasswordError}
                  setErrorMsg={setConfirmPasswordError}
                  handleEnter={handleEnter}
                />
              </div>
            </div>
            {errorMsg && (
              <div>
                <h5 className="text-red-500">{errorMsg}</h5>
              </div>
            )}
            <div className="mt-4">
              <button
                type="button"
                className="flex justify-center items-center w-full h-10 px-4 py-2 text-lg text-white rounded-md bg-green-600"
                onClick={submitSignUp}
              >
                {isLoading ? (
                  <FontAwesomeIcon
                    icon={icon({ name: 'spinner', style: 'solid' })}
                    className="animate-spin h-5 w-5"
                  />
                ) : (
                  <>註冊</>
                )}
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4 my-2">
              <span className="flex">
                已有帳戶？
                <button
                  type="button"
                  className="text-blue-600 cursor-pointer"
                  onClick={directSignUp}
                >
                  前往登入
                </button>
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SignUpPopup;
