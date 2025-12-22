/**
 * Property Manager Inventory Service Composable
 * 
 * Provides convenience methods for property manager inventory management.
 * All state management is handled by the Pinia store (usePropertyManagerInventoryStore).
 * 
 * @module composables/usePropertyManagerInventoryService
 * 
 * @example
 * ```typescript
 * // Use store directly for state management
 * const store = usePropertyManagerInventoryStore();
 * await store.fetchInventory();
 * 
 * // Use composable for convenience
 * const { fetchInventory } = usePropertyManagerInventoryService();
 * await fetchInventory();
 * ```
 */

import {
  usePropertyManagerInventoryStore,
  type PropertyManagerInventory,
} from '~/stores/property-manager-inventory.store';

// Types should be imported directly from stores:
// import type { PropertyManagerInventory, InventoryForm, InventoryFilters, PropertyOption } from '~/stores/property-manager-inventory.store';

export const usePropertyManagerInventoryService = () => {
  const store = usePropertyManagerInventoryStore();

  return {
    // Pinia Store (use this for all state management)
    store,

    // Convenience methods that delegate to store
    fetchInventory: (params?: Record<string, any>) => store.fetchInventory(params),
    fetchInventoryById: (id: string | number) => store.fetchInventoryById(id),
    createInventory: (formData: FormData) => store.createInventory(formData),
    updateInventory: (id: string | number, formData: FormData) => store.updateInventory(id, formData),
    deleteInventory: (id: string | number) => store.deleteInventory(id),
    prepareFormData: () => store.prepareFormData(),
    loadFormFromInventory: (inventory: PropertyManagerInventory) => store.loadFormFromInventory(inventory),
    setUploadedImage: (file: File | null) => store.setUploadedImage(file),
    resetForm: () => store.resetForm(),
    updateFilters: (filters: Partial<InventoryFilters>) => store.updateFilters(filters),
    clearFilters: () => store.clearFilters(),
    fetchProperties: () => store.fetchProperties(),
  };
};

