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
import propertiesReducer from './properties/slice';
import reportsReducer from './reports/slice';

const propertyManagerReducer = combineReducers({
  developers: developersReducer,
  projects: projectsReducer,
  owners: ownersReducer,
  inventory: inventoryReducer,
  contacts: contactsReducer,
  properties: propertiesReducer,
  reports: reportsReducer,
  // Add other modules here as they are created:
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
export * from './properties/slice';
export * from './reports/slice';

