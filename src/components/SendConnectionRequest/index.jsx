'use client';

import { useState, useCallback, useEffect } from 'react';
import {
  Modal,
  TextField,
  Button,
  BlockStack,
  InlineStack,
  Text,
  Banner,
  Spinner,
  Box,
  EmptyState,
} from '@shopify/polaris';
import { SearchIcon } from '@shopify/polaris-icons';
import { useAppDispatch, useAppSelector } from '@/store';
import { sendOwnerConnectionRequest } from '@/store/thunks';
import {
  selectConnectionRequestsSending,
  selectConnectionRequestsError,
  selectConnectionRequestsValidationErrors,
  clearError,
} from '@/store/slices/property-manager/connection-requests/slice';

function SendConnectionRequest({ open, onClose, ownerId: initialOwnerId = null, ownerName: initialOwnerName = null }) {
  const dispatch = useAppDispatch();
  const isSending = useAppSelector(selectConnectionRequestsSending);
  const error = useAppSelector(selectConnectionRequestsError);
  const validationErrors = useAppSelector(selectConnectionRequestsValidationErrors);

  const [ownerId, setOwnerId] = useState(initialOwnerId ? String(initialOwnerId) : '');
  const [ownerName, setOwnerName] = useState(initialOwnerName || '');

  // Clear errors when modal opens/closes
  useEffect(() => {
    if (open) {
      dispatch(clearError());
      if (initialOwnerId) {
        setOwnerId(String(initialOwnerId));
        setOwnerName(initialOwnerName || '');
      } else {
        setOwnerId('');
        setOwnerName('');
      }
    }
  }, [open, dispatch, initialOwnerId, initialOwnerName]);

  const handleOwnerIdChange = useCallback((value) => {
    setOwnerId(value);
    dispatch(clearError());
  }, [dispatch]);

  const handleSendRequest = useCallback(async () => {
    if (!ownerId.trim()) {
      return;
    }

    try {
      await dispatch(sendOwnerConnectionRequest({
        receiver_id: parseInt(ownerId, 10),
      })).unwrap();
      
      // Success - close modal
      onClose();
    } catch (err) {
      // Error is handled by Redux state
      console.error('Error sending connection request:', err);
    }
  }, [dispatch, ownerId, onClose]);

  const getFieldError = (field) => {
    if (!validationErrors) return null;
    const errors = validationErrors[field];
    return errors ? errors[0] : null;
  };

  const ownerIdError = getFieldError('receiver_id');

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Send Connection Request"
      primaryAction={{
        content: 'Send Request',
        onAction: handleSendRequest,
        loading: isSending,
        disabled: !ownerId.trim() || isSending,
      }}
      secondaryActions={[
        {
          content: 'Cancel',
          onAction: onClose,
          disabled: isSending,
        },
      ]}
    >
      <Modal.Section>
        <BlockStack gap="400">
          {error && (
            <Banner tone="critical" onDismiss={() => dispatch(clearError())}>
              <p>{error}</p>
            </Banner>
          )}

          <Text variant="bodyMd" as="p" tone="subdued">
            Send a connection request to an owner. Once they accept, you&apos;ll be automatically assigned to manage all their properties.
          </Text>

          {initialOwnerName && (
            <Banner tone="info">
              <p>Owner: <strong>{initialOwnerName}</strong></p>
            </Banner>
          )}

          <TextField
            label="Owner User ID"
            value={ownerId}
            onChange={handleOwnerIdChange}
            type="number"
            placeholder="Enter owner user ID"
            error={ownerIdError}
            helpText="Enter the user ID of the owner you want to connect with"
            autoComplete="off"
            disabled={!!initialOwnerId}
          />

          {!initialOwnerId && (
            <Banner tone="info">
              <p>
                You need the owner&apos;s user ID to send a connection request. 
                You can find this in the owners list or by contacting the owner directly.
              </p>
            </Banner>
          )}
        </BlockStack>
      </Modal.Section>
    </Modal>
  );
}

export default SendConnectionRequest;

