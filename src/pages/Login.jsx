import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Briefcase } from 'lucide-react';
import toast from 'react-hot-toast';

import Input from '../components/ui/Input.jsx';
import Button from '../components/ui/Button.jsx';
import { loginUser, clearError } from '../redux/authSlice.js';
import { validateLogin } from '../utils/validators.js';

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { loading, error, isAuthenticated } = useSelector((s) => s.auth);

  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const from = location.state?.from?.pathname || '/';

  useEffect(() => {
    if (isAuthenticated) navigate(from, { replace: true });
  }, [isAuthenticated, navigate, from]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const handleChange = (key) => (e) =>
    setForm({ ...form, [key]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validateLogin(form);
    setErrors(errs);
    if (Object.keys(errs).length) return;
    const action = await dispatch(loginUser(form));
    if (loginUser.fulfilled.match(action)) {
      toast.success(`Welcome back, ${action.payload.name}!`);
    }
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <aside className="relative hidden overflow-hidden bg-gradient-to-br from-brand-300 via-brand-500 to-brand-700 lg:flex">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.35),transparent_55%)]" />
        <div className="relative z-10 flex flex-col justify-between p-12 text-white">
          <Link to="/" className="flex items-center gap-2.5">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 backdrop-blur">
              <Briefcase size={20} />
            </span>
            <span className="text-xl font-extrabold">JobConnect</span>
          </Link>

          <div>
            <h1 className="text-4xl font-extrabold leading-tight">
              Find your next opportunity.
            </h1>
            <p className="mt-4 max-w-sm text-lg text-brand-100">
              Discover thousands of jobs from the world&apos;s leading companies,
              all in one place.
            </p>

            <div className="mt-12 grid grid-cols-3 gap-6">
              {[
                { value: '50k+', label: 'Active Jobs' },
                { value: '12k+', label: 'Companies' },
                { value: '2M+', label: 'Candidates' },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="text-3xl font-extrabold">{stat.value}</p>
                  <p className="text-sm text-brand-100">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          <p className="text-sm text-brand-100">
            © {new Date().getFullYear()} JobConnect, Inc.
          </p>
        </div>
      </aside>

      <main className="flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md animate-slide-up">
          <Link
            to="/"
            className="mb-8 flex items-center gap-2 text-slate-500 hover:text-brand-600 lg:hidden dark:text-slate-400"
          >
            <Briefcase size={18} />
            <span className="font-bold">JobConnect</span>
          </Link>
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">
            Welcome back
          </h2>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Sign in to continue your job search.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <Input
              label="Email"
              type="email"
              placeholder="you@email.com"
              value={form.email}
              onChange={handleChange('email')}
              icon={<Mail size={16} />}
              error={errors.email}
              autoComplete="email"
            />
            <div>
              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange('password')}
                icon={<Lock size={16} />}
                error={errors.password}
                autoComplete="current-password"
              />
              <div className="mt-1.5 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-brand-600"
                >
                  {showPassword ? <EyeOff size={12} /> : <Eye size={12} />}
                  {showPassword ? 'Hide' : 'Show'} password
                </button>
                <a className="text-xs font-medium text-brand-600 hover:underline">
                  Forgot password?
                </a>
              </div>
            </div>

            <Button type="submit" loading={loading} className="w-full">
              Sign in <ArrowRight size={16} />
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
            Don&apos;t have an account?{' '}
            <Link
              to="/signup"
              className="font-semibold text-brand-600 hover:underline"
            >
              Create one
            </Link>
          </p>

          <div className="mt-8 rounded-xl border border-dashed border-slate-200 p-4 text-xs text-slate-500 dark:border-slate-700 dark:text-slate-400">
            <p className="font-semibold text-slate-700 dark:text-slate-300">
              Demo Mode
            </p>
            <p className="mt-1">
              Sign up to create an account, or use any account previously created
              in this browser.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
