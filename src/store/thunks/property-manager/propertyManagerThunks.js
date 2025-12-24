/**
 * Property Manager API Thunks
 * Role-based API calls for property-manager
 */

import { createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '@/lib/apiClient';

// Bookings
export const fetchPropertyManagerBookings = createAsyncThunk(
  'propertyManager/fetchBookings',
  async (params) => {
    const response = await api.get('/property-manager/bookings', {
      params,
      returnRaw: true,
    });
    return response;
  }
);

export const fetchPropertyManagerBookingById = createAsyncThunk(
  'propertyManager/fetchBookingById',
  async (id) => {
    const response = await api.get(`/property-manager/bookings/${id}`, {
      returnRaw: true,
    });
    return response;
  }
);

export const createPropertyManagerBooking = createAsyncThunk(
  'propertyManager/createBooking',
  async (data) => {
    const response = await api.post('/property-manager/bookings', data, {
      returnRaw: true,
    });
    return response;
  }
);

export const updatePropertyManagerBooking = createAsyncThunk(
  'propertyManager/updateBooking',
  async ({ id, data }) => {
    const response = await api.post(`/property-manager/bookings/${id}`, data, {
      returnRaw: true,
    });
    return response;
  }
);

// Transactions
export const fetchPropertyManagerTransactions = createAsyncThunk(
  'propertyManager/fetchTransactions',
  async (params) => {
    const response = await api.get('/property-manager/transactions', {
      params,
      returnRaw: true,
    });
    return response;
  }
);

export const fetchPropertyManagerTransactionById = createAsyncThunk(
  'propertyManager/fetchTransactionById',
  async (id) => {
    const response = await api.get(`/property-manager/transactions/${id}`, {
      returnRaw: true,
    });
    return response;
  }
);

export const createPropertyManagerTransaction = createAsyncThunk(
  'propertyManager/createTransaction',
  async (data) => {
    const response = await api.post('/property-manager/transactions', data, {
      returnRaw: true,
    });
    return response;
  }
);

export const updatePropertyManagerTransaction = createAsyncThunk(
  'propertyManager/updateTransaction',
  async ({ id, data }) => {
    const response = await api.post(`/property-manager/transactions/${id}`, data, {
      returnRaw: true,
    });
    return response;
  }
);

export const deletePropertyManagerTransaction = createAsyncThunk(
  'propertyManager/deleteTransaction',
  async (id) => {
    const response = await api.delete(`/property-manager/transactions/${id}`, {
      returnRaw: true,
    });
    return response;
  }
);

// Inventory
export const fetchPropertyManagerInventories = createAsyncThunk(
  'propertyManager/fetchInventories',
  async (params) => {
    const response = await api.get('/property-manager/inventories', {
      params,
      returnRaw: true,
    });
    return response;
  }
);

export const fetchPropertyManagerInventoryById = createAsyncThunk(
  'propertyManager/fetchInventoryById',
  async (id) => {
    const response = await api.get(`/property-manager/inventories/${id}`, {
      returnRaw: true,
    });
    return response;
  }
);

export const createPropertyManagerInventory = createAsyncThunk(
  'propertyManager/createInventory',
  async (data) => {
    const response = await api.post('/property-manager/inventories', data, {
      returnRaw: true,
    });
    return response;
  }
);

export const updatePropertyManagerInventory = createAsyncThunk(
  'propertyManager/updateInventory',
  async ({ id, data }) => {
    const response = await api.post(`/property-manager/inventories/${id}`, data, {
      returnRaw: true,
    });
    return response;
  }
);

export const deletePropertyManagerInventory = createAsyncThunk(
  'propertyManager/deleteInventory',
  async (id) => {
    const response = await api.delete(`/property-manager/inventories/${id}`, {
      returnRaw: true,
    });
    return response;
  }
);

// Properties
export const fetchPropertyManagerProperties = createAsyncThunk(
  'propertyManager/fetchProperties',
  async (params) => {
    const response = await api.get('/property-manager/properties', {
      params,
      returnRaw: true,
    });
    return response;
  }
);

export const fetchPropertyManagerPropertyById = createAsyncThunk(
  'propertyManager/fetchPropertyById',
  async (id) => {
    const response = await api.get(`/property-manager/properties/${id}`, {
      returnRaw: true,
    });
    return response;
  }
);

export const createPropertyManagerProperty = createAsyncThunk(
  'propertyManager/createProperty',
  async (data) => {
    const response = await api.post('/property-manager/properties', data, {
      returnRaw: true,
    });
    return response;
  }
);

export const updatePropertyManagerProperty = createAsyncThunk(
  'propertyManager/updateProperty',
  async ({ id, data }) => {
    const response = await api.post(`/property-manager/properties/${id}`, data, {
      returnRaw: true,
    });
    return response;
  }
);

export const deletePropertyManagerProperty = createAsyncThunk(
  'propertyManager/deleteProperty',
  async (id) => {
    const response = await api.delete(`/property-manager/properties/${id}`, {
      returnRaw: true,
    });
    return response;
  }
);

// Owners (for property managers)
export const fetchPropertyManagers = createAsyncThunk(
  'propertyManager/fetchPropertyManagers',
  async (params) => {
    const response = await api.get('/property-manager/property-managers', {
      params,
      returnRaw: true,
    });
    return response;
  }
);

export const fetchPropertyManagerById = createAsyncThunk(
  'propertyManager/fetchPropertyManagerById',
  async (id) => {
    const response = await api.get(`/property-manager/property-managers/${id}`, {
      returnRaw: true,
    });
    return response;
  }
);

export const sendPropertyManagerRequest = createAsyncThunk(
  'propertyManager/sendPropertyManagerRequest',
  async (data) => {
    const response = await api.post('/property-manager/property-manager-requests', data, {
      returnRaw: true,
    });
    return response;
  }
);

export const fetchPropertyManagerConnectionRequests = createAsyncThunk(
  'propertyManager/fetchPropertyManagerConnectionRequests',
  async (params) => {
    const response = await api.get('/property-manager/property-manager-requests', {
      params,
      returnRaw: true,
    });
    return response;
  }
);

export const updatePropertyManagerRequestStatus = createAsyncThunk(
  'propertyManager/updatePropertyManagerRequestStatus',
  async ({ id, status }) => {
    const response = await api.post(`/property-manager/property-manager-requests/${id}/status`, {
      status,
    }, {
      returnRaw: true,
    });
    return response;
  }
);

// Projects
export const fetchPropertyManagerProjects = createAsyncThunk(
  'propertyManager/fetchProjects',
  async (params) => {
    const response = await api.get('/property-manager/projects', {
      params: {
        per_page: params?.per_page || 15,
        ...(params?.search && { search: params.search }),
        ...(params?.project_type && { project_type: params.project_type }),
        ...(params?.status && { status: params.status }),
        ...(params?.developer_id && { developer_id: params.developer_id }),
        ...(params?.country && { country: params.country }),
        ...(params?.city && { city: params.city }),
        ...(params?.page && { page: params.page }),
      },
      returnRaw: true,
    });
    return response;
  }
);

export const fetchPropertyManagerProjectById = createAsyncThunk(
  'propertyManager/fetchProjectById',
  async (id) => {
    const response = await api.get(`/property-manager/projects/${id}`, {
      returnRaw: true,
    });
    return response;
  }
);

export const createPropertyManagerProject = createAsyncThunk(
  'propertyManager/createProject',
  async (formData) => {
    const response = await api.post('/property-manager/projects', formData, {
      showProgress: true,
      returnRaw: true,
    });
    return response;
  }
);

export const updatePropertyManagerProject = createAsyncThunk(
  'propertyManager/updateProject',
  async ({ id, formData }) => {
    const response = await api.post(`/property-manager/projects/${id}`, formData, {
      showProgress: true,
      returnRaw: true,
    });
    return response;
  }
);

export const deletePropertyManagerProject = createAsyncThunk(
  'propertyManager/deleteProject',
  async (id) => {
    const response = await api.delete(`/property-manager/projects/${id}`, {
      returnRaw: true,
    });
    return response;
  }
);

// Issues
export const fetchPropertyManagerIssues = createAsyncThunk(
  'propertyManager/fetchIssues',
  async (params) => {
    const response = await api.get('/property-manager/issues', {
      params,
      returnRaw: true,
    });
    return response;
  }
);

export const fetchPropertyManagerIssueById = createAsyncThunk(
  'propertyManager/fetchIssueById',
  async (id) => {
    const response = await api.get(`/property-manager/issues/${id}`, {
      returnRaw: true,
    });
    return response;
  }
);

export const createPropertyManagerIssue = createAsyncThunk(
  'propertyManager/createIssue',
  async (data) => {
    const response = await api.post('/property-manager/issues', data, {
      returnRaw: true,
    });
    return response;
  }
);

export const updatePropertyManagerIssue = createAsyncThunk(
  'propertyManager/updateIssue',
  async ({ id, data }) => {
    const response = await api.post(`/property-manager/issues/${id}`, data, {
      returnRaw: true,
    });
    return response;
  }
);

export const deletePropertyManagerIssue = createAsyncThunk(
  'propertyManager/deleteIssue',
  async (id) => {
    const response = await api.delete(`/property-manager/issues/${id}`, {
      returnRaw: true,
    });
    return response;
  }
);

// Reviews
export const fetchPropertyManagerReviews = createAsyncThunk(
  'propertyManager/fetchReviews',
  async (params) => {
    const response = await api.get('/property-manager/reviews', {
      params,
      returnRaw: true,
    });
    return response;
  }
);

export const fetchPropertyManagerReviewById = createAsyncThunk(
  'propertyManager/fetchReviewById',
  async (id) => {
    const response = await api.get(`/property-manager/reviews/${id}`, {
      returnRaw: true,
    });
    return response;
  }
);

export const createPropertyManagerReview = createAsyncThunk(
  'propertyManager/createReview',
  async (data) => {
    const response = await api.post('/property-manager/reviews', data, {
      returnRaw: true,
    });
    return response;
  }
);

export const updatePropertyManagerReview = createAsyncThunk(
  'propertyManager/updateReview',
  async ({ id, data }) => {
    const response = await api.post(`/property-manager/reviews/${id}`, data, {
      returnRaw: true,
    });
    return response;
  }
);

export const deletePropertyManagerReview = createAsyncThunk(
  'propertyManager/deleteReview',
  async (id) => {
    const response = await api.delete(`/property-manager/reviews/${id}`, {
      returnRaw: true,
    });
    return response;
  }
);

// Contacts
export const fetchPropertyManagerContacts = createAsyncThunk(
  'propertyManager/fetchContacts',
  async (params) => {
    const response = await api.get('/property-manager/contacts', {
      params,
      returnRaw: true,
    });
    return response;
  }
);

export const fetchPropertyManagerContactById = createAsyncThunk(
  'propertyManager/fetchContactById',
  async (id) => {
    const response = await api.get(`/property-manager/contacts/${id}`, {
      returnRaw: true,
    });
    return response;
  }
);

export const createPropertyManagerContact = createAsyncThunk(
  'propertyManager/createContact',
  async (data) => {
    const response = await api.post('/property-manager/contacts', data, {
      returnRaw: true,
    });
    return response;
  }
);

export const updatePropertyManagerContact = createAsyncThunk(
  'propertyManager/updateContact',
  async ({ id, data }) => {
    const response = await api.post(`/property-manager/contacts/${id}`, data, {
      returnRaw: true,
    });
    return response;
  }
);

export const deletePropertyManagerContact = createAsyncThunk(
  'propertyManager/deleteContact',
  async (id) => {
    const response = await api.delete(`/property-manager/contacts/${id}`, {
      returnRaw: true,
    });
    return response;
  }
);

export const updatePropertyManagerContactStatus = createAsyncThunk(
  'propertyManager/updateContactStatus',
  async ({ id, status }) => {
    const response = await api.post(`/property-manager/contacts/${id}/status`, {
      status,
    }, {
      returnRaw: true,
    });
    return response;
  }
);

// Owners (property manager manages owners)
export const fetchPropertyManagerOwners = createAsyncThunk(
  'propertyManager/fetchOwners',
  async (params) => {
    const response = await api.get('/property-manager/owners', {
      params,
      returnRaw: true,
    });
    return response;
  }
);

export const fetchPropertyManagerOwnerById = createAsyncThunk(
  'propertyManager/fetchOwnerById',
  async (id) => {
    const response = await api.get(`/property-manager/owners/${id}`, {
      returnRaw: true,
    });
    return response;
  }
);

export const createPropertyManagerOwner = createAsyncThunk(
  'propertyManager/createOwner',
  async (data) => {
    const response = await api.post('/property-manager/owners', data, {
      returnRaw: true,
    });
    return response;
  }
);

export const updatePropertyManagerOwner = createAsyncThunk(
  'propertyManager/updateOwner',
  async ({ id, data }) => {
    const response = await api.post(`/property-manager/owners/${id}`, data, {
      returnRaw: true,
    });
    return response;
  }
);

export const deletePropertyManagerOwner = createAsyncThunk(
  'propertyManager/deleteOwner',
  async (id) => {
    const response = await api.delete(`/property-manager/owners/${id}`, {
      returnRaw: true,
    });
    return response;
  }
);

export const updatePropertyManagerOwnerStatus = createAsyncThunk(
  'propertyManager/updateOwnerStatus',
  async ({ id, status }) => {
    const response = await api.post(`/property-manager/owners/${id}/status`, {
      status,
    }, {
      returnRaw: true,
    });
    return response;
  }
);

// Property Developers
export const fetchPropertyManagerDevelopers = createAsyncThunk(
  'propertyManager/fetchDevelopers',
  async (params) => {
    const response = await api.get('/property-manager/property-developers', {
      params: {
        per_page: params?.per_page || 15,
        ...(params?.search && { search: params.search }),
        ...(params?.country && { country: params.country }),
        ...(params?.city && { city: params.city }),
        ...(params?.page && { page: params.page }),
      },
      returnRaw: true,
    });
    return response;
  }
);

export const fetchPropertyManagerDeveloperById = createAsyncThunk(
  'propertyManager/fetchDeveloperById',
  async (id) => {
    const response = await api.get(`/property-manager/property-developers/${id}`, {
      returnRaw: true,
    });
    return response;
  }
);

export const createPropertyManagerDeveloper = createAsyncThunk(
  'propertyManager/createDeveloper',
  async (formData) => {
    const response = await api.post('/property-manager/property-developers', formData, {
      showProgress: true,
      returnRaw: true,
    });
    return response;
  }
);

export const updatePropertyManagerDeveloper = createAsyncThunk(
  'propertyManager/updateDeveloper',
  async ({ id, formData }) => {
    const response = await api.post(`/property-manager/property-developers/${id}`, formData, {
      showProgress: true,
      returnRaw: true,
    });
    return response;
  }
);

export const deletePropertyManagerDeveloper = createAsyncThunk(
  'propertyManager/deleteDeveloper',
  async (id) => {
    const response = await api.delete(`/property-manager/property-developers/${id}`, {
      returnRaw: true,
    });
    return response;
  }
);

// Leads
export const fetchPropertyManagerLeads = createAsyncThunk(
  'propertyManager/fetchLeads',
  async (params) => {
    const response = await api.get('/property-manager/leads', {
      params,
      returnRaw: true,
    });
    return response;
  }
);

export const fetchPropertyManagerLeadById = createAsyncThunk(
  'propertyManager/fetchLeadById',
  async (id) => {
    const response = await api.get(`/property-manager/leads/${id}`, {
      returnRaw: true,
    });
    return response;
  }
);

export const createPropertyManagerLead = createAsyncThunk(
  'propertyManager/createLead',
  async (data) => {
    const response = await api.post('/property-manager/leads', data, {
      returnRaw: true,
    });
    return response;
  }
);

export const updatePropertyManagerLead = createAsyncThunk(
  'propertyManager/updateLead',
  async ({ id, data }) => {
    const response = await api.post(`/property-manager/leads/${id}`, data, {
      returnRaw: true,
    });
    return response;
  }
);

export const deletePropertyManagerLead = createAsyncThunk(
  'propertyManager/deleteLead',
  async (id) => {
    const response = await api.delete(`/property-manager/leads/${id}`, {
      returnRaw: true,
    });
    return response;
  }
);

// Owner Connection Requests
export const sendOwnerConnectionRequest = createAsyncThunk(
  'propertyManager/sendOwnerConnectionRequest',
  async (data) => {
    const response = await api.post('/property-manager/owner-requests', data, {
      returnRaw: true,
    });
    return response;
  }
);

export const fetchOwnerConnectionRequests = createAsyncThunk(
  'propertyManager/fetchOwnerConnectionRequests',
  async () => {
    const response = await api.get('/property-manager/owner-requests', {
      returnRaw: true,
    });
    return response;
  }
);

export const updateConnectionRequestStatus = createAsyncThunk(
  'propertyManager/updateConnectionRequestStatus',
  async ({ id, status }) => {
    const response = await api.patch(`/connection-requests/${id}/status`, {
      status,
    }, {
      returnRaw: true,
    });
    return response;
  }
);

