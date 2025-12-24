'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import AddProperty from '@/components/AddProperty';
import { useAppDispatch, useAppSelector } from '@/store';
import { fetchPropertyManagerPropertyById } from '@/store/thunks';
import {
  selectCurrentProperty,
  selectPropertiesLoading,
  selectPropertiesError,
  clearCurrentProperty,
} from '@/store/slices/property-manager';
import { Page, Box, BlockStack, Spinner, Text } from '@shopify/polaris';

export default function EditPropertyPage() {
  const params = useParams();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const propertyId = params?.id;
  const basePath = '/property-manager';

  // Redux state
  const property = useAppSelector(selectCurrentProperty);
  const isLoading = useAppSelector(selectPropertiesLoading);
  const error = useAppSelector(selectPropertiesError);

  // Fetch property on mount
  useEffect(() => {
    if (propertyId) {
      dispatch(fetchPropertyManagerPropertyById(propertyId));
    }

    // Cleanup on unmount
    return () => {
      dispatch(clearCurrentProperty());
    };
  }, [dispatch, propertyId]);

  // Show loading while fetching
  if (isLoading) {
    return (
      <Page>
        <Box padding="1000">
          <BlockStack gap="400" inlineAlign="center">
            <Spinner size="large" />
            <Text variant="bodyMd" as="p" tone="subdued">
              Loading property details...
            </Text>
          </BlockStack>
        </Box>
      </Page>
    );
  }

  // Show error
  if (error) {
    return (
      <Page>
        <Box padding="1000">
          <BlockStack gap="400" inlineAlign="center">
            <Text variant="headingMd" as="h2" tone="critical">
              Error loading property
            </Text>
            <Text variant="bodyMd" as="p" tone="subdued">
              {error}
            </Text>
          </BlockStack>
        </Box>
      </Page>
    );
  }

  // Show not found
  if (!property) {
    return (
      <Page>
        <Box padding="1000">
          <BlockStack gap="400" inlineAlign="center">
            <Text variant="headingMd" as="h2">
              Property not found
            </Text>
            <Text variant="bodyMd" as="p" tone="subdued">
              We couldn&apos;t find a property with ID: {propertyId}
            </Text>
          </BlockStack>
        </Box>
      </Page>
    );
  }

  return (
    <AddProperty
      mode="edit"
      initialProperty={property}
      onClose={() => router.push(`${basePath}/properties/${propertyId}`)}
    />
  );
}
