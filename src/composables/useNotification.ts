/**
 * Global Notification Composable
 * Manages global notification state for success and error messages
 */

export interface Notification {
  id: string;
  type: 'success' | 'error';
  message: string;
  duration?: number;
}

export const useNotification = () => {
  const notifications = useState<Notification[]>('notifications.list', () => [])

  /**
   * Show success notification
   */
  const showSuccess = (message: string, duration: number = 5000) => {
    if (!process.client) return
    
    const id = `success-${Date.now()}-${Math.random()}`
    const notification: Notification = {
      id,
      type: 'success',
      message,
      duration,
    }
    
    notifications.value.push(notification)
    
    // Auto-dismiss after duration
    if (duration > 0) {
      setTimeout(() => {
        dismiss(id)
      }, duration)
    }
    
    // Scroll to top smoothly
    nextTick(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    })
  }

  /**
   * Show error notification
   */
  const showError = (message: string, duration: number = 7000) => {
    if (!process.client) return
    
    const id = `error-${Date.now()}-${Math.random()}`
    const notification: Notification = {
      id,
      type: 'error',
      message,
      duration,
    }
    
    notifications.value.push(notification)
    
    // Auto-dismiss after duration
    if (duration > 0) {
      setTimeout(() => {
        dismiss(id)
      }, duration)
    }
  }

  /**
   * Dismiss notification by ID
   */
  const dismiss = (id: string) => {
    notifications.value = notifications.value.filter(n => n.id !== id)
  }

  /**
   * Clear all notifications
   */
  const clearAll = () => {
    notifications.value = []
  }

  /**
   * Get success message from API response
   * Checks common Laravel response patterns
   */
  const getSuccessMessage = (response: any, defaultMessage: string = 'Operation completed successfully'): string => {
    if (!response) return defaultMessage
    
    // Check for message in response
    if (response.message) return response.message
    
    // Check for message in data wrapper
    if (response.data?.message) return response.data.message
    
    // Check for success message
    if (response.success_message) return response.success_message
    
    return defaultMessage
  }

  /**
   * Get error message from error object
   * Handles Laravel validation errors and general errors
   */
  const getErrorMessage = (error: any, defaultMessage: string = 'An error occurred'): string => {
    if (!error) return defaultMessage
    
    // Check for validation errors
    if (error.validationErrors) {
      const errors = Object.values(error.validationErrors).flat()
      if (errors.length > 0) {
        return `Validation errors: ${errors.join(', ')}`
      }
    }
    
    // Check for message
    if (error.message) return error.message
    
    // Check for error in data
    if (error.data?.message) return error.data.message
    
    // Check for error in response
    if (error.response?._data?.message) return error.response._data.message
    
    return defaultMessage
  }

  return {
    notifications: readonly(notifications),
    showSuccess,
    showError,
    dismiss,
    clearAll,
    getSuccessMessage,
    getErrorMessage,
  }
}

