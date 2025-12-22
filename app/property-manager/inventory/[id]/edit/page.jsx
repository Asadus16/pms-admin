'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import AddInventory from '@/components/AddInventory';
import { useAppDispatch, useAppSelector } from '@/store';
import { fetchPropertyManagerInventoryById } from '@/store/thunks';
import {
  selectCurrentInventory,
  selectInventoryLoading,
} from '@/store/slices/property-manager/inventory/slice';
import { Page, Box, BlockStack, Spinner, Text } from '@shopify/polaris';

export default function EditInventoryPage() {
  const params = useParams();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const inventoryId = params?.id;
  const basePath = '/property-manager';

  // Redux state
  const inventory = useAppSelector(selectCurrentInventory);
  const isLoading = useAppSelector(selectInventoryLoading);

  // Fetch inventory on mount
  useEffect(() => {
    if (inventoryId) {
      dispatch(fetchPropertyManagerInventoryById(inventoryId));
    }
  }, [dispatch, inventoryId]);

  // Show loading while fetching
  if (isLoading || !inventory) {
    return (
      <Page>
        <Box padding="1000">
          <BlockStack gap="400" inlineAlign="center">
            <Spinner size="large" />
            <Text variant="bodyMd" as="p" tone="subdued">
              Loading inventory details...
            </Text>
          </BlockStack>
        </Box>
      </Page>
    );
  }

  return (
    <AddInventory
      mode="edit"
      initialInventory={inventory}
      onClose={() => router.push(`${basePath}/inventory/${inventoryId}`)}
    />
  );
}
