/* eslint-disable jsx-a11y/label-has-associated-control */
import { useEffect, useState } from 'react';
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
import { required, isEmail, maxLength } from 'utils/validates';
// --- types ---
import { UserProfileType } from 'types/userType';
import { getCookies, scrollToTop } from '../../utils/common';
import { setSignInPop } from '../../redux/loginSlice';
import { errorAlert } from '../../utils/fetchError';
import { setUserData, UserStateType } from '../../redux/userSlice';

const mapStateToProps = (state: FormState) => ({
  formValues: getFormValues('editProfile')(state),
});

interface StateType {
  user: UserStateType;
}

function EditProfilePage({ handleSubmit, initialize }: any) {
  const [firstLoad, setFirstLoad] = useState(true);
  const [emailChange, setEmailChange] = useState(false);
  const [accountChange, setAccountChange] = useState(false);
  const [avatar, setAvatar] = useState<string>(''); // 處理avatar image preview
  const [avatarFile, setAvatarFile] = useState<any>(null); // 處理avatar file upload
  const [removeAvatar, setRemoveAvatar] = useState(false); // 判斷是否移除頭貼
  const sliceDispatch = useDispatch();
  const userStateData = useSelector((state: StateType) => state.user.userData);
  const userId = getCookies('uid');
  const authToken = localStorage.getItem('authToken');
  const swal = withReactContent(Swal);
  const navigate = useNavigate();
  const dispatch = useDispatch();
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

  // 設定 Redux Form 的初始值
  useEffect(() => {
    if (firstLoad && !isEmpty(userData)) {
      setAvatar(userData.avatar);
      initialize(userData);
      setFirstLoad(false);
    }
  }, [userData]);

  /** 送出編輯資料 */
  const submitEditProfile = async (form: UserProfileType) => {
    setUpdateLoading(true);
    const formData = new FormData();
    if (emailChange) formData.append('email', form.email);
    formData.append('name', form.name);
    if (accountChange) formData.append('account', form.account);
    formData.append('bio', form.bio);
    formData.append('language', form.language);
    formData.append('emailPrompt', get(form, 'emailPrompt', false).toString());
    formData.append('mobilePrompt', get(form, 'mobilePrompt', false).toString());
    formData.append('removeAvatar', removeAvatar.toString());
    if (!isEmpty(avatar)) formData.append('avatarFile', avatarFile);
    try {
      const result = await updateProfile(formData, userId!, authToken!);
      if (result.status === 200) {
        swal
          .fire({
            title: '修改成功',
            icon: 'success',
            confirmButtonText: '確認',
          })
          .then(() => {
            navigate(`/user/profile/${userId}`);
            dispatch(setUserData(result.data as UserProfileType));
            scrollToTop();
          });
      } else {
        const errorMsg = get(result, 'response.data.message', '');
        errorAlert(errorMsg);
      }
    } catch (error) {
      errorAlert();
    }
    setUpdateLoading(false);
  };

  if (isLoading) return <Spinner />;

  if (get(data, 'response.data.message') === 'Unauthorized') sliceDispatch(setSignInPop(true));

  if (!isEmpty(userData)) {
    return (
      <div className="w-full sm:max-w-[600px] p-5">
        <form onSubmit={handleSubmit(submitEditProfile)}>
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
              <Field
                name="avatarFile"
                id="avatarFile"
                component={FileInput}
                setAvatar={setAvatar}
                setAvatarFile={setAvatarFile}
                setRemoveAvatar={setRemoveAvatar}
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
              <Field
                name="email"
                component={FormInput}
                placeholder="請填寫Email"
                type="email"
                validate={[required('Email為必填資料'), isEmail('Email格式錯誤')]}
                onChange={() => setEmailChange(true)}
              />
            </div>

            <div className="mt-10">
              <label htmlFor="name" className="font-bold">
                <span className="text-red-500">*</span>
                帳號
              </label>
              <Field
                name="account"
                component={FormInput}
                placeholder="請填寫帳號"
                type="text"
                validate={[required('帳號為必填資料')]}
                onChange={() => setAccountChange(true)}
              />
            </div>

            <div className="mt-10">
              <label htmlFor="name" className="font-bold">
                <span className="text-red-500">*</span>
                名稱
              </label>
              <Field
                name="name"
                component={FormInput}
                placeholder="請填寫名稱"
                type="text"
                validate={[required('名稱為必填資料')]}
              />
            </div>

            <div className="mt-10">
              <label htmlFor="bio" className="font-bold">
                自我介紹
              </label>
              <Field
                name="bio"
                component={FormTextArea}
                placeholder="來說說你的故事吧！"
                type="text"
                validate={[maxLength(200, '自我介紹內容不超過200字')]}
                value="自我介紹"
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
                <Field
                  name="language"
                  component="select"
                  className={`${FORM_CONTROL} border-[1px] border-gray-400 dark:border-gray-700 dark:bg-gray-700 rounded-md focus:border-2`}
                >
                  <option value="zh" className="">
                    中文
                  </option>
                  <option value="en" className="">
                    English
                  </option>
                </Field>
              </div>
            </div>
            <div className="mt-10">
              <div className="flex justify-start items-center">
                <label htmlFor="emailPrompt" className="font-bold mr-5">
                  是否開啟Email通知推播
                </label>
                <Field name="emailPrompt" component="input" type="checkbox" className="w-5 h-5" />
              </div>
            </div>
            <div className="my-10">
              <div className="flex justify-start items-center">
                <label htmlFor="mobilePrompt" className="font-bold mr-5">
                  是否開啟手機通知推播
                </label>
                <Field name="mobilePrompt" component="input" type="checkbox" className="w-5 h-5" />
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

export default connect(mapStateToProps)(
  reduxForm({
    form: 'editProfile',
  })(EditProfilePage)
);
