'use client';

import { useMemo, useCallback, useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import {
  Page,
  Card,
  Text,
  BlockStack,
  InlineStack,
  Button,
  Box,
  Icon,
  Layout,
  Banner,
  Spinner,
  Badge,
  Popover,
  ActionList,
} from '@shopify/polaris';
import { PersonIcon, ChevronRightIcon, ArrowLeftIcon } from '@shopify/polaris-icons';
import { useAppDispatch, useAppSelector } from '@/store';
import {
  fetchPropertyManagerLeadById,
  deletePropertyManagerLead,
} from '@/store/thunks';
import {
  selectCurrentLead,
  selectLeadsLoading,
  selectLeadsDeleting,
  selectLeadsError,
  clearCurrentLead,
} from '@/store/slices/property-manager/leads/slice';
import '../AddDeveloper/AddDeveloper.css';

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

export default function LeadViewPage({ leadId }) {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const [actionsPopoverActive, setActionsPopoverActive] = useState(false);

  const lead = useAppSelector(selectCurrentLead);
  const isLoading = useAppSelector(selectLeadsLoading);
  const isDeleting = useAppSelector(selectLeadsDeleting);
  const error = useAppSelector(selectLeadsError);

  const basePath = useMemo(() => {
    const seg = pathname?.split('/')?.[1];
    return seg ? `/${seg}` : '/property-manager';
  }, [pathname]);

  useEffect(() => {
    if (leadId) {
      dispatch(fetchPropertyManagerLeadById(leadId));
    }

    return () => {
      dispatch(clearCurrentLead());
    };
  }, [dispatch, leadId]);

  const handleBack = useCallback(() => {
    router.push(`${basePath}/leads`);
  }, [router, basePath]);

  const toggleActionsPopover = useCallback(() => {
    setActionsPopoverActive((active) => !active);
  }, []);

  const handleEdit = useCallback(() => {
    setActionsPopoverActive(false);
    router.push(`${basePath}/leads/${leadId}/edit`);
  }, [router, basePath, leadId]);

  const handleDelete = useCallback(async () => {
    if (!lead || !confirm('Are you sure you want to delete this lead?')) return;

    setActionsPopoverActive(false);
    try {
      await dispatch(deletePropertyManagerLead(leadId)).unwrap();
      router.push(`${basePath}/leads`);
    } catch (err) {
      console.error('Error deleting lead:', err);
    }
  }, [dispatch, lead, leadId, router, basePath]);

  if (isLoading) {
    return (
      <div className="add-developer-wrapper">
        <Page>
          <Box padding="1000">
            <BlockStack gap="400" inlineAlign="center">
              <Spinner size="large" />
              <Text variant="bodyMd" as="p" tone="subdued">
                Loading lead details...
              </Text>
            </BlockStack>
          </Box>
        </Page>
      </div>
    );
  }

  if (!lead && !isLoading) {
    return (
      <Page
        title="Lead"
        backAction={{ content: 'Leads', onAction: handleBack }}
      >
        {error && (
          <Box paddingBlockEnd="400">
            <Banner tone="critical">
              <p>{error}</p>
            </Banner>
          </Box>
        )}
        <Card>
          <Box padding="400">
            <BlockStack gap="200">
              <Text variant="headingMd" as="h2">
                Lead not found
              </Text>
              <Text variant="bodyMd" as="p" tone="subdued">
                We couldn&apos;t find a lead with ID: {leadId}
              </Text>
              <div>
                <Button icon={ArrowLeftIcon} onClick={handleBack}>
                  Back to leads
                </Button>
              </div>
            </BlockStack>
          </Box>
        </Card>
      </Page>
    );
  }

  const safeString = (val) => (val == null ? '' : String(val));
  const contact = lead.contact || {};
  const assignedTo = lead.assigned_to_user || {};

  const actionsPopoverActivator = (
    <Button onClick={toggleActionsPopover} disclosure="down" loading={isDeleting}>
      More actions
    </Button>
  );

  const actionItems = [
    {
      content: 'Edit',
      onAction: handleEdit,
    },
    {
      content: 'Delete lead',
      destructive: true,
      onAction: handleDelete,
    },
  ];

  return (
    <div className="add-developer-wrapper">
      <div className="view-user-header">
        <InlineStack gap="050" blockAlign="center">
          <Icon source={PersonIcon} tone="base" />
          <Icon source={ChevronRightIcon} tone="subdued" />
          <span className="new-developer-title">Lead details</span>
        </InlineStack>
        <Popover
          active={actionsPopoverActive}
          activator={actionsPopoverActivator}
          onClose={toggleActionsPopover}
          preferredAlignment="right"
        >
          <ActionList items={actionItems} />
        </Popover>
      </div>
      <Page>
        {error && (
          <Box paddingBlockEnd="400">
            <Banner tone="critical">
              <p>{error}</p>
            </Banner>
          </Box>
        )}

        {/* Lead Basic Information Summary */}
        <Box paddingBlockEnd="400">
          <Card>
            <BlockStack gap="400">
              <InlineStack align="space-between" blockAlign="center">
                <BlockStack gap="200">
                  <Text variant="headingLg" as="h1">
                    {lead.lead_id || `LEAD-${String(lead.id).padStart(6, '0')}`}
                  </Text>
                  <InlineStack gap="400" blockAlign="center">
                    <Badge>{lead.lead_type || '-'}</Badge>
                    <Badge tone={getStatusBadgeTone(lead.lead_status)}>
                      {lead.lead_status || 'New'}
                    </Badge>
                    <Badge tone={getPriorityBadgeTone(lead.priority)}>
                      {lead.priority || 'Normal'}
                    </Badge>
                  </InlineStack>
                </BlockStack>
              </InlineStack>
            </BlockStack>
          </Card>
        </Box>

        <Layout>
          <Layout.Section>
            <BlockStack gap="400">
              <Card>
                <BlockStack gap="400">
                  <Text variant="headingMd" as="h2">
                    Lead Information
                  </Text>

                  <BlockStack gap="200">
                    <Text variant="bodySm" as="span" tone="subdued">
                      Lead Type
                    </Text>
                    <Text variant="bodyMd" as="p">
                      {lead.lead_type || '-'}
                    </Text>
                  </BlockStack>

                  <BlockStack gap="200">
                    <Text variant="bodySm" as="span" tone="subdued">
                      Lead Role
                    </Text>
                    <Text variant="bodyMd" as="p">
                      {lead.lead_role || '-'}
                    </Text>
                  </BlockStack>

                  <BlockStack gap="200">
                    <Text variant="bodySm" as="span" tone="subdued">
                      Lead Source
                    </Text>
                    <Text variant="bodyMd" as="p">
                      {lead.lead_source || '-'}
                    </Text>
                  </BlockStack>

                  <BlockStack gap="200">
                    <Text variant="bodySm" as="span" tone="subdued">
                      Initial Message
                    </Text>
                    <Text variant="bodyMd" as="p">
                      {lead.initial_message || '-'}
                    </Text>
                  </BlockStack>
                </BlockStack>
              </Card>

              {contact.id && (
                <Card>
                  <BlockStack gap="400">
                    <Text variant="headingMd" as="h2">
                      Contact Information
                    </Text>

                    <BlockStack gap="200">
                      <Text variant="bodySm" as="span" tone="subdued">
                        Name
                      </Text>
                      <Text variant="bodyMd" as="p">
                        {contact.full_name || contact.name || '-'}
                      </Text>
                    </BlockStack>

                    <BlockStack gap="200">
                      <Text variant="bodySm" as="span" tone="subdued">
                        Email
                      </Text>
                      <Text variant="bodyMd" as="p">
                        {contact.email || '-'}
                      </Text>
                    </BlockStack>

                    <BlockStack gap="200">
                      <Text variant="bodySm" as="span" tone="subdued">
                        Phone
                      </Text>
                      <Text variant="bodyMd" as="p">
                        {contact.phone || '-'}
                      </Text>
                    </BlockStack>
                  </BlockStack>
                </Card>
              )}
            </BlockStack>
          </Layout.Section>

          <Layout.Section variant="oneThird">
            <BlockStack gap="400">
              <Card>
                <BlockStack gap="300">
                  <Text variant="headingMd" as="h2">
                    Status & Priority
                  </Text>
                  <BlockStack gap="200">
                    <Text variant="bodySm" as="span" tone="subdued">
                      Status
                    </Text>
                    <Badge tone={getStatusBadgeTone(lead.lead_status)}>
                      {lead.lead_status || 'New'}
                    </Badge>
                  </BlockStack>
                  <BlockStack gap="200">
                    <Text variant="bodySm" as="span" tone="subdued">
                      Priority
                    </Text>
                    <Badge tone={getPriorityBadgeTone(lead.priority)}>
                      {lead.priority || 'Normal'}
                    </Badge>
                  </BlockStack>
                </BlockStack>
              </Card>

              {assignedTo.id && (
                <Card>
                  <BlockStack gap="300">
                    <Text variant="headingMd" as="h2">
                      Assigned To
                    </Text>
                    <BlockStack gap="200">
                      <Text variant="bodyMd" as="p">
                        {assignedTo.name || '-'}
                      </Text>
                      <Text variant="bodySm" as="p" tone="subdued">
                        {assignedTo.email || '-'}
                      </Text>
                    </BlockStack>
                  </BlockStack>
                </Card>
              )}

              <Card>
                <BlockStack gap="300">
                  <Text variant="headingMd" as="h2">
                    Dates
                  </Text>
                  <BlockStack gap="200">
                    <Text variant="bodySm" as="span" tone="subdued">
                      Created
                    </Text>
                    <Text variant="bodyMd" as="p">
                      {lead.created_at 
                        ? new Date(lead.created_at).toLocaleString() 
                        : '-'}
                    </Text>
                  </BlockStack>
                  {lead.updated_at && (
                    <BlockStack gap="200">
                      <Text variant="bodySm" as="span" tone="subdued">
                        Last Updated
                      </Text>
                      <Text variant="bodyMd" as="p">
                        {new Date(lead.updated_at).toLocaleString()}
                      </Text>
                    </BlockStack>
                  )}
                </BlockStack>
              </Card>
            </BlockStack>
          </Layout.Section>
        </Layout>
      </Page>
    </div>
  );
}

