'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import {
  Page,
  Card,
  Text,
  TextField,
  Select,
  InlineStack,
  BlockStack,
  Box,
  Icon,
  Layout,
  Tag,
  Listbox,
  Combobox,
  Banner,
  Spinner,
} from '@shopify/polaris';
import {
  PersonIcon,
  ChevronRightIcon,
} from '@shopify/polaris-icons';
import './AddContact.css';
import {
  createPropertyManagerContact,
  updatePropertyManagerContact,
  fetchPropertyManagerContactById,
} from '@/store/thunks/property-manager/propertyManagerThunks';
import {
  selectContactsCreating,
  selectContactsUpdating,
  selectContactsError,
  selectContactsValidationErrors,
  selectCurrentContact,
  selectContactsLoading,
  clearContactsError,
  clearCurrentContact,
} from '@/store/slices/property-manager/contacts/slice';

// Generate a unique contact ID
const generateContactId = () => {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `CON-${timestamp}-${random}`;
};

function AddContact({ onClose, mode = 'create', contactId: editContactId = null }) {
  const router = useRouter();
  const dispatch = useDispatch();

  // Redux selectors
  const isCreating = useSelector(selectContactsCreating);
  const isUpdating = useSelector(selectContactsUpdating);
  const isLoading = useSelector(selectContactsLoading);
  const error = useSelector(selectContactsError);
  const validationErrors = useSelector(selectContactsValidationErrors);
  const currentContact = useSelector(selectCurrentContact);

  // Generate contact ID on mount (or use existing for edit)
  const [contactIdValue] = useState(() => generateContactId());

  // Contact Details state
  const [contactType, setContactType] = useState('Individual');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [phoneCountryCode, setPhoneCountryCode] = useState('AE');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [preferredLanguage, setPreferredLanguage] = useState('');
  const [leadSourceDefault, setLeadSourceDefault] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState('active');

  // Fetch contact for editing
  useEffect(() => {
    if (mode === 'edit' && editContactId) {
      dispatch(fetchPropertyManagerContactById(editContactId));
    }
    return () => {
      dispatch(clearCurrentContact());
      dispatch(clearContactsError());
    };
  }, [dispatch, mode, editContactId]);

  // Populate form when editing and contact is loaded
  useEffect(() => {
    if (mode !== 'edit' || !currentContact) return;

    setContactType(currentContact.contact_type || 'Individual');
    setFullName(currentContact.full_name || '');
    setEmail(currentContact.email || '');
    setPhone(currentContact.phone || '');
    setPhoneCountryCode(currentContact.phone_country_code || 'AE');
    setSelectedCountry(currentContact.country || '');
    setSelectedCity(currentContact.city || '');
    setPreferredLanguage(currentContact.preferred_language || '');
    setLeadSourceDefault(currentContact.lead_source_default || '');
    const tags = Array.isArray(currentContact.tags)
      ? currentContact.tags
      : (typeof currentContact.tags === 'string' ? JSON.parse(currentContact.tags || '[]') : []);
    setSelectedTags(tags);
    setNotes(currentContact.notes || '');
    setStatus(currentContact.status || 'active');
  }, [mode, currentContact]);

  const handleBack = useCallback(() => {
    if (onClose) {
      onClose();
    } else {
      router.push('/property-manager/contacts');
    }
  }, [onClose, router]);

  // Contact Type options
  const contactTypeOptions = [
    { label: 'Individual', value: 'Individual' },
    { label: 'Company', value: 'Company' },
    { label: 'Broker', value: 'Broker' },
    { label: 'Agent', value: 'Agent' },
  ];

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

  // Preferred Language options
  const languageOptions = [
    { label: 'Select language', value: '' },
    { label: 'English', value: 'english' },
    { label: 'Arabic', value: 'arabic' },
    { label: 'Hindi', value: 'hindi' },
    { label: 'Urdu', value: 'urdu' },
    { label: 'French', value: 'french' },
    { label: 'Spanish', value: 'spanish' },
    { label: 'Chinese', value: 'chinese' },
    { label: 'Russian', value: 'russian' },
  ];

  // Lead Source options
  const leadSourceOptions = [
    { label: 'Select lead source', value: '' },
    { label: 'Website', value: 'website' },
    { label: 'Referral', value: 'referral' },
    { label: 'Social Media', value: 'social_media' },
    { label: 'Exhibition', value: 'exhibition' },
    { label: 'Partner', value: 'partner' },
    { label: 'Direct', value: 'direct' },
    { label: 'Advertisement', value: 'advertisement' },
    { label: 'Cold Call', value: 'cold_call' },
  ];

  // Tags options
  const tagOptions = [
    { value: 'Investor', label: 'Investor' },
    { value: 'End User', label: 'End User' },
    { value: 'Holiday Guest', label: 'Holiday Guest' },
    { value: 'Corporate Client', label: 'Corporate Client' },
    { value: 'Repeat Client', label: 'Repeat Client' },
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

  // Handle tag selection
  const handleTagSelect = useCallback((tag) => {
    setSelectedTags(prev => {
      if (prev.includes(tag)) {
        return prev.filter(t => t !== tag);
      }
      return [...prev, tag];
    });
  }, []);

  const handleRemoveTag = useCallback((tag) => {
    setSelectedTags(prev => prev.filter(t => t !== tag));
  }, []);

  // Save handler
  const handleSave = useCallback(async () => {
    const contactData = {
      contact_id: mode === 'edit' ? currentContact?.contact_id : contactIdValue,
      contact_type: contactType,
      full_name: fullName,
      email,
      phone,
      phone_country_code: phoneCountryCode,
      country: selectedCountry,
      city: selectedCity,
      preferred_language: preferredLanguage,
      lead_source_default: leadSourceDefault,
      tags: selectedTags,
      notes,
      status,
    };

    try {
      if (mode === 'edit' && editContactId) {
        await dispatch(updatePropertyManagerContact({ id: editContactId, data: contactData })).unwrap();
        router.push('/property-manager/contacts');
      } else {
        await dispatch(createPropertyManagerContact(contactData)).unwrap();
        router.push('/property-manager/contacts');
      }
    } catch (err) {
      console.error('Error saving contact:', err);
    }
  }, [
    dispatch, router, mode, editContactId, currentContact,
    contactIdValue, contactType, fullName, email, phone, phoneCountryCode,
    selectedCountry, selectedCity, preferredLanguage, leadSourceDefault,
    selectedTags, notes, status
  ]);

  // Set data attribute on body when AddContact is mounted
  useEffect(() => {
    const attr = mode === 'edit' ? 'data-edit-contact-open' : 'data-add-contact-open';
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

    const closeEvent = mode === 'edit' ? 'closeEditContact' : 'closeAddContact';
    const saveEvent = mode === 'edit' ? 'saveEditContact' : 'saveAddContact';

    window.addEventListener(closeEvent, handleClose);
    window.addEventListener(saveEvent, handleSaveEvent);

    return () => {
      window.removeEventListener(closeEvent, handleClose);
      window.removeEventListener(saveEvent, handleSaveEvent);
    };
  }, [handleBack, handleSave, mode]);

  // Tags combobox state
  const [tagInputValue, setTagInputValue] = useState('');

  const updateTagText = useCallback((value) => {
    setTagInputValue(value);
  }, []);

  const filteredTagOptions = tagOptions.filter(option =>
    option.label.toLowerCase().includes(tagInputValue.toLowerCase()) &&
    !selectedTags.includes(option.value)
  );

  const isSaving = isCreating || isUpdating;

  // Show loading spinner when fetching contact for edit
  if (mode === 'edit' && isLoading && !currentContact) {
    return (
      <div className="add-contact-wrapper">
        <Box padding="1000">
          <InlineStack align="center">
            <Spinner accessibilityLabel="Loading contact" size="large" />
          </InlineStack>
        </Box>
      </div>
    );
  }

  return (
    <div className="add-contact-wrapper">
      <Page
        title={
          <InlineStack gap="050" blockAlign="center">
            <Icon source={PersonIcon} tone="base" />
            <Icon source={ChevronRightIcon} tone="subdued" />
            <span className="new-contact-title">{mode === 'edit' ? 'Edit contact' : 'Add New Contact'}</span>
          </InlineStack>
        }
      >
        {/* Error Banner */}
        {error && (
          <Box paddingBlockEnd="400">
            <Banner tone="critical" onDismiss={() => dispatch(clearContactsError())}>
              <p>{error}</p>
            </Banner>
          </Box>
        )}

        {/* Validation Errors */}
        {validationErrors && Object.keys(validationErrors).length > 0 && (
          <Box paddingBlockEnd="400">
            <Banner tone="warning" onDismiss={() => dispatch(clearContactsError())}>
              <BlockStack gap="100">
                {Object.entries(validationErrors).map(([field, messages]) => (
                  <p key={field}><strong>{field}:</strong> {Array.isArray(messages) ? messages.join(', ') : messages}</p>
                ))}
              </BlockStack>
            </Banner>
          </Box>
        )}

        <Layout>
          {/* Main content - Left column */}
          <Layout.Section>
            <BlockStack gap="400">
              {/* Contact Details card */}
              <Card>
                <BlockStack gap="400">
                  <Text variant="headingMd" as="h2">
                    Contact details
                  </Text>

                  {/* Contact ID - System generated */}
                  <TextField
                    label="Contact ID"
                    value={mode === 'edit' ? (currentContact?.contact_id || '') : contactIdValue}
                    disabled
                    helpText="System generated ID"
                    autoComplete="off"
                  />

                  {/* Contact Type */}
                  <Select
                    label="Contact Type"
                    options={contactTypeOptions}
                    value={contactType}
                    onChange={setContactType}
                    disabled={isSaving}
                  />

                  {/* Full Name */}
                  <TextField
                    label="Full Name"
                    value={fullName}
                    onChange={setFullName}
                    autoComplete="name"
                    placeholder="Enter full name"
                    disabled={isSaving}
                  />

                  {/* Email */}
                  <TextField
                    label="Email"
                    value={email}
                    onChange={setEmail}
                    type="email"
                    autoComplete="email"
                    placeholder="contact@example.com"
                    disabled={isSaving}
                  />

                  {/* Phone/WhatsApp */}
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
                          disabled={isSaving}
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
                          disabled={isSaving}
                        />
                      </Box>
                    </InlineStack>
                  </BlockStack>

                  {/* Country and City */}
                  <InlineStack gap="400" wrap={false}>
                    <Box width="50%">
                      <Select
                        label="Country"
                        options={countryOptions}
                        value={selectedCountry}
                        onChange={handleCountryChange}
                        disabled={isSaving}
                      />
                    </Box>
                    <Box width="50%">
                      <Select
                        label="City"
                        options={cityOptions}
                        value={selectedCity}
                        onChange={setSelectedCity}
                        disabled={!selectedCountry || isSaving}
                      />
                    </Box>
                  </InlineStack>

                  {/* Preferred Language */}
                  <Select
                    label="Preferred Language"
                    options={languageOptions}
                    value={preferredLanguage}
                    onChange={setPreferredLanguage}
                    disabled={isSaving}
                  />

                  {/* Lead Source Default */}
                  <Select
                    label="Lead Source Default"
                    options={leadSourceOptions}
                    value={leadSourceDefault}
                    onChange={setLeadSourceDefault}
                    disabled={isSaving}
                  />

                  {/* Tags */}
                  <BlockStack gap="200">
                    <Text variant="bodyMd" as="span">
                      Tags
                    </Text>
                    <Combobox
                      activator={
                        <Combobox.TextField
                          label="Tags"
                          labelHidden
                          value={tagInputValue}
                          onChange={updateTagText}
                          placeholder="Search tags"
                          autoComplete="off"
                          disabled={isSaving}
                        />
                      }
                    >
                      {filteredTagOptions.length > 0 && (
                        <Listbox onSelect={handleTagSelect}>
                          {filteredTagOptions.map((option) => (
                            <Listbox.Option
                              key={option.value}
                              value={option.value}
                              selected={selectedTags.includes(option.value)}
                            >
                              {option.label}
                            </Listbox.Option>
                          ))}
                        </Listbox>
                      )}
                    </Combobox>
                    {selectedTags.length > 0 && (
                      <InlineStack gap="200" wrap>
                        {selectedTags.map((tag) => {
                          const tagOption = tagOptions.find(t => t.value === tag);
                          return (
                            <Tag key={tag} onRemove={isSaving ? undefined : () => handleRemoveTag(tag)}>
                              {tagOption?.label || tag}
                            </Tag>
                          );
                        })}
                      </InlineStack>
                    )}
                  </BlockStack>

                  {/* Notes / Background Information */}
                  <TextField
                    label="Notes / Background Information"
                    value={notes}
                    onChange={setNotes}
                    multiline={4}
                    autoComplete="off"
                    placeholder="Add notes or background information about this contact..."
                    disabled={isSaving}
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
                    disabled={isSaving}
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

export default AddContact;
