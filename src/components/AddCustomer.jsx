'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  Page,
  Card,
  Text,
  TextField,
  Select,
  Checkbox,
  Button,
  InlineStack,
  BlockStack,
  Box,
  Icon,
  Divider,
  Layout,
  Modal,
} from '@shopify/polaris';
import {
  PersonIcon,
  PlusCircleIcon,
  ChevronRightIcon,
  EditIcon,
  SearchIcon,
  SortIcon,
} from '@shopify/polaris-icons';
import './styles/AddCustomer.css';

function AddCustomer({ onClose }) {
  const router = useRouter();

  const handleBack = useCallback(() => {
    if (onClose) {
      onClose();
    } else {
      router.push('/dashboard/customers');
    }
  }, [onClose, router]);

  // Indian flag icon component
  const IndiaFlagIcon = () => (
    <svg width="20" height="15" viewBox="0 0 20 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="india-flag-icon">
      <rect width="20" height="5" fill="#FF9933" />
      <rect y="5" width="20" height="5" fill="#FFFFFF" />
      <rect y="10" width="20" height="5" fill="#138808" />
      <circle cx="10" cy="7.5" r="2" fill="#000080" />
    </svg>
  );

  // Customer overview state
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [language, setLanguage] = useState('en');
  const [email, setEmail] = useState('');
  const [phoneCountryCode, setPhoneCountryCode] = useState('IN');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [marketingEmails, setMarketingEmails] = useState(false);
  const [marketingSMS, setMarketingSMS] = useState(false);

  // Tax details state
  const [taxSetting, setTaxSetting] = useState('collect');

  // Notes and Tags state
  const [notes, setNotes] = useState('');
  const [tags, setTags] = useState('');
  const [isEditingNotes, setIsEditingNotes] = useState(false);

  // Modal states
  const [tagsModalOpen, setTagsModalOpen] = useState(false);
  const [addressModalOpen, setAddressModalOpen] = useState(false);
  const [tagSearchValue, setTagSearchValue] = useState('');

  // Add this ref at the top with other state
  const modalContentRef = useRef(null);
  const clickStartedInsideModal = useRef(false);

  // Tags selection state
  const [selectedTags, setSelectedTags] = useState([]);
  const availableTags = [
    'password page',
    'Pop Convert',
    'Pop Convert: SHAFEEN2025',
    'prospect',
    'Shop',
    'Wrote Judge.me email review',
    'Wrote Judge.me web review',
    'YourToken',
  ];

  // Address form state
  const [addressCountry, setAddressCountry] = useState('IN');
  const [addressFirstName, setAddressFirstName] = useState('');
  const [addressLastName, setAddressLastName] = useState('');
  const [addressCompany, setAddressCompany] = useState('');
  const [addressStreet, setAddressStreet] = useState('');
  const [addressApartment, setAddressApartment] = useState('');
  const [addressCity, setAddressCity] = useState('');
  const [addressState, setAddressState] = useState('');
  const [addressPinCode, setAddressPinCode] = useState('');
  const [addressPhoneCountry, setAddressPhoneCountry] = useState('IN');
  const [addressPhone, setAddressPhone] = useState('');

  const languageOptions = [
    { label: 'English [Default]', value: 'en' },
    { label: 'Hindi', value: 'hi' },
    { label: 'Tamil', value: 'ta' },
    { label: 'Telugu', value: 'te' },
    { label: 'Kannada', value: 'kn' },
  ];

  const countryCodeOptions = [
    { label: '🇮🇳', value: 'IN' },
    { label: '🇺🇸', value: 'US' },
    { label: '🇬🇧', value: 'GB' },
    { label: '🇦🇪', value: 'AE' },
    { label: '🇸🇦', value: 'SA' },
  ];

  const taxSettingOptions = [
    { label: 'Collect tax', value: 'collect' },
    { label: 'Do not collect tax', value: 'exempt' },
  ];

  const countryOptions = [
    { label: 'India', value: 'IN' },
    { label: 'United States', value: 'US' },
    { label: 'United Kingdom', value: 'GB' },
    { label: 'United Arab Emirates', value: 'AE' },
    { label: 'Saudi Arabia', value: 'SA' },
    { label: 'Canada', value: 'CA' },
    { label: 'Australia', value: 'AU' },
  ];

  const indianStates = [
    { label: 'Select a state', value: '' },
    { label: 'Andhra Pradesh', value: 'AP' },
    { label: 'Karnataka', value: 'KA' },
    { label: 'Kerala', value: 'KL' },
    { label: 'Maharashtra', value: 'MH' },
    { label: 'Tamil Nadu', value: 'TN' },
    { label: 'Telangana', value: 'TG' },
    { label: 'Delhi', value: 'DL' },
    { label: 'Gujarat', value: 'GJ' },
    { label: 'Rajasthan', value: 'RJ' },
    { label: 'West Bengal', value: 'WB' },
  ];

  // Modal handlers
  const handleTagsModalOpen = useCallback(() => {
    setTagsModalOpen(true);
  }, []);

  // Replace handleTagsModalClose with this
  const handleTagsModalClose = useCallback((event) => {
    // Only close if click didn't start inside modal content
    // Also check if the event target is the backdrop
    const shouldClose = !clickStartedInsideModal.current;

    if (shouldClose) {
      setTagsModalOpen(false);
      setTagSearchValue('');
    }

    // Reset the flag
    clickStartedInsideModal.current = false;
  }, []);

  // Force close function for buttons
  const forceCloseTagsModal = useCallback(() => {
    clickStartedInsideModal.current = false;
    setTagsModalOpen(false);
    setTagSearchValue('');
  }, []);

  const handleTagToggle = useCallback((tag) => {
    setSelectedTags(prev => {
      if (prev.includes(tag)) {
        return prev.filter(t => t !== tag);
      } else {
        return [...prev, tag];
      }
    });
  }, []);


  const handleSaveTags = useCallback(() => {
    setTags(selectedTags.join(', '));
    forceCloseTagsModal();
  }, [selectedTags, forceCloseTagsModal]);

  const handleTagInput = useCallback((value) => {
    // Check if value contains comma, then add tags
    if (value.includes(',')) {
      const tagParts = value.split(',').map(t => t.trim()).filter(t => t.length > 0);
      if (tagParts.length > 0) {
        const lastTag = tagParts[tagParts.length - 1];
        const tagsToAdd = tagParts.slice(0, -1);

        tagsToAdd.forEach(tag => {
          if (tag) {
            setSelectedTags(prev => {
              if (!prev.includes(tag)) {
                return [...prev, tag];
              }
              return prev;
            });
          }
        });

        setTags(lastTag);
      } else {
        setTags('');
      }
    } else {
      setTags(value);
    }
  }, []);

  const handleTagKeyDown = useCallback((e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const value = tags.trim();
      if (value && !selectedTags.includes(value)) {
        setSelectedTags(prev => [...prev, value]);
        setTags('');
      }
    }
  }, [tags, selectedTags]);

  const handleRemoveTag = useCallback((tagToRemove) => {
    setSelectedTags(prev => prev.filter(tag => tag !== tagToRemove));
  }, []);

  const handleAddressModalOpen = useCallback(() => {
    setAddressModalOpen(true);
  }, []);

  const handleAddressModalClose = useCallback(() => {
    setAddressModalOpen(false);
  }, []);

  const handleSaveAddress = useCallback(() => {
    console.log('Saving address:', {
      country: addressCountry,
      firstName: addressFirstName,
      lastName: addressLastName,
      company: addressCompany,
      street: addressStreet,
      apartment: addressApartment,
      city: addressCity,
      state: addressState,
      pinCode: addressPinCode,
      phone: addressPhone,
    });
    setAddressModalOpen(false);
  }, [addressCountry, addressFirstName, addressLastName, addressCompany, addressStreet, addressApartment, addressCity, addressState, addressPinCode, addressPhone]);

  // Filter tags based on search
  const filteredAvailableTags = availableTags.filter(tag =>
    tag.toLowerCase().includes(tagSearchValue.toLowerCase()) &&
    !selectedTags.includes(tag)
  );

  const handleSave = useCallback(() => {
    console.log('Saving customer:', {
      firstName,
      lastName,
      language,
      email,
      phoneCountryCode,
      phoneNumber,
      marketingEmails,
      marketingSMS,
      taxSetting,
      notes,
      tags,
    });
  }, [firstName, lastName, language, email, phoneCountryCode, phoneNumber, marketingEmails, marketingSMS, taxSetting, notes, tags]);

  // Add this effect to track where mousedown events start
  useEffect(() => {
    if (!tagsModalOpen) {
      document.body.removeAttribute('data-tags-modal-open');
      return;
    }

    // Set attribute to help with CSS targeting
    document.body.setAttribute('data-tags-modal-open', 'true');

    const handleGlobalMouseDown = (e) => {
      // Check if the click started inside the modal content
      const target = e.target;

      // Check if click is inside modal content ref
      if (modalContentRef.current && modalContentRef.current.contains(target)) {
        clickStartedInsideModal.current = true;
        e.stopPropagation(); // Prevent event from reaching Polaris
        return;
      }

      // Check if click is on Polaris Modal backdrop (the overlay)
      const isBackdrop = target.closest('.Polaris-Modal-Dialog__Backdrop') ||
        target.closest('[class*="Modal__Backdrop"]') ||
        (target.classList && target.classList.contains('Polaris-Modal-Dialog__Backdrop'));

      // Check if click is on the modal dialog container but not the content
      const modalDialog = target.closest('.Polaris-Modal-Dialog');
      const isModalDialog = modalDialog &&
        !target.closest('.Polaris-Modal-Section') &&
        !target.closest('[class*="Modal-Section"]') &&
        !modalContentRef.current?.contains(target);

      // Only allow close if it's a genuine backdrop click
      if (isBackdrop || isModalDialog) {
        clickStartedInsideModal.current = false;
      } else if (modalContentRef.current && modalContentRef.current.contains(target)) {
        // Double check - if it's inside our ref, mark it
        clickStartedInsideModal.current = true;
        e.stopPropagation();
      } else {
        // If we can't determine, be safe and assume it's inside modal
        clickStartedInsideModal.current = true;
      }
    };

    // Use capture phase to catch the event before Polaris does
    document.addEventListener('mousedown', handleGlobalMouseDown, true);
    document.addEventListener('click', handleGlobalMouseDown, true);

    return () => {
      document.removeEventListener('mousedown', handleGlobalMouseDown, true);
      document.removeEventListener('click', handleGlobalMouseDown, true);
      document.body.removeAttribute('data-tags-modal-open');
    };
  }, [tagsModalOpen]);

  // Set data attribute on body when AddCustomer is mounted
  useEffect(() => {
    document.body.setAttribute('data-add-customer-open', 'true');
    return () => {
      document.body.removeAttribute('data-add-customer-open');
    };
  }, []);

  // Listen for custom events from header
  useEffect(() => {
    const handleClose = () => {
      handleBack();
    };

    const handleSaveEvent = () => {
      handleSave();
    };

    window.addEventListener('closeAddCustomer', handleClose);
    window.addEventListener('saveAddCustomer', handleSaveEvent);

    return () => {
      window.removeEventListener('closeAddCustomer', handleClose);
      window.removeEventListener('saveAddCustomer', handleSaveEvent);
    };
  }, [handleBack, handleSave]);


  // Add this useEffect after your other useEffects
  useEffect(() => {
    if (tagsModalOpen || addressModalOpen) {
      // Create overlay element
      const overlay = document.createElement('div');
      overlay.id = 'custom-modal-overlay';
      overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, 0.5);
      z-index: 399;
      pointer-events: none;
    `;
      document.body.appendChild(overlay);

      return () => {
        const existingOverlay = document.getElementById('custom-modal-overlay');
        if (existingOverlay) {
          existingOverlay.remove();
        }
      };
    }
  }, [tagsModalOpen, addressModalOpen]);

  return (
    <>
      <div className="add-customer-wrapper">
        <Page
          title={
            <InlineStack gap="050" blockAlign="center">
              <Icon source={PersonIcon} tone="base" />
              <Icon source={ChevronRightIcon} tone="subdued" />
              <span className="new-customer-title">New customer</span>
            </InlineStack>
          }
        >
          <Layout>
            {/* Main content - Left column */}
            <Layout.Section>
              <BlockStack gap="400">
                {/* Customer overview card */}
                <Card>
                  <BlockStack gap="400">
                    <Text variant="headingMd" as="h2">
                      Customer overview
                    </Text>

                    {/* First name and Last name */}
                    <InlineStack gap="400" wrap={false}>
                      <Box width="50%">
                        <TextField
                          label="First name"
                          value={firstName}
                          onChange={setFirstName}
                          autoComplete="given-name"
                        />
                      </Box>
                      <Box width="50%">
                        <TextField
                          label="Last name"
                          value={lastName}
                          onChange={setLastName}
                          autoComplete="family-name"
                        />
                      </Box>
                    </InlineStack>

                    {/* Language */}
                    <BlockStack gap="100">
                      <Select
                        label="Language"
                        options={languageOptions}
                        value={language}
                        onChange={setLanguage}
                      />
                      <Text variant="bodySm" as="p" tone="subdued">
                        This customer will receive notifications in this language.
                      </Text>
                    </BlockStack>

                    {/* Email */}
                    <TextField
                      label="Email"
                      type="email"
                      value={email}
                      onChange={setEmail}
                      autoComplete="email"
                    />

                    {/* Phone number */}
                    <BlockStack gap="100">
                      <Text variant="bodyMd" as="span">
                        Phone number
                      </Text>
                      <div className="phone-input-wrapper">
                        <div className="country-select">
                          <div className="country-flag-icon">
                            <IndiaFlagIcon />
                          </div>
                          <Select
                            label="Country code"
                            labelHidden
                            options={countryCodeOptions}
                            value={phoneCountryCode}
                            onChange={setPhoneCountryCode}
                          />
                        </div>
                        <div className="phone-field">
                          <TextField
                            label="Phone number"
                            labelHidden
                            type="tel"
                            value={phoneNumber}
                            onChange={setPhoneNumber}
                            autoComplete="tel"
                          />
                        </div>
                      </div>
                    </BlockStack>

                    {/* Marketing consent checkboxes */}
                    <BlockStack gap="200">
                      <div className="marketing-checkbox-disabled">
                        <Checkbox
                          label="Customer agreed to receive marketing emails."
                          checked={marketingEmails}
                          onChange={setMarketingEmails}
                          disabled={!email}
                        />
                      </div>
                      <div className="marketing-checkbox-disabled">
                        <Checkbox
                          label="Customer agreed to receive SMS marketing text messages."
                          checked={marketingSMS}
                          onChange={setMarketingSMS}
                          disabled={!phoneNumber}
                        />
                      </div>
                    </BlockStack>

                    <Box className="marketing-notice-box">
                      <Box paddingBlockStart="0" paddingBlockEnd="0" className="marketing-notice-box-inner">
                        {/* Marketing permission notice */}
                        <Text
                          variant="bodyMd"
                          as="p"
                          tone="subdued"
                          className="marketing-notice-text"
                        >
                          You should ask your customers for permission before you subscribe them to your marketing emails or SMS.
                        </Text>
                      </Box>
                    </Box>
                  </BlockStack>
                </Card>

                {/* Default address card */}
                <Card>
                  <BlockStack gap="300">
                    <BlockStack gap="100">
                      <Text variant="headingMd" as="h2">
                        Default address
                      </Text>
                      <Text variant="bodyMd" as="p" tone="subdued">
                        The primary address of this customer
                      </Text>
                    </BlockStack>

                    <button className="add-address-button" onClick={handleAddressModalOpen}>
                      <InlineStack gap="200" blockAlign="center">
                        <Icon source={PlusCircleIcon} tone="base" />
                        <Text variant="bodyMd" as="span">
                          Add address
                        </Text>
                      </InlineStack>
                    </button>
                  </BlockStack>
                </Card>

                {/* Tax details card */}
                <Card>
                  <BlockStack gap="300">
                    <Text variant="headingMd" as="h2">
                      Tax details
                    </Text>

                    <Select
                      label="Tax settings"
                      options={taxSettingOptions}
                      value={taxSetting}
                      onChange={setTaxSetting}
                    />
                  </BlockStack>
                </Card>
              </BlockStack>
            </Layout.Section>

            {/* Sidebar - Right column */}
            <Layout.Section variant="oneThird">
              <BlockStack gap="400">
                {/* Notes card */}
                <Card>
                  <BlockStack gap="200">
                    <div className="card-header-with-action">
                      <Text variant="headingMd" as="h2">
                        Notes
                      </Text>
                      <button
                        className="edit-button"
                        onClick={() => setIsEditingNotes(!isEditingNotes)}
                        aria-label="Edit notes"
                      >
                        <Icon source={EditIcon} tone="subdued" />
                      </button>
                    </div>

                    {isEditingNotes ? (
                      <TextField
                        label="Notes"
                        labelHidden
                        value={notes}
                        onChange={setNotes}
                        multiline={3}
                        autoComplete="off"
                      />
                    ) : (
                      <Text variant="bodyMd" as="p" tone="subdued">
                        Notes are private and won't be shared with the customer.
                      </Text>
                    )}
                  </BlockStack>
                </Card>

                {/* Tags card */}
                <Card>
                  <BlockStack gap="200">
                    <div className="card-header-with-action">
                      <Text variant="headingMd" as="h2">
                        Tags
                      </Text>
                      <button
                        className="edit-button"
                        onClick={handleTagsModalOpen}
                        aria-label="Edit tags"
                      >
                        <Icon source={EditIcon} tone="subdued" />
                      </button>
                    </div>

                    <TextField
                      value={tags}
                      onChange={handleTagInput}
                      onKeyDown={handleTagKeyDown}
                      placeholder="Enter tags separated by commas"
                      autoComplete="off"
                    />

                    {selectedTags.length > 0 && (
                      <InlineStack gap="200" wrap>
                        {selectedTags.map((tag, index) => (
                          <span key={index} className="tag-badge">
                            {tag}
                            <button
                              className="tag-remove-button"
                              onClick={() => handleRemoveTag(tag)}
                              aria-label={`Remove ${tag} tag`}
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </InlineStack>
                    )}
                  </BlockStack>
                </Card>
              </BlockStack>
            </Layout.Section>
          </Layout>
        </Page>

        {/* Add Tags Modal */}
        <Modal
          open={tagsModalOpen}
          onClose={() => {
            // Blocked - only close via buttons
          }}
          title="Add tags"
          primaryAction={{
            content: 'Save',
            onAction: () => {
              setTags(selectedTags.join(', '));
              setTagsModalOpen(false);
              setTagSearchValue('');
            },
          }}
          secondaryActions={[
            {
              content: 'Cancel',
              onAction: () => {
                setTagsModalOpen(false);
                setTagSearchValue('');
              },
            },
          ]}
        >
          <Modal.Section>
            <BlockStack gap="400">
              {/* Search and Sort row */}
              <InlineStack gap="300" wrap={false}>
                <div className="flex-1">
                  <TextField
                    label="Search tags"
                    labelHidden
                    placeholder="Search to find or create tags"
                    value={tagSearchValue}
                    onChange={setTagSearchValue}
                    prefix={<Icon source={SearchIcon} tone="subdued" />}
                    autoComplete="off"
                  />
                </div>
                <Button icon={SortIcon}>Alphabetical</Button>
              </InlineStack>

              {/* To add section */}
              {selectedTags.length > 0 && (
                <BlockStack gap="200">
                  <Text variant="headingSm" as="h3">
                    To add
                  </Text>
                  <BlockStack gap="100">
                    {selectedTags.map((tag) => (
                      <label key={tag} className="custom-checkbox">
                        <input
                          type="checkbox"
                          checked={true}
                          onChange={() => handleTagToggle(tag)}
                        />
                        <span>{tag}</span>
                      </label>
                    ))}
                  </BlockStack>
                </BlockStack>
              )}

              {/* Available section */}
              {filteredAvailableTags.length > 0 && (
                <BlockStack gap="200">
                  <Text variant="headingSm" as="h3">
                    Available
                  </Text>
                  <BlockStack gap="100">
                    {filteredAvailableTags.map((tag) => (
                      <label key={tag} className="custom-checkbox">
                        <input
                          type="checkbox"
                          checked={false}
                          onChange={() => handleTagToggle(tag)}
                        />
                        <span>{tag}</span>
                      </label>
                    ))}
                  </BlockStack>
                </BlockStack>
              )}
            </BlockStack>
          </Modal.Section>
        </Modal>

        {/* Add Default Address Modal */}
        <Modal
          open={addressModalOpen}
          onClose={handleAddressModalClose}
          title="Add default address"
          primaryAction={{
            content: 'Save',
            onAction: handleSaveAddress,
          }}
          secondaryActions={[
            {
              content: 'Cancel',
              onAction: handleAddressModalClose,
            },
          ]}
        >
          <Modal.Section>
            <BlockStack gap="400">
              {/* Country/region */}
              <Select
                label="Country/region"
                options={countryOptions}
                value={addressCountry}
                onChange={setAddressCountry}
              />

              {/* First name and Last name */}
              <InlineStack gap="400" wrap={false}>
                <Box width="50%">
                  <TextField
                    label="First name"
                    value={addressFirstName}
                    onChange={setAddressFirstName}
                    autoComplete="given-name"
                  />
                </Box>
                <Box width="50%">
                  <TextField
                    label="Last name"
                    value={addressLastName}
                    onChange={setAddressLastName}
                    autoComplete="family-name"
                  />
                </Box>
              </InlineStack>

              {/* Company */}
              <TextField
                label="Company"
                value={addressCompany}
                onChange={setAddressCompany}
                autoComplete="organization"
              />

              {/* Address */}
              <TextField
                label="Address"
                value={addressStreet}
                onChange={setAddressStreet}
                prefix={<Icon source={SearchIcon} tone="subdued" />}
                autoComplete="street-address"
              />

              {/* Apartment, suite, etc */}
              <TextField
                label="Apartment, suite, etc"
                value={addressApartment}
                onChange={setAddressApartment}
                autoComplete="address-line2"
              />

              {/* City and State */}
              <InlineStack gap="400" wrap={false}>
                <Box width="50%">
                  <TextField
                    label="City"
                    value={addressCity}
                    onChange={setAddressCity}
                    autoComplete="address-level2"
                  />
                </Box>
                <Box width="50%">
                  <Select
                    label="State"
                    options={indianStates}
                    value={addressState}
                    onChange={setAddressState}
                  />
                </Box>
              </InlineStack>

              {/* PIN code */}
              <TextField
                label="PIN code"
                value={addressPinCode}
                onChange={setAddressPinCode}
                autoComplete="postal-code"
              />

              {/* Phone */}
              <BlockStack gap="100">
                <Text variant="bodyMd" as="span">
                  Phone
                </Text>
                <div className="phone-input-wrapper">
                  <div className="country-select">
                    <div className="country-flag-icon">
                      <IndiaFlagIcon />
                    </div>
                    <Select
                      label="Country code"
                      labelHidden
                      options={countryCodeOptions}
                      value={addressPhoneCountry}
                      onChange={setAddressPhoneCountry}
                    />
                  </div>
                  <div className="phone-field">
                    <TextField
                      label="Phone"
                      labelHidden
                      type="tel"
                      value={addressPhone}
                      onChange={setAddressPhone}
                      autoComplete="tel"
                    />
                  </div>
                </div>
              </BlockStack>
            </BlockStack>
          </Modal.Section>
        </Modal>
      </div>
    </>
  );
}

export default AddCustomer;