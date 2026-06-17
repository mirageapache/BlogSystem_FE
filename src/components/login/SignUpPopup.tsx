/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner, faXmark } from '@fortawesome/free-solid-svg-icons';
import { useDispatch } from 'react-redux';
import get from 'lodash/get';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
// --- functions / types ---
import { SignUp } from '../../api/auth';
import { errorAlert, handleStatus } from '../../utils/fetch';
import { setSignInPop, setSignUpPop } from '../../redux/loginSlice';
import { GRAY_BG_PANEL, BTN_PRIMARY, BTN_TEXT } from '../../constants/LayoutConstants';
import { signUpSchema, SignUpFormType } from '../../schemas/auth';
// --- components ---
import FormInput from '../../components/form/FormInput';

function SignUpPopup() {
  const sliceDispatch = useDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormType>({ resolver: zodResolver(signUpSchema) });
  const [errorMsg, setErrorMsg] = useState(''); // 後端回傳的錯誤訊息
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

  /** 送出註冊資料（欄位驗證與密碼一致性已由 zod schema 於 handleSubmit 完成） */
  const onSubmit = async (variables: SignUpFormType) => {
    setErrorMsg('');
    setIsLoading(true);
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
    setIsLoading(false);
  };

  return (
    <div className="fixed w-screen h-screen z-30 flex justify-center items-center">
      <div className={GRAY_BG_PANEL} onClick={handleClose} />
      <div className="animate-pop-in absolute z-10 w-full min-[320px]:w-11/12 max-w-[400px] border border-line bg-surface shadow-pop rounded-card">
        {/* popup header */}
        <div className="flex justify-between items-center border-b border-line p-4">
          <h2 className="text-2xl text-ink">歡迎加入</h2>
          <button
            aria-label="close"
            type="button"
            className="flex justify-center m-1"
            onClick={handleClose}
          >
            <FontAwesomeIcon
              icon={faXmark}
              className="w-5 h-5 m-1 text-muted hover:text-ink transition-colors"
            />
          </button>
        </div>
        {/* popup body */}
        <div className="pt-4 pb-8 px-6 flex justify-center items-center">
          <form className="w-full max-w-80" onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-6 w-full">
              <div>
                <FormInput
                  type="email"
                  ispwd={false}
                  placeholder="E-mail"
                  registration={register('email')}
                  errorMsg={errors.email?.message}
                />
              </div>
              <div className="my-3">
                <FormInput
                  type="password"
                  ispwd
                  placeholder="密碼"
                  registration={register('password')}
                  errorMsg={errors.password?.message}
                />
              </div>
              <div className="my-3">
                <FormInput
                  type="password"
                  ispwd
                  placeholder="確認密碼"
                  registration={register('confirmPassword')}
                  errorMsg={errors.confirmPassword?.message}
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
                type="submit"
                disabled={isLoading}
                className={`${BTN_PRIMARY} w-full h-10 px-4 py-2 text-lg rounded-lg`}
              >
                {isLoading ? (
                  <FontAwesomeIcon icon={faSpinner} className="animate-spin h-5 w-5" />
                ) : (
                  <>註冊</>
                )}
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4 my-2 text-ink-soft">
              <span className="flex">
                已有帳戶？
                <button
                  type="button"
                  className={`${BTN_TEXT} cursor-pointer`}
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
