import { ChevronLeft, ChevronRight } from 'lucide-react';
import { classNames } from '../../utils/helpers.js';

export default function Pagination({ page, total, pageSize, onChange }) {
  const pages = Math.max(1, Math.ceil(total / pageSize));
  if (pages <= 1) return null;

  const range = [];
  const window_ = 1;
  for (let i = 1; i <= pages; i++) {
    if (i === 1 || i === pages || (i >= page - window_ && i <= page + window_)) {
      range.push(i);
    } else if (range[range.length - 1] !== '…') {
      range.push('…');
    }
  }

  return (
    <nav className="mt-8 flex items-center justify-center gap-2">
      <button
        onClick={() => onChange(Math.max(1, page - 1))}
        disabled={page === 1}
        className="btn-ghost px-3 disabled:opacity-40"
      >
        <ChevronLeft size={16} /> Prev
      </button>
      {range.map((p, idx) =>
        p === '…' ? (
          <span key={`gap-${idx}`} className="px-2 text-slate-400">
            …
          </span>
        ) : (
          <button
            key={p}
            onClick={() => onChange(p)}
            className={classNames(
              'h-9 min-w-[2.25rem] rounded-lg text-sm font-medium transition',
              p === page
                ? 'bg-brand-600 text-white shadow-soft'
                : 'bg-white text-slate-700 hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700',
            )}
          >
            {p}
          </button>
        ),
      )}
      <button
        onClick={() => onChange(Math.min(pages, page + 1))}
        disabled={page === pages}
        className="btn-ghost px-3 disabled:opacity-40"
      >
        Next <ChevronRight size={16} />
      </button>
    </nav>
  );
}
