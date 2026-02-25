import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { authAPI } from '../../services/api'

// ─── Async Thunks ────────────────────────────────────────────────────────────

export const loginAdmin = createAsyncThunk(
  'auth/login',
  async ({ phone, password }, { rejectWithValue }) => {
    try {
      const data = await authAPI.login({ phone, password })
      // Persist token to localStorage
      if (data.token) {
        localStorage.setItem('admin_token', data.token)
        localStorage.setItem('admin_user', JSON.stringify(data.admin || data.user || { username }))
      }
      return data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Login failed')
    }
  }
)

export const logoutAdmin = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      localStorage.removeItem('admin_token')
      localStorage.removeItem('admin_user')
      return null
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

// ─── Initial State ────────────────────────────────────────────────────────────

const savedToken = localStorage.getItem('admin_token')
const savedUser = localStorage.getItem('admin_user')

const initialState = {
  token: savedToken || null,
  user: savedUser ? JSON.parse(savedUser) : null,
  isAuthenticated: !!savedToken,
  loading: false,
  error: null,
}

// ─── Slice ───────────────────────────────────────────────────────────────────

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    // Manual token injection (for token-based auth flows)
    setCredentials: (state, action) => {
      const { token, user } = action.payload
      state.token = token
      state.user = user
      state.isAuthenticated = true
      localStorage.setItem('admin_token', token)
      localStorage.setItem('admin_user', JSON.stringify(user))
    },
  },
  extraReducers: (builder) => {
    // ── Login ──────────────────────────────────────────────────────────
    builder
      .addCase(loginAdmin.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(loginAdmin.fulfilled, (state, action) => {
        state.loading = false
        state.token = action.payload.token
        state.user = action.payload.admin || action.payload.user || { username: action.payload.username }
        state.isAuthenticated = true
        state.error = null
      })
      .addCase(loginAdmin.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
        state.isAuthenticated = false
      })

    // ── Logout ─────────────────────────────────────────────────────────
    builder
      .addCase(logoutAdmin.fulfilled, (state) => {
        state.token = null
        state.user = null
        state.isAuthenticated = false
        state.loading = false
        state.error = null
      })
  },
})

export const { clearError, setCredentials } = authSlice.actions

// ─── Selectors ────────────────────────────────────────────────────────────────

export const selectIsAuthenticated = (state) => state.auth.isAuthenticated
export const selectAuthLoading = (state) => state.auth.loading
export const selectAuthError = (state) => state.auth.error
export const selectCurrentUser = (state) => state.auth.user
export const selectToken = (state) => state.auth.token

export default authSlice.reducer
