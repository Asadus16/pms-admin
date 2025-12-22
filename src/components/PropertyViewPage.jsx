'use client';

import { useMemo, useCallback, useState } from 'react';
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
} from '@shopify/polaris';
import { HomeIcon, ChevronRightIcon, ArrowLeftIcon } from '@shopify/polaris-icons';
import { propertiesData } from '../data/properties';
import { projectsData } from '../data/projects';
import { developersData } from '../data/developers';
import './styles/AddDeveloper.css';

function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: '2-digit' });
}

export default function PropertyViewPage({ propertyId }) {
  const router = useRouter();
  const pathname = usePathname();
  const [actionsPopoverActive, setActionsPopoverActive] = useState(false);

  const basePath = useMemo(() => {
    const seg = pathname?.split('/')?.[1];
    return seg ? `/${seg}` : '/property-manager';
  }, [pathname]);

  const property = useMemo(
    () => propertiesData.find((p) => String(p.id) === String(propertyId)),
    [propertyId]
  );

  const project = useMemo(() => {
    if (!property?.project) return null;
    return projectsData.find((p) => String(p.id) === String(property.project)) || 
           projectsData.find((p) => p.projectName === property.project);
  }, [property]);

  const developer = useMemo(() => {
    if (!property?.developer) return null;
    return developersData.find((d) => String(d.id) === String(property.developer)) ||
           developersData.find((d) => d.name === property.developer);
  }, [property]);

  const handleBack = useCallback(() => {
    router.push(`${basePath}/properties`);
  }, [router, basePath]);

  const toggleActionsPopover = useCallback(() => {
    setActionsPopoverActive((active) => !active);
  }, []);

  if (!property) {
    return (
      <Page
        title="Property"
        backAction={{ content: 'Properties', onAction: handleBack }}
      >
        <Card>
          <Box padding="400">
            <BlockStack gap="200">
              <Text variant="headingMd" as="h2">
                Property not found
              </Text>
              <Text variant="bodyMd" as="p" tone="subdued">
                We couldn&apos;t find a property with ID: {propertyId}
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
      case 'available': return 'Available';
      case 'reserved': return 'Reserved';
      case 'sold': return 'Sold';
      case 'rented': return 'Rented';
      case 'under_maintenance': return 'Under Maintenance';
      case 'owner_occupied': return 'Owner Occupied';
      default: return status;
    }
  };

  const getStatusTone = (status) => {
    switch (status) {
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
      office: 'Office',
      shop: 'Shop',
      plot: 'Plot',
    };
    return types[type] || type;
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
                    value={property.propertyId || `PRP-${String(property.id).padStart(4, '0')}`}
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
                          value={project?.projectName || property.project || ''}
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
                          value={developer?.name || property.developer || ''}
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
                          value={property.owner || ''}
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
                          value={getPropertyTypeLabel(property.propertyType)}
                          readOnly
                          autoComplete="off"
                        />
                      </Box>
                    </InlineStack>

                    {property.unitNumber && (
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
                            value={property.unitNumber}
                            readOnly
                            autoComplete="off"
                          />
                        </Box>
                      </InlineStack>
                    )}

                    {property.buildingTowerName && (
                      <InlineStack gap="300" align="start" blockAlign="center" wrap={false}>
                        <Box minWidth="200px" width="200px" flexShrink={0}>
                          <Text variant="bodyMd" as="span" fontWeight="medium">
                            Building / Tower Name
                          </Text>
                        </Box>
                        <Box minWidth="0" width="400px" flexShrink={0}>
                          <TextField
                            label="Building / Tower Name"
                            labelHidden
                            value={property.buildingTowerName}
                            readOnly
                            autoComplete="off"
                          />
                        </Box>
                      </InlineStack>
                    )}

                    {property.floorNumber && (
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
                            value={property.floorNumber}
                            readOnly
                            autoComplete="off"
                          />
                        </Box>
                      </InlineStack>
                    )}

                    {property.areaSize && (
                      <InlineStack gap="300" align="start" blockAlign="center" wrap={false}>
                        <Box minWidth="200px" width="200px" flexShrink={0}>
                          <Text variant="bodyMd" as="span" fontWeight="medium">
                            Area Size (Sqft)
                          </Text>
                        </Box>
                        <Box minWidth="0" width="400px" flexShrink={0}>
                          <TextField
                            label="Area Size (Sqft)"
                            labelHidden
                            value={`${property.areaSize} sqft`}
                            readOnly
                            autoComplete="off"
                          />
                        </Box>
                      </InlineStack>
                    )}

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
                            value={property.bedrooms === '0' ? 'Studio' : property.bedrooms}
                            readOnly
                            autoComplete="off"
                          />
                        </Box>
                      </InlineStack>
                    )}

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

                    {property.maidRoom && (
                      <InlineStack gap="300" align="start" blockAlign="center" wrap={false}>
                        <Box minWidth="200px" width="200px" flexShrink={0}>
                          <Text variant="bodyMd" as="span" fontWeight="medium">
                            Maid Room
                          </Text>
                        </Box>
                        <Box minWidth="0" width="400px" flexShrink={0}>
                          <TextField
                            label="Maid Room"
                            labelHidden
                            value={property.maidRoom === 'yes' ? 'Yes' : 'No'}
                            readOnly
                            autoComplete="off"
                          />
                        </Box>
                      </InlineStack>
                    )}

                    {property.balcony && (
                      <InlineStack gap="300" align="start" blockAlign="center" wrap={false}>
                        <Box minWidth="200px" width="200px" flexShrink={0}>
                          <Text variant="bodyMd" as="span" fontWeight="medium">
                            Balcony
                          </Text>
                        </Box>
                        <Box minWidth="0" width="400px" flexShrink={0}>
                          <TextField
                            label="Balcony"
                            labelHidden
                            value={property.balcony === 'yes' ? 'Yes' : 'No'}
                            readOnly
                            autoComplete="off"
                          />
                        </Box>
                      </InlineStack>
                    )}

                    {property.parkingSpace && (
                      <InlineStack gap="300" align="start" blockAlign="center" wrap={false}>
                        <Box minWidth="200px" width="200px" flexShrink={0}>
                          <Text variant="bodyMd" as="span" fontWeight="medium">
                            Parking Space
                          </Text>
                        </Box>
                        <Box minWidth="0" width="400px" flexShrink={0}>
                          <TextField
                            label="Parking Space"
                            labelHidden
                            value={property.parkingSpace === 'no' ? 'No' : 
                                   property.parkingSpace === 'basement' ? 'Basement' :
                                   property.parkingSpace === 'podium' ? 'Podium' :
                                   property.parkingSpace === 'street' ? 'Street' : property.parkingSpace}
                            readOnly
                            autoComplete="off"
                          />
                        </Box>
                      </InlineStack>
                    )}

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
                            value={property.view.charAt(0).toUpperCase() + property.view.slice(1)}
                            readOnly
                            autoComplete="off"
                          />
                        </Box>
                      </InlineStack>
                    )}

                    {property.furnished && (
                      <InlineStack gap="300" align="start" blockAlign="center" wrap={false}>
                        <Box minWidth="200px" width="200px" flexShrink={0}>
                          <Text variant="bodyMd" as="span" fontWeight="medium">
                            Furnished?
                          </Text>
                        </Box>
                        <Box minWidth="0" width="400px" flexShrink={0}>
                          <TextField
                            label="Furnished"
                            labelHidden
                            value={property.furnished === 'fully_furnished' ? 'Fully Furnished' :
                                   property.furnished === 'unfurnished' ? 'Unfurnished' :
                                   property.furnished === 'semi_furnished' ? 'Semi-Furnished' : property.furnished}
                            readOnly
                            autoComplete="off"
                          />
                        </Box>
                      </InlineStack>
                    )}

                    {property.ceilingHeight && (
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
                            value={`${property.ceilingHeight} ft`}
                            readOnly
                            autoComplete="off"
                          />
                        </Box>
                      </InlineStack>
                    )}

                    {property.smartHomeEnabled && (
                      <InlineStack gap="300" align="start" blockAlign="center" wrap={false}>
                        <Box minWidth="200px" width="200px" flexShrink={0}>
                          <Text variant="bodyMd" as="span" fontWeight="medium">
                            Smart Home Enabled
                          </Text>
                        </Box>
                        <Box minWidth="0" width="400px" flexShrink={0}>
                          <TextField
                            label="Smart Home Enabled"
                            labelHidden
                            value={property.smartHomeEnabled === 'yes' ? 'Yes' : 'No'}
                            readOnly
                            autoComplete="off"
                          />
                        </Box>
                      </InlineStack>
                    )}

                    {property.dateAdded && (
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
                            value={formatDate(property.dateAdded)}
                            readOnly
                            autoComplete="off"
                          />
                        </Box>
                      </InlineStack>
                    )}
                  </BlockStack>
                </BlockStack>
              </Card>

              {/* Property Financials card */}
              {(property.propertyUsage || property.sellingPrice || property.rentalAmount || property.perNight) && (
                <Card>
                  <BlockStack gap="400">
                    <Text variant="headingMd" as="h2">
                      Property financials
                    </Text>

                    <BlockStack gap="300">
                      {property.propertyUsage && (
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
                              value={property.propertyUsage === 'for_sale' ? 'For Sale' :
                                     property.propertyUsage === 'for_monthly_rent' ? 'For Monthly Rent' :
                                     property.propertyUsage === 'for_short_term_rent' ? 'For Short Term Rent' :
                                     property.propertyUsage === 'mixed' ? 'Mixed' : property.propertyUsage}
                              readOnly
                              autoComplete="off"
                            />
                          </Box>
                        </InlineStack>
                      )}

                      {/* For Sale fields */}
                      {(property.propertyUsage === 'for_sale' || property.propertyUsage === 'mixed') && (
                        <>
                          {property.sellingPrice && (
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
                                  value={`$${property.sellingPrice}`}
                                  readOnly
                                  autoComplete="off"
                                />
                              </Box>
                            </InlineStack>
                          )}
                          {property.pricePerSqft && (
                            <InlineStack gap="300" align="start" blockAlign="center" wrap={false}>
                              <Box minWidth="200px" width="200px" flexShrink={0}>
                                <Text variant="bodyMd" as="span" fontWeight="medium">
                                  Price Per Sqft / Sqm
                                </Text>
                              </Box>
                              <Box minWidth="0" width="400px" flexShrink={0}>
                                <TextField
                                  label="Price Per Sqft / Sqm"
                                  labelHidden
                                  value={`$${property.pricePerSqft}/sqft`}
                                  readOnly
                                  autoComplete="off"
                                />
                              </Box>
                            </InlineStack>
                          )}
                          {property.serviceChargesSale && (
                            <InlineStack gap="300" align="start" blockAlign="center" wrap={false}>
                              <Box minWidth="200px" width="200px" flexShrink={0}>
                                <Text variant="bodyMd" as="span" fontWeight="medium">
                                  Service Charges
                                </Text>
                              </Box>
                              <Box minWidth="0" width="400px" flexShrink={0}>
                                <TextField
                                  label="Service Charges"
                                  labelHidden
                                  value={`$${property.serviceChargesSale}`}
                                  readOnly
                                  autoComplete="off"
                                />
                              </Box>
                            </InlineStack>
                          )}
                          {property.dldRegistrationFee && (
                            <InlineStack gap="300" align="start" blockAlign="center" wrap={false}>
                              <Box minWidth="200px" width="200px" flexShrink={0}>
                                <Text variant="bodyMd" as="span" fontWeight="medium">
                                  DLD/Registration Fee
                                </Text>
                              </Box>
                              <Box minWidth="0" width="400px" flexShrink={0}>
                                <TextField
                                  label="DLD/Registration Fee"
                                  labelHidden
                                  value={`$${property.dldRegistrationFee}`}
                                  readOnly
                                  autoComplete="off"
                                />
                              </Box>
                            </InlineStack>
                          )}
                        </>
                      )}

                      {/* For Monthly Rent fields */}
                      {(property.propertyUsage === 'for_monthly_rent' || property.propertyUsage === 'mixed') && (
                        <>
                          {property.rentalAmount && (
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
                                  value={`$${property.rentalAmount}`}
                                  readOnly
                                  autoComplete="off"
                                />
                              </Box>
                            </InlineStack>
                          )}
                          {property.currentlyRented && (
                            <InlineStack gap="300" align="start" blockAlign="center" wrap={false}>
                              <Box minWidth="200px" width="200px" flexShrink={0}>
                                <Text variant="bodyMd" as="span" fontWeight="medium">
                                  Currently Rented?
                                </Text>
                              </Box>
                              <Box minWidth="0" width="400px" flexShrink={0}>
                                <TextField
                                  label="Currently Rented?"
                                  labelHidden
                                  value={property.currentlyRented === 'yes' ? 'Yes' : 'No'}
                                  readOnly
                                  autoComplete="off"
                                />
                              </Box>
                            </InlineStack>
                          )}
                          {property.depositRequired && (
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
                                  value={`$${property.depositRequired}`}
                                  readOnly
                                  autoComplete="off"
                                />
                              </Box>
                            </InlineStack>
                          )}
                          {property.serviceChargesRent && (
                            <InlineStack gap="300" align="start" blockAlign="center" wrap={false}>
                              <Box minWidth="200px" width="200px" flexShrink={0}>
                                <Text variant="bodyMd" as="span" fontWeight="medium">
                                  Service Charges
                                </Text>
                              </Box>
                              <Box minWidth="0" width="400px" flexShrink={0}>
                                <TextField
                                  label="Service Charges"
                                  labelHidden
                                  value={`$${property.serviceChargesRent}`}
                                  readOnly
                                  autoComplete="off"
                                />
                              </Box>
                            </InlineStack>
                          )}
                        </>
                      )}

                      {/* For Short Term Rent fields */}
                      {property.propertyUsage === 'for_short_term_rent' && (
                        <>
                          {property.perNight && (
                            <InlineStack gap="300" align="start" blockAlign="center" wrap={false}>
                              <Box minWidth="200px" width="200px" flexShrink={0}>
                                <Text variant="bodyMd" as="span" fontWeight="medium">
                                  Per Night
                                </Text>
                              </Box>
                              <Box minWidth="0" width="400px" flexShrink={0}>
                                <TextField
                                  label="Per Night"
                                  labelHidden
                                  value={`$${property.perNight}`}
                                  readOnly
                                  autoComplete="off"
                                />
                              </Box>
                            </InlineStack>
                          )}
                        </>
                      )}

                      {/* Commission Structure - Always visible if exists */}
                      {property.commissionStructure && (
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
                              value={property.commissionStructure === 'percentage' ? 'Percentage' : 'Fixed Amount'}
                              readOnly
                              autoComplete="off"
                            />
                          </Box>
                        </InlineStack>
                      )}

                      {property.commissionAmount && (
                        <InlineStack gap="300" align="start" blockAlign="center" wrap={false}>
                          <Box minWidth="200px" width="200px" flexShrink={0}>
                            <Text variant="bodyMd" as="span" fontWeight="medium">
                              {property.commissionStructure === 'percentage' ? 'Commission Percentage' : 'Commission Amount'}
                            </Text>
                          </Box>
                          <Box minWidth="0" width="400px" flexShrink={0}>
                            <TextField
                              label={property.commissionStructure === 'percentage' ? 'Commission Percentage' : 'Commission Amount'}
                              labelHidden
                              value={property.commissionStructure === 'percentage' ? `${property.commissionAmount}%` : `$${property.commissionAmount}`}
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

            </BlockStack>
          </Layout.Section>

          {/* Sidebar - Right column */}
          <Layout.Section variant="oneThird">
            <BlockStack gap="400">
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
              {property.listingVisibility && (
                <Card>
                  <BlockStack gap="200">
                    <Text variant="headingMd" as="h2">
                      Listing visibility
                    </Text>
                    <Box paddingBlockStart="200">
                      <Text variant="bodyMd" as="span">
                        {getListingVisibilityLabel(property.listingVisibility)}
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

