import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Upload, FileText, CheckCircle2, ExternalLink, Building2 } from 'lucide-react';
import toast from 'react-hot-toast';

import Modal from '../ui/Modal.jsx';
import Input from '../ui/Input.jsx';
import Textarea from '../ui/Textarea.jsx';
import Button from '../ui/Button.jsx';
import { applyJob } from '../../redux/appliedJobsSlice.js';
import { validateApplication } from '../../utils/validators.js';

export default function ApplyJobModal({ job, isOpen, onClose }) {
  const dispatch = useDispatch();
  const user = useSelector((s) => s.auth.user);

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    coverLetter: '',
    resumeName: '',
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (isOpen && user) {
      setForm((f) => ({
        ...f,
        name: f.name || user.name || '',
        email: f.email || user.email || '',
        phone: f.phone || user.phone || '',
      }));
      setSuccess(false);
      setErrors({});
    }
  }, [isOpen, user]);

  if (!job) return null;

  const isReal = Boolean(job.isReal && job.applyUrl);

  const handleChange = (key) => (e) =>
    setForm({ ...form, [key]: e.target.value });

  const handleExternalApply = () => {
    window.open(job.applyUrl, '_blank', 'noopener,noreferrer');
    dispatch(
      applyJob({
        jobId: job.id,
        jobTitle: job.title,
        company: job.company,
        logo: job.logo,
        location: job.location,
        applyUrl: job.applyUrl,
        applicant: { external: true, userId: user?.id },
      }),
    );
    toast.success(`Opening ${job.company}'s careers page…`);
    onClose?.();
  };

  const handleResume = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Resume must be under 5 MB');
      return;
    }
    setForm({ ...form, resumeName: file.name });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validateApplication(form);
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 700));
    dispatch(
      applyJob({
        jobId: job.id,
        jobTitle: job.title,
        company: job.company,
        logo: job.logo,
        location: job.location,
        applicant: { ...form, userId: user?.id },
      }),
    );
    setSubmitting(false);
    setSuccess(true);
    toast.success('Application submitted!');
    setTimeout(() => {
      onClose?.();
      setForm({ name: '', email: '', phone: '', coverLetter: '', resumeName: '' });
    }, 1400);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Apply to ${job.title}`}
      maxWidth="max-w-xl"
    >
      {isReal ? (
        <div className="space-y-5">
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-900/50 dark:bg-emerald-900/20">
            <div className="flex items-start gap-3">
              <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white">
                <CheckCircle2 size={18} />
              </span>
              <div>
                <p className="font-semibold text-emerald-900 dark:text-emerald-100">
                  This is a real, live job posting
                </p>
                <p className="mt-1 text-sm text-emerald-800 dark:text-emerald-200">
                  Applications for <strong>{job.title}</strong> at{' '}
                  <strong>{job.company}</strong> are handled directly on the
                  company&apos;s careers site.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-xl border border-slate-200 p-3 dark:border-slate-700">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-300">
              <Building2 size={18} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                Application page
              </p>
              <p className="truncate text-sm font-medium text-slate-900 dark:text-white">
                {(() => {
                  try {
                    return new URL(job.applyUrl).hostname;
                  } catch {
                    return job.applyUrl;
                  }
                })()}
              </p>
            </div>
          </div>

          <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
            <li className="flex gap-2">
              <span className="text-brand-600">1.</span>
              We&apos;ll open the official application page in a new tab.
            </li>
            <li className="flex gap-2">
              <span className="text-brand-600">2.</span>
              Complete the application directly on {job.company}&apos;s site.
            </li>
            <li className="flex gap-2">
              <span className="text-brand-600">3.</span>
              We&apos;ll mark this job as applied in your tracker so you can
              follow up.
            </li>
          </ul>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleExternalApply}>
              Continue to {job.company} <ExternalLink size={14} />
            </Button>
          </div>
        </div>
      ) : success ? (
        <div className="flex flex-col items-center gap-3 py-8 text-center">
          <CheckCircle2 size={56} className="text-emerald-500" />
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">
            Application sent!
          </h3>
          <p className="max-w-sm text-sm text-slate-500 dark:text-slate-400">
            Your application for <strong>{job.title}</strong> at{' '}
            <strong>{job.company}</strong> has been received.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input
              label="Full Name *"
              value={form.name}
              onChange={handleChange('name')}
              error={errors.name}
            />
            <Input
              label="Email *"
              type="email"
              value={form.email}
              onChange={handleChange('email')}
              error={errors.email}
            />
          </div>
          <Input
            label="Phone Number *"
            value={form.phone}
            onChange={handleChange('phone')}
            error={errors.phone}
          />

          <div>
            <label className="label">Resume</label>
            <label className="flex cursor-pointer items-center justify-between gap-3 rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-3 hover:border-brand-400 dark:border-slate-700 dark:bg-slate-800">
              <span className="flex items-center gap-3 text-sm">
                {form.resumeName ? (
                  <>
                    <FileText size={18} className="text-brand-600" />
                    <span className="font-medium text-slate-700 dark:text-slate-200">
                      {form.resumeName}
                    </span>
                  </>
                ) : (
                  <>
                    <Upload size={18} className="text-slate-400" />
                    <span className="text-slate-500">
                      Click to upload (PDF, DOCX • max 5MB)
                    </span>
                  </>
                )}
              </span>
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleResume}
                className="hidden"
              />
              <span className="text-xs font-semibold text-brand-600">
                {form.resumeName ? 'Change' : 'Browse'}
              </span>
            </label>
          </div>

          <Textarea
            label="Cover Letter"
            placeholder="Tell us why you're a great fit…"
            rows={5}
            value={form.coverLetter}
            onChange={handleChange('coverLetter')}
            error={errors.coverLetter}
          />

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="secondary" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" loading={submitting}>
              Submit Application
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
}
