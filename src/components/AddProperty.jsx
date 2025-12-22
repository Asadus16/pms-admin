'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Page,
  Card,
  Text,
  TextField,
  Select,
  Button,
  InlineStack,
  BlockStack,
  Box,
  Icon,
  Layout,
  Checkbox,
} from '@shopify/polaris';
import {
  HomeIcon,
  ChevronRightIcon,
} from '@shopify/polaris-icons';
import { developersData } from '../data/developers';
import { projectsData } from '../data/projects';
import './styles/AddDeveloper.css';

// Generate a unique property ID
const generatePropertyId = () => {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `PRP-${timestamp}-${random}`;
};

function AddProperty({ onClose, mode = 'create', initialProperty = null }) {
  const router = useRouter();

  // Generate property ID on mount (or use existing for edit)
  const [propertyId] = useState(() => initialProperty?.propertyId || generatePropertyId());

  // Property Details state
  const [selectedProject, setSelectedProject] = useState('');
  const [selectedDeveloper, setSelectedDeveloper] = useState('');
  const [selectedOwner, setSelectedOwner] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [unitNumber, setUnitNumber] = useState('');
  const [buildingTowerName, setBuildingTowerName] = useState('');
  const [floorNumber, setFloorNumber] = useState('');
  const [areaSize, setAreaSize] = useState('');
  const [bedrooms, setBedrooms] = useState('');
  const [bathrooms, setBathrooms] = useState('');
  const [maidRoom, setMaidRoom] = useState('');
  const [balcony, setBalcony] = useState('');
  const [parkingSpace, setParkingSpace] = useState('');
  const [view, setView] = useState('');
  const [furnished, setFurnished] = useState('');
  const [ceilingHeight, setCeilingHeight] = useState('');
  const [smartHomeEnabled, setSmartHomeEnabled] = useState('');

  // Property Financials state
  const [propertyUsage, setPropertyUsage] = useState('');
  const [commissionStructure, setCommissionStructure] = useState('');
  const [commissionAmount, setCommissionAmount] = useState('');
  
  // For Sale fields
  const [sellingPrice, setSellingPrice] = useState('');
  const [pricePerSqft, setPricePerSqft] = useState('');
  const [serviceChargesSale, setServiceChargesSale] = useState('');
  const [dldRegistrationFee, setDldRegistrationFee] = useState('');
  
  // For Monthly Rent fields
  const [rentalAmount, setRentalAmount] = useState('');
  const [currentlyRented, setCurrentlyRented] = useState('');
  const [depositRequired, setDepositRequired] = useState('');
  const [serviceChargesRent, setServiceChargesRent] = useState('');
  
  // For Short Term Rent fields
  const [perNight, setPerNight] = useState('');

  // Current Status
  const [currentStatus, setCurrentStatus] = useState('available');

  // Listing Visibility
  const [listingVisibility, setListingVisibility] = useState('internal_only');

  // Populate form when editing
  useEffect(() => {
    if (mode !== 'edit' || !initialProperty) return;
    // Populate all fields from initialProperty
  }, [mode, initialProperty]);

  const handleBack = useCallback(() => {
    if (onClose) {
      onClose();
    } else {
      router.push('/property-manager/properties');
    }
  }, [onClose, router]);

  // Project options from projectsData
  const projectOptions = [
    { label: 'Select project', value: '' },
    ...projectsData.map(proj => ({
      label: proj.projectName,
      value: proj.id,
    })),
  ];

  // Developer options from developersData
  const developerOptions = [
    { label: 'Select developer', value: '' },
    ...developersData.map(dev => ({
      label: dev.name,
      value: dev.id,
    })),
  ];

  // Owner options (mock data - in real app this would come from owners data)
  const ownerOptions = [
    { label: 'Select owner', value: '' },
    { label: 'Ahmed Al Maktoum', value: 'owner1' },
    { label: 'Sarah Johnson', value: 'owner2' },
    { label: 'Mohammed Hassan', value: 'owner3' },
    { label: 'ABC Corporation', value: 'owner4' },
    { label: 'Emma Wilson', value: 'owner5' },
  ];

  // Property Type options
  const propertyTypeOptions = [
    { label: 'Select property type', value: '' },
    { label: 'Apartment', value: 'apartment' },
    { label: 'Villa', value: 'villa' },
    { label: 'Townhouse', value: 'townhouse' },
    { label: 'Penthouse', value: 'penthouse' },
    { label: 'Office', value: 'office' },
    { label: 'Shop', value: 'shop' },
    { label: 'Plot', value: 'plot' },
  ];

  // Bedrooms options
  const bedroomsOptions = [
    { label: 'Select bedrooms', value: '' },
    { label: 'Studio', value: '0' },
    { label: '1', value: '1' },
    { label: '2', value: '2' },
    { label: '3', value: '3' },
    { label: '4', value: '4' },
    { label: '5', value: '5' },
    { label: '6+', value: '6+' },
  ];

  // Bathrooms options
  const bathroomsOptions = [
    { label: 'Select bathrooms', value: '' },
    { label: '1', value: '1' },
    { label: '2', value: '2' },
    { label: '3', value: '3' },
    { label: '4', value: '4' },
    { label: '5+', value: '5+' },
  ];

  // Yes/No options
  const yesNoOptions = [
    { label: 'Select', value: '' },
    { label: 'Yes', value: 'yes' },
    { label: 'No', value: 'no' },
  ];

  // Parking Space options
  const parkingSpaceOptions = [
    { label: 'Select parking space', value: '' },
    { label: 'No', value: 'no' },
    { label: 'Basement', value: 'basement' },
    { label: 'Podium', value: 'podium' },
    { label: 'Street', value: 'street' },
  ];

  // View options
  const viewOptions = [
    { label: 'Select view', value: '' },
    { label: 'Community', value: 'community' },
    { label: 'Park', value: 'park' },
    { label: 'Sea', value: 'sea' },
    { label: 'Marina', value: 'marina' },
    { label: 'City', value: 'city' },
    { label: 'Burj', value: 'burj' },
  ];

  // Furnished options
  const furnishedOptions = [
    { label: 'Select furnished status', value: '' },
    { label: 'Fully Furnished', value: 'fully_furnished' },
    { label: 'Unfurnished', value: 'unfurnished' },
    { label: 'Semi-Furnished', value: 'semi_furnished' },
  ];

  // Property Usage options
  const propertyUsageOptions = [
    { label: 'Select property usage', value: '' },
    { label: 'For Sale', value: 'for_sale' },
    { label: 'For Monthly Rent', value: 'for_monthly_rent' },
    { label: 'For Short Term Rent', value: 'for_short_term_rent' },
  ];

  // Currently Rented options
  const currentlyRentedOptions = [
    { label: 'Select', value: '' },
    { label: 'Yes', value: 'yes' },
    { label: 'No', value: 'no' },
  ];

  // Commission Structure options
  const commissionStructureOptions = [
    { label: 'Select commission structure', value: '' },
    { label: 'Percentage', value: 'percentage' },
    { label: 'Fixed Amount', value: 'fixed_amount' },
  ];

  // Current Status options
  const currentStatusOptions = [
    { label: 'Available', value: 'available' },
    { label: 'Reserved', value: 'reserved' },
    { label: 'Sold', value: 'sold' },
    { label: 'Rented', value: 'rented' },
    { label: 'Under Maintenance', value: 'under_maintenance' },
    { label: 'Owner Occupied', value: 'owner_occupied' },
  ];

  // Listing Visibility options
  const listingVisibilityOptions = [
    { label: 'Internal Only', value: 'internal_only' },
    { label: 'Shared with Partners', value: 'shared_with_partners' },
    { label: 'Public', value: 'public' },
  ];

  // Save handler
  const handleSave = useCallback(() => {
    console.log('Saving property:', {
      propertyId,
      selectedProject,
      selectedDeveloper,
      selectedOwner,
      propertyType,
      unitNumber,
      buildingTowerName,
      floorNumber,
      areaSize,
      bedrooms,
      bathrooms,
      maidRoom,
      balcony,
      parkingSpace,
      view,
      furnished,
      ceilingHeight,
      smartHomeEnabled,
      propertyUsage,
      sellingPrice,
      pricePerSqft,
      serviceChargesSale,
      dldRegistrationFee,
      rentalAmount,
      currentlyRented,
      depositRequired,
      serviceChargesRent,
      perNight,
      commissionStructure,
      commissionAmount,
      currentStatus,
      listingVisibility,
    });
  }, [
    propertyId, selectedProject, selectedDeveloper, selectedOwner, propertyType,
    unitNumber, buildingTowerName, floorNumber, areaSize, bedrooms, bathrooms,
    maidRoom, balcony, parkingSpace, view, furnished, ceilingHeight, smartHomeEnabled,
    propertyUsage, sellingPrice, pricePerSqft, serviceChargesSale, dldRegistrationFee,
    rentalAmount, currentlyRented, depositRequired, serviceChargesRent,
    perNight, commissionStructure, commissionAmount, currentStatus, listingVisibility,
  ]);

  // Set data attribute on body when AddProperty is mounted
  useEffect(() => {
    const attr = mode === 'edit' ? 'data-edit-property-open' : 'data-add-property-open';
    document.body.setAttribute(attr, 'true');
    return () => {
      document.body.removeAttribute(attr);
    };
  }, [mode]);

  // Listen for custom events from header
  useEffect(() => {
    const handleClose = () => {
      handleBack();
    };

    const handleSaveEvent = () => {
      handleSave();
    };

    const closeEvent = mode === 'edit' ? 'closeEditProperty' : 'closeAddProperty';
    const saveEvent = mode === 'edit' ? 'saveEditProperty' : 'saveAddProperty';

    window.addEventListener(closeEvent, handleClose);
    window.addEventListener(saveEvent, handleSaveEvent);

    return () => {
      window.removeEventListener(closeEvent, handleClose);
      window.removeEventListener(saveEvent, handleSaveEvent);
    };
  }, [handleBack, handleSave, mode]);

  return (
    <div className="add-developer-wrapper">
      <Page
        title={
          <InlineStack gap="050" blockAlign="center">
            <Icon source={HomeIcon} tone="base" />
            <Icon source={ChevronRightIcon} tone="subdued" />
            <span className="new-developer-title">{mode === 'edit' ? 'Edit property' : 'New property'}</span>
          </InlineStack>
        }
      >
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

                  {/* Property ID - System generated */}
                  <TextField
                    label="Property ID"
                    value={propertyId}
                    disabled
                    helpText="System generated ID"
                    autoComplete="off"
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
                        <Select
                          label="Project"
                          labelHidden
                          options={projectOptions}
                          value={selectedProject}
                          onChange={setSelectedProject}
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
                        <Select
                          label="Developer"
                          labelHidden
                          options={developerOptions}
                          value={selectedDeveloper}
                          onChange={setSelectedDeveloper}
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
                        <Select
                          label="Owner"
                          labelHidden
                          options={ownerOptions}
                          value={selectedOwner}
                          onChange={setSelectedOwner}
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
                        <Select
                          label="Property Type"
                          labelHidden
                          options={propertyTypeOptions}
                          value={propertyType}
                          onChange={setPropertyType}
                        />
                      </Box>
                    </InlineStack>

                    {/* Unit Number */}
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
                          type="number"
                          value={unitNumber}
                          onChange={setUnitNumber}
                          autoComplete="off"
                          placeholder="Enter unit number"
                        />
                      </Box>
                    </InlineStack>

                    {/* Building / Tower Name */}
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
                          value={buildingTowerName}
                          onChange={setBuildingTowerName}
                          autoComplete="off"
                          placeholder="Enter building or tower name"
                        />
                      </Box>
                    </InlineStack>

                    {/* Floor Number */}
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
                          type="number"
                          value={floorNumber}
                          onChange={setFloorNumber}
                          autoComplete="off"
                          placeholder="Enter floor number"
                        />
                      </Box>
                    </InlineStack>

                    {/* Area Size */}
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
                          type="number"
                          value={areaSize}
                          onChange={setAreaSize}
                          autoComplete="off"
                          placeholder="Enter area size"
                          suffix="sqft"
                        />
                      </Box>
                    </InlineStack>

                    {/* Bedrooms */}
                    <InlineStack gap="300" align="start" blockAlign="center" wrap={false}>
                      <Box minWidth="200px" width="200px" flexShrink={0}>
                        <Text variant="bodyMd" as="span" fontWeight="medium">
                          Bedrooms
                        </Text>
                      </Box>
                      <Box minWidth="0" width="400px" flexShrink={0}>
                        <Select
                          label="Bedrooms"
                          labelHidden
                          options={bedroomsOptions}
                          value={bedrooms}
                          onChange={setBedrooms}
                        />
                      </Box>
                    </InlineStack>

                    {/* Bathrooms */}
                    <InlineStack gap="300" align="start" blockAlign="center" wrap={false}>
                      <Box minWidth="200px" width="200px" flexShrink={0}>
                        <Text variant="bodyMd" as="span" fontWeight="medium">
                          Bathrooms
                        </Text>
                      </Box>
                      <Box minWidth="0" width="400px" flexShrink={0}>
                        <Select
                          label="Bathrooms"
                          labelHidden
                          options={bathroomsOptions}
                          value={bathrooms}
                          onChange={setBathrooms}
                        />
                      </Box>
                    </InlineStack>

                    {/* Maid Room */}
                    <InlineStack gap="300" align="start" blockAlign="center" wrap={false}>
                      <Box minWidth="200px" width="200px" flexShrink={0}>
                        <Text variant="bodyMd" as="span" fontWeight="medium">
                          Maid Room
                        </Text>
                      </Box>
                      <Box minWidth="0" width="400px" flexShrink={0}>
                        <Select
                          label="Maid Room"
                          labelHidden
                          options={yesNoOptions}
                          value={maidRoom}
                          onChange={setMaidRoom}
                        />
                      </Box>
                    </InlineStack>

                    {/* Balcony */}
                    <InlineStack gap="300" align="start" blockAlign="center" wrap={false}>
                      <Box minWidth="200px" width="200px" flexShrink={0}>
                        <Text variant="bodyMd" as="span" fontWeight="medium">
                          Balcony
                        </Text>
                      </Box>
                      <Box minWidth="0" width="400px" flexShrink={0}>
                        <Select
                          label="Balcony"
                          labelHidden
                          options={yesNoOptions}
                          value={balcony}
                          onChange={setBalcony}
                        />
                      </Box>
                    </InlineStack>

                    {/* Parking Space */}
                    <InlineStack gap="300" align="start" blockAlign="center" wrap={false}>
                      <Box minWidth="200px" width="200px" flexShrink={0}>
                        <Text variant="bodyMd" as="span" fontWeight="medium">
                          Parking Space
                        </Text>
                      </Box>
                      <Box minWidth="0" width="400px" flexShrink={0}>
                        <Select
                          label="Parking Space"
                          labelHidden
                          options={parkingSpaceOptions}
                          value={parkingSpace}
                          onChange={setParkingSpace}
                        />
                      </Box>
                    </InlineStack>

                    {/* View */}
                    <InlineStack gap="300" align="start" blockAlign="center" wrap={false}>
                      <Box minWidth="200px" width="200px" flexShrink={0}>
                        <Text variant="bodyMd" as="span" fontWeight="medium">
                          View
                        </Text>
                      </Box>
                      <Box minWidth="0" width="400px" flexShrink={0}>
                        <Select
                          label="View"
                          labelHidden
                          options={viewOptions}
                          value={view}
                          onChange={setView}
                        />
                      </Box>
                    </InlineStack>

                    {/* Furnished */}
                    <InlineStack gap="300" align="start" blockAlign="center" wrap={false}>
                      <Box minWidth="200px" width="200px" flexShrink={0}>
                        <Text variant="bodyMd" as="span" fontWeight="medium">
                          Furnished?
                        </Text>
                      </Box>
                      <Box minWidth="0" width="400px" flexShrink={0}>
                        <Select
                          label="Furnished?"
                          labelHidden
                          options={furnishedOptions}
                          value={furnished}
                          onChange={setFurnished}
                        />
                      </Box>
                    </InlineStack>

                    {/* Ceiling Height */}
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
                          type="number"
                          value={ceilingHeight}
                          onChange={setCeilingHeight}
                          autoComplete="off"
                          placeholder="Enter ceiling height"
                          suffix="ft"
                        />
                      </Box>
                    </InlineStack>

                    {/* Smart Home Enabled */}
                    <InlineStack gap="300" align="start" blockAlign="center" wrap={false}>
                      <Box minWidth="200px" width="200px" flexShrink={0}>
                        <Text variant="bodyMd" as="span" fontWeight="medium">
                          Smart Home Enabled
                        </Text>
                      </Box>
                      <Box minWidth="0" width="400px" flexShrink={0}>
                        <Select
                          label="Smart Home Enabled"
                          labelHidden
                          options={yesNoOptions}
                          value={smartHomeEnabled}
                          onChange={setSmartHomeEnabled}
                        />
                      </Box>
                    </InlineStack>
                  </BlockStack>
                </BlockStack>
              </Card>

              {/* Property Financials card */}
              <Card>
                <BlockStack gap="400">
                  <Text variant="headingMd" as="h2">
                    Property financials
                  </Text>

                  <BlockStack gap="300">
                    {/* Property Usage */}
                    <InlineStack gap="300" align="start" blockAlign="center" wrap={false}>
                      <Box minWidth="200px" width="200px" flexShrink={0}>
                        <Text variant="bodyMd" as="span" fontWeight="medium">
                          Property Usage
                        </Text>
                      </Box>
                      <Box minWidth="0" width="400px" flexShrink={0}>
                        <Select
                          label="Property Usage"
                          labelHidden
                          options={propertyUsageOptions}
                          value={propertyUsage}
                          onChange={setPropertyUsage}
                        />
                      </Box>
                    </InlineStack>

                    {/* Commission Structure - Always visible */}
                    <InlineStack gap="300" align="start" blockAlign="center" wrap={false}>
                      <Box minWidth="200px" width="200px" flexShrink={0}>
                        <Text variant="bodyMd" as="span" fontWeight="medium">
                          Commission Structure
                        </Text>
                      </Box>
                      <Box minWidth="0" width="400px" flexShrink={0}>
                        <Select
                          label="Commission Structure"
                          labelHidden
                          options={commissionStructureOptions}
                          value={commissionStructure}
                          onChange={setCommissionStructure}
                        />
                      </Box>
                    </InlineStack>

                    {commissionStructure && (
                      <InlineStack gap="300" align="start" blockAlign="center" wrap={false}>
                        <Box minWidth="200px" width="200px" flexShrink={0}>
                          <Text variant="bodyMd" as="span" fontWeight="medium">
                            {commissionStructure === 'percentage' ? 'Commission Percentage' : 'Commission Amount'}
                          </Text>
                        </Box>
                        <Box minWidth="0" width="400px" flexShrink={0}>
                          <TextField
                            label={commissionStructure === 'percentage' ? 'Commission Percentage' : 'Commission Amount'}
                            labelHidden
                            type="number"
                            value={commissionAmount}
                            onChange={setCommissionAmount}
                            autoComplete="off"
                            placeholder={commissionStructure === 'percentage' ? 'Enter percentage' : 'Enter amount'}
                            suffix={commissionStructure === 'percentage' ? '%' : '$'}
                          />
                        </Box>
                      </InlineStack>
                    )}

                    {/* Conditional fields based on Property Usage */}
                    {propertyUsage === 'for_sale' && (
                      <>
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
                              type="number"
                              value={sellingPrice}
                              onChange={setSellingPrice}
                              autoComplete="off"
                              placeholder="Enter selling price"
                              prefix="$"
                            />
                          </Box>
                        </InlineStack>
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
                              type="number"
                              value={pricePerSqft}
                              onChange={setPricePerSqft}
                              autoComplete="off"
                              placeholder="Enter price per sqft"
                              prefix="$"
                              suffix="/sqft"
                            />
                          </Box>
                        </InlineStack>
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
                              type="number"
                              value={serviceChargesSale}
                              onChange={setServiceChargesSale}
                              autoComplete="off"
                              placeholder="Enter service charges"
                              prefix="$"
                            />
                          </Box>
                        </InlineStack>
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
                              type="number"
                              value={dldRegistrationFee}
                              onChange={setDldRegistrationFee}
                              autoComplete="off"
                              placeholder="Enter DLD/Registration fee"
                              prefix="$"
                            />
                          </Box>
                        </InlineStack>
                      </>
                    )}

                    {propertyUsage === 'for_monthly_rent' && (
                      <>
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
                              type="number"
                              value={rentalAmount}
                              onChange={setRentalAmount}
                              autoComplete="off"
                              placeholder="Enter rental amount"
                              prefix="$"
                            />
                          </Box>
                        </InlineStack>
                        <InlineStack gap="300" align="start" blockAlign="center" wrap={false}>
                          <Box minWidth="200px" width="200px" flexShrink={0}>
                            <Text variant="bodyMd" as="span" fontWeight="medium">
                              Currently Rented?
                            </Text>
                          </Box>
                          <Box minWidth="0" width="400px" flexShrink={0}>
                            <Select
                              label="Currently Rented?"
                              labelHidden
                              options={currentlyRentedOptions}
                              value={currentlyRented}
                              onChange={setCurrentlyRented}
                            />
                          </Box>
                        </InlineStack>
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
                              type="number"
                              value={depositRequired}
                              onChange={setDepositRequired}
                              autoComplete="off"
                              placeholder="Enter deposit amount or %"
                              prefix="$"
                            />
                          </Box>
                        </InlineStack>
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
                              type="number"
                              value={serviceChargesRent}
                              onChange={setServiceChargesRent}
                              autoComplete="off"
                              placeholder="Enter service charges"
                              prefix="$"
                            />
                          </Box>
                        </InlineStack>
                      </>
                    )}

                    {propertyUsage === 'for_short_term_rent' && (
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
                            type="number"
                            value={perNight}
                            onChange={setPerNight}
                            autoComplete="off"
                            placeholder="Enter price per night"
                            prefix="$"
                          />
                        </Box>
                      </InlineStack>
                    )}
                  </BlockStack>
                </BlockStack>
              </Card>

            </BlockStack>
          </Layout.Section>

          {/* Sidebar - Right column */}
          <Layout.Section variant="oneThird">
            <BlockStack gap="400">
              {/* Current Status card */}
              <Card>
                <BlockStack gap="200">
                  <Text variant="headingMd" as="h2">
                    Current status
                  </Text>
                  <Select
                    label="Current Status"
                    labelHidden
                    options={currentStatusOptions}
                    value={currentStatus}
                    onChange={setCurrentStatus}
                  />
                </BlockStack>
              </Card>

              {/* Listing Visibility card */}
              <Card>
                <BlockStack gap="200">
                  <Text variant="headingMd" as="h2">
                    Listing visibility
                  </Text>
                  <Select
                    label="Listing Visibility"
                    labelHidden
                    options={listingVisibilityOptions}
                    value={listingVisibility}
                    onChange={setListingVisibility}
                  />
                </BlockStack>
              </Card>
            </BlockStack>
          </Layout.Section>
        </Layout>
      </Page>
    </div>
  );
}

export default AddProperty;

