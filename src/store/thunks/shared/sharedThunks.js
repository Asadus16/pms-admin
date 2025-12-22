/**
 * Shared API Thunks
 * API calls that are used across multiple roles (properties, issues, reviews, contacts, projects)
 */

import { createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '@/lib/apiClient';

/**
 * Get API endpoint prefix based on role
 */
const getRoleEndpoint = (role, resource) => {
  return `/${role}/${resource}`;
};

/**
 * Generic property thunks (can be used by multiple roles)
 */
export const createFetchPropertiesThunk = (role) =>
  createAsyncThunk(
    `${role}/fetchProperties`,
    async (params) => {
      const endpoint = getRoleEndpoint(role, 'properties');
      const response = await api.get(endpoint, {
        params,
        returnRaw: true,
      });
      return response;
    }
  );

export const createFetchPropertyByIdThunk = (role) =>
  createAsyncThunk(
    `${role}/fetchPropertyById`,
    async (id) => {
      const endpoint = getRoleEndpoint(role, `properties/${id}`);
      const response = await api.get(endpoint, {
        returnRaw: true,
      });
      return response;
    }
  );

export const createCreatePropertyThunk = (role) =>
  createAsyncThunk(
    `${role}/createProperty`,
    async (data) => {
      const endpoint = getRoleEndpoint(role, 'properties');
      const response = await api.post(endpoint, data, {
        returnRaw: true,
      });
      return response;
    }
  );

export const createUpdatePropertyThunk = (role) =>
  createAsyncThunk(
    `${role}/updateProperty`,
    async ({ id, data }) => {
      const endpoint = getRoleEndpoint(role, `properties/${id}`);
      const response = await api.post(endpoint, data, {
        returnRaw: true,
      });
      return response;
    }
  );

export const createDeletePropertyThunk = (role) =>
  createAsyncThunk(
    `${role}/deleteProperty`,
    async (id) => {
      const endpoint = getRoleEndpoint(role, `properties/${id}`);
      const response = await api.delete(endpoint, {
        returnRaw: true,
      });
      return response;
    }
  );

/**
 * Generic issue thunks
 */
export const createFetchIssuesThunk = (role) =>
  createAsyncThunk(
    `${role}/fetchIssues`,
    async (params) => {
      const endpoint = getRoleEndpoint(role, 'issues');
      const response = await api.get(endpoint, {
        params,
        returnRaw: true,
      });
      return response;
    }
  );

export const createFetchIssueByIdThunk = (role) =>
  createAsyncThunk(
    `${role}/fetchIssueById`,
    async (id) => {
      const endpoint = getRoleEndpoint(role, `issues/${id}`);
      const response = await api.get(endpoint, {
        returnRaw: true,
      });
      return response;
    }
  );

export const createCreateIssueThunk = (role) =>
  createAsyncThunk(
    `${role}/createIssue`,
    async (data) => {
      const endpoint = getRoleEndpoint(role, 'issues');
      const response = await api.post(endpoint, data, {
        returnRaw: true,
      });
      return response;
    }
  );

export const createUpdateIssueThunk = (role) =>
  createAsyncThunk(
    `${role}/updateIssue`,
    async ({ id, data }) => {
      const endpoint = getRoleEndpoint(role, `issues/${id}`);
      const response = await api.post(endpoint, data, {
        returnRaw: true,
      });
      return response;
    }
  );

export const createDeleteIssueThunk = (role) =>
  createAsyncThunk(
    `${role}/deleteIssue`,
    async (id) => {
      const endpoint = getRoleEndpoint(role, `issues/${id}`);
      const response = await api.delete(endpoint, {
        returnRaw: true,
      });
      return response;
    }
  );

/**
 * Generic review thunks
 */
export const createFetchReviewsThunk = (role) =>
  createAsyncThunk(
    `${role}/fetchReviews`,
    async (params) => {
      const endpoint = getRoleEndpoint(role, 'reviews');
      const response = await api.get(endpoint, {
        params,
        returnRaw: true,
      });
      return response;
    }
  );

export const createCreateReviewThunk = (role) =>
  createAsyncThunk(
    `${role}/createReview`,
    async (data) => {
      const endpoint = getRoleEndpoint(role, 'reviews');
      const response = await api.post(endpoint, data, {
        returnRaw: true,
      });
      return response;
    }
  );

/**
 * Generic contact thunks
 */
export const createFetchContactsThunk = (role) =>
  createAsyncThunk(
    `${role}/fetchContacts`,
    async (params) => {
      const endpoint = getRoleEndpoint(role, 'contacts');
      const response = await api.get(endpoint, {
        params,
        returnRaw: true,
      });
      return response;
    }
  );

export const createCreateContactThunk = (role) =>
  createAsyncThunk(
    `${role}/createContact`,
    async (data) => {
      const endpoint = getRoleEndpoint(role, 'contacts');
      const response = await api.post(endpoint, data, {
        returnRaw: true,
      });
      return response;
    }
  );

