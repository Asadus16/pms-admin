/**
 * Owners Slice
 * Redux state management for owners
 */

import { createSlice } from '@reduxjs/toolkit';
import {
  fetchPropertyManagerOwners,
  fetchPropertyManagerOwnerById,
  createPropertyManagerOwner,
  updatePropertyManagerOwner,
  deletePropertyManagerOwner,
  updatePropertyManagerOwnerStatus,
} from '../../../thunks/property-manager/propertyManagerThunks';

const initialState = {
  owners: [],
  currentOwner: null,
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

const ownersSlice = createSlice({
  name: 'owners',
  initialState,
  reducers: {
    clearOwnersError: (state) => {
      state.error = null;
      state.validationErrors = null;
    },
    clearCurrentOwner: (state) => {
      state.currentOwner = null;
    },
    setOwnersPage: (state, action) => {
      state.pagination.currentPage = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Fetch Owners
    builder
      .addCase(fetchPropertyManagerOwners.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPropertyManagerOwners.fulfilled, (state, action) => {
        state.isLoading = false;
        // Handle Laravel pagination response
        const response = action.payload;
        if (response?.data) {
          state.owners = response.data;
          state.pagination = {
            currentPage: response.current_page || 1,
            totalPages: response.last_page || 1,
            totalItems: response.total || response.data.length,
            perPage: response.per_page || 50,
          };
        } else if (Array.isArray(response)) {
          state.owners = response;
          state.pagination.totalItems = response.length;
        } else {
          state.owners = [];
        }
      })
      .addCase(fetchPropertyManagerOwners.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error?.message || 'Failed to fetch owners';
      });

    // Fetch Owner By ID
    builder
      .addCase(fetchPropertyManagerOwnerById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPropertyManagerOwnerById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentOwner = action.payload?.data || action.payload;
      })
      .addCase(fetchPropertyManagerOwnerById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error?.message || 'Failed to fetch owner';
      });

    // Create Owner
    builder
      .addCase(createPropertyManagerOwner.pending, (state) => {
        state.isCreating = true;
        state.error = null;
        state.validationErrors = null;
      })
      .addCase(createPropertyManagerOwner.fulfilled, (state, action) => {
        state.isCreating = false;
        const newOwner = action.payload?.data || action.payload;
        if (newOwner) {
          // Ensure owners is an array before unshift
          if (!Array.isArray(state.owners)) {
            state.owners = [];
          }
          state.owners.unshift(newOwner);
          state.pagination.totalItems += 1;
        }
      })
      .addCase(createPropertyManagerOwner.rejected, (state, action) => {
        state.isCreating = false;
        state.error = action.error?.message || 'Failed to create owner';
        if (action.payload?.validationErrors) {
          state.validationErrors = action.payload.validationErrors;
        }
      });

    // Update Owner
    builder
      .addCase(updatePropertyManagerOwner.pending, (state) => {
        state.isUpdating = true;
        state.error = null;
        state.validationErrors = null;
      })
      .addCase(updatePropertyManagerOwner.fulfilled, (state, action) => {
        state.isUpdating = false;
        const updatedOwner = action.payload?.data || action.payload;
        if (updatedOwner && Array.isArray(state.owners)) {
          const index = state.owners.findIndex(o => o.id === updatedOwner.id);
          if (index !== -1) {
            state.owners[index] = updatedOwner;
          }
          if (state.currentOwner?.id === updatedOwner.id) {
            state.currentOwner = updatedOwner;
          }
        }
      })
      .addCase(updatePropertyManagerOwner.rejected, (state, action) => {
        state.isUpdating = false;
        state.error = action.error?.message || 'Failed to update owner';
        if (action.payload?.validationErrors) {
          state.validationErrors = action.payload.validationErrors;
        }
      });

    // Delete Owner
    builder
      .addCase(deletePropertyManagerOwner.pending, (state) => {
        state.isDeleting = true;
        state.error = null;
      })
      .addCase(deletePropertyManagerOwner.fulfilled, (state, action) => {
        state.isDeleting = false;
        const deletedId = action.meta.arg;
        if (Array.isArray(state.owners)) {
          state.owners = state.owners.filter(o => o.id !== deletedId);
        }
        state.pagination.totalItems = Math.max(0, state.pagination.totalItems - 1);
        if (state.currentOwner?.id === deletedId) {
          state.currentOwner = null;
        }
      })
      .addCase(deletePropertyManagerOwner.rejected, (state, action) => {
        state.isDeleting = false;
        state.error = action.error?.message || 'Failed to delete owner';
      });

    // Update Owner Status
    builder
      .addCase(updatePropertyManagerOwnerStatus.pending, (state) => {
        state.isUpdating = true;
        state.error = null;
      })
      .addCase(updatePropertyManagerOwnerStatus.fulfilled, (state, action) => {
        state.isUpdating = false;
        const updatedOwner = action.payload?.data || action.payload;
        if (updatedOwner && Array.isArray(state.owners)) {
          const index = state.owners.findIndex(o => o.id === updatedOwner.id);
          if (index !== -1) {
            state.owners[index] = updatedOwner;
          }
          if (state.currentOwner?.id === updatedOwner.id) {
            state.currentOwner = updatedOwner;
          }
        }
      })
      .addCase(updatePropertyManagerOwnerStatus.rejected, (state, action) => {
        state.isUpdating = false;
        state.error = action.error?.message || 'Failed to update owner status';
      });
  },
});

export const { clearOwnersError, clearCurrentOwner, setOwnersPage } = ownersSlice.actions;

// Selectors - Updated to use propertyManager namespace
export const selectOwners = (state) => state.propertyManager.owners.owners;
export const selectCurrentOwner = (state) => state.propertyManager.owners.currentOwner;
export const selectOwnersPagination = (state) => state.propertyManager.owners.pagination;
export const selectOwnersLoading = (state) => state.propertyManager.owners.isLoading;
export const selectOwnersCreating = (state) => state.propertyManager.owners.isCreating;
export const selectOwnersUpdating = (state) => state.propertyManager.owners.isUpdating;
export const selectOwnersDeleting = (state) => state.propertyManager.owners.isDeleting;
export const selectOwnersError = (state) => state.propertyManager.owners.error;
export const selectOwnersValidationErrors = (state) => state.propertyManager.owners.validationErrors;

export default ownersSlice.reducer;
