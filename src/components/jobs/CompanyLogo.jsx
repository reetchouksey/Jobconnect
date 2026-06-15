import { useState } from 'react';
import { getInitials, classNames } from '../../utils/helpers.js';

const GRADIENTS = [
  'from-rose-500 to-pink-600',
  'from-amber-500 to-orange-600',
  'from-emerald-500 to-teal-600',
  'from-sky-500 to-blue-600',
  'from-violet-500 to-purple-600',
  'from-fuchsia-500 to-pink-600',
  'from-lime-500 to-green-600',
  'from-cyan-500 to-sky-600',
  'from-indigo-500 to-violet-600',
  'from-red-500 to-rose-600',
  'from-yellow-500 to-amber-600',
  'from-slate-500 to-slate-700',
];

const hashCode = (str = '') => {
  let h = 0;
  for (let i = 0; i < str.length; i += 1) {
    h = (h * 31 + str.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
};

const gradientFor = (name) => GRADIENTS[hashCode(name) % GRADIENTS.length];

const isUnreliableLogoSrc = (src) => {
  if (!src) return true;
  return /(^|\/\/|\.)clearbit\.com(\/|$)/i.test(src);
};

export default function CompanyLogo({ name, src, size = 48, className = '' }) {
  const [errored, setErrored] = useState(false);
  const dim = { width: size, height: size };
  const fontSize = Math.max(11, Math.round(size * 0.36));

  const useFallback = errored || isUnreliableLogoSrc(src);

  if (useFallback) {
    return (
      <div
        style={{ ...dim, fontSize }}
        className={classNames(
          'flex select-none items-center justify-center rounded-xl bg-gradient-to-br font-bold tracking-tight text-white shadow-sm ring-1 ring-black/5',
          gradientFor(name),
          className,
        )}
        aria-label={name}
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
      loading="lazy"
      className={classNames(
        'rounded-xl border border-slate-200 bg-white object-contain p-1.5 dark:border-slate-700 dark:bg-slate-800',
        className,
      )}
    />
  );
}
