'use client';

import { useParams, useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import AddDeveloper from '@/components/AddDeveloper';
import { useAppDispatch, useAppSelector } from '@/store';
import { fetchPropertyManagerDeveloperById } from '@/store/thunks/property-manager/propertyManagerThunks';
import {
  selectDeveloper,
  selectDevelopersLoading,
  selectDevelopersError,
} from '@/store/slices/property-manager';
import { Page, Card, Box, Text, BlockStack, Button } from '@shopify/polaris';
import { ArrowLeftIcon } from '@shopify/polaris-icons';

export default function EditDeveloperPage() {
  const params = useParams();
  const router = useRouter();
  const pathname = usePathname();
  const developerId = params?.id ? String(params.id) : undefined;
  
  // Get the base path (userType) from the current pathname
  const basePath = pathname?.split('/')[1] ? `/${pathname.split('/')[1]}` : '/property-manager';

  const dispatch = useAppDispatch();
  
  // Redux state
  const developerFromStore = useAppSelector(selectDeveloper);
  const loading = useAppSelector(selectDevelopersLoading);
  const error = useAppSelector(selectDevelopersError);

  // Transform developer data for AddDeveloper component
  const [developer, setDeveloper] = useState(null);

  // Fetch developer from API
  useEffect(() => {
    if (!developerId) return;
    dispatch(fetchPropertyManagerDeveloperById(developerId));
  }, [developerId, dispatch]);

  // Transform developer data when it's loaded
  useEffect(() => {
    if (developerFromStore) {
      const transformedDeveloper = {
        ...developerFromStore,
        developerName: developerFromStore.name, // Alternative field name
        contactName: developerFromStore.primaryContactName, // Alternative field name
        contactEmail: developerFromStore.primaryContactEmail, // Alternative field name
        contactPhone: developerFromStore.primaryContactNumber, // Alternative field name
        phoneCountryCode: 'AE', // Default, could be extracted from phone if needed
        videos: developerFromStore._apiData?.videos || [],
      };
      setDeveloper(transformedDeveloper);
    }
  }, [developerFromStore]);

  const handleClose = () => {
    router.push(`${basePath}/developers/${developerId}`);
  };

  if (loading) {
    return (
      <Page
        title="Edit Developer"
        backAction={{ content: 'Back', onAction: handleClose }}
      >
        <Card>
          <Box padding="400">
            <Text>Loading developer...</Text>
          </Box>
        </Card>
      </Page>
    );
  }

  if (error || !developer) {
    return (
      <Page
        title="Edit Developer"
        backAction={{ content: 'Back', onAction: () => router.push(`${basePath}/developers`) }}
      >
        <Card>
          <Box padding="400">
            <BlockStack gap="200">
              <Text variant="headingMd" as="h2">
                {error ? 'Error loading developer' : 'Developer not found'}
              </Text>
              <Text variant="bodyMd" as="p" tone="subdued">
                {error || `We couldn't find a developer with ID: ${developerId}`}
              </Text>
              <div>
                <Button icon={ArrowLeftIcon} onClick={() => router.push(`${basePath}/developers`)}>
                  Back to developers
                </Button>
              </div>
            </BlockStack>
          </Box>
        </Card>
      </Page>
    );
  }

  return (
    <AddDeveloper
      mode="edit"
      initialDeveloper={developer}
      onClose={handleClose}
    />
  );
}

