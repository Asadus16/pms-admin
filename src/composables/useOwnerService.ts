/**
 * Owner Service Composable (for Property Managers)
 * 
 * Provides convenience methods for owner management.
 * All state management is handled by the Pinia store (useOwnerStore).
 * 
 * @module composables/useOwnerService
 * 
 * @example
 * ```typescript
 * // Use store directly for state management
 * const store = useOwnerStore();
 * await store.fetchOwners();
 * 
 * // Use composable for convenience
 * const { fetchOwners } = useOwnerService();
 * await fetchOwners();
 * ```
 */

import {
  useOwnerStore,
} from '~/stores/owner.store';

// Types should be imported directly from stores:
// import type { Owner, ConnectionRequest } from '~/stores/owner.store';

export const useOwnerService = () => {
  const store = useOwnerStore();

  return {
    // Pinia Store (use this for all state management)
    store,

    // Convenience methods that delegate to store
    fetchOwners: (params?: Record<string, any>) => store.fetchOwners(params),
    fetchOwnerById: (id: string | number) => store.fetchOwnerById(id),
    fetchConnectedOwners: () => store.fetchConnectedOwners(),
    sendOwnerRequest: (data: Record<string, any>) =>
      store.sendOwnerRequest(data),
    fetchConnectionOwnerRequests: (params?: Record<string, any>) =>
      store.fetchConnectionOwnerRequests(params),
    updateOwnerConnectionRequestStatus: (
      id: string | number,
      status: 'accepted' | 'denied'
    ) => store.updateOwnerConnectionRequestStatus(id, status),
    removeOwner: (requestId: string | number) => store.removeOwner(requestId),
  };
};
