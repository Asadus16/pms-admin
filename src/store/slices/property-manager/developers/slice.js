/**
 * Property Manager - Developers Redux Slice
 * Manages developers state for property manager
 */

import { createSlice } from '@reduxjs/toolkit';
import {
  fetchPropertyManagerDevelopers,
  fetchPropertyManagerDeveloperById,
  createPropertyManagerDeveloper,
  updatePropertyManagerDeveloper,
  deletePropertyManagerDeveloper,
} from '../../../thunks/property-manager/propertyManagerThunks';

const initialState = {
  items: [],
  currentItem: null,
  pagination: {
    current_page: 1,
    per_page: 15,
    last_page: 1,
    total: 0,
  },
  loading: false,
  error: null,
};

const developersSlice = createSlice({
  name: 'propertyManager/developers',
  initialState,
  reducers: {
    clearDeveloper: (state) => {
      state.currentItem = null;
      state.error = null;
    },
    clearDevelopers: (state) => {
      state.items = [];
      state.pagination = initialState.pagination;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch developers list
    builder
      .addCase(fetchPropertyManagerDevelopers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPropertyManagerDevelopers.fulfilled, (state, action) => {
        state.loading = false;
        const response = action.payload;
        const developersData = response.data || (Array.isArray(response) ? response : []);
        const paginationMeta = response.meta || {};

        // Transform API data to match component expectations
        state.items = developersData.map((dev) => ({
          id: dev.id,
          name: dev.developer_name,
          propertiesCount: 0, // TODO: Get from API if available
          primaryContactName: dev.contact_name || '',
          primaryContactNumber: dev.contact_phone || '',
          primaryContactEmail: dev.contact_email || '',
          status: dev.status || 'active',
          dateAdded: dev.created_at,
          _apiData: dev,
        }));

        state.pagination = paginationMeta || {
          current_page: 1,
          per_page: 15,
          last_page: 1,
          total: developersData.length,
        };
      })
      .addCase(fetchPropertyManagerDevelopers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.message || 'Failed to fetch developers';
        state.items = [];
      });

    // Fetch single developer
    builder
      .addCase(fetchPropertyManagerDeveloperById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPropertyManagerDeveloperById.fulfilled, (state, action) => {
        state.loading = false;
        const response = action.payload;
        const dev = response.data || response;

        if (dev && dev.id) {
          // Transform API data to match component expectations
          state.currentItem = {
            id: dev.id,
            developerId: `DEV-${String(dev.id).padStart(4, '0')}`,
            name: dev.developer_name,
            selectedCountry: dev.country,
            selectedCity: dev.city,
            registeredAddress: dev.registered_address || '',
            websiteUrl: dev.website_url || '',
            logoUrl: dev.logo || null,
            reraNumber: dev.rera_registration_number || '',
            description: dev.description || '',
            primaryContactName: dev.contact_name || '',
            primaryContactEmail: dev.contact_email || '',
            primaryContactNumber: dev.contact_phone || '',
            status: dev.status || 'active',
            dateAdded: dev.created_at,
            propertiesCount: 0, // TODO: Get from API if available
            mediaUrls: dev.photos?.map(p => p.file_path) || [],
            brochure: dev.brochures && dev.brochures.length > 0
              ? {
                  id: dev.brochures[0].id,
                  name: dev.brochures[0].file_path.split('/').pop(),
                  file_path: dev.brochures[0].file_path,
                }
              : null,
            notes: '',
            _apiData: dev,
          };
        }
      })
      .addCase(fetchPropertyManagerDeveloperById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.message || 'Failed to fetch developer';
        state.currentItem = null;
      });

    // Create developer
    builder
      .addCase(createPropertyManagerDeveloper.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPropertyManagerDeveloper.fulfilled, (state) => {
        state.loading = false;
        // Optionally refresh the list or add the new developer
      })
      .addCase(createPropertyManagerDeveloper.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.message || 'Failed to create developer';
      });

    // Update developer
    builder
      .addCase(updatePropertyManagerDeveloper.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePropertyManagerDeveloper.fulfilled, (state, action) => {
        state.loading = false;
        // Update the current item if it matches
        const response = action.payload;
        const dev = response.data || response;
        if (dev && state.currentItem?.id === dev.id) {
          state.currentItem = {
            ...state.currentItem,
            name: dev.developer_name,
            selectedCountry: dev.country,
            selectedCity: dev.city,
            registeredAddress: dev.registered_address || '',
            websiteUrl: dev.website_url || '',
            logoUrl: dev.logo || state.currentItem.logoUrl,
            reraNumber: dev.rera_registration_number || '',
            description: dev.description || '',
            primaryContactName: dev.contact_name || '',
            primaryContactEmail: dev.contact_email || '',
            primaryContactNumber: dev.contact_phone || '',
            status: dev.status || 'active',
            _apiData: dev,
          };
        }
        // Update in list if present
        const index = state.items.findIndex(item => item.id === dev.id);
        if (index !== -1) {
          state.items[index] = {
            ...state.items[index],
            name: dev.developer_name,
            primaryContactName: dev.contact_name || '',
            primaryContactNumber: dev.contact_phone || '',
            primaryContactEmail: dev.contact_email || '',
            status: dev.status || 'active',
            _apiData: dev,
          };
        }
      })
      .addCase(updatePropertyManagerDeveloper.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.message || 'Failed to update developer';
      });

    // Delete developer
    builder
      .addCase(deletePropertyManagerDeveloper.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletePropertyManagerDeveloper.fulfilled, (state, action) => {
        state.loading = false;
        const deletedId = action.meta.arg;
        // Remove from list
        state.items = state.items.filter(item => item.id !== deletedId);
        // Clear current item if it was deleted
        if (state.currentItem?.id === deletedId) {
          state.currentItem = null;
        }
      })
      .addCase(deletePropertyManagerDeveloper.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.message || 'Failed to delete developer';
      });
  },
});

export const { clearDeveloper, clearDevelopers } = developersSlice.actions;

// Selectors
export const selectDevelopers = (state) => state.propertyManager.developers.items;
export const selectDeveloper = (state) => state.propertyManager.developers.currentItem;
export const selectDevelopersPagination = (state) => state.propertyManager.developers.pagination;
export const selectDevelopersLoading = (state) => state.propertyManager.developers.loading;
export const selectDevelopersError = (state) => state.propertyManager.developers.error;

export default developersSlice.reducer;

