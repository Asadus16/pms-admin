'use client';

/**
 * Authentication State Composable
 * 
 * Provides convenience methods and computed properties for authentication.
 * All state management is handled by the Auth Context.
 * 
 * @module composables/useAuthState
 */

import { useAuthContext } from '@/contexts/AuthContext';
import type { UserRoleType } from './roles';

export const useAuthState = () => {
  const context = useAuthContext();

  return {
    // Context (use this for all state management)
    context,

    // Computed getters (readonly reactive)
    isAuthenticated: context.isAuthenticated,
    user: context.user,
    isLoading: context.isLoading,
    currentRole: context.currentRole,

    // Convenience methods that delegate to context
    checkAuth: () => context.checkAuth(),
    setAuthenticated: (
      userData: any,
      token?: string,
      role?: UserRoleType
    ) => context.setAuthenticated(userData, token, role),
    clearAuth: () => context.clearAuth(),
    getCurrentRole: () => context.currentRole,
  };
};
