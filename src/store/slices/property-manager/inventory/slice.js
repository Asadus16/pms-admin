/**
 * Inventory Slice
 * Redux state management for inventory
 */

import { createSlice } from '@reduxjs/toolkit';
import {
  fetchPropertyManagerInventories,
  fetchPropertyManagerInventoryById,
  createPropertyManagerInventory,
  updatePropertyManagerInventory,
  deletePropertyManagerInventory,
} from '../../../thunks/property-manager/propertyManagerThunks';

const initialState = {
  inventories: [],
  currentInventory: null,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    perPage: 50,
  },
  isLoading: false,
  isCreating: false,
  isUpdating: false,
  isDeleting: false,
  error: null,
  validationErrors: null,
};

const inventorySlice = createSlice({
  name: 'inventory',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
      state.validationErrors = null;
    },
    clearCurrentInventory: (state) => {
      state.currentInventory = null;
    },
    setCurrentPage: (state, action) => {
      state.pagination.currentPage = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Fetch Inventories
    builder
      .addCase(fetchPropertyManagerInventories.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPropertyManagerInventories.fulfilled, (state, action) => {
        state.isLoading = false;
        // Handle Laravel pagination response
        const response = action.payload;
        if (response?.data) {
          state.inventories = response.data;
          state.pagination = {
            currentPage: response.current_page || 1,
            totalPages: response.last_page || 1,
            totalItems: response.total || response.data.length,
            perPage: response.per_page || 50,
          };
        } else if (Array.isArray(response)) {
          state.inventories = response;
          state.pagination.totalItems = response.length;
        } else {
          state.inventories = [];
        }
      })
      .addCase(fetchPropertyManagerInventories.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error?.message || 'Failed to fetch inventory';
      });

    // Fetch Inventory By ID
    builder
      .addCase(fetchPropertyManagerInventoryById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPropertyManagerInventoryById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentInventory = action.payload?.data || action.payload;
      })
      .addCase(fetchPropertyManagerInventoryById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error?.message || 'Failed to fetch inventory item';
      });

    // Create Inventory
    builder
      .addCase(createPropertyManagerInventory.pending, (state) => {
        state.isCreating = true;
        state.error = null;
        state.validationErrors = null;
      })
      .addCase(createPropertyManagerInventory.fulfilled, (state, action) => {
        state.isCreating = false;
        const newInventory = action.payload?.data || action.payload;
        if (newInventory) {
          // Ensure inventories is an array before unshift
          if (!Array.isArray(state.inventories)) {
            state.inventories = [];
          }
          state.inventories.unshift(newInventory);
          state.pagination.totalItems += 1;
        }
      })
      .addCase(createPropertyManagerInventory.rejected, (state, action) => {
        state.isCreating = false;
        state.error = action.error?.message || 'Failed to create inventory item';
        if (action.payload?.validationErrors) {
          state.validationErrors = action.payload.validationErrors;
        }
      });

    // Update Inventory
    builder
      .addCase(updatePropertyManagerInventory.pending, (state) => {
        state.isUpdating = true;
        state.error = null;
        state.validationErrors = null;
      })
      .addCase(updatePropertyManagerInventory.fulfilled, (state, action) => {
        state.isUpdating = false;
        const updatedInventory = action.payload?.data || action.payload;
        if (updatedInventory && Array.isArray(state.inventories)) {
          const index = state.inventories.findIndex(i => i.id === updatedInventory.id);
          if (index !== -1) {
            state.inventories[index] = updatedInventory;
          }
          if (state.currentInventory?.id === updatedInventory.id) {
            state.currentInventory = updatedInventory;
          }
        }
      })
      .addCase(updatePropertyManagerInventory.rejected, (state, action) => {
        state.isUpdating = false;
        state.error = action.error?.message || 'Failed to update inventory item';
        if (action.payload?.validationErrors) {
          state.validationErrors = action.payload.validationErrors;
        }
      });

    // Delete Inventory
    builder
      .addCase(deletePropertyManagerInventory.pending, (state) => {
        state.isDeleting = true;
        state.error = null;
      })
      .addCase(deletePropertyManagerInventory.fulfilled, (state, action) => {
        state.isDeleting = false;
        const deletedId = action.meta.arg;
        if (Array.isArray(state.inventories)) {
          state.inventories = state.inventories.filter(i => i.id !== deletedId);
        }
        state.pagination.totalItems = Math.max(0, state.pagination.totalItems - 1);
        if (state.currentInventory?.id === deletedId) {
          state.currentInventory = null;
        }
      })
      .addCase(deletePropertyManagerInventory.rejected, (state, action) => {
        state.isDeleting = false;
        state.error = action.error?.message || 'Failed to delete inventory item';
      });
  },
});

export const { clearError, clearCurrentInventory, setCurrentPage } = inventorySlice.actions;

// Selectors - Updated to use propertyManager namespace
export const selectInventories = (state) => state.propertyManager.inventory.inventories;
export const selectCurrentInventory = (state) => state.propertyManager.inventory.currentInventory;
export const selectInventoryPagination = (state) => state.propertyManager.inventory.pagination;
export const selectInventoryLoading = (state) => state.propertyManager.inventory.isLoading;
export const selectInventoryCreating = (state) => state.propertyManager.inventory.isCreating;
export const selectInventoryUpdating = (state) => state.propertyManager.inventory.isUpdating;
export const selectInventoryDeleting = (state) => state.propertyManager.inventory.isDeleting;
export const selectInventoryError = (state) => state.propertyManager.inventory.error;
export const selectInventoryValidationErrors = (state) => state.propertyManager.inventory.validationErrors;

export default inventorySlice.reducer;
