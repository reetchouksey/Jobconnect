import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import AppRoutes from './routes/AppRoutes.jsx';
import useTheme from './hooks/useTheme.js';
import { fetchJobs } from './redux/jobsSlice.js';
import { fetchSavedJobs } from './redux/savedJobsSlice.js';
import { fetchApplications } from './redux/appliedJobsSlice.js';
import { hydrateUser } from './redux/authSlice.js';

export default function App() {
  useTheme();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((s) => s.auth.isAuthenticated);

  useEffect(() => {
    dispatch(fetchJobs());
    dispatch(hydrateUser());
  }, [dispatch]);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchSavedJobs());
      dispatch(fetchApplications());
    }
  }, [isAuthenticated, dispatch]);

  return <AppRoutes />;
}
