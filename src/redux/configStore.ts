import { configureStore } from '@reduxjs/toolkit';
import { reducer as formReducr } from 'redux-form';
import sysSlice from './sysSlice';
import searchSlice from './searchSlice';
import loginSlice from './loginSlice';

const store = configureStore({
  reducer: {
    form: formReducr,
    system: sysSlice,
    search: searchSlice,
    login: loginSlice,
  },
});
export default store;
