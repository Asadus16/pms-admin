'use client';

import { useState, useCallback } from 'react';
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
import './styles/CustomersPage.css';

// Developers data for real estate
const developersData = [
  {
    id: '1',
    name: 'Rajesh Kumar',
    email: 'rajesh.kumar@email.com',
    phone: '+91 98765 43210',
    propertiesOwned: 3,
    totalValue: 15000000,
    currency: '₹',
    status: 'active',
    location: 'Mumbai, MH',
    joinDate: 'Jan 15, 2024',
    lastActivity: 'Today at 2:30 pm',
    paymentStatus: 'current',
    ownerType: 'Individual',
  },
  {
    id: '2',
    name: 'Priya Investments Pvt Ltd',
    email: 'contact@priyainvest.com',
    phone: '+91 98123 45678',
    propertiesOwned: 12,
    totalValue: 85000000,
    currency: '₹',
    status: 'active',
    location: 'Bangalore, KA',
    joinDate: 'Mar 22, 2023',
    lastActivity: 'Yesterday at 4:15 pm',
    paymentStatus: 'current',
    ownerType: 'Corporate',
  },
  {
    id: '3',
    name: 'Amit Sharma',
    email: 'amit.sharma@gmail.com',
    phone: '+91 87654 32109',
    propertiesOwned: 1,
    totalValue: 4500000,
    currency: '₹',
    status: 'active',
    location: 'Delhi, DL',
    joinDate: 'Jun 10, 2024',
    lastActivity: 'Dec 8 at 11:20 am',
    paymentStatus: 'pending',
    ownerType: 'Individual',
  },
  {
    id: '4',
    name: 'Sunita Reddy',
    email: 'sunita.reddy@outlook.com',
    phone: '+91 99887 76655',
    propertiesOwned: 2,
    totalValue: 9200000,
    currency: '₹',
    status: 'active',
    location: 'Hyderabad, TG',
    joinDate: 'Aug 5, 2023',
    lastActivity: 'Dec 10 at 9:45 am',
    paymentStatus: 'current',
    ownerType: 'Individual',
  },
  {
    id: '5',
    name: 'Green Valley Realty',
    email: 'info@greenvalley.in',
    phone: '+91 80456 78901',
    propertiesOwned: 8,
    totalValue: 42000000,
    currency: '₹',
    status: 'inactive',
    location: 'Pune, MH',
    joinDate: 'Feb 18, 2022',
    lastActivity: 'Nov 15 at 3:00 pm',
    paymentStatus: 'overdue',
    ownerType: 'Corporate',
  },
  {
    id: '6',
    name: 'Mohammed Ali',
    email: 'mali@email.com',
    phone: '+91 91234 56789',
    propertiesOwned: 4,
    totalValue: 18500000,
    currency: '₹',
    status: 'active',
    location: 'Chennai, TN',
    joinDate: 'Apr 30, 2023',
    lastActivity: 'Today at 10:15 am',
    paymentStatus: 'current',
    ownerType: 'Individual',
  },
  {
    id: '7',
    name: 'Lakshmi Properties',
    email: 'lakshmi.prop@gmail.com',
    phone: '+91 98765 12345',
    propertiesOwned: 6,
    totalValue: 32000000,
    currency: '₹',
    status: 'active',
    location: 'Kolkata, WB',
    joinDate: 'Sep 12, 2022',
    lastActivity: 'Dec 9 at 5:30 pm',
    paymentStatus: 'current',
    ownerType: 'Corporate',
  },
  {
    id: '8',
    name: 'Vikram Singh',
    email: 'vikram.singh@yahoo.com',
    phone: '+91 88776 65544',
    propertiesOwned: 2,
    totalValue: 11000000,
    currency: '₹',
    status: 'active',
    location: 'Jaipur, RJ',
    joinDate: 'Nov 8, 2023',
    lastActivity: 'Dec 11 at 1:20 pm',
    paymentStatus: 'pending',
    ownerType: 'Individual',
  },
  {
    id: '9',
    name: 'Meera Developers',
    email: 'contact@meeradev.com',
    phone: '+91 77665 54433',
    propertiesOwned: 15,
    totalValue: 95000000,
    currency: '₹',
    status: 'active',
    location: 'Ahmedabad, GJ',
    joinDate: 'Jan 5, 2021',
    lastActivity: 'Today at 8:45 am',
    paymentStatus: 'current',
    ownerType: 'Corporate',
  },
  {
    id: '10',
    name: 'Anita Desai',
    email: 'anita.desai@hotmail.com',
    phone: '+91 99001 22334',
    propertiesOwned: 1,
    totalValue: 3800000,
    currency: '₹',
    status: 'inactive',
    location: 'Surat, GJ',
    joinDate: 'Jul 20, 2024',
    lastActivity: 'Oct 30 at 2:00 pm',
    paymentStatus: 'overdue',
    ownerType: 'Individual',
  },
];

// All available columns for developers
const allColumns = [
  { id: 'name', title: 'Developer Name', default: true },
  { id: 'ownerType', title: 'Type', default: true },
  { id: 'propertiesOwned', title: 'Projects', default: true },
  { id: 'totalValue', title: 'Total Value', default: true, alignment: 'end' },
  { id: 'status', title: 'Status', default: true },
  { id: 'paymentStatus', title: 'Payment Status', default: true },
  { id: 'location', title: 'Location', default: false },
  { id: 'email', title: 'Email', default: false },
  { id: 'phone', title: 'Phone', default: false },
  { id: 'joinDate', title: 'Join Date', default: false },
  { id: 'lastActivity', title: 'Last Activity', default: false },
];

// Sort options
const sortOptions = [
  { value: 'lastActivity', label: 'Last activity' },
  { value: 'totalValue', label: 'Total value' },
  { value: 'propertiesOwned', label: 'Projects count' },
  { value: 'joinDate', label: 'Join date' },
  { value: 'name', label: 'Name' },
];

// LocalStorage keys
const STORAGE_KEYS = {
  VISIBLE_COLUMNS: 'developers_visible_columns',
  SORT_BY: 'developers_sort_by',
  SORT_DIRECTION: 'developers_sort_direction',
};

// Helper functions for localStorage
const getStoredColumns = () => {
  if (typeof window === 'undefined') return null;
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.VISIBLE_COLUMNS);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (!parsed.includes('name')) {
        parsed.unshift('name');
      }
      return parsed;
    }
  } catch (e) {
    console.error('Error reading from localStorage:', e);
  }
  return null;
};

const getStoredSort = () => {
  if (typeof window === 'undefined') {
    return { sortBy: 'lastActivity', sortDirection: 'desc' };
  }
  try {
    const sortBy = localStorage.getItem(STORAGE_KEYS.SORT_BY);
    const sortDir = localStorage.getItem(STORAGE_KEYS.SORT_DIRECTION);
    return {
      sortBy: sortBy || 'lastActivity',
      sortDirection: sortDir || 'desc',
    };
  } catch (e) {
    console.error('Error reading from localStorage:', e);
  }
  return { sortBy: 'lastActivity', sortDirection: 'desc' };
};

function PropertyOwnersPage() {
  const router = useRouter();
  const pathname = usePathname();

  // Get the base path (userType) from the current pathname
  const basePath = pathname.split('/')[1] ? `/${pathname.split('/')[1]}` : '/property-developer';

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

  // Initialize sort from localStorage
  const storedSort = getStoredSort();
  const [selectedSort, setSelectedSort] = useState(storedSort.sortBy);
  const [sortDirection, setSortDirection] = useState(storedSort.sortDirection);

  // Default visible columns
  const defaultColumns = allColumns.filter(col => col.default).map(col => col.id);

  // Initialize visible columns from localStorage or use defaults
  const [visibleColumns, setVisibleColumns] = useState(() => {
    const stored = getStoredColumns();
    return stored || defaultColumns;
  });
  const [tempVisibleColumns, setTempVisibleColumns] = useState(() => {
    const stored = getStoredColumns();
    return stored || defaultColumns;
  });

  const itemsPerPage = 50;

  const resourceName = {
    singular: 'developer',
    plural: 'developers',
  };

  const { selectedResources, allResourcesSelected, handleSelectionChange } =
    useIndexResourceState(developersData);

  const handleSearchChange = useCallback((value) => {
    setSearchValue(value);
  }, []);

  const handleSearchClear = useCallback(() => {
    setSearchValue('');
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

  // Filter developers based on search
  const filteredDevelopers = developersData.filter((developer) =>
    developer.name.toLowerCase().includes(searchValue.toLowerCase()) ||
    developer.email.toLowerCase().includes(searchValue.toLowerCase()) ||
    developer.location.toLowerCase().includes(searchValue.toLowerCase())
  );

  // Sort developers
  const sortedDevelopers = [...filteredDevelopers].sort((a, b) => {
    let comparison = 0;
    switch (selectedSort) {
      case 'totalValue':
        comparison = a.totalValue - b.totalValue;
        break;
      case 'propertiesOwned':
        comparison = a.propertiesOwned - b.propertiesOwned;
        break;
      case 'name':
        comparison = a.name.localeCompare(b.name);
        break;
      default:
        comparison = 0;
    }
    return sortDirection === 'desc' ? -comparison : comparison;
  });

  const totalDevelopers = developersData.length;

  const formatCurrency = (amount, currency) => {
    if (amount >= 10000000) {
      return `${currency}${(amount / 10000000).toFixed(2)} Cr`;
    } else if (amount >= 100000) {
      return `${currency}${(amount / 100000).toFixed(2)} L`;
    }
    return `${currency}${amount.toLocaleString('en-IN')}`;
  };

  // Get current visible columns for normal view
  const currentVisibleColumns = allColumns.filter(col => visibleColumns.includes(col.id));

  // Render cell content based on column id
  const renderCellContent = (developer, columnId) => {
    switch (columnId) {
      case 'name':
        return (
          <Text variant="bodyMd" fontWeight="semibold" as="span">
            {developer.name}
          </Text>
        );
      case 'ownerType':
        return (
          <Badge tone={developer.ownerType === 'Corporate' ? 'info' : 'default'}>
            {developer.ownerType}
          </Badge>
        );
      case 'propertiesOwned':
        return (
          <Text variant="bodyMd" as="span">
            {developer.propertiesOwned} {developer.propertiesOwned === 1 ? 'project' : 'projects'}
          </Text>
        );
      case 'totalValue':
        return (
          <Text variant="bodyMd" as="span">
            {formatCurrency(developer.totalValue, developer.currency)}
          </Text>
        );
      case 'status':
        return (
          <Badge tone={developer.status === 'active' ? 'success' : 'subdued'}>
            {developer.status === 'active' ? 'Active' : 'Inactive'}
          </Badge>
        );
      case 'paymentStatus':
        return (
          <Badge
            tone={
              developer.paymentStatus === 'current'
                ? 'success'
                : developer.paymentStatus === 'pending'
                ? 'warning'
                : 'critical'
            }
          >
            {developer.paymentStatus === 'current'
              ? 'Current'
              : developer.paymentStatus === 'pending'
              ? 'Pending'
              : 'Overdue'}
          </Badge>
        );
      case 'location':
        return (
          <Text variant="bodyMd" as="span" tone="subdued">
            {developer.location}
          </Text>
        );
      case 'email':
        return (
          <Text variant="bodyMd" as="span" tone="subdued">
            {developer.email}
          </Text>
        );
      case 'phone':
        return (
          <Text variant="bodyMd" as="span" tone="subdued">
            {developer.phone}
          </Text>
        );
      case 'joinDate':
        return (
          <Text variant="bodyMd" as="span" tone="subdued">
            {developer.joinDate}
          </Text>
        );
      case 'lastActivity':
        return (
          <Text variant="bodyMd" as="span" tone="subdued">
            {developer.lastActivity}
          </Text>
        );
      default:
        return null;
    }
  };

  const rowMarkup = sortedDevelopers.map((developer, index) => (
    <IndexTable.Row
      id={developer.id}
      key={developer.id}
      selected={selectedResources.includes(developer.id)}
      position={index}
    >
      {currentVisibleColumns.map((column) => (
        <IndexTable.Cell key={column.id}>
          {renderCellContent(developer, column.id)}
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
          {sortedDevelopers.slice(0, 10).map((developer, index) => (
            <div
              key={developer.id}
              className="edit-column-row"
              style={{
                borderBottom: index < 9 ? '1px solid #f1f1f1' : 'none',
              }}
            >
              {renderCellContent(developer, column.id)}
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
      accessibilityLabel="Sort developers"
    />
  );

  return (
    <>
      <div className="customers-page-wrapper width-full">
        <Page
          title={
            <InlineStack gap="200" blockAlign="center">
              <Icon source={PersonIcon} />
              <span className="customers-page-title">Developers</span>
            </InlineStack>
          }
          primaryAction={{
            content: 'Add developer',
            onAction: () => router.push(`${basePath}/developers/new`),
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
          {/* Developer count stats bar */}
          <Box paddingBlockEnd="600" className="customer-stats-box">
            <Card padding="400" className="customer-stats-card">
              <InlineStack gap="200" align="start">
                <Text variant="bodyMd" as="span" fontWeight="semibold">
                  {totalDevelopers} developers
                </Text>
                <Text variant="bodyMd" as="span" tone="subdued">
                  |
                </Text>
                <Text variant="bodyMd" as="span" tone="subdued">
                  {developersData.filter(d => d.status === 'active').length} active
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
                    placeholder="Search developers"
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
            ) : (
              <div className="table-scroll-container">
                <IndexTable
                  resourceName={resourceName}
                  itemCount={sortedDevelopers.length}
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
            {!editColumnsMode && (
              <Box padding="400" borderBlockStartWidth="025" borderColor="border">
                <InlineStack align="space-between" blockAlign="center">
                  <Pagination
                    hasPrevious={currentPage > 1}
                    onPrevious={() => setCurrentPage(currentPage - 1)}
                    hasNext={currentPage * itemsPerPage < totalDevelopers}
                    onNext={() => setCurrentPage(currentPage + 1)}
                  />
                  <Text variant="bodySm" as="span" tone="subdued">
                    {`${(currentPage - 1) * itemsPerPage + 1}-${Math.min(
                      currentPage * itemsPerPage,
                      totalDevelopers
                    )}`}
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
          title="Export developers"
          primaryAction={{
            content: 'Export developers',
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
                  Developers selected
                </Text>
                <ChoiceList
                  choices={[
                    { label: 'Current page', value: 'current' },
                    { label: 'All developers', value: 'all' },
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
                  By default, all exports include: name, contact info, projects count, total value, status.
                </Text>
                <BlockStack gap="200">
                  <Checkbox
                    label="Project details"
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
          title="Import developers by CSV"
          primaryAction={{
            content: 'Import developers',
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

export default PropertyOwnersPage;
