import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  token: string | null;
  firstName: string | null;
  lastName: string | null;
  phoneNumber: string | null;
  isAuthenticated: boolean;
}

const initialState: UserState = {
  token: null,
  firstName: null,
  lastName: null,
  phoneNumber: null,
  isAuthenticated: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<Omit<UserState, "isAuthenticated">>) => {
      state.token = action.payload.token;
      state.firstName = action.payload.firstName;
      state.lastName = action.payload.lastName;
      state.phoneNumber = action.payload.phoneNumber;
      state.isAuthenticated = true;
    },
    clearUser: (state) => {
      state.token = null;
      state.firstName = null;
      state.lastName = null;
      state.phoneNumber = null;
      state.isAuthenticated = false;
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
