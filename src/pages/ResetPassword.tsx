import React, { useState } from 'react';
import { get, isEmpty, isEqual } from 'lodash';
import { icon } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { ResetPwd } from 'api/auth';
import FormInput from 'components/form/FormInput';
import { setSignInPop } from 'redux/loginSlice';

function ResetPassword() {
  const { token } = useParams();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const swal = withReactContent(Swal);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleReset = async () => {
    setErrorMsg('');
    setIsLoading(true);
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

    if (isEmpty(passwordError) && isEmpty(confirmPasswordError)) {
      try {
        const res = await ResetPwd(token!, password, confirmPassword);
        if (get(res, 'status') === 200) {
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
          setErrorMsg(get(res, 'response.data.message', ''));
        }
      } catch (error) {
        // console.log(error);
      }
    }
    setIsLoading(false);
  };

  /** handleEnter */
  const handleEnter = (value: string) => {
    if (value === 'Enter') handleReset();
  };

  return (
    <div className="flex justify-center items-center">
      <div className="w-dvw p-8 sm:w-full sm:border sm:rounded-lg">
        <h2>重設密碼</h2>
        <form className="sm:min-w-[350px]">
          <div className="mb-6 w-full">
            <div className="my-3">
              <FormInput
                type="password"
                name="password"
                ispwd
                placeholder="新密碼"
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
              onClick={handleReset}
            >
              {isLoading ? (
                <FontAwesomeIcon
                  icon={icon({ name: 'spinner', style: 'solid' })}
                  className="animate-spin h-5 w-5"
                />
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
