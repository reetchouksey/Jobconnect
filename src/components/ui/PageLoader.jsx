import { Briefcase } from 'lucide-react';

export default function PageLoader() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-50 dark:bg-slate-950">
      <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-glow">
        <Briefcase size={26} />
        <span className="absolute inset-0 animate-ping rounded-2xl bg-brand-500 opacity-30" />
      </div>
      <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
        Loading…
      </p>
    </div>
  );
}
