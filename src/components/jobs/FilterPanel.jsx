import { useDispatch, useSelector } from 'react-redux';
import { Filter, X, MapPin, Building2 } from 'lucide-react';

import {
  setLocation,
  setCompany,
  toggleJobType,
  setExperience,
  setSalaryRange,
  resetFilters,
} from '../../redux/filterSlice.js';
import { JOB_TYPES, EXPERIENCE_LEVELS } from '../../services/mockData.js';
import Input from '../ui/Input.jsx';
import { classNames } from '../../utils/helpers.js';

export default function FilterPanel({ className = '' }) {
  const dispatch = useDispatch();
  const filters = useSelector((s) => s.filters);

  const activeCount =
    (filters.location ? 1 : 0) +
    (filters.company ? 1 : 0) +
    filters.jobTypes.length +
    (filters.experience ? 1 : 0) +
    (filters.salaryMin > 0 || filters.salaryMax < 400000 ? 1 : 0);

  return (
    <aside className={classNames('card sticky top-20 self-start', className)}>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-base font-semibold text-slate-900 dark:text-white">
          <Filter size={16} /> Filters
          {activeCount > 0 && (
            <span className="rounded-full bg-brand-600 px-2 py-0.5 text-[10px] font-bold text-white">
              {activeCount}
            </span>
          )}
        </h3>
        {activeCount > 0 && (
          <button
            onClick={() => dispatch(resetFilters())}
            className="flex items-center gap-1 text-xs font-medium text-rose-600 hover:underline"
          >
            <X size={12} /> Clear all
          </button>
        )}
      </div>

      <div className="space-y-5">
        <Input
          label="Location"
          placeholder="e.g. San Francisco"
          value={filters.location}
          icon={<MapPin size={16} />}
          onChange={(e) => dispatch(setLocation(e.target.value))}
        />

        <Input
          label="Company"
          placeholder="e.g. Google"
          value={filters.company}
          icon={<Building2 size={16} />}
          onChange={(e) => dispatch(setCompany(e.target.value))}
        />

        <div>
          <label className="label">Job Type</label>
          <div className="flex flex-wrap gap-2">
            {JOB_TYPES.map((type) => {
              const active = filters.jobTypes.includes(type);
              return (
                <button
                  key={type}
                  onClick={() => dispatch(toggleJobType(type))}
                  className={classNames(
                    'rounded-full border px-3 py-1.5 text-xs font-medium transition',
                    active
                      ? 'border-brand-600 bg-brand-600 text-white'
                      : 'border-slate-200 text-slate-600 hover:border-brand-400 hover:text-brand-600 dark:border-slate-700 dark:text-slate-300',
                  )}
                >
                  {type}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <label className="label">Experience</label>
          <select
            className="input"
            value={filters.experience}
            onChange={(e) => dispatch(setExperience(e.target.value))}
          >
            <option value="">All Levels</option>
            {EXPERIENCE_LEVELS.map((lvl) => (
              <option key={lvl} value={lvl}>
                {lvl}
              </option>
            ))}
          </select>
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <label className="label mb-0">Salary range</label>
            <span className="text-xs font-semibold text-brand-600">
              ${(filters.salaryMin / 1000).toFixed(0)}k – $
              {(filters.salaryMax / 1000).toFixed(0)}k
            </span>
          </div>
          <div className="space-y-2">
            <input
              type="range"
              min="0"
              max="400000"
              step="10000"
              value={filters.salaryMin}
              onChange={(e) =>
                dispatch(
                  setSalaryRange({
                    min: Math.min(+e.target.value, filters.salaryMax),
                    max: filters.salaryMax,
                  }),
                )
              }
              className="w-full accent-brand-600"
            />
            <input
              type="range"
              min="0"
              max="400000"
              step="10000"
              value={filters.salaryMax}
              onChange={(e) =>
                dispatch(
                  setSalaryRange({
                    min: filters.salaryMin,
                    max: Math.max(+e.target.value, filters.salaryMin),
                  }),
                )
              }
              className="w-full accent-brand-600"
            />
          </div>
        </div>
      </div>
    </aside>
  );
}
