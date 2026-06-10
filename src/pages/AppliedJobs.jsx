import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  ClipboardList,
  Briefcase,
  Trash2,
  Calendar,
  MapPin,
  CheckCircle2,
  Clock3,
  XCircle,
} from 'lucide-react';
import toast from 'react-hot-toast';

import EmptyState from '../components/ui/EmptyState.jsx';
import Button from '../components/ui/Button.jsx';
import Badge from '../components/ui/Badge.jsx';
import CompanyLogo from '../components/jobs/CompanyLogo.jsx';
import {
  withdrawApplication,
  updateApplicationStatus,
} from '../redux/appliedJobsSlice.js';
import { formatRelativeDate } from '../utils/helpers.js';

const STATUSES = [
  { key: 'Submitted', tone: 'brand', icon: Clock3 },
  { key: 'Under Review', tone: 'amber', icon: Clock3 },
  { key: 'Interviewing', tone: 'violet', icon: Calendar },
  { key: 'Offered', tone: 'emerald', icon: CheckCircle2 },
  { key: 'Rejected', tone: 'rose', icon: XCircle },
];

export default function AppliedJobs() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const applied = useSelector((s) => s.appliedJobs.items);
  const [filter, setFilter] = useState('All');

  const list =
    filter === 'All' ? applied : applied.filter((a) => a.status === filter);

  const stats = STATUSES.map((s) => ({
    ...s,
    count: applied.filter((a) => a.status === s.key).length,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">
          <ClipboardList size={24} className="text-brand-600" /> My Applications
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Track the status of all your job applications
        </p>
      </div>

      {applied.length === 0 ? (
        <EmptyState
          icon={ClipboardList}
          title="No applications yet"
          description="Start applying to jobs and track their progress here."
          action={
            <Button onClick={() => navigate('/jobs')}>
              <Briefcase size={16} /> Browse Jobs
            </Button>
          }
        />
      ) : (
        <>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
            <button
              onClick={() => setFilter('All')}
              className={`card text-left transition ${
                filter === 'All' ? 'ring-2 ring-brand-500' : ''
              }`}
            >
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                All
              </p>
              <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">
                {applied.length}
              </p>
            </button>
            {stats.map((s) => (
              <button
                key={s.key}
                onClick={() => setFilter(s.key)}
                className={`card text-left transition ${
                  filter === s.key ? 'ring-2 ring-brand-500' : ''
                }`}
              >
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  {s.key}
                </p>
                <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">
                  {s.count}
                </p>
              </button>
            ))}
          </div>

          <div className="card overflow-hidden p-0">
            <div className="hidden border-b border-slate-200 bg-slate-50 px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500 sm:grid sm:grid-cols-[1.5fr_1fr_1fr_180px_120px] sm:gap-4 dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-400">
              <span>Position</span>
              <span>Location</span>
              <span>Applied</span>
              <span>Status</span>
              <span></span>
            </div>
            <ul className="divide-y divide-slate-100 dark:divide-slate-800">
              {list.map((app) => {
                const cur = STATUSES.find((s) => s.key === app.status);
                return (
                  <li
                    key={app.jobId}
                    className="flex flex-col gap-3 px-4 py-4 sm:grid sm:grid-cols-[1.5fr_1fr_1fr_180px_120px] sm:items-center sm:gap-4"
                  >
                    <div className="flex items-center gap-3">
                      <CompanyLogo
                        name={app.company}
                        src={app.logo}
                        size={40}
                      />
                      <div className="min-w-0">
                        <Link
                          to={`/jobs/${app.jobId}`}
                          className="block truncate font-semibold text-slate-900 hover:text-brand-600 dark:text-white"
                        >
                          {app.jobTitle}
                        </Link>
                        <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                          {app.company}
                        </p>
                      </div>
                    </div>
                    <span className="flex items-center gap-1.5 text-sm text-slate-600 dark:text-slate-300">
                      <MapPin size={14} className="text-slate-400" />
                      {app.location}
                    </span>
                    <span className="text-sm text-slate-600 dark:text-slate-300">
                      {formatRelativeDate(app.appliedAt)}
                    </span>
                    <select
                      value={app.status}
                      onChange={(e) =>
                        dispatch(
                          updateApplicationStatus({
                            jobId: app.jobId,
                            status: e.target.value,
                          }),
                        )
                      }
                      className="input max-w-[180px] py-1.5 text-xs"
                    >
                      {STATUSES.map((s) => (
                        <option key={s.key} value={s.key}>
                          {s.key}
                        </option>
                      ))}
                    </select>
                    <div className="flex items-center gap-2 sm:justify-end">
                      <Badge tone={cur?.tone || 'default'} icon={cur?.icon}>
                        {app.status}
                      </Badge>
                      <button
                        onClick={() => {
                          dispatch(withdrawApplication(app.jobId));
                          toast('Application withdrawn', { icon: '↩️' });
                        }}
                        className="rounded-lg p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20"
                        title="Withdraw application"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </>
      )}
    </div>
  );
}
