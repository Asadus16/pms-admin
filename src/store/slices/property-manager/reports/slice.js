/**
 * Reports Slice
 * Redux state management for property reports
 */

import { createSlice } from '@reduxjs/toolkit';
import {
  fetchPropertyManagerPropertyView,
  fetchPropertyManagerDashboardProperty,
  fetchPropertyManagerBookings,
  fetchPropertyManagerTransactions,
  fetchPropertyManagerInventories,
} from '../../../thunks/property-manager/propertyManagerThunks';

const initialState = {
  // Properties list for reports
  properties: [],
  propertiesPagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    perPage: 50,
  },

  // Current property report data
  currentProperty: null,

  // Bookings for current property
  bookings: [],
  bookingsPagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    perPage: 50,
  },

  // Expenses (transactions with type=expense)
  expenses: [],
  expensesPagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    perPage: 50,
  },

  // Inventory for current property
  inventory: [],
  inventoryPagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    perPage: 50,
  },

  // Ledger (all transactions)
  ledger: [],
  ledgerPagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    perPage: 50,
  },

  // Loading states
  isLoadingProperties: false,
  isLoadingProperty: false,
  isLoadingBookings: false,
  isLoadingExpenses: false,
  isLoadingInventory: false,
  isLoadingLedger: false,

  error: null,
};

const reportsSlice = createSlice({
  name: 'reports',
  initialState,
  reducers: {
    clearReportsError: (state) => {
      state.error = null;
    },
    clearReportsCurrentProperty: (state) => {
      state.currentProperty = null;
      state.bookings = [];
      state.expenses = [];
      state.inventory = [];
      state.ledger = [];
    },
    setReportsPropertiesPage: (state, action) => {
      state.propertiesPagination.currentPage = action.payload;
    },
    setReportsBookingsPage: (state, action) => {
      state.bookingsPagination.currentPage = action.payload;
    },
    setReportsExpensesPage: (state, action) => {
      state.expensesPagination.currentPage = action.payload;
    },
    setReportsInventoryPage: (state, action) => {
      state.inventoryPagination.currentPage = action.payload;
    },
    setReportsLedgerPage: (state, action) => {
      state.ledgerPagination.currentPage = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Fetch Properties for Reports (Property View)
    builder
      .addCase(fetchPropertyManagerPropertyView.pending, (state) => {
        state.isLoadingProperties = true;
        state.error = null;
      })
      .addCase(fetchPropertyManagerPropertyView.fulfilled, (state, action) => {
        state.isLoadingProperties = false;
        const response = action.payload;
        // API returns { message, data: { data: [...], current_page, ... } }
        const data = response?.data;
        if (data?.data && Array.isArray(data.data)) {
          // Paginated response with nested data
          state.properties = data.data;
          state.propertiesPagination = {
            currentPage: data.current_page || 1,
            totalPages: data.last_page || 1,
            totalItems: data.total || data.data.length,
            perPage: data.per_page || 50,
          };
        } else if (Array.isArray(data)) {
          // Direct array response
          state.properties = data;
          state.propertiesPagination.totalItems = data.length;
        } else if (Array.isArray(response)) {
          state.properties = response;
          state.propertiesPagination.totalItems = response.length;
        } else {
          state.properties = [];
        }
      })
      .addCase(fetchPropertyManagerPropertyView.rejected, (state, action) => {
        state.isLoadingProperties = false;
        state.error = action.error?.message || 'Failed to fetch properties';
      });

    // Fetch Single Property Dashboard Data
    builder
      .addCase(fetchPropertyManagerDashboardProperty.pending, (state) => {
        state.isLoadingProperty = true;
        state.error = null;
      })
      .addCase(fetchPropertyManagerDashboardProperty.fulfilled, (state, action) => {
        state.isLoadingProperty = false;
        state.currentProperty = action.payload?.data || action.payload;
      })
      .addCase(fetchPropertyManagerDashboardProperty.rejected, (state, action) => {
        state.isLoadingProperty = false;
        state.error = action.error?.message || 'Failed to fetch property data';
      });

    // Fetch Bookings (reusing existing thunk with property_id filter)
    builder
      .addCase(fetchPropertyManagerBookings.pending, (state, action) => {
        // Only set loading if this is for reports (has property_id param)
        if (action.meta?.arg?.property_id) {
          state.isLoadingBookings = true;
        }
      })
      .addCase(fetchPropertyManagerBookings.fulfilled, (state, action) => {
        // Only update if this is for reports
        if (action.meta?.arg?.property_id) {
          state.isLoadingBookings = false;
          const response = action.payload;
          if (response?.data) {
            state.bookings = response.data;
            state.bookingsPagination = {
              currentPage: response.current_page || 1,
              totalPages: response.last_page || 1,
              totalItems: response.total || response.data.length,
              perPage: response.per_page || 50,
            };
          } else if (Array.isArray(response)) {
            state.bookings = response;
            state.bookingsPagination.totalItems = response.length;
          }
        }
      })
      .addCase(fetchPropertyManagerBookings.rejected, (state, action) => {
        if (action.meta?.arg?.property_id) {
          state.isLoadingBookings = false;
        }
      });

    // Fetch Transactions for Expenses and Ledger
    builder
      .addCase(fetchPropertyManagerTransactions.pending, (state, action) => {
        if (action.meta?.arg?.property_id) {
          if (action.meta?.arg?.type === 'expense') {
            state.isLoadingExpenses = true;
          } else {
            state.isLoadingLedger = true;
          }
        }
      })
      .addCase(fetchPropertyManagerTransactions.fulfilled, (state, action) => {
        if (action.meta?.arg?.property_id) {
          const response = action.payload;
          const isExpense = action.meta?.arg?.type === 'expense';

          if (isExpense) {
            state.isLoadingExpenses = false;
            if (response?.data) {
              state.expenses = response.data;
              state.expensesPagination = {
                currentPage: response.current_page || 1,
                totalPages: response.last_page || 1,
                totalItems: response.total || response.data.length,
                perPage: response.per_page || 50,
              };
            } else if (Array.isArray(response)) {
              state.expenses = response;
              state.expensesPagination.totalItems = response.length;
            }
          } else {
            state.isLoadingLedger = false;
            if (response?.data) {
              state.ledger = response.data;
              state.ledgerPagination = {
                currentPage: response.current_page || 1,
                totalPages: response.last_page || 1,
                totalItems: response.total || response.data.length,
                perPage: response.per_page || 50,
              };
            } else if (Array.isArray(response)) {
              state.ledger = response;
              state.ledgerPagination.totalItems = response.length;
            }
          }
        }
      })
      .addCase(fetchPropertyManagerTransactions.rejected, (state, action) => {
        if (action.meta?.arg?.property_id) {
          if (action.meta?.arg?.type === 'expense') {
            state.isLoadingExpenses = false;
          } else {
            state.isLoadingLedger = false;
          }
        }
      });

    // Fetch Inventory
    builder
      .addCase(fetchPropertyManagerInventories.pending, (state, action) => {
        if (action.meta?.arg?.property_id) {
          state.isLoadingInventory = true;
        }
      })
      .addCase(fetchPropertyManagerInventories.fulfilled, (state, action) => {
        if (action.meta?.arg?.property_id) {
          state.isLoadingInventory = false;
          const response = action.payload;
          if (response?.data) {
            state.inventory = response.data;
            state.inventoryPagination = {
              currentPage: response.current_page || 1,
              totalPages: response.last_page || 1,
              totalItems: response.total || response.data.length,
              perPage: response.per_page || 50,
            };
          } else if (Array.isArray(response)) {
            state.inventory = response;
            state.inventoryPagination.totalItems = response.length;
          }
        }
      })
      .addCase(fetchPropertyManagerInventories.rejected, (state, action) => {
        if (action.meta?.arg?.property_id) {
          state.isLoadingInventory = false;
        }
      });
  },
});

export const {
  clearReportsError,
  clearReportsCurrentProperty,
  setReportsPropertiesPage,
  setReportsBookingsPage,
  setReportsExpensesPage,
  setReportsInventoryPage,
  setReportsLedgerPage,
} = reportsSlice.actions;

// Selectors
export const selectReportsProperties = (state) => state.propertyManager.reports.properties;
export const selectReportsPropertiesPagination = (state) => state.propertyManager.reports.propertiesPagination;
export const selectReportsCurrentProperty = (state) => state.propertyManager.reports.currentProperty;
export const selectReportsBookings = (state) => state.propertyManager.reports.bookings;
export const selectReportsBookingsPagination = (state) => state.propertyManager.reports.bookingsPagination;
export const selectReportsExpenses = (state) => state.propertyManager.reports.expenses;
export const selectReportsExpensesPagination = (state) => state.propertyManager.reports.expensesPagination;
export const selectReportsInventory = (state) => state.propertyManager.reports.inventory;
export const selectReportsInventoryPagination = (state) => state.propertyManager.reports.inventoryPagination;
export const selectReportsLedger = (state) => state.propertyManager.reports.ledger;
export const selectReportsLedgerPagination = (state) => state.propertyManager.reports.ledgerPagination;
export const selectReportsLoadingProperties = (state) => state.propertyManager.reports.isLoadingProperties;
export const selectReportsLoadingProperty = (state) => state.propertyManager.reports.isLoadingProperty;
export const selectReportsLoadingBookings = (state) => state.propertyManager.reports.isLoadingBookings;
export const selectReportsLoadingExpenses = (state) => state.propertyManager.reports.isLoadingExpenses;
export const selectReportsLoadingInventory = (state) => state.propertyManager.reports.isLoadingInventory;
export const selectReportsLoadingLedger = (state) => state.propertyManager.reports.isLoadingLedger;
export const selectReportsError = (state) => state.propertyManager.reports.error;

export default reportsSlice.reducer;
