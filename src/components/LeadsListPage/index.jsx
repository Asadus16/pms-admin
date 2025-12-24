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
  Banner,
  Select,
  ButtonGroup,
} from '@shopify/polaris';
import {
  SearchIcon,
  PersonIcon,
  SortIcon,
  PlusIcon,
} from '@shopify/polaris-icons';
import { useAppDispatch, useAppSelector } from '@/store';
import { fetchPropertyManagerLeads } from '@/store/thunks';
import {
  selectLeads,
  selectLeadsPagination,
  selectLeadsLoading,
  selectLeadsError,
} from '@/store/slices/property-manager/leads/slice';
import '../PropertyOwnersPage/CustomersPage.css';

// Lead type options
const leadTypeOptions = [
  { label: 'All Types', value: '' },
  { label: 'Monthly Rental', value: 'Monthly Rental' },
  { label: 'Short-Term Rental', value: 'Short-Term Rental' },
  { label: 'Sale', value: 'Sale' },
  { label: 'Multiple', value: 'Multiple' },
];

// Lead role options
const leadRoleOptions = [
  { label: 'All Roles', value: '' },
  { label: 'Buyer', value: 'Buyer' },
  { label: 'Tenant', value: 'Tenant' },
  { label: 'Seller', value: 'Seller' },
  { label: 'Landlord', value: 'Landlord' },
  { label: 'Guest', value: 'Guest' },
  { label: 'Agent', value: 'Agent' },
];

// Lead status options
const leadStatusOptions = [
  { label: 'All Statuses', value: '' },
  { label: 'New', value: 'New' },
  { label: 'Contacted', value: 'Contacted' },
  { label: 'Qualified', value: 'Qualified' },
  { label: 'Viewing Scheduled', value: 'Viewing Scheduled' },
  { label: 'Offer', value: 'Offer' },
  { label: 'Negotiation', value: 'Negotiation' },
  { label: 'Agreement Sent', value: 'Agreement Sent' },
  { label: 'Closed–Won', value: 'Closed–Won' },
  { label: 'Closed–Lost', value: 'Closed–Lost' },
];

// Priority options
const priorityOptions = [
  { label: 'All Priorities', value: '' },
  { label: 'Low', value: 'Low' },
  { label: 'Normal', value: 'Normal' },
  { label: 'High', value: 'High' },
  { label: 'Hot', value: 'Hot' },
];

// Priority badge tones
const getPriorityBadgeTone = (priority) => {
  switch (priority) {
    case 'Hot': return 'critical';
    case 'High': return 'attention';
    case 'Normal': return 'info';
    case 'Low': return 'subdued';
    default: return 'subdued';
  }
};

// Status badge tones
const getStatusBadgeTone = (status) => {
  switch (status) {
    case 'Closed–Won': return 'success';
    case 'Closed–Lost': return 'critical';
    case 'Qualified': return 'info';
    case 'New': return 'attention';
    default: return 'subdued';
  }
};

function LeadsListPage() {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useAppDispatch();

  // Redux state
  const leads = useAppSelector(selectLeads);
  const pagination = useAppSelector(selectLeadsPagination);
  const isLoading = useAppSelector(selectLeadsLoading);
  const error = useAppSelector(selectLeadsError);

  const basePath = pathname?.split('/')[1] ? `/${pathname.split('/')[1]}` : '/property-manager';

  // Filter states
  const [searchValue, setSearchValue] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [leadTypeFilter, setLeadTypeFilter] = useState('');
  const [leadRoleFilter, setLeadRoleFilter] = useState('');
  const [leadStatusFilter, setLeadStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [sortPopoverActive, setSortPopoverActive] = useState(false);

  // Memoize leads array
  const leadsArray = useMemo(() => {
    if (Array.isArray(leads)) return leads;
    if (leads?.data && Array.isArray(leads.data)) return leads.data;
    return [];
  }, [leads]);

  const { selectedResources, allResourcesSelected, handleSelectionChange } =
    useIndexResourceState(leadsArray);

  // Fetch leads when filters or pagination change
  useEffect(() => {
    const params = {
      page: currentPage,
      per_page: 15,
      ...(searchValue && { search: searchValue }),
      ...(leadTypeFilter && { lead_type: leadTypeFilter }),
      ...(leadRoleFilter && { lead_role: leadRoleFilter }),
      ...(leadStatusFilter && { lead_status: leadStatusFilter }),
      ...(priorityFilter && { priority: priorityFilter }),
    };

    dispatch(fetchPropertyManagerLeads(params));
  }, [dispatch, currentPage, searchValue, leadTypeFilter, leadRoleFilter, leadStatusFilter, priorityFilter]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchValue !== '') {
        setCurrentPage(1);
        dispatch(fetchPropertyManagerLeads({
          page: 1,
          per_page: 15,
          search: searchValue,
          ...(leadTypeFilter && { lead_type: leadTypeFilter }),
          ...(leadRoleFilter && { lead_role: leadRoleFilter }),
          ...(leadStatusFilter && { lead_status: leadStatusFilter }),
          ...(priorityFilter && { priority: priorityFilter }),
        }));
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchValue, dispatch, leadTypeFilter, leadRoleFilter, leadStatusFilter, priorityFilter]);

  const handleSearchChange = useCallback((value) => {
    setSearchValue(value);
  }, []);

  const handleSearchClear = useCallback(() => {
    setSearchValue('');
    setCurrentPage(1);
  }, []);

  const toggleSortPopover = useCallback(() => {
    setSortPopoverActive((active) => !active);
  }, []);

  const handleFilterChange = useCallback((filterType, value) => {
    setCurrentPage(1);
    switch (filterType) {
      case 'lead_type':
        setLeadTypeFilter(value);
        break;
      case 'lead_role':
        setLeadRoleFilter(value);
        break;
      case 'lead_status':
        setLeadStatusFilter(value);
        break;
      case 'priority':
        setPriorityFilter(value);
        break;
    }
  }, []);

  const clearFilters = useCallback(() => {
    setLeadTypeFilter('');
    setLeadRoleFilter('');
    setLeadStatusFilter('');
    setPriorityFilter('');
    setSearchValue('');
    setCurrentPage(1);
  }, []);

  const resourceName = {
    singular: 'lead',
    plural: 'leads',
  };

  const totalLeads = pagination.totalItems || leadsArray.length;

  const rowMarkup = leadsArray.map((lead, index) => {
    const contactName = lead.contact?.full_name || lead.contact?.name || 'No Contact';
    const contactEmail = lead.contact?.email || '';
    const contactPhone = lead.contact?.phone || '';

    return (
      <IndexTable.Row
        id={String(lead.id)}
        key={lead.id}
        selected={selectedResources.includes(String(lead.id))}
        position={index}
        onClick={() => router.push(`${basePath}/leads/${lead.id}`)}
      >
        <IndexTable.Cell>
          <Text variant="bodyMd" fontWeight="semibold" as="span">
            {lead.lead_id || `LEAD-${String(lead.id).padStart(6, '0')}`}
          </Text>
        </IndexTable.Cell>
        <IndexTable.Cell>
          <BlockStack gap="050">
            <Text variant="bodyMd" fontWeight="medium" as="span">
              {contactName}
            </Text>
            {contactEmail && (
              <Text variant="bodySm" as="span" tone="subdued">
                {contactEmail}
              </Text>
            )}
          </BlockStack>
        </IndexTable.Cell>
        <IndexTable.Cell>
          <Badge>{lead.lead_type || '-'}</Badge>
        </IndexTable.Cell>
        <IndexTable.Cell>
          <Text variant="bodyMd" as="span">
            {lead.lead_role || '-'}
          </Text>
        </IndexTable.Cell>
        <IndexTable.Cell>
          <Badge tone={getStatusBadgeTone(lead.lead_status)}>
            {lead.lead_status || 'New'}
          </Badge>
        </IndexTable.Cell>
        <IndexTable.Cell>
          <Badge tone={getPriorityBadgeTone(lead.priority)}>
            {lead.priority || 'Normal'}
          </Badge>
        </IndexTable.Cell>
        <IndexTable.Cell>
          <Text variant="bodySm" as="span" tone="subdued">
            {lead.initial_message ? (lead.initial_message.length > 50 
              ? `${lead.initial_message.substring(0, 50)}...` 
              : lead.initial_message) 
              : '-'}
          </Text>
        </IndexTable.Cell>
        <IndexTable.Cell>
          <Text variant="bodySm" as="span" tone="subdued">
            {lead.created_at 
              ? new Date(lead.created_at).toLocaleDateString() 
              : '-'}
          </Text>
        </IndexTable.Cell>
      </IndexTable.Row>
    );
  });

  const sortActivator = (
    <Button
      icon={SortIcon}
      onClick={toggleSortPopover}
      accessibilityLabel="Sort leads"
    />
  );

  const hasActiveFilters = leadTypeFilter || leadRoleFilter || leadStatusFilter || priorityFilter || searchValue;

  return (
    <div className="customers-page-wrapper width-full">
      <Page
        title={
          <InlineStack gap="200" blockAlign="center">
            <Icon source={PersonIcon} />
            <span className="customers-page-title">Leads</span>
          </InlineStack>
        }
        primaryAction={{
          content: 'Add lead',
          onAction: () => router.push(`${basePath}/leads/new`),
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

        {/* Lead count stats bar */}
        <Box paddingBlockEnd="600" className="customer-stats-box">
          <Card padding="400" className="customer-stats-card">
            <InlineStack gap="200" align="start">
              <Text variant="bodyMd" as="span" fontWeight="semibold">
                {totalLeads} leads
              </Text>
            </InlineStack>
          </Card>
        </Box>

        {/* Main table card */}
        <Card padding="0">
          {/* Filters and Search bar */}
          <Box padding="400" paddingBlockEnd="200">
            <BlockStack gap="400">
              {/* Search bar */}
              <TextField
                placeholder="Search leads by ID, message, or contact details"
                value={searchValue}
                onChange={handleSearchChange}
                clearButton
                onClearButtonClick={handleSearchClear}
                prefix={<Icon source={SearchIcon} tone="subdued" />}
                autoComplete="off"
              />

              {/* Filter row */}
              <InlineStack gap="200" wrap>
                <Box minWidth="200px">
                  <Select
                    label="Lead Type"
                    options={leadTypeOptions}
                    value={leadTypeFilter}
                    onChange={(value) => handleFilterChange('lead_type', value)}
                  />
                </Box>
                <Box minWidth="200px">
                  <Select
                    label="Lead Role"
                    options={leadRoleOptions}
                    value={leadRoleFilter}
                    onChange={(value) => handleFilterChange('lead_role', value)}
                  />
                </Box>
                <Box minWidth="200px">
                  <Select
                    label="Status"
                    options={leadStatusOptions}
                    value={leadStatusFilter}
                    onChange={(value) => handleFilterChange('lead_status', value)}
                  />
                </Box>
                <Box minWidth="200px">
                  <Select
                    label="Priority"
                    options={priorityOptions}
                    value={priorityFilter}
                    onChange={(value) => handleFilterChange('priority', value)}
                  />
                </Box>
                {hasActiveFilters && (
                  <Box>
                    <Button onClick={clearFilters} size="slim">
                      Clear Filters
                    </Button>
                  </Box>
                )}
              </InlineStack>
            </BlockStack>
          </Box>

          {/* Loading State */}
          {isLoading ? (
            <Box padding="1000">
              <BlockStack gap="400" inlineAlign="center">
                <Spinner size="large" />
                <Text variant="bodyMd" as="p" tone="subdued">
                  Loading leads...
                </Text>
              </BlockStack>
            </Box>
          ) : leadsArray.length === 0 ? (
            <Box padding="1000">
              <BlockStack gap="400" inlineAlign="center">
                <Text variant="headingMd" as="h3">
                  No leads found
                </Text>
                <Text variant="bodyMd" as="p" tone="subdued">
                  {hasActiveFilters 
                    ? 'Try adjusting your filters' 
                    : 'Add your first lead to get started'}
                </Text>
                {!hasActiveFilters && (
                  <Button variant="primary" onClick={() => router.push(`${basePath}/leads/new`)}>
                    Add lead
                  </Button>
                )}
              </BlockStack>
            </Box>
          ) : (
            <div className="table-scroll-container">
              <IndexTable
                resourceName={resourceName}
                itemCount={leadsArray.length}
                selectedItemsCount={
                  allResourcesSelected ? 'All' : selectedResources.length
                }
                onSelectionChange={handleSelectionChange}
                headings={[
                  { title: 'Lead ID' },
                  { title: 'Contact' },
                  { title: 'Type' },
                  { title: 'Role' },
                  { title: 'Status' },
                  { title: 'Priority' },
                  { title: 'Initial Message' },
                  { title: 'Date Created' },
                ]}
                selectable
              >
                {rowMarkup}
              </IndexTable>
            </div>
          )}

          {/* Pagination */}
          {!isLoading && leadsArray.length > 0 && (
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
                    totalLeads
                  )} of ${totalLeads}`}
                </Text>
              </InlineStack>
            </Box>
          )}
        </Card>
      </Page>
    </div>
  );
}

export default LeadsListPage;

