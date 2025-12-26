'use client';

import { useMemo, useCallback, useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import {
  Page,
  Card,
  Text,
  TextField,
  BlockStack,
  InlineStack,
  Button,
  Box,
  Icon,
  Layout,
  Popover,
  ActionList,
  Badge,
  Spinner,
} from '@shopify/polaris';
import { HomeIcon, ChevronRightIcon, ArrowLeftIcon } from '@shopify/polaris-icons';
import { useAppDispatch, useAppSelector } from '@/store';
import { fetchPropertyManagerPropertyById } from '@/store/thunks';
import {
  selectCurrentProperty,
  selectPropertiesLoading,
  selectPropertiesError,
  clearCurrentProperty,
} from '@/store/slices/property-manager';
import './AddDeveloper.css';

function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: '2-digit' });
}

export default function PropertyViewPage({ propertyId }) {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const [actionsPopoverActive, setActionsPopoverActive] = useState(false);

  // Redux state
  const property = useAppSelector(selectCurrentProperty);
  const loading = useAppSelector(selectPropertiesLoading);
  const error = useAppSelector(selectPropertiesError);

  const basePath = useMemo(() => {
    const seg = pathname?.split('/')?.[1];
    return seg ? `/${seg}` : '/property-manager';
  }, [pathname]);

  // Fetch property data from API
  useEffect(() => {
    if (propertyId) {
      dispatch(fetchPropertyManagerPropertyById(propertyId));
    }

    // Cleanup on unmount
    return () => {
      dispatch(clearCurrentProperty());
    };
  }, [propertyId, dispatch]);

  // Extract related data from property
  const project = property?.project || null;
  const developer = property?.developer || property?.project?.developer || null;
  const owner = property?.owner || null;
  const description = property?.description || null;
  const photos = property?.photos || [];
  const amenities = property?.amenities || [];
  const pricing = property?.pricings?.[0] || null;
  const agreement = property?.agreement || null;
  const policies = property?.policies || [];

  const handleBack = useCallback(() => {
    router.push(`${basePath}/properties`);
  }, [router, basePath]);

  const toggleActionsPopover = useCallback(() => {
    setActionsPopoverActive((active) => !active);
  }, []);

  // Loading state
  if (loading) {
    return (
      <div className="add-developer-wrapper">
        <div className="view-user-header">
          <InlineStack gap="050" blockAlign="center">
            <Icon source={HomeIcon} tone="base" />
            <Icon source={ChevronRightIcon} tone="subdued" />
            <span className="new-developer-title">Property details</span>
          </InlineStack>
        </div>
        <Page>
          <Card>
            <Box padding="800">
              <InlineStack align="center" blockAlign="center">
                <Spinner size="large" />
              </InlineStack>
            </Box>
          </Card>
        </Page>
      </div>
    );
  }

  // Error or not found state
  if (error || !property) {
    return (
      <Page
        title="Property"
        backAction={{ content: 'Properties', onAction: handleBack }}
      >
        <Card>
          <Box padding="400">
            <BlockStack gap="200">
              <Text variant="headingMd" as="h2">
                {error ? 'Error loading property' : 'Property not found'}
              </Text>
              <Text variant="bodyMd" as="p" tone="subdued">
                {error || `We couldn't find a property with ID: ${propertyId}`}
              </Text>
              <div>
                <Button icon={ArrowLeftIcon} onClick={handleBack}>
                  Back to properties
                </Button>
              </div>
            </BlockStack>
          </Box>
        </Card>
      </Page>
    );
  }

  const actionsPopoverActivator = (
    <Button onClick={toggleActionsPopover} disclosure="down">
      More actions
    </Button>
  );

  const actionItems = [
    {
      content: 'Edit',
      onAction: () => {
        setActionsPopoverActive(false);
        router.push(`${basePath}/properties/${property.id}/edit`);
      },
    },
    {
      content: property.status === 'available' ? 'Mark as unavailable' : 'Mark as available',
      destructive: property.status === 'available',
      onAction: () => {
        setActionsPopoverActive(false);
        // Placeholder for future status update
        console.log('Toggle property status', property.id);
      },
    },
  ];

  const getStatusLabel = (status) => {
    switch (status) {
      case 'draft': return 'Draft';
      case 'active': return 'Active';
      case 'inactive': return 'Inactive';
      case 'available': return 'Available';
      case 'reserved': return 'Reserved';
      case 'sold': return 'Sold';
      case 'rented': return 'Rented';
      case 'under_maintenance': return 'Under Maintenance';
      case 'owner_occupied': return 'Owner Occupied';
      default: return status || 'Unknown';
    }
  };

  const getStatusTone = (status) => {
    switch (status) {
      case 'draft': return 'info';
      case 'active': return 'success';
      case 'inactive': return 'subdued';
      case 'available': return 'success';
      case 'reserved': return 'warning';
      case 'sold': return 'info';
      case 'rented': return 'attention';
      case 'under_maintenance': return 'subdued';
      case 'owner_occupied': return 'subdued';
      default: return 'subdued';
    }
  };

  const getPropertyTypeLabel = (type) => {
    const types = {
      apartment: 'Apartment',
      villa: 'Villa',
      townhouse: 'Townhouse',
      penthouse: 'Penthouse',
      studio: 'Studio',
      office: 'Office',
      shop: 'Shop',
      plot: 'Plot',
    };
    return types[type] || type || 'N/A';
  };

  const getBookingTypeLabel = (type) => {
    return type === 'instant' ? 'Instant' : type === 'request' ? 'Request' : type || 'N/A';
  };

  const getListingVisibilityLabel = (visibility) => {
    const labels = {
      internal_only: 'Internal Only',
      shared_with_partners: 'Shared with Partners',
      public: 'Public',
    };
    return labels[visibility] || visibility;
  };

  return (
    <div className="add-developer-wrapper">
      {/* Custom header row (matches buildit-fe ViewUser layout) */}
      <div className="view-user-header">
        <InlineStack gap="050" blockAlign="center">
          <Icon source={HomeIcon} tone="base" />
          <Icon source={ChevronRightIcon} tone="subdued" />
          <span className="new-developer-title">Property details</span>
        </InlineStack>
        <Popover
          active={actionsPopoverActive}
          activator={actionsPopoverActivator}
          onClose={toggleActionsPopover}
          preferredAlignment="right"
        >
          <ActionList items={actionItems} />
        </Popover>
      </div>
      <Page>
        <Layout>
          {/* Main content - Left column */}
          <Layout.Section>
            <BlockStack gap="400">
              {/* Property Details card */}
              <Card>
                <BlockStack gap="400">
                  <Text variant="headingMd" as="h2">
                    Property details
                  </Text>

                  <TextField
                    label="Property ID"
                    value={property.unique_id || property.uuid || `PRP-${String(property.id).padStart(4, '0')}`}
                    readOnly
                    autoComplete="off"
                    helpText="System generated ID"
                  />

                  <BlockStack gap="300">
                    {/* Project */}
                    <InlineStack gap="300" align="start" blockAlign="center" wrap={false}>
                      <Box minWidth="200px" width="200px" flexShrink={0}>
                        <Text variant="bodyMd" as="span" fontWeight="medium">
                          Project
                        </Text>
                      </Box>
                      <Box minWidth="0" width="400px" flexShrink={0}>
                        <TextField
                          label="Project"
                          labelHidden
                          value={project?.project_name || ''}
                          readOnly
                          autoComplete="off"
                        />
                      </Box>
                    </InlineStack>

                    {/* Developer */}
                    <InlineStack gap="300" align="start" blockAlign="center" wrap={false}>
                      <Box minWidth="200px" width="200px" flexShrink={0}>
                        <Text variant="bodyMd" as="span" fontWeight="medium">
                          Developer
                        </Text>
                      </Box>
                      <Box minWidth="0" width="400px" flexShrink={0}>
                        <TextField
                          label="Developer"
                          labelHidden
                          value={developer?.developer_name || ''}
                          readOnly
                          autoComplete="off"
                        />
                      </Box>
                    </InlineStack>

                    {/* Owner */}
                    <InlineStack gap="300" align="start" blockAlign="center" wrap={false}>
                      <Box minWidth="200px" width="200px" flexShrink={0}>
                        <Text variant="bodyMd" as="span" fontWeight="medium">
                          Owner
                        </Text>
                      </Box>
                      <Box minWidth="0" width="400px" flexShrink={0}>
                        <TextField
                          label="Owner"
                          labelHidden
                          value={owner?.name || owner?.full_name || `${owner?.first_name || ''} ${owner?.last_name || ''}`.trim() || ''}
                          readOnly
                          autoComplete="off"
                        />
                      </Box>
                    </InlineStack>

                    {/* Property Type */}
                    <InlineStack gap="300" align="start" blockAlign="center" wrap={false}>
                      <Box minWidth="200px" width="200px" flexShrink={0}>
                        <Text variant="bodyMd" as="span" fontWeight="medium">
                          Property Type
                        </Text>
                      </Box>
                      <Box minWidth="0" width="400px" flexShrink={0}>
                        <TextField
                          label="Property Type"
                          labelHidden
                          value={getPropertyTypeLabel(property.type)}
                          readOnly
                          autoComplete="off"
                        />
                      </Box>
                    </InlineStack>

                    {/* Unit Number */}
                    {property.unit_number && (
                      <InlineStack gap="300" align="start" blockAlign="center" wrap={false}>
                        <Box minWidth="200px" width="200px" flexShrink={0}>
                          <Text variant="bodyMd" as="span" fontWeight="medium">
                            Unit Number
                          </Text>
                        </Box>
                        <Box minWidth="0" width="400px" flexShrink={0}>
                          <TextField
                            label="Unit Number"
                            labelHidden
                            value={property.unit_number}
                            readOnly
                            autoComplete="off"
                          />
                        </Box>
                      </InlineStack>
                    )}

                    {/* Building Name */}
                    {property.building_name && (
                      <InlineStack gap="300" align="start" blockAlign="center" wrap={false}>
                        <Box minWidth="200px" width="200px" flexShrink={0}>
                          <Text variant="bodyMd" as="span" fontWeight="medium">
                            Building Name
                          </Text>
                        </Box>
                        <Box minWidth="0" width="400px" flexShrink={0}>
                          <TextField
                            label="Building Name"
                            labelHidden
                            value={property.building_name}
                            readOnly
                            autoComplete="off"
                          />
                        </Box>
                      </InlineStack>
                    )}

                    {/* Floor Number */}
                    {property.floor_number && (
                      <InlineStack gap="300" align="start" blockAlign="center" wrap={false}>
                        <Box minWidth="200px" width="200px" flexShrink={0}>
                          <Text variant="bodyMd" as="span" fontWeight="medium">
                            Floor Number
                          </Text>
                        </Box>
                        <Box minWidth="0" width="400px" flexShrink={0}>
                          <TextField
                            label="Floor Number"
                            labelHidden
                            value={property.floor_number}
                            readOnly
                            autoComplete="off"
                          />
                        </Box>
                      </InlineStack>
                    )}

                    {/* Property Size */}
                    {property.property_size && (
                      <InlineStack gap="300" align="start" blockAlign="center" wrap={false}>
                        <Box minWidth="200px" width="200px" flexShrink={0}>
                          <Text variant="bodyMd" as="span" fontWeight="medium">
                            Property Size
                          </Text>
                        </Box>
                        <Box minWidth="0" width="400px" flexShrink={0}>
                          <TextField
                            label="Property Size"
                            labelHidden
                            value={`${property.property_size} sqft`}
                            readOnly
                            autoComplete="off"
                          />
                        </Box>
                      </InlineStack>
                    )}

                    {/* Bedrooms */}
                    {property.bedrooms && (
                      <InlineStack gap="300" align="start" blockAlign="center" wrap={false}>
                        <Box minWidth="200px" width="200px" flexShrink={0}>
                          <Text variant="bodyMd" as="span" fontWeight="medium">
                            Bedrooms
                          </Text>
                        </Box>
                        <Box minWidth="0" width="400px" flexShrink={0}>
                          <TextField
                            label="Bedrooms"
                            labelHidden
                            value={String(property.bedrooms)}
                            readOnly
                            autoComplete="off"
                          />
                        </Box>
                      </InlineStack>
                    )}

                    {/* Rooms */}
                    {property.rooms && (
                      <InlineStack gap="300" align="start" blockAlign="center" wrap={false}>
                        <Box minWidth="200px" width="200px" flexShrink={0}>
                          <Text variant="bodyMd" as="span" fontWeight="medium">
                            Rooms
                          </Text>
                        </Box>
                        <Box minWidth="0" width="400px" flexShrink={0}>
                          <TextField
                            label="Rooms"
                            labelHidden
                            value={property.rooms}
                            readOnly
                            autoComplete="off"
                          />
                        </Box>
                      </InlineStack>
                    )}

                    {/* Bathrooms */}
                    {property.bathrooms && (
                      <InlineStack gap="300" align="start" blockAlign="center" wrap={false}>
                        <Box minWidth="200px" width="200px" flexShrink={0}>
                          <Text variant="bodyMd" as="span" fontWeight="medium">
                            Bathrooms
                          </Text>
                        </Box>
                        <Box minWidth="0" width="400px" flexShrink={0}>
                          <TextField
                            label="Bathrooms"
                            labelHidden
                            value={property.bathrooms}
                            readOnly
                            autoComplete="off"
                          />
                        </Box>
                      </InlineStack>
                    )}

                    {/* Max Guests */}
                    {property.max_guests && (
                      <InlineStack gap="300" align="start" blockAlign="center" wrap={false}>
                        <Box minWidth="200px" width="200px" flexShrink={0}>
                          <Text variant="bodyMd" as="span" fontWeight="medium">
                            Max Guests
                          </Text>
                        </Box>
                        <Box minWidth="0" width="400px" flexShrink={0}>
                          <TextField
                            label="Max Guests"
                            labelHidden
                            value={property.max_guests}
                            readOnly
                            autoComplete="off"
                          />
                        </Box>
                      </InlineStack>
                    )}

                    {/* Property Features Row */}
                    {(property.maid_room || property.balcony || property.parking || property.furnished || property.smart_home || property.smart_home_enabled) && (
                      <InlineStack gap="300" align="start" blockAlign="center" wrap={false}>
                        <Box minWidth="200px" width="200px" flexShrink={0}>
                          <Text variant="bodyMd" as="span" fontWeight="medium">
                            Features
                          </Text>
                        </Box>
                        <Box minWidth="0" width="400px" flexShrink={0}>
                          <InlineStack gap="200" wrap>
                            {property.maid_room && <Badge tone="info">Maid Room</Badge>}
                            {property.balcony && <Badge tone="info">Balcony</Badge>}
                            {property.furnished && <Badge tone="info">Furnished</Badge>}
                            {(property.smart_home || property.smart_home_enabled) && <Badge tone="info">Smart Home</Badge>}
                            {property.parking && <Badge tone="info">{property.parking} Parking</Badge>}
                          </InlineStack>
                        </Box>
                      </InlineStack>
                    )}

                    {/* Ceiling Height */}
                    {property.ceiling_height && (
                      <InlineStack gap="300" align="start" blockAlign="center" wrap={false}>
                        <Box minWidth="200px" width="200px" flexShrink={0}>
                          <Text variant="bodyMd" as="span" fontWeight="medium">
                            Ceiling Height
                          </Text>
                        </Box>
                        <Box minWidth="0" width="400px" flexShrink={0}>
                          <TextField
                            label="Ceiling Height"
                            labelHidden
                            value={`${property.ceiling_height} m`}
                            readOnly
                            autoComplete="off"
                          />
                        </Box>
                      </InlineStack>
                    )}

                    {/* View */}
                    {property.view && (
                      <InlineStack gap="300" align="start" blockAlign="center" wrap={false}>
                        <Box minWidth="200px" width="200px" flexShrink={0}>
                          <Text variant="bodyMd" as="span" fontWeight="medium">
                            View
                          </Text>
                        </Box>
                        <Box minWidth="0" width="400px" flexShrink={0}>
                          <TextField
                            label="View"
                            labelHidden
                            value={property.view}
                            readOnly
                            autoComplete="off"
                          />
                        </Box>
                      </InlineStack>
                    )}

                    {/* Date Created */}
                    {property.created_at && (
                      <InlineStack gap="300" align="start" blockAlign="center" wrap={false}>
                        <Box minWidth="200px" width="200px" flexShrink={0}>
                          <Text variant="bodyMd" as="span" fontWeight="medium">
                            Date added
                          </Text>
                        </Box>
                        <Box minWidth="0" width="400px" flexShrink={0}>
                          <TextField
                            label="Date added"
                            labelHidden
                            value={formatDate(property.created_at)}
                            readOnly
                            autoComplete="off"
                          />
                        </Box>
                      </InlineStack>
                    )}
                  </BlockStack>
                </BlockStack>
              </Card>

              {/* Address Information card */}
              {(property.address_1 || property.city || property.country) && (
                <Card>
                  <BlockStack gap="400">
                    <Text variant="headingMd" as="h2">
                      Address information
                    </Text>

                    <BlockStack gap="300">
                      {property.address_1 && (
                        <InlineStack gap="300" align="start" blockAlign="center" wrap={false}>
                          <Box minWidth="200px" width="200px" flexShrink={0}>
                            <Text variant="bodyMd" as="span" fontWeight="medium">
                              Address Line 1
                            </Text>
                          </Box>
                          <Box minWidth="0" width="400px" flexShrink={0}>
                            <TextField
                              label="Address Line 1"
                              labelHidden
                              value={property.address_1}
                              readOnly
                              autoComplete="off"
                            />
                          </Box>
                        </InlineStack>
                      )}

                      {property.address_2 && (
                        <InlineStack gap="300" align="start" blockAlign="center" wrap={false}>
                          <Box minWidth="200px" width="200px" flexShrink={0}>
                            <Text variant="bodyMd" as="span" fontWeight="medium">
                              Address Line 2
                            </Text>
                          </Box>
                          <Box minWidth="0" width="400px" flexShrink={0}>
                            <TextField
                              label="Address Line 2"
                              labelHidden
                              value={property.address_2}
                              readOnly
                              autoComplete="off"
                            />
                          </Box>
                        </InlineStack>
                      )}

                      {property.city && (
                        <InlineStack gap="300" align="start" blockAlign="center" wrap={false}>
                          <Box minWidth="200px" width="200px" flexShrink={0}>
                            <Text variant="bodyMd" as="span" fontWeight="medium">
                              City
                            </Text>
                          </Box>
                          <Box minWidth="0" width="400px" flexShrink={0}>
                            <TextField
                              label="City"
                              labelHidden
                              value={property.city}
                              readOnly
                              autoComplete="off"
                            />
                          </Box>
                        </InlineStack>
                      )}

                      {property.state && (
                        <InlineStack gap="300" align="start" blockAlign="center" wrap={false}>
                          <Box minWidth="200px" width="200px" flexShrink={0}>
                            <Text variant="bodyMd" as="span" fontWeight="medium">
                              State
                            </Text>
                          </Box>
                          <Box minWidth="0" width="400px" flexShrink={0}>
                            <TextField
                              label="State"
                              labelHidden
                              value={property.state}
                              readOnly
                              autoComplete="off"
                            />
                          </Box>
                        </InlineStack>
                      )}

                      {property.country && (
                        <InlineStack gap="300" align="start" blockAlign="center" wrap={false}>
                          <Box minWidth="200px" width="200px" flexShrink={0}>
                            <Text variant="bodyMd" as="span" fontWeight="medium">
                              Country
                            </Text>
                          </Box>
                          <Box minWidth="0" width="400px" flexShrink={0}>
                            <TextField
                              label="Country"
                              labelHidden
                              value={property.country}
                              readOnly
                              autoComplete="off"
                            />
                          </Box>
                        </InlineStack>
                      )}

                      {property.zip_code && (
                        <InlineStack gap="300" align="start" blockAlign="center" wrap={false}>
                          <Box minWidth="200px" width="200px" flexShrink={0}>
                            <Text variant="bodyMd" as="span" fontWeight="medium">
                              Zip Code
                            </Text>
                          </Box>
                          <Box minWidth="0" width="400px" flexShrink={0}>
                            <TextField
                              label="Zip Code"
                              labelHidden
                              value={property.zip_code}
                              readOnly
                              autoComplete="off"
                            />
                          </Box>
                        </InlineStack>
                      )}

                      {(property.latitude || property.longitude) && (
                        <InlineStack gap="300" align="start" blockAlign="center" wrap={false}>
                          <Box minWidth="200px" width="200px" flexShrink={0}>
                            <Text variant="bodyMd" as="span" fontWeight="medium">
                              Coordinates
                            </Text>
                          </Box>
                          <Box minWidth="0" width="400px" flexShrink={0}>
                            <TextField
                              label="Coordinates"
                              labelHidden
                              value={`${property.latitude || ''}, ${property.longitude || ''}`}
                              readOnly
                              autoComplete="off"
                            />
                          </Box>
                        </InlineStack>
                      )}
                    </BlockStack>
                  </BlockStack>
                </Card>
              )}

              {/* Booking Settings card */}
              {(property.booking_type || property.check_in_time || property.check_out_time) && (
                <Card>
                  <BlockStack gap="400">
                    <Text variant="headingMd" as="h2">
                      Booking settings
                    </Text>

                    <BlockStack gap="300">
                      {property.booking_type && (
                        <InlineStack gap="300" align="start" blockAlign="center" wrap={false}>
                          <Box minWidth="200px" width="200px" flexShrink={0}>
                            <Text variant="bodyMd" as="span" fontWeight="medium">
                              Booking Type
                            </Text>
                          </Box>
                          <Box minWidth="0" width="400px" flexShrink={0}>
                            <TextField
                              label="Booking Type"
                              labelHidden
                              value={getBookingTypeLabel(property.booking_type)}
                              readOnly
                              autoComplete="off"
                            />
                          </Box>
                        </InlineStack>
                      )}

                      {property.check_in_time && (
                        <InlineStack gap="300" align="start" blockAlign="center" wrap={false}>
                          <Box minWidth="200px" width="200px" flexShrink={0}>
                            <Text variant="bodyMd" as="span" fontWeight="medium">
                              Check-in Time
                            </Text>
                          </Box>
                          <Box minWidth="0" width="400px" flexShrink={0}>
                            <TextField
                              label="Check-in Time"
                              labelHidden
                              value={property.check_in_time}
                              readOnly
                              autoComplete="off"
                            />
                          </Box>
                        </InlineStack>
                      )}

                      {property.check_out_time && (
                        <InlineStack gap="300" align="start" blockAlign="center" wrap={false}>
                          <Box minWidth="200px" width="200px" flexShrink={0}>
                            <Text variant="bodyMd" as="span" fontWeight="medium">
                              Check-out Time
                            </Text>
                          </Box>
                          <Box minWidth="0" width="400px" flexShrink={0}>
                            <TextField
                              label="Check-out Time"
                              labelHidden
                              value={property.check_out_time}
                              readOnly
                              autoComplete="off"
                            />
                          </Box>
                        </InlineStack>
                      )}

                      {property.minimum_stay && (
                        <InlineStack gap="300" align="start" blockAlign="center" wrap={false}>
                          <Box minWidth="200px" width="200px" flexShrink={0}>
                            <Text variant="bodyMd" as="span" fontWeight="medium">
                              Minimum Stay
                            </Text>
                          </Box>
                          <Box minWidth="0" width="400px" flexShrink={0}>
                            <TextField
                              label="Minimum Stay"
                              labelHidden
                              value={`${property.minimum_stay} nights`}
                              readOnly
                              autoComplete="off"
                            />
                          </Box>
                        </InlineStack>
                      )}

                      {property.maximum_stay && (
                        <InlineStack gap="300" align="start" blockAlign="center" wrap={false}>
                          <Box minWidth="200px" width="200px" flexShrink={0}>
                            <Text variant="bodyMd" as="span" fontWeight="medium">
                              Maximum Stay
                            </Text>
                          </Box>
                          <Box minWidth="0" width="400px" flexShrink={0}>
                            <TextField
                              label="Maximum Stay"
                              labelHidden
                              value={`${property.maximum_stay} nights`}
                              readOnly
                              autoComplete="off"
                            />
                          </Box>
                        </InlineStack>
                      )}

                      {property.maximum_weekend_stay && (
                        <InlineStack gap="300" align="start" blockAlign="center" wrap={false}>
                          <Box minWidth="200px" width="200px" flexShrink={0}>
                            <Text variant="bodyMd" as="span" fontWeight="medium">
                              Max Weekend Stay
                            </Text>
                          </Box>
                          <Box minWidth="0" width="400px" flexShrink={0}>
                            <TextField
                              label="Max Weekend Stay"
                              labelHidden
                              value={`${property.maximum_weekend_stay} nights`}
                              readOnly
                              autoComplete="off"
                            />
                          </Box>
                        </InlineStack>
                      )}

                      {property.booking_lead_time && (
                        <InlineStack gap="300" align="start" blockAlign="center" wrap={false}>
                          <Box minWidth="200px" width="200px" flexShrink={0}>
                            <Text variant="bodyMd" as="span" fontWeight="medium">
                              Booking Lead Time
                            </Text>
                          </Box>
                          <Box minWidth="0" width="400px" flexShrink={0}>
                            <TextField
                              label="Booking Lead Time"
                              labelHidden
                              value={`${property.booking_lead_time} days`}
                              readOnly
                              autoComplete="off"
                            />
                          </Box>
                        </InlineStack>
                      )}

                      {property.booking_window && (
                        <InlineStack gap="300" align="start" blockAlign="center" wrap={false}>
                          <Box minWidth="200px" width="200px" flexShrink={0}>
                            <Text variant="bodyMd" as="span" fontWeight="medium">
                              Booking Window
                            </Text>
                          </Box>
                          <Box minWidth="0" width="400px" flexShrink={0}>
                            <TextField
                              label="Booking Window"
                              labelHidden
                              value={`${property.booking_window} days`}
                              readOnly
                              autoComplete="off"
                            />
                          </Box>
                        </InlineStack>
                      )}

                      {property.turnover && (
                        <InlineStack gap="300" align="start" blockAlign="center" wrap={false}>
                          <Box minWidth="200px" width="200px" flexShrink={0}>
                            <Text variant="bodyMd" as="span" fontWeight="medium">
                              Turnover Days
                            </Text>
                          </Box>
                          <Box minWidth="0" width="400px" flexShrink={0}>
                            <TextField
                              label="Turnover Days"
                              labelHidden
                              value={property.turnover}
                              readOnly
                              autoComplete="off"
                            />
                          </Box>
                        </InlineStack>
                      )}

                      {property.collect_balance_at && (
                        <InlineStack gap="300" align="start" blockAlign="center" wrap={false}>
                          <Box minWidth="200px" width="200px" flexShrink={0}>
                            <Text variant="bodyMd" as="span" fontWeight="medium">
                              Collect Balance At
                            </Text>
                          </Box>
                          <Box minWidth="0" width="400px" flexShrink={0}>
                            <TextField
                              label="Collect Balance At"
                              labelHidden
                              value={property.collect_balance_at === 'checkin' ? 'Check-in' : 'Check-out'}
                              readOnly
                              autoComplete="off"
                            />
                          </Box>
                        </InlineStack>
                      )}

                      {property.percentage_at_reservation && (
                        <InlineStack gap="300" align="start" blockAlign="center" wrap={false}>
                          <Box minWidth="200px" width="200px" flexShrink={0}>
                            <Text variant="bodyMd" as="span" fontWeight="medium">
                              % at Reservation
                            </Text>
                          </Box>
                          <Box minWidth="0" width="400px" flexShrink={0}>
                            <TextField
                              label="% at Reservation"
                              labelHidden
                              value={`${property.percentage_at_reservation}%`}
                              readOnly
                              autoComplete="off"
                            />
                          </Box>
                        </InlineStack>
                      )}
                    </BlockStack>
                  </BlockStack>
                </Card>
              )}

              {/* Miscellaneous Info card */}
              {(property.wifi_name || property.rental_license_number || property.external_id) && (
                <Card>
                  <BlockStack gap="400">
                    <Text variant="headingMd" as="h2">
                      Miscellaneous info
                    </Text>

                    <BlockStack gap="300">
                      {property.external_id && (
                        <InlineStack gap="300" align="start" blockAlign="center" wrap={false}>
                          <Box minWidth="200px" width="200px" flexShrink={0}>
                            <Text variant="bodyMd" as="span" fontWeight="medium">
                              External ID
                            </Text>
                          </Box>
                          <Box minWidth="0" width="400px" flexShrink={0}>
                            <TextField
                              label="External ID"
                              labelHidden
                              value={property.external_id}
                              readOnly
                              autoComplete="off"
                            />
                          </Box>
                        </InlineStack>
                      )}

                      {property.accounting && (
                        <InlineStack gap="300" align="start" blockAlign="center" wrap={false}>
                          <Box minWidth="200px" width="200px" flexShrink={0}>
                            <Text variant="bodyMd" as="span" fontWeight="medium">
                              Accounting
                            </Text>
                          </Box>
                          <Box minWidth="0" width="400px" flexShrink={0}>
                            <TextField
                              label="Accounting"
                              labelHidden
                              value={property.accounting}
                              readOnly
                              autoComplete="off"
                            />
                          </Box>
                        </InlineStack>
                      )}

                      {property.rental_license_number && (
                        <InlineStack gap="300" align="start" blockAlign="center" wrap={false}>
                          <Box minWidth="200px" width="200px" flexShrink={0}>
                            <Text variant="bodyMd" as="span" fontWeight="medium">
                              Rental License Number
                            </Text>
                          </Box>
                          <Box minWidth="0" width="400px" flexShrink={0}>
                            <TextField
                              label="Rental License Number"
                              labelHidden
                              value={property.rental_license_number}
                              readOnly
                              autoComplete="off"
                            />
                          </Box>
                        </InlineStack>
                      )}

                      {property.rental_license_expiration_date && (
                        <InlineStack gap="300" align="start" blockAlign="center" wrap={false}>
                          <Box minWidth="200px" width="200px" flexShrink={0}>
                            <Text variant="bodyMd" as="span" fontWeight="medium">
                              License Expiration
                            </Text>
                          </Box>
                          <Box minWidth="0" width="400px" flexShrink={0}>
                            <TextField
                              label="License Expiration"
                              labelHidden
                              value={formatDate(property.rental_license_expiration_date)}
                              readOnly
                              autoComplete="off"
                            />
                          </Box>
                        </InlineStack>
                      )}

                      {property.wifi_name && (
                        <InlineStack gap="300" align="start" blockAlign="center" wrap={false}>
                          <Box minWidth="200px" width="200px" flexShrink={0}>
                            <Text variant="bodyMd" as="span" fontWeight="medium">
                              WiFi Name
                            </Text>
                          </Box>
                          <Box minWidth="0" width="400px" flexShrink={0}>
                            <TextField
                              label="WiFi Name"
                              labelHidden
                              value={property.wifi_name}
                              readOnly
                              autoComplete="off"
                            />
                          </Box>
                        </InlineStack>
                      )}

                      {property.wifi_password && (
                        <InlineStack gap="300" align="start" blockAlign="center" wrap={false}>
                          <Box minWidth="200px" width="200px" flexShrink={0}>
                            <Text variant="bodyMd" as="span" fontWeight="medium">
                              WiFi Password
                            </Text>
                          </Box>
                          <Box minWidth="0" width="400px" flexShrink={0}>
                            <TextField
                              label="WiFi Password"
                              labelHidden
                              value={property.wifi_password}
                              readOnly
                              autoComplete="off"
                            />
                          </Box>
                        </InlineStack>
                      )}
                    </BlockStack>
                  </BlockStack>
                </Card>
              )}

              {/* Description card */}
              {description && (
                <Card>
                  <BlockStack gap="400">
                    <Text variant="headingMd" as="h2">
                      Description
                    </Text>

                    <BlockStack gap="300">
                      {description.public_name && (
                        <InlineStack gap="300" align="start" blockAlign="center" wrap={false}>
                          <Box minWidth="200px" width="200px" flexShrink={0}>
                            <Text variant="bodyMd" as="span" fontWeight="medium">
                              Public Name
                            </Text>
                          </Box>
                          <Box minWidth="0" width="400px" flexShrink={0}>
                            <TextField
                              label="Public Name"
                              labelHidden
                              value={description.public_name}
                              readOnly
                              autoComplete="off"
                            />
                          </Box>
                        </InlineStack>
                      )}

                      {description.short_description && (
                        <InlineStack gap="300" align="start" blockAlign="start" wrap={false}>
                          <Box minWidth="200px" width="200px" flexShrink={0}>
                            <Text variant="bodyMd" as="span" fontWeight="medium">
                              Short Description
                            </Text>
                          </Box>
                          <Box minWidth="0" width="400px" flexShrink={0}>
                            <TextField
                              label="Short Description"
                              labelHidden
                              value={description.short_description}
                              readOnly
                              autoComplete="off"
                              multiline={2}
                            />
                          </Box>
                        </InlineStack>
                      )}

                      {description.long_description && (
                        <InlineStack gap="300" align="start" blockAlign="start" wrap={false}>
                          <Box minWidth="200px" width="200px" flexShrink={0}>
                            <Text variant="bodyMd" as="span" fontWeight="medium">
                              Long Description
                            </Text>
                          </Box>
                          <Box minWidth="0" width="400px" flexShrink={0}>
                            <TextField
                              label="Long Description"
                              labelHidden
                              value={description.long_description}
                              readOnly
                              autoComplete="off"
                              multiline={4}
                            />
                          </Box>
                        </InlineStack>
                      )}

                      {description.neighborhood && (
                        <InlineStack gap="300" align="start" blockAlign="start" wrap={false}>
                          <Box minWidth="200px" width="200px" flexShrink={0}>
                            <Text variant="bodyMd" as="span" fontWeight="medium">
                              Neighborhood
                            </Text>
                          </Box>
                          <Box minWidth="0" width="400px" flexShrink={0}>
                            <TextField
                              label="Neighborhood"
                              labelHidden
                              value={description.neighborhood}
                              readOnly
                              autoComplete="off"
                              multiline={2}
                            />
                          </Box>
                        </InlineStack>
                      )}

                      {description.house_manual && (
                        <InlineStack gap="300" align="start" blockAlign="start" wrap={false}>
                          <Box minWidth="200px" width="200px" flexShrink={0}>
                            <Text variant="bodyMd" as="span" fontWeight="medium">
                              House Manual
                            </Text>
                          </Box>
                          <Box minWidth="0" width="400px" flexShrink={0}>
                            <TextField
                              label="House Manual"
                              labelHidden
                              value={description.house_manual}
                              readOnly
                              autoComplete="off"
                              multiline={3}
                            />
                          </Box>
                        </InlineStack>
                      )}

                      {description.notes && (
                        <InlineStack gap="300" align="start" blockAlign="start" wrap={false}>
                          <Box minWidth="200px" width="200px" flexShrink={0}>
                            <Text variant="bodyMd" as="span" fontWeight="medium">
                              Notes
                            </Text>
                          </Box>
                          <Box minWidth="0" width="400px" flexShrink={0}>
                            <TextField
                              label="Notes"
                              labelHidden
                              value={description.notes}
                              readOnly
                              autoComplete="off"
                              multiline={2}
                            />
                          </Box>
                        </InlineStack>
                      )}
                    </BlockStack>
                  </BlockStack>
                </Card>
              )}

              {/* Photos card - grouped by booking channel type */}
              {photos.length > 0 && (
                <Card>
                  <BlockStack gap="400">
                    <Text variant="headingMd" as="h2">
                      Photos ({photos.length})
                    </Text>

                    {/* Group photos by type */}
                    {(() => {
                      const photoTypeLabels = {
                        airbnb: 'Airbnb',
                        booking_com: 'Booking.com',
                        direct: 'Direct',
                        other_ota: 'Other OTA',
                      };

                      // Group photos by type
                      const groupedPhotos = photos.reduce((acc, photo) => {
                        const type = photo.type || 'airbnb';
                        if (!acc[type]) acc[type] = [];
                        acc[type].push(photo);
                        return acc;
                      }, {});

                      const photoTypes = Object.keys(groupedPhotos);

                      return (
                        <BlockStack gap="400">
                          {photoTypes.map((type) => (
                            <BlockStack key={type} gap="200">
                              <InlineStack gap="200" blockAlign="center">
                                <Text variant="headingSm" as="h3">
                                  {photoTypeLabels[type] || type}
                                </Text>
                                <Badge tone="info">{groupedPhotos[type].length}</Badge>
                              </InlineStack>
                              <InlineStack gap="300" wrap>
                                {groupedPhotos[type].map((photo) => (
                                  <Box key={photo.id} padding="100" background="bg-surface-secondary" borderRadius="200">
                                    <img
                                      src={photo.url}
                                      alt={`${photoTypeLabels[type] || type} photo`}
                                      style={{
                                        width: '150px',
                                        height: '100px',
                                        objectFit: 'cover',
                                        borderRadius: '8px',
                                      }}
                                    />
                                  </Box>
                                ))}
                              </InlineStack>
                            </BlockStack>
                          ))}
                        </BlockStack>
                      );
                    })()}
                  </BlockStack>
                </Card>
              )}

              {/* Amenities card */}
              {amenities.length > 0 && (
                <Card>
                  <BlockStack gap="400">
                    <Text variant="headingMd" as="h2">
                      Amenities ({amenities.length})
                    </Text>
                    <InlineStack gap="200" wrap>
                      {amenities.map((amenity) => (
                        <Badge key={amenity.id} tone="info">
                          {amenity.name}
                        </Badge>
                      ))}
                    </InlineStack>
                  </BlockStack>
                </Card>
              )}

              {/* Pricing card */}
              {pricing && (
                <Card>
                  <BlockStack gap="400">
                    <Text variant="headingMd" as="h2">
                      Pricing & Financials
                    </Text>

                    <BlockStack gap="300">
                      {pricing.property_usage && (
                        <InlineStack gap="300" align="start" blockAlign="center" wrap={false}>
                          <Box minWidth="200px" width="200px" flexShrink={0}>
                            <Text variant="bodyMd" as="span" fontWeight="medium">
                              Property Usage
                            </Text>
                          </Box>
                          <Box minWidth="0" width="400px" flexShrink={0}>
                            <TextField
                              label="Property Usage"
                              labelHidden
                              value={pricing.property_usage === 'sale' ? 'For Sale' :
                                     pricing.property_usage === 'monthly_rent' ? 'For Monthly Rent' :
                                     pricing.property_usage === 'short_term_rent' ? 'For Short Term Rent' :
                                     pricing.property_usage}
                              readOnly
                              autoComplete="off"
                            />
                          </Box>
                        </InlineStack>
                      )}

                      {pricing.currency && (
                        <InlineStack gap="300" align="start" blockAlign="center" wrap={false}>
                          <Box minWidth="200px" width="200px" flexShrink={0}>
                            <Text variant="bodyMd" as="span" fontWeight="medium">
                              Currency
                            </Text>
                          </Box>
                          <Box minWidth="0" width="400px" flexShrink={0}>
                            <TextField
                              label="Currency"
                              labelHidden
                              value={pricing.currency}
                              readOnly
                              autoComplete="off"
                            />
                          </Box>
                        </InlineStack>
                      )}

                      {/* For Sale fields */}
                      {pricing.selling_price && (
                        <InlineStack gap="300" align="start" blockAlign="center" wrap={false}>
                          <Box minWidth="200px" width="200px" flexShrink={0}>
                            <Text variant="bodyMd" as="span" fontWeight="medium">
                              Selling Price
                            </Text>
                          </Box>
                          <Box minWidth="0" width="400px" flexShrink={0}>
                            <TextField
                              label="Selling Price"
                              labelHidden
                              value={`${pricing.currency || ''} ${pricing.selling_price}`}
                              readOnly
                              autoComplete="off"
                            />
                          </Box>
                        </InlineStack>
                      )}

                      {pricing.price_per_sqft && (
                        <InlineStack gap="300" align="start" blockAlign="center" wrap={false}>
                          <Box minWidth="200px" width="200px" flexShrink={0}>
                            <Text variant="bodyMd" as="span" fontWeight="medium">
                              Price Per Sqft
                            </Text>
                          </Box>
                          <Box minWidth="0" width="400px" flexShrink={0}>
                            <TextField
                              label="Price Per Sqft"
                              labelHidden
                              value={`${pricing.currency || ''} ${pricing.price_per_sqft}/sqft`}
                              readOnly
                              autoComplete="off"
                            />
                          </Box>
                        </InlineStack>
                      )}

                      {pricing.service_charges_sale && (
                        <InlineStack gap="300" align="start" blockAlign="center" wrap={false}>
                          <Box minWidth="200px" width="200px" flexShrink={0}>
                            <Text variant="bodyMd" as="span" fontWeight="medium">
                              Service Charges (Sale)
                            </Text>
                          </Box>
                          <Box minWidth="0" width="400px" flexShrink={0}>
                            <TextField
                              label="Service Charges"
                              labelHidden
                              value={`${pricing.currency || ''} ${pricing.service_charges_sale}`}
                              readOnly
                              autoComplete="off"
                            />
                          </Box>
                        </InlineStack>
                      )}

                      {pricing.dld_registration_fee && (
                        <InlineStack gap="300" align="start" blockAlign="center" wrap={false}>
                          <Box minWidth="200px" width="200px" flexShrink={0}>
                            <Text variant="bodyMd" as="span" fontWeight="medium">
                              DLD Registration Fee
                            </Text>
                          </Box>
                          <Box minWidth="0" width="400px" flexShrink={0}>
                            <TextField
                              label="DLD Registration Fee"
                              labelHidden
                              value={`${pricing.currency || ''} ${pricing.dld_registration_fee}`}
                              readOnly
                              autoComplete="off"
                            />
                          </Box>
                        </InlineStack>
                      )}

                      {/* For Rent fields */}
                      {pricing.rental_amount && (
                        <InlineStack gap="300" align="start" blockAlign="center" wrap={false}>
                          <Box minWidth="200px" width="200px" flexShrink={0}>
                            <Text variant="bodyMd" as="span" fontWeight="medium">
                              Rental Amount
                            </Text>
                          </Box>
                          <Box minWidth="0" width="400px" flexShrink={0}>
                            <TextField
                              label="Rental Amount"
                              labelHidden
                              value={`${pricing.currency || ''} ${pricing.rental_amount}`}
                              readOnly
                              autoComplete="off"
                            />
                          </Box>
                        </InlineStack>
                      )}

                      {pricing.nightly_base_price && (
                        <InlineStack gap="300" align="start" blockAlign="center" wrap={false}>
                          <Box minWidth="200px" width="200px" flexShrink={0}>
                            <Text variant="bodyMd" as="span" fontWeight="medium">
                              Nightly Base Price
                            </Text>
                          </Box>
                          <Box minWidth="0" width="400px" flexShrink={0}>
                            <TextField
                              label="Nightly Base Price"
                              labelHidden
                              value={`${pricing.currency || ''} ${pricing.nightly_base_price}`}
                              readOnly
                              autoComplete="off"
                            />
                          </Box>
                        </InlineStack>
                      )}

                      {pricing.security_deposit && (
                        <InlineStack gap="300" align="start" blockAlign="center" wrap={false}>
                          <Box minWidth="200px" width="200px" flexShrink={0}>
                            <Text variant="bodyMd" as="span" fontWeight="medium">
                              Security Deposit
                            </Text>
                          </Box>
                          <Box minWidth="0" width="400px" flexShrink={0}>
                            <TextField
                              label="Security Deposit"
                              labelHidden
                              value={`${pricing.currency || ''} ${pricing.security_deposit}`}
                              readOnly
                              autoComplete="off"
                            />
                          </Box>
                        </InlineStack>
                      )}

                      {pricing.cleaning_fee && (
                        <InlineStack gap="300" align="start" blockAlign="center" wrap={false}>
                          <Box minWidth="200px" width="200px" flexShrink={0}>
                            <Text variant="bodyMd" as="span" fontWeight="medium">
                              Cleaning Fee
                            </Text>
                          </Box>
                          <Box minWidth="0" width="400px" flexShrink={0}>
                            <TextField
                              label="Cleaning Fee"
                              labelHidden
                              value={`${pricing.currency || ''} ${pricing.cleaning_fee}`}
                              readOnly
                              autoComplete="off"
                            />
                          </Box>
                        </InlineStack>
                      )}

                      {pricing.deposit_required && (
                        <InlineStack gap="300" align="start" blockAlign="center" wrap={false}>
                          <Box minWidth="200px" width="200px" flexShrink={0}>
                            <Text variant="bodyMd" as="span" fontWeight="medium">
                              Deposit Required
                            </Text>
                          </Box>
                          <Box minWidth="0" width="400px" flexShrink={0}>
                            <TextField
                              label="Deposit Required"
                              labelHidden
                              value={`${pricing.currency || ''} ${pricing.deposit_required}`}
                              readOnly
                              autoComplete="off"
                            />
                          </Box>
                        </InlineStack>
                      )}

                      {pricing.service_charges_rent && (
                        <InlineStack gap="300" align="start" blockAlign="center" wrap={false}>
                          <Box minWidth="200px" width="200px" flexShrink={0}>
                            <Text variant="bodyMd" as="span" fontWeight="medium">
                              Service Charges (Rent)
                            </Text>
                          </Box>
                          <Box minWidth="0" width="400px" flexShrink={0}>
                            <TextField
                              label="Service Charges (Rent)"
                              labelHidden
                              value={`${pricing.currency || ''} ${pricing.service_charges_rent}`}
                              readOnly
                              autoComplete="off"
                            />
                          </Box>
                        </InlineStack>
                      )}

                      {pricing.currently_rented !== undefined && pricing.currently_rented !== null && (
                        <InlineStack gap="300" align="start" blockAlign="center" wrap={false}>
                          <Box minWidth="200px" width="200px" flexShrink={0}>
                            <Text variant="bodyMd" as="span" fontWeight="medium">
                              Currently Rented
                            </Text>
                          </Box>
                          <Box minWidth="0" width="400px" flexShrink={0}>
                            <Badge tone={pricing.currently_rented ? 'warning' : 'success'}>
                              {pricing.currently_rented ? 'Yes' : 'No'}
                            </Badge>
                          </Box>
                        </InlineStack>
                      )}

                      {/* Commission */}
                      {pricing.commission_structure && (
                        <InlineStack gap="300" align="start" blockAlign="center" wrap={false}>
                          <Box minWidth="200px" width="200px" flexShrink={0}>
                            <Text variant="bodyMd" as="span" fontWeight="medium">
                              Commission Structure
                            </Text>
                          </Box>
                          <Box minWidth="0" width="400px" flexShrink={0}>
                            <TextField
                              label="Commission Structure"
                              labelHidden
                              value={pricing.commission_structure === 'percentage' ? 'Percentage' : 'Fixed Amount'}
                              readOnly
                              autoComplete="off"
                            />
                          </Box>
                        </InlineStack>
                      )}

                      {pricing.commission_amount && (
                        <InlineStack gap="300" align="start" blockAlign="center" wrap={false}>
                          <Box minWidth="200px" width="200px" flexShrink={0}>
                            <Text variant="bodyMd" as="span" fontWeight="medium">
                              Commission Amount
                            </Text>
                          </Box>
                          <Box minWidth="0" width="400px" flexShrink={0}>
                            <TextField
                              label="Commission Amount"
                              labelHidden
                              value={pricing.commission_structure === 'percentage' ? `${pricing.commission_amount}%` : `${pricing.currency || ''} ${pricing.commission_amount}`}
                              readOnly
                              autoComplete="off"
                            />
                          </Box>
                        </InlineStack>
                      )}
                    </BlockStack>
                  </BlockStack>
                </Card>
              )}

              {/* Agreement card */}
              {agreement && (
                <Card>
                  <BlockStack gap="400">
                    <Text variant="headingMd" as="h2">
                      Agreement Details
                    </Text>

                    <BlockStack gap="300">
                      {agreement.type && (
                        <InlineStack gap="300" align="start" blockAlign="center" wrap={false}>
                          <Box minWidth="200px" width="200px" flexShrink={0}>
                            <Text variant="bodyMd" as="span" fontWeight="medium">
                              Agreement Type
                            </Text>
                          </Box>
                          <Box minWidth="0" width="400px" flexShrink={0}>
                            <TextField
                              label="Agreement Type"
                              labelHidden
                              value={agreement.type === 'rented' ? 'Rented' :
                                     agreement.type === 'owned' ? 'Owned' :
                                     agreement.type === 'leased' ? 'Leased' :
                                     agreement.type}
                              readOnly
                              autoComplete="off"
                            />
                          </Box>
                        </InlineStack>
                      )}

                      {agreement.rental_start_date && (
                        <InlineStack gap="300" align="start" blockAlign="center" wrap={false}>
                          <Box minWidth="200px" width="200px" flexShrink={0}>
                            <Text variant="bodyMd" as="span" fontWeight="medium">
                              Rental Start Date
                            </Text>
                          </Box>
                          <Box minWidth="0" width="400px" flexShrink={0}>
                            <TextField
                              label="Rental Start Date"
                              labelHidden
                              value={formatDate(agreement.rental_start_date)}
                              readOnly
                              autoComplete="off"
                            />
                          </Box>
                        </InlineStack>
                      )}

                      {agreement.rental_end_date && (
                        <InlineStack gap="300" align="start" blockAlign="center" wrap={false}>
                          <Box minWidth="200px" width="200px" flexShrink={0}>
                            <Text variant="bodyMd" as="span" fontWeight="medium">
                              Rental End Date
                            </Text>
                          </Box>
                          <Box minWidth="0" width="400px" flexShrink={0}>
                            <TextField
                              label="Rental End Date"
                              labelHidden
                              value={formatDate(agreement.rental_end_date)}
                              readOnly
                              autoComplete="off"
                            />
                          </Box>
                        </InlineStack>
                      )}

                      {agreement.tenancy_agreement_expiration_date && (
                        <InlineStack gap="300" align="start" blockAlign="center" wrap={false}>
                          <Box minWidth="200px" width="200px" flexShrink={0}>
                            <Text variant="bodyMd" as="span" fontWeight="medium">
                              Tenancy Agreement Expiry
                            </Text>
                          </Box>
                          <Box minWidth="0" width="400px" flexShrink={0}>
                            <TextField
                              label="Tenancy Agreement Expiry"
                              labelHidden
                              value={formatDate(agreement.tenancy_agreement_expiration_date)}
                              readOnly
                              autoComplete="off"
                            />
                          </Box>
                        </InlineStack>
                      )}

                      {agreement.ejari_expiration_date && (
                        <InlineStack gap="300" align="start" blockAlign="center" wrap={false}>
                          <Box minWidth="200px" width="200px" flexShrink={0}>
                            <Text variant="bodyMd" as="span" fontWeight="medium">
                              Ejari Expiry
                            </Text>
                          </Box>
                          <Box minWidth="0" width="400px" flexShrink={0}>
                            <TextField
                              label="Ejari Expiry"
                              labelHidden
                              value={formatDate(agreement.ejari_expiration_date)}
                              readOnly
                              autoComplete="off"
                            />
                          </Box>
                        </InlineStack>
                      )}

                      {agreement.dtcm_letter_expiration_date && (
                        <InlineStack gap="300" align="start" blockAlign="center" wrap={false}>
                          <Box minWidth="200px" width="200px" flexShrink={0}>
                            <Text variant="bodyMd" as="span" fontWeight="medium">
                              DTCM Letter Expiry
                            </Text>
                          </Box>
                          <Box minWidth="0" width="400px" flexShrink={0}>
                            <TextField
                              label="DTCM Letter Expiry"
                              labelHidden
                              value={formatDate(agreement.dtcm_letter_expiration_date)}
                              readOnly
                              autoComplete="off"
                            />
                          </Box>
                        </InlineStack>
                      )}

                      {agreement.dewa_number && (
                        <InlineStack gap="300" align="start" blockAlign="center" wrap={false}>
                          <Box minWidth="200px" width="200px" flexShrink={0}>
                            <Text variant="bodyMd" as="span" fontWeight="medium">
                              DEWA Number
                            </Text>
                          </Box>
                          <Box minWidth="0" width="400px" flexShrink={0}>
                            <TextField
                              label="DEWA Number"
                              labelHidden
                              value={agreement.dewa_number}
                              readOnly
                              autoComplete="off"
                            />
                          </Box>
                        </InlineStack>
                      )}

                      {agreement.internet_number && (
                        <InlineStack gap="300" align="start" blockAlign="center" wrap={false}>
                          <Box minWidth="200px" width="200px" flexShrink={0}>
                            <Text variant="bodyMd" as="span" fontWeight="medium">
                              Internet Number
                            </Text>
                          </Box>
                          <Box minWidth="0" width="400px" flexShrink={0}>
                            <TextField
                              label="Internet Number"
                              labelHidden
                              value={agreement.internet_number}
                              readOnly
                              autoComplete="off"
                            />
                          </Box>
                        </InlineStack>
                      )}

                      {agreement.gas_number && (
                        <InlineStack gap="300" align="start" blockAlign="center" wrap={false}>
                          <Box minWidth="200px" width="200px" flexShrink={0}>
                            <Text variant="bodyMd" as="span" fontWeight="medium">
                              Gas Number
                            </Text>
                          </Box>
                          <Box minWidth="0" width="400px" flexShrink={0}>
                            <TextField
                              label="Gas Number"
                              labelHidden
                              value={agreement.gas_number}
                              readOnly
                              autoComplete="off"
                            />
                          </Box>
                        </InlineStack>
                      )}

                      {/* Bill Arrangements */}
                      {agreement.bill_arrangements && (
                        <InlineStack gap="300" align="start" blockAlign="center" wrap={false}>
                          <Box minWidth="200px" width="200px" flexShrink={0}>
                            <Text variant="bodyMd" as="span" fontWeight="medium">
                              Bill Arrangements
                            </Text>
                          </Box>
                          <Box minWidth="0" width="400px" flexShrink={0}>
                            <InlineStack gap="200" wrap>
                              {agreement.bill_arrangements.dewa && <Badge tone="info">DEWA</Badge>}
                              {agreement.bill_arrangements.internet && <Badge tone="info">Internet</Badge>}
                              {agreement.bill_arrangements.gas && <Badge tone="info">Gas</Badge>}
                              {agreement.bill_arrangements.chiller && <Badge tone="info">Chiller</Badge>}
                            </InlineStack>
                          </Box>
                        </InlineStack>
                      )}

                      {/* Document Files */}
                      {agreement.tenancy_agreement && (
                        <InlineStack gap="300" align="start" blockAlign="center" wrap={false}>
                          <Box minWidth="200px" width="200px" flexShrink={0}>
                            <Text variant="bodyMd" as="span" fontWeight="medium">
                              Tenancy Agreement
                            </Text>
                          </Box>
                          <Box minWidth="0" width="400px" flexShrink={0}>
                            <Button url={agreement.tenancy_agreement} external plain>
                              View Document
                            </Button>
                          </Box>
                        </InlineStack>
                      )}

                      {agreement.ejari && (
                        <InlineStack gap="300" align="start" blockAlign="center" wrap={false}>
                          <Box minWidth="200px" width="200px" flexShrink={0}>
                            <Text variant="bodyMd" as="span" fontWeight="medium">
                              Ejari
                            </Text>
                          </Box>
                          <Box minWidth="0" width="400px" flexShrink={0}>
                            <Button url={agreement.ejari} external plain>
                              View Document
                            </Button>
                          </Box>
                        </InlineStack>
                      )}

                      {agreement.dtcm_letter && (
                        <InlineStack gap="300" align="start" blockAlign="center" wrap={false}>
                          <Box minWidth="200px" width="200px" flexShrink={0}>
                            <Text variant="bodyMd" as="span" fontWeight="medium">
                              DTCM Letter
                            </Text>
                          </Box>
                          <Box minWidth="0" width="400px" flexShrink={0}>
                            <Button url={agreement.dtcm_letter} external plain>
                              View Document
                            </Button>
                          </Box>
                        </InlineStack>
                      )}
                    </BlockStack>
                  </BlockStack>
                </Card>
              )}

              {/* Policies card */}
              {policies && policies.length > 0 && (
                <Card>
                  <BlockStack gap="400">
                    <Text variant="headingMd" as="h2">
                      Policies ({policies.length})
                    </Text>
                    <BlockStack gap="300">
                      {policies.map((policy, index) => (
                        <Box key={index} padding="300" background="bg-surface-secondary" borderRadius="200">
                          <BlockStack gap="100">
                            <Text variant="bodyMd" as="span" fontWeight="semibold">
                              {policy.name}
                            </Text>
                            {policy.description && (
                              <Text variant="bodyMd" as="p" tone="subdued">
                                {policy.description}
                              </Text>
                            )}
                          </BlockStack>
                        </Box>
                      ))}
                    </BlockStack>
                  </BlockStack>
                </Card>
              )}

            </BlockStack>
          </Layout.Section>

          {/* Sidebar - Right column */}
          <Layout.Section variant="oneThird">
            <BlockStack gap="400">
              {/* Project card */}
              {project && (
                <Card>
                  <BlockStack gap="200">
                    <Text variant="headingMd" as="h2">
                      Project
                    </Text>
                    <Box paddingBlockStart="200">
                      <Text variant="bodyMd" as="span">
                        {project?.project_name || 'N/A'}
                      </Text>
                    </Box>
                  </BlockStack>
                </Card>
              )}

              {/* Developer card */}
              {developer && (
                <Card>
                  <BlockStack gap="200">
                    <Text variant="headingMd" as="h2">
                      Developer
                    </Text>
                    <Box paddingBlockStart="200">
                      <Text variant="bodyMd" as="span">
                        {developer?.developer_name || 'N/A'}
                      </Text>
                    </Box>
                  </BlockStack>
                </Card>
              )}

              {/* Owner card */}
              {owner && (
                <Card>
                  <BlockStack gap="200">
                    <Text variant="headingMd" as="h2">
                      Owner
                    </Text>
                    <Box paddingBlockStart="200">
                      <Text variant="bodyMd" as="span">
                        {owner?.name || owner?.full_name || `${owner?.first_name || ''} ${owner?.last_name || ''}`.trim() || 'N/A'}
                      </Text>
                    </Box>
                  </BlockStack>
                </Card>
              )}

              {/* Current Status card */}
              {(property.currentStatus || property.status) && (
                <Card>
                  <BlockStack gap="200">
                    <Text variant="headingMd" as="h2">
                      Current status
                    </Text>
                    <Box paddingBlockStart="200">
                      <Badge tone={getStatusTone(property.currentStatus || property.status)}>
                        {getStatusLabel(property.currentStatus || property.status)}
                      </Badge>
                    </Box>
                  </BlockStack>
                </Card>
              )}

              {/* Listing Visibility card */}
              {(property.listing_visibility || property.listingVisibility) && (
                <Card>
                  <BlockStack gap="200">
                    <Text variant="headingMd" as="h2">
                      Listing visibility
                    </Text>
                    <Box paddingBlockStart="200">
                      <Text variant="bodyMd" as="span">
                        {getListingVisibilityLabel(property.listing_visibility || property.listingVisibility)}
                      </Text>
                    </Box>
                  </BlockStack>
                </Card>
              )}
            </BlockStack>
          </Layout.Section>
        </Layout>
      </Page>
    </div>
  );
}

