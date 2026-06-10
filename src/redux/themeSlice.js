import { createSlice } from '@reduxjs/toolkit';
import { storage } from '../utils/storage.js';

const getInitialTheme = () => {
  const saved = storage.get('theme');
  if (saved === 'dark' || saved === 'light') return saved;
  return 'light';
};

const initialState = {
  mode: getInitialTheme(),
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    toggleTheme(state) {
      state.mode = state.mode === 'dark' ? 'light' : 'dark';
      storage.set('theme', state.mode);
    },
    setTheme(state, action) {
      state.mode = action.payload;
      storage.set('theme', state.mode);
    },
  },
});

export const { toggleTheme, setTheme } = themeSlice.actions;
export default themeSlice.reducer;
