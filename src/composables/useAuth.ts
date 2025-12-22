'use client';

/**
 * Unified Authentication Composable
 * Handles authentication for all user roles (owner, property-manager, guest, technician, house-keeping, super-admin)
 * Adapted for Next.js
 */

import { useAuthState } from "./useAuthState"
import { useApi } from "./useApi"
import { UserRole, type UserRoleType, getRoleFromPath, ROLE_DASHBOARD_PATHS, ROLE_LOGIN_PATHS } from "./roles"
import { usePathname } from 'next/navigation'

export const useAuth = (role?: UserRoleType) => {
  const api = useApi()
  const { setAuthenticated, clearAuth } = useAuthState()
  const pathname = usePathname()

  /**
   * Get API endpoint prefix based on role
   */
  const getRoleEndpoint = (action: 'signin' | 'signup' | 'logout'): string => {
    let currentRole: UserRoleType | undefined = role
    
    if (!currentRole) {
      // Try to infer from route
      currentRole = getRoleFromPath(pathname || '') || undefined
    }
    
    if (!currentRole) {
      // Default to property-manager for backward compatibility
      return `/property-manager/${action}`
    }

    return `/${currentRole}/${action}`
  }

  /**
   * Get dashboard path based on role
   */
  const getDashboardPath = (): string => {
    let currentRole: UserRoleType | undefined = role
    
    if (!currentRole) {
      currentRole = getRoleFromPath(pathname || '') || undefined
    }
    
    if (!currentRole) {
      return ROLE_DASHBOARD_PATHS[UserRole.PROPERTY_MANAGER]
    }

    return ROLE_DASHBOARD_PATHS[currentRole]
  }

  /**
   * Login user
   * For email login: returns token directly
   * For phone login: generates OTP in backend
   */
  const login = async (credentials: { 
    email?: string
    phone?: string
    password?: string
    rememberMe?: boolean
  }) => {
    try {
      let currentRole: UserRoleType | undefined = role
      
      if (!currentRole) {
        currentRole = getRoleFromPath(pathname || '') || undefined
      }
      
      if (!currentRole) {
        currentRole = 'property-manager'
      }

      const endpoint = `/${currentRole}/signin`
      const response = await api.post<{ 
        token?: string
        user?: any
        message?: string
        otp_sent?: boolean 
        data?: {
          token?: string
          user?: any
        }
      }>(endpoint, credentials)
      
      console.log('Login response:', response)
      console.log('Response type:', typeof response)
      console.log('Response structure:', response ? JSON.stringify(response, null, 2) : 'response is null/undefined')
      
      // Handle different response structures
      // After handleResponse, Laravel's { data: {...} } is unwrapped to just {...}
      // So response should be { token, user } directly, not { data: { token, user } }
      // But we also check for nested data in case handleResponse didn't unwrap it
      let token: string | null = null
      let user: any = null
      
      if (response) {
        // Check direct properties first (after handleResponse unwrapping)
        token = response.token || null
        user = response.user || null
        
        // If not found, check nested data (in case response wasn't unwrapped)
        if (!token && (response as any).data) {
          token = (response as any).data.token || null
          user = (response as any).data.user || null
        }
      }
      
      console.log('Extracted token:', token ? 'Token found' : 'No token')
      console.log('Extracted user:', user ? 'User found' : 'No user')
      
      // If token is returned (email login), store it immediately
      if (typeof window !== 'undefined' && token) {
        console.log('Setting auth token and user data')
        localStorage.setItem('auth_token', token)
        localStorage.setItem('user_role', currentRole)
        
        // Update auth state - pass token explicitly to ensure it's stored
        if (user) {
          setAuthenticated(user, token, currentRole)
        } else {
          // Even if no user data, set authenticated with token
          // The auth store will handle this
          setAuthenticated({}, token, currentRole)
        }
      } else {
        console.warn('No token in login response:', response)
      }
      
      return response
    } catch (error: any) {
      if (error.validationErrors) {
        throw error
      }
      throw error
    }
  }

  /**
   * Send OTP for signup
   * Calls signup endpoint with all user data to generate and send OTP
   */
  const sendSignupOtp = async (userData: {
    name: string
    email: string
    password: string
    password_confirmation?: string
    phone: string
    date_of_birth?: string
    nationality?: string
    address?: string
    passport_copy?: File
    [key: string]: any
  }) => {
    try {
      let currentRole: UserRoleType | undefined = role
      
      if (!currentRole) {
        currentRole = getRoleFromPath(pathname || '') || undefined
      }
      
      if (!currentRole) {
        currentRole = 'property-manager'
      }

      // Call signup endpoint with all data to send OTP
      // Backend will store data temporarily and generate/send OTP
      const endpoint = `/${currentRole}/signup`
      
      // Check if we have a file upload - if so, use FormData
      const hasFile = userData.passport_copy instanceof File || userData.company_logo instanceof File
      
      let requestBody: FormData | Record<string, any>
      
      if (hasFile) {
        // Use FormData for file uploads
        requestBody = new FormData()
        requestBody.append('name', String(userData.name))
        requestBody.append('email', String(userData.email))
        requestBody.append('password', String(userData.password))
        
        if (userData.password_confirmation) {
          requestBody.append('password_confirmation', String(userData.password_confirmation))
        }
        
        requestBody.append('phone', String(userData.phone))
        if (userData.date_of_birth) requestBody.append('date_of_birth', String(userData.date_of_birth))
        if (userData.nationality) requestBody.append('nationality', String(userData.nationality))
        if (userData.address) requestBody.append('address', String(userData.address))
        if (userData.company_name) requestBody.append('company_name', String(userData.company_name))
        if (userData.passport_copy) requestBody.append('passport_copy', userData.passport_copy)
        if (userData.company_logo) requestBody.append('company_logo', userData.company_logo)
        
        // Add any additional fields
        Object.keys(userData).forEach(key => {
          if (!['name', 'email', 'password', 'password_confirmation', 'phone', 'date_of_birth', 'nationality', 'address', 'company_name', 'passport_copy', 'company_logo'].includes(key)) {
            if (userData[key] !== undefined && userData[key] !== null) {
              const value = userData[key]
              if (value instanceof File) {
                requestBody.append(key, value)
              } else if (typeof value === 'object') {
                requestBody.append(key, JSON.stringify(value))
              } else {
                requestBody.append(key, String(value))
              }
            }
          }
        })
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
        }
        
        // Add any additional fields
        Object.keys(userData).forEach(key => {
          if (!['name', 'email', 'password', 'password_confirmation', 'phone', 'date_of_birth', 'nationality', 'address', 'company_name', 'passport_copy', 'company_logo'].includes(key)) {
            if (userData[key] !== undefined && userData[key] !== null) {
              (requestBody as Record<string, any>)[key] = userData[key]
            }
          }
        })
      }
      
      const response = await api.post<{ message?: string; otp_sent?: boolean }>(endpoint, requestBody)
      
      return response
    } catch (error: any) {
      if (error.validationErrors) {
        throw error
      }
      throw error
    }
  }

  /**
   * Verify OTP for signup
   * Backend will verify OTP and complete registration, returning token and user data
   */
  const verifySignupOtp = async (phone: string, otp: string) => {
    try {
      let currentRole: UserRoleType | undefined = role
      
      if (!currentRole) {
        currentRole = getRoleFromPath(pathname || '') || undefined
      }
      
      if (!currentRole) {
        currentRole = 'property-manager'
      }

      // Verify OTP endpoint for signup
      // Backend will verify OTP and complete registration, returning token and user
      const endpoint = `/${currentRole}/verify-signup-otp`
      const response = await api.post<{ 
        token?: string
        user?: any
        verified?: boolean
        message?: string
        data?: {
          token?: string
          user?: any
        }
      }>(endpoint, { 
        phone,
        otp
      })
      
      console.log('Verify signup OTP response:', response)
      
      // Handle different response structures
      const token = response.token || response.data?.token
      const user = response.user || response.data?.user
      
      // Store token after successful OTP verification and registration completion
      if (typeof window !== 'undefined' && token) {
        console.log('Setting auth token and user data from signup OTP verification')
        localStorage.setItem('auth_token', token)
        localStorage.setItem('user_role', currentRole)
        
        // Update auth state - pass token explicitly
        if (user) {
          setAuthenticated(user, token, currentRole)
        } else {
          setAuthenticated({}, token, currentRole)
        }
      } else {
        console.warn('No token in verify signup OTP response:', response)
      }
      
      return response
    } catch (error: any) {
      if (error.validationErrors) {
        throw error
      }
      throw error
    }
  }

  /**
   * Verify OTP and complete login
   */
  const verifyOtp = async (otpData: {
    email?: string
    phone?: string
    otp: string
  }) => {
    try {
      let currentRole: UserRoleType | undefined = role
      
      if (!currentRole) {
        currentRole = getRoleFromPath(pathname || '') || undefined
      }
      
      if (!currentRole) {
        currentRole = 'property-manager'
      }

      // Verify OTP endpoint
      const endpoint = `/${currentRole}/verify-otp`
      const response = await api.post<{ 
        token?: string
        user?: any
        data?: {
          token?: string
          user?: any
        }
      }>(endpoint, otpData)
      
      console.log('Verify OTP response:', response)
      
      // Handle different response structures
      const token = response.token || response.data?.token
      const user = response.user || response.data?.user
      
      // Store token after successful OTP verification
      if (typeof window !== 'undefined' && token) {
        console.log('Setting auth token and user data from OTP verification')
        localStorage.setItem('auth_token', token)
        localStorage.setItem('user_role', currentRole)
        
        // Update auth state - pass token explicitly
        if (user) {
          setAuthenticated(user, token, currentRole)
        } else {
          setAuthenticated({}, token, currentRole)
        }
      } else {
        console.warn('No token in verify OTP response:', response)
      }

      return response
    } catch (error: any) {
      if (error.validationErrors) {
        throw error
      }
      throw error
    }
  }

  /**
   * Register user
   * Handles file uploads via FormData when needed
   */
  const register = async (userData: {
    name: string
    email: string
    password: string
    phone?: string
    date_of_birth?: string
    nationality?: string
    address?: string
    passport_copy?: File
    verification_code?: string
    [key: string]: any
  }) => {
    try {
      console.log('Unified register called with data:', { ...userData, passport_copy: userData.passport_copy ? 'File object' : 'No file' })
      
      const endpoint = getRoleEndpoint('signup')
      
      // Check if we have a file upload - if so, use FormData
      const hasFile = userData.passport_copy instanceof File
      
      let requestBody: FormData | Record<string, any>
      
      if (hasFile) {
        // Use FormData for file uploads
        requestBody = new FormData()
        requestBody.append('name', String(userData.name))
        requestBody.append('email', String(userData.email))
        requestBody.append('password', String(userData.password))
        
        // Add password_confirmation if provided
        if (userData.password_confirmation) {
          requestBody.append('password_confirmation', String(userData.password_confirmation))
        }
        
        if (userData.phone) requestBody.append('phone', String(userData.phone))
        if (userData.date_of_birth) requestBody.append('date_of_birth', String(userData.date_of_birth))
        if (userData.nationality) requestBody.append('nationality', String(userData.nationality))
        if (userData.address) requestBody.append('address', String(userData.address))
        if (userData.passport_copy) requestBody.append('passport_copy', userData.passport_copy) // File object, don't convert
        if (userData.verification_code) requestBody.append('verification_code', String(userData.verification_code))
        
        // Add any additional fields
        Object.keys(userData).forEach(key => {
          if (!['name', 'email', 'password', 'password_confirmation', 'phone', 'date_of_birth', 'nationality', 'address', 'passport_copy', 'verification_code'].includes(key)) {
            if (userData[key] !== undefined && userData[key] !== null) {
              const value = userData[key]
              // Convert to string for FormData (except File objects)
              if (value instanceof File) {
                requestBody.append(key, value)
              } else if (typeof value === 'object') {
                requestBody.append(key, JSON.stringify(value))
              } else {
                requestBody.append(key, String(value))
              }
            }
          }
        })
        
        console.log('Using FormData for request')
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
        }
        
        // Add any additional fields
        Object.keys(userData).forEach(key => {
          if (!['name', 'email', 'password', 'password_confirmation', 'phone', 'date_of_birth', 'nationality', 'address', 'passport_copy', 'verification_code'].includes(key)) {
            if (userData[key] !== undefined && userData[key] !== null) {
              // TypeScript: requestBody is Record<string, any> here (not FormData)
              (requestBody as Record<string, any>)[key] = userData[key]
            }
          }
        })
        
        console.log('Using JSON for request:', requestBody)
      }

      console.log('Calling API:', `POST ${endpoint}`)
      const response = await api.post<{ 
        token?: string
        user?: any
        data?: {
          token?: string
          user?: any
        }
      }>(endpoint, requestBody)
      
      console.log('API response received:', response)
      
      // Handle different response structures
      const token = response.token || response.data?.token
      const user = response.user || response.data?.user
      
      // Store token
      if (typeof window !== 'undefined' && token) {
        console.log('Setting auth token and user data from register')
        localStorage.setItem('auth_token', token)
        localStorage.setItem('user_role', role || 'property-manager')
        
        // Update auth state - pass token explicitly
        if (user) {
          setAuthenticated(user, token, role || 'property-manager')
        } else {
          setAuthenticated({}, token, role || 'property-manager')
        }
      } else {
        console.warn('No token in register response:', response)
      }

      return response
    } catch (error: any) {
      console.error('Unified register error:', error)
      if (error.validationErrors) {
        throw error
      }
      throw error
    }
  }

  /**
   * Logout user
   */
  const logout = async () => {
    try {
      const endpoint = getRoleEndpoint('logout')
      await api.post(endpoint)
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      // Clear auth state
      clearAuth()
      
      // Clear remember me preference
      if (typeof window !== 'undefined') {
        localStorage.removeItem('remember_me')
        localStorage.removeItem('user_role')
        // Redirect to root page
        window.location.href = '/'
      }
    }
  }

  /**
   * Get current user
   */
  const getCurrentUser = async () => {
    try {
      return await api.get('/auth/user')
    } catch (error) {
      throw error
    }
  }

  /**
   * Forgot password
   */
  const forgotPassword = async (email: string) => {
    try {
      return await api.post('/forgot-password', { email })
    } catch (error: any) {
      if (error.validationErrors) {
        throw error
      }
      throw error
    }
  }

  /**
   * Reset password
   */
  const resetPassword = async (token: string, password: string, passwordConfirmation?: string) => {
    try {
      return await api.post('/reset-password', {
        token,
        password,
        password_confirmation: passwordConfirmation || password,
      })
    } catch (error: any) {
      if (error.validationErrors) {
        throw error
      }
      throw error
    }
  }

  /**
   * Check if user is authenticated
   */
  const isAuthenticated = (): boolean => {
    if (typeof window !== 'undefined') {
      return !!localStorage.getItem('auth_token')
    }
    return false
  }

  return {
    login,
    verifyOtp,
    sendSignupOtp,
    verifySignupOtp,
    register,
    logout,
    getCurrentUser,
    forgotPassword,
    resetPassword,
    isAuthenticated,
    getDashboardPath,
  }
}

