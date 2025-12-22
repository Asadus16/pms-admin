'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import AddOwner from '@/components/AddOwner';
import { useAppDispatch, useAppSelector } from '@/store';
import { fetchPropertyManagerOwnerById } from '@/store/thunks';
import {
  selectCurrentOwner,
  selectOwnersLoading,
} from '@/store/slices/ownersSlice';
import { Page, Box, BlockStack, Spinner, Text } from '@shopify/polaris';

export default function EditOwnerPage() {
  const params = useParams();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const ownerId = params?.id;
  const basePath = '/property-manager';

  // Redux state
  const owner = useAppSelector(selectCurrentOwner);
  const isLoading = useAppSelector(selectOwnersLoading);

  // Fetch owner on mount
  useEffect(() => {
    if (ownerId) {
      dispatch(fetchPropertyManagerOwnerById(ownerId));
    }
  }, [dispatch, ownerId]);

  // Show loading while fetching
  if (isLoading || !owner) {
    return (
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
    );
  }

  return (
    <AddOwner
      mode="edit"
      initialOwner={owner}
      onClose={() => router.push(`${basePath}/owners/${ownerId}`)}
    />
  );
}
