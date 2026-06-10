import { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Search,
  MapPin,
  Briefcase,
  Bookmark,
  ClipboardList,
  Building2,
  TrendingUp,
  Sparkles,
  ArrowRight,
  Clock,
  History,
} from 'lucide-react';

import StatCard from '../components/ui/StatCard.jsx';
import JobCard from '../components/jobs/JobCard.jsx';
import JobCardSkeleton from '../components/jobs/JobCardSkeleton.jsx';
import CompanyLogo from '../components/jobs/CompanyLogo.jsx';
import SearchSuggestions from '../components/jobs/SearchSuggestions.jsx';
import { fetchJobs } from '../redux/jobsSlice.js';
import {
  setSearch,
  setLocation,
  addSearchHistory,
} from '../redux/filterSlice.js';
import { seedCompanies } from '../services/mockData.js';
import {
  getJobSuggestions,
  getLocationSuggestions,
} from '../utils/search.js';

export default function Home() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const jobs = useSelector((s) => s.jobs.items);
  const loading = useSelector((s) => s.jobs.loading);
  const savedCount = useSelector((s) => s.savedJobs.items.length);
  const appliedCount = useSelector((s) => s.appliedJobs.items.length);
  const recent = useSelector((s) => s.recent.items);
  const user = useSelector((s) => s.auth.user);

  const [query, setQuery] = useState('');
  const [loc, setLoc] = useState('');
  const [showQuerySuggestions, setShowQuerySuggestions] = useState(false);
  const [showLocSuggestions, setShowLocSuggestions] = useState(false);
  const searchHistory = useSelector((s) => s.filters.searchHistory);

  useEffect(() => {
    if (jobs.length === 0) dispatch(fetchJobs());
  }, [dispatch, jobs.length]);

  const querySuggestions = useMemo(
    () => getJobSuggestions(query, jobs, 5),
    [query, jobs],
  );
  const locationSuggestions = useMemo(
    () => getLocationSuggestions(loc, jobs, 6),
    [loc, jobs],
  );

  const trending = jobs.filter((j) => j.trending).slice(0, 6);
  const recommended = jobs.slice(0, 6);
  const companies = seedCompanies.slice(0, 6);

  const stats = [
    {
      label: 'Total Jobs',
      value: jobs.length.toLocaleString(),
      icon: Briefcase,
      tone: 'brand',
      trend: '+12 this week',
    },
    {
      label: 'Applied Jobs',
      value: appliedCount,
      icon: ClipboardList,
      tone: 'emerald',
      trend: appliedCount > 0 ? 'Keep going!' : 'Start applying',
    },
    {
      label: 'Saved Jobs',
      value: savedCount,
      icon: Bookmark,
      tone: 'amber',
      trend: savedCount > 0 ? 'Review them' : 'Save favorites',
    },
    {
      label: 'Companies Hiring',
      value: seedCompanies.length,
      icon: Building2,
      tone: 'violet',
      trend: 'Top brands',
    },
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    dispatch(setSearch(query));
    dispatch(setLocation(loc));
    if (query) dispatch(addSearchHistory(query));
    navigate('/jobs');
  };

  return (
    <div className="space-y-10">
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-300 via-brand-500 to-brand-700 p-8 text-white shadow-glow sm:p-12">
        <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/30 blur-3xl" />
        <div className="absolute -bottom-20 -left-10 h-72 w-72 rounded-full bg-brand-200/50 blur-3xl" />
        <div className="relative">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur">
            <Sparkles size={12} /> {jobs.length}+ open positions
          </span>
          <h1 className="mt-4 max-w-3xl text-4xl font-extrabold leading-tight sm:text-5xl">
            {user ? `Hello ${user.name?.split(' ')[0]}, find your next opportunity.` : 'Find the job built for you.'}
          </h1>
          <p className="mt-3 max-w-xl text-base text-brand-100 sm:text-lg">
            Browse, save, and apply to thousands of jobs from leading companies.
          </p>

          <form
            onSubmit={handleSearch}
            className="mt-8 flex flex-col gap-3 rounded-2xl bg-white/10 p-3 backdrop-blur sm:flex-row sm:items-center"
          >
            <div className="relative flex-1">
              <Search
                size={18}
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-white/60"
              />
              <input
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setShowQuerySuggestions(true);
                }}
                onFocus={() => setShowQuerySuggestions(true)}
                placeholder="Job title, keyword, company"
                className="w-full rounded-xl border-0 bg-white/95 px-10 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-white"
              />
              <SearchSuggestions
                open={showQuerySuggestions}
                onClose={() => setShowQuerySuggestions(false)}
                onPick={(v) => {
                  setQuery(v);
                  setShowQuerySuggestions(false);
                }}
                suggestions={querySuggestions}
                recent={query ? [] : searchHistory}
              />
            </div>
            <div className="relative flex-1">
              <MapPin
                size={18}
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-white/60"
              />
              <input
                value={loc}
                onChange={(e) => {
                  setLoc(e.target.value);
                  setShowLocSuggestions(true);
                }}
                onFocus={() => setShowLocSuggestions(true)}
                placeholder="Location or remote"
                className="w-full rounded-xl border-0 bg-white/95 px-10 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-white"
              />
              <SearchSuggestions
                open={showLocSuggestions && loc.length > 0}
                onClose={() => setShowLocSuggestions(false)}
                onPick={(v) => {
                  setLoc(v);
                  setShowLocSuggestions(false);
                }}
                suggestions={{ locations: locationSuggestions }}
                variant="location"
              />
            </div>
            <button
              type="submit"
              className="rounded-xl bg-white px-6 py-3 text-sm font-bold text-brand-700 shadow-soft transition hover:bg-brand-50"
            >
              Search Jobs
            </button>
          </form>

          <div className="mt-5 flex flex-wrap items-center gap-2 text-xs text-brand-100">
            <span className="font-semibold uppercase tracking-wider">Popular:</span>
            {['Frontend', 'React', 'Designer', 'Remote', 'Data Scientist'].map(
              (term) => (
                <button
                  key={term}
                  onClick={() => {
                    setQuery(term);
                    dispatch(setSearch(term));
                    dispatch(addSearchHistory(term));
                    navigate('/jobs');
                  }}
                  className="rounded-full border border-white/20 px-3 py-1 hover:bg-white/10"
                >
                  {term}
                </button>
              ),
            )}
          </div>
        </div>
      </section>

      <section>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s) => (
            <StatCard key={s.label} {...s} />
          ))}
        </div>
      </section>

      {recent.length > 0 && (
        <section>
          <SectionHeader
            icon={History}
            title="Recently viewed"
            actionLabel="View all"
            onAction={() => navigate('/jobs')}
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {recent.slice(0, 4).map((job) => (
              <Link
                key={job.id}
                to={`/jobs/${job.id}`}
                className="card flex items-center gap-3 transition hover:border-brand-300 hover:shadow-glow"
              >
                <CompanyLogo name={job.company} src={job.logo} size={44} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">
                    {job.title}
                  </p>
                  <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                    {job.company} · {job.location}
                  </p>
                </div>
                <Clock size={14} className="text-slate-400" />
              </Link>
            ))}
          </div>
        </section>
      )}

      <section>
        <SectionHeader
          icon={TrendingUp}
          title="Trending jobs"
          subtitle="Most-applied roles this week"
          actionLabel="See all jobs"
          onAction={() => navigate('/jobs')}
        />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {loading
            ? Array.from({ length: 3 }).map((_, i) => <JobCardSkeleton key={i} />)
            : trending.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
        </div>
      </section>

      <section>
        <SectionHeader
          icon={Sparkles}
          title="Recommended for you"
          subtitle="Based on your activity"
          actionLabel="Explore more"
          onAction={() => navigate('/jobs')}
        />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {loading
            ? Array.from({ length: 3 }).map((_, i) => <JobCardSkeleton key={i} />)
            : recommended.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
        </div>
      </section>

      <section>
        <SectionHeader
          icon={Building2}
          title="Top companies hiring"
          subtitle="Discover companies with active openings"
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {companies.map((c) => (
            <button
              key={c.name}
              onClick={() => navigate(`/jobs?company=${encodeURIComponent(c.name)}`)}
              className="card flex items-center gap-4 text-left transition hover:border-brand-300 hover:shadow-glow"
            >
              <CompanyLogo name={c.name} src={c.logo} size={56} />
              <div className="flex-1">
                <p className="font-semibold text-slate-900 dark:text-white">
                  {c.name}
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {c.openings} open position{c.openings === 1 ? '' : 's'}
                </p>
              </div>
              <ArrowRight size={18} className="text-slate-400" />
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}

function SectionHeader({ icon: Icon, title, subtitle, actionLabel, onAction }) {
  return (
    <div className="mb-5 flex items-end justify-between gap-4">
      <div>
        <h2 className="flex items-center gap-2 text-2xl font-bold text-slate-900 dark:text-white">
          {Icon && <Icon size={22} className="text-brand-600" />}
          {title}
        </h2>
        {subtitle && (
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {subtitle}
          </p>
        )}
      </div>
      {actionLabel && (
        <button
          onClick={onAction}
          className="hidden items-center gap-1 text-sm font-semibold text-brand-600 hover:underline sm:inline-flex"
        >
          {actionLabel} <ArrowRight size={14} />
        </button>
      )}
    </div>
  );
}
