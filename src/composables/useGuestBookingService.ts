/**
 * Guest Booking Service Composable
 * 
 * Provides convenience methods for booking management.
 * All state management is handled by the Pinia store (useBookingStore).
 * 
 * @module composables/useGuestBookingService
 * 
 * @example
 * ```typescript
 * // Use store directly for state management
 * const store = useBookingStore();
 * await store.fetchBookings();
 * 
 * // Use composable for convenience
 * const { fetchBookings, createBooking } = useGuestBookingService();
 * await fetchBookings();
 * ```
 */

import { useBookingStore } from '~/stores/booking.store';

// Types should be imported directly from stores:
// import type { Booking } from '~/stores/booking.store';

export const useGuestBookingService = () => {
  const store = useBookingStore();

  return {
    // Pinia Store (use this for all state management)
    store,

    // Convenience methods that delegate to store
    fetchBookings: (params?: Record<string, any>) =>
      store.fetchBookings(params),
    fetchBookingById: (id: string | number) => store.fetchBookingById(id),
    createBooking: (data: Record<string, any>) => store.createBooking(data),
    updateBooking: (id: string | number, data: Record<string, any>) =>
      store.updateBooking(id, data),
    cancelBooking: (id: string | number, data?: Record<string, any>) =>
      store.cancelBooking(id, data),
    deleteBooking: (id: string | number) => store.deleteBooking(id),
  };
};
