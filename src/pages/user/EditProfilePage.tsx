import React from 'react'
import { useQuery } from 'react-query'
import { useDispatch, useSelector } from 'react-redux';
import { get, isEmpty } from 'lodash';

// --- functions ---
import { Auth } from 'api/auth';
import { UserStateType } from '../../redux/userSlice';
import { setSignInPop } from '../../redux/loginSlice';
// --- components ---
import Spinner from 'components/tips/Spinner';
import BasicErrorPanel from 'components/tips/BasicErrorPanel';

function EditProfilePage() {
  const dispatch =  useDispatch();
  const userState = useSelector((state: {user: UserStateType}) => state.user);
  const { userId } = userState.userData;

  console.log(userId);

  // if(isEmpty(userId)) { // redux 必須存有userData才可進行
  //   dispatch(setSignInPop(true));
  //   return <Spinner />
  // }

  const authResult = useQuery('user', () => Auth(userId));
  // console.log(authResult);
  const { isLoading, isSuccess, data } = authResult;
  
  if(isLoading) return <Spinner />

  if(isSuccess && get(authResult, 'data.response.status', 0) !== 200){
    dispatch(setSignInPop(true));
    return <Spinner />
  }

  if(isSuccess) {

    return (
      <div>
        edit user data
      </div>
    )
  }

  return (
    <BasicErrorPanel errorMsg='' />
  )
}

export default EditProfilePage