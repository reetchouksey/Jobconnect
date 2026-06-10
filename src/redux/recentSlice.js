import { createSlice } from '@reduxjs/toolkit';
import { storage } from '../utils/storage.js';

const initialState = {
  items: storage.get('recentlyViewed', []),
};

const recentSlice = createSlice({
  name: 'recent',
  initialState,
  reducers: {
    addRecentlyViewed(state, action) {
      const job = action.payload;
      state.items = [
        { ...job, viewedAt: new Date().toISOString() },
        ...state.items.filter((j) => j.id !== job.id),
      ].slice(0, 8);
      storage.set('recentlyViewed', state.items);
    },
    clearRecent(state) {
      state.items = [];
      storage.set('recentlyViewed', []);
    },
  },
});

export const { addRecentlyViewed, clearRecent } = recentSlice.actions;
export default recentSlice.reducer;
