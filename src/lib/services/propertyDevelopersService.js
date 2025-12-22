/**
 * Property Developers API Service
 * Handles all API calls for Property Developers
 */

import { api } from '../apiClient';

const BASE_ENDPOINT = '/property-manager/property-developers';

/**
 * Get all property developers with pagination and filters
 * @param {Object} params - Query parameters
 * @param {number} params.per_page - Number of items per page (default: 15)
 * @param {string} params.search - Search query
 * @param {string} params.country - Filter by country
 * @param {string} params.city - Filter by city
 * @returns {Promise} API response
 */
export const getPropertyDevelopers = async (params = {}) => {
  return api.get(BASE_ENDPOINT, {
    params: {
      per_page: params.per_page || 15,
      ...(params.search && { search: params.search }),
      ...(params.country && { country: params.country }),
      ...(params.city && { city: params.city }),
      ...(params.page && { page: params.page }),
    },
    returnRaw: true, // Return full response with data and meta
  });
};

/**
 * Get single property developer by ID
 * @param {number} id - Property developer ID
 * @returns {Promise} API response
 */
export const getPropertyDeveloper = async (id) => {
  return api.get(`${BASE_ENDPOINT}/${id}`, {
    returnRaw: true, // Return full response with data
  });
};

/**
 * Create a new property developer
 * @param {FormData} formData - FormData with all fields and files
 * @returns {Promise} API response
 */
export const createPropertyDeveloper = async (formData) => {
  return api.post(BASE_ENDPOINT, formData, {
    showProgress: true,
  });
};

/**
 * Update an existing property developer
 * @param {number} id - Property developer ID
 * @param {FormData} formData - FormData with fields to update and files
 * @returns {Promise} API response
 */
export const updatePropertyDeveloper = async (id, formData) => {
  // Laravel uses POST method for updates with multipart/form-data
  // API documentation shows POST /property-developers/{id}
  return api.post(`${BASE_ENDPOINT}/${id}`, formData, {
    showProgress: true,
  });
};

/**
 * Delete a property developer (soft delete)
 * @param {number} id - Property developer ID
 * @returns {Promise} API response
 */
export const deletePropertyDeveloper = async (id) => {
  return api.delete(`${BASE_ENDPOINT}/${id}`);
};

/**
 * Helper function to create FormData from developer object
 * @param {Object} developer - Developer data object
 * @param {Array} deletedMediaIds - Array of media IDs to delete (for updates)
 * @returns {FormData} FormData object ready for API
 */
export const createDeveloperFormData = (developer, deletedMediaIds = []) => {
  const formData = new FormData();

  // Basic fields
  if (developer.developer_name) formData.append('developer_name', developer.developer_name);
  if (developer.country) formData.append('country', developer.country);
  if (developer.city) formData.append('city', developer.city);
  if (developer.registered_address) formData.append('registered_address', developer.registered_address);
  if (developer.website_url) formData.append('website_url', developer.website_url);
  if (developer.rera_registration_number) formData.append('rera_registration_number', developer.rera_registration_number);
  if (developer.description) formData.append('description', developer.description);
  if (developer.contact_name) formData.append('contact_name', developer.contact_name);
  if (developer.contact_email) formData.append('contact_email', developer.contact_email);
  if (developer.contact_phone) formData.append('contact_phone', developer.contact_phone);

  // Logo file
  if (developer.logo && developer.logo instanceof File) {
    formData.append('logo', developer.logo);
  }

  // Photos array
  if (developer.photos && Array.isArray(developer.photos)) {
    developer.photos.forEach((photo) => {
      if (photo instanceof File) {
        formData.append('photos[]', photo);
      }
    });
  }

  // Videos array
  if (developer.videos && Array.isArray(developer.videos)) {
    developer.videos.forEach((video) => {
      if (video instanceof File) {
        formData.append('videos[]', video);
      }
    });
  }

  // Brochures array
  if (developer.brochures && Array.isArray(developer.brochures)) {
    developer.brochures.forEach((brochure) => {
      if (brochure instanceof File) {
        formData.append('brochures[]', brochure);
      }
    });
  }

  // Deleted media IDs (for updates)
  if (deletedMediaIds && Array.isArray(deletedMediaIds)) {
    deletedMediaIds.forEach((id) => {
      formData.append('deleted_media_ids[]', id.toString());
    });
  }

  return formData;
};

