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
} from '@shopify/polaris';
import {
  SearchIcon,
  PersonIcon,
  SortIcon,
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

// Sort options for leads
const sortOptions = [
  { value: 'created_at', label: 'Date created' },
  { value: 'lead_status', label: 'Status' },
  { value: 'priority', label: 'Priority' },
  { value: 'lead_type', label: 'Lead type' },
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

  // State
  const [searchValue, setSearchValue] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortPopoverActive, setSortPopoverActive] = useState(false);
  const [selectedSort, setSelectedSort] = useState('created_at');
  const [sortDirection, setSortDirection] = useState('desc');

  // Memoize leads array
  const leadsArray = useMemo(() => {
    if (Array.isArray(leads)) return leads;
    if (leads?.data && Array.isArray(leads.data)) return leads.data;
    return [];
  }, [leads]);

  const { selectedResources, allResourcesSelected, handleSelectionChange } =
    useIndexResourceState(leadsArray);

  // Fetch leads when pagination changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      dispatch(fetchPropertyManagerLeads({
        per_page: 15,
        page: currentPage,
        search: searchValue || undefined,
      }));
    }, searchValue ? 500 : 0);

    return () => clearTimeout(timeoutId);
  }, [dispatch, currentPage, searchValue]);

  const handleSearchChange = useCallback((value) => {
    setSearchValue(value);
    setCurrentPage(1);
  }, []);

  const handleSearchClear = useCallback(() => {
    setSearchValue('');
    setCurrentPage(1);
  }, []);

  const toggleSortPopover = useCallback(() => {
    setSortPopoverActive((active) => !active);
  }, []);

  const handleSortChange = useCallback((value) => {
    setSelectedSort(value[0]);
  }, []);

  const handleSortDirectionChange = useCallback((value) => {
    setSortDirection(value[0]);
  }, []);

  const resourceName = {
    singular: 'lead',
    plural: 'leads',
  };

  const totalLeads = pagination.totalItems || leadsArray.length;

  // Sort leads locally
  const sortedLeads = useMemo(() => {
    return [...leadsArray].sort((a, b) => {
      let comparison = 0;
      switch (selectedSort) {
        case 'created_at':
          comparison = new Date(a.created_at || 0).getTime() - new Date(b.created_at || 0).getTime();
          break;
        case 'lead_status':
          comparison = (a.lead_status || '').localeCompare(b.lead_status || '');
          break;
        case 'priority': {
          const priorityOrder = { Hot: 4, High: 3, Normal: 2, Low: 1 };
          comparison = (priorityOrder[a.priority] || 0) - (priorityOrder[b.priority] || 0);
          break;
        }
        case 'lead_type':
          comparison = (a.lead_type || '').localeCompare(b.lead_type || '');
          break;
        default:
          comparison = 0;
      }
      return sortDirection === 'desc' ? -comparison : comparison;
    });
  }, [leadsArray, selectedSort, sortDirection]);

  const rowMarkup = sortedLeads.map((lead, index) => {
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
          {/* Search bar with Sort button */}
          <Box padding="200" paddingBlockEnd="200">
            <InlineStack align="space-between" blockAlign="center">
              <div className="flex-1 max-width-93">
                <TextField
                  placeholder="Search leads"
                  value={searchValue}
                  onChange={handleSearchChange}
                  clearButton
                  onClearButtonClick={handleSearchClear}
                  prefix={<Icon source={SearchIcon} tone="subdued" />}
                  autoComplete="off"
                />
              </div>

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
            </InlineStack>
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
          ) : sortedLeads.length === 0 ? (
            <Box padding="1000">
              <BlockStack gap="400" inlineAlign="center">
                <Text variant="headingMd" as="h3">
                  No leads found
                </Text>
                <Text variant="bodyMd" as="p" tone="subdued">
                  {searchValue
                    ? 'Try adjusting your search'
                    : 'Add your first lead to get started'}
                </Text>
                {!searchValue && (
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
                itemCount={sortedLeads.length}
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
          {!isLoading && sortedLeads.length > 0 && (
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

