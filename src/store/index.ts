import { configureStore, combineReducers } from "@reduxjs/toolkit"
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist"
import createWebStorage from "redux-persist/es/storage/createWebStorage"
import { authReducer } from "./auth-slice"
import { firearmsReducer } from "./firearms-slice"

const storage = createWebStorage(import.meta.env.VITE_REDUX_STORAGE ?? "local")

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth", "firearms"],
}

const rootReducer = combineReducers({
  auth: authReducer,
  firearms: firearmsReducer
})

const persistedReducer = persistReducer(persistConfig, rootReducer)

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
})

export const persistor = persistStore(store)

export default store
export type RootState = ReturnType<typeof rootReducer>
export type AppDispatch = typeof store.dispatch
export type AppStore = typeof store

