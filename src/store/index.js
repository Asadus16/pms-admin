/**
 * Redux Store Configuration
 * Central store for the application using Redux Toolkit
 */

import { configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import authReducer from './slices/authSlice.js';
import loadingReducer from './slices/loadingSlice.js';

// Import reducers (will be created)
// import propertyManagerReducer from './slices/propertyManagerSlice';
// import ownerReducer from './slices/ownerSlice';
// etc.

export const store = configureStore({
    reducer: {
        auth: authReducer,
        loading: loadingReducer,
        // Add reducers here as they are created
        // propertyManager: propertyManagerReducer,
        // owner: ownerReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                // Ignore these action types
                ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
            },
        }),
});

// Typed hooks for use throughout the app
export const useAppDispatch = () => useDispatch();
export const useAppSelector = useSelector;

