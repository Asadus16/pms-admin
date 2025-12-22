/**
 * Redux Store Configuration
 * Central store for the application using Redux Toolkit
 */

import { configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import authReducer from './slices/authSlice.js';
import loadingReducer from './slices/loadingSlice.js';
import ownersReducer from './slices/ownersSlice.js';
import contactsReducer from './slices/contactsSlice.js';
import inventoryReducer from './slices/inventorySlice.js';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        loading: loadingReducer,
        owners: ownersReducer,
        contacts: contactsReducer,
        inventory: inventoryReducer,
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

