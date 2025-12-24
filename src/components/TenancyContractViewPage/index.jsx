'use client';

import { useMemo, useCallback, useState, useEffect } from 'react';
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
  Popover,
  ActionList,
  Badge,
  Spinner,
  Link,
} from '@shopify/polaris';
import { FileIcon, ChevronRightIcon, ArrowLeftIcon } from '@shopify/polaris-icons';
import { useAppDispatch, useAppSelector } from '@/store';
import { fetchPropertyManagerTenancyContractById, deletePropertyManagerTenancyContract } from '@/store/thunks/property-manager/propertyManagerThunks';
import {
  selectCurrentTenancyContract,
  selectTenancyContractsLoading,
  selectTenancyContractsError,
  clearCurrentTenancyContract,
} from '@/store/slices/property-manager';
import './AddDeveloper.css';

function formatDate(dateStr) {
  if (!dateStr) return 'N/A';
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
}

function formatCurrency(amount) {
  if (!amount) return 'N/A';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'AED',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(parseFloat(amount));
}

export default function TenancyContractViewPage({ contractId }) {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const [actionsPopoverActive, setActionsPopoverActive] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Redux state
  const contract = useAppSelector(selectCurrentTenancyContract);
  const loading = useAppSelector(selectTenancyContractsLoading);
  const error = useAppSelector(selectTenancyContractsError);

  const basePath = useMemo(() => {
    const seg = pathname?.split('/')?.[1];
    return seg ? `/${seg}` : '/property-manager';
  }, [pathname]);

  // Fetch contract data from API
  useEffect(() => {
    if (contractId) {
      dispatch(fetchPropertyManagerTenancyContractById(contractId));
    }

    // Cleanup on unmount
    return () => {
      dispatch(clearCurrentTenancyContract());
    };
  }, [contractId, dispatch]);

  // Extract related data from contract
  const property = contract?.property || null;
  const tenant = contract?.tenant || null;
  const owner = contract?.owner || null;
  const createdBy = contract?.created_by_user || null;

  const handleBack = useCallback(() => {
    router.push(`${basePath}/tenancy-contracts`);
  }, [router, basePath]);

  const toggleActionsPopover = useCallback(() => {
    setActionsPopoverActive((active) => !active);
  }, []);

  const handleEdit = useCallback(() => {
    setActionsPopoverActive(false);
    router.push(`${basePath}/tenancy-contracts/${contractId}/edit`);
  }, [router, basePath, contractId]);

  const handleDelete = useCallback(async () => {
    if (!window.confirm('Are you sure you want to delete this tenancy contract? This action cannot be undone.')) {
      return;
    }

    setDeleting(true);
    try {
      await dispatch(deletePropertyManagerTenancyContract(contractId)).unwrap();
      router.push(`${basePath}/tenancy-contracts`);
    } catch (err) {
      console.error('Error deleting contract:', err);
      alert('Failed to delete contract. Please try again.');
      setDeleting(false);
    }
  }, [dispatch, contractId, router, basePath]);

  // Loading state
  if (loading) {
    return (
      <div className="add-developer-wrapper">
        <div className="view-user-header">
          <InlineStack gap="050" blockAlign="center">
            <Icon source={FileIcon} tone="base" />
            <Icon source={ChevronRightIcon} tone="subdued" />
            <span className="new-developer-title">Tenancy Contract Details</span>
          </InlineStack>
        </div>
        <Page>
          <Card>
            <Box padding="800">
              <InlineStack align="center" blockAlign="center">
                <Spinner size="large" />
              </InlineStack>
            </Box>
          </Card>
        </Page>
      </div>
    );
  }

  // Error or not found state
  if (error || !contract) {
    return (
      <Page
        title="Tenancy Contract"
        backAction={{ content: 'Tenancy Contracts', onAction: handleBack }}
      >
        <Card>
          <Box padding="400">
            <BlockStack gap="200">
              <Text variant="headingMd" as="h2">
                {error ? 'Error loading contract' : 'Contract not found'}
              </Text>
              <Text variant="bodyMd" as="p" tone="subdued">
                {error || `We couldn't find a contract with ID: ${contractId}`}
              </Text>
              <div>
                <Button icon={ArrowLeftIcon} onClick={handleBack}>
                  Back to contracts
                </Button>
              </div>
            </BlockStack>
          </Box>
        </Card>
      </Page>
    );
  }

  const actionsPopoverActivator = (
    <Button onClick={toggleActionsPopover} disclosure="down" loading={deleting}>
      More actions
    </Button>
  );

  const actionItems = [
    {
      content: 'Edit',
      onAction: handleEdit,
    },
    {
      content: 'Delete',
      destructive: true,
      onAction: handleDelete,
    },
  ];

  const statusTone = contract.status === 'Active' ? 'success' : 
                    contract.status === 'Expired' ? 'subdued' : 
                    contract.status === 'Renewed' ? 'info' : 
                    contract.status === 'Terminated' ? 'critical' : 'subdued';

  return (
    <div className="add-developer-wrapper">
      <div className="view-user-header">
        <InlineStack gap="050" blockAlign="center">
          <Icon source={FileIcon} tone="base" />
          <Icon source={ChevronRightIcon} tone="subdued" />
          <span className="new-developer-title">Tenancy Contract Details</span>
        </InlineStack>
      </div>

      <Page
        title={contract.tenancy_id || `Contract #${contract.id}`}
        backAction={{ content: 'Tenancy Contracts', onAction: handleBack }}
        primaryAction={{
          content: 'Edit',
          onAction: handleEdit,
        }}
        secondaryActions={[
          {
            content: actionsPopoverActivator,
            onAction: toggleActionsPopover,
          },
        ]}
      >
        <Popover
          active={actionsPopoverActive}
          activator={actionsPopoverActivator}
          onClose={toggleActionsPopover}
          preferredAlignment="right"
        >
          <ActionList items={actionItems} />
        </Popover>

        <Layout>
          {/* Contract Overview */}
          <Layout.Section>
            <Card>
              <BlockStack gap="400">
                <InlineStack align="space-between" blockAlign="center">
                  <Text variant="headingMd" as="h2">
                    Contract Overview
                  </Text>
                  <Badge tone={statusTone}>
                    {contract.status || 'N/A'}
                  </Badge>
                </InlineStack>

                <BlockStack gap="300">
                  <InlineStack gap="400">
                    <Box minWidth="200px">
                      <Text variant="bodySm" tone="subdued" as="p">
                        Tenancy ID
                      </Text>
                      <Text variant="bodyMd" fontWeight="semibold" as="p">
                        {contract.tenancy_id || `TEN-${contract.id}`}
                      </Text>
                    </Box>
                    {contract.registration_number && (
                      <Box minWidth="200px">
                        <Text variant="bodySm" tone="subdued" as="p">
                          Registration Number
                        </Text>
                        <Text variant="bodyMd" as="p">
                          {contract.registration_number}
                        </Text>
                      </Box>
                    )}
                  </InlineStack>

                  <InlineStack gap="400">
                    <Box minWidth="200px">
                      <Text variant="bodySm" tone="subdued" as="p">
                        Start Date
                      </Text>
                      <Text variant="bodyMd" as="p">
                        {formatDate(contract.contract_start_date)}
                      </Text>
                    </Box>
                    <Box minWidth="200px">
                      <Text variant="bodySm" tone="subdued" as="p">
                        End Date
                      </Text>
                      <Text variant="bodyMd" as="p">
                        {formatDate(contract.contract_end_date)}
                      </Text>
                    </Box>
                  </InlineStack>
                </BlockStack>
              </BlockStack>
            </Card>
          </Layout.Section>

          {/* Property Information */}
          <Layout.Section>
            <Card>
              <BlockStack gap="400">
                <Text variant="headingMd" as="h2">
                  Property Information
                </Text>
                {property ? (
                  <BlockStack gap="300">
                    <InlineStack gap="400">
                      <Box minWidth="200px">
                        <Text variant="bodySm" tone="subdued" as="p">
                          Unit Number
                        </Text>
                        <Text variant="bodyMd" as="p">
                          {property.unit_number || 'N/A'}
                        </Text>
                      </Box>
                      <Box minWidth="200px">
                        <Text variant="bodySm" tone="subdued" as="p">
                          Building Name
                        </Text>
                        <Text variant="bodyMd" as="p">
                          {property.building_name || 'N/A'}
                        </Text>
                      </Box>
                      <Box minWidth="200px">
                        <Text variant="bodySm" tone="subdued" as="p">
                          Type
                        </Text>
                        <Text variant="bodyMd" as="p">
                          {property.type || 'N/A'}
                        </Text>
                      </Box>
                    </InlineStack>
                    <div>
                      <Button
                        size="slim"
                        onClick={() => router.push(`${basePath}/properties/${property.id}`)}
                      >
                        View Property Details
                      </Button>
                    </div>
                  </BlockStack>
                ) : (
                  <Text variant="bodyMd" tone="subdued" as="p">
                    Property information not available
                  </Text>
                )}
              </BlockStack>
            </Card>
          </Layout.Section>

          {/* Tenant Information */}
          <Layout.Section>
            <Card>
              <BlockStack gap="400">
                <Text variant="headingMd" as="h2">
                  Tenant Information
                </Text>
                {tenant ? (
                  <BlockStack gap="300">
                    <InlineStack gap="400">
                      <Box minWidth="200px">
                        <Text variant="bodySm" tone="subdued" as="p">
                          Name
                        </Text>
                        <Text variant="bodyMd" fontWeight="semibold" as="p">
                          {tenant.full_name || tenant.name || 'N/A'}
                        </Text>
                      </Box>
                      {tenant.contact_id && (
                        <Box minWidth="200px">
                          <Text variant="bodySm" tone="subdued" as="p">
                            Contact ID
                          </Text>
                          <Text variant="bodyMd" as="p">
                            {tenant.contact_id}
                          </Text>
                        </Box>
                      )}
                    </InlineStack>
                    <InlineStack gap="400">
                      {tenant.email && (
                        <Box minWidth="200px">
                          <Text variant="bodySm" tone="subdued" as="p">
                            Email
                          </Text>
                          <Text variant="bodyMd" as="p">
                            {tenant.email}
                          </Text>
                        </Box>
                      )}
                      {tenant.phone && (
                        <Box minWidth="200px">
                          <Text variant="bodySm" tone="subdued" as="p">
                            Phone
                          </Text>
                          <Text variant="bodyMd" as="p">
                            {tenant.phone}
                          </Text>
                        </Box>
                      )}
                    </InlineStack>
                    <div>
                      <Button
                        size="slim"
                        onClick={() => router.push(`${basePath}/contacts/${tenant.id}`)}
                      >
                        View Tenant Details
                      </Button>
                    </div>
                  </BlockStack>
                ) : (
                  <Text variant="bodyMd" tone="subdued" as="p">
                    Tenant information not available
                  </Text>
                )}
              </BlockStack>
            </Card>
          </Layout.Section>

          {/* Owner Information */}
          <Layout.Section>
            <Card>
              <BlockStack gap="400">
                <Text variant="headingMd" as="h2">
                  Owner Information
                </Text>
                {owner ? (
                  <BlockStack gap="300">
                    <InlineStack gap="400">
                      <Box minWidth="200px">
                        <Text variant="bodySm" tone="subdued" as="p">
                          Name
                        </Text>
                        <Text variant="bodyMd" fontWeight="semibold" as="p">
                          {owner.name || 'N/A'}
                        </Text>
                      </Box>
                      {owner.email && (
                        <Box minWidth="200px">
                          <Text variant="bodySm" tone="subdued" as="p">
                            Email
                          </Text>
                          <Text variant="bodyMd" as="p">
                            {owner.email}
                          </Text>
                        </Box>
                      )}
                    </InlineStack>
                    <div>
                      <Button
                        size="slim"
                        onClick={() => router.push(`${basePath}/owners/${owner.id}`)}
                      >
                        View Owner Details
                      </Button>
                    </div>
                  </BlockStack>
                ) : (
                  <Text variant="bodyMd" tone="subdued" as="p">
                    Owner information not available
                  </Text>
                )}
              </BlockStack>
            </Card>
          </Layout.Section>

          {/* Rent Information */}
          <Layout.Section>
            <Card>
              <BlockStack gap="400">
                <Text variant="headingMd" as="h2">
                  Rent Information
                </Text>
                <BlockStack gap="300">
                  <InlineStack gap="400">
                    <Box minWidth="200px">
                      <Text variant="bodySm" tone="subdued" as="p">
                        Rent Amount
                      </Text>
                      <Text variant="bodyMd" fontWeight="semibold" as="p">
                        {formatCurrency(contract.rent_amount)}
                      </Text>
                    </Box>
                    <Box minWidth="200px">
                      <Text variant="bodySm" tone="subdued" as="p">
                        Payment Frequency
                      </Text>
                      <Text variant="bodyMd" as="p">
                        {contract.rent_payment_frequency || 'N/A'}
                      </Text>
                    </Box>
                  </InlineStack>
                </BlockStack>
              </BlockStack>
            </Card>
          </Layout.Section>

          {/* Security Deposit & Agency Fee */}
          <Layout.Section>
            <Card>
              <BlockStack gap="400">
                <Text variant="headingMd" as="h2">
                  Security Deposit & Agency Fee
                </Text>
                <BlockStack gap="300">
                  <InlineStack gap="400">
                    <Box minWidth="200px">
                      <Text variant="bodySm" tone="subdued" as="p">
                        Security Deposit Amount
                      </Text>
                      <Text variant="bodyMd" as="p">
                        {formatCurrency(contract.security_deposit_amount)}
                      </Text>
                    </Box>
                    <Box minWidth="200px">
                      <Text variant="bodySm" tone="subdued" as="p">
                        Deposit Status
                      </Text>
                      <Text variant="bodyMd" as="p">
                        {contract.security_deposit_status || 'N/A'}
                      </Text>
                    </Box>
                  </InlineStack>
                  <InlineStack gap="400">
                    <Box minWidth="200px">
                      <Text variant="bodySm" tone="subdued" as="p">
                        Agency Fee
                      </Text>
                      <Text variant="bodyMd" as="p">
                        {formatCurrency(contract.agency_fee)}
                      </Text>
                    </Box>
                    <Box minWidth="200px">
                      <Text variant="bodySm" tone="subdued" as="p">
                        Agency Fee Status
                      </Text>
                      <Text variant="bodyMd" as="p">
                        {contract.agency_fee_status || 'N/A'}
                      </Text>
                    </Box>
                  </InlineStack>
                </BlockStack>
              </BlockStack>
            </Card>
          </Layout.Section>

          {/* Additional Information */}
          <Layout.Section>
            <Card>
              <BlockStack gap="400">
                <Text variant="headingMd" as="h2">
                  Additional Information
                </Text>
                <BlockStack gap="300">
                  <Box>
                    <Text variant="bodySm" tone="subdued" as="p">
                      Maintenance Responsibility
                    </Text>
                    <Text variant="bodyMd" as="p">
                      {contract.maintenance_responsibility || 'N/A'}
                    </Text>
                  </Box>
                  {contract.included_utilities && contract.included_utilities.length > 0 && (
                    <Box>
                      <Text variant="bodySm" tone="subdued" as="p">
                        Included Utilities
                      </Text>
                      <Text variant="bodyMd" as="p">
                        {Array.isArray(contract.included_utilities)
                          ? contract.included_utilities.join(', ')
                          : contract.included_utilities}
                      </Text>
                    </Box>
                  )}
                </BlockStack>
              </BlockStack>
            </Card>
          </Layout.Section>

          {/* Contract Document */}
          {contract.contract_file_path && (
            <Layout.Section>
              <Card>
                <BlockStack gap="400">
                  <Text variant="headingMd" as="h2">
                    Contract Document
                  </Text>
                  <div>
                    <Link url={contract.contract_file_path} external>
                      <Button>
                        View Contract PDF
                      </Button>
                    </Link>
                  </div>
                </BlockStack>
              </Card>
            </Layout.Section>
          )}

          {/* Created By */}
          {createdBy && (
            <Layout.Section>
              <Card>
                <BlockStack gap="300">
                  <Text variant="bodySm" tone="subdued" as="p">
                    Created by {createdBy.name || createdBy.email || 'Property Manager'} on {formatDate(contract.created_at)}
                  </Text>
                </BlockStack>
              </Card>
            </Layout.Section>
          )}
        </Layout>
      </Page>
    </div>
  );
}

