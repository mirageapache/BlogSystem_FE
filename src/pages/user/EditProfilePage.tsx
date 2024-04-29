/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useEffect } from 'react';
import { useQuery } from 'react-query';
import { connect, useDispatch, useSelector } from 'react-redux';
import { get, isEmpty } from 'lodash';
import { Field, change, reduxForm, getFormValues, FormState } from 'redux-form';

// --- components ---
import Spinner from 'components/tips/Spinner';
import BasicErrorPanel from 'components/tips/BasicErrorPanel';
import Avatar from 'components/user/Avatar';
import EditProfileForm from 'components/user/EditProfileForm';
import FileInput from 'components/form/FileInput';
import FormInput from 'components/form/FormInput';
import FormTextArea from 'components/form/FormTextArea';
// --- functions ---
import { getOwnProfile } from 'api/user';
import { required, isEmail } from 'utils/validates';
// --- types ---
import { UserDataType } from 'types/userType';
import { getCookies } from '../../utils/common';
import { setSignInPop } from '../../redux/loginSlice';

const mapStateToProps = (state: FormState) => ({
  formValues: getFormValues('editProfile')(state),
});

function EditProfilePage({ handleSubmit, dispatch }: any) {
  const sliceDispatch = useDispatch();
  const userId = getCookies('uid');
  const authToken = localStorage.getItem('authToken');

  if (isEmpty(userId) || isEmpty(authToken)) {
    sliceDispatch(setSignInPop(true));
    return <Spinner />;
  }
  const getUserData = useQuery('user', () => getOwnProfile(userId!, authToken!));
  const { isLoading, isSuccess, data } = getUserData;
  const userData = get(data, 'data');

  // useEffect 用來設定 Redux Form 的初始值
  useEffect(() => {
    if (isSuccess && !isEmpty(userData)) {
      dispatch(change('editProfile', 'email', userData.email));
      dispatch(change('editProfile', 'name', userData.name));
      dispatch(change('editProfile', 'bio', userData.bio));
    }
  }, [isSuccess, userData, dispatch]);

  /** 送出編輯資料 */
  const submitEditProfile = (form: UserDataType) => {
    console.log(form);
  };

  if (isLoading) return <Spinner />;

  if (isSuccess && get(data, 'response.data.message') === 'Unauthorized') {
    sliceDispatch(setSignInPop(true));
  }

  if (isSuccess && !isEmpty(userData) && get(data, 'status', 0) === 200) {
    return (
      <div className="w-full sm:max-w-[600px] p-5">
        <form onSubmit={handleSubmit(submitEditProfile)}>
          {/* avatar */}
          <div className="flex flex-col items-center w-full mb-5 pb-5 border-b-[1px] dark:border-gray-700">
            <Avatar
              name={userData.name}
              avatarUrl=""
              size="w-[90px] h-[90px]"
              textSize="text-4xl"
              bgColor={userData.bgColor}
            />
            <label
              htmlFor="avatar"
              className="mt-3 bg-gray-300 rounded-md text-sm p-1 cursor-pointer"
            >
              更新頭貼
            </label>
            <input type="file" id="avatar" name="avatar" className="hidden" />
            <Field name="avatar" component={FileInput} />
          </div>

          <div>
            <label htmlFor="email">Email</label>
            <Field
              name="email"
              component={FormInput}
              placeholder="請填寫Email"
              type="email"
              validate={[required('Email未必填欄位'), isEmail('Email格式錯誤')]}
              normalize={(value: string) => (userData ? userData.email : value)}
            />
            <br />

            <label htmlFor="name">名稱</label>
            <Field
              name="name"
              component={FormInput}
              placeholder="請填寫名稱"
              type="text"
              validate={[required('務必讓大家知道你的名字')]}
              normalize={(value: string) => (userData ? userData.name : value)}
            />
            <br />

            <label htmlFor="bio" className="">
              自我介紹
            </label>
            <Field
              name="bio"
              component={FormTextArea}
              placeholder="來說說你的故事吧！"
              type="text"
              value="自我介紹"
              normalize={(value: string) => (userData ? userData.bio : value)}
            />
          </div>
          <div className="mt-5">
            <button
              type="submit"
              className="w-full sm:w-40 px-4 py-2 text-lg text-white rounded-md bg-green-600"
            >
              修改
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
