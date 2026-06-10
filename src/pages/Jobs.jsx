import { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import {
  Search,
  SlidersHorizontal,
  X,
  Briefcase,
  History,
  Sparkles,
  Lightbulb,
  RefreshCcw,
  Globe,
} from 'lucide-react';
import toast from 'react-hot-toast';

import JobCard from '../components/jobs/JobCard.jsx';
import JobCardSkeleton from '../components/jobs/JobCardSkeleton.jsx';
import FilterPanel from '../components/jobs/FilterPanel.jsx';
import SearchSuggestions from '../components/jobs/SearchSuggestions.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';
import Pagination from '../components/ui/Pagination.jsx';
import Button from '../components/ui/Button.jsx';
import useFilteredJobs from '../hooks/useFilteredJobs.js';
import useDebounce from '../hooks/useDebounce.js';
import { fetchJobs, refreshJobs } from '../redux/jobsSlice.js';
import {
  setSearch,
  setSortBy,
  setCompany,
  setLocation,
  toggleRealOnly,
  resetFilters,
  addSearchHistory,
  clearSearchHistory,
} from '../redux/filterSlice.js';
import {
  getJobSuggestions,
  findSimilarJobs,
  buildDidYouMean,
} from '../utils/search.js';

const PAGE_SIZE = 9;

export default function Jobs() {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const jobs = useSelector((s) => s.jobs.items);
  const loading = useSelector((s) => s.jobs.loading);
  const refreshing = useSelector((s) => s.jobs.refreshing);
  const usedSeed = useSelector((s) => s.jobs.usedSeed);
  const filters = useSelector((s) => s.filters);
  const filtered = useFilteredJobs();
  const realCount = useMemo(
    () => jobs.filter((j) => j.isReal).length,
    [jobs],
  );

  const handleRefresh = async () => {
    const t = toast.loading('Fetching latest real jobs…');
    try {
      const result = await dispatch(refreshJobs()).unwrap();
      const realFetched = result.jobs.filter((j) => j.isReal).length;
      if (realFetched > 0) {
        toast.success(`Loaded ${realFetched} live jobs from Remotive & Arbeitnow`, {
          id: t,
        });
      } else {
        toast.error('Could not reach job APIs — showing demo data', { id: t });
      }
    } catch {
      toast.error('Refresh failed', { id: t });
    }
  };

  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState(filters.search);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filterDrawer, setFilterDrawer] = useState(false);

  const debouncedSearch = useDebounce(searchInput, 300);

  useEffect(() => {
    if (jobs.length === 0) dispatch(fetchJobs());
  }, [dispatch, jobs.length]);

  useEffect(() => {
    dispatch(setSearch(debouncedSearch));
    setPage(1);
  }, [debouncedSearch, dispatch]);

  useEffect(() => {
    setPage(1);
  }, [
    filters.location,
    filters.company,
    filters.jobTypes,
    filters.experience,
    filters.salaryMin,
    filters.salaryMax,
  ]);

  useEffect(() => {
    const company = searchParams.get('company');
    if (company) dispatch(setCompany(company));
  }, [searchParams, dispatch]);

  const paginated = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, page]);

  const suggestions = useMemo(
    () => getJobSuggestions(searchInput, jobs, 5),
    [searchInput, jobs],
  );

  const similarJobs = useMemo(
    () => (filtered.length === 0 ? findSimilarJobs(filters, jobs, 6) : []),
    [filtered.length, filters, jobs],
  );

  const didYouMean = useMemo(
    () => (filtered.length === 0 ? buildDidYouMean(filters.search, jobs) : null),
    [filtered.length, filters.search, jobs],
  );

  const submitSearch = () => {
    if (debouncedSearch?.trim())
      dispatch(addSearchHistory(debouncedSearch.trim()));
    setShowSuggestions(false);
  };

  const handlePickSuggestion = (value) => {
    setSearchInput(value);
    dispatch(setSearch(value));
    dispatch(addSearchHistory(value));
    setShowSuggestions(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">
            <Briefcase size={24} className="text-brand-600" /> Browse Jobs
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {loading
              ? 'Loading jobs…'
              : `${filtered.length.toLocaleString()} ${
                  filtered.length === 1 ? 'job' : 'jobs'
                } match your filters`}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => dispatch(toggleRealOnly())}
            className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-semibold transition ${
              filters.realOnly
                ? 'border-emerald-300 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-200'
                : 'border-slate-200 bg-white text-slate-600 hover:border-emerald-300 hover:text-emerald-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300'
            }`}
            title="Toggle live job postings only"
          >
            <Globe size={14} />
            Live jobs only
            {realCount > 0 && (
              <span className="rounded-full bg-emerald-600 px-1.5 py-0.5 text-[10px] font-bold text-white">
                {realCount}
              </span>
            )}
          </button>
          <Button
            variant="secondary"
            onClick={handleRefresh}
            disabled={refreshing}
            title="Fetch latest jobs from Remotive & Arbeitnow"
          >
            <RefreshCcw
              size={14}
              className={refreshing ? 'animate-spin' : ''}
            />
            {refreshing ? 'Refreshing…' : 'Refresh'}
          </Button>
          <select
            value={filters.sortBy}
            onChange={(e) => dispatch(setSortBy(e.target.value))}
            className="input max-w-[180px]"
          >
            <option value="recent">Most recent</option>
            <option value="salary-high">Salary (high → low)</option>
            <option value="salary-low">Salary (low → high)</option>
            <option value="company">Company A → Z</option>
          </select>
          <Button
            variant="secondary"
            onClick={() => setFilterDrawer(true)}
            className="lg:hidden"
          >
            <SlidersHorizontal size={16} /> Filters
          </Button>
        </div>
      </div>

      {usedSeed && !loading && (
        <div className="card flex flex-col gap-3 border-amber-200 bg-amber-50 p-4 sm:flex-row sm:items-center sm:justify-between dark:border-amber-900/50 dark:bg-amber-900/20">
          <div className="flex items-start gap-2">
            <span className="mt-0.5 text-amber-600 dark:text-amber-300">
              <Lightbulb size={16} />
            </span>
            <p className="text-sm text-amber-800 dark:text-amber-100">
              Showing demo jobs. Click <strong>Refresh</strong> to pull{' '}
              <strong>real, live jobs</strong> from Remotive &amp; Arbeitnow.
            </p>
          </div>
          <Button variant="secondary" onClick={handleRefresh} disabled={refreshing}>
            <RefreshCcw size={14} className={refreshing ? 'animate-spin' : ''} />
            Load real jobs
          </Button>
        </div>
      )}

      <div className="card flex flex-col gap-3">
        <div className="relative">
          <Search
            size={18}
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            value={searchInput}
            onChange={(e) => {
              setSearchInput(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') submitSearch();
              if (e.key === 'Escape') setShowSuggestions(false);
            }}
            placeholder="Search by job title, company, skill, or location"
            className="input pl-10"
          />
          {searchInput && (
            <button
              onClick={() => {
                setSearchInput('');
                setShowSuggestions(false);
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"
              aria-label="Clear search"
            >
              <X size={14} />
            </button>
          )}

          <SearchSuggestions
            open={showSuggestions}
            onClose={() => setShowSuggestions(false)}
            onPick={handlePickSuggestion}
            suggestions={suggestions}
            recent={searchInput ? [] : filters.searchHistory}
          />
        </div>
        {filters.searchHistory.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="flex items-center gap-1 text-xs font-semibold text-slate-500">
              <History size={12} /> Recent searches:
            </span>
            {filters.searchHistory.map((term) => (
              <button
                key={term}
                onClick={() => setSearchInput(term)}
                className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700 hover:bg-brand-50 hover:text-brand-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-brand-900/30"
              >
                {term}
              </button>
            ))}
            <button
              onClick={() => dispatch(clearSearchHistory())}
              className="text-xs font-medium text-rose-500 hover:underline"
            >
              Clear
            </button>
          </div>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <FilterPanel className="hidden lg:block" />

        <div>
          {loading ? (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <JobCardSkeleton key={i} />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="space-y-6">
              <div className="card border-dashed text-center">
                <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-300">
                  <Lightbulb size={24} />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                  No exact matches found
                </h3>
                <p className="mx-auto mt-2 max-w-md text-sm text-slate-500 dark:text-slate-400">
                  We couldn&apos;t find jobs matching your filters. Try one of the
                  suggestions below or relax your search.
                </p>

                {didYouMean && (
                  <p className="mt-4 text-sm text-slate-700 dark:text-slate-200">
                    Did you mean{' '}
                    <button
                      onClick={() => handlePickSuggestion(didYouMean)}
                      className="font-semibold text-brand-600 underline-offset-2 hover:underline"
                    >
                      &ldquo;{didYouMean}&rdquo;
                    </button>
                    ?
                  </p>
                )}

                <SuggestionChips
                  suggestions={suggestions}
                  onPick={handlePickSuggestion}
                  onPickLocation={(loc) => {
                    dispatch(setLocation(loc));
                    setShowSuggestions(false);
                  }}
                />

                <div className="mt-5 flex flex-wrap justify-center gap-2">
                  <Button
                    variant="secondary"
                    onClick={() => {
                      dispatch(resetFilters());
                      setSearchInput('');
                    }}
                  >
                    Clear all filters
                  </Button>
                </div>
              </div>

              {similarJobs.length > 0 && (
                <section>
                  <h3 className="mb-4 flex items-center gap-2 text-base font-semibold text-slate-900 dark:text-white">
                    <Sparkles size={16} className="text-brand-600" />
                    You might also like
                  </h3>
                  <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                    {similarJobs.map((job) => (
                      <JobCard key={job.id} job={job} />
                    ))}
                  </div>
                </section>
              )}

              {similarJobs.length === 0 && (
                <EmptyState
                  title="Nothing similar either"
                  description="Try clearing your filters and starting from scratch."
                  action={
                    <Button
                      onClick={() => {
                        dispatch(resetFilters());
                        setSearchInput('');
                      }}
                    >
                      Reset all
                    </Button>
                  }
                />
              )}
            </div>
          ) : (
            <>
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {paginated.map((job) => (
                  <JobCard key={job.id} job={job} />
                ))}
              </div>
              <Pagination
                page={page}
                total={filtered.length}
                pageSize={PAGE_SIZE}
                onChange={(p) => {
                  setPage(p);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            </>
          )}
        </div>
      </div>

      {filterDrawer && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            onClick={() => setFilterDrawer(false)}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          />
          <div className="absolute inset-y-0 right-0 w-full max-w-sm overflow-y-auto bg-slate-50 p-4 dark:bg-slate-950">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                Filters
              </h3>
              <button
                onClick={() => setFilterDrawer(false)}
                className="rounded-lg p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X size={20} />
              </button>
            </div>
            <FilterPanel />
            <div className="mt-4">
              <Button className="w-full" onClick={() => setFilterDrawer(false)}>
                Show {filtered.length} jobs
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SuggestionChips({ suggestions, onPick, onPickLocation }) {
  const groups = [
    { label: 'Try these titles', items: suggestions.titles, onClick: onPick },
    { label: 'Companies', items: suggestions.companies, onClick: onPick },
    { label: 'Skills', items: suggestions.skills, onClick: onPick },
    {
      label: 'Locations',
      items: suggestions.locations,
      onClick: onPickLocation,
    },
  ].filter((g) => g.items?.length);

  if (groups.length === 0) return null;

  return (
    <div className="mt-5 space-y-3 text-left">
      {groups.map((g) => (
        <div key={g.label}>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            {g.label}
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {g.items.map((item) => (
              <button
                key={item}
                onClick={() => g.onClick(item)}
                className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:border-brand-400 hover:bg-brand-50 hover:text-brand-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-brand-900/30"
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
