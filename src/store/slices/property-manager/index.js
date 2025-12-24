/**
 * Property Manager Slices Index
 * Combines all property manager module slices
 */

import { combineReducers } from '@reduxjs/toolkit';
import developersReducer from './developers/slice';
import projectsReducer from './projects/slice';
import ownersReducer from './owners/slice';
import inventoryReducer from './inventory/slice';
import contactsReducer from './contacts/slice';
import connectionRequestsReducer from './connection-requests/slice';
import leadsReducer from './leads/slice';

const propertyManagerReducer = combineReducers({
  developers: developersReducer,
  projects: projectsReducer,
  owners: ownersReducer,
  inventory: inventoryReducer,
  contacts: contactsReducer,
  connectionRequests: connectionRequestsReducer,
  leads: leadsReducer,
  // Add other modules here as they are created:
  // properties: propertiesReducer,
  // bookings: bookingsReducer,
  // etc.
});

export default propertyManagerReducer;

// Re-export selectors for convenience
export * from './developers/slice';
export * from './projects/slice';
export * from './owners/slice';
export * from './inventory/slice';
export * from './contacts/slice';
export * from './connection-requests/slice';
export * from './leads/slice';

