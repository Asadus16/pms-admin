/**
 * Thunks Index
 * Exports all thunks organized by role
 */

// Authentication Thunks
export * from './auth/authThunks';

// Property Manager Thunks
export * from './property-manager/propertyManagerThunks';

// Owner Thunks
export * from './owner/ownerThunks';

// Guest Thunks
export * from './guest/guestThunks';

// Shared Thunks (for common resources across roles)
export * from './shared/sharedThunks';

// Add more role-based thunks as needed:
// export * from './technician/technicianThunks';
// export * from './house-keeping/houseKeepingThunks';
// export * from './super-admin/superAdminThunks';

