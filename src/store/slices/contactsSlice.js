/**
 * Contacts Slice
 * Redux state management for contacts
 */

import { createSlice } from '@reduxjs/toolkit';
import {
  fetchPropertyManagerContacts,
  fetchPropertyManagerContactById,
  createPropertyManagerContact,
  updatePropertyManagerContact,
  deletePropertyManagerContact,
  updatePropertyManagerContactStatus,
} from '../thunks/property-manager/propertyManagerThunks';

const initialState = {
  contacts: [],
  currentContact: null,
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

const contactsSlice = createSlice({
  name: 'contacts',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
      state.validationErrors = null;
    },
    clearCurrentContact: (state) => {
      state.currentContact = null;
    },
    setCurrentPage: (state, action) => {
      state.pagination.currentPage = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Fetch Contacts
    builder
      .addCase(fetchPropertyManagerContacts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPropertyManagerContacts.fulfilled, (state, action) => {
        state.isLoading = false;
        // Handle Laravel pagination response
        const response = action.payload;
        if (response?.data) {
          state.contacts = response.data;
          state.pagination = {
            currentPage: response.current_page || 1,
            totalPages: response.last_page || 1,
            totalItems: response.total || response.data.length,
            perPage: response.per_page || 50,
          };
        } else if (Array.isArray(response)) {
          state.contacts = response;
          state.pagination.totalItems = response.length;
        } else {
          state.contacts = [];
        }
      })
      .addCase(fetchPropertyManagerContacts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error?.message || 'Failed to fetch contacts';
      });

    // Fetch Contact By ID
    builder
      .addCase(fetchPropertyManagerContactById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPropertyManagerContactById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentContact = action.payload?.data || action.payload;
      })
      .addCase(fetchPropertyManagerContactById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error?.message || 'Failed to fetch contact';
      });

    // Create Contact
    builder
      .addCase(createPropertyManagerContact.pending, (state) => {
        state.isCreating = true;
        state.error = null;
        state.validationErrors = null;
      })
      .addCase(createPropertyManagerContact.fulfilled, (state, action) => {
        state.isCreating = false;
        const newContact = action.payload?.data || action.payload;
        if (newContact) {
          state.contacts.unshift(newContact);
          state.pagination.totalItems += 1;
        }
      })
      .addCase(createPropertyManagerContact.rejected, (state, action) => {
        state.isCreating = false;
        state.error = action.error?.message || 'Failed to create contact';
        if (action.payload?.validationErrors) {
          state.validationErrors = action.payload.validationErrors;
        }
      });

    // Update Contact
    builder
      .addCase(updatePropertyManagerContact.pending, (state) => {
        state.isUpdating = true;
        state.error = null;
        state.validationErrors = null;
      })
      .addCase(updatePropertyManagerContact.fulfilled, (state, action) => {
        state.isUpdating = false;
        const updatedContact = action.payload?.data || action.payload;
        if (updatedContact) {
          const index = state.contacts.findIndex(c => c.id === updatedContact.id);
          if (index !== -1) {
            state.contacts[index] = updatedContact;
          }
          if (state.currentContact?.id === updatedContact.id) {
            state.currentContact = updatedContact;
          }
        }
      })
      .addCase(updatePropertyManagerContact.rejected, (state, action) => {
        state.isUpdating = false;
        state.error = action.error?.message || 'Failed to update contact';
        if (action.payload?.validationErrors) {
          state.validationErrors = action.payload.validationErrors;
        }
      });

    // Delete Contact
    builder
      .addCase(deletePropertyManagerContact.pending, (state) => {
        state.isDeleting = true;
        state.error = null;
      })
      .addCase(deletePropertyManagerContact.fulfilled, (state, action) => {
        state.isDeleting = false;
        const deletedId = action.meta.arg;
        state.contacts = state.contacts.filter(c => c.id !== deletedId);
        state.pagination.totalItems = Math.max(0, state.pagination.totalItems - 1);
        if (state.currentContact?.id === deletedId) {
          state.currentContact = null;
        }
      })
      .addCase(deletePropertyManagerContact.rejected, (state, action) => {
        state.isDeleting = false;
        state.error = action.error?.message || 'Failed to delete contact';
      });

    // Update Contact Status
    builder
      .addCase(updatePropertyManagerContactStatus.pending, (state) => {
        state.isUpdating = true;
        state.error = null;
      })
      .addCase(updatePropertyManagerContactStatus.fulfilled, (state, action) => {
        state.isUpdating = false;
        const updatedContact = action.payload?.data || action.payload;
        if (updatedContact) {
          const index = state.contacts.findIndex(c => c.id === updatedContact.id);
          if (index !== -1) {
            state.contacts[index] = updatedContact;
          }
          if (state.currentContact?.id === updatedContact.id) {
            state.currentContact = updatedContact;
          }
        }
      })
      .addCase(updatePropertyManagerContactStatus.rejected, (state, action) => {
        state.isUpdating = false;
        state.error = action.error?.message || 'Failed to update contact status';
      });
  },
});

export const { clearError, clearCurrentContact, setCurrentPage } = contactsSlice.actions;

// Selectors
export const selectContacts = (state) => state.contacts.contacts;
export const selectCurrentContact = (state) => state.contacts.currentContact;
export const selectContactsPagination = (state) => state.contacts.pagination;
export const selectContactsLoading = (state) => state.contacts.isLoading;
export const selectContactsCreating = (state) => state.contacts.isCreating;
export const selectContactsUpdating = (state) => state.contacts.isUpdating;
export const selectContactsDeleting = (state) => state.contacts.isDeleting;
export const selectContactsError = (state) => state.contacts.error;
export const selectContactsValidationErrors = (state) => state.contacts.validationErrors;

export default contactsSlice.reducer;
