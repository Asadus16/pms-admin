'use client';

import { useState, useCallback, useEffect, useMemo } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import {
  Page,
  Card,
  IndexTable,
  Text,
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
  Spinner,
} from '@shopify/polaris';
import {
  SearchIcon,
  ChartVerticalFilledIcon,
  LayoutColumns3Icon,
  SortIcon,
  ViewIcon,
  HideIcon,
} from '@shopify/polaris-icons';
import { useAppDispatch, useAppSelector } from '@/store';
import { fetchPropertyManagerPropertyView } from '@/store/thunks';
import {
  selectReportsProperties,
  selectReportsLoadingProperties,
} from '@/store/slices/property-manager';
import '../PropertyOwnersPage/CustomersPage.css';

// All available columns for properties
const allColumns = [
  { id: 'propertyId', title: 'ID', default: true },
  { id: 'property', title: 'Property', default: true },
  { id: 'totalIncome', title: 'Total Income', default: true },
  { id: 'totalExpense', title: 'Total Expense', default: true },
  { id: 'pendingDues', title: 'Pending Dues', default: true },
  { id: 'netIncome', title: 'Net Income', default: true },
];

// Sort options
const sortOptions = [
  { value: 'property', label: 'Property name' },
  { value: 'totalIncome', label: 'Total Income' },
  { value: 'totalExpense', label: 'Total Expense' },
  { value: 'netIncome', label: 'Net Income' },
];

// LocalStorage keys
const STORAGE_KEYS = {
  VISIBLE_COLUMNS: 'reports_visible_columns',
  SORT_BY: 'reports_sort_by',
  SORT_DIRECTION: 'reports_sort_direction',
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
      if (!sanitized.includes('property')) {
        sanitized.unshift('property');
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
    return { sortBy: 'property', sortDirection: 'asc' };
  }
  try {
    const sortBy = localStorage.getItem(STORAGE_KEYS.SORT_BY);
    const sortDir = localStorage.getItem(STORAGE_KEYS.SORT_DIRECTION);
    const allowed = new Set(sortOptions.map((o) => o.value));
    return {
      sortBy: sortBy && allowed.has(sortBy) ? sortBy : 'property',
      sortDirection: sortDir === 'asc' || sortDir === 'desc' ? sortDir : 'asc',
    };
  } catch (e) {
    console.error('Error reading from localStorage:', e);
  }
  return { sortBy: 'property', sortDirection: 'asc' };
};

function ReportsPage() {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useAppDispatch();

  // Redux selectors
  const propertiesFromApi = useAppSelector(selectReportsProperties);
  const isLoading = useAppSelector(selectReportsLoadingProperties);

  // Get the base path from the current pathname
  const basePath = pathname.split('/')[1] ? `/${pathname.split('/')[1]}` : '/property-manager';

  const [searchValue, setSearchValue] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortPopoverActive, setSortPopoverActive] = useState(false);
  const [editColumnsMode, setEditColumnsMode] = useState(false);
  const itemsPerPage = 50;

  // Default visible columns
  const defaultColumns = allColumns.filter(col => col.default).map(col => col.id);

  // Initialize state with defaults
  const [selectedSort, setSelectedSort] = useState('property');
  const [sortDirection, setSortDirection] = useState('asc');
  const [visibleColumns, setVisibleColumns] = useState(defaultColumns);
  const [tempVisibleColumns, setTempVisibleColumns] = useState(defaultColumns);

  // Fetch properties on mount
  useEffect(() => {
    dispatch(fetchPropertyManagerPropertyView());
  }, [dispatch]);

  // Load from localStorage on client-side only
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

  // Transform API data to match our expected format
  const propertiesData = useMemo(() => {
    if (!Array.isArray(propertiesFromApi)) return [];
    return propertiesFromApi.map((p) => ({
      id: p.id,
      propertyId: p.property_id || `#${p.id}`,
      property: p.property_name || `Property #${p.id}`,
      totalIncome: parseFloat(p.income) || parseFloat(p.total_income) || 0,
      totalExpense: parseFloat(p.expense) || parseFloat(p.total_expense) || 0,
      pendingDues: parseFloat(p.pending_dues) || 0,
      netIncome: parseFloat(p.net_income) || (parseFloat(p.income) || 0) - (parseFloat(p.expense) || 0),
      currency: 'AED',
      status: p.status,
    }));
  }, [propertiesFromApi]);

  // Filter and sort properties
  const filteredProperties = useMemo(() => {
    let result = propertiesData.filter((property) =>
      property.property.toLowerCase().includes(searchValue.toLowerCase()) ||
      property.propertyId.toLowerCase().includes(searchValue.toLowerCase())
    );

    // Sort
    result.sort((a, b) => {
      let aVal = a[selectedSort];
      let bVal = b[selectedSort];

      if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase();
        bVal = bVal.toLowerCase();
      }

      if (sortDirection === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });

    return result;
  }, [propertiesData, searchValue, selectedSort, sortDirection]);

  const resourceName = {
    singular: 'property',
    plural: 'properties',
  };

  const { selectedResources, allResourcesSelected, handleSelectionChange } =
    useIndexResourceState(filteredProperties);

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
    if (columnId === 'property') return;

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

  // Get current visible columns for normal view
  const currentVisibleColumns = allColumns.filter(col => visibleColumns.includes(col.id));

  // Render cell content based on column id
  const renderCellContent = (property, columnId) => {
    switch (columnId) {
      case 'propertyId':
        return (
          <Text variant="bodyMd" fontWeight="semibold" as="span">
            {property.propertyId}
          </Text>
        );
      case 'property':
        return (
          <Text variant="bodyMd" as="span">
            {property.property}
          </Text>
        );
      case 'totalIncome':
        return (
          <Text variant="bodyMd" as="span">
            {property.currency} {Number(property.totalIncome).toLocaleString()}
          </Text>
        );
      case 'totalExpense':
        return (
          <Text variant="bodyMd" as="span">
            {property.currency} {Number(property.totalExpense).toLocaleString()}
          </Text>
        );
      case 'pendingDues':
        return (
          <Text variant="bodyMd" as="span">
            {property.currency} {Number(property.pendingDues).toLocaleString()}
          </Text>
        );
      case 'netIncome':
        return (
          <Text variant="bodyMd" as="span">
            {property.currency} {Number(property.netIncome).toLocaleString()}
          </Text>
        );
      default:
        return null;
    }
  };

  const rowMarkup = filteredProperties.map((property, index) => (
    <IndexTable.Row
      id={String(property.id)}
      key={property.id}
      selected={selectedResources.includes(String(property.id))}
      position={index}
      onClick={() => router.push(`${basePath}/reports/${property.id}`)}
    >
      {currentVisibleColumns.map((column) => (
        <IndexTable.Cell key={column.id}>
          {renderCellContent(property, column.id)}
        </IndexTable.Cell>
      ))}
    </IndexTable.Row>
  ));

  // Render a single column as a mini table for edit mode
  const renderColumnBlock = (column) => {
    const isVisible = tempVisibleColumns.includes(column.id);
    const isPropertyColumn = column.id === 'property';

    return (
      <div
        key={column.id}
        className={`edit-column-item ${!isVisible ? 'hidden' : ''}`}
      >
        <div className="edit-column-header">
          <Text variant="bodySm" as="span" fontWeight="medium">
            {column.title}
          </Text>
          {!isPropertyColumn && (
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
          {filteredProperties.slice(0, 10).map((property, index) => (
            <div
              key={property.id}
              className="edit-column-row"
              style={{
                borderBottom: index < 9 ? '1px solid #f1f1f1' : 'none',
              }}
            >
              {renderCellContent(property, column.id)}
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
      accessibilityLabel="Sort properties"
    />
  );

  return (
    <div className="customers-page-wrapper width-full">
      <Page
        title={
          <InlineStack gap="200" blockAlign="center">
            <Icon source={ChartVerticalFilledIcon} />
            <span className="customers-page-title">Reports</span>
          </InlineStack>
        }
        secondaryActions={[
          {
            content: 'Export',
            onAction: () => console.log('Export'),
          },
        ]}
      >
        {/* Property count stats bar */}
        <Box paddingBlockEnd="600" className="customer-stats-box">
          <Card padding="400" className="customer-stats-card">
            <InlineStack gap="200" align="start">
              <Text variant="bodyMd" as="span" fontWeight="semibold">
                {filteredProperties.length} properties
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
                  placeholder="Search properties"
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

          {/* Table content */}
          {isLoading ? (
            <Box padding="800">
              <InlineStack align="center" blockAlign="center">
                <Spinner size="large" />
              </InlineStack>
            </Box>
          ) : editColumnsMode ? (
            <div className="edit-columns-container">
              {allColumns.map((column) => renderColumnBlock(column))}
            </div>
          ) : filteredProperties.length === 0 ? (
            <Box padding="1000">
              <BlockStack gap="400" inlineAlign="center">
                <Text variant="headingMd" as="h3">
                  No properties found
                </Text>
                <Text variant="bodyMd" as="p" tone="subdued">
                  {searchValue ? 'Try adjusting your search terms' : 'No properties available'}
                </Text>
              </BlockStack>
            </Box>
          ) : (
            <div className="table-scroll-container">
              <IndexTable
                resourceName={resourceName}
                itemCount={filteredProperties.length}
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
          {!editColumnsMode && !isLoading && filteredProperties.length > 0 && (
            <Box padding="400" borderBlockStartWidth="025" borderColor="border">
              <InlineStack align="space-between" blockAlign="center">
                <Pagination
                  hasPrevious={currentPage > 1}
                  onPrevious={() => setCurrentPage(currentPage - 1)}
                  hasNext={currentPage * itemsPerPage < filteredProperties.length}
                  onNext={() => setCurrentPage(currentPage + 1)}
                />
                <Text variant="bodySm" as="span" tone="subdued">
                  {filteredProperties.length} row(s) total.
                </Text>
              </InlineStack>
            </Box>
          )}
        </Card>
      </Page>
    </div>
  );
}

export default ReportsPage;
