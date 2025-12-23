'use client';

import { useMemo, useCallback, useState } from 'react';
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
  Thumbnail,
  LegacyStack,
  Banner,
} from '@shopify/polaris';
import { TeamIcon, ChevronRightIcon, ArrowLeftIcon } from '@shopify/polaris-icons';
import './AddDeveloper.css';
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import { fetchPropertyManagerDeveloperById } from '@/store/thunks/property-manager/propertyManagerThunks';
import {
  selectDeveloper,
  selectDevelopersLoading,
  selectDevelopersError,
} from '@/store/slices/property-manager';

function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: '2-digit' });
}

export default function DeveloperViewPage({ developerId }) {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const [actionsPopoverActive, setActionsPopoverActive] = useState(false);

  // Redux state
  const developer = useAppSelector(selectDeveloper);
  const loading = useAppSelector(selectDevelopersLoading);
  const error = useAppSelector(selectDevelopersError);

  const basePath = useMemo(() => {
    const seg = pathname?.split('/')?.[1];
    return seg ? `/${seg}` : '/property-manager';
  }, [pathname]);

  // Fetch developer from API
  useEffect(() => {
    alert('kkkk')
    if (!developerId) return;
    dispatch(fetchPropertyManagerDeveloperById(developerId));
  }, [developerId, dispatch]);

  const handleBack = useCallback(() => {
    router.push(`${basePath}/developers`);
  }, [router, basePath]);

  const toggleActionsPopover = useCallback(() => {
    setActionsPopoverActive((active) => !active);
  }, []);

  if (loading) {
    return (
      <Page
        title="Developer"
        backAction={{ content: 'Developers', onAction: handleBack }}
      >
        <Card>
          <Box padding="400">
            <Text>Loading developer...</Text>
          </Box>
        </Card>
      </Page>
    );
  }

  if (error || !developer) {
    return (
      <Page
        title="Developer"
        backAction={{ content: 'Developers', onAction: handleBack }}
      >
        <Card>
          <Box padding="400">
            <BlockStack gap="200">
              <Text variant="headingMd" as="h2">
                {error ? 'Error loading developer' : 'Developer not found'}
              </Text>
              <Text variant="bodyMd" as="p" tone="subdued">
                {error || `We couldn't find a developer with ID: ${developerId}`}
              </Text>
              <div>
                <Button icon={ArrowLeftIcon} onClick={handleBack}>
                  Back to developers
                </Button>
              </div>
            </BlockStack>
          </Box>
        </Card>
      </Page>
    );
  }

  // Country + City options (copied from AddDeveloper)
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

  const selectedCountry = developer.selectedCountry || '';
  const selectedCity = developer.selectedCity || '';
  const cityOptions = selectedCountry
    ? cityOptionsByCountry[selectedCountry] || [{ label: 'Select city', value: '' }]
    : [{ label: 'Select country first', value: '' }];

  const getLabel = (options, value) => options.find((o) => o.value === value)?.label || '';
  const selectedCountryLabel = getLabel(countryOptions, selectedCountry);
  const selectedCityLabel = getLabel(cityOptions, selectedCity);

  const actionsPopoverActivator = (
    <Button onClick={toggleActionsPopover} disclosure="down">
      More actions
    </Button>
  );

  const actionItems = [
    {
      content: 'Edit',
      onAction: () => {
        setActionsPopoverActive(false);
        router.push(`${basePath}/developers/${developer.id}/edit`);
      },
    },
    {
      content: developer.status === 'active' ? 'Deactivate developer' : 'Activate developer',
      destructive: developer.status === 'active',
      onAction: () => {
        setActionsPopoverActive(false);
        // Placeholder for future status update
        console.log('Toggle developer status', developer.id);
      },
    },
  ];

  return (
    <div className="add-developer-wrapper">
      {/* Custom header row (matches buildit-fe ViewUser layout) */}
      <div className="view-user-header">
        <InlineStack gap="050" blockAlign="center">
          <Icon source={TeamIcon} tone="base" />
          <Icon source={ChevronRightIcon} tone="subdued" />
          <span className="new-developer-title">Developer details</span>
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

                  <TextField
                    label="Developer ID"
                    value={developer.developerId || `DEV-${String(developer.id).padStart(4, '0')}`}
                    readOnly
                    autoComplete="off"
                    helpText="System generated ID"
                  />

                  <TextField
                    label="Developer name"
                    value={developer.name || ''}
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

                  {/* Registered Address */}
                  <TextField
                    label="Registered address"
                    value={developer.registeredAddress || ''}
                    multiline={2}
                    readOnly
                    autoComplete="off"
                    placeholder="Enter registered office address"
                  />

                  {/* Website URL */}
                  <TextField
                    label="Website URL"
                    value={developer.websiteUrl || ''}
                    type="url"
                    readOnly
                    autoComplete="off"
                    placeholder="https://www.example.com"
                  />

                  {/* Logo */}
                  <BlockStack gap="200">
                    <Text variant="bodyMd" as="span">
                      Logo
                    </Text>
                    <Card>
                      {developer.logoUrl ? (
                        <LegacyStack alignment="center">
                          <Thumbnail
                            size="large"
                            alt={`${developer.name} logo`}
                            source={developer.logoUrl}
                          />
                          <div>
                            <Text variant="bodyMd" as="p" fontWeight="semibold">
                              {developer.logoUrl.split('/').pop()}
                            </Text>
                            <Text variant="bodySm" as="p" tone="subdued">
                              Test logo
                            </Text>
                          </div>
                        </LegacyStack>
                      ) : (
                        <Text variant="bodySm" as="p" tone="subdued">
                          No logo uploaded.
                        </Text>
                      )}
                    </Card>
                  </BlockStack>

                  {/* RERA Registration Number */}
                  <TextField
                    label="RERA registration number"
                    value={developer.reraNumber || ''}
                    type="text"
                    readOnly
                    autoComplete="off"
                    placeholder="Enter RERA registration number"
                  />

                  {/* Description */}
                  <TextField
                    label="Description"
                    value={developer.description || ''}
                    multiline={4}
                    readOnly
                    autoComplete="off"
                    placeholder="Enter description about the developer..."
                  />

                  {/* Quick meta fields mirrored from table */}
                  <InlineStack gap="400" wrap={false}>
                    <Box width="50%">
                      <TextField
                        label="Number of properties"
                        value={String(developer.propertiesCount ?? '')}
                        readOnly
                        autoComplete="off"
                      />
                    </Box>
                    <Box width="50%">
                      <TextField
                        label="Date added"
                        value={formatDate(developer.dateAdded)}
                        readOnly
                        autoComplete="off"
                      />
                    </Box>
                  </InlineStack>
                </BlockStack>
              </Card>

              {/* Primary Contact Person card */}
              <Card>
                <BlockStack gap="400">
                  <Text variant="headingMd" as="h2">
                    Primary contact person
                  </Text>

                  <TextField
                    label="Contact name"
                    value={developer.primaryContactName || ''}
                    readOnly
                    autoComplete="off"
                  />

                  <TextField
                    label="Contact email"
                    value={developer.primaryContactEmail || ''}
                    readOnly
                    autoComplete="off"
                  />

                  <TextField
                    label="Contact phone / WhatsApp"
                    value={developer.primaryContactNumber || ''}
                    readOnly
                    autoComplete="off"
                  />
                </BlockStack>
              </Card>

              {/* Marketing Material card (same section as /developers/new) */}
              <Card>
                <BlockStack gap="400">
                  <Text variant="headingMd" as="h2">
                    Marketing material
                  </Text>

                  {/* Photos */}
                  <BlockStack gap="200">
                    <Text variant="bodyMd" as="span">
                      Photos
                    </Text>

                    {Array.isArray(developer.mediaUrls) && developer.mediaUrls.length > 0 ? (
                      <Card>
                        <BlockStack gap="300">
                          <InlineStack align="space-between">
                            <Text variant="bodyMd" as="span">
                              {developer.mediaUrls.length} photo{developer.mediaUrls.length > 1 ? 's' : ''}
                            </Text>
                          </InlineStack>
                          <InlineStack gap="300" wrap>
                            {developer.mediaUrls.map((url, idx) => (
                              <Thumbnail
                                key={`${developer.id}-photo-${idx}`}
                                size="large"
                                alt={`Photo ${idx + 1}`}
                                source={url}
                              />
                            ))}
                          </InlineStack>
                        </BlockStack>
                      </Card>
                    ) : (
                      <Banner tone="info">
                        <p>No photos uploaded.</p>
                      </Banner>
                    )}
                  </BlockStack>

                  {/* Videos */}
                  {developer._apiData?.videos && developer._apiData.videos.length > 0 && (
                    <BlockStack gap="200">
                      <Text variant="bodyMd" as="span">
                        Videos
                      </Text>
                      <Card>
                        <BlockStack gap="300">
                          <Text variant="bodyMd" as="span">
                            {developer._apiData.videos.length} video{developer._apiData.videos.length > 1 ? 's' : ''}
                          </Text>
                          <InlineStack gap="300" wrap>
                            {developer._apiData.videos.map((video, idx) => (
                              <div key={`${developer.id}-video-${idx}`}>
                                <Text variant="bodySm" as="p">
                                  <a href={video.file_path} target="_blank" rel="noopener noreferrer">
                                    Video {idx + 1}
                                  </a>
                                </Text>
                              </div>
                            ))}
                          </InlineStack>
                        </BlockStack>
                      </Card>
                    </BlockStack>
                  )}

                  {/* Brochure */}
                  <BlockStack gap="200">
                    <Text variant="bodyMd" as="span">
                      Brochure
                    </Text>
                    <Card>
                      {developer.brochure ? (
                        <LegacyStack alignment="center">
                          <div>
                            <Text variant="bodyMd" as="p" fontWeight="semibold">
                              <a href={developer.brochure.file_path} target="_blank" rel="noopener noreferrer">
                                {developer.brochure.name}
                              </a>
                            </Text>
                            <Text variant="bodySm" as="p" tone="subdued">
                              PDF Document
                            </Text>
                          </div>
                        </LegacyStack>
                      ) : (
                        <Text variant="bodySm" as="p" tone="subdued">
                          No brochure uploaded.
                        </Text>
                      )}
                    </Card>
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
                  <TextField
                    label="Status"
                    labelHidden
                    value={(developer.status || 'active') === 'active' ? 'Active' : 'Inactive'}
                    readOnly
                    autoComplete="off"
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
                    value={developer.notes || ''}
                    readOnly
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