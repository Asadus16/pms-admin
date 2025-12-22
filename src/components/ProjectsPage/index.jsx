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
} from '@shopify/polaris';
import {
  SearchIcon,
  ProductIcon,
  LayoutColumns3Icon,
  SortIcon,
  ViewIcon,
  HideIcon,
  PlusIcon,
} from '@shopify/polaris-icons';
import './CustomersPage.css';
import { projectsData } from '../../data/projects';

// All available columns for projects
const allColumns = [
  { id: 'projectId', title: 'Project ID', default: true },
  { id: 'projectName', title: 'Project Name', default: true },
  { id: 'developer', title: 'Developer', default: true },
  { id: 'constructionProgress', title: 'Construction Progress', default: true },
  { id: 'community', title: 'Community', default: true },
  { id: 'subCommunity', title: 'Sub Community', default: true },
  { id: 'status', title: 'Status', default: true },
];

// Sort options
const sortOptions = [
  { value: 'dateAdded', label: 'Date added' },
  { value: 'projectName', label: 'Project Name' },
  { value: 'constructionProgress', label: 'Construction Progress' },
  { value: 'status', label: 'Status' },
];

// LocalStorage keys
const STORAGE_KEYS = {
  VISIBLE_COLUMNS: 'projects_visible_columns',
  SORT_BY: 'projects_sort_by',
  SORT_DIRECTION: 'projects_sort_direction',
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
      if (!sanitized.includes('projectId')) {
        sanitized.unshift('projectId');
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

function ProjectsPage() {
  const router = useRouter();
  const pathname = usePathname();

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

  const itemsPerPage = 50;

  const resourceName = {
    singular: 'project',
    plural: 'projects',
  };

  const { selectedResources, allResourcesSelected, handleSelectionChange } =
    useIndexResourceState(projectsData);

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
    if (columnId === 'projectId') return;

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

  // Filter projects based on search
  const filteredProjects = projectsData.filter((project) =>
    project.projectId.toLowerCase().includes(searchValue.toLowerCase()) ||
    project.projectName.toLowerCase().includes(searchValue.toLowerCase()) ||
    project.developer.toLowerCase().includes(searchValue.toLowerCase()) ||
    project.community.toLowerCase().includes(searchValue.toLowerCase()) ||
    project.subCommunity.toLowerCase().includes(searchValue.toLowerCase())
  );

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    if (Number.isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: '2-digit' });
  };

  // Sort projects
  const sortedProjects = [...filteredProjects].sort((a, b) => {
    let comparison = 0;
    switch (selectedSort) {
      case 'constructionProgress':
        comparison = a.constructionProgress - b.constructionProgress;
        break;
      case 'projectName':
        comparison = a.projectName.localeCompare(b.projectName);
        break;
      case 'status':
        comparison = a.status.localeCompare(b.status);
        break;
      case 'dateAdded':
        comparison = new Date(a.dateAdded).getTime() - new Date(b.dateAdded).getTime();
        break;
      default:
        comparison = 0;
    }
    return sortDirection === 'desc' ? -comparison : comparison;
  });

  const totalProjects = projectsData.length;

  // Get current visible columns for normal view
  const currentVisibleColumns = allColumns.filter(col => visibleColumns.includes(col.id));

  // Render cell content based on column id
  const renderCellContent = (project, columnId) => {
    switch (columnId) {
      case 'projectId':
        return (
          <Text variant="bodyMd" fontWeight="semibold" as="span">
            {project.projectId}
          </Text>
        );
      case 'projectName':
        return (
          <Text variant="bodyMd" as="span">
            {project.projectName}
          </Text>
        );
      case 'developer':
        return (
          <Text variant="bodyMd" as="span">
            {project.developer}
          </Text>
        );
      case 'constructionProgress':
        return (
          <div style={{ minWidth: '120px' }}>
            <Text variant="bodyMd" as="span">
              {project.constructionProgress}%
            </Text>
          </div>
        );
      case 'community':
        return (
          <Text variant="bodyMd" as="span">
            {project.community}
          </Text>
        );
      case 'subCommunity':
        return (
          <Text variant="bodyMd" as="span" tone="subdued">
            {project.subCommunity}
          </Text>
        );
      case 'status':
        return (
          <Badge tone={project.status === 'active' ? 'success' : project.status === 'completed' ? 'info' : 'subdued'}>
            {project.status === 'active' ? 'Active' : project.status === 'completed' ? 'Completed' : 'Inactive'}
          </Badge>
        );
      default:
        return null;
    }
  };

  const rowMarkup = sortedProjects.map((project, index) => (
    <IndexTable.Row
      id={project.id}
      key={project.id}
      selected={selectedResources.includes(project.id)}
      position={index}
      onClick={() => router.push(`${basePath}/projects/${project.id}`)}
    >
      {currentVisibleColumns.map((column) => (
        <IndexTable.Cell key={column.id}>
          {renderCellContent(project, column.id)}
        </IndexTable.Cell>
      ))}
    </IndexTable.Row>
  ));

  // Render a single column as a mini table for edit mode
  const renderColumnBlock = (column) => {
    const isVisible = tempVisibleColumns.includes(column.id);
    const isProjectIdColumn = column.id === 'projectId';

    return (
      <div
        key={column.id}
        className={`edit-column-item ${!isVisible ? 'hidden' : ''}`}
      >
        <div className="edit-column-header">
          <Text variant="bodySm" as="span" fontWeight="medium">
            {column.title}
          </Text>
          {!isProjectIdColumn && (
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
          {sortedProjects.slice(0, 10).map((project, index) => (
            <div
              key={project.id}
              className="edit-column-row"
              style={{
                borderBottom: index < 9 ? '1px solid #f1f1f1' : 'none',
              }}
            >
              {renderCellContent(project, column.id)}
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
      accessibilityLabel="Sort projects"
    />
  );

  return (
    <>
      <div className="customers-page-wrapper width-full">
        <Page
          title={
            <InlineStack gap="200" blockAlign="center">
              <Icon source={ProductIcon} />
              <span className="customers-page-title">Projects</span>
            </InlineStack>
          }
          primaryAction={{
            content: 'Add project',
            onAction: () => router.push(`${basePath}/projects/new`),
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
          {/* Project count stats bar */}
          <Box paddingBlockEnd="600" className="customer-stats-box">
            <Card padding="400" className="customer-stats-card">
              <InlineStack gap="200" align="start">
                <Text variant="bodyMd" as="span" fontWeight="semibold">
                  {totalProjects} projects
                </Text>
                <Text variant="bodyMd" as="span" tone="subdued">
                  |
                </Text>
                <Text variant="bodyMd" as="span" tone="subdued">
                  {projectsData.filter(p => p.status === 'active').length} active
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
                    placeholder="Search projects"
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
                  itemCount={sortedProjects.length}
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
                    hasNext={currentPage * itemsPerPage < totalProjects}
                    onNext={() => setCurrentPage(currentPage + 1)}
                  />
                  <Text variant="bodySm" as="span" tone="subdued">
                    {`${(currentPage - 1) * itemsPerPage + 1}-${Math.min(
                      currentPage * itemsPerPage,
                      totalProjects
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
          title="Export projects"
          primaryAction={{
            content: 'Export projects',
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
                  Projects selected
                </Text>
                <ChoiceList
                  choices={[
                    { label: 'Current page', value: 'current' },
                    { label: 'All projects', value: 'all' },
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
                  By default, all exports include: project ID, project name, developer, construction progress, community, sub community, status.
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
          title="Import projects by CSV"
          primaryAction={{
            content: 'Import projects',
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

export default ProjectsPage;

