/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useEffect } from 'react';
import { useQuery } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import { get, isEmpty } from 'lodash';

// --- components ---
import Spinner from 'components/tips/Spinner';
import BasicErrorPanel from 'components/tips/BasicErrorPanel';
import Avatar from 'components/user/Avatar';
import EditProfileForm from 'components/user/EditProfileForm';
// --- functions ---
import { Auth } from 'api/auth';
import { UserStateType } from '../../redux/userSlice';
import { setSignInPop } from '../../redux/loginSlice';
import { getCookies } from '../../utils/common';
import { compose } from 'redux';
import { reduxForm } from 'redux-form';

function EditProfilePage() {
  const dispatch = useDispatch();
  const userId = getCookies('uid');

  if (isEmpty(userId)) {
    dispatch(setSignInPop(true));
    return <Spinner />;
  }
  const authResult = useQuery('user', () => Auth(userId!));
  const { isLoading, isSuccess, data } = authResult;


  if (isLoading) return <Spinner />;

  if (isSuccess && get(data, 'response.data.message', '') === 'Unauthorized') {
    dispatch(setSignInPop(true));
  }

  if (isSuccess && get(data, 'status', 0) === 200) {
    return (
      <div className="w-full sm:max-w-[600px] p-5">
        <EditProfileForm />
      </div>
    );
  }

  return <BasicErrorPanel errorMsg="" />;
}

export default EditProfilePage;
