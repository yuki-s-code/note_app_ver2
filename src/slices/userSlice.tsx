import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../libs/app/store";
import { USER, CREATEUSER, LOGINMIGRATIONS } from "../libs/types/login";

export interface UserState {
  globalUser: USER;
  loginUser: CREATEUSER;
  createUser: CREATEUSER;
  loginMigrations: LOGINMIGRATIONS;
}

const initialState: UserState = {
  globalUser: {
    userid: "",
    hash: "",
    token: "",
    active: false,
    profile: "",
    profiledetail: "",
  },
  createUser: {
    userid: "",
    passwd: "",
  },
  loginUser: {
    userid: "",
    passwd: "",
  },
  loginMigrations: {
    msg: "",
    token: "",
  },
};

export const UserSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setGlobalUser: (state, action: PayloadAction<USER>) => {
      state.globalUser = action.payload;
    },
    resetGlobalUser: (state) => {
      state.globalUser = initialState.globalUser;
    },
    setCreateUser: (state, action: PayloadAction<CREATEUSER>) => {
      state.createUser = action.payload;
    },
    resetCreateUser: (state) => {
      state.createUser = initialState.createUser;
    },
    setLoginUser: (state, action: PayloadAction<CREATEUSER>) => {
      state.loginUser = action.payload;
    },
    resetLoginUser: (state) => {
      state.loginUser = initialState.loginUser;
    },
    setLoginMigrations: (state, action: PayloadAction<LOGINMIGRATIONS>) => {
      state.loginMigrations = action.payload;
    },
    resetLoginMigrations: (state) => {
      state.loginMigrations = initialState.loginMigrations;
    },
  },
});

export const {
  setGlobalUser,
  resetGlobalUser,
  setCreateUser,
  resetCreateUser,
  setLoginUser,
  resetLoginUser,
  setLoginMigrations,
  resetLoginMigrations,
} = UserSlice.actions;

export const selectGlobalUser = (state: RootState) => state.user.globalUser;
export const selectCreateUser = (state: RootState) => state.user.createUser;
export const selectLoginUser = (state: RootState) => state.user.loginUser;
export const selectLoginMigrations = (state: RootState) =>
  state.user.loginMigrations;

export default UserSlice.reducer;
