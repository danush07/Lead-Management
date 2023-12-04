import { configureStore } from '@reduxjs/toolkit';
import authReducer from '@/features/auth/authSlice'
import usersReducer from '@/features/createUser/newSlice'
const store = configureStore({
  reducer:{
    auth : authReducer,
    users : usersReducer
  }
});

export default store


