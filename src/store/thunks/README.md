# Role-Based API Thunks

This directory contains Redux thunks organized by user role for making API calls. This replaces the composable-based approach with a thunk-based architecture.

## Structure

```
store/
├── index.ts                    # Redux store configuration
├── StoreProvider.tsx           # Redux Provider component
└── thunks/
    ├── index.ts                # Exports all thunks
    ├── property-manager/       # Property Manager specific thunks
    │   └── propertyManagerThunks.ts
    ├── owner/                  # Owner specific thunks
    │   └── ownerThunks.ts
    ├── guest/                  # Guest specific thunks
    │   └── guestThunks.ts
    └── shared/                 # Shared thunks (used by multiple roles)
        └── sharedThunks.ts
```

## Usage

### In Components

```typescript
'use client';

import { useAppDispatch } from '@/store';
import { fetchPropertyManagerBookings } from '@/store/thunks';

function MyComponent() {
  const dispatch = useAppDispatch();

  const handleFetchBookings = async () => {
    try {
      const result = await dispatch(fetchPropertyManagerBookings({ page: 1 }));
      // result.payload contains the API response
      console.log('Bookings:', result.payload);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return <button onClick={handleFetchBookings}>Fetch Bookings</button>;
}
```

### With Loading States

```typescript
import { useAppDispatch, useAppSelector } from '@/store';
import { fetchPropertyManagerBookings } from '@/store/thunks';

function MyComponent() {
  const dispatch = useAppDispatch();
  const { loading, error, data } = useAppSelector((state) => ({
    loading: state.propertyManager?.loading || false,
    error: state.propertyManager?.error || null,
    data: state.propertyManager?.bookings || null,
  }));

  // ... component logic
}
```

## Available Thunks

### Property Manager
- `fetchPropertyManagerBookings`
- `fetchPropertyManagerBookingById`
- `createPropertyManagerBooking`
- `updatePropertyManagerBooking`
- `fetchPropertyManagerTransactions`
- `fetchPropertyManagerTransactionById`
- `createPropertyManagerTransaction`
- `updatePropertyManagerTransaction`
- `deletePropertyManagerTransaction`
- `fetchPropertyManagerInventory`
- `fetchPropertyManagerProperties`
- `fetchPropertyManagerPropertyById`
- `createPropertyManagerProperty`
- `updatePropertyManagerProperty`
- `deletePropertyManagerProperty`
- `fetchPropertyManagers`
- `fetchPropertyManagerById`
- `sendPropertyManagerRequest`
- `fetchPropertyManagerConnectionRequests`
- `updatePropertyManagerRequestStatus`
- `fetchPropertyManagerProjects`
- `fetchPropertyManagerProjectById`
- `createPropertyManagerProject`
- `updatePropertyManagerProject`
- `deletePropertyManagerProject`
- `fetchPropertyManagerIssues`
- `fetchPropertyManagerIssueById`
- `createPropertyManagerIssue`
- `updatePropertyManagerIssue`
- `deletePropertyManagerIssue`
- `fetchPropertyManagerReviews`
- `fetchPropertyManagerReviewById`
- `createPropertyManagerReview`
- `updatePropertyManagerReview`
- `deletePropertyManagerReview`
- `fetchPropertyManagerContacts`
- `createPropertyManagerContact`

### Owner
- `fetchOwners`
- `fetchOwnerById`
- `fetchConnectedOwners`
- `sendOwnerRequest`
- `fetchConnectionOwnerRequests`
- `updateOwnerConnectionRequestStatus`
- `removeOwner`
- `fetchOwnerInventory`

### Guest
- `fetchGuestBookings`
- `fetchGuestBookingById`
- `createGuestBooking`
- `updateGuestBooking`

### Shared Thunks
Use factory functions to create role-specific thunks:
- `createFetchPropertiesThunk(role)`
- `createFetchPropertyByIdThunk(role)`
- `createCreatePropertyThunk(role)`
- `createUpdatePropertyThunk(role)`
- `createDeletePropertyThunk(role)`
- `createFetchIssuesThunk(role)`
- `createFetchIssueByIdThunk(role)`
- `createCreateIssueThunk(role)`
- `createUpdateIssueThunk(role)`
- `createDeleteIssueThunk(role)`
- `createFetchReviewsThunk(role)`
- `createCreateReviewThunk(role)`
- `createFetchContactsThunk(role)`
- `createCreateContactThunk(role)`

## Migration from Composables

Instead of:
```typescript
const { fetchBookings } = usePropertyManagerBookingService();
await fetchBookings();
```

Use:
```typescript
const dispatch = useAppDispatch();
await dispatch(fetchPropertyManagerBookings());
```

