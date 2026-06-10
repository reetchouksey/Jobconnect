import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';

import Layout from '../components/layout/Layout.jsx';
import ProtectedRoute from '../components/ProtectedRoute.jsx';
import PageLoader from '../components/ui/PageLoader.jsx';

const Home = lazy(() => import('../pages/Home.jsx'));
const Jobs = lazy(() => import('../pages/Jobs.jsx'));
const JobDetails = lazy(() => import('../pages/JobDetails.jsx'));
const SavedJobs = lazy(() => import('../pages/SavedJobs.jsx'));
const AppliedJobs = lazy(() => import('../pages/AppliedJobs.jsx'));
const Profile = lazy(() => import('../pages/Profile.jsx'));
const Recruiter = lazy(() => import('../pages/Recruiter.jsx'));
const PostJob = lazy(() => import('../pages/PostJob.jsx'));
const Applicants = lazy(() => import('../pages/Applicants.jsx'));
const Login = lazy(() => import('../pages/Login.jsx'));
const Signup = lazy(() => import('../pages/Signup.jsx'));
const NotFound = lazy(() => import('../pages/NotFound.jsx'));

export default function AppRoutes() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/jobs/:id" element={<JobDetails />} />
          <Route path="/saved" element={<SavedJobs />} />
          <Route path="/applied" element={<AppliedJobs />} />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/recruiter"
            element={
              <ProtectedRoute>
                <Recruiter />
              </ProtectedRoute>
            }
          />
          <Route
            path="/recruiter/post"
            element={
              <ProtectedRoute>
                <PostJob />
              </ProtectedRoute>
            }
          />
          <Route
            path="/recruiter/edit/:id"
            element={
              <ProtectedRoute>
                <PostJob />
              </ProtectedRoute>
            }
          />
          <Route
            path="/recruiter/applicants/:id"
            element={
              <ProtectedRoute>
                <Applicants />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
