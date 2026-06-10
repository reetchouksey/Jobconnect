import { storage } from '../utils/storage.js';

const CACHE_KEY = 'realJobsCache';
const CACHE_TTL_MS = 30 * 60 * 1000;

const stripHtml = (html = '') =>
  String(html)
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<\/(p|li|div|h\d|br)>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

const splitBullets = (text = '', limit = 8) => {
  const lines = text
    .split(/\n|•|\u2022|\d+\.\s/)
    .map((s) => s.trim())
    .filter((s) => s.length > 8 && s.length < 220);
  return lines.slice(0, limit);
};

const normalizeJobType = (type = '') => {
  const t = String(type).toLowerCase();
  if (t.includes('intern')) return 'Internship';
  if (t.includes('part')) return 'Part Time';
  if (t.includes('contract') || t.includes('freelance')) return 'Contract';
  if (t.includes('hybrid')) return 'Hybrid';
  if (t.includes('remote')) return 'Remote';
  return 'Full Time';
};

const guessExperience = (title = '', tags = []) => {
  const text = `${title} ${tags.join(' ')}`.toLowerCase();
  if (/(intern|junior|entry|graduate|trainee)/.test(text)) return 'Entry Level';
  if (/(senior|sr\.|lead|principal|staff)/.test(text)) return 'Senior Level';
  if (/(head|director|manager|vp|chief)/.test(text)) return 'Lead';
  return 'Mid Level';
};

const parseSalary = (raw = '') => {
  if (!raw) return { salaryMin: null, salaryMax: null };
  const text = String(raw).replace(/,/g, '');
  const matches = text.match(/(\d{2,7})/g);
  if (!matches?.length) return { salaryMin: null, salaryMax: null };
  const nums = matches
    .map(Number)
    .filter((n) => n >= 1000 && n <= 1_000_000)
    .sort((a, b) => a - b);
  if (!nums.length) return { salaryMin: null, salaryMax: null };
  return {
    salaryMin: nums[0],
    salaryMax: nums.length > 1 ? nums[nums.length - 1] : nums[0],
  };
};

const companyDomain = (name = '') => {
  const slug = String(name)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '')
    .trim();
  if (!slug) return null;
  return `${slug}.com`;
};

const logoFor = (companyName, providedLogo) => {
  if (providedLogo && /^https?:\/\//.test(providedLogo)) return providedLogo;
  const domain = companyDomain(companyName);
  return domain ? `https://logo.clearbit.com/${domain}` : null;
};

const normalizeRemotive = (j) => {
  const description = stripHtml(j.description || '');
  const responsibilities = splitBullets(description, 6);
  const { salaryMin, salaryMax } = parseSalary(j.salary);
  return {
    id: `remotive-${j.id}`,
    title: j.title,
    company: j.company_name,
    location: j.candidate_required_location || 'Remote',
    type: normalizeJobType(j.job_type || 'remote'),
    experience: guessExperience(j.title, j.tags || []),
    salaryMin,
    salaryMax,
    skills: (j.tags || []).slice(0, 8),
    description: description.slice(0, 600),
    responsibilities,
    requirements: [],
    logo: logoFor(j.company_name, j.company_logo),
    postedAt: j.publication_date || new Date().toISOString(),
    applyUrl: j.url,
    source: 'remotive',
    trending: false,
    postedBy: 'system',
    isReal: true,
  };
};

const normalizeArbeitnow = (j) => {
  const description = stripHtml(j.description || '');
  const responsibilities = splitBullets(description, 6);
  const isRemote = j.remote === true;
  const type = isRemote
    ? 'Remote'
    : normalizeJobType((j.job_types && j.job_types[0]) || 'full');
  return {
    id: `arbeitnow-${j.slug}`,
    title: j.title,
    company: j.company_name,
    location: j.location || 'Remote',
    type,
    experience: guessExperience(j.title, j.tags || []),
    salaryMin: null,
    salaryMax: null,
    skills: (j.tags || []).slice(0, 8),
    description: description.slice(0, 600),
    responsibilities,
    requirements: [],
    logo: logoFor(j.company_name),
    postedAt: j.created_at
      ? new Date(j.created_at * 1000).toISOString()
      : new Date().toISOString(),
    applyUrl: j.url,
    source: 'arbeitnow',
    trending: false,
    postedBy: 'system',
    isReal: true,
  };
};

const fetchWithTimeout = (url, ms = 8000) =>
  Promise.race([
    fetch(url).then((r) => {
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      return r.json();
    }),
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error('timeout')), ms),
    ),
  ]);

const fetchRemotive = async () => {
  try {
    const data = await fetchWithTimeout(
      'https://remotive.com/api/remote-jobs?limit=60',
    );
    return (data?.jobs || []).map(normalizeRemotive);
  } catch (e) {
    console.warn('[realJobsApi] Remotive failed:', e.message);
    return [];
  }
};

const fetchArbeitnow = async () => {
  try {
    const data = await fetchWithTimeout(
      'https://www.arbeitnow.com/api/job-board-api',
    );
    return (data?.data || []).map(normalizeArbeitnow);
  } catch (e) {
    console.warn('[realJobsApi] Arbeitnow failed:', e.message);
    return [];
  }
};

export const fetchRealJobs = async ({ force = false } = {}) => {
  if (!force) {
    const cached = storage.get(CACHE_KEY);
    if (cached && cached.fetchedAt && Date.now() - cached.fetchedAt < CACHE_TTL_MS) {
      return cached.jobs || [];
    }
  }

  const [remotive, arbeitnow] = await Promise.all([
    fetchRemotive(),
    fetchArbeitnow(),
  ]);

  const seen = new Set();
  const merged = [...remotive, ...arbeitnow].filter((j) => {
    const key = `${j.company.toLowerCase()}::${j.title.toLowerCase()}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return Boolean(j.title && j.company && j.applyUrl);
  });

  if (merged.length > 0) {
    storage.set(CACHE_KEY, { jobs: merged, fetchedAt: Date.now() });
  }

  return merged;
};

export const clearRealJobsCache = () => storage.remove(CACHE_KEY);
