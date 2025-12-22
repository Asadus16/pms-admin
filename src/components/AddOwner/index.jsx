'use client';

import { useState, useCallback, useEffect } from 'react';
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
  LegacyStack,
  Banner,
} from '@shopify/polaris';
import {
  PersonIcon,
  ChevronRightIcon,
  NoteIcon,
} from '@shopify/polaris-icons';
import { useAppDispatch, useAppSelector } from '@/store';
import {
  createPropertyManagerOwner,
  updatePropertyManagerOwner,
} from '@/store/thunks';
import {
  selectOwnersCreating,
  selectOwnersUpdating,
  selectOwnersError,
  selectOwnersValidationErrors,
  clearError,
} from '@/store/slices/property-manager/owners/slice';
import '../AddDeveloper/AddDeveloper.css';

// Phone code mapping
const phoneCodeMap = {
  AE: '+971',
  SA: '+966',
  QA: '+974',
  BH: '+973',
  KW: '+965',
  OM: '+968',
  IN: '+91',
  PK: '+92',
  EG: '+20',
  JO: '+962',
  LB: '+961',
  US: '+1',
  GB: '+44',
};

function AddOwner({ onClose, mode = 'create', initialOwner = null }) {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useAppDispatch();

  // Redux state
  const isCreating = useAppSelector(selectOwnersCreating);
  const isUpdating = useAppSelector(selectOwnersUpdating);
  const reduxError = useAppSelector(selectOwnersError);
  const validationErrors = useAppSelector(selectOwnersValidationErrors);

  const basePath = pathname?.split('/')[1] ? `/${pathname.split('/')[1]}` : '/property-manager';

  // Owner Details state
  const [ownerType, setOwnerType] = useState('individual');
  const [ownerName, setOwnerName] = useState('');
  const [nationality, setNationality] = useState('');
  const [countryOfResidence, setCountryOfResidence] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [phoneCountryCode, setPhoneCountryCode] = useState('AE');
  const [address, setAddress] = useState('');
  const [preferredContactChannel, setPreferredContactChannel] = useState('phone');
  const [notesInstructions, setNotesInstructions] = useState('');

  // KYC Details state
  const [passportCopy, setPassportCopy] = useState(null);
  const [idCardCopy, setIdCardCopy] = useState(null);
  const [tradeLicense, setTradeLicense] = useState(null);
  const [taxVatId, setTaxVatId] = useState('');

  // Bank Details state
  const [iban, setIban] = useState('');
  const [bankNumber, setBankNumber] = useState('');
  const [branch, setBranch] = useState('');
  const [bankName, setBankName] = useState('');

  // Status state
  const [status, setStatus] = useState('active');

  // Local error state
  const [localError, setLocalError] = useState(null);

  // Clear errors on unmount
  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  // Populate form when editing
  useEffect(() => {
    if (mode !== 'edit' || !initialOwner) return;

    // Helper to safely get string value
    const safeString = (val) => (typeof val === 'string' ? val : String(val || ''));

    // Normalize owner type to lowercase (backend expects lowercase)
    const rawOwnerType = safeString(initialOwner.owner_type || initialOwner.ownerType).toLowerCase();
    setOwnerType(['individual', 'company', 'developer'].includes(rawOwnerType) ? rawOwnerType : 'individual');

    setOwnerName(safeString(initialOwner.name));
    setNationality(safeString(initialOwner.nationality));
    setCountryOfResidence(safeString(initialOwner.country_of_residence || initialOwner.countryOfResidence));
    setEmail(safeString(initialOwner.email));
    // Extract phone number without country code
    const rawPhone = safeString(initialOwner.phone);
    setPhone(rawPhone.replace(/^\+\d+\s*/, ''));
    setPhoneCountryCode(safeString(initialOwner.phone_country_code || initialOwner.phoneCountryCode) || 'AE');
    setAddress(safeString(initialOwner.address));

    // Normalize preferred contact channel to lowercase (backend expects lowercase)
    const rawContactChannel = safeString(initialOwner.preferred_contact_channel || initialOwner.preferredContactChannel).toLowerCase();
    setPreferredContactChannel(['phone', 'email'].includes(rawContactChannel) ? rawContactChannel : 'phone');

    setNotesInstructions(safeString(initialOwner.notes_instructions || initialOwner.notesInstructions));

    // KYC
    setTaxVatId(safeString(initialOwner.tax_vat_id || initialOwner.taxVatId));

    // Existing file URLs (for display purposes in edit mode)
    const passportUrl = initialOwner.passport_copy || initialOwner.passportCopy;
    const idCardUrl = initialOwner.id_card_copy || initialOwner.idCardCopy;
    const tradeLicenseUrl = initialOwner.trade_license || initialOwner.tradeLicense;

    if (passportUrl) {
      setPassportCopy({
        url: passportUrl,
        name: passportUrl.split('/').pop() || 'Passport copy',
        isExisting: true,
      });
    }
    if (idCardUrl) {
      setIdCardCopy({
        url: idCardUrl,
        name: idCardUrl.split('/').pop() || 'ID card copy',
        isExisting: true,
      });
    }
    if (tradeLicenseUrl) {
      setTradeLicense({
        url: tradeLicenseUrl,
        name: tradeLicenseUrl.split('/').pop() || 'Trade license',
        isExisting: true,
      });
    }

    // Bank Details
    setIban(safeString(initialOwner.iban));
    setBankNumber(safeString(initialOwner.bank_number || initialOwner.bankNumber));
    setBranch(safeString(initialOwner.bank_branch || initialOwner.branch));
    setBankName(safeString(initialOwner.bank_name || initialOwner.bankName));

    // Normalize status to lowercase (backend expects lowercase)
    const rawStatus = safeString(initialOwner.status).toLowerCase();
    setStatus(['active', 'inactive'].includes(rawStatus) ? rawStatus : 'active');
  }, [mode, initialOwner]);

  const handleBack = useCallback(() => {
    if (onClose) {
      onClose();
    } else {
      router.push(`${basePath}/owners`);
    }
  }, [onClose, router, basePath]);

  // Owner type options
  const ownerTypeOptions = [
    { label: 'Individual', value: 'individual' },
    { label: 'Company', value: 'company' },
    { label: 'Developer', value: 'developer' },
  ];

  // Country options (for nationality and country of residence)
  const countryOptions = [
    { label: 'Select country', value: '' },
    { label: 'United Arab Emirates', value: 'AE' },
    { label: 'Saudi Arabia', value: 'SA' },
    { label: 'Qatar', value: 'QA' },
    { label: 'Bahrain', value: 'BH' },
    { label: 'Kuwait', value: 'KW' },
    { label: 'Oman', value: 'OM' },
    { label: 'India', value: 'IN' },
    { label: 'Pakistan', value: 'PK' },
    { label: 'Egypt', value: 'EG' },
    { label: 'Jordan', value: 'JO' },
    { label: 'Lebanon', value: 'LB' },
    { label: 'United States', value: 'US' },
    { label: 'United Kingdom', value: 'GB' },
    { label: 'Germany', value: 'DE' },
    { label: 'France', value: 'FR' },
    { label: 'Canada', value: 'CA' },
    { label: 'Australia', value: 'AU' },
  ];

  // Phone country codes
  const phoneCountryOptions = [
    { label: '+971', value: 'AE' },
    { label: '+966', value: 'SA' },
    { label: '+974', value: 'QA' },
    { label: '+973', value: 'BH' },
    { label: '+965', value: 'KW' },
    { label: '+968', value: 'OM' },
    { label: '+91', value: 'IN' },
    { label: '+92', value: 'PK' },
    { label: '+20', value: 'EG' },
    { label: '+962', value: 'JO' },
    { label: '+961', value: 'LB' },
    { label: '+1', value: 'US' },
    { label: '+44', value: 'GB' },
  ];

  // Preferred contact channel options
  const contactChannelOptions = [
    { label: 'Phone', value: 'phone' },
    { label: 'Email', value: 'email' },
  ];

  // Status options
  const statusOptions = [
    { label: 'Active', value: 'active' },
    { label: 'Inactive', value: 'inactive' },
  ];

  // File upload handlers
  const handlePassportDrop = useCallback((_dropFiles, acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      setPassportCopy({
        file,
        name: file.name,
        size: file.size,
      });
    }
  }, []);

  const handleIdCardDrop = useCallback((_dropFiles, acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      setIdCardCopy({
        file,
        name: file.name,
        size: file.size,
      });
    }
  }, []);

  const handleTradeLicenseDrop = useCallback((_dropFiles, acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      setTradeLicense({
        file,
        name: file.name,
        size: file.size,
      });
    }
  }, []);

  // Build full phone number
  const getFullPhone = () => {
    if (!phone) return '';
    const code = phoneCodeMap[phoneCountryCode] || '+971';
    return `${code}${phone}`;
  };

  // Save handler
  const handleSave = useCallback(async () => {
    setLocalError(null);
    dispatch(clearError());

    // Basic validation
    if (!ownerName.trim()) {
      setLocalError('Owner name is required');
      return;
    }

    // Build FormData for file uploads
    const formData = new FormData();
    if (ownerType) formData.append('owner_type', ownerType);
    formData.append('name', ownerName);
    if (nationality) formData.append('nationality', nationality);
    if (countryOfResidence) formData.append('country_of_residence', countryOfResidence);
    if (email) formData.append('email', email);
    if (phone) formData.append('phone', getFullPhone());
    if (phoneCountryCode) formData.append('phone_country_code', phoneCountryCode);
    if (address) formData.append('address', address);
    if (preferredContactChannel) formData.append('preferred_contact_channel', preferredContactChannel);
    if (notesInstructions) formData.append('notes_instructions', notesInstructions);
    if (status) formData.append('status', status);

    // KYC files
    if (passportCopy?.file) {
      formData.append('passport_copy', passportCopy.file);
    }
    if (idCardCopy?.file) {
      formData.append('id_card_copy', idCardCopy.file);
    }
    if (tradeLicense?.file) {
      formData.append('trade_license', tradeLicense.file);
    }
    if (taxVatId) formData.append('tax_vat_id', taxVatId);

    // Bank Details
    if (iban) formData.append('iban', iban);
    if (bankNumber) formData.append('bank_number', bankNumber);
    if (branch) formData.append('bank_branch', branch);
    if (bankName) formData.append('bank_name', bankName);

    try {
      let result;
      if (mode === 'edit' && initialOwner?.id) {
        result = await dispatch(updatePropertyManagerOwner({
          id: initialOwner.id,
          data: formData,
        })).unwrap();
      } else {
        result = await dispatch(createPropertyManagerOwner(formData)).unwrap();
      }

      // Success - navigate back to list
      router.push(`${basePath}/owners`);
    } catch (error) {
      console.error('Error saving owner:', error);
      setLocalError(error?.message || 'Failed to save owner. Please try again.');
    }
  }, [
    dispatch, mode, initialOwner, router, basePath,
    ownerType, ownerName, nationality, countryOfResidence,
    email, phone, phoneCountryCode, address, preferredContactChannel,
    notesInstructions, passportCopy, idCardCopy, tradeLicense, taxVatId,
    iban, bankNumber, branch, bankName, status
  ]);

  // Set data attribute on body when AddOwner is mounted
  useEffect(() => {
    const attr = mode === 'edit' ? 'data-edit-owner-open' : 'data-add-owner-open';
    document.body.setAttribute(attr, 'true');
    return () => {
      document.body.removeAttribute(attr);
    };
  }, [mode]);

  // Listen for custom events from header
  useEffect(() => {
    const handleClose = () => {
      handleBack();
    };

    const handleSaveEvent = () => {
      handleSave();
    };

    const closeEvent = mode === 'edit' ? 'closeEditOwner' : 'closeAddOwner';
    const saveEvent = mode === 'edit' ? 'saveEditOwner' : 'saveAddOwner';

    window.addEventListener(closeEvent, handleClose);
    window.addEventListener(saveEvent, handleSaveEvent);

    return () => {
      window.removeEventListener(closeEvent, handleClose);
      window.removeEventListener(saveEvent, handleSaveEvent);
    };
  }, [handleBack, handleSave, mode]);

  // Get field error from validation errors
  const getFieldError = (field) => {
    if (!validationErrors) return null;
    const errors = validationErrors[field];
    return errors ? errors[0] : null;
  };

  // File upload content renderers
  const renderFileUpload = (file, onRemove) => {
    if (file) {
      const isExisting = file.isExisting;
      const fileName = file.name || 'File';
      const fileSize = file.size ? `${(file.size / 1024).toFixed(1)} KB` : (isExisting ? 'Existing file' : '');

      return (
        <Card>
          <LegacyStack alignment="center">
            <Icon source={NoteIcon} tone="base" />
            <LegacyStack.Item fill>
              <Text variant="bodyMd" as="p">{fileName}</Text>
              <Text variant="bodySm" as="p" tone="subdued">
                {fileSize}
              </Text>
            </LegacyStack.Item>
            <Button variant="plain" tone="critical" onClick={onRemove}>
              {isExisting ? 'Replace' : 'Remove'}
            </Button>
          </LegacyStack>
        </Card>
      );
    }
    return null;
  };

  const isSaving = isCreating || isUpdating;
  const displayError = localError || reduxError;

  return (
    <div className="add-developer-wrapper">
      <Page
        title={
          <InlineStack gap="050" blockAlign="center">
            <Icon source={PersonIcon} tone="base" />
            <Icon source={ChevronRightIcon} tone="subdued" />
            <span className="new-developer-title">{mode === 'edit' ? 'Edit owner' : 'Add New Owner'}</span>
          </InlineStack>
        }
      >
        {/* Error Banner */}
        {displayError && (
          <Box paddingBlockEnd="400">
            <Banner tone="critical" onDismiss={() => { setLocalError(null); dispatch(clearError()); }}>
              <p>{displayError}</p>
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

                  {/* Owner Type */}
                  <Select
                    label="Owner Type"
                    options={ownerTypeOptions}
                    value={ownerType}
                    onChange={setOwnerType}
                    error={getFieldError('owner_type')}
                  />

                  {/* Owner Name */}
                  <TextField
                    label="Owner Name"
                    value={ownerName}
                    onChange={setOwnerName}
                    autoComplete="name"
                    placeholder="Enter owner name"
                    error={getFieldError('name')}
                    requiredIndicator
                  />

                  {/* Nationality */}
                  <Select
                    label="Nationality"
                    options={countryOptions}
                    value={nationality}
                    onChange={setNationality}
                    error={getFieldError('nationality')}
                  />

                  {/* Country of Residence */}
                  <Select
                    label="Country of Residence"
                    options={countryOptions}
                    value={countryOfResidence}
                    onChange={setCountryOfResidence}
                    error={getFieldError('country_of_residence')}
                  />

                  {/* Email */}
                  <TextField
                    label="Email"
                    value={email}
                    onChange={setEmail}
                    type="email"
                    autoComplete="email"
                    placeholder="owner@example.com"
                    error={getFieldError('email')}
                  />

                  {/* Phone / WhatsApp */}
                  <BlockStack gap="100">
                    <Text variant="bodyMd" as="span">
                      Phone / Whatsapp
                    </Text>
                    <InlineStack gap="200" wrap={false}>
                      <Box width="120px">
                        <Select
                          label="Country code"
                          labelHidden
                          options={phoneCountryOptions}
                          value={phoneCountryCode}
                          onChange={setPhoneCountryCode}
                        />
                      </Box>
                      <Box width="100%">
                        <TextField
                          label="Phone number"
                          labelHidden
                          type="tel"
                          value={phone}
                          onChange={setPhone}
                          autoComplete="tel"
                          placeholder="Enter phone number"
                          error={getFieldError('phone')}
                        />
                      </Box>
                    </InlineStack>
                  </BlockStack>

                  {/* Address */}
                  <TextField
                    label="Address"
                    value={address}
                    onChange={setAddress}
                    multiline={2}
                    autoComplete="street-address"
                    placeholder="Enter address"
                    error={getFieldError('address')}
                  />

                  {/* Preferred Contact Channel */}
                  <Select
                    label="Preferred Contact Channel"
                    options={contactChannelOptions}
                    value={preferredContactChannel}
                    onChange={setPreferredContactChannel}
                    error={getFieldError('preferred_contact_channel')}
                  />

                  {/* Notes & Instructions */}
                  <TextField
                    label="Notes & Instructions"
                    value={notesInstructions}
                    onChange={setNotesInstructions}
                    multiline={3}
                    autoComplete="off"
                    placeholder="Add any notes or special instructions..."
                    error={getFieldError('notes_instructions')}
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
                    {passportCopy ? (
                      renderFileUpload(passportCopy, () => setPassportCopy(null))
                    ) : (
                      <DropZone
                        accept=".pdf,.jpg,.jpeg,.png"
                        type="file"
                        onDrop={handlePassportDrop}
                        allowMultiple={false}
                      >
                        <BlockStack gap="200" inlineAlign="center">
                          <InlineStack gap="200" align="center">
                            <Button onClick={() => {}}>Upload file</Button>
                          </InlineStack>
                          <Text variant="bodySm" as="p" tone="subdued">
                            Accepts PDF, JPG, PNG
                          </Text>
                        </BlockStack>
                      </DropZone>
                    )}
                    {getFieldError('passport_copy') && (
                      <Text variant="bodySm" as="p" tone="critical">
                        {getFieldError('passport_copy')}
                      </Text>
                    )}
                  </BlockStack>

                  {/* ID Card Copy */}
                  <BlockStack gap="200">
                    <Text variant="bodyMd" as="span">
                      ID Card Copy
                    </Text>
                    {idCardCopy ? (
                      renderFileUpload(idCardCopy, () => setIdCardCopy(null))
                    ) : (
                      <DropZone
                        accept=".pdf,.jpg,.jpeg,.png"
                        type="file"
                        onDrop={handleIdCardDrop}
                        allowMultiple={false}
                      >
                        <BlockStack gap="200" inlineAlign="center">
                          <InlineStack gap="200" align="center">
                            <Button onClick={() => {}}>Upload file</Button>
                          </InlineStack>
                          <Text variant="bodySm" as="p" tone="subdued">
                            Accepts PDF, JPG, PNG
                          </Text>
                        </BlockStack>
                      </DropZone>
                    )}
                    {getFieldError('id_card_copy') && (
                      <Text variant="bodySm" as="p" tone="critical">
                        {getFieldError('id_card_copy')}
                      </Text>
                    )}
                  </BlockStack>

                  {/* Trade License */}
                  <BlockStack gap="200">
                    <Text variant="bodyMd" as="span">
                      Trade License
                    </Text>
                    {tradeLicense ? (
                      renderFileUpload(tradeLicense, () => setTradeLicense(null))
                    ) : (
                      <DropZone
                        accept=".pdf,.jpg,.jpeg,.png"
                        type="file"
                        onDrop={handleTradeLicenseDrop}
                        allowMultiple={false}
                      >
                        <BlockStack gap="200" inlineAlign="center">
                          <InlineStack gap="200" align="center">
                            <Button onClick={() => {}}>Upload file</Button>
                          </InlineStack>
                          <Text variant="bodySm" as="p" tone="subdued">
                            Accepts PDF, JPG, PNG
                          </Text>
                        </BlockStack>
                      </DropZone>
                    )}
                    {getFieldError('trade_license') && (
                      <Text variant="bodySm" as="p" tone="critical">
                        {getFieldError('trade_license')}
                      </Text>
                    )}
                  </BlockStack>

                  {/* Tax / VAT ID */}
                  <TextField
                    label="Tax / VAT ID"
                    value={taxVatId}
                    onChange={setTaxVatId}
                    type="text"
                    autoComplete="off"
                    placeholder="Enter Tax / VAT ID"
                    error={getFieldError('tax_vat_id')}
                  />
                </BlockStack>
              </Card>

              {/* Bank Details card */}
              <Card>
                <BlockStack gap="400">
                  <Text variant="headingMd" as="h2">
                    Bank Details
                  </Text>

                  {/* IBAN */}
                  <TextField
                    label="IBAN"
                    value={iban}
                    onChange={setIban}
                    autoComplete="off"
                    placeholder="Enter IBAN"
                    error={getFieldError('iban')}
                  />

                  {/* Bank Number */}
                  <TextField
                    label="Bank Number"
                    value={bankNumber}
                    onChange={setBankNumber}
                    autoComplete="off"
                    placeholder="Enter bank number"
                    error={getFieldError('bank_number')}
                  />

                  {/* Branch */}
                  <TextField
                    label="Branch"
                    value={branch}
                    onChange={setBranch}
                    autoComplete="off"
                    placeholder="Enter branch name"
                    error={getFieldError('branch')}
                  />

                  {/* Bank Name */}
                  <TextField
                    label="Bank Name"
                    value={bankName}
                    onChange={setBankName}
                    autoComplete="off"
                    placeholder="Enter bank name"
                    error={getFieldError('bank_name')}
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
                  <Select
                    label="Status"
                    labelHidden
                    options={statusOptions}
                    value={status}
                    onChange={setStatus}
                    error={getFieldError('status')}
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

export default AddOwner;
