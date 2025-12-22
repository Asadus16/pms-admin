'use client';

/**
 * API Client Composable
 * Centralized API client for making requests to Laravel backend
 * Adapted for Next.js
 */

export const useApi = () => {
  // Laravel API base URL (default: http://localhost:8000/api)
  // Can be overridden via NEXT_PUBLIC_API_BASE env variable
  const baseURL = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8000/api'
  // Progress bar enabled globally (default: true)
  const progressBarEnabled = process.env.NEXT_PUBLIC_PROGRESS_BAR_ENABLED !== 'false'

  /**
   * Default fetch options
   */
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
  }

  /**
   * Get authentication token from storage
   */
  const getAuthToken = (): string | null => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('auth_token')
    }
    return null
  }

  /**
   * Handle Laravel API response
   * Laravel typically returns data in a 'data' wrapper
   * Also handles cases where response is a string (with HTML errors) that needs parsing
   */
  const handleResponse = <T>(response: any): T => {
    // If response is a string, try to parse it as JSON
    // This handles cases where PHP errors are mixed with JSON
    if (typeof response === 'string') {
      try {
        // Try to extract JSON from the string (remove HTML/error messages)
        // Look for JSON object/array in the string
        const jsonMatch = response.match(/\{[\s\S]*\}|\[[\s\S]*\]/)
        if (jsonMatch) {
          response = JSON.parse(jsonMatch[0])
        } else {
          // If no JSON found, try parsing the whole string
          response = JSON.parse(response)
        }
      } catch (e) {
        console.error('Failed to parse response as JSON:', e, response)
        throw new Error('Invalid JSON response from server')
      }
    }

    // If Laravel returns { data: {...} }, extract the data
    if (response && typeof response === 'object' && 'data' in response) {
      return response.data as T
    }
    return response as T
  }

  /**
   * Handle Laravel validation errors
   */
  const handleLaravelError = (error: any) => {
    // Laravel validation errors come in format:
    // { message: "...", errors: { field: ["error message"] } }
    // fetch errors may already have validationErrors attached

    let validationErrors = error.validationErrors || null
    let errorMessage = error.message || 'An error occurred'

    // Check different possible error structures
    if (!validationErrors) {
      if (error.data?.errors) {
        // Standard Laravel validation error format
        validationErrors = error.data.errors
        errorMessage = error.data.message || errorMessage
      } else if (error.response?._data?.errors) {
        // Alternative error structure
        validationErrors = error.response._data.errors
        errorMessage = error.response._data.message || errorMessage
      } else if (error.data?.message) {
        // General error message
        errorMessage = error.data.message
      } else if (error.response?._data?.message) {
        // Alternative error message location
        errorMessage = error.response._data.message
      }
    }

    if (validationErrors) {
      return {
        ...error,
        validationErrors,
        message: errorMessage,
      }
    }

    return {
      ...error,
      message: errorMessage,
    }
  }

  /**
   * Make authenticated API request
   */
  const apiRequest = async <T = any>(
    endpoint: string,
    options: any = {}
  ): Promise<T> => {
    // Get notification composable (if available)
    let showSuccess, showError, getSuccessMessage, getErrorMessage;
    try {
      const notification = require('@/composables/useNotification');
      const notificationComposable = notification.useNotification();
      showSuccess = notificationComposable.showSuccess;
      showError = notificationComposable.showError;
      getSuccessMessage = notificationComposable.getSuccessMessage;
      getErrorMessage = notificationComposable.getErrorMessage;
    } catch (e) {
      // Notification composable not available, use no-ops
      showSuccess = () => {};
      showError = () => {};
      getSuccessMessage = () => '';
      getErrorMessage = () => '';
    }

    // Check if notifications should be shown (default: true, can be disabled with showNotification: false)
    const shouldShowNotification = options.showNotification !== false
    const successMessage = options.successMessage // Custom success message
    const errorMessage = options.errorMessage // Custom error message

    // Get timeout (default: 30 seconds, can be overridden per request)
    const timeout = options.timeout || 30000

    const token = getAuthToken()

    // Check if body is FormData - if so, don't set Content-Type (browser will set it with boundary)
    // Check both options.body and the _isFormData flag (set by post/put/patch methods)
    const isFormData = options.body instanceof FormData || options._isFormData === true

    // Remove the internal flags and notification options before processing
    const cleanOptions = { ...options }
    const shouldReturnRaw = cleanOptions.returnRaw === true
    delete (cleanOptions as any)._isFormData
    delete (cleanOptions as any).returnRaw
    delete (cleanOptions as any).showNotification
    delete (cleanOptions as any).successMessage
    delete (cleanOptions as any).errorMessage
    delete (cleanOptions as any).timeout

    // Build headers - for FormData, don't set Content-Type at all
    const headers: Record<string, string> = {}

    if (!isFormData) {
      // For non-FormData requests, use default headers
      Object.assign(headers, defaultOptions.headers)
    }

    // Merge any custom headers (but skip Content-Type for FormData)
    if (cleanOptions.headers) {
      Object.keys(cleanOptions.headers).forEach(key => {
        if (isFormData && key.toLowerCase() === 'content-type') {
          // Skip Content-Type for FormData - browser will set it
          return
        }
        headers[key] = cleanOptions.headers[key]
      })
    }

    // Add Laravel Bearer token
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    // Always set Accept header
    if (!headers['Accept']) {
      headers['Accept'] = 'application/json'
    }

    // Automatically show progress bar for POST, PUT, PATCH, DELETE requests
    // Can be disabled globally via PROGRESS_BAR_ENABLED=false env var
    // Or per-request by passing showProgress: false in options
    const method = options.method || 'GET'
    const shouldShowProgress = progressBarEnabled &&
      (method !== 'GET') &&
      options.showProgress !== false

    // Start progress bar automatically (if available)
    let startProgress, finishProgress;
    try {
      const progress = require('@/composables/useProgress');
      const progressComposable = progress.useProgress();
      startProgress = progressComposable.startProgress;
      finishProgress = progressComposable.finishProgress;
    } catch (e) {
      startProgress = () => {};
      finishProgress = () => {};
    }
    
    if (shouldShowProgress && typeof window !== 'undefined') {
      startProgress();
    }

    try {
      const url = `${baseURL}${endpoint}`
      console.log(`API Request: ${method} ${url}`, { headers, body: cleanOptions.body instanceof FormData ? 'FormData' : cleanOptions.body })

      // Prepare fetch options - ensure FormData is handled correctly
      const fetchOptions: any = {
        method: cleanOptions.method || method,
        headers,
      }

      // Only add body if it exists
      // JSON stringify if it's an object and not FormData
      if (cleanOptions.body !== undefined) {
        if (isFormData) {
          // FormData - use as is (browser will set Content-Type with boundary)
          fetchOptions.body = cleanOptions.body
        } else if (typeof cleanOptions.body === 'object' && cleanOptions.body !== null) {
          // Object - stringify to JSON
          fetchOptions.body = JSON.stringify(cleanOptions.body)
        } else {
          // String or other - use as is
          fetchOptions.body = cleanOptions.body
        }
      }

      // Add any other options (query params, etc.) but exclude body and headers
      Object.keys(cleanOptions).forEach(key => {
        if (!['body', 'headers', 'method', '_isFormData'].includes(key)) {
          fetchOptions[key] = cleanOptions[key]
        }
      })

      // Add timeout support using Promise.race with cleanup
      let timeoutId: NodeJS.Timeout | null = null
      const timeoutPromise = new Promise<never>((_, reject) => {
        timeoutId = setTimeout(() => {
          reject(new Error(`Request timeout after ${timeout}ms`))
        }, timeout)
      })

      let fetchPromise: Promise<Response>
      try {
        fetchPromise = fetch(url, fetchOptions)
      } catch (fetchError: any) {
        // Clean up timeout if fetch fails immediately
        if (timeoutId) clearTimeout(timeoutId)
        // If fetch fails immediately (e.g., invalid URL), handle it
        throw {
          ...fetchError,
          message: fetchError.message || 'Network request failed',
          name: fetchError.name || 'FetchError'
        }
      }

      let response: Response
      try {
        response = await Promise.race([fetchPromise, timeoutPromise]) as Response
        // Clean up timeout on success
        if (timeoutId) clearTimeout(timeoutId)
      } catch (raceError: any) {
        // Clean up timeout on error
        if (timeoutId) clearTimeout(timeoutId)
        throw raceError
      }

      // Read response body once (can only read once)
      let responseText: string = ''
      let responseData: any = null
      
      try {
        responseText = await response.text()
        console.log('Raw response text:', responseText)
        
        if (responseText) {
          try {
            // First try to parse directly
            responseData = JSON.parse(responseText)
            console.log('Parsed response data:', responseData)
          } catch (parseError) {
            // If direct parse fails, try to extract JSON from string (handles HTML warnings)
            // Look for JSON object/array in the string
            const jsonMatch = responseText.match(/\{[\s\S]*\}|\[[\s\S]*\]/)
            if (jsonMatch) {
              try {
                responseData = JSON.parse(jsonMatch[0])
                console.log('Extracted and parsed JSON from string response:', responseData)
              } catch (extractError) {
                console.error('Failed to parse extracted JSON:', extractError)
                console.error('Response text:', responseText)
                responseData = { message: 'Invalid JSON response from server' }
              }
            } else {
              console.error('No JSON found in response:', responseText)
              responseData = { message: 'Invalid JSON response from server' }
            }
          }
        } else {
          // Empty response
          responseData = {}
        }
      } catch (readError: any) {
        console.error('Failed to read response:', readError)
        responseData = { message: 'Failed to read response' }
      }

      // Check if response is ok AFTER reading the body
      if (!response.ok) {
        // Extract validation errors from Laravel format
        const validationErrors = responseData?.errors || null
        const errorMessage = responseData?.message || `HTTP ${response.status}: ${response.statusText}`
        
        const error = {
          status: response.status,
          statusCode: response.status,
          message: errorMessage,
          data: responseData,
          response: { _data: responseData },
          ...(validationErrors && { validationErrors })
        }
        
        throw error
      }
      
      // Response is ok, use the parsed data
      const typedResponseData = responseData as T

      console.log(`API Response from ${url}:`, typedResponseData)
      console.log(`API Response type:`, typeof typedResponseData)

      if (shouldReturnRaw) {
        if (shouldShowProgress && typeof window !== 'undefined') {
          finishProgress();
        }
        return typedResponseData
      }

      // Handle Laravel response structure
      // If response is a string (with HTML warnings), parse it first
      let parsedResponse = typedResponseData
      if (typeof responseData === 'string') {
        try {
          // Extract JSON from string (remove HTML/error messages)
          // Look for the JSON object in the string
          const jsonMatch = responseData.match(/\{[\s\S]*\}|\[[\s\S]*\]/)
          if (jsonMatch) {
            parsedResponse = JSON.parse(jsonMatch[0])
            console.log('Parsed JSON from string response:', parsedResponse)
          } else {
            // Try parsing the whole string
            parsedResponse = JSON.parse(responseData)
          }
        } catch (e) {
          console.error('Failed to parse response as JSON:', e)
          console.error('Response was:', responseData)
          throw new Error('Invalid JSON response from server')
        }
      }

      const result = handleResponse<T>(parsedResponse)

      // Finish progress bar
      if (shouldShowProgress && typeof window !== 'undefined') {
        finishProgress();
      }

      // Show success notification for POST, PUT, PATCH, DELETE requests
      if (shouldShowNotification && method !== 'GET') {
        const message = successMessage || getSuccessMessage(response, 'Operation completed successfully')
        showSuccess(message)
      }

      return result
    } catch (error: any) {
      // Finish progress bar even on error
      if (shouldShowProgress && typeof window !== 'undefined') {
        finishProgress();
      }

      // Check if error is due to premature close or connection issues
      const isConnectionError =
        error.message?.includes('Premature close') ||
        error.message?.includes('socket hang up') ||
        error.message?.includes('ECONNRESET') ||
        error.message?.includes('EPIPE') ||
        error.name === 'FetchError' ||
        error.cause?.code === 'ECONNRESET' ||
        error.cause?.code === 'EPIPE'

      // Log error but don't throw for connection errors during SSR to prevent header issues
      if (isConnectionError && typeof window === 'undefined') {
        console.warn(`Connection error (non-fatal) from ${baseURL}${endpoint}:`, error.message)
        // Return a safe error object that won't cause header issues
        const safeError = {
          message: 'Connection error. Please try again.',
          status: 0,
          statusCode: 0,
          isConnectionError: true
        }
        throw safeError
      }

      console.error(`API Error from ${baseURL}${endpoint}:`, error)
      // Handle Laravel error responses
      const processedError = handleLaravelError(error)

      if (error.status === 401 || error.statusCode === 401) {
        // Unauthorized - clear token and redirect to login
        if (typeof window !== 'undefined') {
          localStorage.removeItem('auth_token')
          // Redirect will be handled by middleware or component
          if (typeof window !== 'undefined') {
            window.location.href = '/login'
          }
        }
      }

      // Show error notification (except for 401 which redirects and connection errors)
      if (shouldShowNotification &&
        error.status !== 401 &&
        error.statusCode !== 401 &&
        !isConnectionError) {
        const message = errorMessage || getErrorMessage(processedError, 'An error occurred')
        showError(message)
      }

      throw processedError
    }
  }

  /**
   * GET request
   */
  const get = <T = any>(endpoint: string, options?: any): Promise<T> => {
    return apiRequest<T>(endpoint, { ...options, method: 'GET' })
  }

  /**
   * POST request
   */
  const post = <T = any>(endpoint: string, data?: any, options?: any): Promise<T> => {
    // Check if data is FormData - if so, don't set Content-Type header
    const isFormData = data instanceof FormData

    return apiRequest<T>(endpoint, {
      ...options,
      method: 'POST',
      body: data,
      // Pass FormData flag so apiRequest knows to skip Content-Type
      _isFormData: isFormData,
    })
  }

  /**
   * PUT request
   */
  const put = <T = any>(endpoint: string, data?: any, options?: any): Promise<T> => {
    return apiRequest<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: data,
    })
  }

  /**
   * PATCH request
   */
  const patch = <T = any>(endpoint: string, data?: any, options?: any): Promise<T> => {
    return apiRequest<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: data,
    })
  }

  /**
   * DELETE request
   */
  const del = <T = any>(endpoint: string, options?: any): Promise<T> => {
    return apiRequest<T>(endpoint, { ...options, method: 'DELETE' })
  }

  return {
    get,
    post,
    put,
    patch,
    delete: del,
    request: apiRequest,
  }
}

