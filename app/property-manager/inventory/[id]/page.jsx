'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import { fetchPropertyManagerInventoryById, deletePropertyManagerInventory } from '@/store/thunks';
import {
  selectCurrentInventory,
  selectInventoryLoading,
  selectInventoryDeleting,
} from '@/store/slices/property-manager/inventory/slice';
import {
  Page,
  Card,
  BlockStack,
  InlineStack,
  Text,
  Box,
  Spinner,
  TextField,
  Layout,
  Icon,
  Popover,
  ActionList,
  Modal,
  Button,
} from '@shopify/polaris';
import { InventoryIcon, ChevronRightIcon } from '@shopify/polaris-icons';
import '@/components/AddDeveloper/AddDeveloper.css';

// Type labels
const typeLabels = {
  furniture: 'Furniture',
  electronics: 'Electronics',
  appliances: 'Appliances',
  kitchen: 'Kitchen',
  bathroom: 'Bathroom',
  other: 'Other',
};

// Condition labels
const conditionLabels = {
  New: 'New',
  Good: 'Good',
  Worn: 'Worn',
  Damaged: 'Damaged',
};

export default function InventoryViewPage() {
  const params = useParams();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const inventoryId = params?.id;
  const basePath = '/property-manager';

  // Redux state
  const inventory = useAppSelector(selectCurrentInventory);
  const isLoading = useAppSelector(selectInventoryLoading);
  const isDeleting = useAppSelector(selectInventoryDeleting);

  // Delete modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [actionsPopoverActive, setActionsPopoverActive] = useState(false);

  // Fetch inventory on mount
  useEffect(() => {
    if (inventoryId) {
      dispatch(fetchPropertyManagerInventoryById(inventoryId));
    }
  }, [dispatch, inventoryId]);

  // Handle delete
  const handleDeleteClick = useCallback(() => {
    setActionsPopoverActive(false);
    setDeleteModalOpen(true);
  }, []);

  const handleDeleteConfirm = useCallback(async () => {
    if (inventoryId) {
      const result = await dispatch(deletePropertyManagerInventory(inventoryId));
      if (!result.error) {
        router.push(`${basePath}/inventory`);
      }
    }
    setDeleteModalOpen(false);
  }, [dispatch, inventoryId, router, basePath]);

  const handleDeleteCancel = useCallback(() => {
    setDeleteModalOpen(false);
  }, []);

  const toggleActionsPopover = useCallback(() => {
    setActionsPopoverActive((active) => !active);
  }, []);

  // Show loading while fetching
  if (isLoading || !inventory) {
    return (
      <div className="add-developer-wrapper">
        <Page>
          <Box padding="1000">
            <BlockStack gap="400" inlineAlign="center">
              <Spinner size="large" />
              <Text variant="bodyMd" as="p" tone="subdued">
                Loading inventory details...
              </Text>
            </BlockStack>
          </Box>
        </Page>
      </div>
    );
  }

  const safeString = (value) => {
    if (value === null || value === undefined) return '';
    return String(value);
  };

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
        router.push(`${basePath}/inventory/${inventoryId}/edit`);
      },
    },
    {
      content: 'Delete',
      destructive: true,
      onAction: handleDeleteClick,
    },
  ];

  return (
    <div className="add-developer-wrapper">
      {/* Custom header row */}
      <div className="view-user-header">
        <InlineStack gap="050" blockAlign="center">
          <Icon source={InventoryIcon} tone="base" />
          <Icon source={ChevronRightIcon} tone="subdued" />
          <span className="new-developer-title">Inventory details</span>
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
              {/* Item Details card */}
              <Card>
                <BlockStack gap="400">
                  <Text variant="headingMd" as="h2">
                    Item Details
                  </Text>

                  <TextField
                    label="Inventory ID"
                    value={`#INV-${String(inventory.id).padStart(4, '0')}`}
                    readOnly
                    autoComplete="off"
                    helpText="Auto Generated"
                  />

                  <TextField
                    label="Name"
                    value={safeString(inventory.name)}
                    readOnly
                    autoComplete="off"
                  />

                  <TextField
                    label="Brand / Model"
                    value={safeString(inventory.brand_model)}
                    readOnly
                    autoComplete="off"
                  />

                  <InlineStack gap="400" wrap={false}>
                    <Box width="50%">
                      <TextField
                        label="Purchase Price (AED)"
                        value={inventory.purchase_price ? safeString(inventory.purchase_price) : ''}
                        readOnly
                        autoComplete="off"
                      />
                    </Box>
                    <Box width="50%">
                      <TextField
                        label="Quantity"
                        value={safeString(inventory.quantity || '1')}
                        readOnly
                        autoComplete="off"
                      />
                    </Box>
                  </InlineStack>

                  <InlineStack gap="400" wrap={false}>
                    <Box width="50%">
                      <TextField
                        label="Condition"
                        value={conditionLabels[inventory.condition] || safeString(inventory.condition)}
                        readOnly
                        autoComplete="off"
                      />
                    </Box>
                    <Box width="50%">
                      <TextField
                        label="Warranty"
                        value={safeString(inventory.warranty)}
                        readOnly
                        autoComplete="off"
                      />
                    </Box>
                  </InlineStack>

                  <InlineStack gap="400" wrap={false}>
                    <Box width="50%">
                      <TextField
                        label="Serial Number"
                        value={safeString(inventory.serial_number)}
                        readOnly
                        autoComplete="off"
                      />
                    </Box>
                    <Box width="50%">
                      <TextField
                        label="Room"
                        value={safeString(inventory.room_name)}
                        readOnly
                        autoComplete="off"
                      />
                    </Box>
                  </InlineStack>
                </BlockStack>
              </Card>

              {/* Property Information card */}
              <Card>
                <BlockStack gap="400">
                  <Text variant="headingMd" as="h2">
                    Property Assigned
                  </Text>

                  <TextField
                    label="Property"
                    value={inventory.property?.name || inventory.property?.title || `Property ${inventory.property_id}` || 'Unassigned'}
                    readOnly
                    autoComplete="off"
                  />
                </BlockStack>
              </Card>

              {/* Image card */}
              {inventory.image && (
                <Card>
                  <BlockStack gap="400">
                    <Text variant="headingMd" as="h2">
                      Image
                    </Text>

                    <Box>
                      <img
                        src={inventory.image}
                        alt={inventory.name || 'Inventory item'}
                        style={{
                          maxWidth: '300px',
                          maxHeight: '300px',
                          objectFit: 'contain',
                          borderRadius: '8px',
                          border: '1px solid #e1e3e5',
                        }}
                      />
                    </Box>
                  </BlockStack>
                </Card>
              )}

              {/* Notes card */}
              {inventory.notes && (
                <Card>
                  <BlockStack gap="400">
                    <Text variant="headingMd" as="h2">
                      Notes
                    </Text>

                    <TextField
                      label="Additional Notes"
                      labelHidden
                      value={safeString(inventory.notes)}
                      multiline={3}
                      readOnly
                      autoComplete="off"
                    />
                  </BlockStack>
                </Card>
              )}
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
                  <TextField
                    label="Type"
                    labelHidden
                    value={typeLabels[inventory.type] || safeString(inventory.type) || 'Not specified'}
                    readOnly
                    autoComplete="off"
                  />
                </BlockStack>
              </Card>
            </BlockStack>
          </Layout.Section>
        </Layout>

        {/* Delete Confirmation Modal */}
        <Modal
          open={deleteModalOpen}
          onClose={handleDeleteCancel}
          title="Delete inventory item"
          primaryAction={{
            content: 'Delete',
            destructive: true,
            onAction: handleDeleteConfirm,
            loading: isDeleting,
          }}
          secondaryActions={[
            {
              content: 'Cancel',
              onAction: handleDeleteCancel,
            },
          ]}
        >
          <Modal.Section>
            <Text variant="bodyMd" as="p">
              Are you sure you want to delete {inventory.name || 'this item'}? This action cannot be undone.
            </Text>
          </Modal.Section>
        </Modal>
      </Page>
    </div>
  );
}
