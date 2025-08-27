import { createSlice } from "@reduxjs/toolkit"; 

const userSlice = createSlice({
  name: "user",
  initialState: {
    userInfo: null,
    isLoggedIn: false,
    socketid: null
  },
  reducers: {
    setUser: (state, action) => {
      state.userInfo = action.payload.userInfo;
      state.isLoggedIn = true;
      state.socketid = action.payload.socket;
    },
    logout: (state) => {
      state.userInfo = null;
      state.isLoggedIn = false;
    },
  },
});

export { userSlice};
export const { setUser, logout } = userSlice.actions;
export default userSlice.reducer;
    