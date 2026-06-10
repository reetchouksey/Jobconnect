import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  LayoutDashboard,
  Briefcase,
  Bookmark,
  ClipboardList,
  User,
  Building2,
  X,
  Sparkles,
} from 'lucide-react';

import Logo from './Logo.jsx';
import { classNames } from '../../utils/helpers.js';

const NAV = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/jobs', label: 'Browse Jobs', icon: Briefcase },
  { to: '/saved', label: 'Saved Jobs', icon: Bookmark, badgeKey: 'saved' },
  { to: '/applied', label: 'Applications', icon: ClipboardList, badgeKey: 'applied' },
  { to: '/profile', label: 'My Profile', icon: User, auth: true },
  { to: '/recruiter', label: 'Recruiter', icon: Building2, auth: true },
];

export default function Sidebar({ open, onClose }) {
  const savedCount = useSelector((s) => s.savedJobs.items.length);
  const appliedCount = useSelector((s) => s.appliedJobs.items.length);
  const isAuthenticated = useSelector((s) => s.auth.isAuthenticated);

  const counts = { saved: savedCount, applied: appliedCount };

  return (
    <>
      <div
        onClick={onClose}
        className={classNames(
          'fixed inset-0 z-30 bg-slate-900/60 backdrop-blur-sm lg:hidden',
          open ? 'block' : 'hidden',
        )}
      />
      <aside
        className={classNames(
          'fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-slate-200 bg-white transition-transform dark:border-slate-800 dark:bg-slate-900',
          'lg:static lg:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
        )}
      >
        <div className="flex h-16 items-center justify-between border-b border-slate-200 px-5 dark:border-slate-800">
          <Logo />
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 lg:hidden dark:hover:bg-slate-800"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          <p className="px-3 pb-2 pt-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Navigation
          </p>
          {NAV.map((item) => {
            if (item.auth && !isAuthenticated) return null;
            const Icon = item.icon;
            const badge = item.badgeKey ? counts[item.badgeKey] : 0;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={onClose}
                className={({ isActive }) =>
                  classNames(
                    'flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium transition',
                    isActive
                      ? 'bg-brand-50 text-brand-700 dark:bg-brand-900/30 dark:text-brand-200'
                      : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800',
                  )
                }
              >
                <span className="flex items-center gap-3">
                  <Icon size={18} />
                  {item.label}
                </span>
                {badge > 0 && (
                  <span className="rounded-full bg-brand-600 px-2 py-0.5 text-[10px] font-bold text-white">
                    {badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>

        <div className="m-4 rounded-2xl bg-gradient-to-br from-brand-400 to-brand-700 p-5 text-white shadow-glow">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider opacity-90">
            <Sparkles size={14} /> Pro Tip
          </div>
          <p className="mt-2 text-sm font-medium leading-snug">
            Complete your profile to get matched with the best roles.
          </p>
          <NavLink
            to="/profile"
            onClick={onClose}
            className="mt-3 inline-block rounded-lg bg-white/15 px-3 py-1.5 text-xs font-semibold backdrop-blur hover:bg-white/25"
          >
            Update profile →
          </NavLink>
        </div>
      </aside>
    </>
  );
}
