/**
 * Property Service Composable
 * 
 * Provides convenience methods for property management.
 * All state management is handled by the Pinia store (usePropertyStore).
 * 
 * @module composables/usePropertyService
 * 
 * @example
 * ```typescript
 * // Use store directly for state management
 * const store = usePropertyStore();
 * await store.fetchProperties();
 * 
 * // Use composable for convenience
 * const { fetchProperties } = usePropertyService();
 * await fetchProperties();
 * ```
 */

import { usePropertyStore } from '~/stores/property.store';

// Types should be imported directly from stores:
// import type { Property } from '~/stores/property.store';

export const usePropertyService = () => {
  const store = usePropertyStore();

  return {
    // Pinia Store (use this for all state management)
    store,

    // Convenience methods that delegate to store
    fetchProperties: (params?: Record<string, any>) =>
      store.fetchProperties(params),
    fetchManagingProperties: () => store.fetchManagingProperties(),
    fetchProperty: (id: string | number) => store.fetchProperty(id),
    createDraftProperty: () => store.createDraftProperty(),
    createProperty: (data: Record<string, any>) =>
      store.createProperty(data),
    updateProperty: (id: string | number, data: Record<string, any>) =>
      store.updateProperty(id, data),
    deleteProperty: (id: string | number) => store.deleteProperty(id),
  };
};
