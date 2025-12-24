'use client';

import { useState, useCallback, useEffect, useMemo } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import {
  Page,
  Card,
  Text,
  TextField,
  Select,
  Button,
  InlineStack,
  BlockStack,
  Box,
  Icon,
  Layout,
  DropZone,
  Banner,
  Checkbox,
  ChoiceList,
} from '@shopify/polaris';
import {
  DocumentIcon,
  CalendarIcon,
} from '@shopify/polaris-icons';
import { useAppDispatch, useAppSelector } from '@/store';
import {
  createPropertyManagerTenancyContract,
  updatePropertyManagerTenancyContract,
} from '@/store/thunks/property-manager/propertyManagerThunks';
import {
  fetchPropertyManagerProperties,
  fetchPropertyManagerContacts,
  fetchPropertyManagerOwners,
} from '@/store/thunks/property-manager/propertyManagerThunks';
import {
  selectTenancyContractsCreating,
  selectTenancyContractsUpdating,
  selectTenancyContractsValidationErrors,
} from '@/store/slices/property-manager';
import { selectProperties } from '@/store/slices/property-manager';
import { selectContacts } from '@/store/slices/property-manager';
import { selectOwners } from '@/store/slices/property-manager';

function AddTenancyContract({ onClose, mode = 'create', initialContract = null }) {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const basePath = pathname.split('/')[1] ? `/${pathname.split('/')[1]}` : '/property-manager';

  // Redux state
  const isCreating = useAppSelector(selectTenancyContractsCreating);
  const isUpdating = useAppSelector(selectTenancyContractsUpdating);
  const validationErrors = useAppSelector(selectTenancyContractsValidationErrors);
  const properties = useAppSelector(selectProperties);
  const contacts = useAppSelector(selectContacts);
  const owners = useAppSelector(selectOwners);

  // Form state
  const [propertyId, setPropertyId] = useState('');
  const [tenantId, setTenantId] = useState('');
  const [ownerId, setOwnerId] = useState('');
  const [contractStartDate, setContractStartDate] = useState('');
  const [contractEndDate, setContractEndDate] = useState('');
  const [rentAmount, setRentAmount] = useState('');
  const [rentPaymentFrequency, setRentPaymentFrequency] = useState('');
  const [securityDepositAmount, setSecurityDepositAmount] = useState('');
  const [securityDepositStatus, setSecurityDepositStatus] = useState('');
  const [agencyFee, setAgencyFee] = useState('');
  const [agencyFeeStatus, setAgencyFeeStatus] = useState('');
  const [includedUtilities, setIncludedUtilities] = useState([]);
  const [maintenanceResponsibility, setMaintenanceResponsibility] = useState('');
  const [contractFile, setContractFile] = useState(null);
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [status, setStatus] = useState('Active');
  const [loadingData, setLoadingData] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);

  // Fetch data for dropdowns
  useEffect(() => {
    const fetchData = async () => {
      setLoadingData(true);
      try {
        await Promise.all([
          dispatch(fetchPropertyManagerProperties({ per_page: 100 })),
          dispatch(fetchPropertyManagerContacts({ per_page: 100 })),
          dispatch(fetchPropertyManagerOwners({ per_page: 100 })),
        ]);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoadingData(false);
      }
    };

    fetchData();
  }, [dispatch]);

  // Populate form when editing
  useEffect(() => {
    if (mode === 'edit' && initialContract) {
      setPropertyId(initialContract.property_id ? String(initialContract.property_id) : '');
      setTenantId(initialContract.tenant_id ? String(initialContract.tenant_id) : '');
      setOwnerId(initialContract.owner_id ? String(initialContract.owner_id) : '');
      
      // Format dates for date input (YYYY-MM-DD)
      const formatDateForInput = (dateStr) => {
        if (!dateStr) return '';
        try {
          const date = new Date(dateStr);
          if (isNaN(date.getTime())) return dateStr;
          return date.toISOString().split('T')[0];
        } catch (e) {
          return dateStr;
        }
      };
      
      setContractStartDate(formatDateForInput(initialContract.contract_start_date));
      setContractEndDate(formatDateForInput(initialContract.contract_end_date));
      setRentAmount(initialContract.rent_amount || '');
      setRentPaymentFrequency(initialContract.rent_payment_frequency || '');
      setSecurityDepositAmount(initialContract.security_deposit_amount ? String(initialContract.security_deposit_amount) : '');
      setSecurityDepositStatus(initialContract.security_deposit_status || '');
      setAgencyFee(initialContract.agency_fee ? String(initialContract.agency_fee) : '');
      setAgencyFeeStatus(initialContract.agency_fee_status || '');
      
      // Parse included_utilities - could be array, JSON string, or null
      let utilities = [];
      if (initialContract.included_utilities) {
        if (Array.isArray(initialContract.included_utilities)) {
          utilities = initialContract.included_utilities;
        } else if (typeof initialContract.included_utilities === 'string') {
          try {
            const parsed = JSON.parse(initialContract.included_utilities);
            utilities = Array.isArray(parsed) ? parsed : [];
          } catch (e) {
            utilities = [];
          }
        }
      }
      setIncludedUtilities(utilities);
      
      setMaintenanceResponsibility(initialContract.maintenance_responsibility || '');
      setRegistrationNumber(initialContract.registration_number || '');
      setStatus(initialContract.status || 'Active');
    }
  }, [mode, initialContract]);

  // Dropdown options
  const propertyOptions = useMemo(() => {
    const propertiesList = Array.isArray(properties) ? properties : (properties?.data || []);
    return [
      { label: loadingData ? 'Loading properties...' : 'Select property', value: '' },
      ...propertiesList.map((property) => ({
        label: property.unit_number && property.building_name
          ? `${property.unit_number} - ${property.building_name}`
          : property.unique_id || `Property ${property.id}`,
        value: String(property.id),
      })),
    ];
  }, [properties, loadingData]);

  const tenantOptions = useMemo(() => {
    const contactsList = Array.isArray(contacts) ? contacts : (contacts?.data || []);
    return [
      { label: loadingData ? 'Loading tenants...' : 'Select tenant', value: '' },
      ...contactsList.map((contact) => ({
        label: contact.full_name || contact.name || `Contact ${contact.id}`,
        value: String(contact.id),
      })),
    ];
  }, [contacts, loadingData]);

  const ownerOptions = useMemo(() => {
    const ownersList = Array.isArray(owners) ? owners : (owners?.data || []);
    return [
      { label: loadingData ? 'Loading owners...' : 'Select owner', value: '' },
      ...ownersList.map((owner) => ({
        label: owner.name || `${owner.first_name || ''} ${owner.last_name || ''}`.trim() || `Owner ${owner.id}`,
        value: String(owner.id),
      })),
    ];
  }, [owners, loadingData]);

  const paymentFrequencyOptions = [
    { label: 'Select payment frequency', value: '' },
    { label: 'Monthly', value: 'Monthly' },
    { label: 'Quarterly', value: 'Quarterly' },
    { label: 'Yearly', value: 'Yearly' },
  ];

  const depositStatusOptions = [
    { label: 'Select status', value: '' },
    { label: 'Paid', value: 'Paid' },
    { label: 'Pending', value: 'Pending' },
    { label: 'Refunded', value: 'Refunded' },
  ];

  const maintenanceResponsibilityOptions = [
    { label: 'Select responsibility', value: '' },
    { label: 'Owner', value: 'Owner' },
    { label: 'Tenant', value: 'Tenant' },
    { label: 'Shared', value: 'Shared' },
  ];

  const statusOptions = [
    { label: 'Active', value: 'Active' },
    { label: 'Expired', value: 'Expired' },
    { label: 'Renewed', value: 'Renewed' },
    { label: 'Terminated', value: 'Terminated' },
  ];

  const utilityOptions = [
    { label: 'Electricity', value: 'Electricity' },
    { label: 'Water', value: 'Water' },
    { label: 'Internet', value: 'Internet' },
    { label: 'Gas', value: 'Gas' },
    { label: 'AC', value: 'AC' },
    { label: 'Maintenance', value: 'Maintenance' },
  ];

  // File upload handler
  const handleContractFileDrop = useCallback((_dropFiles, acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      if (file.type === 'application/pdf') {
        setContractFile(file);
      } else {
        setSaveError('Only PDF files are allowed for contract documents.');
      }
    }
  }, []);

  const handleContractFileRemove = useCallback(() => {
    setContractFile(null);
  }, []);

  // Form submission
  const handleSave = useCallback(async () => {
    setSaveError(null);
    setSaving(true);

    try {
      // Validation
      if (!propertyId) {
        setSaveError('Property is required.');
        setSaving(false);
        return;
      }
      if (!tenantId) {
        setSaveError('Tenant is required.');
        setSaving(false);
        return;
      }
      if (!ownerId) {
        setSaveError('Owner is required.');
        setSaving(false);
        return;
      }
      if (!contractStartDate) {
        setSaveError('Contract start date is required.');
        setSaving(false);
        return;
      }
      if (!contractEndDate) {
        setSaveError('Contract end date is required.');
        setSaving(false);
        return;
      }
      if (new Date(contractEndDate) <= new Date(contractStartDate)) {
        setSaveError('Contract end date must be after contract start date.');
        setSaving(false);
        return;
      }
      if (!rentAmount) {
        setSaveError('Rent amount is required.');
        setSaving(false);
        return;
      }
      if (!rentPaymentFrequency) {
        setSaveError('Rent payment frequency is required.');
        setSaving(false);
        return;
      }
      if (!maintenanceResponsibility) {
        setSaveError('Maintenance responsibility is required.');
        setSaving(false);
        return;
      }

      // Build FormData
      const formData = new FormData();
      formData.append('property_id', propertyId);
      formData.append('tenant_id', tenantId);
      formData.append('owner_id', ownerId);
      formData.append('contract_start_date', contractStartDate);
      formData.append('contract_end_date', contractEndDate);
      formData.append('rent_amount', rentAmount);
      formData.append('rent_payment_frequency', rentPaymentFrequency);
      
      if (securityDepositAmount) {
        formData.append('security_deposit_amount', securityDepositAmount);
      }
      if (securityDepositStatus) {
        formData.append('security_deposit_status', securityDepositStatus);
      }
      if (agencyFee) {
        formData.append('agency_fee', agencyFee);
      }
      if (agencyFeeStatus) {
        formData.append('agency_fee_status', agencyFeeStatus);
      }
      if (includedUtilities.length > 0) {
        formData.append('included_utilities', JSON.stringify(includedUtilities));
      }
      formData.append('maintenance_responsibility', maintenanceResponsibility);
      if (registrationNumber) {
        formData.append('registration_number', registrationNumber);
      }
      formData.append('status', status);
      if (contractFile) {
        formData.append('contract_file', contractFile);
      }

      let result;
      if (mode === 'edit' && initialContract?.id) {
        result = await dispatch(updatePropertyManagerTenancyContract({
          id: initialContract.id,
          formData,
        }));
      } else {
        result = await dispatch(createPropertyManagerTenancyContract(formData));
      }

      if (result.type.endsWith('/fulfilled')) {
        setSaving(false);
        if (onClose) {
          onClose();
        } else {
          router.push(`${basePath}/tenancy-contracts`);
        }
      } else {
        const errorMessage = result.error?.message || 'Failed to save contract. Please try again.';
        setSaveError(errorMessage);
        setSaving(false);
      }
    } catch (err) {
      console.error('Error saving contract:', err);
      setSaveError(err.message || 'Failed to save contract. Please try again.');
      setSaving(false);
    }
  }, [
    propertyId, tenantId, ownerId, contractStartDate, contractEndDate,
    rentAmount, rentPaymentFrequency, securityDepositAmount, securityDepositStatus,
    agencyFee, agencyFeeStatus, includedUtilities, maintenanceResponsibility,
    registrationNumber, status, contractFile, mode, initialContract, onClose, router, basePath, dispatch
  ]);

  const getFieldError = (field) => {
    if (validationErrors && validationErrors[field]) {
      return validationErrors[field][0];
    }
    return null;
  };

  const isLoading = saving || isCreating || isUpdating;

  return (
    <Page
      title={mode === 'edit' ? 'Edit Tenancy Contract' : 'Add Tenancy Contract'}
      primaryAction={{
        content: mode === 'edit' ? 'Update Contract' : 'Create Contract',
        onAction: handleSave,
        loading: isLoading,
      }}
      secondaryActions={[
        {
          content: 'Cancel',
          onAction: onClose || (() => router.push(`${basePath}/tenancy-contracts`)),
        },
      ]}
    >
      <Layout>
        {saveError && (
          <Layout.Section>
            <Banner status="critical" onDismiss={() => setSaveError(null)}>
              {saveError}
            </Banner>
          </Layout.Section>
        )}

        <Layout.Section>
          <Card>
            <BlockStack gap="500">
              <Text variant="headingMd" as="h2">
                Contract Information
              </Text>

              <Select
                label="Property"
                options={propertyOptions}
                value={propertyId}
                onChange={setPropertyId}
                error={getFieldError('property_id')}
                disabled={isLoading || loadingData}
              />

              <Select
                label="Tenant"
                options={tenantOptions}
                value={tenantId}
                onChange={setTenantId}
                error={getFieldError('tenant_id')}
                disabled={isLoading || loadingData}
              />

              <Select
                label="Owner"
                options={ownerOptions}
                value={ownerId}
                onChange={setOwnerId}
                error={getFieldError('owner_id')}
                disabled={isLoading || loadingData}
              />

              <InlineStack gap="400">
                <Box minWidth="0" flex="1">
                  <TextField
                    label="Contract Start Date"
                    type="date"
                    value={contractStartDate}
                    onChange={setContractStartDate}
                    error={getFieldError('contract_start_date')}
                    disabled={isLoading}
                    autoComplete="off"
                  />
                </Box>
                <Box minWidth="0" flex="1">
                  <TextField
                    label="Contract End Date"
                    type="date"
                    value={contractEndDate}
                    onChange={setContractEndDate}
                    error={getFieldError('contract_end_date')}
                    disabled={isLoading}
                    autoComplete="off"
                  />
                </Box>
              </InlineStack>
            </BlockStack>
          </Card>
        </Layout.Section>

        <Layout.Section>
          <Card>
            <BlockStack gap="500">
              <Text variant="headingMd" as="h2">
                Rent Information
              </Text>

              <InlineStack gap="400">
                <Box minWidth="0" flex="1">
                  <TextField
                    label="Rent Amount (AED)"
                    type="number"
                    value={rentAmount}
                    onChange={setRentAmount}
                    error={getFieldError('rent_amount')}
                    disabled={isLoading}
                    prefix="AED"
                    autoComplete="off"
                  />
                </Box>
                <Box minWidth="0" flex="1">
                  <Select
                    label="Payment Frequency"
                    options={paymentFrequencyOptions}
                    value={rentPaymentFrequency}
                    onChange={setRentPaymentFrequency}
                    error={getFieldError('rent_payment_frequency')}
                    disabled={isLoading}
                  />
                </Box>
              </InlineStack>
            </BlockStack>
          </Card>
        </Layout.Section>

        <Layout.Section>
          <Card>
            <BlockStack gap="500">
              <Text variant="headingMd" as="h2">
                Security Deposit
              </Text>

              <InlineStack gap="400">
                <Box minWidth="0" flex="1">
                  <TextField
                    label="Security Deposit Amount (AED)"
                    type="number"
                    value={securityDepositAmount}
                    onChange={setSecurityDepositAmount}
                    error={getFieldError('security_deposit_amount')}
                    disabled={isLoading}
                    prefix="AED"
                    autoComplete="off"
                  />
                </Box>
                <Box minWidth="0" flex="1">
                  <Select
                    label="Deposit Status"
                    options={depositStatusOptions}
                    value={securityDepositStatus}
                    onChange={setSecurityDepositStatus}
                    error={getFieldError('security_deposit_status')}
                    disabled={isLoading}
                  />
                </Box>
              </InlineStack>
            </BlockStack>
          </Card>
        </Layout.Section>

        <Layout.Section>
          <Card>
            <BlockStack gap="500">
              <Text variant="headingMd" as="h2">
                Agency Fee
              </Text>

              <InlineStack gap="400">
                <Box minWidth="0" flex="1">
                  <TextField
                    label="Agency Fee (AED)"
                    type="number"
                    value={agencyFee}
                    onChange={setAgencyFee}
                    error={getFieldError('agency_fee')}
                    disabled={isLoading}
                    prefix="AED"
                    autoComplete="off"
                  />
                </Box>
                <Box minWidth="0" flex="1">
                  <Select
                    label="Agency Fee Status"
                    options={depositStatusOptions}
                    value={agencyFeeStatus}
                    onChange={setAgencyFeeStatus}
                    error={getFieldError('agency_fee_status')}
                    disabled={isLoading}
                  />
                </Box>
              </InlineStack>
            </BlockStack>
          </Card>
        </Layout.Section>

        <Layout.Section>
          <Card>
            <BlockStack gap="500">
              <Text variant="headingMd" as="h2">
                Additional Information
              </Text>

              <Select
                label="Maintenance Responsibility"
                options={maintenanceResponsibilityOptions}
                value={maintenanceResponsibility}
                onChange={setMaintenanceResponsibility}
                error={getFieldError('maintenance_responsibility')}
                disabled={isLoading}
              />

              <ChoiceList
                title="Included Utilities"
                choices={utilityOptions}
                selected={includedUtilities}
                onChange={setIncludedUtilities}
                allowMultiple
              />

              <TextField
                label="Registration Number (Ejari)"
                value={registrationNumber}
                onChange={setRegistrationNumber}
                error={getFieldError('registration_number')}
                disabled={isLoading}
                autoComplete="off"
                helpText="Ejari or local equivalent registration number"
              />

              <Select
                label="Status"
                options={statusOptions}
                value={status}
                onChange={setStatus}
                error={getFieldError('status')}
                disabled={isLoading}
              />
            </BlockStack>
          </Card>
        </Layout.Section>

        <Layout.Section>
          <Card>
            <BlockStack gap="500">
              <Text variant="headingMd" as="h2">
                Contract Document
              </Text>

              {contractFile ? (
                <BlockStack gap="300">
                  <InlineStack align="space-between" blockAlign="center">
                    <Text variant="bodyMd" as="span">
                      {contractFile.name} ({(contractFile.size / 1024).toFixed(2)} KB)
                    </Text>
                    <Button onClick={handleContractFileRemove} size="slim">
                      Remove
                    </Button>
                  </InlineStack>
                </BlockStack>
              ) : (
                <DropZone
                  accept="application/pdf"
                  type="file"
                  onDrop={handleContractFileDrop}
                  errorOverlayText="Only PDF files are allowed"
                >
                  <BlockStack gap="400" inlineAlign="center">
                    <Icon source={DocumentIcon} tone="subdued" />
                    <Text variant="bodyMd" as="p" tone="subdued">
                      Upload contract PDF (max 10MB)
                    </Text>
                  </BlockStack>
                </DropZone>
              )}

              {getFieldError('contract_file') && (
                <Text variant="bodySm" tone="critical" as="p">
                  {getFieldError('contract_file')}
                </Text>
              )}
            </BlockStack>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}

export default AddTenancyContract;

