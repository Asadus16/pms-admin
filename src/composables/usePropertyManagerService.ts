/**
 * Property Manager Service Composable (for Owners)
 * 
 * Provides convenience methods for property manager management.
 * All state management is handled by the Pinia store (usePropertyManagerStore).
 * 
 * @module composables/usePropertyManagerService
 * 
 * @example
 * ```typescript
 * // Use store directly for state management
 * const store = usePropertyManagerStore();
 * await store.fetchPropertyManagers();
 * 
 * // Use composable for convenience
 * const { fetchPropertyManagers } = usePropertyManagerService();
 * await fetchPropertyManagers();
 * ```
 */

import {
  usePropertyManagerStore,
} from '~/stores/property-manager.store';

// Types should be imported directly from stores:
// import type { PropertyManager, ConnectionRequest } from '~/stores/property-manager.store';

export const usePropertyManagerService = () => {
  const store = usePropertyManagerStore();

  return {
    // Pinia Store (use this for all state management)
    store,

    // Convenience methods that delegate to store
    fetchPropertyManagers: (params?: Record<string, any>) =>
      store.fetchPropertyManagers(params),
    fetchPropertyManagerById: (id: string | number) =>
      store.fetchPropertyManagerById(id),
    sendPropertyManagerRequest: (data: Record<string, any>) =>
      store.sendPropertyManagerRequest(data),
    fetchPropertyManagerConnectionRequests: (params?: Record<string, any>) =>
      store.fetchPropertyManagerConnectionRequests(params),
    updatePropertyManagerRequestStatus: (
      id: string | number,
      status: 'accepted' | 'denied'
    ) => store.updatePropertyManagerRequestStatus(id, status),
  };
};
