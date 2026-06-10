import { useState } from 'react';
import { getInitials, classNames } from '../../utils/helpers.js';

export default function CompanyLogo({ name, src, size = 48, className = '' }) {
  const [errored, setErrored] = useState(false);
  const dim = { width: size, height: size };

  if (!src || errored) {
    return (
      <div
        style={dim}
        className={classNames(
          'flex items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 text-sm font-bold text-white',
          className,
        )}
      >
        {getInitials(name) || '?'}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={name}
      style={dim}
      onError={() => setErrored(true)}
      className={classNames(
        'rounded-xl border border-slate-200 bg-white object-contain p-1.5 dark:border-slate-700 dark:bg-slate-800',
        className,
      )}
    />
  );
}
