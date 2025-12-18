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
import { projectsData } from '../data/projects';
import './styles/AddDeveloper.css';

function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: '2-digit' });
}

export default function ProjectViewPage({ projectId }) {
  const router = useRouter();
  const pathname = usePathname();
  const [actionsPopoverActive, setActionsPopoverActive] = useState(false);

  const basePath = useMemo(() => {
    const seg = pathname?.split('/')?.[1];
    return seg ? `/${seg}` : '/property-manager';
  }, [pathname]);

  const project = useMemo(
    () => projectsData.find((p) => String(p.id) === String(projectId)),
    [projectId]
  );

  const handleBack = useCallback(() => {
    router.push(`${basePath}/projects`);
  }, [router, basePath]);

  const toggleActionsPopover = useCallback(() => {
    setActionsPopoverActive((active) => !active);
  }, []);

  if (!project) {
    return (
      <Page
        title="Project"
        backAction={{ content: 'Projects', onAction: handleBack }}
      >
        <Card>
          <Box padding="400">
            <BlockStack gap="200">
              <Text variant="headingMd" as="h2">
                Project not found
              </Text>
              <Text variant="bodyMd" as="p" tone="subdued">
                We couldn&apos;t find a project with ID: {projectId}
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

  // Country and City options (same as AddProject)
  const countryOptions = [
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

  const getLabel = (options, value) => options.find((o) => o.value === value)?.label || value || '';
  const selectedCountryLabel = getLabel(countryOptions, project.selectedCountry);

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
                    value={project.projectId || `PRJ-${String(project.id).padStart(4, '0')}`}
                    readOnly
                    autoComplete="off"
                    helpText="System generated ID"
                  />

                  <TextField
                    label="Developer"
                    value={project.developer || ''}
                    readOnly
                    autoComplete="off"
                  />

                  <TextField
                    label="Project Name"
                    value={project.projectName || ''}
                    readOnly
                    autoComplete="off"
                  />

                  <TextField
                    label="Project Type"
                    value={project.projectType || ''}
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
                    value={`${project.constructionProgress || 0}%`}
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
                    value={project.reraNumber || ''}
                    readOnly
                    autoComplete="off"
                  />

                  {/* Masterplan */}
                  {project.masterplanUrl && (
                    <BlockStack gap="200">
                      <Text variant="bodyMd" as="span">
                        Masterplan
                      </Text>
                      <Card>
                        <Thumbnail
                          size="large"
                          alt="Masterplan"
                          source={project.masterplanUrl}
                        />
                      </Card>
                    </BlockStack>
                  )}

                  {/* Floor Plan */}
                  {project.floorPlanUrl && (
                    <BlockStack gap="200">
                      <Text variant="bodyMd" as="span">
                        Floor Plan
                      </Text>
                      <Card>
                        <Thumbnail
                          size="large"
                          alt="Floor Plan"
                          source={project.floorPlanUrl}
                        />
                      </Card>
                    </BlockStack>
                  )}

                  {/* Project Images */}
                  {project.projectImages && project.projectImages.length > 0 && (
                    <BlockStack gap="200">
                      <Text variant="bodyMd" as="span">
                        Project Images
                      </Text>
                      <Card>
                        <InlineStack gap="300" wrap>
                          {project.projectImages.map((url, idx) => (
                            <Thumbnail
                              key={idx}
                              size="large"
                              alt={`Project image ${idx + 1}`}
                              source={url}
                            />
                          ))}
                        </InlineStack>
                      </Card>
                    </BlockStack>
                  )}

                  {/* Project Video */}
                  {project.projectVideoUrl && (
                    <BlockStack gap="200">
                      <Text variant="bodyMd" as="span">
                        Project Video
                      </Text>
                      <Card>
                        <Thumbnail
                          size="large"
                          alt="Project Video"
                          source={project.projectVideoUrl}
                        />
                      </Card>
                    </BlockStack>
                  )}

                  {/* Date added */}
                  <TextField
                    label="Date added"
                    value={formatDate(project.dateAdded)}
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
                        value={selectedCountryLabel}
                        readOnly
                        autoComplete="off"
                      />
                    </Box>
                    <Box width="50%">
                      <TextField
                        label="City"
                        value={project.selectedCity || ''}
                        readOnly
                        autoComplete="off"
                      />
                    </Box>
                  </InlineStack>

                  <InlineStack gap="400" wrap={false}>
                    <Box width="50%">
                      <TextField
                        label="Community"
                        value={project.community || ''}
                        readOnly
                        autoComplete="off"
                      />
                    </Box>
                    <Box width="50%">
                      <TextField
                        label="Sub-Community"
                        value={project.subCommunity || ''}
                        readOnly
                        autoComplete="off"
                      />
                    </Box>
                  </InlineStack>

                  {project.mapCoordinates && (
                    <TextField
                      label="Google Map Coordinates"
                      value={project.mapCoordinates}
                      readOnly
                      autoComplete="off"
                    />
                  )}
                </BlockStack>
              </Card>

              {/* Amenities Details card */}
              {project.amenities && (
                <Card>
                  <BlockStack gap="400">
                    <Text variant="headingMd" as="h2">
                      Amenities details
                    </Text>
                    <BlockStack gap="200">
                      {project.amenities.park && <Text variant="bodyMd" as="span">✓ Park</Text>}
                      {project.amenities.gym && <Text variant="bodyMd" as="span">✓ Gym</Text>}
                      {project.amenities.pool && <Text variant="bodyMd" as="span">✓ Pool</Text>}
                      {project.amenities.security && <Text variant="bodyMd" as="span">✓ Security</Text>}
                      {project.amenities.parking && <Text variant="bodyMd" as="span">✓ Parking</Text>}
                      {project.amenities.etc && <Text variant="bodyMd" as="span">✓ Etc</Text>}
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
                    <Text variant="bodyMd" as="span">✓ DLD Waiver</Text>
                  )}
                  {project.postHandoverPlan && (
                    <TextField
                      label="Post-handover plan"
                      value={project.postHandoverPlan}
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

                  {(project.priceMin || project.priceMax) && (
                    <InlineStack gap="400" wrap={false}>
                      <Box width="50%">
                        <TextField
                          label="Price Range (Min)"
                          value={project.priceMin ? `$${project.priceMin}` : ''}
                          readOnly
                          autoComplete="off"
                        />
                      </Box>
                      <Box width="50%">
                        <TextField
                          label="Price Range (Max)"
                          value={project.priceMax ? `$${project.priceMax}` : ''}
                          readOnly
                          autoComplete="off"
                        />
                      </Box>
                    </InlineStack>
                  )}

                  {project.serviceChargePerSqft && (
                    <TextField
                      label="Service Charge Per Sqft"
                      value={`$${project.serviceChargePerSqft}/sqft`}
                      readOnly
                      autoComplete="off"
                    />
                  )}

                  {project.estimatedROI && (
                    <TextField
                      label="Estimated ROI"
                      value={`${project.estimatedROI}%`}
                      readOnly
                      autoComplete="off"
                    />
                  )}

                  {project.paymentPlanPdfUrl && (
                    <BlockStack gap="200">
                      <Text variant="bodyMd" as="span">
                        Payment Plan
                      </Text>
                      <Card>
                        <LegacyStack alignment="center">
                          <Icon source={NoteIcon} tone="base" />
                          <Text variant="bodyMd" as="p">Payment Plan PDF</Text>
                        </LegacyStack>
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
                      tone={project.status === 'active' ? 'success' : project.status === 'completed' ? 'info' : 'subdued'}
                    >
                      {project.status === 'active' ? 'Active' : project.status === 'completed' ? 'Completed' : 'Inactive'}
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

