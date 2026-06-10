import { Github, Twitter, Linkedin, Heart } from 'lucide-react';
import Logo from './Logo.jsx';

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <Logo />
            <p className="mt-3 max-w-xs text-sm text-slate-500 dark:text-slate-400">
              Find your dream job from thousands of opportunities posted by top
              companies worldwide.
            </p>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-semibold text-slate-900 dark:text-white">
              For Candidates
            </h4>
            <ul className="space-y-2 text-sm text-slate-500 dark:text-slate-400">
              <li>Browse Jobs</li>
              <li>Career Advice</li>
              <li>Resume Builder</li>
              <li>Salary Guide</li>
            </ul>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-semibold text-slate-900 dark:text-white">
              For Employers
            </h4>
            <ul className="space-y-2 text-sm text-slate-500 dark:text-slate-400">
              <li>Post a Job</li>
              <li>Browse Candidates</li>
              <li>Pricing</li>
              <li>Recruiter Resources</li>
            </ul>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-semibold text-slate-900 dark:text-white">
              Connect
            </h4>
            <div className="flex gap-3">
              {[Github, Twitter, Linkedin].map((Icon, i) => (
                <button
                  key={i}
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-600 hover:bg-brand-50 hover:text-brand-600 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-brand-900/30 dark:hover:text-brand-300"
                >
                  <Icon size={16} />
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-10 flex flex-col items-center justify-between gap-2 border-t border-slate-200 pt-6 text-sm text-slate-500 sm:flex-row dark:border-slate-800 dark:text-slate-400">
          <p>© {new Date().getFullYear()} JobConnect. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Made with <Heart size={14} className="fill-rose-500 text-rose-500" />{' '}
            using React + Redux Toolkit
          </p>
        </div>
      </div>
    </footer>
  );
}
