/**
 * Connection Requests Slice
 * Redux state management for owner connection requests
 */

import { createSlice } from '@reduxjs/toolkit';
import {
  sendOwnerConnectionRequest,
  fetchOwnerConnectionRequests,
  updateConnectionRequestStatus,
} from '../../../thunks/property-manager/propertyManagerThunks';

const initialState = {
  requests: {
    sent: [],
    received: [],
    approved: [],
  },
  isLoading: false,
  isSending: false,
  isUpdating: false,
  error: null,
  validationErrors: null,
};

const connectionRequestsSlice = createSlice({
  name: 'connectionRequests',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
      state.validationErrors = null;
    },
  },
  extraReducers: (builder) => {
    // Send Connection Request
    builder
      .addCase(sendOwnerConnectionRequest.pending, (state) => {
        state.isSending = true;
        state.error = null;
        state.validationErrors = null;
      })
      .addCase(sendOwnerConnectionRequest.fulfilled, (state, action) => {
        state.isSending = false;
        const newRequest = action.payload?.data || action.payload;
        if (newRequest) {
          // Add to sent requests
          if (!Array.isArray(state.requests.sent)) {
            state.requests.sent = [];
          }
          state.requests.sent.unshift(newRequest);
        }
      })
      .addCase(sendOwnerConnectionRequest.rejected, (state, action) => {
        state.isSending = false;
        state.error = action.error?.message || 'Failed to send connection request';
        if (action.payload?.validationErrors) {
          state.validationErrors = action.payload.validationErrors;
        }
      });

    // Fetch Connection Requests
    builder
      .addCase(fetchOwnerConnectionRequests.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchOwnerConnectionRequests.fulfilled, (state, action) => {
        state.isLoading = false;
        const response = action.payload?.data || action.payload;
        if (response) {
          state.requests = {
            sent: Array.isArray(response.sent) ? response.sent : [],
            received: Array.isArray(response.received) ? response.received : [],
            approved: Array.isArray(response.approved) ? response.approved : [],
          };
        }
      })
      .addCase(fetchOwnerConnectionRequests.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error?.message || 'Failed to fetch connection requests';
      });

    // Update Connection Request Status
    builder
      .addCase(updateConnectionRequestStatus.pending, (state) => {
        state.isUpdating = true;
        state.error = null;
      })
      .addCase(updateConnectionRequestStatus.fulfilled, (state, action) => {
        state.isUpdating = false;
        const updatedRequest = action.payload?.data || action.payload;
        if (updatedRequest) {
          // Update in sent requests
          const sentIndex = state.requests.sent.findIndex(r => r.id === updatedRequest.id);
          if (sentIndex !== -1) {
            state.requests.sent[sentIndex] = updatedRequest;
          }

          // Update in received requests
          const receivedIndex = state.requests.received.findIndex(r => r.id === updatedRequest.id);
          if (receivedIndex !== -1) {
            state.requests.received[receivedIndex] = updatedRequest;
          }

          // If accepted, move to approved (if not already there)
          if (updatedRequest.status === 'accepted') {
            const approvedIndex = state.requests.approved.findIndex(r => r.id === updatedRequest.id);
            if (approvedIndex === -1) {
              state.requests.approved.unshift(updatedRequest);
            } else {
              state.requests.approved[approvedIndex] = updatedRequest;
            }
            // Remove from sent/received if it's there
            state.requests.sent = state.requests.sent.filter(r => r.id !== updatedRequest.id);
            state.requests.received = state.requests.received.filter(r => r.id !== updatedRequest.id);
          } else if (updatedRequest.status === 'denied') {
            // Remove from sent/received if denied
            state.requests.sent = state.requests.sent.filter(r => r.id !== updatedRequest.id);
            state.requests.received = state.requests.received.filter(r => r.id !== updatedRequest.id);
          }
        }
      })
      .addCase(updateConnectionRequestStatus.rejected, (state, action) => {
        state.isUpdating = false;
        state.error = action.error?.message || 'Failed to update connection request status';
        if (action.payload?.validationErrors) {
          state.validationErrors = action.payload.validationErrors;
        }
      });
  },
});

export const { clearError } = connectionRequestsSlice.actions;

// Selectors
export const selectConnectionRequests = (state) => state.propertyManager.connectionRequests.requests;
export const selectSentRequests = (state) => state.propertyManager.connectionRequests.requests.sent;
export const selectReceivedRequests = (state) => state.propertyManager.connectionRequests.requests.received;
export const selectApprovedRequests = (state) => state.propertyManager.connectionRequests.requests.approved;
export const selectConnectionRequestsLoading = (state) => state.propertyManager.connectionRequests.isLoading;
export const selectConnectionRequestsSending = (state) => state.propertyManager.connectionRequests.isSending;
export const selectConnectionRequestsUpdating = (state) => state.propertyManager.connectionRequests.isUpdating;
export const selectConnectionRequestsError = (state) => state.propertyManager.connectionRequests.error;
export const selectConnectionRequestsValidationErrors = (state) => state.propertyManager.connectionRequests.validationErrors;

export default connectionRequestsSlice.reducer;

