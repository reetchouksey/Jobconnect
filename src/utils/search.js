const norm = (s) => String(s || '').toLowerCase().trim();

const levenshtein = (a, b) => {
  a = norm(a);
  b = norm(b);
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;

  const m = a.length;
  const n = b.length;
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + cost,
      );
    }
  }
  return dp[m][n];
};

export const fuzzyMatch = (query, target, { maxDistance = 2 } = {}) => {
  const q = norm(query);
  const t = norm(target);
  if (!q) return true;
  if (!t) return false;
  if (t.includes(q)) return true;
  const qTokens = q.split(/\s+/).filter(Boolean);
  if (qTokens.every((tok) => t.includes(tok))) return true;
  const tTokens = t.split(/\s+/).filter(Boolean);
  return qTokens.every((qt) =>
    tTokens.some(
      (tt) =>
        tt.startsWith(qt) ||
        tt.includes(qt) ||
        levenshtein(qt, tt) <=
          Math.min(maxDistance, Math.floor(qt.length / 3)),
    ),
  );
};

export const fuzzyScore = (query, target) => {
  const q = norm(query);
  const t = norm(target);
  if (!q || !t) return 0;
  if (t === q) return 100;
  if (t.startsWith(q)) return 90;
  if (t.includes(q)) return 75;
  const dist = levenshtein(q, t);
  const maxLen = Math.max(q.length, t.length);
  return Math.max(0, Math.round(((maxLen - dist) / maxLen) * 60));
};

export const getJobSuggestions = (query, jobs, limit = 6) => {
  const q = norm(query);
  if (!q) return { titles: [], companies: [], skills: [], locations: [] };

  const titleSet = new Map();
  const companySet = new Map();
  const skillSet = new Map();
  const locationSet = new Map();

  jobs.forEach((j) => {
    const titleScore = fuzzyScore(q, j.title);
    if (titleScore > 30) {
      titleSet.set(j.title, Math.max(titleSet.get(j.title) || 0, titleScore));
    }
    const companyScore = fuzzyScore(q, j.company);
    if (companyScore > 30) {
      companySet.set(
        j.company,
        Math.max(companySet.get(j.company) || 0, companyScore),
      );
    }
    const locScore = fuzzyScore(q, j.location);
    if (locScore > 30) {
      locationSet.set(
        j.location,
        Math.max(locationSet.get(j.location) || 0, locScore),
      );
    }
    j.skills?.forEach((s) => {
      const score = fuzzyScore(q, s);
      if (score > 40) {
        skillSet.set(s, Math.max(skillSet.get(s) || 0, score));
      }
    });
  });

  const sortByScore = (m) =>
    [...m.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([v]) => v);

  return {
    titles: sortByScore(titleSet),
    companies: sortByScore(companySet),
    skills: sortByScore(skillSet),
    locations: sortByScore(locationSet),
  };
};

export const getLocationSuggestions = (query, jobs, limit = 6) => {
  const q = norm(query);
  if (!q) return [];
  const map = new Map();
  jobs.forEach((j) => {
    const score = fuzzyScore(q, j.location);
    if (score > 25) {
      map.set(j.location, Math.max(map.get(j.location) || 0, score));
    }
  });
  return [...map.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([v]) => v);
};

export const findSimilarJobs = (filters, jobs, limit = 6) => {
  const q = norm(filters.search);
  const loc = norm(filters.location);
  const company = norm(filters.company);

  const scored = jobs.map((j) => {
    let score = 0;
    if (q) {
      score += fuzzyScore(q, j.title) * 1.2;
      score += fuzzyScore(q, j.company) * 0.8;
      j.skills?.forEach((s) => {
        score += fuzzyScore(q, s) * 0.5;
      });
    }
    if (loc) score += fuzzyScore(loc, j.location) * 0.9;
    if (company) score += fuzzyScore(company, j.company) * 1.0;
    if (filters.experience && j.experience === filters.experience) score += 20;
    if (filters.jobTypes?.length && filters.jobTypes.includes(j.type)) score += 20;
    return { job: j, score };
  });

  return scored
    .filter((s) => s.score > 30)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((s) => s.job);
};

export const buildDidYouMean = (query, jobs) => {
  const q = norm(query);
  if (!q) return null;
  const candidates = new Set();
  jobs.forEach((j) => {
    candidates.add(j.title);
    candidates.add(j.company);
    j.skills?.forEach((s) => candidates.add(s));
  });
  let best = { value: null, score: 0 };
  candidates.forEach((c) => {
    const score = fuzzyScore(q, c);
    if (score > best.score && score < 100 && score > 50) {
      best = { value: c, score };
    }
  });
  return best.value;
};
