/**
 * Auth Redux Slice
 * Manages authentication state using Redux
 */

import { createSlice } from '@reduxjs/toolkit';
import { getRoleFromPath, isValidRole } from '@/lib/constants/roles';

/**
 * LocalStorage keys for authentication
 */
const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  AUTH_USER: 'auth_user',
  USER_ROLE: 'user_role',
  REMEMBER_ME: 'remember_me',
};

/**
 * Initialize user from localStorage
 */
const initializeUser = () => {
  if (typeof window === 'undefined') return null;
  try {
    const storedUser = localStorage.getItem(STORAGE_KEYS.AUTH_USER);
    if (!storedUser) return null;
    return JSON.parse(storedUser);
  } catch (error) {
    console.error('Error parsing user data from localStorage:', error);
    return null;
  }
};

/**
 * Initialize authentication state from localStorage
 */
const initializeAuthState = () => {
  if (typeof window === 'undefined') return false;
  const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
  const storedUser = localStorage.getItem(STORAGE_KEYS.AUTH_USER);
  return !!(token && storedUser);
};

/**
 * Sync token to cookie for middleware access
 */
const syncTokenToCookie = (token) => {
  if (typeof window === 'undefined') return;
  if (token) {
    const expires = new Date();
    expires.setTime(expires.getTime() + 30 * 24 * 60 * 60 * 1000);
    document.cookie = `auth_token=${token}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`;
  } else {
    document.cookie = 'auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  }
};

/**
 * Sync user role to cookie for middleware access
 */
const syncRoleToCookie = (role) => {
  if (typeof window === 'undefined') return;
  if (role) {
    const expires = new Date();
    expires.setTime(expires.getTime() + 30 * 24 * 60 * 60 * 1000);
    document.cookie = `user_role=${role}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`;
  } else {
    document.cookie = 'user_role=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  }
};

/**
 * Get current user role from state
 */
const getCurrentRoleFromState = (state) => {
  const { user } = state;
  
  // First, check if user has roles array with slug
  if (user?.roles && Array.isArray(user.roles) && user.roles.length > 0) {
    const roleSlug = user.roles[0].slug;
    if (isValidRole(roleSlug)) {
      return roleSlug;
    }
  }

  // Check if user has role field (for backward compatibility)
  if (user?.role && isValidRole(user.role)) {
    return user.role;
  }

  if (typeof window === 'undefined') return null;

  // Try localStorage
  const storedRole = localStorage.getItem(STORAGE_KEYS.USER_ROLE);
  if (storedRole && isValidRole(storedRole)) {
    return storedRole;
  }

  return null;
};

// Initialize state safely for SSR
const getInitialState = () => {
  if (typeof window === 'undefined') {
    // Server-side: return safe defaults
    return {
      isAuthenticated: false,
      user: null,
      isLoading: false,
      error: null,
      token: null,
    };
  }
  
  // Client-side: initialize from localStorage
  return {
    isAuthenticated: initializeAuthState(),
    user: initializeUser(),
    isLoading: false,
    error: null,
    token: localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN),
  };
};

const initialState = getInitialState();

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthenticated: (state, action) => {
      const { userData, token, role } = action.payload;
      
      state.isAuthenticated = true;
      state.user = userData;
      state.token = token;
      state.error = null;

      // Store in localStorage
      if (typeof window !== 'undefined') {
        if (token) {
          localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
          syncTokenToCookie(token);
        }
        if (userData) {
          localStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(userData));
        }
        if (role) {
          localStorage.setItem(STORAGE_KEYS.USER_ROLE, role);
          syncRoleToCookie(role);
        }
      }
    },
    clearAuth: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.error = null;

      // Clear localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
        localStorage.removeItem(STORAGE_KEYS.AUTH_USER);
        localStorage.removeItem(STORAGE_KEYS.USER_ROLE);
        localStorage.removeItem(STORAGE_KEYS.REMEMBER_ME);
        syncTokenToCookie(null);
        syncRoleToCookie(null);
      }
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setUser: (state, action) => {
      state.user = action.payload;
      if (action.payload) {
        state.isAuthenticated = true;
        if (typeof window !== 'undefined') {
          localStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(action.payload));
        }
      }
    },
    updateToken: (state, action) => {
      state.token = action.payload;
      if (typeof window !== 'undefined' && action.payload) {
        localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, action.payload);
        syncTokenToCookie(action.payload);
      }
    },
  },
  extraReducers: (builder) => {
    // Handle auth thunk states
    builder
      .addMatcher(
        (action) => action.type.startsWith('auth/') && action.type.endsWith('/pending'),
        (state) => {
          state.isLoading = true;
          state.error = null;
        }
      )
      .addMatcher(
        (action) => action.type.startsWith('auth/') && action.type.endsWith('/fulfilled'),
        (state) => {
          state.isLoading = false;
        }
      )
      .addMatcher(
        (action) => action.type.startsWith('auth/') && action.type.endsWith('/rejected'),
        (state, action) => {
          state.isLoading = false;
          state.error = action.error?.message || 'An error occurred';
        }
      );
  },
});

export const { setAuthenticated, clearAuth, setLoading, setError, setUser, updateToken } = authSlice.actions;

// Selectors
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectUser = (state) => state.auth.user;
export const selectIsLoading = (state) => state.auth.isLoading;
export const selectError = (state) => state.auth.error;
export const selectToken = (state) => state.auth.token;
export const selectCurrentRole = (state) => {
  const role = getCurrentRoleFromState(state.auth);
  return role;
};

export default authSlice.reducer;

