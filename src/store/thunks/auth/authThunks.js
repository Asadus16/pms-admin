/**
 * Authentication API Thunks
 * Handles authentication API calls for all roles
 */

import { createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '@/lib/apiClient';

/**
 * Login user
 * For email login: returns token directly
 * For phone login: generates OTP in backend
 */
export const login = createAsyncThunk(
  'auth/login',
  async ({ role, credentials }) => {
    const endpoint = `/${role}/signin`;
    const response = await api.post(endpoint, credentials, {
      returnRaw: true,
    });
    return { role, response };
  }
);

/**
 * Verify OTP and complete login
 */
export const verifyOtp = createAsyncThunk(
  'auth/verifyOtp',
  async ({ role, otpData }) => {
    const endpoint = `/${role}/verify-otp`;
    const response = await api.post(endpoint, otpData, {
      returnRaw: true,
    });
    return { role, response };
  }
);

/**
 * Send OTP for signup
 * Calls signup endpoint with all user data to generate and send OTP
 */
export const sendSignupOtp = createAsyncThunk(
  'auth/sendSignupOtp',
  async ({ role, userData }) => {
    const endpoint = `/${role}/signup`;
    
    // Check if we have a file upload - if so, use FormData
    const hasFile = userData.passport_copy instanceof File || userData.company_logo instanceof File;
    
    let requestBody;
    
    if (hasFile) {
      // Use FormData for file uploads
      requestBody = new FormData();
      requestBody.append('name', String(userData.name));
      requestBody.append('email', String(userData.email));
      requestBody.append('password', String(userData.password));
      
      if (userData.password_confirmation) {
        requestBody.append('password_confirmation', String(userData.password_confirmation));
      }
      
      requestBody.append('phone', String(userData.phone));
      if (userData.date_of_birth) requestBody.append('date_of_birth', String(userData.date_of_birth));
      if (userData.nationality) requestBody.append('nationality', String(userData.nationality));
      if (userData.address) requestBody.append('address', String(userData.address));
      if (userData.company_name) requestBody.append('company_name', String(userData.company_name));
      if (userData.passport_copy) requestBody.append('passport_copy', userData.passport_copy);
      if (userData.company_logo) requestBody.append('company_logo', userData.company_logo);
      
      // Add any additional fields
      Object.keys(userData).forEach(key => {
        if (!['name', 'email', 'password', 'password_confirmation', 'phone', 'date_of_birth', 'nationality', 'address', 'company_name', 'passport_copy', 'company_logo'].includes(key)) {
          if (userData[key] !== undefined && userData[key] !== null) {
            const value = userData[key];
            if (value instanceof File) {
              requestBody.append(key, value);
            } else if (typeof value === 'object') {
              requestBody.append(key, JSON.stringify(value));
            } else {
              requestBody.append(key, String(value));
            }
          }
        }
      });
    } else {
      // Use regular JSON for non-file requests
      requestBody = {
        name: userData.name,
        email: userData.email,
        password: userData.password,
        ...(userData.password_confirmation && { password_confirmation: userData.password_confirmation }),
        phone: userData.phone,
        ...(userData.date_of_birth && { date_of_birth: userData.date_of_birth }),
        ...(userData.nationality && { nationality: userData.nationality }),
        ...(userData.address && { address: userData.address }),
        ...(userData.company_name && { company_name: userData.company_name }),
      };
      
      // Add any additional fields
      Object.keys(userData).forEach(key => {
        if (!['name', 'email', 'password', 'password_confirmation', 'phone', 'date_of_birth', 'nationality', 'address', 'company_name', 'passport_copy', 'company_logo'].includes(key)) {
          if (userData[key] !== undefined && userData[key] !== null) {
            requestBody[key] = userData[key];
          }
        }
      });
    }
    
    const response = await api.post(endpoint, requestBody, {
      returnRaw: true,
    });
    return { role, response };
  }
);

/**
 * Verify OTP for signup
 * Backend will verify OTP and complete registration, returning token and user data
 */
export const verifySignupOtp = createAsyncThunk(
  'auth/verifySignupOtp',
  async ({ role, phone, otp }) => {
    const endpoint = `/${role}/verify-signup-otp`;
    const response = await api.post(endpoint, { phone, otp }, {
      returnRaw: true,
    });
    return { role, response };
  }
);

/**
 * Register user
 * Handles file uploads via FormData when needed
 */
export const register = createAsyncThunk(
  'auth/register',
  async ({ role, userData }) => {
    const endpoint = `/${role}/signup`;
    
    // Check if we have a file upload - if so, use FormData
    const hasFile = userData.passport_copy instanceof File;
    
    let requestBody;
    
    if (hasFile) {
      // Use FormData for file uploads
      requestBody = new FormData();
      requestBody.append('name', String(userData.name));
      requestBody.append('email', String(userData.email));
      requestBody.append('password', String(userData.password));
      
      if (userData.password_confirmation) {
        requestBody.append('password_confirmation', String(userData.password_confirmation));
      }
      
      if (userData.phone) requestBody.append('phone', String(userData.phone));
      if (userData.date_of_birth) requestBody.append('date_of_birth', String(userData.date_of_birth));
      if (userData.nationality) requestBody.append('nationality', String(userData.nationality));
      if (userData.address) requestBody.append('address', String(userData.address));
      if (userData.passport_copy) requestBody.append('passport_copy', userData.passport_copy);
      if (userData.verification_code) requestBody.append('verification_code', String(userData.verification_code));
      
      // Add any additional fields
      Object.keys(userData).forEach(key => {
        if (!['name', 'email', 'password', 'password_confirmation', 'phone', 'date_of_birth', 'nationality', 'address', 'passport_copy', 'verification_code'].includes(key)) {
          if (userData[key] !== undefined && userData[key] !== null) {
            const value = userData[key];
            if (value instanceof File) {
              requestBody.append(key, value);
            } else if (typeof value === 'object') {
              requestBody.append(key, JSON.stringify(value));
            } else {
              requestBody.append(key, String(value));
            }
          }
        }
      });
    } else {
      // Use regular JSON for non-file requests
      requestBody = {
        name: userData.name,
        email: userData.email,
        password: userData.password,
        ...(userData.password_confirmation && { password_confirmation: userData.password_confirmation }),
        ...(userData.phone && { phone: userData.phone }),
        ...(userData.date_of_birth && { date_of_birth: userData.date_of_birth }),
        ...(userData.nationality && { nationality: userData.nationality }),
        ...(userData.address && { address: userData.address }),
        ...(userData.verification_code && { verification_code: userData.verification_code }),
      };
      
      // Add any additional fields
      Object.keys(userData).forEach(key => {
        if (!['name', 'email', 'password', 'password_confirmation', 'phone', 'date_of_birth', 'nationality', 'address', 'passport_copy', 'verification_code'].includes(key)) {
          if (userData[key] !== undefined && userData[key] !== null) {
            requestBody[key] = userData[key];
          }
        }
      });
    }
    
    const response = await api.post(endpoint, requestBody, {
      returnRaw: true,
    });
    return { role, response };
  }
);

/**
 * Logout user
 */
export const logout = createAsyncThunk(
  'auth/logout',
  async ({ role }) => {
    const endpoint = `/${role}/logout`;
    const response = await api.post(endpoint, {}, {
      returnRaw: true,
    });
    return { role, response };
  }
);

/**
 * Get current user
 */
export const getCurrentUser = createAsyncThunk(
  'auth/getCurrentUser',
  async () => {
    const response = await api.get('/auth/user', {
      returnRaw: true,
    });
    return response;
  }
);

/**
 * Forgot password
 */
export const forgotPassword = createAsyncThunk(
  'auth/forgotPassword',
  async ({ email }) => {
    const response = await api.post('/forgot-password', { email }, {
      returnRaw: true,
    });
    return response;
  }
);

/**
 * Reset password
 */
export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async ({ token, password, passwordConfirmation }) => {
    const response = await api.post('/reset-password', {
      token,
      password,
      password_confirmation: passwordConfirmation || password,
    }, {
      returnRaw: true,
    });
    return response;
  }
);

