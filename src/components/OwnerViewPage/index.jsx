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
} from '@shopify/polaris';
import { PersonIcon, ChevronRightIcon, ArrowLeftIcon, NoteIcon } from '@shopify/polaris-icons';
import { useAppDispatch, useAppSelector } from '@/store';
import {
  fetchPropertyManagerOwnerById,
  updatePropertyManagerOwnerStatus,
} from '@/store/thunks';
import {
  selectCurrentOwner,
  selectOwnersLoading,
  selectOwnersUpdating,
  selectOwnersError,
  clearCurrentOwner,
} from '@/store/slices/ownersSlice';
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

  // Redux state
  const owner = useAppSelector(selectCurrentOwner);
  const isLoading = useAppSelector(selectOwnersLoading);
  const isUpdating = useAppSelector(selectOwnersUpdating);
  const error = useAppSelector(selectOwnersError);

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

        <Layout>
          {/* Main content - Left column */}
          <Layout.Section>
            <BlockStack gap="400">
              {/* Owner Details card */}
              <Card>
                <BlockStack gap="400">
                  <Text variant="headingMd" as="h2">
                    Owner Details
                  </Text>

                  <TextField
                    label="Owner ID"
                    value={ownerDisplayId}
                    readOnly
                    autoComplete="off"
                    helpText="Auto Generated"
                  />

                  <TextField
                    label="Owner Type"
                    value={ownerTypeLabels[ownerType] || ownerType}
                    readOnly
                    autoComplete="off"
                  />

                  <TextField
                    label="Owner Name"
                    value={safeString(owner.name)}
                    readOnly
                    autoComplete="off"
                  />

                  <TextField
                    label="Nationality"
                    value={countryLabels[owner.nationality] || safeString(owner.nationality)}
                    readOnly
                    autoComplete="off"
                  />

                  <TextField
                    label="Country of Residence"
                    value={countryLabels[countryOfResidence] || countryOfResidence}
                    readOnly
                    autoComplete="off"
                  />

                  <TextField
                    label="Email"
                    value={safeString(owner.email)}
                    readOnly
                    autoComplete="off"
                  />

                  <TextField
                    label="Phone / Whatsapp"
                    value={safeString(owner.phone)}
                    readOnly
                    autoComplete="off"
                  />

                  <TextField
                    label="Address"
                    value={safeString(owner.address)}
                    multiline={2}
                    readOnly
                    autoComplete="off"
                  />

                  <TextField
                    label="Preferred Contact Channel"
                    value={contactChannelLabels[preferredContactChannel] || preferredContactChannel}
                    readOnly
                    autoComplete="off"
                  />

                  <TextField
                    label="Notes & Instructions"
                    value={notesInstructions}
                    multiline={3}
                    readOnly
                    autoComplete="off"
                  />

                  {/* Quick meta field */}
                  <TextField
                    label="Date added"
                    value={formatDate(dateAdded)}
                    readOnly
                    autoComplete="off"
                  />
                </BlockStack>
              </Card>

              {/* KYC Details card */}
              <Card>
                <BlockStack gap="400">
                  <Text variant="headingMd" as="h2">
                    KYC Details
                  </Text>

                  {/* Passport Copy */}
                  <BlockStack gap="200">
                    <Text variant="bodyMd" as="span">
                      Passport Copy
                    </Text>
                    {renderFileInfo(passportCopy, 'Passport copy')}
                  </BlockStack>

                  {/* ID Card Copy */}
                  <BlockStack gap="200">
                    <Text variant="bodyMd" as="span">
                      ID Card Copy
                    </Text>
                    {renderFileInfo(idCardCopy, 'ID card copy')}
                  </BlockStack>

                  {/* Trade License */}
                  <BlockStack gap="200">
                    <Text variant="bodyMd" as="span">
                      Trade License
                    </Text>
                    {renderFileInfo(tradeLicense, 'Trade license')}
                  </BlockStack>

                  <TextField
                    label="Tax / VAT ID"
                    value={taxVatId}
                    readOnly
                    autoComplete="off"
                  />
                </BlockStack>
              </Card>

              {/* Bank Details card */}
              <Card>
                <BlockStack gap="400">
                  <Text variant="headingMd" as="h2">
                    Bank Details
                  </Text>

                  <TextField
                    label="IBAN"
                    value={safeString(owner.iban)}
                    readOnly
                    autoComplete="off"
                  />

                  <TextField
                    label="Bank Number"
                    value={bankNumber}
                    readOnly
                    autoComplete="off"
                  />

                  <TextField
                    label="Branch"
                    value={bankBranch}
                    readOnly
                    autoComplete="off"
                  />

                  <TextField
                    label="Bank Name"
                    value={bankName}
                    readOnly
                    autoComplete="off"
                  />
                </BlockStack>
              </Card>
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
    </div>
  );
}
