import { forwardRef } from 'react';
import { classNames } from '../../utils/helpers.js';

const Textarea = forwardRef(function Textarea(
  { label, error, hint, className = '', rows = 4, ...props },
  ref,
) {
  return (
    <div className="w-full">
      {label && <label className="label">{label}</label>}
      <textarea
        ref={ref}
        rows={rows}
        className={classNames(
          'input resize-y leading-relaxed',
          error && 'border-rose-400 focus:border-rose-500 focus:ring-rose-100',
          className,
        )}
        {...props}
      />
      {error ? (
        <p className="mt-1 text-xs text-rose-500">{error}</p>
      ) : hint ? (
        <p className="mt-1 text-xs text-slate-400">{hint}</p>
      ) : null}
    </div>
  );
});

export default Textarea;
