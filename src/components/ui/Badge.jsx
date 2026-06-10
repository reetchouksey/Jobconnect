import { classNames } from '../../utils/helpers.js';

const TONES = {
  default: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200',
  brand: 'bg-brand-50 text-brand-700 dark:bg-brand-900/40 dark:text-brand-200',
  emerald: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-200',
  amber: 'bg-amber-50 text-amber-700 dark:bg-amber-900/40 dark:text-amber-200',
  rose: 'bg-rose-50 text-rose-700 dark:bg-rose-900/40 dark:text-rose-200',
  violet: 'bg-violet-50 text-violet-700 dark:bg-violet-900/40 dark:text-violet-200',
};

export default function Badge({ tone = 'default', children, className = '', icon: Icon }) {
  return (
    <span className={classNames('badge', TONES[tone], className)}>
      {Icon && <Icon size={12} />}
      {children}
    </span>
  );
}
