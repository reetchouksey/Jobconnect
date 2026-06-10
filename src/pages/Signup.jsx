import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Mail, Lock, User, Eye, EyeOff, ArrowRight, Briefcase } from 'lucide-react';
import toast from 'react-hot-toast';

import Input from '../components/ui/Input.jsx';
import Button from '../components/ui/Button.jsx';
import { registerUser, clearError } from '../redux/authSlice.js';
import { validateSignup } from '../utils/validators.js';

export default function Signup() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated } = useSelector((s) => s.auth);

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (isAuthenticated) navigate('/', { replace: true });
  }, [isAuthenticated, navigate]);

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
    const errs = validateSignup(form);
    setErrors(errs);
    if (Object.keys(errs).length) return;
    const action = await dispatch(
      registerUser({
        name: form.name,
        email: form.email,
        password: form.password,
      }),
    );
    if (registerUser.fulfilled.match(action)) {
      toast.success(`Welcome to JobConnect, ${form.name.split(' ')[0]}!`);
    }
  };

  const passwordStrength = (() => {
    const p = form.password;
    if (!p) return { score: 0, label: '' };
    let score = 0;
    if (p.length >= 6) score++;
    if (p.length >= 10) score++;
    if (/[A-Z]/.test(p)) score++;
    if (/[0-9]/.test(p)) score++;
    if (/[^A-Za-z0-9]/.test(p)) score++;
    const labels = ['Very weak', 'Weak', 'Fair', 'Good', 'Strong'];
    return { score, label: labels[Math.min(score, 4)] };
  })();

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
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
            Create your account
          </h2>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Start applying to thousands of jobs in seconds.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <Input
              label="Full Name"
              placeholder="John Doe"
              value={form.name}
              onChange={handleChange('name')}
              icon={<User size={16} />}
              error={errors.name}
              autoComplete="name"
            />
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
                type={show ? 'text' : 'password'}
                placeholder="At least 6 characters"
                value={form.password}
                onChange={handleChange('password')}
                icon={<Lock size={16} />}
                error={errors.password}
                autoComplete="new-password"
              />
              {form.password && (
                <div className="mt-2 flex items-center gap-2">
                  <div className="flex flex-1 gap-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div
                        key={i}
                        className={`h-1.5 flex-1 rounded-full ${
                          i <= passwordStrength.score
                            ? passwordStrength.score <= 2
                              ? 'bg-rose-500'
                              : passwordStrength.score === 3
                                ? 'bg-amber-500'
                                : 'bg-emerald-500'
                            : 'bg-slate-200 dark:bg-slate-700'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs font-medium text-slate-500">
                    {passwordStrength.label}
                  </span>
                </div>
              )}
            </div>

            <Input
              label="Confirm Password"
              type={show ? 'text' : 'password'}
              placeholder="Re-enter your password"
              value={form.confirmPassword}
              onChange={handleChange('confirmPassword')}
              icon={<Lock size={16} />}
              error={errors.confirmPassword}
              autoComplete="new-password"
            />

            <button
              type="button"
              onClick={() => setShow((s) => !s)}
              className="flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-brand-600"
            >
              {show ? <EyeOff size={12} /> : <Eye size={12} />}
              {show ? 'Hide' : 'Show'} passwords
            </button>

            <Button type="submit" loading={loading} className="w-full">
              Create account <ArrowRight size={16} />
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-brand-600 hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </main>

      <aside className="relative hidden overflow-hidden bg-gradient-to-br from-brand-300 via-brand-500 to-brand-700 lg:flex">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(255,255,255,0.35),transparent_55%)]" />
        <div className="relative z-10 flex flex-col justify-between p-12 text-white">
          <Link to="/" className="ml-auto flex items-center gap-2.5">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 backdrop-blur">
              <Briefcase size={20} />
            </span>
            <span className="text-xl font-extrabold">JobConnect</span>
          </Link>

          <div className="max-w-md">
            <h1 className="text-4xl font-extrabold leading-tight">
              Your career, accelerated.
            </h1>
            <p className="mt-4 text-lg text-brand-100">
              Build a profile, save jobs you love, and apply with one click —
              everything you need in one place.
            </p>

            <ul className="mt-10 space-y-3">
              {[
                'Personalized job recommendations',
                'Track every application in one place',
                'Connect with top recruiters worldwide',
              ].map((item) => (
                <li key={item} className="flex items-center gap-3 text-brand-50">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/15">
                    ✓
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <p className="text-sm text-brand-100">
            © {new Date().getFullYear()} JobConnect, Inc.
          </p>
        </div>
      </aside>
    </div>
  );
}
