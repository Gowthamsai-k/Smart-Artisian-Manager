import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isLoggedIn: false,
  user: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.isLoggedIn = true;
      state.user = action.payload;
    },
    removeUser: (state) => {
      state.isLoggedIn = false;
      state.user = null;
    },
  },
});

export const { setUser, removeUser } = userSlice.actions;

export const getIsLoggedIn = (state) => state.user.isLoggedIn;
export const getUser = (state) => state.user.user;

export default userSlice.reducer;
