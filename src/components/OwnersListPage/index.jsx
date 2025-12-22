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
  DropZone,
  Checkbox,
  Link,
  Spinner,
  Banner,
} from '@shopify/polaris';
import {
  SearchIcon,
  PersonIcon,
  LayoutColumns3Icon,
  SortIcon,
  ViewIcon,
  HideIcon,
  PlusIcon,
} from '@shopify/polaris-icons';
import { useAppDispatch, useAppSelector } from '@/store';
import { fetchPropertyManagerOwners } from '@/store/thunks';
import {
  selectOwners,
  selectOwnersPagination,
  selectOwnersLoading,
  selectOwnersError,
} from '@/store/slices/property-manager/owners/slice';
import '../PropertyOwnersPage/CustomersPage.css';

// All available columns for owners
const allColumns = [
  { id: 'ownerId', title: 'Owner ID', default: true },
  { id: 'ownerType', title: 'Type', default: true },
  { id: 'name', title: 'Name', default: true },
  { id: 'nationality', title: 'Nationality', default: true },
  { id: 'phone', title: 'Phone', default: true },
  { id: 'status', title: 'Status', default: true },
];

// Sort options
const sortOptions = [
  { value: 'created_at', label: 'Date added' },
  { value: 'name', label: 'Name' },
  { value: 'owner_type', label: 'Type' },
  { value: 'status', label: 'Status' },
];

// LocalStorage keys
const STORAGE_KEYS = {
  VISIBLE_COLUMNS: 'owners_visible_columns',
  SORT_BY: 'owners_sort_by',
  SORT_DIRECTION: 'owners_sort_direction',
};

// Country labels mapping
const countryLabels = {
  AE: 'UAE',
  SA: 'Saudi Arabia',
  QA: 'Qatar',
  BH: 'Bahrain',
  KW: 'Kuwait',
  OM: 'Oman',
  IN: 'India',
  US: 'United States',
  GB: 'United Kingdom',
  EG: 'Egypt',
  JO: 'Jordan',
  LB: 'Lebanon',
  PK: 'Pakistan',
};

// Owner type labels
const ownerTypeLabels = {
  individual: 'Individual',
  company: 'Company',
  developer: 'Developer',
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

function OwnersListPage() {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useAppDispatch();

  // Redux state
  const owners = useAppSelector(selectOwners);
  const pagination = useAppSelector(selectOwnersPagination);
  const isLoading = useAppSelector(selectOwnersLoading);
  const error = useAppSelector(selectOwnersError);

  // Get the base path (userType) from the current pathname
  const basePath = pathname.split('/')[1] ? `/${pathname.split('/')[1]}` : '/property-manager';

  const [searchValue, setSearchValue] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortPopoverActive, setSortPopoverActive] = useState(false);
  const [editColumnsMode, setEditColumnsMode] = useState(false);

  // Modal states
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [exportOption, setExportOption] = useState(['all']);
  const [exportFormat, setExportFormat] = useState(['csv_excel']);
  const [importFile, setImportFile] = useState(null);
  const [includeKycDetails, setIncludeKycDetails] = useState(true);
  const [includeBankDetails, setIncludeBankDetails] = useState(true);

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

  // Fetch owners on mount and when pagination/sort changes
  useEffect(() => {
    dispatch(fetchPropertyManagerOwners({
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
        dispatch(fetchPropertyManagerOwners({
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
    singular: 'owner',
    plural: 'owners',
  };

  // Memoize owners array for useIndexResourceState - ensure it's always an array
  const ownersArray = useMemo(() => {
    if (Array.isArray(owners)) return owners;
    if (owners?.data && Array.isArray(owners.data)) return owners.data;
    return [];
  }, [owners]);

  const { selectedResources, allResourcesSelected, handleSelectionChange } =
    useIndexResourceState(ownersArray);

  const handleSearchChange = useCallback((value) => {
    setSearchValue(value);
  }, []);

  const handleSearchClear = useCallback(() => {
    setSearchValue('');
    dispatch(fetchPropertyManagerOwners({
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

  // Export modal handlers
  const handleExportModalOpen = useCallback(() => {
    setExportModalOpen(true);
  }, []);

  const handleExportModalClose = useCallback(() => {
    setExportModalOpen(false);
  }, []);

  const handleExportOptionChange = useCallback((value) => {
    setExportOption(value);
  }, []);

  const handleExportFormatChange = useCallback((value) => {
    setExportFormat(value);
  }, []);

  const handleExport = useCallback(() => {
    console.log('Exporting:', {
      option: exportOption[0],
      format: exportFormat[0],
      includeKycDetails,
      includeBankDetails
    });
    setExportModalOpen(false);
  }, [exportOption, exportFormat, includeKycDetails, includeBankDetails]);

  // Import modal handlers
  const handleImportModalOpen = useCallback(() => {
    setImportModalOpen(true);
  }, []);

  const handleImportModalClose = useCallback(() => {
    setImportModalOpen(false);
    setImportFile(null);
  }, []);

  const handleDropZoneDrop = useCallback((files) => {
    setImportFile(files[0]);
  }, []);

  const handleImport = useCallback(() => {
    console.log('Importing file:', importFile);
    setImportModalOpen(false);
    setImportFile(null);
  }, [importFile]);

  const totalOwners = pagination.totalItems || ownersArray.length;
  const activeOwners = useMemo(() => {
    if (!Array.isArray(ownersArray)) return 0;
    return ownersArray.filter(o => o?.status === 'active').length;
  }, [ownersArray]);

  // Get current visible columns for normal view
  const currentVisibleColumns = allColumns.filter(col => visibleColumns.includes(col.id));

  // Render cell content based on column id
  const renderCellContent = (owner, columnId) => {
    switch (columnId) {
      case 'ownerId':
        return (
          <Text variant="bodyMd" as="span" tone="subdued">
            {owner.owner_id || owner.ownerId || `OWN-${String(owner.id).padStart(4, '0')}`}
          </Text>
        );
      case 'ownerType':
        return (
          <Badge tone={(owner.owner_type || owner.ownerType) === 'individual' ? 'info' : (owner.owner_type || owner.ownerType) === 'company' ? 'attention' : 'success'}>
            {ownerTypeLabels[owner.owner_type || owner.ownerType] || owner.owner_type || owner.ownerType}
          </Badge>
        );
      case 'name':
        return (
          <Text variant="bodyMd" fontWeight="semibold" as="span">
            {owner.name}
          </Text>
        );
      case 'nationality':
        return (
          <Text variant="bodyMd" as="span">
            {countryLabels[owner.nationality] || owner.nationality}
          </Text>
        );
      case 'phone':
        return (
          <Text variant="bodyMd" as="span" tone="subdued">
            {owner.phone}
          </Text>
        );
      case 'status':
        return (
          <Badge tone={owner.status === 'active' ? 'success' : 'subdued'}>
            {owner.status === 'active' ? 'Active' : 'Inactive'}
          </Badge>
        );
      default:
        return null;
    }
  };

  const rowMarkup = ownersArray.map((owner, index) => (
    <IndexTable.Row
      id={String(owner.id)}
      key={owner.id}
      selected={selectedResources.includes(String(owner.id))}
      position={index}
      onClick={() => router.push(`${basePath}/owners/${owner.id}`)}
    >
      {currentVisibleColumns.map((column) => (
        <IndexTable.Cell key={column.id}>
          {renderCellContent(owner, column.id)}
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
          {ownersArray.slice(0, 10).map((owner, index) => (
            <div
              key={owner.id}
              className="edit-column-row"
              style={{
                borderBottom: index < 9 ? '1px solid #f1f1f1' : 'none',
              }}
            >
              {renderCellContent(owner, column.id)}
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
      accessibilityLabel="Sort owners"
    />
  );

  return (
    <>
      <div className="customers-page-wrapper width-full">
        <Page
          title={
            <InlineStack gap="200" blockAlign="center">
              <Icon source={PersonIcon} />
              <span className="customers-page-title">Owners</span>
            </InlineStack>
          }
          primaryAction={{
            content: 'Add owner',
            onAction: () => router.push(`${basePath}/owners/new`),
          }}
          secondaryActions={[
            {
              content: 'Export',
              onAction: handleExportModalOpen,
            },
            {
              content: 'Import',
              onAction: handleImportModalOpen,
            },
          ]}
        >
          {/* Error Banner */}
          {error && (
            <Box paddingBlockEnd="400">
              <Banner tone="critical" onDismiss={() => {}}>
                <p>{error}</p>
              </Banner>
            </Box>
          )}

          {/* Owner count stats bar */}
          <Box paddingBlockEnd="600" className="customer-stats-box">
            <Card padding="400" className="customer-stats-card">
              <InlineStack gap="200" align="start">
                <Text variant="bodyMd" as="span" fontWeight="semibold">
                  {totalOwners} owners
                </Text>
                <Text variant="bodyMd" as="span" tone="subdued">
                  |
                </Text>
                <Text variant="bodyMd" as="span" tone="subdued">
                  {activeOwners} active
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
                    placeholder="Search owners"
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
                                ↑ Lowest to highest
                              </Text>
                            </div>
                            <div
                              className={`sort-direction-item ${sortDirection === 'desc' ? 'selected' : ''}`}
                              onClick={() => handleSortDirectionChange(['desc'])}
                            >
                              <Text variant="bodyMd" as="span">
                                ↓ Highest to lowest
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
                    Loading owners...
                  </Text>
                </BlockStack>
              </Box>
            ) : editColumnsMode ? (
              <div className="edit-columns-container">
                {allColumns.map((column) => renderColumnBlock(column))}
              </div>
            ) : ownersArray.length === 0 ? (
              <Box padding="1000">
                <BlockStack gap="400" inlineAlign="center">
                  <Text variant="headingMd" as="h3">
                    No owners found
                  </Text>
                  <Text variant="bodyMd" as="p" tone="subdued">
                    {searchValue ? 'Try adjusting your search terms' : 'Add your first owner to get started'}
                  </Text>
                  {!searchValue && (
                    <Button variant="primary" onClick={() => router.push(`${basePath}/owners/new`)}>
                      Add owner
                    </Button>
                  )}
                </BlockStack>
              </Box>
            ) : (
              <div className="table-scroll-container">
                <IndexTable
                  resourceName={resourceName}
                  itemCount={ownersArray.length}
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
            {!editColumnsMode && !isLoading && ownersArray.length > 0 && (
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
                      totalOwners
                    )} of ${totalOwners}`}
                  </Text>
                </InlineStack>
              </Box>
            )}
          </Card>
        </Page>

        {/* Export Modal */}
        <Modal
          open={exportModalOpen}
          onClose={handleExportModalClose}
          title="Export owners"
          primaryAction={{
            content: 'Export owners',
            onAction: handleExport,
          }}
          secondaryActions={[
            {
              content: 'Cancel',
              onAction: handleExportModalClose,
            },
          ]}
        >
          <Modal.Section>
            <BlockStack gap="500">
              <BlockStack gap="300">
                <Text variant="headingSm" as="h3">
                  Owners selected
                </Text>
                <ChoiceList
                  choices={[
                    { label: 'Current page', value: 'current' },
                    { label: 'All owners', value: 'all' },
                  ]}
                  selected={exportOption}
                  onChange={handleExportOptionChange}
                />
              </BlockStack>

              <BlockStack gap="300">
                <Text variant="headingSm" as="h3">
                  Fields included
                </Text>
                <Text variant="bodyMd" as="p" tone="subdued">
                  By default, all exports include: name, type, nationality, contact info, status.
                </Text>
                <BlockStack gap="200">
                  <Checkbox
                    label="KYC details"
                    checked={includeKycDetails}
                    onChange={setIncludeKycDetails}
                  />
                  <Checkbox
                    label="Bank details"
                    checked={includeBankDetails}
                    onChange={setIncludeBankDetails}
                  />
                </BlockStack>
              </BlockStack>

              <BlockStack gap="300">
                <Text variant="headingSm" as="h3">
                  File format
                </Text>
                <ChoiceList
                  choices={[
                    { label: 'CSV for Excel, Numbers, or other spreadsheet programs', value: 'csv_excel' },
                    { label: 'Plain CSV file', value: 'plain_csv' },
                  ]}
                  selected={exportFormat}
                  onChange={handleExportFormatChange}
                />
              </BlockStack>
            </BlockStack>
          </Modal.Section>
        </Modal>

        {/* Import Modal */}
        <Modal
          open={importModalOpen}
          onClose={handleImportModalClose}
          title="Import owners by CSV"
          primaryAction={{
            content: 'Import owners',
            onAction: handleImport,
            disabled: !importFile,
          }}
          secondaryActions={[
            {
              content: 'Cancel',
              onAction: handleImportModalClose,
            },
          ]}
          preventCloseOnClickOutside={false}
          footer={
            <Box paddingBlockStart="400">
              <Link url="#">
                Download a sample CSV
              </Link>
            </Box>
          }
        >
          <Modal.Section>
            <DropZone
              accept=".csv"
              type="file"
              onDrop={handleDropZoneDrop}
            >
              {importFile ? (
                <Box padding="1000">
                  <BlockStack gap="200" inlineAlign="center">
                    <Text variant="bodyMd" as="p" fontWeight="semibold">
                      {importFile.name}
                    </Text>
                    <Text variant="bodySm" as="p" tone="subdued">
                      {(importFile.size / 1024).toFixed(2)} KB
                    </Text>
                    <Button onClick={() => setImportFile(null)} size="slim">
                      Remove file
                    </Button>
                  </BlockStack>
                </Box>
              ) : (
                <Box padding="1000">
                  <BlockStack inlineAlign="center">
                    <Button icon={PlusIcon}>Add file</Button>
                  </BlockStack>
                </Box>
              )}
            </DropZone>
          </Modal.Section>
        </Modal>
      </div>
    </>
  );
}

export default OwnersListPage;
