import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  GraduationCap,
  FileText,
  Plus,
  X,
  Pencil,
  Save,
  Upload,
  Award,
  Trash2,
} from 'lucide-react';
import toast from 'react-hot-toast';

import Input from '../components/ui/Input.jsx';
import Textarea from '../components/ui/Textarea.jsx';
import Button from '../components/ui/Button.jsx';
import { updateProfile } from '../redux/authSlice.js';
import { getInitials } from '../utils/helpers.js';

const emptyForm = (user) => ({
  name: user?.name || '',
  email: user?.email || '',
  phone: user?.phone || '',
  location: user?.location || '',
  headline: user?.headline || '',
  bio: user?.bio || '',
  skills: user?.skills || [],
  experience: user?.experience || [],
  education: user?.education || [],
  resumeName: user?.resumeName || '',
});

export default function Profile() {
  const dispatch = useDispatch();
  const user = useSelector((s) => s.auth.user);

  const [form, setForm] = useState(() => emptyForm(user));

  // Per-section editing state
  const [editing, setEditing] = useState({
    personal: false,
    skills: false,
    experience: false,
    education: false,
  });
  const [saving, setSaving] = useState(false);
  const [skillInput, setSkillInput] = useState('');
  const resumeInputRef = useRef(null);

  useEffect(() => {
    if (user) setForm(emptyForm(user));
  }, [user]);

  const completeness = (() => {
    const fields = ['name', 'email', 'phone', 'location', 'headline', 'bio', 'resumeName'];
    let n = fields.filter((f) => form[f]).length;
    if (form.skills.length) n++;
    if (form.experience.length) n++;
    if (form.education.length) n++;
    return Math.round((n / 10) * 100);
  })();

  const handleChange = (key) => (e) =>
    setForm({ ...form, [key]: e.target.value });

  const toggleEdit = (section, value) =>
    setEditing((prev) => ({ ...prev, [section]: value }));

  const cancelSection = (section) => {
    setForm(emptyForm(user));
    setSkillInput('');
    toggleEdit(section, false);
  };

  const saveSection = async (section, override) => {
    const payload = override ? { ...form, ...override } : form;
    setSaving(true);
    try {
      await dispatch(updateProfile(payload)).unwrap();
      if (override) setForm(payload);
      toggleEdit(section, false);
      toast.success('Saved');
    } catch (err) {
      toast.error(err?.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  // Skills
  const addSkill = () => {
    const v = skillInput.trim();
    if (!v) return;
    if (!form.skills.includes(v)) {
      setForm({ ...form, skills: [...form.skills, v] });
    }
    setSkillInput('');
  };
  const removeSkill = (s) =>
    setForm({ ...form, skills: form.skills.filter((x) => x !== s) });

  // Experience
  const addExperience = () => {
    toggleEdit('experience', true);
    setForm({
      ...form,
      experience: [
        ...form.experience,
        { id: Date.now(), title: '', company: '', from: '', to: '', summary: '' },
      ],
    });
  };
  const updateExperience = (id, key, val) =>
    setForm({
      ...form,
      experience: form.experience.map((e) =>
        e.id === id ? { ...e, [key]: val } : e,
      ),
    });
  const removeExperience = (id) =>
    setForm({
      ...form,
      experience: form.experience.filter((e) => e.id !== id),
    });

  // Education
  const addEducation = () => {
    toggleEdit('education', true);
    setForm({
      ...form,
      education: [
        ...form.education,
        { id: Date.now(), school: '', degree: '', from: '', to: '' },
      ],
    });
  };
  const updateEducation = (id, key, val) =>
    setForm({
      ...form,
      education: form.education.map((e) =>
        e.id === id ? { ...e, [key]: val } : e,
      ),
    });
  const removeEducation = (id) =>
    setForm({ ...form, education: form.education.filter((e) => e.id !== id) });

  // Resume — uploads immediately, no global edit mode required
  const handleResume = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Resume must be under 5 MB');
      e.target.value = '';
      return;
    }
    await saveSection('resume', { resumeName: file.name });
    e.target.value = '';
  };

  const removeResume = async () => {
    if (!form.resumeName) return;
    await saveSection('resume', { resumeName: '' });
  };

  return (
    <div className="space-y-6">
      <div className="card flex flex-col gap-5 sm:flex-row sm:items-center">
        <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 text-2xl font-bold text-white">
          {getInitials(form.name)}
        </div>
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            {form.name || 'Your name'}
          </h1>
          {form.headline && (
            <p className="mt-1 text-sm font-medium text-brand-600">{form.headline}</p>
          )}
          <p className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
            <span className="inline-flex items-center gap-1"><Mail size={12} />{form.email}</span>
            {form.phone && (
              <span className="inline-flex items-center gap-1"><Phone size={12} />{form.phone}</span>
            )}
            {form.location && (
              <span className="inline-flex items-center gap-1"><MapPin size={12} />{form.location}</span>
            )}
          </p>
        </div>
      </div>

      <div className="card">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200">Profile completeness</h3>
          <span className="text-sm font-bold text-brand-600">{completeness}%</span>
        </div>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
          <div
            className="h-full rounded-full bg-gradient-to-r from-brand-500 to-brand-700 transition-all"
            style={{ width: `${completeness}%` }}
          />
        </div>
        {completeness < 100 && (
          <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
            Complete your profile to stand out to recruiters.
          </p>
        )}
      </div>

      <Section
        icon={User}
        title="Personal Information"
        editing={editing.personal}
        onEdit={() => toggleEdit('personal', true)}
        onSave={() => saveSection('personal')}
        onCancel={() => cancelSection('personal')}
        saving={saving}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Input label="Full Name" value={form.name} disabled={!editing.personal} onChange={handleChange('name')} />
          <Input label="Email" type="email" value={form.email} disabled={!editing.personal} onChange={handleChange('email')} />
          <Input label="Phone" value={form.phone} disabled={!editing.personal} onChange={handleChange('phone')} />
          <Input label="Location" value={form.location} disabled={!editing.personal} onChange={handleChange('location')} placeholder="City, Country" />
          <div className="sm:col-span-2">
            <Input label="Headline" value={form.headline} disabled={!editing.personal} onChange={handleChange('headline')} placeholder="e.g. Senior Frontend Engineer" />
          </div>
          <div className="sm:col-span-2">
            <Textarea label="Bio" value={form.bio} disabled={!editing.personal} onChange={handleChange('bio')} rows={4} placeholder="Tell us about yourself…" />
          </div>
        </div>
      </Section>

      <Section
        icon={Award}
        title="Skills"
        editing={editing.skills}
        onEdit={() => toggleEdit('skills', true)}
        onSave={() => saveSection('skills')}
        onCancel={() => cancelSection('skills')}
        saving={saving}
      >
        <div className="flex flex-wrap gap-2">
          {form.skills.length === 0 && !editing.skills && (
            <p className="text-sm text-slate-500">No skills added yet.</p>
          )}
          {form.skills.map((s) => (
            <span key={s} className="inline-flex items-center gap-1 rounded-lg bg-brand-50 px-3 py-1.5 text-sm font-medium text-brand-700 dark:bg-brand-900/30 dark:text-brand-200">
              {s}
              {editing.skills && (
                <button
                  type="button"
                  onClick={() => removeSkill(s)}
                  className="rounded-full p-0.5 hover:bg-brand-100 dark:hover:bg-brand-800"
                  aria-label={`Remove ${s}`}
                >
                  <X size={12} />
                </button>
              )}
            </span>
          ))}
        </div>
        {editing.skills && (
          <div className="mt-4 flex gap-2">
            <input
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
              placeholder="Add a skill (e.g. React)"
              className="input"
            />
            <Button variant="secondary" onClick={addSkill}><Plus size={16} /> Add</Button>
          </div>
        )}
      </Section>

      <Section
        icon={Briefcase}
        title="Experience"
        editing={editing.experience}
        onEdit={() => toggleEdit('experience', true)}
        onSave={() => saveSection('experience')}
        onCancel={() => cancelSection('experience')}
        saving={saving}
        extraAction={
          editing.experience ? (
            <Button variant="secondary" size="sm" onClick={addExperience}>
              <Plus size={14} /> Add
            </Button>
          ) : null
        }
      >
        {form.experience.length === 0 && !editing.experience && (
          <div className="flex flex-col items-start gap-3">
            <p className="text-sm text-slate-500">No experience added yet.</p>
            <Button variant="secondary" size="sm" onClick={addExperience}>
              <Plus size={14} /> Add Experience
            </Button>
          </div>
        )}
        <ul className="space-y-4">
          {form.experience.map((exp) => (
            <li key={exp.id} className="rounded-xl border border-slate-200 p-4 dark:border-slate-700">
              {editing.experience ? (
                <div className="grid gap-3 sm:grid-cols-2">
                  <Input label="Job Title" value={exp.title} onChange={(e) => updateExperience(exp.id, 'title', e.target.value)} />
                  <Input label="Company" value={exp.company} onChange={(e) => updateExperience(exp.id, 'company', e.target.value)} />
                  <Input label="From" value={exp.from} placeholder="Jan 2020" onChange={(e) => updateExperience(exp.id, 'from', e.target.value)} />
                  <Input label="To" value={exp.to} placeholder="Present" onChange={(e) => updateExperience(exp.id, 'to', e.target.value)} />
                  <div className="sm:col-span-2">
                    <Textarea label="Summary" value={exp.summary} onChange={(e) => updateExperience(exp.id, 'summary', e.target.value)} rows={3} />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeExperience(exp.id)}
                    className="col-span-full inline-flex items-center gap-1 text-left text-xs font-medium text-rose-500 hover:underline"
                  >
                    <Trash2 size={12} /> Remove this experience
                  </button>
                </div>
              ) : (
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white">{exp.title || 'Untitled'}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{exp.company} · {exp.from} – {exp.to}</p>
                  {exp.summary && (
                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{exp.summary}</p>
                  )}
                </div>
              )}
            </li>
          ))}
        </ul>
      </Section>

      <Section
        icon={GraduationCap}
        title="Education"
        editing={editing.education}
        onEdit={() => toggleEdit('education', true)}
        onSave={() => saveSection('education')}
        onCancel={() => cancelSection('education')}
        saving={saving}
        extraAction={
          editing.education ? (
            <Button variant="secondary" size="sm" onClick={addEducation}>
              <Plus size={14} /> Add
            </Button>
          ) : null
        }
      >
        {form.education.length === 0 && !editing.education && (
          <div className="flex flex-col items-start gap-3">
            <p className="text-sm text-slate-500">No education added yet.</p>
            <Button variant="secondary" size="sm" onClick={addEducation}>
              <Plus size={14} /> Add Education
            </Button>
          </div>
        )}
        <ul className="space-y-4">
          {form.education.map((edu) => (
            <li key={edu.id} className="rounded-xl border border-slate-200 p-4 dark:border-slate-700">
              {editing.education ? (
                <div className="grid gap-3 sm:grid-cols-2">
                  <Input label="School" value={edu.school} onChange={(e) => updateEducation(edu.id, 'school', e.target.value)} />
                  <Input label="Degree" value={edu.degree} onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)} />
                  <Input label="From" value={edu.from} onChange={(e) => updateEducation(edu.id, 'from', e.target.value)} />
                  <Input label="To" value={edu.to} onChange={(e) => updateEducation(edu.id, 'to', e.target.value)} />
                  <button
                    type="button"
                    onClick={() => removeEducation(edu.id)}
                    className="col-span-full inline-flex items-center gap-1 text-left text-xs font-medium text-rose-500 hover:underline"
                  >
                    <Trash2 size={12} /> Remove this education
                  </button>
                </div>
              ) : (
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white">{edu.degree || 'Untitled'}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{edu.school} · {edu.from} – {edu.to}</p>
                </div>
              )}
            </li>
          ))}
        </ul>
      </Section>

      <Section
        icon={FileText}
        title="Resume"
        extraAction={
          <div className="flex items-center gap-2">
            <input
              ref={resumeInputRef}
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleResume}
              className="hidden"
            />
            <Button
              variant="secondary"
              size="sm"
              onClick={() => resumeInputRef.current?.click()}
              loading={saving}
            >
              <Upload size={14} /> {form.resumeName ? 'Replace' : 'Upload'}
            </Button>
            {form.resumeName && (
              <Button variant="ghost" size="sm" onClick={removeResume}>
                <Trash2 size={14} /> Remove
              </Button>
            )}
          </div>
        }
      >
        {form.resumeName ? (
          <div className="flex items-center gap-3 rounded-xl bg-slate-50 px-4 py-3 dark:bg-slate-800">
            <FileText size={18} className="text-brand-600" />
            <span className="font-medium text-slate-700 dark:text-slate-200">{form.resumeName}</span>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => resumeInputRef.current?.click()}
            className="flex w-full cursor-pointer items-center justify-between gap-3 rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-3 text-left hover:border-brand-400 dark:border-slate-700 dark:bg-slate-800"
          >
            <span className="flex items-center gap-3 text-sm">
              <Upload size={18} className="text-slate-400" />
              <span className="text-slate-500">Upload your resume (PDF, DOCX • max 5MB)</span>
            </span>
            <span className="text-xs font-semibold text-brand-600">Browse</span>
          </button>
        )}
      </Section>
    </div>
  );
}

function Section({
  icon: Icon,
  title,
  children,
  editing,
  onEdit,
  onSave,
  onCancel,
  saving,
  extraAction,
}) {
  const showEditControls = onEdit !== undefined;
  return (
    <section className="card">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900 dark:text-white">
          {Icon && <Icon size={18} className="text-brand-600" />}
          {title}
        </h2>
        <div className="flex items-center gap-2">
          {extraAction}
          {showEditControls && (
            editing ? (
              <>
                <Button variant="secondary" size="sm" onClick={onCancel} disabled={saving}>
                  Cancel
                </Button>
                <Button size="sm" onClick={onSave} loading={saving}>
                  <Save size={14} /> Save
                </Button>
              </>
            ) : (
              <Button variant="secondary" size="sm" onClick={onEdit}>
                <Pencil size={14} /> Edit
              </Button>
            )
          )}
        </div>
      </div>
      {children}
    </section>
  );
}
