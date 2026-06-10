import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../services/api.js';
import { apiClient } from '../services/apiClient.js';

export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      return await api.login(credentials);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

export const registerUser = createAsyncThunk(
  'auth/register',
  async (payload, { rejectWithValue }) => {
    try {
      return await api.register(payload);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

export const updateProfile = createAsyncThunk(
  'auth/updateProfile',
  async (payload, { rejectWithValue }) => {
    try {
      return await api.updateProfile(payload);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

export const hydrateUser = createAsyncThunk(
  'auth/hydrate',
  async (_, { rejectWithValue }) => {
    if (!apiClient.isAuthenticated()) return null;
    try {
      const user = await api.refreshCurrentUser();
      if (!user) {
        api.logout();
        return null;
      }
      return user;
    } catch {
      return rejectWithValue('Token expired');
    }
  },
);

const initialUser = api.getCurrentUser();

const initialState = {
  user: initialUser,
  isAuthenticated: Boolean(initialUser && apiClient.isAuthenticated()),
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      api.logout();
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Login failed';
      })
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Registration failed';
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(hydrateUser.fulfilled, (state, action) => {
        if (action.payload) {
          state.user = action.payload;
          state.isAuthenticated = true;
        } else {
          state.user = null;
          state.isAuthenticated = false;
        }
      })
      .addCase(hydrateUser.rejected, (state) => {
        api.logout();
        state.user = null;
        state.isAuthenticated = false;
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
