import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { User } from "@/types"

export interface AuthUser extends User {
  expireAt: number;   // 转换 expiration 得到的时间戳
}


interface AuthState {
  user: User | null
}

const initialState: AuthState = {
  user: null,
}

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCurrentUser(state, action: PayloadAction<User>) {
      state.user = action.payload
      localStorage.setItem('auth_user', JSON.stringify(action.payload));
    },
    clearCurrentUser(state) {
      state.user = null
      localStorage.removeItem('auth_user');
    },
  },
})

export const { setCurrentUser, clearCurrentUser } = authSlice.actions
export const authReducer = authSlice.reducer
