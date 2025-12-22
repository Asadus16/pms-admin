'use client';

import { useMemo, useCallback, useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
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
  Tag,
  Spinner,
  Banner,
} from '@shopify/polaris';
import { PersonIcon, ChevronRightIcon, ArrowLeftIcon } from '@shopify/polaris-icons';
import '../AddContact/AddContact.css';
import {
  fetchPropertyManagerContactById,
  updatePropertyManagerContactStatus,
} from '@/store/thunks/property-manager/propertyManagerThunks';
import {
  selectCurrentContact,
  selectContactsLoading,
  selectContactsError,
  selectContactsUpdating,
  clearCurrentContact,
  clearError,
} from '@/store/slices/property-manager/contacts/slice';

function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: '2-digit' });
}

// Contact type labels
const contactTypeLabels = {
  individual: 'Individual',
  company: 'Company',
  broker: 'Broker',
  agent: 'Agent',
};

// Tag labels
const tagLabels = {
  investor: 'Investor',
  end_user: 'End User',
  holiday_guest: 'Holiday Guest',
  corporate_client: 'Corporate Client',
  repeat_client: 'Repeat Client',
};

// Language labels
const languageLabels = {
  english: 'English',
  arabic: 'Arabic',
  hindi: 'Hindi',
  urdu: 'Urdu',
  french: 'French',
  spanish: 'Spanish',
  chinese: 'Chinese',
  russian: 'Russian',
};

// Lead source labels
const leadSourceLabels = {
  website: 'Website',
  referral: 'Referral',
  social_media: 'Social Media',
  exhibition: 'Exhibition',
  partner: 'Partner',
  direct: 'Direct',
  advertisement: 'Advertisement',
  cold_call: 'Cold Call',
};

export default function ContactViewPage({ contactId }) {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch();
  const [actionsPopoverActive, setActionsPopoverActive] = useState(false);

  // Redux selectors
  const contact = useSelector(selectCurrentContact);
  const isLoading = useSelector(selectContactsLoading);
  const isUpdating = useSelector(selectContactsUpdating);
  const error = useSelector(selectContactsError);

  const basePath = useMemo(() => {
    const seg = pathname?.split('/')?.[1];
    return seg ? `/${seg}` : '/property-manager';
  }, [pathname]);

  // Fetch contact on mount
  useEffect(() => {
    if (contactId) {
      dispatch(fetchPropertyManagerContactById(contactId));
    }
    return () => {
      dispatch(clearCurrentContact());
      dispatch(clearError());
    };
  }, [dispatch, contactId]);

  const handleBack = useCallback(() => {
    router.push(`${basePath}/contacts`);
  }, [router, basePath]);

  const toggleActionsPopover = useCallback(() => {
    setActionsPopoverActive((active) => !active);
  }, []);

  const handleToggleStatus = useCallback(async () => {
    if (!contact) return;
    const newStatus = contact.status === 'active' ? 'inactive' : 'active';
    try {
      await dispatch(updatePropertyManagerContactStatus({ id: contact.id, status: newStatus })).unwrap();
      setActionsPopoverActive(false);
    } catch (err) {
      console.error('Error updating contact status:', err);
    }
  }, [dispatch, contact]);

  // Loading state
  if (isLoading && !contact) {
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

  // Not found state
  if (!isLoading && !contact) {
    return (
      <Page
        title="Contact"
        backAction={{ content: 'Contacts', onAction: handleBack }}
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
                Contact not found
              </Text>
              <Text variant="bodyMd" as="p" tone="subdued">
                We couldn&apos;t find a contact with ID: {contactId}
              </Text>
              <div>
                <Button icon={ArrowLeftIcon} onClick={handleBack}>
                  Back to contacts
                </Button>
              </div>
            </BlockStack>
          </Box>
        </Card>
      </Page>
    );
  }

  // Country + City options
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
      { label: 'Kolkata', value: 'kolkata' },
      { label: 'Jaipur', value: 'jaipur' },
      { label: 'Ahmedabad', value: 'ahmedabad' },
      { label: 'Surat', value: 'surat' },
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

  const selectedCountry = contact?.country || '';
  const selectedCity = contact?.city || '';
  const cityOptions = selectedCountry
    ? cityOptionsByCountry[selectedCountry] || [{ label: 'Select city', value: '' }]
    : [{ label: 'Select country first', value: '' }];

  const getLabel = (options, value) => options.find((o) => o.value === value)?.label || '';
  const selectedCountryLabel = getLabel(countryOptions, selectedCountry);
  const selectedCityLabel = getLabel(cityOptions, selectedCity);

  const actionsPopoverActivator = (
    <Button onClick={toggleActionsPopover} disclosure="down" loading={isUpdating}>
      More actions
    </Button>
  );

  const actionItems = [
    {
      content: 'Edit',
      onAction: () => {
        setActionsPopoverActive(false);
        router.push(`${basePath}/contacts/${contact.id}/edit`);
      },
    },
    {
      content: contact?.status === 'active' ? 'Deactivate contact' : 'Activate contact',
      destructive: contact?.status === 'active',
      onAction: handleToggleStatus,
    },
  ];

  return (
    <div className="add-contact-wrapper">
      {/* Custom header row */}
      <div className="view-user-header">
        <InlineStack gap="050" blockAlign="center">
          <Icon source={PersonIcon} tone="base" />
          <Icon source={ChevronRightIcon} tone="subdued" />
          <span className="new-contact-title">Contact details</span>
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
            <Banner tone="critical" onDismiss={() => dispatch(clearError())}>
              <p>{error}</p>
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

                  <TextField
                    label="Contact ID"
                    value={contact?.contact_id || `CON-${String(contact?.id).padStart(4, '0')}`}
                    readOnly
                    autoComplete="off"
                    helpText="System generated ID"
                  />

                  <TextField
                    label="Contact Type"
                    value={contactTypeLabels[contact?.contact_type] || contact?.contact_type || ''}
                    readOnly
                    autoComplete="off"
                  />

                  <TextField
                    label="Full Name"
                    value={contact?.full_name || ''}
                    readOnly
                    autoComplete="off"
                  />

                  <TextField
                    label="Email"
                    value={contact?.email || ''}
                    readOnly
                    autoComplete="off"
                  />

                  <TextField
                    label="Phone / WhatsApp"
                    value={contact?.phone || ''}
                    readOnly
                    autoComplete="off"
                  />

                  {/* Country and City */}
                  <InlineStack gap="400" wrap={false}>
                    <Box width="50%">
                      <TextField
                        label="Country"
                        value={selectedCountryLabel}
                        readOnly
                        autoComplete="off"
                      />
                    </Box>
                    <Box width="50%">
                      <TextField
                        label="City"
                        value={selectedCityLabel}
                        readOnly
                        autoComplete="off"
                      />
                    </Box>
                  </InlineStack>

                  <TextField
                    label="Preferred Language"
                    value={languageLabels[contact?.preferred_language] || contact?.preferred_language || ''}
                    readOnly
                    autoComplete="off"
                  />

                  <TextField
                    label="Lead Source Default"
                    value={leadSourceLabels[contact?.lead_source_default] || contact?.lead_source_default || ''}
                    readOnly
                    autoComplete="off"
                  />

                  {/* Tags */}
                  <BlockStack gap="200">
                    <Text variant="bodyMd" as="span">
                      Tags
                    </Text>
                    {(() => {
                      const tags = Array.isArray(contact?.tags)
                        ? contact.tags
                        : (typeof contact?.tags === 'string' ? JSON.parse(contact.tags || '[]') : []);
                      return tags.length > 0 ? (
                        <InlineStack gap="200" wrap>
                          {tags.map((tag) => (
                            <Tag key={tag}>
                              {tagLabels[tag] || tag}
                            </Tag>
                          ))}
                        </InlineStack>
                      ) : (
                        <Text variant="bodyMd" as="p" tone="subdued">
                          No tags assigned
                        </Text>
                      );
                    })()}
                  </BlockStack>

                  <TextField
                    label="Notes / Background Information"
                    value={contact?.notes || ''}
                    readOnly
                    multiline={4}
                    autoComplete="off"
                  />

                  {/* Date added */}
                  <TextField
                    label="Date added"
                    value={formatDate(contact?.created_at)}
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
                    value={(contact?.status || 'active') === 'active' ? 'Active' : 'Inactive'}
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
