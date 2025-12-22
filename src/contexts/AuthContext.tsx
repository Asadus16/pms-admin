'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { getRoleFromPath, isValidRole, type UserRoleType, ROLE_LOGIN_PATHS, UserRole } from '@/composables/roles';

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
 * User entity interface
 */
export interface User {
  id: string | number;
  name: string;
  email?: string;
  phone?: string;
  role?: UserRoleType;
  roles?: Array<{ slug: string; [key: string]: any }>;
  [key: string]: any;
}

/**
 * Auth Context Interface
 */
interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  error: string | null;
  currentRole: UserRoleType | null;
  checkAuth: () => Promise<boolean>;
  setAuthenticated: (userData: any, token?: string, role?: UserRoleType) => void;
  clearAuth: () => void;
  setError: (error: string | null) => void;
  setLoading: (loading: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Initialize user from localStorage
 */
const initializeUser = (): User | null => {
  if (typeof window === 'undefined') return null;

  try {
    const storedUser = localStorage.getItem(STORAGE_KEYS.AUTH_USER);
    if (!storedUser) return null;
    return JSON.parse(storedUser) as User;
  } catch (error) {
    console.error('Error parsing user data from localStorage:', error);
    return null;
  }
};

/**
 * Sync token to cookie for middleware access
 */
const syncTokenToCookie = (token: string | null) => {
  if (typeof window === 'undefined') return;
  
  if (token) {
    // Set cookie with 30 days expiration
    const expires = new Date();
    expires.setTime(expires.getTime() + 30 * 24 * 60 * 60 * 1000);
    document.cookie = `auth_token=${token}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`;
  } else {
    // Remove cookie
    document.cookie = 'auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  }
};

/**
 * Sync user role to cookie for middleware access
 */
const syncRoleToCookie = (role: string | null) => {
  if (typeof window === 'undefined') return;
  
  if (role) {
    // Set cookie with 30 days expiration
    const expires = new Date();
    expires.setTime(expires.getTime() + 30 * 24 * 60 * 60 * 1000);
    document.cookie = `user_role=${role}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`;
  } else {
    // Remove cookie
    document.cookie = 'user_role=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  }
};

/**
 * Initialize authentication state from localStorage
 */
const initializeAuthState = (): boolean => {
  if (typeof window === 'undefined') return false;

  const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
  const storedUser = localStorage.getItem(STORAGE_KEYS.AUTH_USER);
  
  // Sync token to cookie on initialization
  if (token) {
    syncTokenToCookie(token);
  }
  
  return !!(token && storedUser);
};

/**
 * Auth Provider Component
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(initializeAuthState);
  const [user, setUser] = useState<User | null>(initializeUser);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const pathname = usePathname();
  const router = useRouter();

  /**
   * Get current user role
   * Priority: user.roles[0].slug > user.role > localStorage > route inference
   */
  const currentRole = React.useMemo((): UserRoleType | null => {
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

    // Try to infer from route
    return getRoleFromPath(pathname);
  }, [user, pathname]);

  /**
   * Verify authentication status via API
   */
  const checkAuth = useCallback(async (timeout: number = 5000): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      const token = typeof window !== 'undefined'
        ? localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN)
        : null;

      if (!token) {
        clearAuthState();
        return false;
      }

      // Dynamic import to avoid SSR issues
      if (typeof window === 'undefined') {
        setIsLoading(false);
        return false;
      }
      
      const { useApi } = await import('@/composables/useApi');
      const api = useApi();

      // Create timeout promise
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Auth check timeout')), timeout);
      });

      // Race between API call and timeout
      const response = await Promise.race([
        api.get('/auth/user', {
          showNotification: false,
          showProgress: false,
          returnRaw: true,
        }),
        timeoutPromise,
      ]) as any;

      // Handle response structure: { message, data: { user, company } }
      let userData = null;

      if (response?.data?.user) {
        userData = response.data.user;
      } else if (response?.user) {
        userData = response.user;
      } else if (response?.id || response?.email) {
        userData = response;
      }

      if (!userData) {
        throw new Error('Invalid user data structure in API response');
      }

      // Extract role from roles array (roles[0].slug)
      let userRole: UserRoleType | undefined = undefined;
      if (userData?.roles && Array.isArray(userData.roles) && userData.roles.length > 0) {
        const roleSlug = userData.roles[0].slug;
        if (isValidRole(roleSlug)) {
          userRole = roleSlug;
          userData.role = roleSlug;
        }
      }

      setIsAuthenticated(true);
      setUser(userData);

      if (typeof window !== 'undefined' && userData) {
        localStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(userData));
        if (userRole) {
          localStorage.setItem(STORAGE_KEYS.USER_ROLE, userRole);
          syncRoleToCookie(userRole);
        }
        // Sync token to cookie (token should already be in localStorage from login)
        const existingToken = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
        if (existingToken) {
          syncTokenToCookie(existingToken);
        }
      }

      return true;
    } catch (error: any) {
      // Don't clear auth state on timeout - keep cached state
      // Only clear on actual auth failure (401, etc.)
      if (error?.status === 401 || error?.statusCode === 401) {
        clearAuthState();
      }
      setError(error.message || 'Authentication failed');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Set authenticated state after successful login
   */
  const setAuthenticated = useCallback((
    userData: any,
    token?: string,
    role?: UserRoleType
  ): void => {
    const extractedUser = userData?.user || userData;

    // Extract role from roles array if not provided
    let userRole = role;
    if (!userRole && extractedUser?.roles && Array.isArray(extractedUser.roles) && extractedUser.roles.length > 0) {
      const roleSlug = extractedUser.roles[0].slug;
      if (isValidRole(roleSlug)) {
        userRole = roleSlug;
        extractedUser.role = roleSlug;
      }
    }

    setIsAuthenticated(true);
    setUser(extractedUser);

    if (typeof window !== 'undefined') {
      if (token) {
        localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
        syncTokenToCookie(token); // Sync to cookie for middleware
      }
      if (extractedUser) {
        localStorage.setItem(
          STORAGE_KEYS.AUTH_USER,
          JSON.stringify(extractedUser)
        );
      }
      if (userRole) {
        localStorage.setItem(STORAGE_KEYS.USER_ROLE, userRole);
        syncRoleToCookie(userRole); // Sync to cookie for middleware
      }
    }
  }, []);

  /**
   * Clear authentication state (internal helper)
   */
  const clearAuthState = useCallback((): void => {
    setIsAuthenticated(false);
    setUser(null);
    setError(null);
  }, []);

  /**
   * Clear authentication state and localStorage
   */
  const clearAuth = useCallback((): void => {
    clearAuthState();

    if (typeof window !== 'undefined') {
      Object.values(STORAGE_KEYS).forEach((key) => {
        localStorage.removeItem(key);
      });
      syncTokenToCookie(null); // Clear cookie
      syncRoleToCookie(null); // Clear role cookie
    }
  }, [clearAuthState]);

  /**
   * Set loading state
   */
  const setLoading = useCallback((loading: boolean): void => {
    setIsLoading(loading);
  }, []);

  /**
   * Handle automatic logout when token is removed from localStorage
   * This effect monitors localStorage for token removal and automatically logs out the user
   */
  useEffect(() => {
    if (typeof window === 'undefined') return;

    let isLoggingOut = false; // Flag to prevent multiple logout calls

    // Check if token is missing and user is authenticated
    const checkTokenAndLogout = () => {
      if (isLoggingOut) return; // Prevent multiple calls
      
      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      if (!token && isAuthenticated) {
        isLoggingOut = true;
        // Token was removed, clear auth state
        clearAuth();
        // Redirect to root page if on a protected route
        const currentPath = pathname || window.location.pathname;
        if (currentPath && currentPath.includes('/dashboard')) {
          router.push('/');
        }
        isLoggingOut = false;
      }
    };

    // Check on mount if token is missing
    checkTokenAndLogout();

    // Listen for storage changes (token removal from other tabs/windows)
    // Note: storage event only fires for changes from other tabs/windows, not same tab
    const handleStorageChange = (e: StorageEvent) => {
      // Check if auth_token was removed
      if (e.key === STORAGE_KEYS.AUTH_TOKEN && e.newValue === null && e.oldValue !== null) {
        checkTokenAndLogout();
      }
      
      // Also check if any storage change occurred and token is now missing
      if (e.key === STORAGE_KEYS.AUTH_TOKEN || e.key === null) {
        checkTokenAndLogout();
      }
    };

    // Listen for storage events (cross-tab communication)
    window.addEventListener('storage', handleStorageChange);

    // Also check periodically if token is still present
    // (handles cases where token is removed programmatically in the same tab)
    // The storage event doesn't fire for same-tab changes, so we need periodic checks
    const tokenCheckInterval = setInterval(() => {
      checkTokenAndLogout();
    }, 1000); // Check every second

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(tokenCheckInterval);
    };
  }, [isAuthenticated, pathname, router, clearAuth]);

  const value: AuthContextType = {
    isAuthenticated,
    user,
    isLoading,
    error,
    currentRole,
    checkAuth,
    setAuthenticated,
    clearAuth,
    setError,
    setLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Hook to use auth context
 */
export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
}

