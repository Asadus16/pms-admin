/**
 * Tenancy Contracts Slice
 * Redux state management for tenancy contracts
 */

import { createSlice } from '@reduxjs/toolkit';
import {
  fetchPropertyManagerTenancyContracts,
  fetchPropertyManagerTenancyContractById,
  createPropertyManagerTenancyContract,
  updatePropertyManagerTenancyContract,
  deletePropertyManagerTenancyContract,
} from '../../../thunks/property-manager/propertyManagerThunks';

const initialState = {
  tenancyContracts: [],
  currentTenancyContract: null,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    perPage: 15,
  },
  isLoading: false,
  isCreating: false,
  isUpdating: false,
  isDeleting: false,
  error: null,
  validationErrors: null,
};

const tenancyContractsSlice = createSlice({
  name: 'tenancyContracts',
  initialState,
  reducers: {
    clearTenancyContractsError: (state) => {
      state.error = null;
      state.validationErrors = null;
    },
    clearCurrentTenancyContract: (state) => {
      state.currentTenancyContract = null;
    },
    setTenancyContractsPage: (state, action) => {
      state.pagination.currentPage = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Fetch Tenancy Contracts
    builder
      .addCase(fetchPropertyManagerTenancyContracts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPropertyManagerTenancyContracts.fulfilled, (state, action) => {
        state.isLoading = false;
        // Handle Laravel pagination response
        const response = action.payload;
        if (response?.data?.data) {
          // Nested data structure: payload.data.data
          state.tenancyContracts = response.data.data;
          state.pagination = {
            currentPage: response.data.current_page || 1,
            totalPages: response.data.last_page || 1,
            totalItems: response.data.total || response.data.data.length,
            perPage: response.data.per_page || 15,
          };
        } else if (response?.data) {
          state.tenancyContracts = response.data;
          state.pagination = {
            currentPage: response.current_page || 1,
            totalPages: response.last_page || 1,
            totalItems: response.total || response.data.length,
            perPage: response.per_page || 15,
          };
        } else if (Array.isArray(response)) {
          state.tenancyContracts = response;
          state.pagination.totalItems = response.length;
        } else {
          state.tenancyContracts = [];
        }
      })
      .addCase(fetchPropertyManagerTenancyContracts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error?.message || 'Failed to fetch tenancy contracts';
      });

    // Fetch Tenancy Contract By ID
    builder
      .addCase(fetchPropertyManagerTenancyContractById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPropertyManagerTenancyContractById.fulfilled, (state, action) => {
        state.isLoading = false;
        // Handle nested response structure
        const response = action.payload;
        if (response?.payload?.data) {
          state.currentTenancyContract = response.payload.data;
        } else if (response?.data) {
          state.currentTenancyContract = response.data;
        } else {
          state.currentTenancyContract = response;
        }
      })
      .addCase(fetchPropertyManagerTenancyContractById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error?.message || 'Failed to fetch tenancy contract';
      });

    // Create Tenancy Contract
    builder
      .addCase(createPropertyManagerTenancyContract.pending, (state) => {
        state.isCreating = true;
        state.error = null;
        state.validationErrors = null;
      })
      .addCase(createPropertyManagerTenancyContract.fulfilled, (state, action) => {
        state.isCreating = false;
        const response = action.payload;
        const newContract = response?.data || response;
        if (newContract) {
          // Ensure tenancyContracts is an array before unshift
          if (!Array.isArray(state.tenancyContracts)) {
            state.tenancyContracts = [];
          }
          state.tenancyContracts.unshift(newContract);
          state.pagination.totalItems += 1;
        }
      })
      .addCase(createPropertyManagerTenancyContract.rejected, (state, action) => {
        state.isCreating = false;
        state.error = action.error?.message || 'Failed to create tenancy contract';
        if (action.payload?.validationErrors) {
          state.validationErrors = action.payload.validationErrors;
        }
      });

    // Update Tenancy Contract
    builder
      .addCase(updatePropertyManagerTenancyContract.pending, (state) => {
        state.isUpdating = true;
        state.error = null;
        state.validationErrors = null;
      })
      .addCase(updatePropertyManagerTenancyContract.fulfilled, (state, action) => {
        state.isUpdating = false;
        const response = action.payload;
        const updatedContract = response?.data || response;
        if (updatedContract && Array.isArray(state.tenancyContracts)) {
          const index = state.tenancyContracts.findIndex(c => c.id === updatedContract.id);
          if (index !== -1) {
            state.tenancyContracts[index] = updatedContract;
          }
          if (state.currentTenancyContract?.id === updatedContract.id) {
            state.currentTenancyContract = updatedContract;
          }
        }
      })
      .addCase(updatePropertyManagerTenancyContract.rejected, (state, action) => {
        state.isUpdating = false;
        state.error = action.error?.message || 'Failed to update tenancy contract';
        if (action.payload?.validationErrors) {
          state.validationErrors = action.payload.validationErrors;
        }
      });

    // Delete Tenancy Contract
    builder
      .addCase(deletePropertyManagerTenancyContract.pending, (state) => {
        state.isDeleting = true;
        state.error = null;
      })
      .addCase(deletePropertyManagerTenancyContract.fulfilled, (state, action) => {
        state.isDeleting = false;
        const deletedId = action.meta.arg;
        if (Array.isArray(state.tenancyContracts)) {
          state.tenancyContracts = state.tenancyContracts.filter(c => c.id !== deletedId);
        }
        state.pagination.totalItems = Math.max(0, state.pagination.totalItems - 1);
        if (state.currentTenancyContract?.id === deletedId) {
          state.currentTenancyContract = null;
        }
      })
      .addCase(deletePropertyManagerTenancyContract.rejected, (state, action) => {
        state.isDeleting = false;
        state.error = action.error?.message || 'Failed to delete tenancy contract';
      });
  },
});

export const { clearTenancyContractsError, clearCurrentTenancyContract, setTenancyContractsPage } = tenancyContractsSlice.actions;

// Selectors
export const selectTenancyContracts = (state) => state.propertyManager.tenancyContracts.tenancyContracts;
export const selectCurrentTenancyContract = (state) => state.propertyManager.tenancyContracts.currentTenancyContract;
export const selectTenancyContractsPagination = (state) => state.propertyManager.tenancyContracts.pagination;
export const selectTenancyContractsLoading = (state) => state.propertyManager.tenancyContracts.isLoading;
export const selectTenancyContractsCreating = (state) => state.propertyManager.tenancyContracts.isCreating;
export const selectTenancyContractsUpdating = (state) => state.propertyManager.tenancyContracts.isUpdating;
export const selectTenancyContractsDeleting = (state) => state.propertyManager.tenancyContracts.isDeleting;
export const selectTenancyContractsError = (state) => state.propertyManager.tenancyContracts.error;
export const selectTenancyContractsValidationErrors = (state) => state.propertyManager.tenancyContracts.validationErrors;

export default tenancyContractsSlice.reducer;

