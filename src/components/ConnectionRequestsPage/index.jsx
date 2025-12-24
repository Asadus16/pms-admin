'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import {
  Page,
  Card,
  Text,
  Badge,
  Button,
  BlockStack,
  InlineStack,
  Box,
  Banner,
  Spinner,
  IndexTable,
  EmptyState,
  ButtonGroup,
  Icon,
} from '@shopify/polaris';
import { PersonIcon, CheckIcon, XIcon } from '@shopify/polaris-icons';
import { useAppDispatch, useAppSelector } from '@/store';
import {
  fetchOwnerConnectionRequests,
  updateConnectionRequestStatus,
} from '@/store/thunks';
import {
  selectConnectionRequests,
  selectConnectionRequestsLoading,
  selectConnectionRequestsUpdating,
  selectConnectionRequestsError,
} from '@/store/slices/property-manager/connection-requests/slice';

function ConnectionRequestsPage() {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useAppDispatch();

  const requests = useAppSelector(selectConnectionRequests);
  const isLoading = useAppSelector(selectConnectionRequestsLoading);
  const isUpdating = useAppSelector(selectConnectionRequestsUpdating);
  const error = useAppSelector(selectConnectionRequestsError);

  const basePath = pathname?.split('/')[1] ? `/${pathname.split('/')[1]}` : '/property-manager';

  useEffect(() => {
    dispatch(fetchOwnerConnectionRequests());
  }, [dispatch]);

  const handleAccept = useCallback(async (requestId) => {
    try {
      await dispatch(updateConnectionRequestStatus({
        id: requestId,
        status: 'accepted',
      })).unwrap();
      // Refresh requests
      dispatch(fetchOwnerConnectionRequests());
    } catch (err) {
      console.error('Error accepting request:', err);
    }
  }, [dispatch]);

  const handleDeny = useCallback(async (requestId) => {
    try {
      await dispatch(updateConnectionRequestStatus({
        id: requestId,
        status: 'denied',
      })).unwrap();
      // Refresh requests
      dispatch(fetchOwnerConnectionRequests());
    } catch (err) {
      console.error('Error denying request:', err);
    }
  }, [dispatch]);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return <Badge tone="attention">Pending</Badge>;
      case 'accepted':
        return <Badge tone="success">Accepted</Badge>;
      case 'denied':
        return <Badge tone="critical">Denied</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    if (Number.isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: '2-digit' });
  };

  const renderRequestRow = (request, isReceived = false, index = 0) => {
    const otherUser = isReceived ? request.sender : request.receiver;
    const isPending = request.status === 'pending';
    const canAcceptDeny = isReceived && isPending;

    return (
      <IndexTable.Row
        id={String(request.id)}
        key={request.id}
        position={index}
      >
        <IndexTable.Cell>
          <BlockStack gap="100">
            <Text variant="bodyMd" fontWeight="semibold" as="span">
              {otherUser?.name || 'Unknown'}
            </Text>
            <Text variant="bodySm" as="span" tone="subdued">
              {otherUser?.email || ''}
            </Text>
          </BlockStack>
        </IndexTable.Cell>
        <IndexTable.Cell>
          <Text variant="bodyMd" as="span">
            {otherUser?.phone || '-'}
          </Text>
        </IndexTable.Cell>
        <IndexTable.Cell>
          <Text variant="bodyMd" as="span">
            {otherUser?.properties_count || 0} properties
          </Text>
        </IndexTable.Cell>
        <IndexTable.Cell>
          {getStatusBadge(request.status)}
        </IndexTable.Cell>
        <IndexTable.Cell>
          <Text variant="bodySm" as="span" tone="subdued">
            {formatDate(request.created_at)}
          </Text>
        </IndexTable.Cell>
        <IndexTable.Cell>
          {canAcceptDeny ? (
            <ButtonGroup>
              <Button
                icon={CheckIcon}
                onClick={() => handleAccept(request.id)}
                loading={isUpdating}
                size="slim"
              >
                Accept
              </Button>
              <Button
                icon={XIcon}
                onClick={() => handleDeny(request.id)}
                loading={isUpdating}
                tone="critical"
                size="slim"
              >
                Deny
              </Button>
            </ButtonGroup>
          ) : (
            <Text variant="bodySm" as="span" tone="subdued">
              {isReceived ? 'You can accept/deny this request' : 'Waiting for response'}
            </Text>
          )}
        </IndexTable.Cell>
      </IndexTable.Row>
    );
  };

  const renderRequestsTable = (title, requestsList, isReceived = false) => {
    if (isLoading) {
      return (
        <Box padding="1000">
          <BlockStack gap="400" inlineAlign="center">
            <Spinner size="large" />
            <Text variant="bodyMd" as="p" tone="subdued">
              Loading {title.toLowerCase()}...
            </Text>
          </BlockStack>
        </Box>
      );
    }

    if (!requestsList || requestsList.length === 0) {
      return (
        <EmptyState
          heading={`No ${title.toLowerCase()}`}
          image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
        >
          <p>You don&apos;t have any {title.toLowerCase()} at the moment.</p>
        </EmptyState>
      );
    }

    return (
      <Card>
        <Box padding="400" paddingBlockEnd="200">
          <Text variant="headingMd" as="h2">
            {title} ({requestsList.length})
          </Text>
        </Box>
        <IndexTable
          resourceName={{ singular: 'request', plural: 'requests' }}
          itemCount={requestsList.length}
          headings={[
            { title: 'Owner/Property Manager' },
            { title: 'Phone' },
            { title: 'Properties' },
            { title: 'Status' },
            { title: 'Date' },
            { title: 'Actions' },
          ]}
        >
          {requestsList.map((request, index) => renderRequestRow(request, isReceived, index))}
        </IndexTable>
      </Card>
    );
  };

  return (
    <Page
      title={
        <InlineStack gap="200" blockAlign="center">
          <Icon source={PersonIcon} />
          <span>Connection Requests</span>
        </InlineStack>
      }
      backAction={{
        content: 'Owners',
        onAction: () => router.push(`${basePath}/owners`),
      }}
    >
      {error && (
        <Box paddingBlockEnd="400">
          <Banner tone="critical" onDismiss={() => {}}>
            <p>{error}</p>
          </Banner>
        </Box>
      )}

      <BlockStack gap="600">
        {renderRequestsTable('Received Requests', requests.received, true)}

        {renderRequestsTable('Sent Requests', requests.sent, false)}

        {renderRequestsTable('Approved Connections', requests.approved, false)}
      </BlockStack>
    </Page>
  );
}

export default ConnectionRequestsPage;

