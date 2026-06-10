import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../services/api.js';

export const fetchApplications = createAsyncThunk(
  'appliedJobs/fetch',
  async (_, { rejectWithValue }) => {
    try {
      return await api.getApplications();
    } catch (e) {
      return rejectWithValue(e.message);
    }
  },
);

export const applyJob = createAsyncThunk(
  'appliedJobs/apply',
  async (payload, { rejectWithValue }) => {
    try {
      await api.submitApplication(payload);
      return {
        jobId: payload.jobId || payload.job?.id,
        jobTitle: payload.jobTitle || payload.job?.title,
        company: payload.company || payload.job?.company,
        location: payload.location || payload.job?.location,
        logo: payload.logo || payload.job?.logo,
        applyUrl: payload.applyUrl || payload.job?.applyUrl,
        applicant: payload.applicant || {},
        status: 'Submitted',
        appliedAt: new Date().toISOString(),
      };
    } catch (e) {
      return rejectWithValue(e.message);
    }
  },
);

export const updateApplicationStatus = createAsyncThunk(
  'appliedJobs/updateStatus',
  async ({ jobId, status }, { rejectWithValue }) => {
    try {
      await api.updateApplicationStatus(jobId, status);
      return { jobId, status };
    } catch (e) {
      return rejectWithValue(e.message);
    }
  },
);

export const withdrawApplication = createAsyncThunk(
  'appliedJobs/withdraw',
  async (jobId, { rejectWithValue }) => {
    try {
      await api.withdrawApplication(jobId);
      return jobId;
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

const appliedJobsSlice = createSlice({
  name: 'appliedJobs',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchApplications.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchApplications.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload || [];
      })
      .addCase(fetchApplications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(applyJob.fulfilled, (state, action) => {
        if (!state.items.find((a) => a.jobId === action.payload.jobId)) {
          state.items.unshift(action.payload);
        }
      })
      .addCase(updateApplicationStatus.fulfilled, (state, action) => {
        const app = state.items.find((a) => a.jobId === action.payload.jobId);
        if (app) app.status = action.payload.status;
      })
      .addCase(withdrawApplication.fulfilled, (state, action) => {
        state.items = state.items.filter((a) => a.jobId !== action.payload);
      });
  },
});

export default appliedJobsSlice.reducer;
