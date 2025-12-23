/**
 * Properties Slice
 * Redux state management for properties
 */

import { createSlice } from '@reduxjs/toolkit';
import {
  fetchPropertyManagerProperties,
  fetchPropertyManagerPropertyById,
  createPropertyManagerProperty,
  updatePropertyManagerProperty,
  deletePropertyManagerProperty,
} from '../../../thunks/property-manager/propertyManagerThunks';

const initialState = {
  properties: [],
  currentProperty: null,
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

const propertiesSlice = createSlice({
  name: 'properties',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
      state.validationErrors = null;
    },
    clearCurrentProperty: (state) => {
      state.currentProperty = null;
    },
    setCurrentPage: (state, action) => {
      state.pagination.currentPage = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Fetch Properties
    builder
      .addCase(fetchPropertyManagerProperties.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPropertyManagerProperties.fulfilled, (state, action) => {
        state.isLoading = false;
        // Handle Laravel pagination response
        const response = action.payload;
        if (response?.data?.data) {
          // Nested data structure: payload.data.data
          state.properties = response.data.data;
          state.pagination = {
            currentPage: response.data.current_page || 1,
            totalPages: response.data.last_page || 1,
            totalItems: response.data.total || response.data.data.length,
            perPage: response.data.per_page || 50,
          };
        } else if (response?.data) {
          state.properties = response.data;
          state.pagination = {
            currentPage: response.current_page || 1,
            totalPages: response.last_page || 1,
            totalItems: response.total || response.data.length,
            perPage: response.per_page || 50,
          };
        } else if (Array.isArray(response)) {
          state.properties = response;
          state.pagination.totalItems = response.length;
        } else {
          state.properties = [];
        }
      })
      .addCase(fetchPropertyManagerProperties.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error?.message || 'Failed to fetch properties';
      });

    // Fetch Property By ID
    builder
      .addCase(fetchPropertyManagerPropertyById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPropertyManagerPropertyById.fulfilled, (state, action) => {
        state.isLoading = false;
        // Handle nested response structure
        const response = action.payload;
        if (response?.payload?.data) {
          state.currentProperty = response.payload.data;
        } else if (response?.data) {
          state.currentProperty = response.data;
        } else {
          state.currentProperty = response;
        }
      })
      .addCase(fetchPropertyManagerPropertyById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error?.message || 'Failed to fetch property';
      });

    // Create Property
    builder
      .addCase(createPropertyManagerProperty.pending, (state) => {
        state.isCreating = true;
        state.error = null;
        state.validationErrors = null;
      })
      .addCase(createPropertyManagerProperty.fulfilled, (state, action) => {
        state.isCreating = false;
        const response = action.payload;
        const newProperty = response?.data || response;
        if (newProperty) {
          // Ensure properties is an array before unshift
          if (!Array.isArray(state.properties)) {
            state.properties = [];
          }
          state.properties.unshift(newProperty);
          state.pagination.totalItems += 1;
        }
      })
      .addCase(createPropertyManagerProperty.rejected, (state, action) => {
        state.isCreating = false;
        state.error = action.error?.message || 'Failed to create property';
        if (action.payload?.validationErrors) {
          state.validationErrors = action.payload.validationErrors;
        }
      });

    // Update Property
    builder
      .addCase(updatePropertyManagerProperty.pending, (state) => {
        state.isUpdating = true;
        state.error = null;
        state.validationErrors = null;
      })
      .addCase(updatePropertyManagerProperty.fulfilled, (state, action) => {
        state.isUpdating = false;
        const response = action.payload;
        const updatedProperty = response?.data || response;
        if (updatedProperty && Array.isArray(state.properties)) {
          const index = state.properties.findIndex(p => p.id === updatedProperty.id);
          if (index !== -1) {
            state.properties[index] = updatedProperty;
          }
          if (state.currentProperty?.id === updatedProperty.id) {
            state.currentProperty = updatedProperty;
          }
        }
      })
      .addCase(updatePropertyManagerProperty.rejected, (state, action) => {
        state.isUpdating = false;
        state.error = action.error?.message || 'Failed to update property';
        if (action.payload?.validationErrors) {
          state.validationErrors = action.payload.validationErrors;
        }
      });

    // Delete Property
    builder
      .addCase(deletePropertyManagerProperty.pending, (state) => {
        state.isDeleting = true;
        state.error = null;
      })
      .addCase(deletePropertyManagerProperty.fulfilled, (state, action) => {
        state.isDeleting = false;
        const deletedId = action.meta.arg;
        if (Array.isArray(state.properties)) {
          state.properties = state.properties.filter(p => p.id !== deletedId);
        }
        state.pagination.totalItems = Math.max(0, state.pagination.totalItems - 1);
        if (state.currentProperty?.id === deletedId) {
          state.currentProperty = null;
        }
      })
      .addCase(deletePropertyManagerProperty.rejected, (state, action) => {
        state.isDeleting = false;
        state.error = action.error?.message || 'Failed to delete property';
      });
  },
});

export const { clearError, clearCurrentProperty, setCurrentPage } = propertiesSlice.actions;

// Selectors
export const selectProperties = (state) => state.propertyManager.properties.properties;
export const selectCurrentProperty = (state) => state.propertyManager.properties.currentProperty;
export const selectPropertiesPagination = (state) => state.propertyManager.properties.pagination;
export const selectPropertiesLoading = (state) => state.propertyManager.properties.isLoading;
export const selectPropertiesCreating = (state) => state.propertyManager.properties.isCreating;
export const selectPropertiesUpdating = (state) => state.propertyManager.properties.isUpdating;
export const selectPropertiesDeleting = (state) => state.propertyManager.properties.isDeleting;
export const selectPropertiesError = (state) => state.propertyManager.properties.error;
export const selectPropertiesValidationErrors = (state) => state.propertyManager.properties.validationErrors;

export default propertiesSlice.reducer;
