import React, { useEffect } from 'react'
import { useQuery } from 'react-query'
import { useDispatch, useSelector } from 'react-redux';
import { get, isEmpty } from 'lodash';

// --- functions ---
import { Auth } from 'api/auth';
import { UserStateType } from '../../redux/userSlice';
import { setSignInPop } from '../../redux/loginSlice';
import { getCookies } from '../../utils/common';
// --- components ---
import Spinner from 'components/tips/Spinner';
import BasicErrorPanel from 'components/tips/BasicErrorPanel';
import Avatar from 'components/user/Avatar';

function EditProfilePage() {
  const dispatch =  useDispatch();
  const userId = getCookies('uid');
  // const userState = useSelector((state: {user: UserStateType}) => state.user);
  // const { userId } = userState.userData;
  
  if(isEmpty(userId)){
    dispatch(setSignInPop(true));
    return <Spinner />
  }
  const authResult = useQuery('user', () => Auth(userId!));
  const { isLoading, isSuccess, data } = authResult;

  if(isLoading) return <Spinner />

  if(isSuccess && get(data, 'response.data.message', '') == "Unauthorized"){
    dispatch(setSignInPop(true));
  }

  if(isSuccess && get(data, 'status', 0) === 200) {
    return (
      <div className="w-full sm:max-w-[600px] p-5">
        <form className="">
          edit user data
          {/* avatar */}
          <div className='flex flex-col items-center w-full mb-5 pb-5 border-b-[1px] dark:border-gray-700'>
            <Avatar
              name="test"
              avatarUrl=""
              size="w-[90px] h-[90px]"
              textSize="text-4xl"
            />
            <label htmlFor="avatar" className="mt-3 bg-gray-300 rounded-md text-sm p-1 cursor-pointer">更新頭貼</label>
            <input type='file' id='avatar' name='avatar' className="hidden" />
          </div>
          <div>

          </div>
        </form>
      </div>
    )
  }

  return (
    <BasicErrorPanel errorMsg='' />
  )
}

export default EditProfilePage