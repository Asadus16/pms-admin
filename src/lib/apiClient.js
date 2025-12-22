/**
 * Base API Client for Thunks
 * Provides a centralized API client for making requests to Laravel backend
 * Used by Redux thunks instead of composables
 */

import { store } from '@/store';
import { startLoading, finishLoading, setProgress } from '@/store/slices/loadingSlice';

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api';
const progressBarEnabled = process.env.NEXT_PUBLIC_PROGRESS_BAR_ENABLED !== 'false';

/**
 * Get authentication token from storage
 */
const getAuthToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('auth_token');
  }
  return null;
};

/**
 * Handle Laravel API response
 */
const handleResponse = (response) => {
  if (typeof response === 'string') {
    try {
      const jsonMatch = response.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
      if (jsonMatch) {
        response = JSON.parse(jsonMatch[0]);
      } else {
        response = JSON.parse(response);
      }
    } catch (e) {
      console.error('Failed to parse response as JSON:', e, response);
      throw new Error('Invalid JSON response from server');
    }
  }

  if (response && typeof response === 'object' && 'data' in response) {
    return response.data;
  }
  return response;
};

/**
 * Handle Laravel validation errors
 */
const handleLaravelError = (error) => {
  let validationErrors = error.validationErrors || null;
  let errorMessage = error.message || 'An error occurred';

  if (!validationErrors) {
    if (error.data?.errors) {
      validationErrors = error.data.errors;
      errorMessage = error.data.message || errorMessage;
    } else if (error.response?._data?.errors) {
      validationErrors = error.response._data.errors;
      errorMessage = error.response._data.message || errorMessage;
    } else if (error.data?.message) {
      errorMessage = error.data.message;
    } else if (error.response?._data?.message) {
      errorMessage = error.response._data.message;
    }
  }

  if (validationErrors) {
    return {
      ...error,
      message: errorMessage,
      validationErrors,
    };
  }

  return {
    ...error,
    message: errorMessage,
  };
};

/**
 * Make API request
 */
export const apiRequest = async (
  endpoint,
  options = {}
) => {
  const {
    method = 'GET',
    body,
    params,
    showNotification = true,
    showProgress = progressBarEnabled,
    returnRaw = false,
    timeout = 30000,
  } = options;

  const token = getAuthToken();

  // Build URL with query params
  let url = `${baseURL}${endpoint}`;
  if (params && Object.keys(params).length > 0) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, String(value));
      }
    });
    url += `?${searchParams.toString()}`;
  }

  // Prepare headers
  const headers = {
    Accept: 'application/json',
  };

  const isFormData = body instanceof FormData;
  if (!isFormData) {
    headers['Content-Type'] = 'application/json';
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Prepare fetch options
  const fetchOptions = {
    method,
    headers,
  };

  // Add body
  if (body !== undefined) {
    if (isFormData) {
      fetchOptions.body = body;
    } else if (typeof body === 'object' && body !== null) {
      fetchOptions.body = JSON.stringify(body);
    } else {
      fetchOptions.body = body;
    }
  }

  // Progress bar (optional - can be disabled)
  let progressInterval = null;
  if (showProgress && typeof window !== 'undefined') {
    // Start loading
    store.dispatch(startLoading());
    
    // Simulate progress (since fetch doesn't provide real progress)
    let simulatedProgress = 0;
    progressInterval = setInterval(() => {
      simulatedProgress += Math.random() * 15;
      if (simulatedProgress < 90) {
        store.dispatch(setProgress(Math.min(90, simulatedProgress)));
      }
    }, 200);
  }

  try {
    // Add timeout
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => {
        reject(new Error(`Request timeout after ${timeout}ms`));
      }, timeout);
    });

    const fetchPromise = fetch(url, fetchOptions);
    const response = await Promise.race([fetchPromise, timeoutPromise]);

    // Read response text once
    let responseText = '';
    let responseData = null;

    try {
      responseText = await response.text();
      
      if (responseText) {
        try {
          responseData = JSON.parse(responseText);
        } catch (parseError) {
          const jsonMatch = responseText.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
          if (jsonMatch) {
            try {
              responseData = JSON.parse(jsonMatch[0]);
            } catch (extractError) {
              throw new Error('Failed to parse JSON from response');
            }
          } else {
            throw new Error('No valid JSON found in response');
          }
        }
      }
    } catch (readError) {
      console.error('Error reading response:', readError);
      throw readError;
    }

    if (!response.ok) {
      const error = {
        status: response.status,
        statusCode: response.status,
        message: responseData?.message || `HTTP ${response.status}: ${response.statusText}`,
        data: responseData,
        response: { _data: responseData },
        ...(responseData?.errors && { validationErrors: responseData.errors }),
      };
      throw error;
    }

    // Progress bar finish
    if (showProgress && typeof window !== 'undefined') {
      if (progressInterval) {
        clearInterval(progressInterval);
      }
      store.dispatch(setProgress(100));
      setTimeout(() => {
        store.dispatch(finishLoading());
      }, 100);
    }

    if (returnRaw) {
      return responseData;
    }

    return handleResponse(responseData);
  } catch (error) {
    // Progress bar finish on error
    if (showProgress && typeof window !== 'undefined') {
      if (progressInterval) {
        clearInterval(progressInterval);
      }
      store.dispatch(setProgress(100));
      setTimeout(() => {
        store.dispatch(finishLoading());
      }, 100);
    }

    const processedError = handleLaravelError(error);

    // Handle 401 - redirect to login
    if (error?.status === 401 || error?.statusCode === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token');
        window.location.href = '/';
      }
    }

    throw processedError;
  }
};

/**
 * API methods
 */
export const api = {
  get: (endpoint, options) => {
    return apiRequest(endpoint, { ...options, method: 'GET' });
  },
  post: (endpoint, data, options) => {
    return apiRequest(endpoint, { ...options, method: 'POST', body: data });
  },
  put: (endpoint, data, options) => {
    return apiRequest(endpoint, { ...options, method: 'PUT', body: data });
  },
  patch: (endpoint, data, options) => {
    return apiRequest(endpoint, { ...options, method: 'PATCH', body: data });
  },
  delete: (endpoint, options) => {
    return apiRequest(endpoint, { ...options, method: 'DELETE' });
  },
};

