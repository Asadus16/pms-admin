/**
 * Property Manager Booking Service Composable
 * 
 * Provides convenience methods for property manager booking management.
 * 
 * @module composables/usePropertyManagerBookingService
 */

import { useApi } from '~/composables/useApi';

export const usePropertyManagerBookingService = () => {
  const api = useApi();

  return {
    /**
     * Fetch all bookings for property manager
     * 
     * @param params - Optional query parameters (pagination, filters, etc.)
     * @returns Promise resolving to bookings data
     */
    fetchBookings: async (params?: Record<string, any>) => {
      try {
        // Use returnRaw to get full response with message, data, and meta
        const response = await api.get('/property-manager/bookings', { 
          params,
          returnRaw: true 
        });
        // Return the full response structure { message, data, meta }
        return response;
      } catch (error: any) {
        console.error('Error fetching bookings:', error);
        throw new Error(error.message || 'Failed to fetch bookings');
      }
    },

    /**
     * Fetch a single booking by ID
     * 
     * @param id - The booking ID
     * @returns Promise resolving to booking data
     */
    fetchBookingById: async (id: string | number) => {
      try {
        // Use returnRaw to get full response with message, data, and meta
        const response = await api.get(`/property-manager/bookings/${id}`, {
          returnRaw: true
        });
        // Return the full response structure
        return response;
      } catch (error: any) {
        console.error('Error fetching booking:', error);
        throw new Error(error.message || 'Failed to fetch booking');
      }
    },

    /**
     * Create a new booking
     * 
     * @param data - Booking data (FormData or object)
     * @returns Promise resolving to created booking
     */
    createBooking: async (data: FormData | Record<string, any>) => {
      try {
        const response = await api.post('/property-manager/bookings', data, {
          returnRaw: true
        });
        return response;
      } catch (error: any) {
        console.error('Error creating booking:', error);
        throw new Error(error.message || 'Failed to create booking');
      }
    },

    /**
     * Update an existing booking
     * 
     * @param id - The booking ID
     * @param data - Booking data (FormData or object)
     * @returns Promise resolving to updated booking
     */
    updateBooking: async (id: string | number, data: FormData | Record<string, any>) => {
      try {
        const response = await api.post(`/property-manager/bookings/${id}`, data, {
          returnRaw: true
        });
        return response;
      } catch (error: any) {
        console.error('Error updating booking:', error);
        throw new Error(error.message || 'Failed to update booking');
      }
    },
  };
};

