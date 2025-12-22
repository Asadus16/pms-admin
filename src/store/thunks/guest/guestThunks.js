/**
 * Guest API Thunks
 * Role-based API calls for guest
 */

import { createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '@/lib/apiClient';

// Bookings
export const fetchGuestBookings = createAsyncThunk(
  'guest/fetchBookings',
  async (params) => {
    const response = await api.get('/guest/bookings', {
      params,
      returnRaw: true,
    });
    return response;
  }
);

export const fetchGuestBookingById = createAsyncThunk(
  'guest/fetchBookingById',
  async (id) => {
    const response = await api.get(`/guest/bookings/${id}`, {
      returnRaw: true,
    });
    return response;
  }
);

export const createGuestBooking = createAsyncThunk(
  'guest/createBooking',
  async (data) => {
    const response = await api.post('/guest/bookings', data, {
      returnRaw: true,
    });
    return response;
  }
);

export const updateGuestBooking = createAsyncThunk(
  'guest/updateBooking',
  async ({ id, data }) => {
    const response = await api.post(`/guest/bookings/${id}`, data, {
      returnRaw: true,
    });
    return response;
  }
);

