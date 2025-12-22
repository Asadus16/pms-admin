'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import {
  Page,
  Card,
  TextField,
  Select,
  Button,
  InlineStack,
  BlockStack,
  Box,
  Text,
  Banner,
  DropZone,
  Thumbnail,
  Icon,
  Layout,
  LegacyStack,
} from '@shopify/polaris';
import {
  InventoryIcon,
  ChevronRightIcon,
  DeleteIcon,
  NoteIcon,
} from '@shopify/polaris-icons';
import { useAppDispatch, useAppSelector } from '@/store';
import {
  createPropertyManagerInventory,
  updatePropertyManagerInventory,
  fetchPropertyManagerProperties,
} from '@/store/thunks';
import {
  selectInventoryCreating,
  selectInventoryUpdating,
  selectInventoryError,
  selectInventoryValidationErrors,
  clearError,
} from '@/store/slices/inventorySlice';
import '../AddDeveloper/AddDeveloper.css';

// Inventory type options
const typeOptions = [
  { label: 'Select Type', value: '' },
  { label: 'Furniture', value: 'furniture' },
  { label: 'Electronics', value: 'electronics' },
  { label: 'Appliances', value: 'appliances' },
  { label: 'Kitchen', value: 'kitchen' },
  { label: 'Bathroom', value: 'bathroom' },
  { label: 'Other', value: 'other' },
];

// Condition options
const conditionOptions = [
  { label: 'Select Condition', value: '' },
  { label: 'New', value: 'New' },
  { label: 'Good', value: 'Good' },
  { label: 'Worn', value: 'Worn' },
  { label: 'Damaged', value: 'Damaged' },
];

// Warranty options
const warrantyOptions = [
  { label: 'Select Warranty', value: '' },
  { label: 'Yes', value: 'Yes' },
  { label: 'No', value: 'No' },
];

// Room options
const roomOptions = [
  { label: 'Select Room', value: '' },
  { label: 'Living Room', value: 'Living Room' },
  { label: 'Bedroom', value: 'Bedroom' },
  { label: 'Kitchen', value: 'Kitchen' },
  { label: 'Balcony', value: 'Balcony' },
  { label: 'Bathroom', value: 'Bathroom' },
];

// Static property options (until properties module is complete)
const staticPropertyOptions = [
  { label: 'Select Property', value: '' },
  { label: 'Marina Heights Tower A - Unit 1201', value: '1' },
  { label: 'Palm Jumeirah Villa - Beach Front', value: '2' },
  { label: 'Downtown Dubai - Burj Vista Apt 2304', value: '3' },
  { label: 'JBR - Sadaf Tower Unit 1805', value: '4' },
  { label: 'Business Bay - Executive Tower K', value: '5' },
  { label: 'Dubai Hills - Maple Townhouse', value: '6' },
  { label: 'DIFC - Index Tower Unit 3201', value: '7' },
  { label: 'Al Barsha - Villa 25', value: '8' },
];

// Helper function to safely convert values to strings
const safeString = (value) => {
  if (value === null || value === undefined) return '';
  return String(value);
};

function AddInventory({ mode = 'add', initialInventory = null, onClose }) {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useAppDispatch();

  // Get base path from pathname
  const basePath = pathname.split('/')[1] ? `/${pathname.split('/')[1]}` : '/property-manager';

  // Redux state
  const isCreating = useAppSelector(selectInventoryCreating);
  const isUpdating = useAppSelector(selectInventoryUpdating);
  const error = useAppSelector(selectInventoryError);
  const validationErrors = useAppSelector(selectInventoryValidationErrors);

  // Properties list for dropdown
  const [properties, setProperties] = useState([]);
  const [loadingProperties, setLoadingProperties] = useState(true);

  // Form state
  const [type, setType] = useState('');
  const [name, setName] = useState('');
  const [purchasePrice, setPurchasePrice] = useState('');
  const [propertyId, setPropertyId] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [warranty, setWarranty] = useState('');
  const [condition, setCondition] = useState('');
  const [serialNumber, setSerialNumber] = useState('');
  const [brandModel, setBrandModel] = useState('');
  const [roomName, setRoomName] = useState('');
  const [notes, setNotes] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // Field errors
  const [fieldErrors, setFieldErrors] = useState({});

  // Fetch properties on mount
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const result = await dispatch(fetchPropertyManagerProperties({ per_page: 100 }));
        if (result.payload) {
          const propertiesData = result.payload?.data || result.payload;
          if (Array.isArray(propertiesData)) {
            setProperties(propertiesData);
          }
        }
      } catch (err) {
        console.error('Error fetching properties:', err);
      } finally {
        setLoadingProperties(false);
      }
    };
    fetchProperties();
  }, [dispatch]);

  // Populate form with initial data in edit mode
  useEffect(() => {
    if (mode === 'edit' && initialInventory) {
      setType(safeString(initialInventory.type));
      setName(safeString(initialInventory.name));
      setPurchasePrice(safeString(initialInventory.purchase_price));
      setPropertyId(safeString(initialInventory.property_id));
      setQuantity(safeString(initialInventory.quantity || '1'));
      setWarranty(safeString(initialInventory.warranty));
      setCondition(safeString(initialInventory.condition));
      setSerialNumber(safeString(initialInventory.serial_number));
      setBrandModel(safeString(initialInventory.brand_model));
      setRoomName(safeString(initialInventory.room_name));
      setNotes(safeString(initialInventory.notes));

      // Handle existing image
      if (initialInventory.image) {
        setImagePreview({
          url: initialInventory.image,
          name: initialInventory.image.split('/').pop() || 'Existing image',
          isExisting: true,
        });
      }
    }
  }, [mode, initialInventory]);

  // Handle back navigation
  const handleBack = useCallback(() => {
    if (onClose) {
      onClose();
    } else {
      router.push(`${basePath}/inventory`);
    }
  }, [onClose, router, basePath]);

  // Clear errors on unmount
  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  // Handle image drop
  const handleDropZoneDrop = useCallback((_dropFiles, acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setFieldErrors(prev => ({ ...prev, image: 'Image must not exceed 2MB' }));
        return;
      }
      setImage(file);
      setImagePreview({
        url: URL.createObjectURL(file),
        name: file.name,
        size: `${(file.size / 1024).toFixed(2)} KB`,
        isExisting: false,
      });
      setFieldErrors(prev => ({ ...prev, image: null }));
    }
  }, []);

  // Remove image
  const handleRemoveImage = useCallback(() => {
    setImage(null);
    setImagePreview(null);
  }, []);

  // Validate form
  const validateForm = () => {
    const errors = {};
    if (!propertyId) errors.propertyId = 'Property is required';
    if (!name.trim()) errors.name = 'Name is required';
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission
  const handleSubmit = useCallback(async () => {
    if (!validateForm()) return;

    const formData = new FormData();
    formData.append('property_id', propertyId);
    if (type) formData.append('type', type);
    if (name) formData.append('name', name.trim());
    if (purchasePrice) formData.append('purchase_price', purchasePrice);
    if (quantity) formData.append('quantity', quantity);
    if (warranty) formData.append('warranty', warranty);
    if (condition) formData.append('condition', condition);
    if (serialNumber) formData.append('serial_number', serialNumber.trim());
    if (brandModel) formData.append('brand_model', brandModel.trim());
    if (roomName) formData.append('room_name', roomName);
    if (notes) formData.append('notes', notes.trim());
    if (image) formData.append('image', image);

    try {
      let result;
      if (mode === 'edit' && initialInventory?.id) {
        result = await dispatch(updatePropertyManagerInventory({
          id: initialInventory.id,
          data: formData,
        }));
      } else {
        result = await dispatch(createPropertyManagerInventory(formData));
      }

      if (!result.error) {
        router.push(`${basePath}/inventory`);
      }
    } catch (err) {
      console.error('Error saving inventory:', err);
    }
  }, [dispatch, mode, initialInventory, router, basePath, propertyId, type, name, purchasePrice, quantity, warranty, condition, serialNumber, brandModel, roomName, notes, image]);

  // Set data attribute on body when AddInventory is mounted
  useEffect(() => {
    const attr = mode === 'edit' ? 'data-edit-inventory-open' : 'data-add-inventory-open';
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
      handleSubmit();
    };

    const closeEvent = mode === 'edit' ? 'closeEditInventory' : 'closeAddInventory';
    const saveEvent = mode === 'edit' ? 'saveEditInventory' : 'saveAddInventory';

    window.addEventListener(closeEvent, handleClose);
    window.addEventListener(saveEvent, handleSaveEvent);

    return () => {
      window.removeEventListener(closeEvent, handleClose);
      window.removeEventListener(saveEvent, handleSaveEvent);
    };
  }, [handleBack, handleSubmit, mode]);

  // Property options for dropdown - use fetched properties, fallback to static
  const propertyOptions = properties.length > 0
    ? [
        { label: 'Select Property', value: '' },
        ...properties.map(p => ({
          label: p.name || p.title || `Property ${p.id}`,
          value: String(p.id),
        })),
      ]
    : staticPropertyOptions;

  // Get field error from validation errors
  const getFieldError = (field) => {
    if (!validationErrors) return null;
    const errors = validationErrors[field];
    return errors ? errors[0] : null;
  };

  // File upload content renderer
  const renderFileUpload = (file, onRemove) => {
    if (file) {
      const isExisting = file.isExisting;
      const fileName = file.name || 'File';
      const fileSize = file.size ? file.size : (isExisting ? 'Existing file' : '');

      return (
        <Card>
          <LegacyStack alignment="center">
            {file.url ? (
              <Thumbnail source={file.url} alt={fileName} size="small" />
            ) : (
              <Icon source={NoteIcon} tone="base" />
            )}
            <LegacyStack.Item fill>
              <Text variant="bodyMd" as="p">{fileName}</Text>
              <Text variant="bodySm" as="p" tone="subdued">
                {fileSize}
              </Text>
            </LegacyStack.Item>
            <Button variant="plain" tone="critical" onClick={onRemove}>
              {isExisting ? 'Replace' : 'Remove'}
            </Button>
          </LegacyStack>
        </Card>
      );
    }
    return null;
  };

  const isSubmitting = isCreating || isUpdating;

  return (
    <div className="add-developer-wrapper">
      <Page
        title={
          <InlineStack gap="050" blockAlign="center">
            <Icon source={InventoryIcon} tone="base" />
            <Icon source={ChevronRightIcon} tone="subdued" />
            <span className="new-developer-title">{mode === 'edit' ? 'Edit inventory' : 'Add New Inventory'}</span>
          </InlineStack>
        }
      >
        {/* Error Banner */}
        {error && (
          <Box paddingBlockEnd="400">
            <Banner tone="critical" onDismiss={() => dispatch(clearError())}>
              <p>{error}</p>
            </Banner>
          </Box>
        )}

        {/* Validation Errors Banner */}
        {validationErrors && Object.keys(validationErrors).length > 0 && (
          <Box paddingBlockEnd="400">
            <Banner tone="critical" onDismiss={() => dispatch(clearError())}>
              <BlockStack gap="100">
                {Object.entries(validationErrors).map(([field, messages]) => (
                  <Text key={field} variant="bodyMd" as="p">
                    {Array.isArray(messages) ? messages.join(', ') : messages}
                  </Text>
                ))}
              </BlockStack>
            </Banner>
          </Box>
        )}

        <Layout>
          {/* Main content - Left column */}
          <Layout.Section>
            <BlockStack gap="400">
              {/* Inventory Details card */}
              <Card>
                <BlockStack gap="400">
                  <Text variant="headingMd" as="h2">
                    Inventory Details
                  </Text>

                  {/* Property */}
                  <Select
                    label="Property"
                    options={propertyOptions}
                    value={propertyId}
                    onChange={setPropertyId}
                    error={fieldErrors.propertyId || getFieldError('property_id')}
                    disabled={loadingProperties}
                    requiredIndicator
                  />

                  {/* Name */}
                  <TextField
                    label="Name"
                    value={name}
                    onChange={setName}
                    error={fieldErrors.name || getFieldError('name')}
                    autoComplete="off"
                    placeholder="Enter item name"
                    requiredIndicator
                  />

                  {/* Brand / Model */}
                  <TextField
                    label="Brand / Model"
                    value={brandModel}
                    onChange={setBrandModel}
                    autoComplete="off"
                    placeholder="Enter brand or model"
                    error={getFieldError('brand_model')}
                  />

                  {/* Purchase Price & Quantity */}
                  <InlineStack gap="400" wrap={false}>
                    <Box width="50%">
                      <TextField
                        label="Purchase Price (AED)"
                        value={purchasePrice}
                        onChange={setPurchasePrice}
                        type="number"
                        autoComplete="off"
                        placeholder="0.00"
                        error={getFieldError('purchase_price')}
                      />
                    </Box>
                    <Box width="50%">
                      <TextField
                        label="Quantity"
                        value={quantity}
                        onChange={setQuantity}
                        type="number"
                        min="1"
                        autoComplete="off"
                        error={getFieldError('quantity')}
                      />
                    </Box>
                  </InlineStack>

                  {/* Condition & Warranty */}
                  <InlineStack gap="400" wrap={false}>
                    <Box width="50%">
                      <Select
                        label="Condition"
                        options={conditionOptions}
                        value={condition}
                        onChange={setCondition}
                        error={getFieldError('condition')}
                      />
                    </Box>
                    <Box width="50%">
                      <Select
                        label="Warranty"
                        options={warrantyOptions}
                        value={warranty}
                        onChange={setWarranty}
                        error={getFieldError('warranty')}
                      />
                    </Box>
                  </InlineStack>

                  {/* Serial Number & Room */}
                  <InlineStack gap="400" wrap={false}>
                    <Box width="50%">
                      <TextField
                        label="Serial Number"
                        value={serialNumber}
                        onChange={setSerialNumber}
                        autoComplete="off"
                        placeholder="Enter serial number"
                        error={getFieldError('serial_number')}
                      />
                    </Box>
                    <Box width="50%">
                      <Select
                        label="Room"
                        options={roomOptions}
                        value={roomName}
                        onChange={setRoomName}
                        error={getFieldError('room_name')}
                      />
                    </Box>
                  </InlineStack>
                </BlockStack>
              </Card>

              {/* Image Upload card */}
              <Card>
                <BlockStack gap="400">
                  <Text variant="headingMd" as="h2">
                    Image
                  </Text>

                  {imagePreview ? (
                    renderFileUpload(imagePreview, handleRemoveImage)
                  ) : (
                    <DropZone
                      accept="image/*"
                      type="image"
                      onDrop={handleDropZoneDrop}
                      allowMultiple={false}
                    >
                      <BlockStack gap="200" inlineAlign="center">
                        <InlineStack gap="200" align="center">
                          <Button onClick={() => {}}>Upload image</Button>
                        </InlineStack>
                        <Text variant="bodySm" as="p" tone="subdued">
                          Accepts JPG, PNG. Max 2MB
                        </Text>
                      </BlockStack>
                    </DropZone>
                  )}
                  {fieldErrors.image && (
                    <Text variant="bodySm" tone="critical" as="p">
                      {fieldErrors.image}
                    </Text>
                  )}
                </BlockStack>
              </Card>

              {/* Notes card */}
              <Card>
                <BlockStack gap="400">
                  <Text variant="headingMd" as="h2">
                    Notes
                  </Text>
                  <TextField
                    label="Additional Notes"
                    value={notes}
                    onChange={setNotes}
                    multiline={3}
                    autoComplete="off"
                    labelHidden
                    placeholder="Enter any additional notes about this inventory item..."
                    error={getFieldError('notes')}
                  />
                </BlockStack>
              </Card>
            </BlockStack>
          </Layout.Section>

          {/* Sidebar - Right column */}
          <Layout.Section variant="oneThird">
            <BlockStack gap="400">
              {/* Type card */}
              <Card>
                <BlockStack gap="200">
                  <Text variant="headingMd" as="h2">
                    Type
                  </Text>
                  <Select
                    label="Inventory Type"
                    labelHidden
                    options={typeOptions}
                    value={type}
                    onChange={setType}
                    error={getFieldError('type')}
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

export default AddInventory;
