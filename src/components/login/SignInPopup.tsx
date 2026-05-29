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
// --- functions / types ---
import { setUserData } from '../../redux/userSlice';
import { setForgetPwd, setSignInPop, setSignUpPop } from '../../redux/loginSlice';
import { GRAY_BG_PANEL } from '../../constants/LayoutConstants';
import { SignIn, GuestSignIn } from '../../api/auth';
import { handleStatus } from '../../utils/fetch';
import { ERR_NETWORK_MSG, GUEST_USER_DATA } from '../../constants/StringConstants';
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
  const [isVisitorLoading, setIsVisitorLoading] = useState(false);
  const swal = withReactContent(Swal);

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

  /** 登入成功後的共用處理 */
  const handleSignInSuccess = (res: any) => {
    localStorage.setItem('hasSession', '1'); // 提示已登入（非敏感資訊，真正的 JWT 在 HttpOnly cookie）
    sliceDispatch(setUserData(res.data.userData));
    swal
      .fire({
        title: '登入成功',
        icon: 'success',
        confirmButtonText: '確認',
        timer: 2000,
        timerProgressBar: true,
      })
      .then(() => {
        const { location } = window;
        const pathname = get(location, 'pathname', '');
        if (pathname === '/user/editProfile') {
          location.href = `${location.host}/user/profile/${res.data.userData.userId}`; // 導到userProfilePage
        }
        handleClose();
      });
  };

  /** 送出登入資料 */
  const submitSignIn = async (role?: string) => {
    // 訪客登入：直接向後端取得 guest token，不需要帳密
    // 後端只回傳臨時 token、不回傳 user data，前端填入固定的 GUEST_USER_DATA 讓 UI 有資料顯示
    if (role === 'visitor') {
      setIsVisitorLoading(true);
      try {
        const res = await GuestSignIn();
        if (handleStatus(get(res, 'status', 0)) === 2) {
          localStorage.setItem('hasSession', '1');
          sliceDispatch(setUserData(GUEST_USER_DATA));
          swal
            .fire({
              title: '已以訪客身份登入',
              text: '訪客僅可瀏覽內容，無法進行喜歡、留言等操作',
              icon: 'info',
              confirmButtonText: '確認',
              timer: 2000,
              timerProgressBar: true,
            })
            .then(() => {
              handleClose();
            });
        } else if (get(res, 'code') === 'ERR_NETWORK') {
          setErrorMsg(ERR_NETWORK_MSG);
        }
      } catch (error) {
        // handle error
      }
      setIsVisitorLoading(false);
      return;
    }

    // 一般登入
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
      try {
        const res = await SignIn({ email, password });
        if (handleStatus(get(res, 'status', 0)) === 2) {
          handleSignInSuccess(res);
        } else if (handleStatus(get(res, 'status', 0)) === 4) {
          setErrorMsg(get(res, 'data.message'));
        } else if (get(res, 'code') === 'ERR_NETWORK') {
          setErrorMsg(ERR_NETWORK_MSG);
        }
      } catch (error) {
        // handle error
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
                onClick={() => submitSignIn()}
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
              <button
                type="button"
                className="flex justify-center items-center w-full h-10 my-4 px-4 py-2 text-lg rounded-md bg-transparent border border-gray-500"
                onClick={() => submitSignIn('visitor')}
              >
                {isVisitorLoading ? (
                  <FontAwesomeIcon
                    icon={icon({ name: 'spinner', style: 'solid' })}
                    className="animate-spin h-5 w-5 "
                  />
                ) : (
                  <>以訪客身份登入</>
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
