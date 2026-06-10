import { useState, useRef, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Menu,
  Sun,
  Moon,
  Bell,
  Search,
  LogOut,
  User as UserIcon,
  Settings,
  ChevronDown,
} from 'lucide-react';
import toast from 'react-hot-toast';

import useTheme from '../../hooks/useTheme.js';
import { logout } from '../../redux/authSlice.js';
import { setSearch, addSearchHistory } from '../../redux/filterSlice.js';
import { getInitials } from '../../utils/helpers.js';
import { getJobSuggestions } from '../../utils/search.js';
import SearchSuggestions from '../jobs/SearchSuggestions.jsx';

export default function Navbar({ onOpenSidebar }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearchVal] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const ref = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isDark, toggle } = useTheme();
  const user = useSelector((s) => s.auth.user);
  const isAuthenticated = useSelector((s) => s.auth.isAuthenticated);
  const jobs = useSelector((s) => s.jobs.items);
  const searchHistory = useSelector((s) => s.filters.searchHistory);

  const suggestions = useMemo(
    () => getJobSuggestions(search, jobs, 5),
    [search, jobs],
  );

  useEffect(() => {
    const onClickAway = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener('mousedown', onClickAway);
    return () => document.removeEventListener('mousedown', onClickAway);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!search.trim()) return;
    dispatch(setSearch(search.trim()));
    dispatch(addSearchHistory(search.trim()));
    setShowSuggestions(false);
    navigate('/jobs');
  };

  const pickSuggestion = (value) => {
    setSearchVal(value);
    dispatch(setSearch(value));
    dispatch(addSearchHistory(value));
    setShowSuggestions(false);
    navigate('/jobs');
  };

  const handleLogout = () => {
    dispatch(logout());
    toast.success('Logged out successfully');
    setMenuOpen(false);
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/80 backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
      <div className="flex h-16 items-center gap-3 px-4 sm:px-6">
        <button
          onClick={onOpenSidebar}
          className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden dark:text-slate-300 dark:hover:bg-slate-800"
          aria-label="Open menu"
        >
          <Menu size={22} />
        </button>

        <form onSubmit={handleSearch} className="flex-1 max-w-xl">
          <div className="relative">
            <Search
              size={18}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="search"
              value={search}
              onChange={(e) => {
                setSearchVal(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              placeholder="Search jobs, companies, skills…"
              className="input pl-10"
            />
            <SearchSuggestions
              open={showSuggestions}
              onClose={() => setShowSuggestions(false)}
              onPick={pickSuggestion}
              suggestions={suggestions}
              recent={search ? [] : searchHistory}
            />
          </div>
        </form>

        <div className="ml-auto flex items-center gap-2">
          <button
            onClick={toggle}
            className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
            aria-label="Toggle theme"
            title="Toggle theme"
          >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          <button
            className="relative rounded-lg p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
            aria-label="Notifications"
          >
            <Bell size={20} />
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-slate-900" />
          </button>

          {isAuthenticated ? (
            <div ref={ref} className="relative">
              <button
                onClick={() => setMenuOpen((o) => !o)}
                className="flex items-center gap-2 rounded-xl border border-transparent bg-slate-50 px-2.5 py-1.5 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 text-xs font-bold text-white">
                  {getInitials(user?.name || 'U')}
                </span>
                <span className="hidden text-left sm:block">
                  <span className="block text-xs text-slate-500 dark:text-slate-400">
                    Hello,
                  </span>
                  <span className="block text-sm font-semibold text-slate-900 dark:text-white">
                    {user?.name?.split(' ')[0] || 'User'}
                  </span>
                </span>
                <ChevronDown size={16} className="text-slate-500" />
              </button>

              {menuOpen && (
                <div className="absolute right-0 top-12 w-56 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl animate-fade-in dark:border-slate-700 dark:bg-slate-900">
                  <div className="border-b border-slate-100 px-4 py-3 dark:border-slate-800">
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">
                      {user?.name}
                    </p>
                    <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                      {user?.email}
                    </p>
                  </div>
                  <Link
                    to="/profile"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800"
                  >
                    <UserIcon size={16} /> My Profile
                  </Link>
                  <Link
                    to="/recruiter"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800"
                  >
                    <Settings size={16} /> Recruiter Panel
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 border-t border-slate-100 px-4 py-2.5 text-sm text-rose-600 hover:bg-rose-50 dark:border-slate-800 dark:hover:bg-rose-900/20"
                  >
                    <LogOut size={16} /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login" className="btn-ghost px-3 py-1.5 text-sm">
                Login
              </Link>
              <Link to="/signup" className="btn-primary px-3 py-1.5 text-sm">
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
