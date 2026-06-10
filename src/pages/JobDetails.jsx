import { useEffect, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  MapPin,
  Briefcase,
  Clock,
  DollarSign,
  Bookmark,
  BookmarkCheck,
  Share2,
  ArrowLeft,
  Building2,
  CheckCircle2,
  TrendingUp,
  ExternalLink,
} from 'lucide-react';
import toast from 'react-hot-toast';

import CompanyLogo from '../components/jobs/CompanyLogo.jsx';
import JobCard from '../components/jobs/JobCard.jsx';
import Button from '../components/ui/Button.jsx';
import Badge from '../components/ui/Badge.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';

import { fetchJobs } from '../redux/jobsSlice.js';
import { saveJob, removeSavedJob } from '../redux/savedJobsSlice.js';
import { applyJob as applyJobAction } from '../redux/appliedJobsSlice.js';
import { addRecentlyViewed } from '../redux/recentSlice.js';
import { formatRelativeDate, formatSalary } from '../utils/helpers.js';
import { getCareerUrl, getCareerHostname } from '../utils/applyUrl.js';

export default function JobDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const jobs = useSelector((s) => s.jobs.items);
  const isSaved = useSelector((s) =>
    s.savedJobs.items.some((j) => j.id === id),
  );
  const isApplied = useSelector((s) =>
    s.appliedJobs.items.some((a) => a.jobId === id),
  );

  const job = useMemo(() => jobs.find((j) => j.id === id), [jobs, id]);

  useEffect(() => {
    if (jobs.length === 0) dispatch(fetchJobs());
  }, [dispatch, jobs.length]);

  useEffect(() => {
    if (job) dispatch(addRecentlyViewed(job));
  }, [job, dispatch]);

  if (jobs.length === 0) {
    return (
      <div className="space-y-4">
        <div className="skeleton h-32 w-full rounded-2xl" />
        <div className="skeleton h-96 w-full rounded-2xl" />
      </div>
    );
  }

  if (!job) {
    return (
      <EmptyState
        title="Job not found"
        description="This job may have been removed or doesn't exist."
        action={
          <Button onClick={() => navigate('/jobs')}>Browse all jobs</Button>
        }
      />
    );
  }

  const related = jobs
    .filter(
      (j) =>
        j.id !== job.id && (j.company === job.company || j.type === job.type),
    )
    .slice(0, 3);

  const handleSaveToggle = () => {
    if (isSaved) {
      dispatch(removeSavedJob(job.id));
      toast('Removed from saved jobs', { icon: '🗑️' });
    } else {
      dispatch(saveJob(job));
      toast.success('Job saved!');
    }
  };

  const isReal = Boolean(job?.isReal && job?.applyUrl);
  const careerUrl = getCareerUrl(job);
  const careerHost = getCareerHostname(job);

  const handleApply = () => {
    if (isApplied) return;
    window.open(careerUrl, '_blank', 'noopener,noreferrer');
    dispatch(
      applyJobAction({
        jobId: job.id,
        jobTitle: job.title,
        company: job.company,
        logo: job.logo,
        location: job.location,
        applyUrl: careerUrl,
        applicant: { external: true },
      }),
    );
    toast.success(`Opening ${job.company}'s careers page…`);
  };

  const handleShare = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: job.title, url });
      } else {
        await navigator.clipboard.writeText(url);
        toast.success('Link copied to clipboard');
      }
    } catch {
      /* cancelled */
    }
  };

  return (
    <div className="space-y-6">
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-brand-600"
      >
        <ArrowLeft size={16} /> Back
      </button>

      <header className="card overflow-hidden">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
          <CompanyLogo name={job.company} src={job.logo} size={72} />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">
                  {job.title}
                </h1>
                <p className="mt-1 flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                  <Building2 size={14} /> {job.company} · {job.location}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="secondary" onClick={handleShare}>
                  <Share2 size={16} /> Share
                </Button>
                <Button variant="secondary" onClick={handleSaveToggle}>
                  {isSaved ? (
                    <>
                      <BookmarkCheck size={16} className="text-brand-600" /> Saved
                    </>
                  ) : (
                    <>
                      <Bookmark size={16} /> Save
                    </>
                  )}
                </Button>
                <Button onClick={handleApply} disabled={isApplied} title={`Apply on ${careerHost}`}>
                  {isApplied ? (
                    'Applied'
                  ) : (
                    <>
                      Apply on {job.company} <ExternalLink size={14} />
                    </>
                  )}
                </Button>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <Badge tone="brand" icon={Briefcase}>
                {job.type}
              </Badge>
              <Badge tone="emerald" icon={DollarSign}>
                {formatSalary(job.salaryMin, job.salaryMax)}
              </Badge>
              <Badge tone="violet">{job.experience}</Badge>
              <Badge tone="default" icon={Clock}>
                Posted {formatRelativeDate(job.postedAt)}
              </Badge>
              {job.trending && (
                <Badge tone="amber" icon={TrendingUp}>
                  Trending
                </Badge>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          <section className="card">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              About this role
            </h2>
            <p className="mt-3 leading-relaxed text-slate-600 dark:text-slate-300">
              {job.description}
            </p>
          </section>

          {job.responsibilities?.length > 0 && (
            <section className="card">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Responsibilities
              </h2>
              <ul className="mt-3 space-y-2.5">
                {job.responsibilities.map((r, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-slate-600 dark:text-slate-300">
                    <CheckCircle2
                      size={18}
                      className="mt-0.5 shrink-0 text-emerald-500"
                    />
                    <span className="leading-relaxed">{r}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {job.requirements?.length > 0 && (
            <section className="card">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Requirements
              </h2>
              <ul className="mt-3 space-y-2.5">
                {job.requirements.map((r, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-slate-600 dark:text-slate-300">
                    <CheckCircle2
                      size={18}
                      className="mt-0.5 shrink-0 text-brand-500"
                    />
                    <span className="leading-relaxed">{r}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {job.skills?.length > 0 && (
            <section className="card">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Skills
              </h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {job.skills.map((s) => (
                  <span
                    key={s}
                    className="rounded-lg bg-brand-50 px-3 py-1.5 text-sm font-medium text-brand-700 dark:bg-brand-900/30 dark:text-brand-200"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </section>
          )}
        </div>

        <aside className="space-y-4">
          <section className="card">
            <h3 className="font-semibold text-slate-900 dark:text-white">
              Job overview
            </h3>
            <dl className="mt-4 space-y-4 text-sm">
              <Row icon={Briefcase} label="Job type" value={job.type} />
              <Row icon={DollarSign} label="Salary" value={formatSalary(job.salaryMin, job.salaryMax)} />
              <Row icon={MapPin} label="Location" value={job.location} />
              <Row icon={Clock} label="Posted" value={formatRelativeDate(job.postedAt)} />
              <Row icon={Building2} label="Company" value={job.company} />
            </dl>
            <Button
              className="mt-5 w-full"
              onClick={handleApply}
              disabled={isApplied}
              title={`Apply on ${careerHost}`}
            >
              {isApplied ? (
                'Already Applied'
              ) : (
                <>
                  Apply on {job.company} <ExternalLink size={14} />
                </>
              )}
            </Button>
            {!isApplied && (
              <p className="mt-2 text-center text-xs text-slate-500 dark:text-slate-400">
                {isReal ? 'Opens the official job posting' : 'Opens'}{' '}
                <span className="font-medium text-slate-700 dark:text-slate-300">
                  {careerHost}
                </span>{' '}
                in a new tab
              </p>
            )}
          </section>

          <section className="card">
            <h3 className="flex items-center gap-2 font-semibold text-slate-900 dark:text-white">
              <Building2 size={16} /> About {job.company}
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
              {job.company} is one of the world&apos;s leading companies. Join a
              talented team and ship products used by millions.
            </p>
            <Link
              to={`/jobs?company=${encodeURIComponent(job.company)}`}
              className="mt-3 inline-block text-sm font-semibold text-brand-600 hover:underline"
            >
              See all jobs at {job.company} →
            </Link>
          </section>
        </aside>
      </div>

      {related.length > 0 && (
        <section>
          <h2 className="mb-4 text-xl font-bold text-slate-900 dark:text-white">
            Similar jobs
          </h2>
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {related.map((j) => (
              <JobCard key={j.id} job={j} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function Row({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 text-slate-400">
        <Icon size={16} />
      </span>
      <div>
        <dt className="text-xs text-slate-500 dark:text-slate-400">{label}</dt>
        <dd className="font-medium text-slate-900 dark:text-white">{value}</dd>
      </div>
    </div>
  );
}
