import { useEffect, useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Building2,
  Plus,
  Pencil,
  Trash2,
  Users,
  Eye,
  Briefcase,
  Search,
  TrendingUp,
} from 'lucide-react';
import toast from 'react-hot-toast';

import Button from '../components/ui/Button.jsx';
import Badge from '../components/ui/Badge.jsx';
import StatCard from '../components/ui/StatCard.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';
import CompanyLogo from '../components/jobs/CompanyLogo.jsx';
import { fetchJobs, deleteJob } from '../redux/jobsSlice.js';
import { formatRelativeDate, formatSalary } from '../utils/helpers.js';

export default function Recruiter() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const jobs = useSelector((s) => s.jobs.items);
  const applied = useSelector((s) => s.appliedJobs.items);
  const user = useSelector((s) => s.auth.user);
  const [query, setQuery] = useState('');

  useEffect(() => {
    if (jobs.length === 0) dispatch(fetchJobs());
  }, [dispatch, jobs.length]);

  const myJobs = useMemo(
    () =>
      jobs.filter(
        (j) => j.postedBy === user?.id || (j.postedBy !== 'system' && !j.postedBy),
      ),
    [jobs, user],
  );

  const filtered = myJobs.filter(
    (j) =>
      !query ||
      j.title.toLowerCase().includes(query.toLowerCase()) ||
      j.company.toLowerCase().includes(query.toLowerCase()),
  );

  const totalApplicants = applied.filter((a) =>
    myJobs.some((j) => j.id === a.jobId),
  ).length;

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this job posting? This cannot be undone.'))
      return;
    await dispatch(deleteJob(id));
    toast.success('Job deleted');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">
            <Building2 size={24} className="text-brand-600" /> Recruiter Dashboard
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Post jobs, manage listings and review applicants in one place.
          </p>
        </div>
        <Button onClick={() => navigate('/recruiter/post')}>
          <Plus size={16} /> Post a New Job
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          icon={Briefcase}
          label="My Job Posts"
          value={myJobs.length}
          tone="brand"
        />
        <StatCard
          icon={Users}
          label="Total Applicants"
          value={totalApplicants}
          tone="emerald"
        />
        <StatCard
          icon={TrendingUp}
          label="Trending Posts"
          value={myJobs.filter((j) => j.trending).length}
          tone="amber"
        />
      </div>

      <div className="card">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
            My Job Postings
          </h2>
          <div className="relative max-w-xs">
            <Search
              size={16}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search my jobs"
              className="input pl-9"
            />
          </div>
        </div>

        {myJobs.length === 0 ? (
          <EmptyState
            icon={Briefcase}
            title="You haven't posted any jobs yet"
            description="Create your first job posting to start receiving applications."
            action={
              <Button onClick={() => navigate('/recruiter/post')}>
                <Plus size={16} /> Post your first job
              </Button>
            }
          />
        ) : filtered.length === 0 ? (
          <p className="py-6 text-center text-sm text-slate-500">
            No jobs match your search.
          </p>
        ) : (
          <ul className="divide-y divide-slate-100 dark:divide-slate-800">
            {filtered.map((job) => {
              const applicants = applied.filter((a) => a.jobId === job.id);
              return (
                <li
                  key={job.id}
                  className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center"
                >
                  <CompanyLogo name={job.company} src={job.logo} size={48} />
                  <div className="min-w-0 flex-1">
                    <Link
                      to={`/jobs/${job.id}`}
                      className="block truncate font-semibold text-slate-900 hover:text-brand-600 dark:text-white"
                    >
                      {job.title}
                    </Link>
                    <p className="truncate text-sm text-slate-500 dark:text-slate-400">
                      {job.company} · {job.location}
                    </p>
                    <div className="mt-1.5 flex flex-wrap gap-1.5">
                      <Badge tone="brand">{job.type}</Badge>
                      <Badge tone="emerald">
                        {formatSalary(job.salaryMin, job.salaryMax)}
                      </Badge>
                      <Badge tone="default">
                        Posted {formatRelativeDate(job.postedAt)}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link
                      to={`/recruiter/applicants/${job.id}`}
                      className="btn-secondary px-3 py-1.5 text-xs"
                    >
                      <Users size={14} />
                      {applicants.length} applicant
                      {applicants.length === 1 ? '' : 's'}
                    </Link>
                    <Link
                      to={`/jobs/${job.id}`}
                      className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                      title="View"
                    >
                      <Eye size={16} />
                    </Link>
                    <Link
                      to={`/recruiter/edit/${job.id}`}
                      className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                      title="Edit"
                    >
                      <Pencil size={16} />
                    </Link>
                    <button
                      onClick={() => handleDelete(job.id)}
                      className="rounded-lg p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
