/**
 * Owner API Thunks
 * Role-based API calls for owner
 */

import { createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '@/lib/apiClient';

// Owners
export const fetchOwners = createAsyncThunk(
  'owner/fetchOwners',
  async (params) => {
    const response = await api.get('/owner/owners', {
      params,
      returnRaw: true,
    });
    return response;
  }
);

export const fetchOwnerById = createAsyncThunk(
  'owner/fetchOwnerById',
  async (id) => {
    const response = await api.get(`/owner/owners/${id}`, {
      returnRaw: true,
    });
    return response;
  }
);

export const fetchConnectedOwners = createAsyncThunk(
  'owner/fetchConnectedOwners',
  async () => {
    const response = await api.get('/owner/connected-owners', {
      returnRaw: true,
    });
    return response;
  }
);

export const sendOwnerRequest = createAsyncThunk(
  'owner/sendOwnerRequest',
  async (data) => {
    const response = await api.post('/owner/owner-requests', data, {
      returnRaw: true,
    });
    return response;
  }
);

export const fetchConnectionOwnerRequests = createAsyncThunk(
  'owner/fetchConnectionOwnerRequests',
  async (params) => {
    const response = await api.get('/owner/owner-requests', {
      params,
      returnRaw: true,
    });
    return response;
  }
);

export const updateOwnerConnectionRequestStatus = createAsyncThunk(
  'owner/updateOwnerConnectionRequestStatus',
  async ({ id, status }) => {
    const response = await api.post(`/owner/owner-requests/${id}/status`, {
      status,
    }, {
      returnRaw: true,
    });
    return response;
  }
);

export const removeOwner = createAsyncThunk(
  'owner/removeOwner',
  async (requestId) => {
    const response = await api.delete(`/owner/owner-requests/${requestId}`, {
      returnRaw: true,
    });
    return response;
  }
);

// Inventory
export const fetchOwnerInventory = createAsyncThunk(
  'owner/fetchInventory',
  async (params) => {
    const response = await api.get('/owner/inventory', {
      params,
      returnRaw: true,
    });
    return response;
  }
);

