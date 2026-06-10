import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../services/api.js';
import { fetchRealJobs } from '../services/realJobsApi.js';

export const fetchJobs = createAsyncThunk(
  'jobs/fetch',
  async ({ force = false } = {}, { rejectWithValue }) => {
    try {
      let backendJobs = [];
      let backendOnline = true;
      try {
        backendJobs = await api.getJobs();
      } catch (e) {
        backendOnline = false;
        console.warn('[jobsSlice] backend unreachable:', e.message);
      }

      let realJobs = [];
      try {
        realJobs = await fetchRealJobs({ force });
      } catch (e) {
        console.warn('[jobsSlice] real jobs fetch failed:', e.message);
      }

      const seen = new Set();
      const combined = [...backendJobs, ...realJobs].filter((j) => {
        if (!j?.id || seen.has(j.id)) return false;
        seen.add(j.id);
        return true;
      });

      return {
        jobs: combined,
        usedSeed: backendJobs.length > 0 && realJobs.length === 0,
        backendOnline,
      };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

export const refreshJobs = createAsyncThunk('jobs/refresh', async (_, thunk) => {
  return thunk.dispatch(fetchJobs({ force: true })).unwrap();
});

export const addJob = createAsyncThunk(
  'jobs/add',
  async (job, { rejectWithValue }) => {
    try {
      return await api.addJob(job);
    } catch (e) {
      return rejectWithValue(e.message);
    }
  },
);

export const updateJob = createAsyncThunk(
  'jobs/update',
  async (job, { rejectWithValue }) => {
    try {
      return await api.updateJob(job);
    } catch (e) {
      return rejectWithValue(e.message);
    }
  },
);

export const deleteJob = createAsyncThunk(
  'jobs/delete',
  async (id, { rejectWithValue }) => {
    try {
      return await api.deleteJob(id);
    } catch (e) {
      return rejectWithValue(e.message);
    }
  },
);

const initialState = {
  items: [],
  loading: false,
  refreshing: false,
  error: null,
  usedSeed: true,
  backendOnline: true,
  lastFetched: null,
};

const jobsSlice = createSlice({
  name: 'jobs',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchJobs.pending, (state, action) => {
        if (action.meta.arg?.force) state.refreshing = true;
        else state.loading = state.items.length === 0;
        state.error = null;
      })
      .addCase(fetchJobs.fulfilled, (state, action) => {
        state.loading = false;
        state.refreshing = false;
        state.items = action.payload.jobs;
        state.usedSeed = action.payload.usedSeed;
        state.backendOnline = action.payload.backendOnline;
        state.lastFetched = Date.now();
      })
      .addCase(fetchJobs.rejected, (state, action) => {
        state.loading = false;
        state.refreshing = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(addJob.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      })
      .addCase(updateJob.fulfilled, (state, action) => {
        const idx = state.items.findIndex((j) => j.id === action.payload.id);
        if (idx >= 0) state.items[idx] = { ...state.items[idx], ...action.payload };
      })
      .addCase(deleteJob.fulfilled, (state, action) => {
        state.items = state.items.filter((j) => j.id !== action.payload);
      });
  },
});

export default jobsSlice.reducer;
