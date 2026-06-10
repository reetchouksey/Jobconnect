import { classNames } from '../../utils/helpers.js';

const TONES = {
  brand: 'from-brand-500 to-brand-700 text-white',
  emerald: 'from-emerald-500 to-emerald-700 text-white',
  amber: 'from-amber-500 to-orange-600 text-white',
  rose: 'from-rose-500 to-pink-600 text-white',
  violet: 'from-violet-500 to-purple-700 text-white',
};

export default function StatCard({ icon: Icon, label, value, tone = 'brand', trend }) {
  return (
    <div className="card relative overflow-hidden">
      <div
        className={classNames(
          'absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gradient-to-br opacity-20 blur-2xl',
          TONES[tone],
        )}
      />
      <div className="flex items-start justify-between gap-3 sm:gap-4">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
            {label}
          </p>
          <p className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl dark:text-white">
            {value}
          </p>
          {trend && (
            <p className="mt-2 text-xs font-medium text-emerald-600 dark:text-emerald-400">
              {trend}
            </p>
          )}
        </div>
        <div
          className={classNames(
            'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br shadow-md sm:h-12 sm:w-12',
            TONES[tone],
          )}
        >
          <Icon size={20} />
        </div>
      </div>
    </div>
  );
}
