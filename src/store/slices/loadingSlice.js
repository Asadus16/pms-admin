/**
 * Loading Redux Slice
 * Manages global loading state for API calls and other async operations
 */

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isLoading: false,
  loadingCount: 0, // Track number of concurrent requests
  progress: 0, // Progress percentage (0-100)
};

const loadingSlice = createSlice({
  name: 'loading',
  initialState,
  reducers: {
    startLoading: (state) => {
      state.loadingCount += 1;
      state.isLoading = true;
      state.progress = 0;
    },
    setProgress: (state, action) => {
      state.progress = Math.min(100, Math.max(0, action.payload));
    },
    finishLoading: (state) => {
      state.loadingCount = Math.max(0, state.loadingCount - 1);
      if (state.loadingCount === 0) {
        state.isLoading = false;
        state.progress = 100;
      }
    },
    resetLoading: (state) => {
      state.isLoading = false;
      state.loadingCount = 0;
      state.progress = 0;
    },
  },
});

export const { startLoading, setProgress, finishLoading, resetLoading } = loadingSlice.actions;

// Selectors
export const selectIsLoading = (state) => state.loading.isLoading;
export const selectLoadingCount = (state) => state.loading.loadingCount;
export const selectProgress = (state) => state.loading.progress;

export default loadingSlice.reducer;

