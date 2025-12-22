/**
 * Owner Inventory Service Composable
 * 
 * Provides convenience methods for owner inventory management.
 * All state management is handled by the Pinia store (useOwnerInventoryStore).
 * 
 * @module composables/useOwnerInventoryService
 */

import {
  useOwnerInventoryStore,
  type PropertyManagerInventory,
} from '~/stores/owner-inventory.store';

// Types should be imported directly from stores:
// import type { PropertyManagerInventory, InventoryForm, InventoryFilters, PropertyOption } from '~/stores/owner-inventory.store';

export const useOwnerInventoryService = () => {
  const store = useOwnerInventoryStore();

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

