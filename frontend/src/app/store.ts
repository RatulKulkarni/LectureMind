import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../store/slices/authSlice'
import appReducer from '../store/slices/appSlice'
import uploadReducer from '../store/slices/uploadSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    app: appReducer,
    upload: uploadReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch