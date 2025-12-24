'use client';

import { useMemo, useCallback, useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import {
  Page,
  Card,
  Text,
  TextField,
  BlockStack,
  InlineStack,
  Button,
  Box,
  Icon,
  Layout,
  Popover,
  ActionList,
  LegacyStack,
  Banner,
  Spinner,
  Badge,
} from '@shopify/polaris';
import { PersonIcon, ChevronRightIcon, ArrowLeftIcon, NoteIcon } from '@shopify/polaris-icons';
import { useAppDispatch, useAppSelector } from '@/store';
import {
  fetchPropertyManagerOwnerById,
  updatePropertyManagerOwnerStatus,
  fetchOwnerConnectionRequests,
  sendOwnerConnectionRequest,
  updateConnectionRequestStatus,
} from '@/store/thunks';
import {
  selectCurrentOwner,
  selectOwnersLoading,
  selectOwnersUpdating,
  selectOwnersError,
  clearCurrentOwner,
} from '@/store/slices/property-manager/owners/slice';
import {
  selectConnectionRequests,
  selectConnectionRequestsSending,
  selectConnectionRequestsUpdating,
} from '@/store/slices/property-manager/connection-requests/slice';
import SendConnectionRequest from '@/components/SendConnectionRequest';
import '../AddDeveloper/AddDeveloper.css';

// Country labels mapping
const countryLabels = {
  AE: 'United Arab Emirates',
  SA: 'Saudi Arabia',
  QA: 'Qatar',
  BH: 'Bahrain',
  KW: 'Kuwait',
  OM: 'Oman',
  IN: 'India',
  PK: 'Pakistan',
  EG: 'Egypt',
  JO: 'Jordan',
  LB: 'Lebanon',
  US: 'United States',
  GB: 'United Kingdom',
  DE: 'Germany',
  FR: 'France',
  CA: 'Canada',
  AU: 'Australia',
};

// Owner type labels
const ownerTypeLabels = {
  individual: 'Individual',
  company: 'Company',
  developer: 'Developer',
};

// Contact channel labels
const contactChannelLabels = {
  phone: 'Phone',
  email: 'Email',
};

function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: '2-digit' });
}

export default function OwnerViewPage({ ownerId }) {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const [actionsPopoverActive, setActionsPopoverActive] = useState(false);
  const [sendRequestModalOpen, setSendRequestModalOpen] = useState(false);

  // Redux state
  const owner = useAppSelector(selectCurrentOwner);
  const isLoading = useAppSelector(selectOwnersLoading);
  const isUpdating = useAppSelector(selectOwnersUpdating);
  const error = useAppSelector(selectOwnersError);
  const connectionRequests = useAppSelector(selectConnectionRequests);
  const isSendingRequest = useAppSelector(selectConnectionRequestsSending);
  const isUpdatingRequest = useAppSelector(selectConnectionRequestsUpdating);

  const basePath = useMemo(() => {
    const seg = pathname?.split('/')?.[1];
    return seg ? `/${seg}` : '/property-manager';
  }, [pathname]);

  // Fetch owner on mount
  useEffect(() => {
    if (ownerId) {
      dispatch(fetchPropertyManagerOwnerById(ownerId));
    }

    return () => {
      dispatch(clearCurrentOwner());
    };
  }, [dispatch, ownerId]);

  // Fetch connection requests on mount
  useEffect(() => {
    dispatch(fetchOwnerConnectionRequests());
  }, [dispatch]);

  const handleBack = useCallback(() => {
    router.push(`${basePath}/owners`);
  }, [router, basePath]);

  const toggleActionsPopover = useCallback(() => {
    setActionsPopoverActive((active) => !active);
  }, []);

  const handleToggleStatus = useCallback(async () => {
    setActionsPopoverActive(false);
    if (!owner) return;

    const newStatus = owner.status === 'active' ? 'inactive' : 'active';
    try {
      await dispatch(updatePropertyManagerOwnerStatus({
        id: owner.id,
        status: newStatus,
      })).unwrap();
    } catch (err) {
      console.error('Error updating status:', err);
    }
  }, [dispatch, owner]);

  // Get connection status for this owner
  const getConnectionStatus = useCallback(() => {
    if (!connectionRequests || !owner) return null;
    
    // Try to match by user_id first, then fall back to owner id
    const ownerUserId = owner.user_id || owner.userId || owner.id;
    
    // Check approved requests
    const approved = connectionRequests.approved?.find(
      req => (req.receiver?.id === ownerUserId || req.sender?.id === ownerUserId)
    );
    if (approved) return { status: 'accepted', request: approved };

    // Check sent requests
    const sent = connectionRequests.sent?.find(req => req.receiver?.id === ownerUserId);
    if (sent) return { status: sent.status, request: sent };

    // Check received requests
    const received = connectionRequests.received?.find(req => req.sender?.id === ownerUserId);
    if (received) return { status: received.status, request: received };

    return null;
  }, [connectionRequests, owner]);

  const connectionStatus = getConnectionStatus();

  const handleSendRequest = useCallback(() => {
    setSendRequestModalOpen(true);
  }, []);

  const handleCloseSendRequestModal = useCallback(() => {
    setSendRequestModalOpen(false);
    dispatch(fetchOwnerConnectionRequests());
  }, [dispatch]);

  const handleAcceptRequest = useCallback(async () => {
    if (!connectionStatus?.request) return;
    try {
      await dispatch(updateConnectionRequestStatus({
        id: connectionStatus.request.id,
        status: 'accepted',
      })).unwrap();
      dispatch(fetchOwnerConnectionRequests());
    } catch (err) {
      console.error('Error accepting request:', err);
    }
  }, [dispatch, connectionStatus]);

  const handleDenyRequest = useCallback(async () => {
    if (!connectionStatus?.request) return;
    try {
      await dispatch(updateConnectionRequestStatus({
        id: connectionStatus.request.id,
        status: 'denied',
      })).unwrap();
      dispatch(fetchOwnerConnectionRequests());
    } catch (err) {
      console.error('Error denying request:', err);
    }
  }, [dispatch, connectionStatus]);

  // Loading state
  if (isLoading) {
    return (
      <div className="add-developer-wrapper">
        <Page>
          <Box padding="1000">
            <BlockStack gap="400" inlineAlign="center">
              <Spinner size="large" />
              <Text variant="bodyMd" as="p" tone="subdued">
                Loading owner details...
              </Text>
            </BlockStack>
          </Box>
        </Page>
      </div>
    );
  }

  // Not found state
  if (!owner && !isLoading) {
    return (
      <Page
        title="Owner"
        backAction={{ content: 'Owners', onAction: handleBack }}
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
                Owner not found
              </Text>
              <Text variant="bodyMd" as="p" tone="subdued">
                We couldn&apos;t find an owner with ID: {ownerId}
              </Text>
              <div>
                <Button icon={ArrowLeftIcon} onClick={handleBack}>
                  Back to owners
                </Button>
              </div>
            </BlockStack>
          </Box>
        </Card>
      </Page>
    );
  }

  const actionsPopoverActivator = (
    <Button onClick={toggleActionsPopover} disclosure="down" loading={isUpdating}>
      More actions
    </Button>
  );

  // Helper to safely get string value
  const safeString = (val) => (val == null ? '' : String(val));

  // Get owner properties with fallback for snake_case/camelCase
  const ownerType = safeString(owner.owner_type || owner.ownerType);
  const countryOfResidence = safeString(owner.country_of_residence || owner.countryOfResidence);
  const preferredContactChannel = safeString(owner.preferred_contact_channel || owner.preferredContactChannel);
  const notesInstructions = safeString(owner.notes_instructions || owner.notesInstructions);
  const passportCopy = owner.passport_copy || owner.passportCopy;
  const idCardCopy = owner.id_card_copy || owner.idCardCopy;
  const tradeLicense = owner.trade_license || owner.tradeLicense;
  const taxVatId = safeString(owner.tax_vat_id || owner.taxVatId);
  const bankNumber = safeString(owner.bank_number || owner.bankNumber);
  const bankBranch = safeString(owner.bank_branch || owner.bankBranch || owner.branch);
  const bankName = safeString(owner.bank_name || owner.bankName);
  const dateAdded = owner.created_at || owner.dateAdded;
  const ownerDisplayId = safeString(owner.owner_id || owner.ownerId) || `OWN-${String(owner.id).padStart(4, '0')}`;
  const ownerName = safeString(owner.name);
  const ownerEmail = safeString(owner.email);
  const propertiesCount = owner.properties_count || owner.propertiesCount || owner.properties?.length || 0;

  const actionItems = [
    {
      content: 'Edit',
      onAction: () => {
        setActionsPopoverActive(false);
        router.push(`${basePath}/owners/${owner.id}/edit`);
      },
    },
    {
      content: owner.status === 'active' ? 'Deactivate owner' : 'Activate owner',
      destructive: owner.status === 'active',
      onAction: handleToggleStatus,
    },
  ];

  // File display helper
  const renderFileInfo = (file, label) => {
    // Handle different file formats (object with name/url or just URL string)
    const fileName = typeof file === 'string' ? file.split('/').pop() : file?.name;
    const fileSize = file?.sizeKb || file?.size;

    if (fileName) {
      return (
        <Card>
          <LegacyStack alignment="center">
            <Icon source={NoteIcon} tone="base" />
            <LegacyStack.Item fill>
              <Text variant="bodyMd" as="p" fontWeight="semibold">
                {fileName}
              </Text>
              <Text variant="bodySm" as="p" tone="subdued">
                {fileSize ? `${fileSize} KB` : 'File uploaded'}
              </Text>
            </LegacyStack.Item>
          </LegacyStack>
        </Card>
      );
    }
    return (
      <Banner tone="info">
        <p>No {label.toLowerCase()} uploaded.</p>
      </Banner>
    );
  };

  return (
    <div className="add-developer-wrapper">
      {/* Custom header row */}
      <div className="view-user-header">
        <InlineStack gap="050" blockAlign="center">
          <Icon source={PersonIcon} tone="base" />
          <Icon source={ChevronRightIcon} tone="subdued" />
          <span className="new-developer-title">Owner details</span>
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
        {/* Error Banner */}
        {error && (
          <Box paddingBlockEnd="400">
            <Banner tone="critical">
              <p>{error}</p>
            </Banner>
          </Box>
        )}

        {/* Owner Basic Information Summary */}
        <Box paddingBlockEnd="400">
          <Card>
            <BlockStack gap="400">
              <InlineStack align="space-between" blockAlign="center">
                <BlockStack gap="200">
                  <Text variant="headingLg" as="h1">
                    {ownerName || 'Owner'}
                  </Text>
                  <InlineStack gap="400" blockAlign="center">
                    {ownerEmail && (
                      <InlineStack gap="100" blockAlign="center">
                        <Text variant="bodyMd" as="span" tone="subdued">
                          Email:
                        </Text>
                        <Text variant="bodyMd" as="span" fontWeight="medium">
                          {ownerEmail}
                        </Text>
                      </InlineStack>
                    )}
                    <Text variant="bodyMd" as="span" tone="subdued">
                      |
                    </Text>
                    <InlineStack gap="100" blockAlign="center">
                      <Text variant="bodyMd" as="span" tone="subdued">
                        Properties Owned:
                      </Text>
                      <Text variant="bodyMd" as="span" fontWeight="semibold">
                        {propertiesCount}
                      </Text>
                    </InlineStack>
                  </InlineStack>
                </BlockStack>
                <Badge tone={owner.status === 'active' ? 'success' : 'subdued'}>
                  {owner.status === 'active' ? 'Active' : 'Inactive'}
                </Badge>
              </InlineStack>
            </BlockStack>
          </Card>
        </Box>

        <Layout>
          {/* Main content - Left column */}
          <Layout.Section>
            <BlockStack gap="400">
              {/* Content can be added here if needed */}
            </BlockStack>
          </Layout.Section>

          {/* Sidebar - Right column */}
          <Layout.Section variant="oneThird">
            <BlockStack gap="400">
              {/* Status card */}
              <Card>
                <BlockStack gap="200">
                  <Text variant="headingMd" as="h2">
                    Status
                  </Text>
                  <TextField
                    label="Status"
                    labelHidden
                    value={safeString(owner.status) === 'active' || !owner.status ? 'Active' : 'Inactive'}
                    readOnly
                    autoComplete="off"
                  />
                </BlockStack>
              </Card>
            </BlockStack>
          </Layout.Section>
        </Layout>
      </Page>

      {/* Send Connection Request Modal */}
      <SendConnectionRequest
        open={sendRequestModalOpen}
        onClose={handleCloseSendRequestModal}
        ownerId={owner?.id}
        ownerName={owner?.name}
      />
    </div>
  );
}
