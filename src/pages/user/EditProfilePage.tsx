/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from '@tanstack/react-query';
import { useDispatch, useSelector } from 'react-redux';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle, faSpinner } from '@fortawesome/free-solid-svg-icons';
// --- constant ---
import { FORM_CONTROL } from 'constants/LayoutConstants';
// --- components ---
import Spinner from 'components/tips/Spinner';
import BasicErrorPanel from 'components/tips/BasicErrorPanel';
import Avatar from 'components/user/Avatar';
import FormTextArea from 'components/form/FormTextArea';
// --- api/types ---
import { getOwnProfile, updateProfile } from 'api/user';
import { UserProfileType } from 'types/userType';
import { editProfileSchema, EditProfileFormType } from 'schemas/user';
import { guardVisitorAction, scrollToTop } from '../../utils/common';
import { setSignInPop } from '../../redux/loginSlice';
import { errorAlert, handleApiError, handleStatus } from '../../utils/fetch';
import { setUserData, UserStateType } from '../../redux/userSlice';

interface StateType {
  user: UserStateType;
}

function EditProfilePage() {
  const sliceDispatch = useDispatch();
  const navigate = useNavigate();
  const swal = withReactContent(Swal);
  const [firstLoad, setFirstLoad] = useState(true);

  const [avatar, setAvatar] = useState<string>(''); // 處理avatar image preview
  const [avatarFile, setAvatarFile] = useState<any>(null); // 處理avatar file upload
  const [removeAvatar, setRemoveAvatar] = useState<boolean>(false); // 處理avatar image preview

  // 文字/設定欄位改由 react-hook-form 管理；avatar 因含預覽與檔案上傳邏輯仍維持 local state
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EditProfileFormType>({ resolver: zodResolver(editProfileSchema) });

  const userId = useSelector((state: StateType) => state.user.userData?.userId);
  const [updateLoading, setUpdateLoading] = useState(false);

  // 未登入 → 彈出登入框（不在 render 期 dispatch，避免循環）
  useEffect(() => {
    if (isEmpty(userId)) sliceDispatch(setSignInPop(true));
  }, [userId]);

  const getUserData = useQuery({
    queryKey: ['editProfile'],
    queryFn: () => getOwnProfile(),
    enabled: !!userId && firstLoad,
  });
  const { isLoading, data } = getUserData;
  const userData = get(data, 'data', {}) as UserProfileType;

  // 後端回傳 Unauthorized → 同樣彈出登入
  useEffect(() => {
    if (get(data, 'response.data.message') === 'Unauthorized') {
      sliceDispatch(setSignInPop(true));
    }
  }, [data]);

  // 設定表單初始資料
  useEffect(() => {
    if (firstLoad && !isEmpty(userData)) {
      setAvatar(userData.avatar);
      reset({
        email: userData.email,
        account: userData.account,
        name: userData.name,
        bio: userData.bio ?? '',
        // 後端只接受 'zh' / 'en'，正規化舊資料（如 'zh-TW' / 'en-US'）以對應下拉選項
        language: userData.language?.startsWith('en') ? 'en' : 'zh',
        emailPrompt: userData.emailPrompt === true,
        mobilePrompt: userData.mobilePrompt === true,
      });
      setFirstLoad(false);
    }
  }, [userData]);

  /** 設定圖片檔 */
  const handleFileChange = (event: React.ChangeEvent<any>) => {
    const fileList = event.target.files; // 獲取選擇的檔案列表
    if (!isEmpty(fileList) && fileList?.length) {
      const file = fileList[0];
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif']; // 可上傳的圖片格式
      if (allowedTypes.includes(file.type)) {
        setAvatar(URL.createObjectURL(file));
        setAvatarFile(file);
        setRemoveAvatar(false);
      } else {
        errorAlert('請選擇 jpeg、jpg、png 或 gif 格式的圖片');
      }
    }
  };

  /** 送出編輯資料（欄位驗證已由 zod schema 於 handleSubmit 完成） */
  const onSubmit = async (variables: EditProfileFormType) => {
    if (guardVisitorAction()) return;
    setUpdateLoading(true);

    const formData = new FormData();
    formData.append('email', variables.email);
    formData.append('name', variables.name);
    formData.append('account', variables.account);
    formData.append('bio', variables.bio);
    // 後端只接受 'zh' / 'en'（reset 時已正規化，這裡再守一次避免撞 400 INVALID_PARAM）
    formData.append('language', variables.language === 'en' ? 'en' : 'zh');
    formData.append('emailPrompt', variables.emailPrompt.toString());
    formData.append('mobilePrompt', variables.mobilePrompt.toString());
    formData.append('removeAvatar', removeAvatar.toString());
    formData.append('avatar', avatar);
    formData.append('avatarId', userData.avatarId);
    // 只有真的選了新檔案才 append；avatarFile 可能是 null（沒選過）或 ''（按了移除頭貼）
    if (avatarFile instanceof File) formData.append('imageFile', avatarFile);

    try {
      const result = await updateProfile(formData);
      if (handleStatus(get(result, 'status', 0)) === 2) {
        swal
          .fire({
            title: '修改成功',
            icon: 'success',
            confirmButtonText: '確認',
          })
          .then(() => {
            navigate(`/user/profile/${userId}`);
            sliceDispatch(setUserData(result.data as UserProfileType));
            scrollToTop();
          });
      } else if (handleStatus(get(result, 'status', 0)) === 4) {
        handleApiError(result);
      } else {
        errorAlert(get(result, 'data.message', ''));
      }
    } catch (error) {
      errorAlert();
    }
    setUpdateLoading(false);
  };

  if (isEmpty(userId)) return <Spinner />;
  if (isLoading) return <Spinner />;

  if (!isEmpty(userData)) {
    const isVisitor = userData.userRole === -1;
    return (
      <div className="w-full sm:max-w-[600px] p-5">
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* avatar */}
          <div className="flex flex-col items-center w-full mb-5 pb-5 border-b-[1px] dark:border-gray-700">
            <Avatar
              name={userData.name}
              avatarUrl={avatar}
              size="w-[90px] h-[90px]"
              textSize="text-4xl"
              bgColor={userData.bgColor}
            />
            {isVisitor ? (
              <div className="flex flex-col items-center">
                <p>
                  <i className="text-red-500">您的身份為訪客，因此無法修改個人資料！</i>
                </p>
                <p>
                  <i className="text-blue-500">您可以測試發佈文章、貼文等操作功能！</i>
                </p>
              </div>
            ) : (
              <div className="flex gap-2">
                <label
                  htmlFor="avatar"
                  className="mt-3 bg-gray-300 dark:bg-gray-700 rounded-md text-sm px-2 py-1 cursor-pointer"
                >
                  更新頭貼
                </label>
                <input
                  name="imageFile"
                  id="avatar"
                  type="file"
                  className="hidden"
                  onChange={(e) => handleFileChange(e)}
                  disabled={isVisitor}
                />
                {!isEmpty(avatar) && (
                  <button
                    type="button"
                    className="mt-3 bg-red-300 dark:bg-red-700 rounded-md text-sm px-2 py-1 cursor-pointer"
                    onClick={() => {
                      setAvatar('');
                      setAvatarFile('');
                      setRemoveAvatar(true);
                    }}
                  >
                    移除頭貼
                  </button>
                )}
              </div>
            )}
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
                  <FontAwesomeIcon icon={faInfoCircle} />
                  修改後即更換登入系統及電子報接收之Email
                </p>
              </div>
              <input
                id="email"
                type="email"
                placeholder="E-mail"
                disabled={isVisitor}
                {...register('email')}
                className={`${FORM_CONTROL} ${
                  errors.email
                    ? 'border-b-2 border-red-500 bg-yellow-100 dark:bg-gray-950'
                    : 'border-b-[1px] border-gray-400 dark:border-gray-700 dark:bg-gray-950'
                }`}
              />
              {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
            </div>

            <div className="mt-10">
              <label htmlFor="account" className="font-bold">
                <span className="text-red-500">*</span>
                帳號
              </label>
              <input
                id="account"
                type="text"
                placeholder="帳號"
                disabled={isVisitor}
                {...register('account')}
                className={`${FORM_CONTROL} ${
                  errors.account
                    ? 'border-b-2 border-red-500 bg-yellow-100 dark:bg-gray-950'
                    : 'border-b-[1px] border-gray-400 dark:border-gray-700 dark:bg-gray-950'
                }`}
              />
              {errors.account && <p className="text-red-500 text-sm">{errors.account.message}</p>}
            </div>

            <div className="mt-10">
              <label htmlFor="name" className="font-bold">
                <span className="text-red-500">*</span>
                名稱
              </label>
              <input
                id="name"
                type="text"
                placeholder="名稱"
                disabled={isVisitor}
                {...register('name')}
                className={`${FORM_CONTROL} ${
                  errors.name
                    ? 'border-b-2 border-red-500 bg-yellow-100 dark:bg-gray-950'
                    : 'border-b-[1px] border-gray-400 dark:border-gray-700 dark:bg-gray-950'
                }`}
              />
              {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
            </div>

            <div className="mt-10">
              <label htmlFor="bio" className="font-bold">
                自我介紹
              </label>
              <FormTextArea
                placeholder="來說說你的故事吧！"
                registration={register('bio')}
                errorMsg={errors.bio?.message}
                disabled={isVisitor}
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
                  id="language"
                  {...register('language')}
                  className={`${FORM_CONTROL} border-[1px] border-gray-400 dark:border-gray-700 dark:bg-gray-700 rounded-md focus:border-2`}
                  disabled={isVisitor}
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
                  id="emailPrompt"
                  type="checkbox"
                  className="w-5 h-5"
                  {...register('emailPrompt')}
                />
              </div>
            </div>
            <div className="my-10">
              <div className="flex justify-start items-center">
                <label htmlFor="mobilePrompt" className="font-bold mr-5">
                  是否開啟手機通知推播
                </label>
                <input
                  id="mobilePrompt"
                  type="checkbox"
                  className="w-5 h-5"
                  {...register('mobilePrompt')}
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
              {isVisitor ? '返回' : '取消'}
            </button>
            {!isVisitor && (
              <button
                type="submit"
                className="w-40 m-2 px-4 py-2 text-lg text-white rounded-md bg-green-600"
              >
                {updateLoading ? (
                  <FontAwesomeIcon icon={faSpinner} className="animate-spin h-5 w-5 " />
                ) : (
                  <>修改</>
                )}
              </button>
            )}
          </div>
        </form>
      </div>
    );
  }

  return <BasicErrorPanel errorMsg="" />;
}

export default EditProfilePage;
