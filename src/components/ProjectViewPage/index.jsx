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
  Badge,
  Thumbnail,
  LegacyStack,
  Banner,
} from '@shopify/polaris';
import { ProductIcon, ChevronRightIcon, ArrowLeftIcon, NoteIcon } from '@shopify/polaris-icons';
import './AddDeveloper.css';
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import { fetchPropertyManagerProjectById } from '@/store/thunks/property-manager/propertyManagerThunks';
import {
  selectProject,
  selectProjectsLoading,
  selectProjectsError,
} from '@/store/slices/property-manager';

function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: '2-digit' });
}

export default function ProjectViewPage({ projectId }) {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const [actionsPopoverActive, setActionsPopoverActive] = useState(false);

  // Redux state
  const project = useAppSelector(selectProject);
  const loading = useAppSelector(selectProjectsLoading);
  const error = useAppSelector(selectProjectsError);

  const basePath = useMemo(() => {
    const seg = pathname?.split('/')?.[1];
    return seg ? `/${seg}` : '/property-manager';
  }, [pathname]);

  const handleBack = useCallback(() => {
    router.push(`${basePath}/projects`);
  }, [router, basePath]);

  // Fetch project from API
  useEffect(() => {
    if (!projectId) return;
    dispatch(fetchPropertyManagerProjectById(projectId));
  }, [projectId, dispatch]);

  const toggleActionsPopover = useCallback(() => {
    setActionsPopoverActive((active) => !active);
  }, []);

  if (loading) {
    return (
      <Page
        title="Project"
        backAction={{ content: 'Projects', onAction: handleBack }}
      >
        <Card>
          <Box padding="400">
            <Text>Loading project...</Text>
          </Box>
        </Card>
      </Page>
    );
  }

  if (error || !project) {
    return (
      <Page
        title="Project"
        backAction={{ content: 'Projects', onAction: handleBack }}
      >
        <Card>
          <Box padding="400">
            <BlockStack gap="200">
              <Text variant="headingMd" as="h2">
                {error ? 'Error loading project' : 'Project not found'}
              </Text>
              <Text variant="bodyMd" as="p" tone="subdued">
                {error || `We couldn't find a project with ID: ${projectId}`}
              </Text>
              <div>
                <Button icon={ArrowLeftIcon} onClick={handleBack}>
                  Back to projects
                </Button>
              </div>
            </BlockStack>
          </Box>
        </Card>
      </Page>
    );
  }

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
        router.push(`${basePath}/projects/${project.id}/edit`);
      },
    },
    {
      content: project.status === 'active' ? 'Deactivate project' : 'Activate project',
      destructive: project.status === 'active',
      onAction: () => {
        setActionsPopoverActive(false);
        // Placeholder for future status update
        console.log('Toggle project status', project.id);
      },
    },
  ];

  // Get country label if needed
  const countryOptions = [
    { label: 'United Arab Emirates', value: 'UAE' },
    { label: 'Saudi Arabia', value: 'SA' },
    { label: 'Qatar', value: 'QA' },
    { label: 'Bahrain', value: 'BH' },
    { label: 'Kuwait', value: 'KW' },
    { label: 'Oman', value: 'OM' },
    { label: 'India', value: 'IN' },
    { label: 'United States', value: 'US' },
    { label: 'United Kingdom', value: 'GB' },
  ];
  const getLabel = (options, value) => {
    const found = options.find((o) => o.value === value);
    return found?.label || (value != null ? String(value) : '');
  };
  const selectedCountryLabel = getLabel(countryOptions, project.country);

  return (
    <div className="add-developer-wrapper">
      {/* Custom header row (matches buildit-fe ViewUser layout) */}
      <div className="view-user-header">
        <InlineStack gap="050" blockAlign="center">
          <Icon source={ProductIcon} tone="base" />
          <Icon source={ChevronRightIcon} tone="subdued" />
          <span className="new-developer-title">Project details</span>
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
              {/* Project Details card */}
              <Card>
                <BlockStack gap="400">
                  <Text variant="headingMd" as="h2">
                    Project details
                  </Text>

                  <TextField
                    label="Project ID"
                    value={project.projectId ? String(project.projectId) : (project.id != null ? `PRJ-${String(project.id).padStart(4, '0')}` : '')}
                    readOnly
                    autoComplete="off"
                    helpText="System generated ID"
                  />

                  <TextField
                    label="Developer"
                    value={project.developer?.name ? String(project.developer.name) : (project.developer ? String(project.developer) : '')}
                    readOnly
                    autoComplete="off"
                  />

                  <TextField
                    label="Project Name"
                    value={project.projectName != null ? String(project.projectName) : ''}
                    readOnly
                    autoComplete="off"
                  />

                  <TextField
                    label="Project Type"
                    value={project.projectType != null ? String(project.projectType) : ''}
                    readOnly
                    autoComplete="off"
                  />

                  <TextField
                    label="Expected Handover Date"
                    value={project.expectedHandoverDate ? formatDate(project.expectedHandoverDate) : ''}
                    readOnly
                    autoComplete="off"
                  />

                  <TextField
                    label="Construction Progress"
                    value={project.constructionProgress != null ? `${parseFloat(project.constructionProgress).toFixed(1)}%` : '0%'}
                    readOnly
                    autoComplete="off"
                  />

                  {/* Project Description */}
                  {project.projectDescription && (
                    <BlockStack gap="200">
                      <Text variant="bodyMd" as="span">
                        Project Description
                      </Text>
                      <Box padding="300" borderWidth="025" borderColor="border" borderRadius="200">
                        <div dangerouslySetInnerHTML={{ __html: project.projectDescription }} />
                      </Box>
                    </BlockStack>
                  )}

                  <TextField
                    label="RERA / Municipality Number"
                    value={project.reraMunicipalityNumber != null ? String(project.reraMunicipalityNumber) : ''}
                    readOnly
                    autoComplete="off"
                  />

                  {/* Masterplan */}
                  {project.masterplan && (
                    <BlockStack gap="200">
                      <Text variant="bodyMd" as="span">
                        Masterplan
                      </Text>
                      <Card>
                        <LegacyStack alignment="center">
                          <Thumbnail
                            size="large"
                            alt="Masterplan"
                            source={project.masterplan.file_path}
                          />
                          <div>
                            <Text variant="bodyMd" as="p" fontWeight="semibold">
                              <a href={project.masterplan.file_path} target="_blank" rel="noopener noreferrer">
                                {project.masterplan.file_name}
                              </a>
                            </Text>
                            <Text variant="bodySm" as="p" tone="subdued">
                              {project.masterplan.mime_type}
                            </Text>
                          </div>
                        </LegacyStack>
                      </Card>
                    </BlockStack>
                  )}

                  {/* Floor Plans */}
                  {project.floorPlans && project.floorPlans.length > 0 && (
                    <BlockStack gap="200">
                      <Text variant="bodyMd" as="span">
                        Floor Plans ({project.floorPlans.length})
                      </Text>
                      <Card>
                        <BlockStack gap="300">
                          <InlineStack gap="300" wrap>
                            {project.floorPlans.map((plan, idx) => (
                              <div key={plan.id || idx}>
                                <Thumbnail
                                  size="large"
                                  alt={`Floor Plan ${idx + 1}`}
                                  source={plan.file_path}
                                />
                                <Text variant="bodySm" as="p">
                                  <a href={plan.file_path} target="_blank" rel="noopener noreferrer">
                                    {plan.file_name}
                                  </a>
                                </Text>
                              </div>
                            ))}
                          </InlineStack>
                        </BlockStack>
                      </Card>
                    </BlockStack>
                  )}

                  {/* Project Images */}
                  {project.images && project.images.length > 0 && (
                    <BlockStack gap="200">
                      <Text variant="bodyMd" as="span">
                        Project Images ({project.images.length})
                      </Text>
                      <Card>
                        <InlineStack gap="300" wrap>
                          {project.images.map((image, idx) => (
                            <Thumbnail
                              key={image.id || idx}
                              size="large"
                              alt={`Project image ${idx + 1}`}
                              source={image.file_path}
                            />
                          ))}
                        </InlineStack>
                      </Card>
                    </BlockStack>
                  )}

                  {/* Project Videos */}
                  {project.videos && project.videos.length > 0 && (
                    <BlockStack gap="200">
                      <Text variant="bodyMd" as="span">
                        Project Videos ({project.videos.length})
                      </Text>
                      <Card>
                        <BlockStack gap="300">
                          {project.videos.map((video, idx) => (
                            <div key={video.id || idx}>
                              <Text variant="bodySm" as="p">
                                <a href={video.file_path} target="_blank" rel="noopener noreferrer">
                                  Video {idx + 1} - {video.file_name}
                                </a>
                              </Text>
                            </div>
                          ))}
                        </BlockStack>
                      </Card>
                    </BlockStack>
                  )}

                  {/* Date added */}
                  <TextField
                    label="Date added"
                    value={project.dateAdded ? formatDate(project.dateAdded) : ''}
                    readOnly
                    autoComplete="off"
                  />
                </BlockStack>
              </Card>

              {/* Location Details card */}
              <Card>
                <BlockStack gap="400">
                  <Text variant="headingMd" as="h2">
                    Location details
                  </Text>

                  <InlineStack gap="400" wrap={false}>
                    <Box width="50%">
                      <TextField
                        label="Country"
                        value={selectedCountryLabel || ''}
                        readOnly
                        autoComplete="off"
                      />
                    </Box>
                    <Box width="50%">
                      <TextField
                        label="City"
                        value={project.city != null ? String(project.city) : ''}
                        readOnly
                        autoComplete="off"
                      />
                    </Box>
                  </InlineStack>

                  <InlineStack gap="400" wrap={false}>
                    <Box width="50%">
                      <TextField
                        label="Community"
                        value={project.community != null ? String(project.community) : ''}
                        readOnly
                        autoComplete="off"
                      />
                    </Box>
                    <Box width="50%">
                      <TextField
                        label="Sub-Community"
                        value={project.subCommunity != null ? String(project.subCommunity) : ''}
                        readOnly
                        autoComplete="off"
                      />
                    </Box>
                  </InlineStack>

                  {project.googleMapCoordinates && (
                    <TextField
                      label="Google Map Coordinates"
                      value={`${project.googleMapCoordinates.latitude ?? ''}, ${project.googleMapCoordinates.longitude ?? ''}`}
                      readOnly
                      autoComplete="off"
                    />
                  )}
                </BlockStack>
              </Card>

              {/* Amenities Details card */}
              {project.amenitiesArray && project.amenitiesArray.length > 0 && (
                <Card>
                  <BlockStack gap="400">
                    <Text variant="headingMd" as="h2">
                      Amenities details
                    </Text>
                    <BlockStack gap="200">
                      {project.amenitiesArray.map((amenity, idx) => (
                        <Text key={idx} variant="bodyMd" as="span">✓ {amenity}</Text>
                      ))}
                    </BlockStack>
                  </BlockStack>
                </Card>
              )}

              {/* Developer Incentives card */}
              <Card>
                <BlockStack gap="400">
                  <Text variant="headingMd" as="h2">
                    Developer incentives
                  </Text>
                  {project.dldWaiver && (
                    <TextField
                      label="DLD Waiver"
                      value={project.dldWaiver != null ? String(project.dldWaiver) : ''}
                      multiline={2}
                      readOnly
                      autoComplete="off"
                    />
                  )}
                  {project.postHandoverPlan && (
                    <TextField
                      label="Post-handover plan"
                      value={project.postHandoverPlan != null ? String(project.postHandoverPlan) : ''}
                      multiline={3}
                      readOnly
                      autoComplete="off"
                    />
                  )}
                </BlockStack>
              </Card>

              {/* Financial Details card */}
              <Card>
                <BlockStack gap="400">
                  <Text variant="headingMd" as="h2">
                    Financial details
                  </Text>

                  {(project.priceRangeMin || project.priceRangeMax) && (
                    <InlineStack gap="400" wrap={false}>
                      <Box width="50%">
                        <TextField
                          label="Price Range (Min)"
                          value={project.priceRangeMin ? `$${parseFloat(project.priceRangeMin).toLocaleString()}` : ''}
                          readOnly
                          autoComplete="off"
                        />
                      </Box>
                      <Box width="50%">
                        <TextField
                          label="Price Range (Max)"
                          value={project.priceRangeMax ? `$${parseFloat(project.priceRangeMax).toLocaleString()}` : ''}
                          readOnly
                          autoComplete="off"
                        />
                      </Box>
                    </InlineStack>
                  )}

                  {project.serviceChargePerSqft && (
                    <TextField
                      label="Service Charge Per Sqft"
                      value={project.serviceChargePerSqft != null ? `$${parseFloat(project.serviceChargePerSqft).toFixed(2)}/sqft` : ''}
                      readOnly
                      autoComplete="off"
                    />
                  )}

                  {project.estimatedRoi && (
                    <TextField
                      label="Estimated ROI"
                      value={project.estimatedRoi != null ? `${parseFloat(project.estimatedRoi).toFixed(2)}%` : ''}
                      readOnly
                      autoComplete="off"
                    />
                  )}

                  {project.paymentPlans && project.paymentPlans.length > 0 && (
                    <BlockStack gap="200">
                      <Text variant="bodyMd" as="span">
                        Payment Plans
                      </Text>
                      <Card>
                        <BlockStack gap="300">
                          {project.paymentPlans.map((plan, idx) => (
                            <div key={idx}>
                              <Text variant="bodyMd" as="p" fontWeight="semibold">
                                {plan.name}
                              </Text>
                              <Text variant="bodySm" as="p" tone="subdued">
                                {plan.installments} installments over {plan.duration_months} months
                              </Text>
                            </div>
                          ))}
                        </BlockStack>
                      </Card>
                    </BlockStack>
                  )}
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
                  <Box paddingBlockStart="200">
                    <Badge 
                      tone={project.status === 'Completed' ? 'info' : 
                            project.status === 'Under Construction' ? 'success' : 
                            project.status === 'Near Completion' ? 'attention' : 'subdued'}
                    >
                      {project.status || 'N/A'}
                    </Badge>
                  </Box>
                </BlockStack>
              </Card>
            </BlockStack>
          </Layout.Section>
        </Layout>
      </Page>
    </div>
  );
}

