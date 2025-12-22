'use client';

import { useState, useCallback, useEffect, useMemo } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
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
import './ContactsPage.css';
import { fetchPropertyManagerContacts } from '@/store/thunks/property-manager/propertyManagerThunks';
import {
  selectContacts,
  selectContactsLoading,
  selectContactsError,
  selectContactsPagination,
} from '@/store/slices/property-manager/contacts/slice';

// All available columns for contacts
const allColumns = [
  { id: 'contact_id', title: 'Contact ID', default: true },
  { id: 'contact_type', title: 'Contact Type', default: true },
  { id: 'full_name', title: 'Full Name', default: true },
  { id: 'email', title: 'Email', default: true },
  { id: 'phone', title: 'Phone', default: true },
  { id: 'status', title: 'Status', default: true },
];

// Sort options
const sortOptions = [
  { value: 'created_at', label: 'Date added' },
  { value: 'full_name', label: 'Full Name' },
  { value: 'contact_type', label: 'Contact Type' },
  { value: 'status', label: 'Status' },
];

// LocalStorage keys
const STORAGE_KEYS = {
  VISIBLE_COLUMNS: 'contacts_visible_columns',
  SORT_BY: 'contacts_sort_by',
  SORT_DIRECTION: 'contacts_sort_direction',
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
      if (!sanitized.includes('contact_id')) {
        sanitized.unshift('contact_id');
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

// Contact type labels
const contactTypeLabels = {
  individual: 'Individual',
  company: 'Company',
  broker: 'Broker',
  agent: 'Agent',
};

function ContactsPage() {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch();

  // Redux selectors
  const contacts = useSelector(selectContacts);
  const isLoading = useSelector(selectContactsLoading);
  const error = useSelector(selectContactsError);
  const pagination = useSelector(selectContactsPagination);

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
  const [includeContactDetails, setIncludeContactDetails] = useState(true);
  const [includeActivityHistory, setIncludeActivityHistory] = useState(true);

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

  // Fetch contacts from API
  useEffect(() => {
    dispatch(fetchPropertyManagerContacts({
      page: currentPage,
      per_page: 50,
      search: searchValue || undefined,
      sort_by: selectedSort,
      sort_direction: sortDirection,
    }));
  }, [dispatch, currentPage, searchValue, selectedSort, sortDirection]);

  const itemsPerPage = 50;

  const resourceName = {
    singular: 'contact',
    plural: 'contacts',
  };

  // Memoize contacts for IndexTable
  const contactsList = useMemo(() => contacts || [], [contacts]);

  const { selectedResources, allResourcesSelected, handleSelectionChange } =
    useIndexResourceState(contactsList);

  const handleSearchChange = useCallback((value) => {
    setSearchValue(value);
    setCurrentPage(1); // Reset to first page on search
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
    if (columnId === 'contact_id') return;

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
    setCurrentPage(1);
    try {
      localStorage.setItem(STORAGE_KEYS.SORT_BY, value[0]);
    } catch (e) {
      console.error('Error saving to localStorage:', e);
    }
  }, []);

  const handleSortDirectionChange = useCallback((value) => {
    setSortDirection(value[0]);
    setCurrentPage(1);
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
      includeContactDetails,
      includeActivityHistory
    });
    setExportModalOpen(false);
  }, [exportOption, exportFormat, includeContactDetails, includeActivityHistory]);

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

  const totalContacts = pagination.totalItems;
  const activeContacts = useMemo(() =>
    contactsList.filter(c => c.status === 'active').length,
    [contactsList]
  );

  // Get current visible columns for normal view
  const currentVisibleColumns = allColumns.filter(col => visibleColumns.includes(col.id));

  // Render cell content based on column id
  const renderCellContent = (contact, columnId) => {
    switch (columnId) {
      case 'contact_id':
        return (
          <Text variant="bodyMd" fontWeight="semibold" as="span">
            {contact.contact_id || `CON-${String(contact.id).padStart(4, '0')}`}
          </Text>
        );
      case 'contact_type':
        return (
          <Text variant="bodyMd" as="span">
            {contactTypeLabels[contact.contact_type] || contact.contact_type}
          </Text>
        );
      case 'full_name':
        return (
          <Text variant="bodyMd" as="span">
            {contact.full_name}
          </Text>
        );
      case 'email':
        return (
          <Text variant="bodyMd" as="span" tone="subdued">
            {contact.email}
          </Text>
        );
      case 'phone':
        return (
          <Text variant="bodyMd" as="span" tone="subdued">
            {contact.phone}
          </Text>
        );
      case 'status':
        return (
          <Badge tone={contact.status === 'active' ? 'success' : 'subdued'}>
            {contact.status === 'active' ? 'Active' : 'Inactive'}
          </Badge>
        );
      default:
        return null;
    }
  };

  const rowMarkup = contactsList.map((contact, index) => (
    <IndexTable.Row
      id={String(contact.id)}
      key={contact.id}
      selected={selectedResources.includes(String(contact.id))}
      position={index}
      onClick={() => router.push(`${basePath}/contacts/${contact.id}`)}
    >
      {currentVisibleColumns.map((column) => (
        <IndexTable.Cell key={column.id}>
          {renderCellContent(contact, column.id)}
        </IndexTable.Cell>
      ))}
    </IndexTable.Row>
  ));

  // Render a single column as a mini table for edit mode
  const renderColumnBlock = (column) => {
    const isVisible = tempVisibleColumns.includes(column.id);
    const isContactIdColumn = column.id === 'contact_id';

    return (
      <div
        key={column.id}
        className={`edit-column-item ${!isVisible ? 'hidden' : ''}`}
      >
        <div className="edit-column-header">
          <Text variant="bodySm" as="span" fontWeight="medium">
            {column.title}
          </Text>
          {!isContactIdColumn && (
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
          {contactsList.slice(0, 10).map((contact, index) => (
            <div
              key={contact.id}
              className="edit-column-row"
              style={{
                borderBottom: index < 9 ? '1px solid #f1f1f1' : 'none',
              }}
            >
              {renderCellContent(contact, column.id)}
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
      accessibilityLabel="Sort contacts"
    />
  );

  return (
    <>
      <div className="contacts-page-wrapper width-full">
        <Page
          title={
            <InlineStack gap="200" blockAlign="center">
              <Icon source={PersonIcon} />
              <span className="contacts-page-title">List of Contact</span>
            </InlineStack>
          }
          primaryAction={{
            content: 'Add contact',
            onAction: () => router.push(`${basePath}/contacts/new`),
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

          {/* Contact count stats bar */}
          <Box paddingBlockEnd="600" className="contact-stats-box">
            <Card padding="400" className="contact-stats-card">
              <InlineStack gap="200" align="start">
                <Text variant="bodyMd" as="span" fontWeight="semibold">
                  {totalContacts} contacts
                </Text>
                <Text variant="bodyMd" as="span" tone="subdued">
                  |
                </Text>
                <Text variant="bodyMd" as="span" tone="subdued">
                  {activeContacts} active
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
                    placeholder="Search contacts"
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
                <InlineStack align="center">
                  <Spinner accessibilityLabel="Loading contacts" size="large" />
                </InlineStack>
              </Box>
            ) : editColumnsMode ? (
              <div className="edit-columns-container">
                {allColumns.map((column) => renderColumnBlock(column))}
              </div>
            ) : (
              <div className="table-scroll-container">
                <IndexTable
                  resourceName={resourceName}
                  itemCount={contactsList.length}
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
            {!editColumnsMode && !isLoading && (
              <Box padding="400" borderBlockStartWidth="025" borderColor="border">
                <InlineStack align="space-between" blockAlign="center">
                  <Pagination
                    hasPrevious={currentPage > 1}
                    onPrevious={() => setCurrentPage(currentPage - 1)}
                    hasNext={currentPage < pagination.totalPages}
                    onNext={() => setCurrentPage(currentPage + 1)}
                  />
                  <Text variant="bodySm" as="span" tone="subdued">
                    {totalContacts > 0
                      ? `${(currentPage - 1) * itemsPerPage + 1}-${Math.min(
                          currentPage * itemsPerPage,
                          totalContacts
                        )} of ${totalContacts}`
                      : '0 contacts'
                    }
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
          title="Export contacts"
          primaryAction={{
            content: 'Export contacts',
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
                  Contacts selected
                </Text>
                <ChoiceList
                  choices={[
                    { label: 'Current page', value: 'current' },
                    { label: 'All contacts', value: 'all' },
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
                  By default, all exports include: contact ID, type, name, email, phone, status.
                </Text>
                <BlockStack gap="200">
                  <Checkbox
                    label="Contact details"
                    checked={includeContactDetails}
                    onChange={setIncludeContactDetails}
                  />
                  <Checkbox
                    label="Activity history"
                    checked={includeActivityHistory}
                    onChange={setIncludeActivityHistory}
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
          title="Import contacts by CSV"
          primaryAction={{
            content: 'Import contacts',
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

export default ContactsPage;
