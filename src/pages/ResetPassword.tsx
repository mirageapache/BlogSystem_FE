import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { get } from 'lodash';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { ResetPwd } from 'api/auth';
import FormInput from 'components/form/FormInput';
import { setSignInPop } from 'redux/loginSlice';
import { handleStatus } from 'utils/fetch';
import { resetPwdSchema, ResetPwdFormType } from 'schemas/auth';

function ResetPassword() {
  const { token } = useParams();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPwdFormType>({ resolver: zodResolver(resetPwdSchema) });
  const [errorMsg, setErrorMsg] = useState(''); // 後端回傳的錯誤訊息
  const [isLoading, setIsLoading] = useState(false);
  const swal = withReactContent(Swal);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  /** 重設密碼（欄位驗證與密碼一致性已由 zod schema 於 handleSubmit 完成） */
  const onSubmit = async ({ password, confirmPassword }: ResetPwdFormType) => {
    setErrorMsg('');
    setIsLoading(true);
    try {
      const res = await ResetPwd(token!, password, confirmPassword);
      if (handleStatus(get(res, 'status', 0)) === 2) {
        // 提示訊息
        swal
          .fire({
            title: '修改成功',
            icon: 'success',
            confirmButtonText: '確認',
          })
          .then(() => {
            navigate('/');
            dispatch(setSignInPop(true));
          });
      } else {
        setErrorMsg(get(res, 'data.message', ''));
      }
    } catch (error) {
      // console.log(error);
    }
    setIsLoading(false);
  };

  return (
    <div className="flex justify-center items-center">
      <div className="w-dvw p-8 sm:w-full sm:border sm:rounded-lg">
        <h2>重設密碼</h2>
        <form className="sm:min-w-[350px]" onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-6 w-full">
            <div className="my-3">
              <FormInput
                type="password"
                ispwd
                placeholder="新密碼"
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
              className="flex justify-center items-center w-full h-10 px-4 py-2 text-lg text-white rounded-md bg-green-600"
            >
              {isLoading ? (
                <FontAwesomeIcon icon={faSpinner} className="animate-spin h-5 w-5" />
              ) : (
                <>重設</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ResetPassword;
