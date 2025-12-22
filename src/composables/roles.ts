/**
 * User Roles Constants
 * Matches backend RoleSlug enum values
 */
export enum UserRole {
  SUPER_ADMIN = 'super-admin',
  PROPERTY_MANAGER = 'property-manager',
  OWNER = 'owner',
  GUEST = 'guest',
  HOUSE_KEEPING = 'house-keeping',
  TECHNICIAN = 'technician',
}

export type UserRoleType = 
  | 'super-admin'
  | 'property-manager'
  | 'owner'
  | 'guest'
  | 'house-keeping'
  | 'technician'

/**
 * Role display names
 */
export const ROLE_DISPLAY_NAMES: Record<UserRoleType, string> = {
  'super-admin': 'Super Admin',
  'property-manager': 'Property Manager',
  'owner': 'Owner',
  'guest': 'Guest',
  'house-keeping': 'House Keeping',
  'technician': 'Technician',
}

/**
 * Role dashboard paths
 */
export const ROLE_DASHBOARD_PATHS: Record<UserRoleType, string> = {
  'super-admin': '/super-admin/dashboard',
  'property-manager': '/property-manager/dashboard',
  'owner': '/owner/dashboard',
  'guest': '/guest/dashboard',
  'house-keeping': '/house-keeping/dashboard',
  'technician': '/technician/dashboard',
}

/**
 * Role login paths
 */
export const ROLE_LOGIN_PATHS: Record<UserRoleType, string> = {
  'super-admin': '/super-admin/login',
  'property-manager': '/property-manager/login',
  'owner': '/owner/login',
  'guest': '/guest/login',
  'house-keeping': '/house-keeping/login',
  'technician': '/technician/login',
}

/**
 * Role signup paths
 */
export const ROLE_SIGNUP_PATHS: Record<UserRoleType, string> = {
  'super-admin': '/super-admin/signup',
  'property-manager': '/property-manager/signup',
  'owner': '/owner/signup',
  'guest': '/guest/signup',
  'house-keeping': '/house-keeping/signup',
  'technician': '/technician/signup',
}

/**
 * Get role from route path
 */
export const getRoleFromPath = (path: string): UserRoleType | null => {
  if (path.startsWith('/super-admin')) return UserRole.SUPER_ADMIN
  if (path.startsWith('/property-manager')) return UserRole.PROPERTY_MANAGER
  if (path.startsWith('/owner')) return UserRole.OWNER
  if (path.startsWith('/guest')) return UserRole.GUEST
  if (path.startsWith('/house-keeping')) return UserRole.HOUSE_KEEPING
  if (path.startsWith('/technician')) return UserRole.TECHNICIAN
  return null
}

/**
 * Check if role is valid
 */
export const isValidRole = (role: string): role is UserRoleType => {
  return Object.values(UserRole).includes(role as UserRole)
}

