import { configureStore } from '@reduxjs/toolkit';

import authReducer from './authSlice.js';
import jobsReducer from './jobsSlice.js';
import filterReducer from './filterSlice.js';
import savedJobsReducer from './savedJobsSlice.js';
import appliedJobsReducer from './appliedJobsSlice.js';
import themeReducer from './themeSlice.js';
import recentReducer from './recentSlice.js';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    jobs: jobsReducer,
    filters: filterReducer,
    savedJobs: savedJobsReducer,
    appliedJobs: appliedJobsReducer,
    theme: themeReducer,
    recent: recentReducer,
  },
});
