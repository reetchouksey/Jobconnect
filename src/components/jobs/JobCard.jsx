import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  MapPin,
  Briefcase,
  Clock,
  Bookmark,
  BookmarkCheck,
  DollarSign,
  TrendingUp,
  ExternalLink,
  CheckCircle2,
} from 'lucide-react';
import toast from 'react-hot-toast';

import CompanyLogo from './CompanyLogo.jsx';
import Badge from '../ui/Badge.jsx';
import Button from '../ui/Button.jsx';
import { saveJob, removeSavedJob } from '../../redux/savedJobsSlice.js';
import { applyJob as applyJobAction } from '../../redux/appliedJobsSlice.js';
import { formatRelativeDate, formatSalary } from '../../utils/helpers.js';
import { getCareerUrl } from '../../utils/applyUrl.js';

export default function JobCard({ job }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isAuthenticated = useSelector((s) => s.auth.isAuthenticated);
  const isSaved = useSelector((s) =>
    s.savedJobs.items.some((j) => j.id === job.id),
  );
  const isApplied = useSelector((s) =>
    s.appliedJobs.items.some((a) => a.jobId === job.id),
  );

  const isReal = Boolean(job.isReal && job.applyUrl);

  const requireLogin = (action) => {
    if (isAuthenticated) return false;
    toast.error(`Please log in to ${action}`);
    navigate('/login');
    return true;
  };

  const toggleSave = () => {
    if (requireLogin('save jobs')) return;
    if (isSaved) {
      dispatch(removeSavedJob(job.id));
      toast('Removed from saved jobs', { icon: '🗑️' });
    } else {
      dispatch(saveJob(job));
      toast.success('Job saved!');
    }
  };

  const handleApply = () => {
    if (isApplied) return;
    if (requireLogin('apply for jobs')) return;
    const url = getCareerUrl(job);
    window.open(url, '_blank', 'noopener,noreferrer');
    dispatch(
      applyJobAction({
        jobId: job.id,
        jobTitle: job.title,
        company: job.company,
        logo: job.logo,
        location: job.location,
        applyUrl: url,
        applicant: { external: true },
      }),
    );
    toast.success(`Opening ${job.company}'s careers page…`);
  };

  return (
    <article className="group card flex flex-col gap-4 transition-all hover:-translate-y-1 hover:border-brand-200 hover:shadow-glow dark:hover:border-brand-700">
      <header className="flex items-start gap-3">
        <CompanyLogo name={job.company} src={job.logo} />
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <Link
                to={`/jobs/${job.id}`}
                className="block truncate font-semibold text-slate-900 hover:text-brand-600 dark:text-white dark:hover:text-brand-300"
                title={job.title}
              >
                {job.title}
              </Link>
              <p className="flex items-center gap-1.5 truncate text-sm text-slate-500 dark:text-slate-400">
                <span className="truncate">{job.company}</span>
                {isReal && (
                  <span
                    title="Verified real job"
                    className="inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-300"
                  >
                    <CheckCircle2 size={10} />
                  </span>
                )}
              </p>
            </div>
            <button
              onClick={toggleSave}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-brand-600 dark:hover:bg-slate-800"
              aria-label={isSaved ? 'Unsave job' : 'Save job'}
              title={isSaved ? 'Unsave job' : 'Save job'}
            >
              {isSaved ? (
                <BookmarkCheck size={18} className="text-brand-600" />
              ) : (
                <Bookmark size={18} />
              )}
            </button>
          </div>
        </div>
      </header>

      <div className="flex flex-wrap gap-2">
        <Badge tone="brand" icon={Briefcase}>
          {job.type}
        </Badge>
        {(job.salaryMin || job.salaryMax) && (
          <Badge tone="emerald" icon={DollarSign}>
            {formatSalary(job.salaryMin, job.salaryMax)}
          </Badge>
        )}
        {job.trending && (
          <Badge tone="amber" icon={TrendingUp}>
            Trending
          </Badge>
        )}
        {isReal && (
          <Badge tone="violet" icon={CheckCircle2}>
            Live
          </Badge>
        )}
      </div>

      <div className="grid grid-cols-2 gap-y-2 text-sm text-slate-600 dark:text-slate-300">
        <span className="inline-flex items-center gap-1.5 truncate">
          <MapPin size={14} className="text-slate-400" />
          {job.location}
        </span>
        <span className="inline-flex items-center gap-1.5 truncate">
          <Clock size={14} className="text-slate-400" />
          {formatRelativeDate(job.postedAt)}
        </span>
        <span className="col-span-2 inline-flex items-center gap-1.5 truncate text-slate-500 dark:text-slate-400">
          {job.experience}
        </span>
      </div>

      {job.skills?.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {job.skills.slice(0, 4).map((skill) => (
            <span
              key={skill}
              className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300"
            >
              {skill}
            </span>
          ))}
          {job.skills.length > 4 && (
            <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-500 dark:bg-slate-800 dark:text-slate-400">
              +{job.skills.length - 4}
            </span>
          )}
        </div>
      )}

      <div className="mt-auto flex gap-2 pt-2">
        <Link to={`/jobs/${job.id}`} className="flex-1">
          <Button variant="secondary" className="w-full">
            View Details
          </Button>
        </Link>
        <Button
          onClick={handleApply}
          disabled={isApplied}
          className="flex-1"
          title={`Apply on ${job.company}'s careers page`}
        >
          {isApplied ? (
            'Applied'
          ) : (
            <>
              Apply <ExternalLink size={14} />
            </>
          )}
        </Button>
      </div>
    </article>
  );
}
