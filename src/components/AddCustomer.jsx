import { useState, useCallback, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
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

function AddCustomer({ onClose }) {
  const navigate = useNavigate();

  const handleBack = useCallback(() => {
    if (onClose) {
      onClose();
    } else {
      navigate('/dashboard/customers');
    }
  }, [onClose, navigate]);

  // Indian flag icon component
  const IndiaFlagIcon = () => (
    <svg width="20" height="15" viewBox="0 0 20 15" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block' }}>
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
      <style>{`
  /* Gray backdrop behind modal - force visibility */
  .Polaris-Backdrop {
    pointer-events: none !important;
    background-color: rgba(0, 0, 0, 0.5) !important;
    opacity: 1 !important;
    visibility: visible !important;
  }
  
  /* Modal size - like Shopify */
  .Polaris-Modal-Dialog__Modal {
    max-width: 520px !important;
    width: 100% !important;
    background-color: white !important;
  }
  
  /* Keep modal clickable */
  .Polaris-Modal-Dialog,
  .Polaris-Modal-Dialog__Modal,
  .Polaris-Modal-Dialog__Modal * {
    pointer-events: auto !important;
  }
  
  /* White background for modal parts */
  .Polaris-Modal-Header {
    background-color: white !important;
  }
  
  .Polaris-Modal-Section {
    background-color: white !important;
  }
  
  .Polaris-Modal-Footer {
    background-color: white !important;
  }

  /* Custom modal overlay for gray background */
  #custom-modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 399;
    pointer-events: none;
  }

  /* Custom checkbox styling - thinner, cleaner like Shopify */
  .custom-checkbox {
    display: flex;
    align-items: center;
    gap: 10px;
    cursor: pointer;
    padding: 6px 0;
    user-select: none;
  }
  
  .custom-checkbox input[type="checkbox"] {
    appearance: none;
    -webkit-appearance: none;
    width: 18px;
    height: 18px;
    border: 1px solid #8c9196;
    border-radius: 4px;
    cursor: pointer;
    position: relative;
    background: white;
    flex-shrink: 0;
  }
  
  .custom-checkbox input[type="checkbox"]:checked {
    background-color: #303030;
    border-color: #303030;
  }
  
  .custom-checkbox input[type="checkbox"]:checked::after {
    content: '';
    position: absolute;
    left: 5.5px;
    top: 2px;
    width: 5px;
    height: 9px;
    border: solid white;
    border-width: 0 1.5px 1.5px 0;
    transform: rotate(45deg);
  }
  
  .custom-checkbox span {
    font-size: 13px;
    color: #303030;
    line-height: 1.4;
  }

  .add-customer-wrapper {
    max-width: 1050px;
    margin: 0 auto;
  }
  
  .add-customer-wrapper .Polaris-Page {
    max-width: 100% !important;
  }
  
  .add-customer-wrapper .new-customer-title {
    font-family: Inter, -apple-system, "system-ui", "San Francisco", "Segoe UI", Roboto, "Helvetica Neue", sans-serif !important;
    font-size: 18px !important;
    font-weight: 600 !important;
    line-height: 24px !important;
    color: rgb(48, 48, 48) !important;
  }
  
  .add-customer-wrapper .Polaris-Page__Header {
    padding-bottom: 24px !important;
    margin-bottom: 0 !important;
  }
  
  .add-customer-wrapper .Polaris-Page__Content {
    padding-top: 0 !important;
    padding-bottom: 32px !important;
    margin-top: 0 !important;
  }
  
  .add-customer-wrapper .Polaris-Page__Title {
    margin-bottom: 32px !important;
    padding-bottom: 0 !important;
  }
  
  .add-customer-wrapper .Polaris-Page > .Polaris-Box:first-child {
    margin-bottom: 24px !important;
    padding-bottom: 0 !important;
  }
  
  .add-customer-wrapper .Polaris-Layout {
    display: flex;
    gap: 16px !important;
  }
  
  .add-customer-wrapper .Polaris-Layout__Section:first-child .Polaris-Card:last-child {
    margin-bottom: 120px !important;
  }
  
  .add-customer-wrapper .Polaris-Layout__Section {
    flex: 0 1 62% !important;
    margin: 0 !important;
    padding: 0 !important;
    max-width: 62% !important;
  }
  
  .add-customer-wrapper .Polaris-Layout__Section:first-child {
    padding-bottom: 120px !important;
  }
  
  .add-customer-wrapper .Polaris-Layout__Section--secondary,
  .add-customer-wrapper .Polaris-Layout__Section[class*="oneThird"] {
    flex: 0 0 33.333% !important;
    max-width: 33.333% !important;
    min-width: 33.333% !important;
    margin: 0 !important;
    padding: 0 !important;
  }
  
  .phone-input-wrapper {
    display: flex;
    gap: 8px;
  }
  
  .phone-input-wrapper .country-select {
    width: 70px;
    flex-shrink: 0;
    position: relative;
  }
  
  .phone-input-wrapper .country-select .country-flag-icon {
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
    z-index: 100;
    pointer-events: none;
    display: flex !important;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 15px;
  }
  
  .phone-input-wrapper .country-select .country-flag-icon svg {
    display: block !important;
    width: 20px !important;
    height: 15px !important;
    visibility: visible !important;
    opacity: 1 !important;
  }
  
  .phone-input-wrapper .country-select .Polaris-Select__Content {
    padding-left: 40px !important;
  }
  
  .phone-input-wrapper .country-select .Polaris-Select__SelectedOption {
    visibility: hidden;
    width: 0;
  }
  
  .phone-input-wrapper .phone-field {
    flex: 1;
  }
  
  .add-address-button {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    padding: 12px 16px;
    background: white;
    border: 1px solid #e1e3e5;
    border-radius: 8px;
    cursor: pointer;
    width: 100%;
    transition: background-color 0.2s;
  }
  
  .add-address-button:hover {
    background-color: #f6f6f7;
  }
  
  .marketing-checkbox-disabled {
    opacity: 0.5;
  }
  
  .card-header-with-action {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
  }
  
  .edit-button {
    background: none;
    border: none;
    cursor: pointer;
    padding: 4px;
    color: #5c5f62;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .edit-button:hover {
    color: #202223;
  }
  
  /* Small tag badge like Shopify */
  .tag-badge {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 3px 8px;
    background-color: #e4e5e7;
    border-radius: 4px;
    font-size: 12px;
    color: #303030;
    line-height: 1.3;
  }
  
  .tag-remove-button {
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;
    margin: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #6d7175;
    font-size: 14px;
    line-height: 1;
    width: 14px;
    height: 14px;
  }
  
  .tag-remove-button:hover {
    color: #202223;
  }
  
  /* Mobile responsive styles */
  @media (max-width: 768px) {
    .add-customer-wrapper {
      max-width: 100% !important;
      padding: 0 !important;
      margin: 0 !important;
      width: 100% !important;
    }
    
    .add-customer-wrapper .Polaris-Layout {
      flex-direction: column !important;
      gap: 20px !important;
    }
    
    .add-customer-wrapper .Polaris-Layout__Section {
      width: 100% !important;
      max-width: 100% !important;
      flex: 1 1 100% !important;
      margin: 0 !important;
      padding: 0 !important;
    }
    
    .add-customer-wrapper .Polaris-Layout__Section--secondary,
    .add-customer-wrapper .Polaris-Layout__Section[class*="oneThird"] {
      flex: 1 1 100% !important;
      max-width: 100% !important;
      min-width: 100% !important;
      width: 100% !important;
    }
  }
`}</style>

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

                    <Box style={{
                      backgroundColor: '#f7f7f7',
                      borderRadius: '0 0 8px 8px',
                      marginLeft: '-16px',
                      marginRight: '-16px',
                      marginBottom: '-16px',
                      display: 'flex',
                      alignItems: 'center',
                      minHeight: '60px',
                      paddingTop: '12px',
                      paddingBottom: '12px'
                    }}>
                      <Box paddingBlockStart="0" paddingBlockEnd="0" style={{ width: '100%', paddingLeft: '20px', paddingRight: '20px' }}>
                        {/* Marketing permission notice */}
                        <Text
                          variant="bodyMd"
                          as="p"
                          tone="subdued"
                          style={{
                            fontFamily: 'Inter, -apple-system, "system-ui", "San Francisco", "Segoe UI", Roboto, "Helvetica Neue", sans-serif',
                            fontSize: '13px',
                            fontWeight: 450,
                            lineHeight: '20px',
                            color: 'rgb(97, 97, 97)'
                          }}
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
                      label="Tags"
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
                <div style={{ flex: 1 }}>
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