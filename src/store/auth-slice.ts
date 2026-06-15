import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { User } from "@/types"

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
    },
    clearCurrentUser(state) {
      state.user = null
    },
  },
})

export const { setCurrentUser, clearCurrentUser } = authSlice.actions
export const authReducer = authSlice.reducer
