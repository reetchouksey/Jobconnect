import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { fuzzyMatch } from '../utils/search.js';

export default function useFilteredJobs() {
  const jobs = useSelector((s) => s.jobs.items);
  const f = useSelector((s) => s.filters);

  return useMemo(() => {
    let list = [...jobs];

    if (f.search) {
      list = list.filter(
        (j) =>
          fuzzyMatch(f.search, j.title) ||
          fuzzyMatch(f.search, j.company) ||
          j.skills?.some((s) => fuzzyMatch(f.search, s)) ||
          fuzzyMatch(f.search, j.description),
      );
    }
    if (f.location) {
      list = list.filter((j) => fuzzyMatch(f.location, j.location));
    }
    if (f.company) {
      list = list.filter((j) => fuzzyMatch(f.company, j.company));
    }
    if (f.jobTypes.length) {
      list = list.filter((j) => f.jobTypes.includes(j.type));
    }
    if (f.experience) {
      list = list.filter((j) => j.experience === f.experience);
    }
    if (f.realOnly) {
      list = list.filter((j) => j.isReal);
    }
    list = list.filter((j) => {
      const min = j.salaryMin || 0;
      const max = j.salaryMax || min;
      return max >= f.salaryMin && min <= f.salaryMax;
    });

    if (f.sortBy === 'recent') {
      list.sort((a, b) => new Date(b.postedAt) - new Date(a.postedAt));
    } else if (f.sortBy === 'salary-high') {
      list.sort((a, b) => (b.salaryMax || 0) - (a.salaryMax || 0));
    } else if (f.sortBy === 'salary-low') {
      list.sort((a, b) => (a.salaryMin || 0) - (b.salaryMin || 0));
    } else if (f.sortBy === 'company') {
      list.sort((a, b) => a.company.localeCompare(b.company));
    }

    return list;
  }, [jobs, f]);
}
