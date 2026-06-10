import { Link } from 'react-router-dom';
import { Briefcase } from 'lucide-react';

export default function Logo({ collapsed = false }) {
  return (
    <Link to="/" className="flex items-center gap-2.5">
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-soft">
        <Briefcase size={18} />
      </span>
      {!collapsed && (
        <span className="text-lg font-extrabold tracking-tight text-slate-900 dark:text-white">
          Job<span className="text-brand-600">Connect</span>
        </span>
      )}
    </Link>
  );
}
