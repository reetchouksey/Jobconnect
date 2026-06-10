import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../services/api.js';

export const fetchSavedJobs = createAsyncThunk(
  'savedJobs/fetch',
  async (_, { rejectWithValue }) => {
    try {
      return await api.getSavedJobs();
    } catch (e) {
      return rejectWithValue(e.message);
    }
  },
);

export const saveJob = createAsyncThunk(
  'savedJobs/save',
  async (job, { rejectWithValue }) => {
    try {
      await api.saveJob(job);
      return { ...job, savedAt: new Date().toISOString() };
    } catch (e) {
      return rejectWithValue(e.message);
    }
  },
);

export const removeSavedJob = createAsyncThunk(
  'savedJobs/remove',
  async (jobId, { rejectWithValue }) => {
    try {
      await api.removeSavedJob(jobId);
      return jobId;
    } catch (e) {
      return rejectWithValue(e.message);
    }
  },
);

export const clearSaved = createAsyncThunk(
  'savedJobs/clearAll',
  async (_, { getState, rejectWithValue }) => {
    try {
      const ids = getState().savedJobs.items.map((j) => j.id);
      await Promise.all(ids.map((id) => api.removeSavedJob(id).catch(() => null)));
      return true;
    } catch (e) {
      return rejectWithValue(e.message);
    }
  },
);

const initialState = {
  items: [],
  loading: false,
  error: null,
};

const savedJobsSlice = createSlice({
  name: 'savedJobs',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSavedJobs.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSavedJobs.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload || [];
      })
      .addCase(fetchSavedJobs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(saveJob.fulfilled, (state, action) => {
        if (!state.items.find((j) => j.id === action.payload.id)) {
          state.items.unshift(action.payload);
        }
      })
      .addCase(removeSavedJob.fulfilled, (state, action) => {
        state.items = state.items.filter((j) => j.id !== action.payload);
      })
      .addCase(clearSaved.fulfilled, (state) => {
        state.items = [];
      });
  },
});

export default savedJobsSlice.reducer;
