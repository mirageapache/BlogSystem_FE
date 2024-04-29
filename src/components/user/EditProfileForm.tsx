import React from 'react';
import { connect, useSelector } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import { UserDataType } from 'types/userType';
import { compose } from 'redux';
// --- components ---
import FileInput from 'components/form/FileInput';
import FormInput from 'components/form/FormInput';
import FormTextArea from 'components/form/FormTextArea';
import { required, isEmail } from 'utils/validates';
// --- types ---
import { UserStateType } from 'redux/userSlice';
import Avatar from './Avatar';

function EditProfileForm(props: any) {
  const { handleSubmit, userData } = props;
  console.log(userData);

  /** 送出編輯資料 */
  const submitEditProfile = (form: UserDataType) => {
    console.log(form);
  };

  // const userState = useSelector((state: {user: UserStateType}) => state.user);
  // const { userData } = userState;

  return (
    <form onSubmit={handleSubmit(submitEditProfile)}>
      {/* avatar */}
      <div className="flex flex-col items-center w-full mb-5 pb-5 border-b-[1px] dark:border-gray-700">
        <Avatar name="test" avatarUrl="" size="w-[90px] h-[90px]" textSize="text-4xl" bgColor="" />
        <label htmlFor="avatar" className="mt-3 bg-gray-300 rounded-md text-sm p-1 cursor-pointer">
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
          type="text"
          validate={[required('Email未必填欄位'), isEmail('Email格式錯誤')]}
        />
        <br />

        <label htmlFor="name">名稱</label>
        <Field
          name="name"
          component={FormInput}
          placeholder="請填寫名稱"
          type="text"
          validate={[required('務必讓大家知道你的名字')]}
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
        />
      </div>
    </form>
  );
}

export default compose(
  reduxForm({
    form: 'editProfile',
  })
)(EditProfileForm);
