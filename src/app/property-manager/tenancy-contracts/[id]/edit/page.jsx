'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import { fetchPropertyManagerTenancyContractById } from '@/store/thunks/property-manager/propertyManagerThunks';
import { 
  selectCurrentTenancyContract, 
  selectTenancyContractsLoading,
  selectTenancyContractsError,
  clearCurrentTenancyContract,
} from '@/store/slices/property-manager';
import AddTenancyContract from '@/components/AddTenancyContract';
import { Spinner, Page, Card, Box, Text, BlockStack, Button } from '@shopify/polaris';
import { ArrowLeftIcon } from '@shopify/polaris-icons';

export default function EditTenancyContractPage() {
  const params = useParams();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const contractId = params?.id ? String(params.id) : undefined;
  const basePath = '/property-manager';
  
  const contract = useAppSelector(selectCurrentTenancyContract);
  const loading = useAppSelector(selectTenancyContractsLoading);
  const error = useAppSelector(selectTenancyContractsError);

  useEffect(() => {
    if (contractId) {
      dispatch(fetchPropertyManagerTenancyContractById(contractId));
    }

    // Cleanup on unmount
    return () => {
      dispatch(clearCurrentTenancyContract());
    };
  }, [contractId, dispatch]);

  if (loading) {
    return (
      <Page>
        <Card>
          <Box padding="800">
            <BlockStack gap="400" inlineAlign="center">
              <Spinner size="large" />
              <Text variant="bodyMd" as="p" tone="subdued">
                Loading contract details...
              </Text>
            </BlockStack>
          </Box>
        </Card>
      </Page>
    );
  }

  if (error) {
    return (
      <Page>
        <Card>
          <Box padding="400">
            <BlockStack gap="200">
              <Text variant="headingMd" as="h2" tone="critical">
                Error loading contract
              </Text>
              <Text variant="bodyMd" as="p" tone="subdued">
                {error}
              </Text>
              <div>
                <Button icon={ArrowLeftIcon} onClick={() => router.push(`${basePath}/tenancy-contracts`)}>
                  Back to contracts
                </Button>
              </div>
            </BlockStack>
          </Box>
        </Card>
      </Page>
    );
  }

  if (!contract) {
    return (
      <Page>
        <Card>
          <Box padding="400">
            <BlockStack gap="200">
              <Text variant="headingMd" as="h2">
                Contract not found
              </Text>
              <Text variant="bodyMd" as="p" tone="subdued">
                We couldn&apos;t find a contract with ID: {contractId}
              </Text>
              <div>
                <Button icon={ArrowLeftIcon} onClick={() => router.push(`${basePath}/tenancy-contracts`)}>
                  Back to contracts
                </Button>
              </div>
            </BlockStack>
          </Box>
        </Card>
      </Page>
    );
  }

  return (
    <AddTenancyContract
      mode="edit"
      initialContract={contract}
      onClose={() => router.push(`${basePath}/tenancy-contracts/${contractId}`)}
    />
  );
}

