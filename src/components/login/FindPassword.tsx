/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { get } from 'lodash';
import { faInfoCircle, faSpinner, faXmark } from '@fortawesome/free-solid-svg-icons';
import { useDispatch } from 'react-redux';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
// --- functions / types ---
import { setForgetPwd, setSignInPop } from 'redux/loginSlice';
import { GRAY_BG_PANEL } from 'constants/LayoutConstants';
import { FindPwd } from 'api/auth';
import { findPwdSchema, FindPwdFormType } from 'schemas/auth';
// --- components ---
import FormInput from 'components/form/FormInput';
import { handleStatus } from 'utils/fetch';

function FindPassword() {
  const sliceDispatch = useDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FindPwdFormType>({ resolver: zodResolver(findPwdSchema) });
  const [errorMsg, setErrorMsg] = useState(''); // 後端回傳的錯誤訊息
  const [isLoading, setIsLoading] = useState(false);
  const swal = withReactContent(Swal);

  /** 關閉 Popup */
  const handleClose = () => {
    sliceDispatch(setForgetPwd(false));
  };

  /** 返回登入Popup */
  const BackToLogin = () => {
    sliceDispatch(setForgetPwd(false));
    sliceDispatch(setSignInPop(true));
  };

  /** 送出資料（email 驗證已由 zod schema 於 handleSubmit 完成） */
  const onSubmit = async ({ email }: FindPwdFormType) => {
    setErrorMsg('');
    setIsLoading(true);
    try {
      const res = await FindPwd(email);
      if (handleStatus(get(res, 'status', 0)) === 2) {
        swal
          .fire({
            title: '已寄送重置密碼連結至信箱',
            icon: 'info',
            confirmButtonText: '確認',
          })
          .then(() => {
            BackToLogin();
          });
      } else if (handleStatus(get(res, 'status', 0)) === 4) {
        setErrorMsg(get(res, 'data.message', ''));
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
          <h2 className="text-2xl text-orange-500 font-semibold">找回密碼</h2>
          <button
            aria-label="close"
            type="button"
            className="flex jsutify-center m-1"
            onClick={handleClose}
          >
            <FontAwesomeIcon
              icon={faXmark}
              className="w-5 h-5 m-1 text-gray-700 dark:text-gray-400"
            />
          </button>
        </div>
        {/* popup body */}
        <div className="pt-4 pb-8 px-6 flex flex-col justify-center items-center">
          <div className="flex gap-1 mb-4 text-gray-500">
            <FontAwesomeIcon icon={faInfoCircle} className="mt-1 text-orange-500" />
            <p>
              請輸入你註冊時的E-mail，系統將寄送「重設密碼」的連結至你的信箱，重設後即可使用新密碼進行登入
            </p>
          </div>
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
            </div>
            {errorMsg && (
              <div>
                <h5 className="text-red-500">{errorMsg}</h5>
              </div>
            )}
            <div className="mt-4">
              <button
                type="submit"
                className="flex justify-center items-center w-full h-10 px-4 py-2 text-lg text-white rounded-md bg-green-600"
              >
                {isLoading ? (
                  <FontAwesomeIcon icon={faSpinner} className="animate-spin h-5 w-5 " />
                ) : (
                  <>重置密碼</>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default FindPassword;
