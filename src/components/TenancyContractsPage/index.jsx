'use client';

import { useState, useCallback, useEffect } from 'react';
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
} from '@shopify/polaris';
import {
  SearchIcon,
  DocumentIcon,
  LayoutColumns3Icon,
  SortIcon,
  ViewIcon,
  HideIcon,
  PlusIcon,
} from '@shopify/polaris-icons';
import './CustomersPage.css';
import { useAppDispatch, useAppSelector } from '@/store';
import { fetchPropertyManagerTenancyContracts } from '@/store/thunks/property-manager/propertyManagerThunks';
import {
  selectTenancyContracts,
  selectTenancyContractsPagination,
  selectTenancyContractsLoading,
  selectTenancyContractsError,
} from '@/store/slices/property-manager';

// All available columns for tenancy contracts
const allColumns = [
  { id: 'tenancyId', title: 'Tenancy ID', default: true },
  { id: 'property', title: 'Property', default: true },
  { id: 'tenant', title: 'Tenant', default: true },
  { id: 'owner', title: 'Owner', default: true },
  { id: 'rentAmount', title: 'Rent Amount', default: true },
  { id: 'paymentFrequency', title: 'Payment Frequency', default: true },
  { id: 'startDate', title: 'Start Date', default: true },
  { id: 'endDate', title: 'End Date', default: true },
  { id: 'status', title: 'Status', default: true },
];

// Sort options
const sortOptions = [
  { value: 'dateAdded', label: 'Date added' },
  { value: 'tenancyId', label: 'Tenancy ID' },
  { value: 'rentAmount', label: 'Rent Amount' },
  { value: 'status', label: 'Status' },
];

// LocalStorage keys
const STORAGE_KEYS = {
  VISIBLE_COLUMNS: 'tenancy_contracts_visible_columns',
  SORT_BY: 'tenancy_contracts_sort_by',
  SORT_DIRECTION: 'tenancy_contracts_sort_direction',
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
      if (!sanitized.includes('tenancyId')) {
        sanitized.unshift('tenancyId');
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
    return { sortBy: 'dateAdded', sortDirection: 'desc' };
  }
  try {
    const sortBy = localStorage.getItem(STORAGE_KEYS.SORT_BY);
    const sortDir = localStorage.getItem(STORAGE_KEYS.SORT_DIRECTION);
    const allowed = new Set(sortOptions.map((o) => o.value));
    return {
      sortBy: sortBy && allowed.has(sortBy) ? sortBy : 'dateAdded',
      sortDirection: sortDir === 'asc' || sortDir === 'desc' ? sortDir : 'desc',
    };
  } catch (e) {
    console.error('Error reading from localStorage:', e);
  }
  return { sortBy: 'dateAdded', sortDirection: 'desc' };
};

function TenancyContractsPage() {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useAppDispatch();

  // Get the base path (userType) from the current pathname
  const basePath = pathname.split('/')[1] ? `/${pathname.split('/')[1]}` : '/property-manager';

  // Redux state
  const contracts = useAppSelector(selectTenancyContracts);
  const pagination = useAppSelector(selectTenancyContractsPagination);
  const loading = useAppSelector(selectTenancyContractsLoading);
  const error = useAppSelector(selectTenancyContractsError);

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
  const [includePropertyDetails, setIncludePropertyDetails] = useState(true);
  const [includePaymentHistory, setIncludePaymentHistory] = useState(true);

  // Default visible columns
  const defaultColumns = allColumns.filter(col => col.default).map(col => col.id);

  // Initialize state with defaults (will be updated from localStorage in useEffect)
  const [selectedSort, setSelectedSort] = useState('dateAdded');
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

  // Fetch contracts from API with debounced search
  useEffect(() => {
    // Debounce search to avoid too many API calls
    const timeoutId = setTimeout(() => {
      dispatch(fetchPropertyManagerTenancyContracts({
        per_page: 15,
        page: currentPage,
        search: searchValue || undefined,
      }));
    }, searchValue ? 500 : 0); // 500ms delay for search, immediate for page changes

    return () => clearTimeout(timeoutId);
  }, [currentPage, searchValue, dispatch]);

  const itemsPerPage = pagination.per_page || 15;

  const resourceName = {
    singular: 'tenancy contract',
    plural: 'tenancy contracts',
  };

  const { selectedResources, allResourcesSelected, handleSelectionChange } =
    useIndexResourceState(contracts);

  const handleSearchChange = useCallback((value) => {
    setSearchValue(value);
    // Reset to page 1 when search changes
    setCurrentPage(1);
  }, []);

  const handleSearchClear = useCallback(() => {
    setSearchValue('');
    setCurrentPage(1);
  }, []);

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
    if (columnId === 'tenancyId') return;

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
      includePropertyDetails,
      includePaymentHistory
    });
    setExportModalOpen(false);
  }, [exportOption, exportFormat, includePropertyDetails, includePaymentHistory]);

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

  // API already filters by search, so use contracts directly
  const filteredContracts = contracts;

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    if (Number.isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: '2-digit' });
  };

  const formatCurrency = (amount) => {
    if (!amount) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'AED',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(parseFloat(amount));
  };

  // Sort contracts
  const sortedContracts = [...filteredContracts].sort((a, b) => {
    let comparison = 0;
    switch (selectedSort) {
      case 'rentAmount':
        comparison = parseFloat(a.rent_amount || 0) - parseFloat(b.rent_amount || 0);
        break;
      case 'tenancyId':
        comparison = (a.tenancy_id || '').localeCompare(b.tenancy_id || '');
        break;
      case 'status':
        comparison = (a.status || '').localeCompare(b.status || '');
        break;
      case 'dateAdded':
        comparison = new Date(a.created_at || 0).getTime() - new Date(b.created_at || 0).getTime();
        break;
      default:
        comparison = 0;
    }
    return sortDirection === 'desc' ? -comparison : comparison;
  });

  const totalContracts = pagination.total || contracts.length;
  const activeContractsCount = contracts.filter(c => c.status === 'Active').length;

  // Get current visible columns for normal view
  const currentVisibleColumns = allColumns.filter(col => visibleColumns.includes(col.id));

  // Render cell content based on column id
  const renderCellContent = (contract, columnId) => {
    switch (columnId) {
      case 'tenancyId':
        return (
          <Text variant="bodyMd" fontWeight="semibold" as="span">
            {contract.tenancy_id || `TEN-${contract.id}`}
          </Text>
        );
      case 'property':
        const property = contract.property;
        return (
          <Text variant="bodyMd" as="span">
            {property ? `${property.unit_number || ''} ${property.building_name || ''}`.trim() : 'N/A'}
          </Text>
        );
      case 'tenant':
        const tenant = contract.tenant;
        return (
          <Text variant="bodyMd" as="span">
            {tenant?.full_name || tenant?.name || 'N/A'}
          </Text>
        );
      case 'owner':
        const owner = contract.owner;
        return (
          <Text variant="bodyMd" as="span">
            {owner?.name || 'N/A'}
          </Text>
        );
      case 'rentAmount':
        return (
          <Text variant="bodyMd" as="span">
            {formatCurrency(contract.rent_amount)}
          </Text>
        );
      case 'paymentFrequency':
        return (
          <Text variant="bodyMd" as="span">
            {contract.rent_payment_frequency || 'N/A'}
          </Text>
        );
      case 'startDate':
        return (
          <Text variant="bodyMd" as="span">
            {formatDate(contract.contract_start_date)}
          </Text>
        );
      case 'endDate':
        return (
          <Text variant="bodyMd" as="span">
            {formatDate(contract.contract_end_date)}
          </Text>
        );
      case 'status':
        const statusTone = contract.status === 'Active' ? 'success' : 
                          contract.status === 'Expired' ? 'subdued' : 
                          contract.status === 'Renewed' ? 'info' : 
                          contract.status === 'Terminated' ? 'critical' : 'subdued';
        return (
          <Badge tone={statusTone}>
            {contract.status || 'N/A'}
          </Badge>
        );
      default:
        return null;
    }
  };

  const rowMarkup = sortedContracts.map((contract, index) => (
    <IndexTable.Row
      id={contract.id}
      key={contract.id}
      selected={selectedResources.includes(contract.id)}
      position={index}
      onClick={() => router.push(`${basePath}/tenancy-contracts/${contract.id}`)}
    >
      {currentVisibleColumns.map((column) => (
        <IndexTable.Cell key={column.id}>
          {renderCellContent(contract, column.id)}
        </IndexTable.Cell>
      ))}
    </IndexTable.Row>
  ));

  // Render a single column as a mini table for edit mode
  const renderColumnBlock = (column) => {
    const isVisible = tempVisibleColumns.includes(column.id);
    const isTenancyIdColumn = column.id === 'tenancyId';

    return (
      <div
        key={column.id}
        className={`edit-column-item ${!isVisible ? 'hidden' : ''}`}
      >
        <div className="edit-column-header">
          <Text variant="bodySm" as="span" fontWeight="medium">
            {column.title}
          </Text>
          {!isTenancyIdColumn && (
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
          {sortedContracts.slice(0, 10).map((contract, index) => (
            <div
              key={contract.id}
              className="edit-column-row"
              style={{
                borderBottom: index < 9 ? '1px solid #f1f1f1' : 'none',
              }}
            >
              {renderCellContent(contract, column.id)}
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
      accessibilityLabel="Sort tenancy contracts"
    />
  );

  return (
    <>
      <div className="customers-page-wrapper width-full">
        <Page
          title={
            <InlineStack gap="200" blockAlign="center">
              <Icon source={DocumentIcon} />
              <span className="customers-page-title">Tenancy Contracts</span>
            </InlineStack>
          }
          primaryAction={{
            content: 'Add contract',
            onAction: () => router.push(`${basePath}/tenancy-contracts/new`),
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
          {/* Contract count stats bar */}
          <Box paddingBlockEnd="600" className="customer-stats-box">
            <Card padding="400" className="customer-stats-card">
              <InlineStack gap="200" align="start">
                {loading ? (
                  <InlineStack gap="200" blockAlign="center">
                    <Spinner size="small" />
                    <Text variant="bodyMd" as="span" tone="subdued">Loading contracts...</Text>
                  </InlineStack>
                ) : (
                  <>
                    <Text variant="bodyMd" as="span" fontWeight="semibold">
                      {totalContracts} contracts
                    </Text>
                    <Text variant="bodyMd" as="span" tone="subdued">
                      |
                    </Text>
                    <Text variant="bodyMd" as="span" tone="subdued">
                      {activeContractsCount} active
                    </Text>
                  </>
                )}
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
                    placeholder="Search contracts"
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

            {/* Index Table or Edit Columns View */}
            {editColumnsMode ? (
              <div className="edit-columns-container">
                {allColumns.map((column) => renderColumnBlock(column))}
              </div>
            ) : loading ? (
              <Box padding="800">
                <BlockStack gap="400" inlineAlign="center">
                  <Spinner size="large" />
                  <Text variant="bodyMd" as="p" tone="subdued">Loading contracts...</Text>
                </BlockStack>
              </Box>
            ) : (
              <div className="table-scroll-container">
                <IndexTable
                  resourceName={resourceName}
                  itemCount={sortedContracts.length}
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
            {!editColumnsMode && !loading && (
              <Box padding="400" borderBlockStartWidth="025" borderColor="border">
                <InlineStack align="space-between" blockAlign="center">
                  <Pagination
                    hasPrevious={pagination.current_page > 1}
                    onPrevious={() => setCurrentPage(currentPage - 1)}
                    hasNext={pagination.current_page < pagination.last_page}
                    onNext={() => setCurrentPage(currentPage + 1)}
                  />
                  <Text variant="bodySm" as="span" tone="subdued">
                    {loading ? 'Loading...' : `${((pagination.current_page - 1) * itemsPerPage) + 1}-${Math.min(
                      pagination.current_page * itemsPerPage,
                      pagination.total
                    )} of ${pagination.total}`}
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
          title="Export tenancy contracts"
          primaryAction={{
            content: 'Export contracts',
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
                  Contracts selected
                </Text>
                <ChoiceList
                  choices={[
                    { label: 'Current page', value: 'current' },
                    { label: 'All contracts', value: 'all' },
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
                  By default, all exports include: tenancy ID, property, tenant, owner, rent amount, payment frequency, start date, end date, status.
                </Text>
                <BlockStack gap="200">
                  <Checkbox
                    label="Property details"
                    checked={includePropertyDetails}
                    onChange={setIncludePropertyDetails}
                  />
                  <Checkbox
                    label="Payment history"
                    checked={includePaymentHistory}
                    onChange={setIncludePaymentHistory}
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
          title="Import tenancy contracts by CSV"
          primaryAction={{
            content: 'Import contracts',
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

export default TenancyContractsPage;

