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
  ActionList,
  Badge,
  Spinner,
  Divider,
} from '@shopify/polaris';
import {
  SearchIcon,
  ChartVerticalFilledIcon,
  ArrowLeftIcon,
  CalendarIcon,
  ChevronDownIcon,
} from '@shopify/polaris-icons';
import { useAppDispatch, useAppSelector } from '@/store';
import {
  fetchPropertyManagerDashboardProperty,
  fetchPropertyManagerBookings,
  fetchPropertyManagerTransactions,
  fetchPropertyManagerInventories,
} from '@/store/thunks';
import {
  selectReportsCurrentProperty,
  selectReportsBookings,
  selectReportsExpenses,
  selectReportsInventory,
  selectReportsLedger,
  selectReportsLoadingProperty,
  selectReportsLoadingBookings,
  selectReportsLoadingExpenses,
  selectReportsLoadingInventory,
  selectReportsLoadingLedger,
  selectReportsBookingsPagination,
  selectReportsExpensesPagination,
  selectReportsInventoryPagination,
  selectReportsLedgerPagination,
  clearReportsCurrentProperty,
} from '@/store/slices/property-manager';
import StatCard from '@/components/Analytics/cards/StatCard';
import '../PropertyOwnersPage/CustomersPage.css';

// Report type options
const reportTypes = [
  { id: 'bookings', label: 'Bookings' },
  { id: 'expenses', label: 'Expenses' },
  { id: 'inventory', label: 'Inventory' },
  { id: 'owner', label: 'Owner' },
  { id: 'ledger', label: 'Ledger' },
];

// Date range options
const dateRangeOptions = [
  { label: 'Today', value: 'today' },
  { label: 'Last 7 days', value: '7days' },
  { label: 'Last 30 days', value: '30days' },
  { label: 'This month', value: 'thisMonth' },
  { label: 'Last month', value: 'lastMonth' },
  { label: 'This year', value: 'thisYear' },
  { label: 'All time', value: 'all' },
];

function PropertyReportsPage({ propertyId }) {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useAppDispatch();

  const basePath = useMemo(() => {
    const seg = pathname?.split('/')?.[1];
    return seg ? `/${seg}` : '/property-manager';
  }, [pathname]);

  // State
  const [selectedReportType, setSelectedReportType] = useState('bookings');
  const [reportTypePopoverActive, setReportTypePopoverActive] = useState(false);
  const [dateRangePopoverActive, setDateRangePopoverActive] = useState(false);
  const [selectedDateRange, setSelectedDateRange] = useState('all');
  const [searchValue, setSearchValue] = useState('');

  // Redux selectors
  const property = useAppSelector(selectReportsCurrentProperty);
  const bookings = useAppSelector(selectReportsBookings);
  const expenses = useAppSelector(selectReportsExpenses);
  const inventory = useAppSelector(selectReportsInventory);
  const ledger = useAppSelector(selectReportsLedger);
  const loadingProperty = useAppSelector(selectReportsLoadingProperty);
  const loadingBookings = useAppSelector(selectReportsLoadingBookings);
  const loadingExpenses = useAppSelector(selectReportsLoadingExpenses);
  const loadingInventory = useAppSelector(selectReportsLoadingInventory);
  const loadingLedger = useAppSelector(selectReportsLoadingLedger);
  const bookingsPagination = useAppSelector(selectReportsBookingsPagination);
  const expensesPagination = useAppSelector(selectReportsExpensesPagination);
  const inventoryPagination = useAppSelector(selectReportsInventoryPagination);
  const ledgerPagination = useAppSelector(selectReportsLedgerPagination);

  // Fetch property data on mount
  useEffect(() => {
    if (propertyId) {
      dispatch(fetchPropertyManagerDashboardProperty(propertyId));
    }

    return () => {
      dispatch(clearReportsCurrentProperty());
    };
  }, [propertyId, dispatch]);

  // Fetch data based on selected report type
  useEffect(() => {
    if (!propertyId) return;

    switch (selectedReportType) {
      case 'bookings':
        dispatch(fetchPropertyManagerBookings({ property_id: propertyId }));
        break;
      case 'expenses':
        dispatch(fetchPropertyManagerTransactions({ property_id: propertyId, type: 'expense' }));
        break;
      case 'inventory':
        dispatch(fetchPropertyManagerInventories({ property_id: propertyId }));
        break;
      case 'ledger':
        dispatch(fetchPropertyManagerTransactions({ property_id: propertyId }));
        break;
      default:
        break;
    }
  }, [propertyId, selectedReportType, dispatch]);

  const handleBack = useCallback(() => {
    router.push(`${basePath}/reports`);
  }, [router, basePath]);

  const toggleReportTypePopover = useCallback(() => {
    setReportTypePopoverActive((active) => !active);
  }, []);

  const toggleDateRangePopover = useCallback(() => {
    setDateRangePopoverActive((active) => !active);
  }, []);

  const handleReportTypeChange = useCallback((type) => {
    setSelectedReportType(type);
    setReportTypePopoverActive(false);
    setSearchValue('');
  }, []);

  const handleDateRangeChange = useCallback((range) => {
    setSelectedDateRange(range);
    setDateRangePopoverActive(false);
  }, []);

  const handleSearchChange = useCallback((value) => {
    setSearchValue(value);
  }, []);

  const selectedReportLabel = reportTypes.find(r => r.id === selectedReportType)?.label || 'Bookings';
  const selectedDateRangeLabel = dateRangeOptions.find(d => d.value === selectedDateRange)?.label || 'All time';

  // Get current data based on report type
  const getCurrentData = () => {
    switch (selectedReportType) {
      case 'bookings':
        return bookings;
      case 'expenses':
        return expenses;
      case 'inventory':
        return inventory;
      case 'ledger':
        return ledger;
      default:
        return [];
    }
  };

  const isLoading = () => {
    switch (selectedReportType) {
      case 'bookings':
        return loadingBookings;
      case 'expenses':
        return loadingExpenses;
      case 'inventory':
        return loadingInventory;
      case 'ledger':
        return loadingLedger;
      default:
        return false;
    }
  };

  // Format currency
  const formatCurrency = (amount, currency = 'AED') => {
    return `${currency} ${Number(amount || 0).toLocaleString()}`;
  };

  // Format date
  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    const d = new Date(dateStr);
    if (Number.isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' });
  };

  // Get status badge
  const getStatusBadge = (status) => {
    const statusMap = {
      completed: { tone: 'success', label: 'Completed' },
      confirmed: { tone: 'success', label: 'Confirmed' },
      paid: { tone: 'success', label: 'Paid' },
      pending: { tone: 'attention', label: 'Pending' },
      upcoming: { tone: 'info', label: 'Upcoming' },
      cancelled: { tone: 'critical', label: 'Cancelled' },
      overdue: { tone: 'critical', label: 'Overdue' },
      good: { tone: 'success', label: 'Good' },
      fair: { tone: 'attention', label: 'Fair' },
      poor: { tone: 'critical', label: 'Poor' },
    };
    const config = statusMap[status?.toLowerCase()] || { tone: 'subdued', label: status || 'Unknown' };
    return <Badge tone={config.tone}>{config.label}</Badge>;
  };

  // Helper to convert trend to changeType
  const trendToChangeType = (trend, isExpense = false) => {
    if (trend === 'up') return isExpense ? 'critical' : 'positive';
    if (trend === 'down') return isExpense ? 'positive' : 'critical';
    return 'neutral';
  };

  // Get metrics based on property data (now using dynamic data from API)
  const getMetrics = () => {
    if (!property) return [];

    const metrics = property.metrics || {};
    const bookingsMetrics = metrics.bookings || {};
    const expensesMetrics = metrics.expenses || {};
    const inventoryMetrics = metrics.inventory || {};
    const ledgerMetrics = metrics.ledger || {};

    // Fallback sparkline data if API doesn't return any
    const defaultSparkline = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

    switch (selectedReportType) {
      case 'bookings':
        return [
          {
            title: 'Total Income',
            value: formatCurrency(bookingsMetrics.total_income || 0),
            change: bookingsMetrics.total_income_change || '0%',
            changeType: trendToChangeType(bookingsMetrics.total_income_trend),
            sparklineData: bookingsMetrics.total_income_sparkline?.length ? bookingsMetrics.total_income_sparkline : defaultSparkline,
          },
          {
            title: 'Total Bookings',
            value: String(bookingsMetrics.total_bookings || bookings.length || 0),
            change: bookingsMetrics.total_bookings_change || '0%',
            changeType: trendToChangeType(bookingsMetrics.total_bookings_trend),
            sparklineData: bookingsMetrics.total_bookings_sparkline?.length ? bookingsMetrics.total_bookings_sparkline : defaultSparkline,
          },
          {
            title: 'Avg. Stay',
            value: `${bookingsMetrics.avg_stay || 0} nights`,
            change: '',
            changeType: 'neutral',
            sparklineData: defaultSparkline,
          },
          {
            title: 'Occupancy Rate',
            value: `${bookingsMetrics.occupancy_rate || 0}%`,
            change: bookingsMetrics.occupancy_change || '0%',
            changeType: trendToChangeType(bookingsMetrics.occupancy_trend),
            sparklineData: bookingsMetrics.occupancy_sparkline?.length ? bookingsMetrics.occupancy_sparkline : defaultSparkline,
          },
        ];
      case 'expenses':
        return [
          {
            title: 'Total Expense',
            value: formatCurrency(expensesMetrics.total_expense || 0),
            change: expensesMetrics.total_expense_change || '0%',
            changeType: trendToChangeType(expensesMetrics.total_expense_trend, true),
            sparklineData: expensesMetrics.total_expense_sparkline?.length ? expensesMetrics.total_expense_sparkline : defaultSparkline,
          },
          {
            title: 'Pending Expense',
            value: formatCurrency(expensesMetrics.pending_expense || 0),
            change: '',
            changeType: 'neutral',
            sparklineData: defaultSparkline,
          },
          {
            title: 'Paid Expense',
            value: formatCurrency(expensesMetrics.paid_expense || 0),
            change: '',
            changeType: 'neutral',
            sparklineData: defaultSparkline,
          },
          {
            title: 'Categories',
            value: String(expensesMetrics.categories || 0),
            change: '',
            changeType: 'neutral',
            sparklineData: defaultSparkline,
          },
        ];
      case 'inventory':
        return [
          {
            title: 'Total Items',
            value: String(inventoryMetrics.total_items || inventory.length || 0),
            change: '',
            changeType: 'neutral',
            sparklineData: defaultSparkline,
          },
          {
            title: 'Total Value',
            value: formatCurrency(inventoryMetrics.total_value || 0),
            change: '',
            changeType: 'neutral',
            sparklineData: defaultSparkline,
          },
          {
            title: 'Categories',
            value: String(inventoryMetrics.categories || 0),
            change: '',
            changeType: 'neutral',
            sparklineData: defaultSparkline,
          },
          {
            title: 'Last Updated',
            value: '-',
            change: '',
            changeType: 'neutral',
            sparklineData: defaultSparkline,
          },
        ];
      case 'ledger':
        return [
          {
            title: 'Owed to Owner',
            value: formatCurrency(ledgerMetrics.owed_to_owner || 0),
            change: '',
            changeType: 'neutral',
            sparklineData: defaultSparkline,
          },
          {
            title: 'Owed by Owner',
            value: formatCurrency(ledgerMetrics.owed_by_owner || 0),
            change: '',
            changeType: 'neutral',
            sparklineData: defaultSparkline,
          },
          {
            title: 'Total Transactions',
            value: String(ledgerMetrics.total_transactions || ledger.length || 0),
            change: '',
            changeType: 'neutral',
            sparklineData: defaultSparkline,
          },
          {
            title: 'Net Income',
            value: formatCurrency(ledgerMetrics.net_income || 0),
            change: '',
            changeType: (ledgerMetrics.net_income || 0) >= 0 ? 'positive' : 'critical',
            sparklineData: ledgerMetrics.ledger_sparkline?.length ? ledgerMetrics.ledger_sparkline : defaultSparkline,
          },
        ];
      case 'owner':
        return [];
      default:
        return [];
    }
  };

  // Get table headings
  const getTableHeadings = () => {
    switch (selectedReportType) {
      case 'bookings':
        return [
          { title: 'Booking ID' },
          { title: 'Customer' },
          { title: 'Check In' },
          { title: 'Check Out' },
          { title: 'Nights' },
          { title: 'Amount' },
          { title: 'Status' },
        ];
      case 'expenses':
        return [
          { title: 'Expense ID' },
          { title: 'Category' },
          { title: 'Amount' },
          { title: 'Date Reported' },
          { title: 'Date Paid' },
          { title: 'Status' },
        ];
      case 'inventory':
        return [
          { title: 'Item ID' },
          { title: 'Name' },
          { title: 'Category' },
          { title: 'Purchase Price' },
          { title: 'Condition' },
        ];
      case 'ledger':
        return [
          { title: 'Transaction ID' },
          { title: 'Category' },
          { title: 'Paid By' },
          { title: 'Amount' },
          { title: 'Date' },
          { title: 'Status' },
        ];
      default:
        return [];
    }
  };

  // Render table row based on report type
  const renderTableRow = (item, index) => {
    switch (selectedReportType) {
      case 'bookings':
        return (
          <IndexTable.Row
            id={String(item.id)}
            key={item.id}
            position={index}
            selected={selectedResources.includes(String(item.id))}
          >
            <IndexTable.Cell>
              <Text variant="bodyMd" fontWeight="semibold" as="span">
                #{item.id}
              </Text>
            </IndexTable.Cell>
            <IndexTable.Cell>
              <Text variant="bodyMd" as="span">{item.user?.name || item.guest_name || '-'}</Text>
            </IndexTable.Cell>
            <IndexTable.Cell>
              <Text variant="bodyMd" as="span" tone="subdued">{formatDate(item.check_in_date)}</Text>
            </IndexTable.Cell>
            <IndexTable.Cell>
              <Text variant="bodyMd" as="span" tone="subdued">{formatDate(item.check_out_date)}</Text>
            </IndexTable.Cell>
            <IndexTable.Cell>
              <Text variant="bodyMd" as="span">{item.nights || '-'}</Text>
            </IndexTable.Cell>
            <IndexTable.Cell>
              <Text variant="bodyMd" as="span">{formatCurrency(item.total_price)}</Text>
            </IndexTable.Cell>
            <IndexTable.Cell>{getStatusBadge(item.status)}</IndexTable.Cell>
          </IndexTable.Row>
        );

      case 'expenses':
        return (
          <IndexTable.Row
            id={String(item.id)}
            key={item.id}
            position={index}
            selected={selectedResources.includes(String(item.id))}
          >
            <IndexTable.Cell>
              <Text variant="bodyMd" fontWeight="semibold" as="span">#{item.id}</Text>
            </IndexTable.Cell>
            <IndexTable.Cell>
              <Text variant="bodyMd" as="span">{item.category || '-'}</Text>
            </IndexTable.Cell>
            <IndexTable.Cell>
              <Text variant="bodyMd" as="span">{formatCurrency(item.amount)}</Text>
            </IndexTable.Cell>
            <IndexTable.Cell>
              <Text variant="bodyMd" as="span" tone="subdued">{formatDate(item.reported_date)}</Text>
            </IndexTable.Cell>
            <IndexTable.Cell>
              <Text variant="bodyMd" as="span" tone="subdued">{formatDate(item.paid_date)}</Text>
            </IndexTable.Cell>
            <IndexTable.Cell>{getStatusBadge(item.payment_status || item.status)}</IndexTable.Cell>
          </IndexTable.Row>
        );

      case 'inventory':
        return (
          <IndexTable.Row
            id={String(item.id)}
            key={item.id}
            position={index}
            selected={selectedResources.includes(String(item.id))}
          >
            <IndexTable.Cell>
              <Text variant="bodyMd" fontWeight="semibold" as="span">#{item.id}</Text>
            </IndexTable.Cell>
            <IndexTable.Cell>
              <Text variant="bodyMd" as="span">{item.name || '-'}</Text>
            </IndexTable.Cell>
            <IndexTable.Cell>
              <Text variant="bodyMd" as="span">{item.type || item.category || '-'}</Text>
            </IndexTable.Cell>
            <IndexTable.Cell>
              <Text variant="bodyMd" as="span">{formatCurrency(item.purchase_price)}</Text>
            </IndexTable.Cell>
            <IndexTable.Cell>{getStatusBadge(item.condition)}</IndexTable.Cell>
          </IndexTable.Row>
        );

      case 'ledger':
        return (
          <IndexTable.Row
            id={String(item.id)}
            key={item.id}
            position={index}
            selected={selectedResources.includes(String(item.id))}
          >
            <IndexTable.Cell>
              <Text variant="bodyMd" fontWeight="semibold" as="span">#{item.id}</Text>
            </IndexTable.Cell>
            <IndexTable.Cell>
              <Text variant="bodyMd" as="span">{item.category || '-'}</Text>
            </IndexTable.Cell>
            <IndexTable.Cell>
              <Text variant="bodyMd" as="span">{item.paid_by || '-'}</Text>
            </IndexTable.Cell>
            <IndexTable.Cell>
              <Text variant="bodyMd" as="span">{formatCurrency(item.amount)}</Text>
            </IndexTable.Cell>
            <IndexTable.Cell>
              <Text variant="bodyMd" as="span" tone="subdued">{formatDate(item.paid_date || item.reported_date)}</Text>
            </IndexTable.Cell>
            <IndexTable.Cell>{getStatusBadge(item.payment_status || item.status)}</IndexTable.Cell>
          </IndexTable.Row>
        );

      default:
        return null;
    }
  };

  // Owner data
  const owner = property?.owner;

  const metrics = getMetrics();
  const tableHeadings = getTableHeadings();
  const currentData = getCurrentData();
  const loading = isLoading();

  // Resource name based on report type
  const resourceName = useMemo(() => {
    switch (selectedReportType) {
      case 'bookings':
        return { singular: 'booking', plural: 'bookings' };
      case 'expenses':
        return { singular: 'expense', plural: 'expenses' };
      case 'inventory':
        return { singular: 'item', plural: 'items' };
      case 'ledger':
        return { singular: 'transaction', plural: 'transactions' };
      default:
        return { singular: 'record', plural: 'records' };
    }
  }, [selectedReportType]);

  // Selection state for table
  const { selectedResources, allResourcesSelected, handleSelectionChange } =
    useIndexResourceState(currentData);

  // Report type activator
  const reportTypeActivator = (
    <Button onClick={toggleReportTypePopover} disclosure="down">
      {selectedReportLabel}
    </Button>
  );

  // Date range activator
  const dateRangeActivator = (
    <Button onClick={toggleDateRangePopover} icon={CalendarIcon} disclosure="down">
      {selectedDateRangeLabel}
    </Button>
  );

  // Loading state
  if (loadingProperty && !property) {
    return (
      <div className="customers-page-wrapper width-full">
        <Page
          backAction={{ content: 'Reports', onAction: handleBack }}
          title="Loading..."
        >
          <Card>
            <Box padding="800">
              <InlineStack align="center" blockAlign="center">
                <Spinner size="large" />
              </InlineStack>
            </Box>
          </Card>
        </Page>
      </div>
    );
  }

  const propertyName = property?.property_name || property?.name || property?.building_name || `Property #${propertyId}`;

  return (
    <div className="customers-page-wrapper width-full">
      <style>{`
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
          margin-bottom: 0;
        }
        .stats-grid-placeholder {
          display: grid;
        }
        .stat-card-placeholder {
          height: 76px;
          background: transparent;
          border-radius: 12px;
        }
        @media (max-width: 1200px) {
          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .stats-grid-placeholder {
            display: none;
          }
        }
        @media (max-width: 600px) {
          .stats-grid {
            grid-template-columns: 1fr;
          }
        }
        .owner-details-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
        }
        .owner-detail-item {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        @media (max-width: 600px) {
          .owner-details-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <Page
        backAction={{ content: 'Reports', onAction: handleBack }}
        title={
          <InlineStack gap="200" blockAlign="center">
            <Icon source={ChartVerticalFilledIcon} />
            <span className="customers-page-title">{propertyName}</span>
          </InlineStack>
        }
        secondaryActions={[
          {
            content: 'Export',
            onAction: () => console.log('Export'),
          },
        ]}
      >
        {/* Metrics Cards */}
        {metrics.length > 0 ? (
          <div className="stats-grid">
            {metrics.map((metric, index) => (
              <StatCard
                key={index}
                title={metric.title}
                value={metric.value}
                change={metric.change}
                changeType={metric.changeType}
                sparklineData={metric.sparklineData}
              />
            ))}
          </div>
        ) : (
          <div className="stats-grid stats-grid-placeholder">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="stat-card-placeholder" />
            ))}
          </div>
        )}

        <Box paddingBlockStart="400">
          <Card padding="0">
            {/* Header with Search and Filters */}
            <Box padding="200" paddingBlockEnd="200">
              <InlineStack align={selectedReportType === 'owner' ? 'end' : 'space-between'} blockAlign="center">
                {/* Search - hidden for Owner report */}
                {selectedReportType !== 'owner' && (
                  <div className="flex-1 max-width-93">
                    <TextField
                      placeholder={`Search ${selectedReportLabel.toLowerCase()}`}
                      value={searchValue}
                      onChange={handleSearchChange}
                      prefix={<Icon source={SearchIcon} tone="subdued" />}
                      autoComplete="off"
                      clearButton
                      onClearButtonClick={() => setSearchValue('')}
                    />
                  </div>
                )}

                {/* Right side controls */}
                <InlineStack gap="200" blockAlign="center" wrap={false}>
                  {/* Date Range Picker */}
                  <Popover
                    active={dateRangePopoverActive}
                    activator={dateRangeActivator}
                    onClose={toggleDateRangePopover}
                    preferredAlignment="right"
                  >
                    <ActionList
                      items={dateRangeOptions.map((option) => ({
                        content: option.label,
                        active: selectedDateRange === option.value,
                        onAction: () => handleDateRangeChange(option.value),
                      }))}
                    />
                  </Popover>

                  {/* Report Type Selector */}
                  <Popover
                    active={reportTypePopoverActive}
                    activator={reportTypeActivator}
                    onClose={toggleReportTypePopover}
                    preferredAlignment="right"
                  >
                    <ActionList
                      items={reportTypes.map((type) => ({
                        content: type.label,
                        active: selectedReportType === type.id,
                        onAction: () => handleReportTypeChange(type.id),
                      }))}
                    />
                  </Popover>
                </InlineStack>
              </InlineStack>
            </Box>

            {/* Owner View - Special Case */}
            {selectedReportType === 'owner' ? (
              <Box padding="500">
                <BlockStack gap="400">
                  <Text variant="headingMd" as="h2">Owner Details</Text>
                  {owner ? (
                    <div className="owner-details-grid">
                      <div className="owner-detail-item">
                        <Text variant="bodySm" as="span" tone="subdued">Name</Text>
                        <Text variant="bodyMd" as="p" fontWeight="semibold">
                          {owner.name || `${owner.first_name || ''} ${owner.last_name || ''}`.trim() || '-'}
                        </Text>
                      </div>
                      <div className="owner-detail-item">
                        <Text variant="bodySm" as="span" tone="subdued">ID</Text>
                        <Text variant="bodyMd" as="p" fontWeight="semibold">#{owner.id}</Text>
                      </div>
                      <div className="owner-detail-item">
                        <Text variant="bodySm" as="span" tone="subdued">Email</Text>
                        <Text variant="bodyMd" as="p" fontWeight="semibold">{owner.email || '-'}</Text>
                      </div>
                      <div className="owner-detail-item">
                        <Text variant="bodySm" as="span" tone="subdued">Phone</Text>
                        <Text variant="bodyMd" as="p" fontWeight="semibold">{owner.phone || '-'}</Text>
                      </div>
                      <div className="owner-detail-item" style={{ gridColumn: 'span 2' }}>
                        <Text variant="bodySm" as="span" tone="subdued">Address</Text>
                        <Text variant="bodyMd" as="p" fontWeight="semibold">{owner.address || '-'}</Text>
                      </div>
                    </div>
                  ) : (
                    <Text variant="bodyMd" as="p" tone="subdued">No owner information available</Text>
                  )}
                </BlockStack>
              </Box>
            ) : (
              <>
                {/* Data Table */}
                {loading ? (
                  <Box padding="800">
                    <InlineStack align="center" blockAlign="center">
                      <Spinner size="large" />
                    </InlineStack>
                  </Box>
                ) : currentData.length === 0 ? (
                  <Box padding="800">
                    <BlockStack gap="400" inlineAlign="center">
                      <Text variant="headingMd" as="h3">No {selectedReportLabel.toLowerCase()} found</Text>
                      <Text variant="bodyMd" as="p" tone="subdued">
                        There are no {selectedReportLabel.toLowerCase()} records for this property yet.
                      </Text>
                    </BlockStack>
                  </Box>
                ) : (
                  <div className="table-scroll-container">
                    <IndexTable
                      resourceName={resourceName}
                      itemCount={currentData.length}
                      selectedItemsCount={
                        allResourcesSelected ? 'All' : selectedResources.length
                      }
                      onSelectionChange={handleSelectionChange}
                      headings={tableHeadings}
                      selectable
                    >
                      {currentData.map((item, index) => renderTableRow(item, index))}
                    </IndexTable>
                  </div>
                )}

                {/* Pagination */}
                {!loading && currentData.length > 0 && (
                  <Box padding="400" borderBlockStartWidth="025" borderColor="border">
                    <InlineStack align="space-between" blockAlign="center">
                      <Pagination
                        hasPrevious={false}
                        onPrevious={() => {}}
                        hasNext={false}
                        onNext={() => {}}
                      />
                      <Text variant="bodySm" as="span" tone="subdued">
                        {currentData.length} row(s) total.
                      </Text>
                    </InlineStack>
                  </Box>
                )}
              </>
            )}
          </Card>
        </Box>
      </Page>
    </div>
  );
}

export default PropertyReportsPage;
