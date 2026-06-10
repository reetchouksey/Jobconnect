export const formatRelativeDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffMin = Math.floor(diffMs / (1000 * 60));
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);
  const diffWeek = Math.floor(diffDay / 7);
  const diffMonth = Math.floor(diffDay / 30);

  if (diffMin < 1) return 'Just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHr < 24) return `${diffHr}h ago`;
  if (diffDay < 7) return `${diffDay}d ago`;
  if (diffWeek < 4) return `${diffWeek}w ago`;
  if (diffMonth < 12) return `${diffMonth}mo ago`;
  return date.toLocaleDateString();
};

export const formatSalary = (min, max, currency = '$') => {
  if (!min && !max) return 'Not disclosed';
  const f = (n) => {
    if (n >= 1000) return `${(n / 1000).toFixed(0)}k`;
    return n;
  };
  if (min && max) return `${currency}${f(min)} - ${currency}${f(max)}`;
  if (min) return `${currency}${f(min)}+`;
  return `Up to ${currency}${f(max)}`;
};

export const generateId = () =>
  `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;

export const classNames = (...classes) => classes.filter(Boolean).join(' ');

export const truncate = (text, max = 140) => {
  if (!text) return '';
  return text.length > max ? `${text.slice(0, max)}…` : text;
};

export const getInitials = (name = '') =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase())
    .join('');

export const stableSort = (arr, key, direction = 'asc') => {
  const copy = [...arr];
  copy.sort((a, b) => {
    const av = a[key];
    const bv = b[key];
    if (av === bv) return 0;
    if (direction === 'asc') return av > bv ? 1 : -1;
    return av < bv ? 1 : -1;
  });
  return copy;
};
