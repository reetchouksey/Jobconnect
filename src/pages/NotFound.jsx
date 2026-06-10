import { Link } from 'react-router-dom';
import { Home, Briefcase } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center text-center">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-glow">
        <Briefcase size={32} />
      </div>
      <p className="text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white">
        404
      </p>
      <h1 className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
        Page not found
      </h1>
      <p className="mt-2 max-w-md text-slate-500 dark:text-slate-400">
        We couldn&apos;t find the page you were looking for. It may have moved or
        no longer exists.
      </p>
      <div className="mt-8 flex gap-3">
        <Link to="/" className="btn-primary">
          <Home size={16} /> Back to home
        </Link>
        <Link to="/jobs" className="btn-secondary">
          <Briefcase size={16} /> Browse jobs
        </Link>
      </div>
    </div>
  );
}
