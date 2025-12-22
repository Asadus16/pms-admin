'use client';

import { useState, useCallback, useEffect, useMemo } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import {
  Page,
  Card,
  IndexTable,
  Text,
  Badge,
  TextField,
  Button,
  ButtonGroup,
  InlineStack,
  BlockStack,
  Box,
  Pagination,
  useIndexResourceState,
  Icon,
  Popover,
  ChoiceList,
  Divider,
  Modal,
  Spinner,
  Banner,
  Thumbnail,
} from '@shopify/polaris';
import {
  SearchIcon,
  InventoryIcon,
  LayoutColumns3Icon,
  SortIcon,
  ViewIcon,
  HideIcon,
  DeleteIcon,
} from '@shopify/polaris-icons';
import { useAppDispatch, useAppSelector } from '@/store';
import { fetchPropertyManagerInventories, fetchPropertyManagerProperties, deletePropertyManagerInventory } from '@/store/thunks';
import {
  selectInventories,
  selectInventoryPagination,
  selectInventoryLoading,
  selectInventoryError,
  selectInventoryDeleting,
} from '@/store/slices/property-manager/inventory/slice';
import '../PropertyOwnersPage/CustomersPage.css';

// All available columns for inventory
const allColumns = [
  { id: 'id', title: 'ID', default: true },
  { id: 'type', title: 'Type', default: true },
  { id: 'name', title: 'Name', default: true },
  { id: 'purchasePrice', title: 'Purchase Price', default: true },
  { id: 'property', title: 'Property', default: true },
  { id: 'condition', title: 'Condition', default: true },
  { id: 'quantity', title: 'Quantity', default: false },
  { id: 'roomName', title: 'Room', default: false },
];

// Sort options
const sortOptions = [
  { value: 'created_at', label: 'Date added' },
  { value: 'name', label: 'Name' },
  { value: 'type', label: 'Type' },
  { value: 'purchase_price', label: 'Purchase Price' },
];

// LocalStorage keys
const STORAGE_KEYS = {
  VISIBLE_COLUMNS: 'inventory_visible_columns',
  SORT_BY: 'inventory_sort_by',
  SORT_DIRECTION: 'inventory_sort_direction',
};

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

// Helper functions for localStorage
const getStoredColumns = () => {
  if (typeof window === 'undefined') return null;
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.VISIBLE_COLUMNS);
    if (stored) {
      const parsed = JSON.parse(stored);
      const allowed = new Set(allColumns.map((c) => c.id));
      const sanitized = Array.isArray(parsed) ? parsed.filter((id) => allowed.has(id)) : [];
      if (!sanitized.includes('name')) {
        sanitized.unshift('name');
      }
      return sanitized.length ? sanitized : null;
    }
  } catch (e) {
    console.error('Error reading from localStorage:', e);
  }
  return null;
};

const getStoredSort = () => {
  if (typeof window === 'undefined') {
    return { sortBy: 'created_at', sortDirection: 'desc' };
  }
  try {
    const sortBy = localStorage.getItem(STORAGE_KEYS.SORT_BY);
    const sortDir = localStorage.getItem(STORAGE_KEYS.SORT_DIRECTION);
    const allowed = new Set(sortOptions.map((o) => o.value));
    return {
      sortBy: sortBy && allowed.has(sortBy) ? sortBy : 'created_at',
      sortDirection: sortDir === 'asc' || sortDir === 'desc' ? sortDir : 'desc',
    };
  } catch (e) {
    console.error('Error reading from localStorage:', e);
  }
  return { sortBy: 'created_at', sortDirection: 'desc' };
};

function InventoryListPage() {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useAppDispatch();

  // Redux state
  const inventories = useAppSelector(selectInventories);
  const pagination = useAppSelector(selectInventoryPagination);
  const isLoading = useAppSelector(selectInventoryLoading);
  const error = useAppSelector(selectInventoryError);
  const isDeleting = useAppSelector(selectInventoryDeleting);

  // Get the base path (userType) from the current pathname
  const basePath = pathname.split('/')[1] ? `/${pathname.split('/')[1]}` : '/property-manager';

  const [searchValue, setSearchValue] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortPopoverActive, setSortPopoverActive] = useState(false);
  const [editColumnsMode, setEditColumnsMode] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  // Default visible columns
  const defaultColumns = allColumns.filter(col => col.default).map(col => col.id);

  // Initialize state with defaults (will be updated from localStorage in useEffect)
  const [selectedSort, setSelectedSort] = useState('created_at');
  const [sortDirection, setSortDirection] = useState('desc');
  const [visibleColumns, setVisibleColumns] = useState(defaultColumns);
  const [tempVisibleColumns, setTempVisibleColumns] = useState(defaultColumns);

  // Load from localStorage on client-side only (after mount)
  useEffect(() => {
    const storedSort = getStoredSort();
    setSelectedSort(storedSort.sortBy);
    setSortDirection(storedSort.sortDirection);

    const stored = getStoredColumns();
    if (stored) {
      setVisibleColumns(stored);
      setTempVisibleColumns(stored);
    }
  }, []);

  // Fetch inventory on mount and when pagination/sort changes
  useEffect(() => {
    dispatch(fetchPropertyManagerInventories({
      page: currentPage,
      per_page: 50,
      search: searchValue || undefined,
      sort_by: selectedSort,
      sort_direction: sortDirection,
    }));
  }, [dispatch, currentPage, selectedSort, sortDirection]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchValue !== '') {
        dispatch(fetchPropertyManagerInventories({
          page: 1,
          per_page: 50,
          search: searchValue,
          sort_by: selectedSort,
          sort_direction: sortDirection,
        }));
        setCurrentPage(1);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchValue, dispatch, selectedSort, sortDirection]);

  const resourceName = {
    singular: 'inventory item',
    plural: 'inventory items',
  };

  // Memoize inventories array for useIndexResourceState - ensure it's always an array
  const inventoriesArray = useMemo(() => {
    if (Array.isArray(inventories)) return inventories;
    if (inventories?.data && Array.isArray(inventories.data)) return inventories.data;
    return [];
  }, [inventories]);

  const { selectedResources, allResourcesSelected, handleSelectionChange } =
    useIndexResourceState(inventoriesArray);

  const handleSearchChange = useCallback((value) => {
    setSearchValue(value);
  }, []);

  const handleSearchClear = useCallback(() => {
    setSearchValue('');
    dispatch(fetchPropertyManagerInventories({
      page: 1,
      per_page: 50,
      sort_by: selectedSort,
      sort_direction: sortDirection,
    }));
    setCurrentPage(1);
  }, [dispatch, selectedSort, sortDirection]);

  const toggleSortPopover = useCallback(() => {
    setSortPopoverActive((active) => !active);
  }, []);

  const handleEditColumnsClick = useCallback(() => {
    setTempVisibleColumns([...visibleColumns]);
    setEditColumnsMode(true);
  }, [visibleColumns]);

  const handleCancelEditColumns = useCallback(() => {
    setTempVisibleColumns([...visibleColumns]);
    setEditColumnsMode(false);
  }, [visibleColumns]);

  const handleSaveColumns = useCallback(() => {
    setVisibleColumns([...tempVisibleColumns]);
    try {
      localStorage.setItem(STORAGE_KEYS.VISIBLE_COLUMNS, JSON.stringify(tempVisibleColumns));
    } catch (e) {
      console.error('Error saving to localStorage:', e);
    }
    setEditColumnsMode(false);
  }, [tempVisibleColumns]);

  const toggleColumnVisibility = useCallback((columnId) => {
    if (columnId === 'name') return;

    setTempVisibleColumns(prev => {
      if (prev.includes(columnId)) {
        return prev.filter(id => id !== columnId);
      } else {
        return [...prev, columnId];
      }
    });
  }, []);

  const handleSortChange = useCallback((value) => {
    setSelectedSort(value[0]);
    try {
      localStorage.setItem(STORAGE_KEYS.SORT_BY, value[0]);
    } catch (e) {
      console.error('Error saving to localStorage:', e);
    }
  }, []);

  const handleSortDirectionChange = useCallback((value) => {
    setSortDirection(value[0]);
    try {
      localStorage.setItem(STORAGE_KEYS.SORT_DIRECTION, value[0]);
    } catch (e) {
      console.error('Error saving to localStorage:', e);
    }
  }, []);

  // Delete handlers
  const handleDeleteClick = useCallback((item) => {
    setItemToDelete(item);
    setDeleteModalOpen(true);
  }, []);

  const handleDeleteConfirm = useCallback(async () => {
    if (itemToDelete) {
      await dispatch(deletePropertyManagerInventory(itemToDelete.id));
      setDeleteModalOpen(false);
      setItemToDelete(null);
    }
  }, [dispatch, itemToDelete]);

  const handleDeleteCancel = useCallback(() => {
    setDeleteModalOpen(false);
    setItemToDelete(null);
  }, []);

  const totalItems = pagination.totalItems || inventoriesArray.length;

  // Get current visible columns for normal view
  const currentVisibleColumns = allColumns.filter(col => visibleColumns.includes(col.id));

  // Render cell content based on column id
  const renderCellContent = (item, columnId) => {
    switch (columnId) {
      case 'id':
        return (
          <Text variant="bodyMd" as="span" tone="subdued">
            {`#INV-${String(item.id).padStart(4, '0')}`}
          </Text>
        );
      case 'type':
        return (
          <Badge tone={
            item.type === 'furniture' ? 'info' :
            item.type === 'electronics' ? 'attention' :
            item.type === 'appliances' ? 'success' : 'subdued'
          }>
            {typeLabels[item.type] || item.type || 'N/A'}
          </Badge>
        );
      case 'name':
        return (
          <Text variant="bodyMd" fontWeight="semibold" as="span">
            {item.name || 'Unnamed Item'}
          </Text>
        );
      case 'purchasePrice':
        return (
          <Text variant="bodyMd" as="span">
            {item.purchase_price ? `AED ${item.purchase_price}` : 'N/A'}
          </Text>
        );
      case 'property':
        return (
          <Text variant="bodyMd" as="span" tone="subdued">
            {item.property?.name || item.property?.title || 'Unassigned'}
          </Text>
        );
      case 'condition':
        return (
          <Badge tone={
            item.condition === 'New' ? 'success' :
            item.condition === 'Good' ? 'info' :
            item.condition === 'Worn' ? 'attention' : 'critical'
          }>
            {conditionLabels[item.condition] || item.condition || 'N/A'}
          </Badge>
        );
      case 'quantity':
        return (
          <Text variant="bodyMd" as="span">
            {item.quantity || 1}
          </Text>
        );
      case 'roomName':
        return (
          <Text variant="bodyMd" as="span" tone="subdued">
            {item.room_name || 'N/A'}
          </Text>
        );
      default:
        return null;
    }
  };

  const rowMarkup = inventoriesArray.map((item, index) => (
    <IndexTable.Row
      id={String(item.id)}
      key={item.id}
      selected={selectedResources.includes(String(item.id))}
      position={index}
      onClick={() => router.push(`${basePath}/inventory/${item.id}`)}
    >
      {currentVisibleColumns.map((column) => (
        <IndexTable.Cell key={column.id}>
          {renderCellContent(item, column.id)}
        </IndexTable.Cell>
      ))}
    </IndexTable.Row>
  ));

  // Render a single column as a mini table for edit mode
  const renderColumnBlock = (column) => {
    const isVisible = tempVisibleColumns.includes(column.id);
    const isNameColumn = column.id === 'name';

    return (
      <div
        key={column.id}
        className={`edit-column-item ${!isVisible ? 'hidden' : ''}`}
      >
        <div className="edit-column-header">
          <Text variant="bodySm" as="span" fontWeight="medium">
            {column.title}
          </Text>
          {!isNameColumn && (
            <button
              onClick={() => toggleColumnVisibility(column.id)}
              className={`edit-column-toggle-btn ${!isVisible ? 'hidden' : ''}`}
              aria-label={isVisible ? `Hide ${column.title}` : `Show ${column.title}`}
            >
              <Icon source={isVisible ? ViewIcon : HideIcon} tone="subdued" />
            </button>
          )}
        </div>

        <div className={`edit-column-data ${!isVisible ? 'hidden' : ''}`}>
          {inventoriesArray.slice(0, 10).map((item, index) => (
            <div
              key={item.id}
              className="edit-column-row"
              style={{
                borderBottom: index < 9 ? '1px solid #f1f1f1' : 'none',
              }}
            >
              {renderCellContent(item, column.id)}
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Sort popover activator
  const sortActivator = (
    <Button
      icon={SortIcon}
      onClick={toggleSortPopover}
      accessibilityLabel="Sort inventory"
    />
  );

  return (
    <>
      <div className="customers-page-wrapper width-full">
        <Page
          title={
            <InlineStack gap="200" blockAlign="center">
              <Icon source={InventoryIcon} />
              <span className="customers-page-title">Inventory</span>
            </InlineStack>
          }
          primaryAction={{
            content: 'Add inventory',
            onAction: () => router.push(`${basePath}/inventory/new`),
          }}
        >
          {/* Error Banner */}
          {error && (
            <Box paddingBlockEnd="400">
              <Banner tone="critical" onDismiss={() => {}}>
                <p>{error}</p>
              </Banner>
            </Box>
          )}

          {/* Inventory count stats bar */}
          <Box paddingBlockEnd="600" className="customer-stats-box">
            <Card padding="400" className="customer-stats-card">
              <InlineStack gap="200" align="start">
                <Text variant="bodyMd" as="span" fontWeight="semibold">
                  {totalItems} items
                </Text>
              </InlineStack>
            </Card>
          </Box>

          {/* Main table card */}
          <Card padding="0">
            {/* Search bar with Edit Columns and Sort buttons */}
            <Box padding="200" paddingBlockEnd="200">
              <InlineStack align="space-between" blockAlign="center">
                <div className="flex-1 max-width-93">
                  <TextField
                    placeholder="Search inventory"
                    value={searchValue}
                    onChange={handleSearchChange}
                    clearButton
                    onClearButtonClick={handleSearchClear}
                    prefix={<Icon source={SearchIcon} tone="subdued" />}
                    autoComplete="off"
                  />
                </div>

                <InlineStack gap="200" blockAlign="center">
                  {editColumnsMode ? (
                    <ButtonGroup>
                      <Button onClick={handleCancelEditColumns}>Cancel</Button>
                      <Button variant="primary" onClick={handleSaveColumns}>Save</Button>
                    </ButtonGroup>
                  ) : (
                    <>
                      <Button
                        icon={LayoutColumns3Icon}
                        onClick={handleEditColumnsClick}
                        accessibilityLabel="Edit columns"
                      />

                      <Popover
                        active={sortPopoverActive}
                        activator={sortActivator}
                        onClose={toggleSortPopover}
                        preferredAlignment="right"
                        preferredPosition="below"
                      >
                        <div className="sort-popover-content width-220">
                          <Box padding="300" paddingBlockEnd="100">
                            <Text variant="headingSm" as="h3">
                              Sort by
                            </Text>
                          </Box>

                          <Box paddingInline="100">
                            <ChoiceList
                              choices={sortOptions}
                              selected={[selectedSort]}
                              onChange={handleSortChange}
                            />
                          </Box>

                          <Box paddingInline="300" paddingBlock="150">
                            <Divider />
                          </Box>

                          <div className="padding-bottom-8">
                            <div
                              className={`sort-direction-item ${sortDirection === 'asc' ? 'selected' : ''}`}
                              onClick={() => handleSortDirectionChange(['asc'])}
                            >
                              <Text variant="bodyMd" as="span">
                                Lowest to highest
                              </Text>
                            </div>
                            <div
                              className={`sort-direction-item ${sortDirection === 'desc' ? 'selected' : ''}`}
                              onClick={() => handleSortDirectionChange(['desc'])}
                            >
                              <Text variant="bodyMd" as="span">
                                Highest to lowest
                              </Text>
                            </div>
                          </div>
                        </div>
                      </Popover>
                    </>
                  )}
                </InlineStack>
              </InlineStack>
            </Box>

            {/* Loading State */}
            {isLoading ? (
              <Box padding="1000">
                <BlockStack gap="400" inlineAlign="center">
                  <Spinner size="large" />
                  <Text variant="bodyMd" as="p" tone="subdued">
                    Loading inventory...
                  </Text>
                </BlockStack>
              </Box>
            ) : editColumnsMode ? (
              <div className="edit-columns-container">
                {allColumns.map((column) => renderColumnBlock(column))}
              </div>
            ) : inventoriesArray.length === 0 ? (
              <Box padding="1000">
                <BlockStack gap="400" inlineAlign="center">
                  <Text variant="headingMd" as="h3">
                    No inventory items found
                  </Text>
                  <Text variant="bodyMd" as="p" tone="subdued">
                    {searchValue ? 'Try adjusting your search terms' : 'Add your first inventory item to get started'}
                  </Text>
                  {!searchValue && (
                    <Button variant="primary" onClick={() => router.push(`${basePath}/inventory/new`)}>
                      Add inventory
                    </Button>
                  )}
                </BlockStack>
              </Box>
            ) : (
              <div className="table-scroll-container">
                <IndexTable
                  resourceName={resourceName}
                  itemCount={inventoriesArray.length}
                  selectedItemsCount={
                    allResourcesSelected ? 'All' : selectedResources.length
                  }
                  onSelectionChange={handleSelectionChange}
                  headings={currentVisibleColumns.map((column) => ({
                    title: column.title,
                    alignment: column.alignment || 'start',
                  }))}
                  selectable
                >
                  {rowMarkup}
                </IndexTable>
              </div>
            )}

            {/* Pagination */}
            {!editColumnsMode && !isLoading && inventoriesArray.length > 0 && (
              <Box padding="400" borderBlockStartWidth="025" borderColor="border">
                <InlineStack align="space-between" blockAlign="center">
                  <Pagination
                    hasPrevious={currentPage > 1}
                    onPrevious={() => setCurrentPage(currentPage - 1)}
                    hasNext={currentPage < pagination.totalPages}
                    onNext={() => setCurrentPage(currentPage + 1)}
                  />
                  <Text variant="bodySm" as="span" tone="subdued">
                    {`${(currentPage - 1) * pagination.perPage + 1}-${Math.min(
                      currentPage * pagination.perPage,
                      totalItems
                    )} of ${totalItems}`}
                  </Text>
                </InlineStack>
              </Box>
            )}
          </Card>
        </Page>

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
              Are you sure you want to delete {itemToDelete?.name || 'this item'}? This action cannot be undone.
            </Text>
          </Modal.Section>
        </Modal>
      </div>
    </>
  );
}

export default InventoryListPage;
