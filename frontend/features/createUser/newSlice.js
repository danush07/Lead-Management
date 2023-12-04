import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import userService from '../createUser/newService';

const initialState = {
  users: [],
  isLoading: false,
  isError: false,
  isSuccess: false,
  message:'',
  userCreate:false
};

export const createUser = createAsyncThunk(
  'users/createUser',
  async (users, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token
      const response = await userService.createUser(users,token);
      // console.log(response)
      return response;
    } catch (e) {
      const message = (e.response && e.response.data && e.response.data.message)|| e.message || e.toString()
      return thunkAPI.rejectWithValue(message)
    }
  }
);
export const getUsers = createAsyncThunk(
    'users/getUsers',
    async (users, thunkAPI) => {
      try {
        const token = thunkAPI.getState().auth.user.token
        const response = await userService.getUsers(users,token);
        return response;
      } catch (e) {
        const message = (e.response && e.response.data && e.response.data.message)|| e.message || e.toString()
            return thunkAPI.rejectWithValue(message)
      }
    }
  );
  export const deleteUsers = createAsyncThunk(
    'users/deleteUser',
    async (userId,thunkAPI) =>{
      try{
        const token = thunkAPI.getState().auth.user.token
        // console.log(token)
        await userService.deleteUsers(userId,token)
        return userId
      }catch(error){
        const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
      }
    }
  )

  export const updateSingleUser = createAsyncThunk(
    'users/updateUser',
    async (updatedUserData, thunkAPI) => {
      try {
        const userId = updatedUserData._id; 
        const token = thunkAPI.getState().auth.user.token;
        await userService.updateSingleUser(userId, updatedUserData, token);
        return { userId, updatedUserData };

      } catch (e) {
        const message =
          (e.response && e.response.data && e.response.data.message) ||
          e.message ||
          e.toString();
        return thunkAPI.rejectWithValue(message);
      }
    }
  );
  
const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers:{
    reset : (state) =>{
        state.users = []
        state.isLoading = false
        state.isError = false
        state.isSuccess = false
        state.message = ''
        state.userCreate = false
    }
},
  extraReducers: (builder) => {
    builder
      .addCase(createUser.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.userCreate = true;
        state.users = action.payload;
      })
      .addCase(createUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess =false;
        state.message = action.payload
      })
      .addCase(getUsers.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.users = action.payload;
      })
      .addCase(getUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(updateSingleUser.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
      })
      .addCase(updateSingleUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.users = action.payload;
      })
      .addCase(updateSingleUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess =false;
        state.message = action.payload
      })

  },
});

export const {reset}  = userSlice.actions
export default userSlice.reducer;
