/**
 * Property Manager Slices Index
 * Combines all property manager module slices
 */

import { combineReducers } from '@reduxjs/toolkit';
import developersReducer from './developers/slice';
import projectsReducer from './projects/slice';

const propertyManagerReducer = combineReducers({
  developers: developersReducer,
  projects: projectsReducer,
  // Add other modules here as they are created:
  // properties: propertiesReducer,
  // bookings: bookingsReducer,
  // etc.
});

export default propertyManagerReducer;

// Re-export selectors for convenience
export * from './developers/slice';
export * from './projects/slice';

