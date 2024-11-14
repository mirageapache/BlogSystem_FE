/* eslint-disable no-unused-vars */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { get, isEmpty } from 'lodash';
import { icon } from '@fortawesome/fontawesome-svg-core/import.macro';
import { useDispatch } from 'react-redux';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { useCookies } from 'react-cookie';
// --- functions / types ---
import { setUserData } from '../../redux/userSlice';
import { setForgetPwd, setSignInPop, setSignUpPop } from '../../redux/loginSlice';
import { GRAY_BG_PANEL } from '../../constants/LayoutConstants';
import { SignIn } from '../../api/auth';
import { handleStatus } from '../../utils/fetch';
import { ERR_NETWORK_MSG } from '../../constants/StringConstants';
// --- components ---
import FormInput from '../form/FormInput';

function SignInPopup() {
  const sliceDispatch = useDispatch();
  const [email, setEmail] = useState(''); // 紀錄email資料
  const [password, setPassword] = useState(''); // 紀錄密碼資料
  const [emailError, setEmailError] = useState(''); // 紀錄email錯誤訊息
  const [passwordError, setPasswordError] = useState(''); // 紀錄密碼錯誤訊息
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const swal = withReactContent(Swal);
  const [cookies, setCookie, removeCookie] = useCookies(['uid']);

  /** 導頁至註冊 */
  const directSignUp = () => {
    sliceDispatch(setSignInPop(false));
    sliceDispatch(setSignUpPop(true));
  };

  /** 關閉登入Popup */
  const handleClose = () => {
    sliceDispatch(setSignInPop(false));
  };

  /** 忘記密碼 */
  const findPassword = () => {
    sliceDispatch(setSignInPop(false));
    sliceDispatch(setForgetPwd(true));
  };

  /** 送出登入資料 */
  const submitSignIn = async () => {
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

    if (isEmpty(emailError) && isEmpty(passwordError)) {
      const variables = { email, password };
      try {
        const res = await SignIn(variables);

        if (handleStatus(get(res, 'status', 0)) === 2) {
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
        } else if (handleStatus(get(res, 'status', 0)) === 4) {
          setErrorMsg(get(res, 'data.message'));
        } else if (get(res, 'code') === 'ERR_NETWORK') {
          setErrorMsg(ERR_NETWORK_MSG);
        }
      } catch (error) {
        // console.log(error);
      }
    }
    setIsLoading(false);
  };

  /** handleEnter */
  const handleEnter = (value: string) => {
    if (value === 'Enter') submitSignIn();
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
                  placeholder="password"
                  value={password}
                  setValue={setPassword}
                  errorMsg={passwordError}
                  setErrorMsg={setPasswordError}
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
                onClick={submitSignIn}
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
