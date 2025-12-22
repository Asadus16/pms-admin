'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
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
  Thumbnail,
  Banner,
  LegacyStack,
} from '@shopify/polaris';
import {
  TeamIcon,
  ChevronRightIcon,
  NoteIcon,
  DeleteIcon,
} from '@shopify/polaris-icons';
import { Editor } from '@tinymce/tinymce-react';
import './AddDeveloper.css';
import { createDeveloperFormData } from '@/lib/services/propertyDevelopersService';
import { useAppDispatch } from '@/store';
import {
  createPropertyManagerDeveloper,
  updatePropertyManagerDeveloper,
} from '@/store/thunks/property-manager/propertyManagerThunks';

// Generate a unique developer ID
const generateDeveloperId = () => {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `DEV-${timestamp}-${random}`;
};

function AddDeveloper({ onClose, mode = 'create', initialDeveloper = null }) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const editorRef = useRef(null);
  const [isMounted, setIsMounted] = useState(false);

  // Track client-side mounting for TinyMCE
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Generate developer ID on mount (or use existing for edit)
  const [developerId] = useState(() => initialDeveloper?.developerId || generateDeveloperId());

  // Developer Details state
  const [developerName, setDeveloperName] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [registeredAddress, setRegisteredAddress] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [logoFile, setLogoFile] = useState(null);
  const [reraNumber, setReraNumber] = useState('');
  const [description, setDescription] = useState('');

  // Primary Contact Person state
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [phoneCountryCode, setPhoneCountryCode] = useState('AE');

  // Marketing Material state
  const [mediaFiles, setMediaFiles] = useState([]);
  const [brochureFile, setBrochureFile] = useState(null);
  const [mediaError, setMediaError] = useState('');

  // Status state
  const [status, setStatus] = useState('active');

  // Notes state
  const [notes, setNotes] = useState('');

  // Populate form when editing
  useEffect(() => {
    if (mode !== 'edit' || !initialDeveloper) return;

    setDeveloperName(initialDeveloper.name || initialDeveloper.developerName || '');
    setSelectedCountry(initialDeveloper.selectedCountry || '');
    setSelectedCity(initialDeveloper.selectedCity || '');
    setRegisteredAddress(initialDeveloper.registeredAddress || '');
    setWebsiteUrl(initialDeveloper.websiteUrl || '');
    setReraNumber(initialDeveloper.reraNumber || '');
    setDescription(initialDeveloper.description || '');

    setContactName(initialDeveloper.primaryContactName || initialDeveloper.contactName || '');
    setContactEmail(initialDeveloper.primaryContactEmail || initialDeveloper.contactEmail || '');
    setContactPhone(initialDeveloper.primaryContactNumber || initialDeveloper.contactPhone || '');
    setPhoneCountryCode(initialDeveloper.phoneCountryCode || 'AE');

    setStatus(initialDeveloper.status || 'active');
    setNotes(initialDeveloper.notes || '');
  }, [mode, initialDeveloper]);

  const handleBack = useCallback(() => {
    if (onClose) {
      onClose();
    } else {
      router.push('/property-manager/developers');
    }
  }, [onClose, router]);

  // Country options
  const countryOptions = [
    { label: 'Select country', value: '' },
    { label: 'United Arab Emirates', value: 'AE' },
    { label: 'Saudi Arabia', value: 'SA' },
    { label: 'Qatar', value: 'QA' },
    { label: 'Bahrain', value: 'BH' },
    { label: 'Kuwait', value: 'KW' },
    { label: 'Oman', value: 'OM' },
    { label: 'India', value: 'IN' },
    { label: 'United States', value: 'US' },
    { label: 'United Kingdom', value: 'GB' },
  ];

  // City options based on country
  const cityOptionsByCountry = {
    AE: [
      { label: 'Select city', value: '' },
      { label: 'Dubai', value: 'dubai' },
      { label: 'Abu Dhabi', value: 'abu_dhabi' },
      { label: 'Sharjah', value: 'sharjah' },
      { label: 'Ajman', value: 'ajman' },
      { label: 'Ras Al Khaimah', value: 'rak' },
      { label: 'Fujairah', value: 'fujairah' },
    ],
    SA: [
      { label: 'Select city', value: '' },
      { label: 'Riyadh', value: 'riyadh' },
      { label: 'Jeddah', value: 'jeddah' },
      { label: 'Mecca', value: 'mecca' },
      { label: 'Medina', value: 'medina' },
      { label: 'Dammam', value: 'dammam' },
    ],
    QA: [
      { label: 'Select city', value: '' },
      { label: 'Doha', value: 'doha' },
      { label: 'Al Wakrah', value: 'al_wakrah' },
      { label: 'Al Khor', value: 'al_khor' },
    ],
    BH: [
      { label: 'Select city', value: '' },
      { label: 'Manama', value: 'manama' },
      { label: 'Riffa', value: 'riffa' },
      { label: 'Muharraq', value: 'muharraq' },
    ],
    KW: [
      { label: 'Select city', value: '' },
      { label: 'Kuwait City', value: 'kuwait_city' },
      { label: 'Hawalli', value: 'hawalli' },
      { label: 'Salmiya', value: 'salmiya' },
    ],
    OM: [
      { label: 'Select city', value: '' },
      { label: 'Muscat', value: 'muscat' },
      { label: 'Salalah', value: 'salalah' },
      { label: 'Sohar', value: 'sohar' },
    ],
    IN: [
      { label: 'Select city', value: '' },
      { label: 'Mumbai', value: 'mumbai' },
      { label: 'Delhi', value: 'delhi' },
      { label: 'Bangalore', value: 'bangalore' },
      { label: 'Hyderabad', value: 'hyderabad' },
      { label: 'Chennai', value: 'chennai' },
      { label: 'Pune', value: 'pune' },
    ],
    US: [
      { label: 'Select city', value: '' },
      { label: 'New York', value: 'new_york' },
      { label: 'Los Angeles', value: 'los_angeles' },
      { label: 'Chicago', value: 'chicago' },
      { label: 'Houston', value: 'houston' },
      { label: 'Miami', value: 'miami' },
    ],
    GB: [
      { label: 'Select city', value: '' },
      { label: 'London', value: 'london' },
      { label: 'Manchester', value: 'manchester' },
      { label: 'Birmingham', value: 'birmingham' },
      { label: 'Edinburgh', value: 'edinburgh' },
    ],
  };

  const cityOptions = selectedCountry
    ? cityOptionsByCountry[selectedCountry] || [{ label: 'Select city', value: '' }]
    : [{ label: 'Select country first', value: '' }];

  // Phone country codes
  const phoneCountryOptions = [
    { label: '+971', value: 'AE' },
    { label: '+966', value: 'SA' },
    { label: '+974', value: 'QA' },
    { label: '+973', value: 'BH' },
    { label: '+965', value: 'KW' },
    { label: '+968', value: 'OM' },
    { label: '+91', value: 'IN' },
    { label: '+1', value: 'US' },
    { label: '+44', value: 'GB' },
  ];

  // Status options
  const statusOptions = [
    { label: 'Active', value: 'active' },
    { label: 'Inactive', value: 'inactive' },
  ];

  // Handle country change - reset city
  const handleCountryChange = useCallback((value) => {
    setSelectedCountry(value);
    setSelectedCity('');
  }, []);

  // Logo upload handlers
  const handleLogoDrop = useCallback((_dropFiles, acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      setLogoFile({
        file,
        preview: URL.createObjectURL(file),
        name: file.name,
      });
    }
  }, []);

  const handleLogoRemove = useCallback(() => {
    if (logoFile?.preview) {
      URL.revokeObjectURL(logoFile.preview);
    }
    setLogoFile(null);
  }, [logoFile]);

  // Media upload handlers
  const handleMediaDrop = useCallback((_dropFiles, acceptedFiles, rejectedFiles) => {
    setMediaError('');

    if (rejectedFiles && rejectedFiles.length > 0) {
      setMediaError('Some files could not be added. Please check file size and format.');
    }

    const newFiles = acceptedFiles.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      name: file.name,
      type: file.type.startsWith('video') ? 'video' : 'image',
    }));

    setMediaFiles(prev => [...prev, ...newFiles]);
  }, []);

  const handleRemoveAllMedia = useCallback(() => {
    mediaFiles.forEach(file => {
      if (file.preview) {
        URL.revokeObjectURL(file.preview);
      }
    });
    setMediaFiles([]);
  }, [mediaFiles]);

  // Brochure upload handlers
  const handleBrochureDrop = useCallback((_dropFiles, acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      setBrochureFile({
        file,
        name: file.name,
        size: file.size,
      });
    }
  }, []);

  const handleBrochureRemove = useCallback(() => {
    setBrochureFile(null);
  }, []);

  // Save state
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);

  // Save handler
  const handleSave = useCallback(async () => {
    // Validation
    if (!developerName.trim()) {
      setSaveError('Developer name is required');
      return;
    }
    if (!selectedCountry) {
      setSaveError('Country is required');
      return;
    }
    if (!selectedCity) {
      setSaveError('City is required');
      return;
    }
    if (!registeredAddress.trim()) {
      setSaveError('Registered address is required');
      return;
    }
    if (!contactName.trim()) {
      setSaveError('Contact name is required');
      return;
    }
    if (!contactEmail.trim()) {
      setSaveError('Contact email is required');
      return;
    }
    if (!contactPhone.trim()) {
      setSaveError('Contact phone is required');
      return;
    }

    setSaving(true);
    setSaveError(null);

    try {
      // Separate photos, videos, and brochures from mediaFiles
      const photos = mediaFiles.filter(f => f.file.type.startsWith('image/')).map(f => f.file);
      const videos = mediaFiles.filter(f => f.file.type.startsWith('video/')).map(f => f.file);
      const brochures = brochureFile ? [brochureFile.file] : [];

      // Prepare developer data
      const developerData = {
        developer_name: developerName,
        country: selectedCountry,
        city: selectedCity,
        registered_address: registeredAddress,
        website_url: websiteUrl || undefined,
        logo: logoFile?.file,
        rera_registration_number: reraNumber || undefined,
        description: description || undefined,
        contact_name: contactName,
        contact_email: contactEmail,
        contact_phone: contactPhone,
        photos,
        videos,
        brochures,
      };

      // Get deleted media IDs if in edit mode
      // Note: mediaFiles in edit mode should preserve existing media IDs
      // For now, we'll track deleted media separately if needed
      const deletedMediaIds = [];

      const formData = createDeveloperFormData(developerData, deletedMediaIds);

      let result;
      if (mode === 'edit' && initialDeveloper?.id) {
        result = await dispatch(updatePropertyManagerDeveloper({
          id: initialDeveloper.id,
          formData,
        }));
      } else {
        result = await dispatch(createPropertyManagerDeveloper(formData));
      }

      // Check if the action was fulfilled
      if (result.type.endsWith('/fulfilled')) {
        setSaving(false);
        // Success - redirect or close
        if (onClose) {
          onClose();
        } else {
          router.push('/property-manager/developers');
        }
      } else {
        // Handle rejection
        const errorMessage = result.error?.message || 'Failed to save developer. Please try again.';
        setSaveError(errorMessage);
        setSaving(false);
      }
    } catch (err) {
      console.error('Error saving developer:', err);
      setSaveError(err.message || 'Failed to save developer. Please try again.');
      setSaving(false);
    }
  }, [
    developerId, developerName, selectedCountry, selectedCity,
    registeredAddress, websiteUrl, logoFile, reraNumber, description,
    contactName, contactEmail, contactPhone, phoneCountryCode,
    mediaFiles, brochureFile, status, notes, mode, initialDeveloper,
    onClose, router, dispatch
  ]);

  // Set data attribute on body when AddDeveloper is mounted
  useEffect(() => {
    const attr = mode === 'edit' ? 'data-edit-developer-open' : 'data-add-developer-open';
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

    const closeEvent = mode === 'edit' ? 'closeEditDeveloper' : 'closeAddDeveloper';
    const saveEvent = mode === 'edit' ? 'saveEditDeveloper' : 'saveAddDeveloper';

    window.addEventListener(closeEvent, handleClose);
    window.addEventListener(saveEvent, handleSaveEvent);

    return () => {
      window.removeEventListener(closeEvent, handleClose);
      window.removeEventListener(saveEvent, handleSaveEvent);
    };
  }, [handleBack, handleSave, mode]);

  // Cleanup object URLs on unmount
  useEffect(() => {
    return () => {
      if (logoFile?.preview) {
        URL.revokeObjectURL(logoFile.preview);
      }
      mediaFiles.forEach(file => {
        if (file.preview) {
          URL.revokeObjectURL(file.preview);
        }
      });
    };
  }, []);

  // Logo upload content
  const logoUploadedContent = logoFile && (
    <LegacyStack alignment="center">
      <Thumbnail
        size="large"
        alt={logoFile.name}
        source={logoFile.preview}
      />
      <div>
        <Text variant="bodyMd" as="p">{logoFile.name}</Text>
        <Button variant="plain" tone="critical" onClick={handleLogoRemove}>Remove</Button>
      </div>
    </LegacyStack>
  );

  // Media files content
  const mediaUploadedContent = mediaFiles.length > 0 && (
    <BlockStack gap="300">
      <InlineStack align="space-between">
        <Text variant="bodyMd" as="span">
          {mediaFiles.length} file{mediaFiles.length > 1 ? 's' : ''} selected
        </Text>
        <Button variant="plain" tone="critical" onClick={handleRemoveAllMedia}>Remove</Button>
      </InlineStack>
      <InlineStack gap="300" wrap>
        {mediaFiles.map((file, index) => (
          <Thumbnail
            key={index}
            size="large"
            alt={file.name}
            source={file.preview}
          />
        ))}
      </InlineStack>
    </BlockStack>
  );

  // Brochure content
  const brochureUploadedContent = brochureFile && (
    <LegacyStack alignment="center">
      <Icon source={NoteIcon} tone="base" />
      <LegacyStack.Item fill>
        <Text variant="bodyMd" as="p">{brochureFile.name}</Text>
        <Text variant="bodySm" as="p" tone="subdued">
          {(brochureFile.size / 1024).toFixed(1)} KB
        </Text>
      </LegacyStack.Item>
      <Button variant="plain" tone="critical" onClick={handleBrochureRemove}>Remove</Button>
    </LegacyStack>
  );

  return (
    <div className="add-developer-wrapper">
      <Page
        title={
          <InlineStack gap="050" blockAlign="center">
            <Icon source={TeamIcon} tone="base" />
            <Icon source={ChevronRightIcon} tone="subdued" />
            <span className="new-developer-title">{mode === 'edit' ? 'Edit developer' : 'New developer'}</span>
          </InlineStack>
        }
      >
        {saveError && (
          <Box paddingBlockEnd="400">
            <Banner tone="critical" onDismiss={() => setSaveError(null)}>
              {saveError}
            </Banner>
          </Box>
        )}
        {saving && (
          <Box paddingBlockEnd="400">
            <Banner tone="info">
              {mode === 'edit' ? 'Updating developer...' : 'Creating developer...'}
            </Banner>
          </Box>
        )}
        <Layout>
          {/* Main content - Left column */}
          <Layout.Section>
            <BlockStack gap="400">
              {/* Developer Details card */}
              <Card>
                <BlockStack gap="400">
                  <Text variant="headingMd" as="h2">
                    Developer details
                  </Text>

                  {/* Developer ID - System generated */}
                  <TextField
                    label="Developer ID"
                    value={developerId}
                    disabled
                    helpText="System generated ID"
                    autoComplete="off"
                  />

                  {/* Developer Name */}
                  <TextField
                    label="Developer name"
                    value={developerName}
                    onChange={setDeveloperName}
                    autoComplete="organization"
                    placeholder="Enter developer name"
                  />

                  {/* Country and City */}
                  <InlineStack gap="400" wrap={false}>
                    <Box width="50%">
                      <Select
                        label="Country"
                        options={countryOptions}
                        value={selectedCountry}
                        onChange={handleCountryChange}
                      />
                    </Box>
                    <Box width="50%">
                      <Select
                        label="City"
                        options={cityOptions}
                        value={selectedCity}
                        onChange={setSelectedCity}
                        disabled={!selectedCountry}
                      />
                    </Box>
                  </InlineStack>

                  {/* Registered Address */}
                  <TextField
                    label="Registered address"
                    value={registeredAddress}
                    onChange={setRegisteredAddress}
                    multiline={2}
                    autoComplete="street-address"
                    placeholder="Enter registered office address"
                  />

                  {/* Website URL */}
                  <TextField
                    label="Website URL"
                    value={websiteUrl}
                    onChange={setWebsiteUrl}
                    type="url"
                    autoComplete="url"
                    placeholder="https://www.example.com"
                  />

                  {/* Logo Upload */}
                  <BlockStack gap="200">
                    <Text variant="bodyMd" as="span">
                      Logo
                    </Text>
                    {logoFile ? (
                      <Card>
                        {logoUploadedContent}
                      </Card>
                    ) : (
                      <DropZone
                        accept="image/*"
                        type="image"
                        onDrop={handleLogoDrop}
                        allowMultiple={false}
                      >
                        <BlockStack gap="200" inlineAlign="center">
                          <InlineStack gap="200" align="center">
                            <Button onClick={() => {}}>Upload new</Button>
                            <Button variant="plain">Select existing</Button>
                          </InlineStack>
                          <Text variant="bodySm" as="p" tone="subdued">
                            Accepts PNG, JPG, SVG
                          </Text>
                        </BlockStack>
                      </DropZone>
                    )}
                  </BlockStack>

                  {/* RERA Registration Number */}
                  <TextField
                    label="RERA registration number"
                    value={reraNumber}
                    onChange={setReraNumber}
                    type="text"
                    autoComplete="off"
                    placeholder="Enter RERA registration number"
                  />

                  {/* Description / About Developer */}
                  <BlockStack gap="100">
                    <Text variant="bodyMd" as="label">
                      Description
                    </Text>
                    <div className="tinymce-wrapper">
                      {isMounted ? (
                        <Editor
                          apiKey="0hqtu2qjf9v1ybvcpw3hib8doiart5u1xflmude8lgyl7ys7"
                          onInit={(_evt, editor) => editorRef.current = editor}
                          value={description}
                          onEditorChange={(content) => setDescription(content)}
                          init={{
                            height: 300,
                            menubar: false,
                            plugins: [
                              'advlist', 'autolink', 'lists', 'link', 'image', 'charmap',
                              'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                              'insertdatetime', 'media', 'table', 'preview', 'help', 'wordcount'
                            ],
                            toolbar: 'blocks | bold italic underline forecolor | ' +
                              'alignleft aligncenter alignright alignjustify | ' +
                              'link image media emoticons | bullist numlist outdent indent | ' +
                              'removeformat code | help',
                            content_style: 'body { font-family: Inter, -apple-system, BlinkMacSystemFont, San Francisco, Segoe UI, Roboto, Helvetica Neue, sans-serif; font-size: 14px; color: #1a1a1a; }',
                            placeholder: 'Enter description about the developer...',
                            branding: false,
                            promotion: false,
                            skin: 'oxide',
                            content_css: 'default',
                          }}
                        />
                      ) : (
                        <div className="tinymce-loading">Loading editor...</div>
                      )}
                    </div>
                  </BlockStack>
                </BlockStack>
              </Card>

              {/* Primary Contact Person card */}
              <Card>
                <BlockStack gap="400">
                  <Text variant="headingMd" as="h2">
                    Primary contact person
                  </Text>

                  {/* Contact Name */}
                  <TextField
                    label="Contact name"
                    value={contactName}
                    onChange={setContactName}
                    autoComplete="name"
                    placeholder="Enter contact person name"
                  />

                  {/* Contact Email */}
                  <TextField
                    label="Contact email"
                    value={contactEmail}
                    onChange={setContactEmail}
                    type="email"
                    autoComplete="email"
                    placeholder="contact@example.com"
                  />

                  {/* Contact Phone/WhatsApp */}
                  <BlockStack gap="100">
                    <Text variant="bodyMd" as="span">
                      Contact phone / WhatsApp
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
                          value={contactPhone}
                          onChange={setContactPhone}
                          autoComplete="tel"
                          placeholder="Enter phone number"
                        />
                      </Box>
                    </InlineStack>
                  </BlockStack>
                </BlockStack>
              </Card>

              {/* Marketing Material card */}
              <Card>
                <BlockStack gap="400">
                  <Text variant="headingMd" as="h2">
                    Marketing material
                  </Text>

                  {/* Media - Photos & Videos */}
                  <BlockStack gap="200">
                    <Text variant="bodyMd" as="span">
                      Media
                    </Text>

                    {mediaError && (
                      <Banner tone="critical" onDismiss={() => setMediaError('')}>
                        <p>{mediaError}</p>
                      </Banner>
                    )}

                    {mediaFiles.length > 0 ? (
                      <Card>
                        {mediaUploadedContent}
                        <Box paddingBlockStart="300">
                          <DropZone
                            accept="image/*,video/*"
                            type="file"
                            onDrop={handleMediaDrop}
                            allowMultiple
                            variableHeight
                          >
                            <DropZone.FileUpload actionTitle="Add more files" />
                          </DropZone>
                        </Box>
                      </Card>
                    ) : (
                      <DropZone
                        accept="image/*,video/*"
                        type="file"
                        onDrop={handleMediaDrop}
                        allowMultiple
                      >
                        <BlockStack gap="200" inlineAlign="center">
                          <InlineStack gap="200" align="center">
                            <Button onClick={() => {}}>Upload new</Button>
                            <Button variant="plain">Select existing</Button>
                          </InlineStack>
                          <Text variant="bodySm" as="p" tone="subdued">
                            Accepts images, videos, or 3D models
                          </Text>
                        </BlockStack>
                      </DropZone>
                    )}
                  </BlockStack>

                  {/* Brochure Upload */}
                  <BlockStack gap="200">
                    <Text variant="bodyMd" as="span">
                      Brochure
                    </Text>
                    {brochureFile ? (
                      <Card>
                        {brochureUploadedContent}
                      </Card>
                    ) : (
                      <DropZone
                        accept=".pdf,.doc,.docx"
                        type="file"
                        onDrop={handleBrochureDrop}
                        allowMultiple={false}
                      >
                        <BlockStack gap="200" inlineAlign="center">
                          <InlineStack gap="200" align="center">
                            <Button onClick={() => {}}>Upload new</Button>
                            <Button variant="plain">Select existing</Button>
                          </InlineStack>
                          <Text variant="bodySm" as="p" tone="subdued">
                            Accepts PDF, DOC, DOCX
                          </Text>
                        </BlockStack>
                      </DropZone>
                    )}
                  </BlockStack>
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
                  />
                </BlockStack>
              </Card>

              {/* Notes card */}
              <Card>
                <BlockStack gap="200">
                  <Text variant="headingMd" as="h2">
                    Notes
                  </Text>
                  <TextField
                    label="Notes"
                    labelHidden
                    value={notes}
                    onChange={setNotes}
                    multiline={4}
                    autoComplete="off"
                    placeholder="Add internal notes about this developer..."
                  />
                  <Text variant="bodySm" as="p" tone="subdued">
                    Notes are private and won&apos;t be shared.
                  </Text>
                </BlockStack>
              </Card>
            </BlockStack>
          </Layout.Section>
        </Layout>
      </Page>
    </div>
  );
}

export default AddDeveloper;

