'use client';

/**
 * AuthSync Component
 * Handles authentication state synchronization and auto-logout
 * Replaces the functionality of AuthProvider
 */

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store';
import { clearAuth, selectIsAuthenticated, selectCurrentRole } from '@/store/slices/authSlice';
import { getCurrentUser } from '@/store/thunks';

const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_ROLE: 'user_role',
};

export function AuthSync({ children }) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const currentRole = useAppSelector(selectCurrentRole);

  /**
   * Check authentication status on mount and periodically
   */
  useEffect(() => {
    if (typeof window === 'undefined') return;

    let isLoggingOut = false;

    const checkTokenAndLogout = () => {
      if (isLoggingOut) return;
      
      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      if (!token && isAuthenticated) {
        isLoggingOut = true;
        dispatch(clearAuth());
        const currentPath = pathname || window.location.pathname;
        if (currentPath && currentPath.includes('/dashboard')) {
          router.push('/');
        }
        isLoggingOut = false;
      }
    };

    // Check immediately
    checkTokenAndLogout();

    // Listen for storage changes (cross-tab/window logout)
    const handleStorageChange = (e) => {
      if (e.key === STORAGE_KEYS.AUTH_TOKEN && e.newValue === null && e.oldValue !== null) {
        checkTokenAndLogout();
      }
      if (e.key === STORAGE_KEYS.AUTH_TOKEN || e.key === null) {
        checkTokenAndLogout();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    // Periodic check
    const tokenCheckInterval = setInterval(() => {
      checkTokenAndLogout();
    }, 1000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(tokenCheckInterval);
    };
  }, [isAuthenticated, pathname, router, dispatch]);

  /**
   * Check auth status on mount if authenticated
   */
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    if (token && isAuthenticated) {
      // Optionally verify token is still valid
      // dispatch(getCurrentUser());
    }
  }, []);

  return <>{children}</>;
}

