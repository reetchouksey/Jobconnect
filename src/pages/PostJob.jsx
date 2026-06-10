import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ArrowLeft, Save } from 'lucide-react';
import toast from 'react-hot-toast';

import Input from '../components/ui/Input.jsx';
import Textarea from '../components/ui/Textarea.jsx';
import Button from '../components/ui/Button.jsx';
import { addJob, updateJob, fetchJobs } from '../redux/jobsSlice.js';
import { JOB_TYPES, EXPERIENCE_LEVELS, COMPANY_LOGOS } from '../services/mockData.js';
import { validateJobPost } from '../utils/validators.js';

const empty = {
  title: '',
  company: '',
  location: '',
  type: 'Full Time',
  experience: 'Mid Level',
  salaryMin: '',
  salaryMax: '',
  description: '',
  responsibilities: '',
  requirements: '',
  skills: '',
};

export default function PostJob() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const jobs = useSelector((s) => s.jobs.items);
  const user = useSelector((s) => s.auth.user);

  const [form, setForm] = useState(empty);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const isEdit = Boolean(id);

  useEffect(() => {
    if (jobs.length === 0) dispatch(fetchJobs());
  }, [dispatch, jobs.length]);

  useEffect(() => {
    if (id && jobs.length) {
      const j = jobs.find((x) => x.id === id);
      if (j) {
        setForm({
          title: j.title,
          company: j.company,
          location: j.location,
          type: j.type,
          experience: j.experience,
          salaryMin: j.salaryMin || '',
          salaryMax: j.salaryMax || '',
          description: j.description || '',
          responsibilities: (j.responsibilities || []).join('\n'),
          requirements: (j.requirements || []).join('\n'),
          skills: (j.skills || []).join(', '),
        });
      }
    }
  }, [id, jobs]);

  const handle = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validateJobPost(form);
    setErrors(errs);
    if (Object.keys(errs).length) {
      toast.error('Please fix the highlighted fields');
      return;
    }
    setSaving(true);
    const payload = {
      ...form,
      salaryMin: form.salaryMin ? +form.salaryMin : null,
      salaryMax: form.salaryMax ? +form.salaryMax : null,
      skills: form.skills.split(',').map((s) => s.trim()).filter(Boolean),
      responsibilities: form.responsibilities.split('\n').map((s) => s.trim()).filter(Boolean),
      requirements: form.requirements.split('\n').map((s) => s.trim()).filter(Boolean),
      logo: COMPANY_LOGOS[form.company] || null,
      postedBy: user?.id || 'recruiter',
    };
    if (isEdit) {
      await dispatch(updateJob({ ...payload, id }));
      toast.success('Job updated successfully');
    } else {
      await dispatch(addJob(payload));
      toast.success('Job posted successfully');
    }
    setSaving(false);
    navigate('/recruiter');
  };

  return (
    <div className="space-y-6">
      <Link
        to="/recruiter"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-brand-600"
      >
        <ArrowLeft size={16} /> Back to dashboard
      </Link>

      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">
          {isEdit ? 'Edit Job' : 'Post a New Job'}
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          {isEdit
            ? 'Update the details of your job posting.'
            : 'Fill out the details to publish your job to thousands of candidates.'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="card space-y-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Job Title *"
            placeholder="e.g. Senior Frontend Engineer"
            value={form.title}
            onChange={handle('title')}
            error={errors.title}
          />
          <Input
            label="Company *"
            placeholder="e.g. Acme Inc."
            value={form.company}
            onChange={handle('company')}
            error={errors.company}
          />
          <Input
            label="Location *"
            placeholder="e.g. San Francisco, CA"
            value={form.location}
            onChange={handle('location')}
            error={errors.location}
          />
          <div>
            <label className="label">Job Type *</label>
            <select className="input" value={form.type} onChange={handle('type')}>
              {JOB_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
            {errors.type && (
              <p className="mt-1 text-xs text-rose-500">{errors.type}</p>
            )}
          </div>
          <div>
            <label className="label">Experience</label>
            <select
              className="input"
              value={form.experience}
              onChange={handle('experience')}
            >
              {EXPERIENCE_LEVELS.map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </select>
          </div>
          <Input
            label="Salary Min ($)"
            type="number"
            placeholder="e.g. 80000"
            value={form.salaryMin}
            onChange={handle('salaryMin')}
          />
          <Input
            label="Salary Max ($)"
            type="number"
            placeholder="e.g. 120000"
            value={form.salaryMax}
            onChange={handle('salaryMax')}
            error={errors.salaryMax}
          />
        </div>

        <Textarea
          label="Description *"
          placeholder="Give a short overview of the role and team."
          rows={4}
          value={form.description}
          onChange={handle('description')}
          error={errors.description}
        />

        <Textarea
          label="Responsibilities (one per line)"
          placeholder={'Architect features\nMentor engineers\nWork cross-functionally'}
          rows={5}
          value={form.responsibilities}
          onChange={handle('responsibilities')}
        />

        <Textarea
          label="Requirements (one per line)"
          placeholder={'5+ years experience\nStrong React skills'}
          rows={5}
          value={form.requirements}
          onChange={handle('requirements')}
        />

        <Input
          label="Skills (comma separated)"
          placeholder="React, TypeScript, GraphQL"
          value={form.skills}
          onChange={handle('skills')}
        />

        <div className="flex justify-end gap-3 pt-2">
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate('/recruiter')}
          >
            Cancel
          </Button>
          <Button type="submit" loading={saving}>
            <Save size={16} /> {isEdit ? 'Save Changes' : 'Publish Job'}
          </Button>
        </div>
      </form>
    </div>
  );
}
