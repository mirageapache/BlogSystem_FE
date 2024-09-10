/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { connect, useDispatch, useSelector } from 'react-redux';
import { get, isEmpty } from 'lodash';
import { Field, reduxForm, getFormValues, FormState } from 'redux-form';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { icon } from '@fortawesome/fontawesome-svg-core/import.macro';
// --- api ---
import { getOwnProfile, updateProfile } from 'api/user';
// --- constant ---
import { FORM_CONTROL } from 'constants/LayoutConstants';
// --- components ---
import Spinner from 'components/tips/Spinner';
import BasicErrorPanel from 'components/tips/BasicErrorPanel';
import Avatar from 'components/user/Avatar';
import FileInput from 'components/form/FileInput';
import FormInput from 'components/form/FormInput';
import FormTextArea from 'components/form/FormTextArea';
// --- functions ---
import { required, isEmail, maxLength } from 'utils/reudxFormValidates';
// --- types ---
import { UserProfileType } from 'types/userType';
import { getCookies, scrollToTop } from '../../utils/common';
import { setSignInPop } from '../../redux/loginSlice';
import { errorAlert } from '../../utils/fetchError';
import { setUserData, UserStateType } from '../../redux/userSlice';

interface StateType {
  user: UserStateType;
}

function EditProfilePage() {
  const sliceDispatch = useDispatch();
  const navigate = useNavigate();
  const swal = withReactContent(Swal);
  const [firstLoad, setFirstLoad] = useState(true);
  const [emailChange, setEmailChange] = useState(false);
  const [accountChange, setAccountChange] = useState(false);

  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [account, setAccount] = useState('');
  const [accountError, setAccountError] = useState('');
  const [name, setName] = useState('');
  const [nameError, setNameError] = useState('');
  const [bio, setBio] = useState('');
  const [bioError, setBioError] = useState('');

  const [avatar, setAvatar] = useState<string>(''); // 處理avatar image preview
  const [avatarFile, setAvatarFile] = useState<any>(null); // 處理avatar file upload
  const [removeAvatar, setRemoveAvatar] = useState(false); // 判斷是否移除頭貼

  const userStateData = useSelector((state: StateType) => state.user.userData);
  const userId = getCookies('uid');
  const authToken = localStorage.getItem('authToken');
  const [updateLoading, setUpdateLoading] = useState(false);

  if (isEmpty(userId) || isEmpty(authToken)) {
    sliceDispatch(setSignInPop(true));
    return <Spinner />;
  }

  const getUserData = useQuery('user', () => getOwnProfile(userId!, authToken!), {
    enabled: isEmpty(userStateData) || userStateData!._id === '',
  });

  const { isLoading, data } = getUserData;
  const userData = isEmpty(userStateData)
    ? (get(data, 'data', {}) as UserProfileType)
    : userStateData;

  /** 處理上傳圖片檔 */
  const handleFileChange = (event: React.ChangeEvent<any>) => {
    const fileList = event.target.files; // 獲取選擇的檔案列表
    if (!isEmpty(fileList) && fileList?.length) {
      const file = fileList[0];
      setAvatar(URL.createObjectURL(file));
      setAvatarFile(file);
      setRemoveAvatar(false);
    }
  };

  // 設定 Redux Form 的初始值
  useEffect(() => {
    if (firstLoad && !isEmpty(userData)) {
      setAvatar(userData.avatar);
      setEmail(userData.email);
      setAccount(userData.account);
      setName(userData.name);
      setBio(userData.bio);
      setFirstLoad(false);
    }
  }, [userData]);

  /** 送出編輯資料 */
  const submitEditProfile = async () => {
    setUpdateLoading(true);

    // 資料驗證
    if (isEmpty(email)) {
      setEmailError('Email欄位必填');
      setUpdateLoading(false);
      return;
    }
    if (isEmpty(account)) {
      setAccountError('帳號欄位必填');
      setUpdateLoading(false);
      return;
    }
    if (isEmpty(name)) {
      setNameError('名稱欄位必填');
      setUpdateLoading(false);
      return;
    }

    console.log('submit');
    // const formData = new FormData();
    // if (emailChange) formData.append('email', form.email);
    // formData.append('name', form.name);
    // if (accountChange) formData.append('account', form.account);
    // formData.append('bio', form.bio);
    // formData.append('language', form.language);
    // formData.append('emailPrompt', get(form, 'emailPrompt', false).toString());
    // formData.append('mobilePrompt', get(form, 'mobilePrompt', false).toString());
    // formData.append('removeAvatar', removeAvatar.toString());
    // if (!isEmpty(avatar)) formData.append('avatarFile', avatarFile);
    // try {
    //   const result = await updateProfile(formData, userId!, authToken!);
    //   if (result.status === 200) {
    //     swal
    //       .fire({
    //         title: '修改成功',
    //         icon: 'success',
    //         confirmButtonText: '確認',
    //       })
    //       .then(() => {
    //         navigate(`/user/profile/${userId}`);
    //         sliceDispatch(setUserData(result.data as UserProfileType));
    //         scrollToTop();
    //       });
    //   } else {
    //     const errorMsg = get(result, 'response.data.message', '');
    //     errorAlert(errorMsg);
    //   }
    // } catch (error) {
    //   errorAlert();
    // }
    setUpdateLoading(false);
  };

  if (isLoading) return <Spinner />;
  if (get(data, 'response.data.message') === 'Unauthorized') sliceDispatch(setSignInPop(true));

  if (!isEmpty(userData)) {
    return (
      <div className="w-full sm:max-w-[600px] p-5">
        <form>
          {/* avatar */}
          <div className="flex flex-col items-center w-full mb-5 pb-5 border-b-[1px] dark:border-gray-700">
            <Avatar
              name={userData.name}
              avatarUrl={avatar}
              size="w-[90px] h-[90px]"
              textSize="text-4xl"
              bgColor={userData.bgColor}
            />
            <div className="flex gap-2">
              <label
                htmlFor="avatarFile"
                className="mt-3 bg-gray-300 dark:bg-gray-700 rounded-md text-sm px-2 py-1 cursor-pointer"
              >
                更新頭貼
              </label>
              <input
                name="avatarFile"
                id="avatarFile"
                type="file"
                className="hidden"
                onChange={(e) => handleFileChange(e)}
              />
              {!isEmpty(avatar) && (
                <button
                  type="button"
                  className="mt-3 bg-red-300 dark:bg-red-700 rounded-md text-sm px-2 py-1 cursor-pointer"
                  onClick={() => {
                    setRemoveAvatar(true);
                    setAvatar('');
                    setAvatarFile(null);
                  }}
                >
                  移除頭貼
                </button>
              )}
            </div>
          </div>

          {/* user info */}
          <div className="w-full pb-5 border-b-[1px] dark:border-gray-700">
            <div className="mt-10">
              <div className="flex items-center">
                <label htmlFor="email" className="font-bold">
                  <span className="text-red-500">*</span>
                  電子郵件
                </label>
                <p className="text-xs ml-1 text-orange-500 dark:text-orange-400">
                  <FontAwesomeIcon icon={icon({ name: 'info-circle', style: 'solid' })} />
                  修改後即更換登入系統及電子報接收之Email
                </p>
              </div>
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

            <div className="mt-10">
              <label htmlFor="name" className="font-bold">
                <span className="text-red-500">*</span>
                帳號
              </label>
              <FormInput
                type="text"
                name="account"
                ispwd={false}
                placeholder="帳號"
                value={account}
                setValue={setAccount}
                errorMsg={accountError}
                setErrorMsg={setAccountError}
                handleEnter={() => {}}
              />
            </div>

            <div className="mt-10">
              <label htmlFor="name" className="font-bold">
                <span className="text-red-500">*</span>
                名稱
              </label>
              <FormInput
                type="text"
                name="name"
                ispwd={false}
                placeholder="名稱"
                value={name}
                setValue={setName}
                errorMsg={nameError}
                setErrorMsg={setNameError}
                handleEnter={() => {}}
              />
            </div>

            <div className="mt-10">
              <label htmlFor="bio" className="font-bold">
                自我介紹
              </label>
              <textarea
                name={name}
                placeholder="來說說你的故事吧！"
                className={`rounded-md resize-none focus:border-2 ${FORM_CONTROL} border-[1px] border-gray-400 dark:border-gray-700 dark:bg-gray-950`}
                rows={3}
                onChange={(e) => setBio(e.target.value)}
                value={bio}
              />
            </div>
          </div>

          {/* user setting */}
          <div>
            <div className="mt-10">
              <div className="flex items-center">
                <label htmlFor="language" className="min-w-20 font-bold mr-5">
                  系統語言
                </label>
                <select
                  name="language"
                  value={userData.language}
                  className={`${FORM_CONTROL} border-[1px] border-gray-400 dark:border-gray-700 dark:bg-gray-700 rounded-md focus:border-2`}
                >
                  <option value="zh" className="">
                    中文
                  </option>
                  <option value="en" className="">
                    English
                  </option>
                </select>
              </div>
            </div>
            <div className="mt-10">
              <div className="flex justify-start items-center">
                <label htmlFor="emailPrompt" className="font-bold mr-5">
                  是否開啟Email通知推播
                </label>
                <input
                  name="emailPrompt"
                  type="checkbox"
                  className="w-5 h-5"
                  checked={get(userData, 'emailPrompt', false)}
                />
              </div>
            </div>
            <div className="my-10">
              <div className="flex justify-start items-center">
                <label htmlFor="mobilePrompt" className="font-bold mr-5">
                  是否開啟手機通知推播
                </label>
                <input
                  name="mobilePrompt"
                  type="checkbox"
                  className="w-5 h-5"
                  checked={get(userData, 'mobilePrompt', false)}
                />
              </div>
            </div>
          </div>

          {/* button */}
          <div className="flex justify-end mt-16">
            <button
              type="button"
              className="w-40 m-2 px-4 py-2 text-lg text-white rounded-md bg-gray-600"
              onClick={() => {
                navigate(`/user/profile/${userId}`);
                scrollToTop();
              }}
            >
              取消
            </button>
            <button
              type="submit"
              className="w-40 m-2 px-4 py-2 text-lg text-white rounded-md bg-green-600"
              onClick={() => submitEditProfile}
            >
              {updateLoading ? (
                <FontAwesomeIcon
                  icon={icon({ name: 'spinner', style: 'solid' })}
                  className="animate-spin h-5 w-5 "
                />
              ) : (
                <>修改</>
              )}
            </button>
          </div>
        </form>
      </div>
    );
  }

  return <BasicErrorPanel errorMsg="" />;
}

export default EditProfilePage;
