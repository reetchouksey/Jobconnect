import { COMPANY_LOGOS } from '../services/mockData.js';

// Derive { "Google": "google.com", ... } from the existing clearbit logo map
// so we never duplicate company → domain knowledge.
const COMPANY_DOMAINS = Object.fromEntries(
  Object.entries(COMPANY_LOGOS).map(([name, url]) => [
    name,
    String(url).replace('https://logo.clearbit.com/', ''),
  ]),
);

const slugDomain = (name = '') => {
  const slug = String(name)
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '')
    .trim();
  return slug ? `${slug}.com` : '';
};

export const getCompanyDomain = (company) =>
  COMPANY_DOMAINS[company] || slugDomain(company);

export const getCareerUrl = (job) => {
  if (job?.applyUrl) return job.applyUrl;
  const domain = getCompanyDomain(job?.company);
  if (domain) return `https://www.${domain}/careers`;
  const q = encodeURIComponent(
    [job?.company, job?.title, 'careers'].filter(Boolean).join(' '),
  );
  return `https://www.google.com/search?q=${q}`;
};

export const getCareerHostname = (job) => {
  try {
    return new URL(getCareerUrl(job)).hostname.replace(/^www\./, '');
  } catch {
    return job?.company ? `${getCompanyDomain(job.company)}` : '';
  }
};
