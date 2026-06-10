import { createSlice } from '@reduxjs/toolkit';
import { storage } from '../utils/storage.js';

const initialState = {
  search: '',
  location: '',
  company: '',
  jobTypes: [],
  experience: '',
  salaryMin: 0,
  salaryMax: 400000,
  sortBy: 'recent',
  realOnly: false,
  searchHistory: storage.get('searchHistory', []),
};

const filterSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    setSearch(state, action) {
      state.search = action.payload;
    },
    setLocation(state, action) {
      state.location = action.payload;
    },
    setCompany(state, action) {
      state.company = action.payload;
    },
    toggleJobType(state, action) {
      const t = action.payload;
      state.jobTypes = state.jobTypes.includes(t)
        ? state.jobTypes.filter((x) => x !== t)
        : [...state.jobTypes, t];
    },
    setExperience(state, action) {
      state.experience = action.payload;
    },
    setSalaryRange(state, action) {
      state.salaryMin = action.payload.min;
      state.salaryMax = action.payload.max;
    },
    setSortBy(state, action) {
      state.sortBy = action.payload;
    },
    toggleRealOnly(state) {
      state.realOnly = !state.realOnly;
    },
    resetFilters(state) {
      state.search = '';
      state.location = '';
      state.company = '';
      state.jobTypes = [];
      state.experience = '';
      state.salaryMin = 0;
      state.salaryMax = 400000;
      state.sortBy = 'recent';
      state.realOnly = false;
    },
    addSearchHistory(state, action) {
      const term = String(action.payload || '').trim();
      if (!term) return;
      state.searchHistory = [
        term,
        ...state.searchHistory.filter((t) => t.toLowerCase() !== term.toLowerCase()),
      ].slice(0, 8);
      storage.set('searchHistory', state.searchHistory);
    },
    clearSearchHistory(state) {
      state.searchHistory = [];
      storage.set('searchHistory', []);
    },
  },
});

export const {
  setSearch,
  setLocation,
  setCompany,
  toggleJobType,
  setExperience,
  setSalaryRange,
  setSortBy,
  toggleRealOnly,
  resetFilters,
  addSearchHistory,
  clearSearchHistory,
} = filterSlice.actions;
export default filterSlice.reducer;
