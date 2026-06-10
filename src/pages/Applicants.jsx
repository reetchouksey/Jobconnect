import { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Users,
  ArrowLeft,
  Mail,
  Phone,
  FileText,
  Calendar,
  ExternalLink,
} from 'lucide-react';
import toast from 'react-hot-toast';

import EmptyState from '../components/ui/EmptyState.jsx';
import Badge from '../components/ui/Badge.jsx';
import CompanyLogo from '../components/jobs/CompanyLogo.jsx';
import { fetchJobs } from '../redux/jobsSlice.js';
import { api } from '../services/api.js';
import { formatRelativeDate, getInitials } from '../utils/helpers.js';

const STATUSES = [
  'Submitted',
  'Under Review',
  'Interviewing',
  'Offered',
  'Rejected',
];

export default function Applicants() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const jobs = useSelector((s) => s.jobs.items);
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (jobs.length === 0) dispatch(fetchJobs());
  }, [dispatch, jobs.length]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    api
      .getJobApplicants(id)
      .then((list) => {
        if (!cancelled) setApplicants(list || []);
      })
      .catch((err) => {
        if (cancelled) return;
        toast.error(err.message || 'Failed to load applicants');
      })
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [id]);

  const job = useMemo(() => jobs.find((j) => j.id === id), [jobs, id]);

  const updateStatus = async (jobId, status) => {
    try {
      await api.updateApplicationStatus(jobId, status);
      setApplicants((prev) =>
        prev.map((a) => (a.jobId === jobId ? { ...a, status } : a)),
      );
      toast.success(`Status updated to "${status}"`);
    } catch (e) {
      toast.error(e.message || 'Failed to update status');
    }
  };

  if (!job && jobs.length) {
    return (
      <EmptyState
        title="Job not found"
        action={
          <button onClick={() => navigate('/recruiter')} className="btn-primary">
            Back to dashboard
          </button>
        }
      />
    );
  }

  return (
    <div className="space-y-6">
      <Link
        to="/recruiter"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-brand-600"
      >
        <ArrowLeft size={16} /> Back to dashboard
      </Link>

      {job && (
        <div className="card flex flex-col gap-4 sm:flex-row sm:items-center">
          <CompanyLogo name={job.company} src={job.logo} size={56} />
          <div className="flex-1">
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">
              {job.title}
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {job.company} · {job.location}
            </p>
          </div>
          <Badge tone="brand" icon={Users}>
            {applicants.length} applicant{applicants.length === 1 ? '' : 's'}
          </Badge>
        </div>
      )}

      {loading ? (
        <div className="card text-center text-sm text-slate-500">
          Loading applicants…
        </div>
      ) : applicants.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No applicants yet"
          description="Once candidates apply, they'll appear here."
        />
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {applicants.map((app) => {
            const a = app.applicant || {};
            const name = a.name || app.userName || 'Applicant';
            const email = a.email || app.userEmail || '';
            return (
              <div
                key={`${app.jobId}-${app.appliedAt}-${app.id || ''}`}
                className="card space-y-4"
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 font-bold text-white">
                    {getInitials(name)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-slate-900 dark:text-white">
                      {name}
                    </p>
                    <p className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                      <Calendar size={12} /> Applied {formatRelativeDate(app.appliedAt)}
                    </p>
                    {a.external && (
                      <p className="mt-1 inline-flex items-center gap-1 text-[11px] font-semibold text-brand-600">
                        <ExternalLink size={11} /> External application
                      </p>
                    )}
                  </div>
                  <select
                    value={app.status}
                    onChange={(e) => updateStatus(app.jobId, e.target.value)}
                    className="input max-w-[150px] py-1.5 text-xs"
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 gap-2 text-sm">
                  {email && (
                    <a
                      href={`mailto:${email}`}
                      className="inline-flex items-center gap-2 text-slate-600 hover:text-brand-600 dark:text-slate-300"
                    >
                      <Mail size={14} className="text-slate-400" /> {email}
                    </a>
                  )}
                  {a.phone && (
                    <a
                      href={`tel:${a.phone}`}
                      className="inline-flex items-center gap-2 text-slate-600 hover:text-brand-600 dark:text-slate-300"
                    >
                      <Phone size={14} className="text-slate-400" /> {a.phone}
                    </a>
                  )}
                  {a.resumeName && (
                    <span className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-300">
                      <FileText size={14} className="text-slate-400" />
                      {a.resumeName}
                    </span>
                  )}
                </div>

                {a.coverLetter && (
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Cover Letter
                    </p>
                    <p className="mt-1.5 rounded-xl bg-slate-50 p-3 text-sm leading-relaxed text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                      {a.coverLetter}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
