import { configureStore } from '@reduxjs/toolkit';
import { reducer as formReducr } from 'redux-form';
import sysSlice from './sysSlice';
import loginSlice from './loginSlice';
import userSlice from './userSlice';
import postSlice from './postSlice';

const store = configureStore({
  reducer: {
    form: formReducr,
    system: sysSlice,
    login: loginSlice,
    user: userSlice,
    post: postSlice,
  },
});
export default store;
