/**
 * Leads Slice
 * Redux state management for leads
 */

import { createSlice } from '@reduxjs/toolkit';
import {
  fetchPropertyManagerLeads,
  fetchPropertyManagerLeadById,
  createPropertyManagerLead,
  updatePropertyManagerLead,
  deletePropertyManagerLead,
} from '../../../thunks/property-manager/propertyManagerThunks';

const initialState = {
  leads: [],
  currentLead: null,
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

const leadsSlice = createSlice({
  name: 'leads',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
      state.validationErrors = null;
    },
    clearCurrentLead: (state) => {
      state.currentLead = null;
    },
    setCurrentPage: (state, action) => {
      state.pagination.currentPage = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Fetch Leads
    builder
      .addCase(fetchPropertyManagerLeads.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPropertyManagerLeads.fulfilled, (state, action) => {
        state.isLoading = false;
        const response = action.payload;
        if (response?.data) {
          state.leads = response.data;
          state.pagination = {
            currentPage: response.meta?.current_page || response.current_page || 1,
            totalPages: response.meta?.last_page || response.last_page || 1,
            totalItems: response.meta?.total || response.total || response.data.length,
            perPage: response.meta?.per_page || response.per_page || 15,
          };
        } else if (Array.isArray(response)) {
          state.leads = response;
          state.pagination.totalItems = response.length;
        } else {
          state.leads = [];
        }
      })
      .addCase(fetchPropertyManagerLeads.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error?.message || 'Failed to fetch leads';
      });

    // Fetch Lead By ID
    builder
      .addCase(fetchPropertyManagerLeadById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPropertyManagerLeadById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentLead = action.payload?.data || action.payload;
      })
      .addCase(fetchPropertyManagerLeadById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error?.message || 'Failed to fetch lead';
      });

    // Create Lead
    builder
      .addCase(createPropertyManagerLead.pending, (state) => {
        state.isCreating = true;
        state.error = null;
        state.validationErrors = null;
      })
      .addCase(createPropertyManagerLead.fulfilled, (state, action) => {
        state.isCreating = false;
        const newLead = action.payload?.data || action.payload;
        if (newLead) {
          if (!Array.isArray(state.leads)) {
            state.leads = [];
          }
          state.leads.unshift(newLead);
          state.pagination.totalItems += 1;
        }
      })
      .addCase(createPropertyManagerLead.rejected, (state, action) => {
        state.isCreating = false;
        state.error = action.error?.message || 'Failed to create lead';
        if (action.payload?.validationErrors) {
          state.validationErrors = action.payload.validationErrors;
        }
      });

    // Update Lead
    builder
      .addCase(updatePropertyManagerLead.pending, (state) => {
        state.isUpdating = true;
        state.error = null;
        state.validationErrors = null;
      })
      .addCase(updatePropertyManagerLead.fulfilled, (state, action) => {
        state.isUpdating = false;
        const updatedLead = action.payload?.data || action.payload;
        if (updatedLead && Array.isArray(state.leads)) {
          const index = state.leads.findIndex(l => l.id === updatedLead.id);
          if (index !== -1) {
            state.leads[index] = updatedLead;
          }
          if (state.currentLead?.id === updatedLead.id) {
            state.currentLead = updatedLead;
          }
        }
      })
      .addCase(updatePropertyManagerLead.rejected, (state, action) => {
        state.isUpdating = false;
        state.error = action.error?.message || 'Failed to update lead';
        if (action.payload?.validationErrors) {
          state.validationErrors = action.payload.validationErrors;
        }
      });

    // Delete Lead
    builder
      .addCase(deletePropertyManagerLead.pending, (state) => {
        state.isDeleting = true;
        state.error = null;
      })
      .addCase(deletePropertyManagerLead.fulfilled, (state, action) => {
        state.isDeleting = false;
        const deletedId = action.meta.arg;
        if (Array.isArray(state.leads)) {
          state.leads = state.leads.filter(l => l.id !== deletedId);
        }
        state.pagination.totalItems = Math.max(0, state.pagination.totalItems - 1);
        if (state.currentLead?.id === deletedId) {
          state.currentLead = null;
        }
      })
      .addCase(deletePropertyManagerLead.rejected, (state, action) => {
        state.isDeleting = false;
        state.error = action.error?.message || 'Failed to delete lead';
      });
  },
});

export const { clearError, clearCurrentLead, setCurrentPage } = leadsSlice.actions;

// Selectors
export const selectLeads = (state) => state.propertyManager.leads.leads;
export const selectCurrentLead = (state) => state.propertyManager.leads.currentLead;
export const selectLeadsPagination = (state) => state.propertyManager.leads.pagination;
export const selectLeadsLoading = (state) => state.propertyManager.leads.isLoading;
export const selectLeadsCreating = (state) => state.propertyManager.leads.isCreating;
export const selectLeadsUpdating = (state) => state.propertyManager.leads.isUpdating;
export const selectLeadsDeleting = (state) => state.propertyManager.leads.isDeleting;
export const selectLeadsError = (state) => state.propertyManager.leads.error;
export const selectLeadsValidationErrors = (state) => state.propertyManager.leads.validationErrors;

export default leadsSlice.reducer;

