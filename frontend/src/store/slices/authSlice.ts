import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

type AuthState = {
  token: string | null
  email: string | null
  isAuthenticated: boolean
}

type AuthPayload = {
  token: string
  email: string
}

const savedToken = localStorage.getItem('lm_token')
const savedEmail = localStorage.getItem('lm_email')

const initialState: AuthState = {
  token: savedToken,
  email: savedEmail,
  isAuthenticated: Boolean(savedToken),
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<AuthPayload>) => {
      const { token, email } = action.payload
      state.token = token
      state.email = email
      state.isAuthenticated = true
      localStorage.setItem('lm_token', token)
      localStorage.setItem('lm_email', email)
    },
    logout: state => {
      state.token = null
      state.email = null
      state.isAuthenticated = false
      localStorage.removeItem('lm_token')
      localStorage.removeItem('lm_email')
    },
  },
})

export const { setCredentials, logout } = authSlice.actions
export default authSlice.reducer