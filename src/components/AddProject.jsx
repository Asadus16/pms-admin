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
  Checkbox,
} from '@shopify/polaris';
import {
  ProductIcon,
  ChevronRightIcon,
  NoteIcon,
  CalendarIcon,
} from '@shopify/polaris-icons';
import { Editor } from '@tinymce/tinymce-react';
import { developersData } from '../data/developers';
import GoogleMapPicker from './GoogleMapPicker';
import './styles/AddDeveloper.css';

// Generate a unique project ID
const generateProjectId = () => {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `PRJ-${timestamp}-${random}`;
};

function AddProject({ onClose, mode = 'create', initialProject = null }) {
  const router = useRouter();
  const editorRef = useRef(null);
  const [isMounted, setIsMounted] = useState(false);

  // Track client-side mounting for TinyMCE
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Generate project ID on mount (or use existing for edit)
  const [projectId] = useState(() => initialProject?.projectId || generateProjectId());

  // Project Details state
  const [selectedDeveloper, setSelectedDeveloper] = useState('');
  const [projectName, setProjectName] = useState('');
  const [projectType, setProjectType] = useState('');
  const [status, setStatus] = useState('active');
  const [expectedHandoverDate, setExpectedHandoverDate] = useState('');
  const [constructionProgress, setConstructionProgress] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [reraNumber, setReraNumber] = useState('');
  const [masterplanFile, setMasterplanFile] = useState(null);
  const [floorPlanFile, setFloorPlanFile] = useState(null);
  const [projectImages, setProjectImages] = useState([]);
  const [projectVideo, setProjectVideo] = useState(null);

  // Location Details state
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [community, setCommunity] = useState('');
  const [subCommunity, setSubCommunity] = useState('');
  const [mapCoordinates, setMapCoordinates] = useState('');

  // Amenities state
  const [amenities, setAmenities] = useState({
    park: false,
    gym: false,
    pool: false,
    security: false,
    parking: false,
  });

  // Developer Incentives state
  const [dldWaiver, setDldWaiver] = useState(false);
  const [postHandoverPlan, setPostHandoverPlan] = useState(false);

  // Financial Details state
  const [priceMin, setPriceMin] = useState('');
  const [priceMax, setPriceMax] = useState('');
  const [serviceChargePerSqft, setServiceChargePerSqft] = useState('');
  const [estimatedROI, setEstimatedROI] = useState('');
  const [paymentPlanType, setPaymentPlanType] = useState('set'); // 'set' or 'upload'
  const [paymentPlanPdf, setPaymentPlanPdf] = useState(null);
  const [paymentPlanDetails, setPaymentPlanDetails] = useState('');

  // Populate form when editing
  useEffect(() => {
    if (mode !== 'edit' || !initialProject) return;

    setSelectedDeveloper(initialProject.developer || '');
    setProjectName(initialProject.projectName || '');
    setProjectType(initialProject.projectType || '');
    setStatus(initialProject.status || 'active');
    setExpectedHandoverDate(initialProject.expectedHandoverDate || '');
    setConstructionProgress(String(initialProject.constructionProgress || ''));
    setProjectDescription(initialProject.projectDescription || '');
    setReraNumber(initialProject.reraNumber || '');
    setSelectedCountry(initialProject.selectedCountry || '');
    setSelectedCity(initialProject.selectedCity || '');
    setCommunity(initialProject.community || '');
    setSubCommunity(initialProject.subCommunity || '');
    setMapCoordinates(initialProject.mapCoordinates || '');
    setAmenities(initialProject.amenities || {
      park: false,
      gym: false,
      pool: false,
      security: false,
      parking: false,
    });
    setDldWaiver(initialProject.dldWaiver || false);
    setPostHandoverPlan(initialProject.postHandoverPlan || false);
    setPriceMin(initialProject.priceMin || '');
    setPriceMax(initialProject.priceMax || '');
    setServiceChargePerSqft(initialProject.serviceChargePerSqft || '');
    setEstimatedROI(initialProject.estimatedROI || '');
    setPaymentPlanType(initialProject.paymentPlanType || 'set');
    setPaymentPlanDetails(initialProject.paymentPlanDetails || '');
  }, [mode, initialProject]);

  const handleBack = useCallback(() => {
    if (onClose) {
      onClose();
    } else {
      router.push('/property-manager/projects');
    }
  }, [onClose, router]);

  // Developer options from developersData
  const developerOptions = [
    { label: 'Select developer', value: '' },
    ...developersData.map(dev => ({
      label: dev.name,
      value: dev.id,
    })),
  ];

  // Project Type options
  const projectTypeOptions = [
    { label: 'Select project type', value: '' },
    { label: 'Residential', value: 'residential' },
    { label: 'Commercial', value: 'commercial' },
    { label: 'Mixed Use', value: 'mixed_use' },
    { label: 'Industrial', value: 'industrial' },
    { label: 'Hospitality', value: 'hospitality' },
  ];

  // Status options
  const statusOptions = [
    { label: 'Active', value: 'active' },
    { label: 'Inactive', value: 'inactive' },
    { label: 'Completed', value: 'completed' },
    { label: 'Under Construction', value: 'under_construction' },
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

  const cityOptions = selectedCountry
    ? cityOptionsByCountry[selectedCountry] || [{ label: 'Select city', value: '' }]
    : [{ label: 'Select country first', value: '' }];

  // Community options (can be dynamic based on city)
  const communityOptions = [
    { label: 'Select community', value: '' },
    { label: 'Downtown', value: 'downtown' },
    { label: 'Suburban', value: 'suburban' },
    { label: 'Coastal', value: 'coastal' },
    { label: 'Business District', value: 'business_district' },
    { label: 'Historic', value: 'historic' },
    { label: 'Urban', value: 'urban' },
    { label: 'Residential', value: 'residential' },
    { label: 'Luxury', value: 'luxury' },
    { label: 'Modern', value: 'modern' },
    { label: 'Hill Station', value: 'hill_station' },
  ];

  // Handle country change - reset city
  const handleCountryChange = useCallback((value) => {
    setSelectedCountry(value);
    setSelectedCity('');
  }, []);

  // File upload handlers
  const handleMasterplanDrop = useCallback((_dropFiles, acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      setMasterplanFile({
        file,
        preview: URL.createObjectURL(file),
        name: file.name,
      });
    }
  }, []);

  const handleMasterplanRemove = useCallback(() => {
    if (masterplanFile?.preview) {
      URL.revokeObjectURL(masterplanFile.preview);
    }
    setMasterplanFile(null);
  }, [masterplanFile]);

  const handleFloorPlanDrop = useCallback((_dropFiles, acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      setFloorPlanFile({
        file,
        preview: URL.createObjectURL(file),
        name: file.name,
      });
    }
  }, []);

  const handleFloorPlanRemove = useCallback(() => {
    if (floorPlanFile?.preview) {
      URL.revokeObjectURL(floorPlanFile.preview);
    }
    setFloorPlanFile(null);
  }, [floorPlanFile]);

  const handleProjectImagesDrop = useCallback((_dropFiles, acceptedFiles) => {
    const newFiles = acceptedFiles.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      name: file.name,
    }));
    setProjectImages(prev => [...prev, ...newFiles]);
  }, []);

  const handleRemoveAllImages = useCallback(() => {
    projectImages.forEach(file => {
      if (file.preview) {
        URL.revokeObjectURL(file.preview);
      }
    });
    setProjectImages([]);
  }, [projectImages]);

  const handleProjectVideoDrop = useCallback((_dropFiles, acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      setProjectVideo({
        file,
        preview: URL.createObjectURL(file),
        name: file.name,
      });
    }
  }, []);

  const handleProjectVideoRemove = useCallback(() => {
    if (projectVideo?.preview) {
      URL.revokeObjectURL(projectVideo.preview);
    }
    setProjectVideo(null);
  }, [projectVideo]);

  const handlePaymentPlanPdfDrop = useCallback((_dropFiles, acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      setPaymentPlanPdf({
        file,
        name: file.name,
        size: file.size,
      });
    }
  }, []);

  const handlePaymentPlanPdfRemove = useCallback(() => {
    setPaymentPlanPdf(null);
  }, []);

  // Amenities handlers
  const handleAmenityChange = useCallback((amenity) => {
    setAmenities(prev => ({
      ...prev,
      [amenity]: !prev[amenity],
    }));
  }, []);

  // Save handler
  const handleSave = useCallback(() => {
    console.log('Saving project:', {
      projectId,
      selectedDeveloper,
      projectName,
      projectType,
      status,
      expectedHandoverDate,
      constructionProgress,
      projectDescription,
      reraNumber,
      masterplanFile,
      floorPlanFile,
      projectImages,
      projectVideo,
      selectedCountry,
      selectedCity,
      community,
      subCommunity,
      mapCoordinates,
      amenities,
      dldWaiver,
      postHandoverPlan,
      priceMin,
      priceMax,
      serviceChargePerSqft,
      estimatedROI,
      paymentPlanType,
      paymentPlanPdf,
      paymentPlanDetails,
    });
  }, [
    projectId, selectedDeveloper, projectName, projectType, status,
    expectedHandoverDate, constructionProgress, projectDescription, reraNumber,
    masterplanFile, floorPlanFile, projectImages, projectVideo,
    selectedCountry, selectedCity, community, subCommunity, mapCoordinates,
    amenities, dldWaiver, postHandoverPlan,
    priceMin, priceMax, serviceChargePerSqft, estimatedROI,
    paymentPlanType, paymentPlanPdf, paymentPlanDetails,
  ]);

  // Set data attribute on body when AddProject is mounted
  useEffect(() => {
    const attr = mode === 'edit' ? 'data-edit-project-open' : 'data-add-project-open';
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

    const closeEvent = mode === 'edit' ? 'closeEditProject' : 'closeAddProject';
    const saveEvent = mode === 'edit' ? 'saveEditProject' : 'saveAddProject';

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
      if (masterplanFile?.preview) {
        URL.revokeObjectURL(masterplanFile.preview);
      }
      if (floorPlanFile?.preview) {
        URL.revokeObjectURL(floorPlanFile.preview);
      }
      if (projectVideo?.preview) {
        URL.revokeObjectURL(projectVideo.preview);
      }
      projectImages.forEach(file => {
        if (file.preview) {
          URL.revokeObjectURL(file.preview);
        }
      });
    };
  }, []);


  // Upload content renderers
  const masterplanUploadedContent = masterplanFile && (
    <LegacyStack alignment="center">
      <Thumbnail
        size="large"
        alt={masterplanFile.name}
        source={masterplanFile.preview}
      />
      <div>
        <Text variant="bodyMd" as="p">{masterplanFile.name}</Text>
        <Button variant="plain" tone="critical" onClick={handleMasterplanRemove}>Remove</Button>
      </div>
    </LegacyStack>
  );

  const floorPlanUploadedContent = floorPlanFile && (
    <LegacyStack alignment="center">
      <Thumbnail
        size="large"
        alt={floorPlanFile.name}
        source={floorPlanFile.preview}
      />
      <div>
        <Text variant="bodyMd" as="p">{floorPlanFile.name}</Text>
        <Button variant="plain" tone="critical" onClick={handleFloorPlanRemove}>Remove</Button>
      </div>
    </LegacyStack>
  );

  const projectImagesContent = projectImages.length > 0 && (
    <BlockStack gap="300">
      <InlineStack align="space-between">
        <Text variant="bodyMd" as="span">
          {projectImages.length} image{projectImages.length > 1 ? 's' : ''} selected
        </Text>
        <Button variant="plain" tone="critical" onClick={handleRemoveAllImages}>Remove all</Button>
      </InlineStack>
      <InlineStack gap="300" wrap>
        {projectImages.map((file, index) => (
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

  const projectVideoContent = projectVideo && (
    <LegacyStack alignment="center">
      <Thumbnail
        size="large"
        alt={projectVideo.name}
        source={projectVideo.preview}
      />
      <div>
        <Text variant="bodyMd" as="p">{projectVideo.name}</Text>
        <Button variant="plain" tone="critical" onClick={handleProjectVideoRemove}>Remove</Button>
      </div>
    </LegacyStack>
  );

  const paymentPlanPdfContent = paymentPlanPdf && (
    <LegacyStack alignment="center">
      <Icon source={NoteIcon} tone="base" />
      <LegacyStack.Item fill>
        <Text variant="bodyMd" as="p">{paymentPlanPdf.name}</Text>
        <Text variant="bodySm" as="p" tone="subdued">
          {(paymentPlanPdf.size / 1024).toFixed(1)} KB
        </Text>
      </LegacyStack.Item>
      <Button variant="plain" tone="critical" onClick={handlePaymentPlanPdfRemove}>Remove</Button>
    </LegacyStack>
  );

  return (
    <div className="add-developer-wrapper">
      <Page
        title={
          <InlineStack gap="050" blockAlign="center">
            <Icon source={ProductIcon} tone="base" />
            <Icon source={ChevronRightIcon} tone="subdued" />
            <span className="new-developer-title">{mode === 'edit' ? 'Edit project' : 'New project'}</span>
          </InlineStack>
        }
      >
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

                  {/* Project ID - System generated */}
                  <TextField
                    label="Project ID"
                    value={projectId}
                    disabled
                    helpText="System generated ID"
                    autoComplete="off"
                  />

                  {/* Project Name */}
                  <TextField
                    label="Project name"
                    value={projectName}
                    onChange={setProjectName}
                    autoComplete="off"
                    placeholder="Enter project name"
                  />

                  {/* Project Type */}
                  <Select
                    label="Project type"
                    options={projectTypeOptions}
                    value={projectType}
                    onChange={setProjectType}
                  />

                  {/* Status */}
                  <Select
                    label="Status"
                    options={statusOptions}
                    value={status}
                    onChange={setStatus}
                  />

                  {/* Expected Handover Date */}
                  <Box className="date-field-no-browser-icon">
                    <TextField
                      label="Expected handover date"
                      type="date"
                      value={expectedHandoverDate}
                      onChange={setExpectedHandoverDate}
                      autoComplete="off"
                      suffix={<Icon source={CalendarIcon} tone="subdued" />}
                    />
                  </Box>

                  {/* Construction Progress */}
                  <TextField
                    label="Construction progress (%)"
                    type="number"
                    value={constructionProgress}
                    onChange={setConstructionProgress}
                    autoComplete="off"
                    placeholder="0-100"
                    suffix="%"
                  />

                  {/* Project Description */}
                  <BlockStack gap="100">
                    <Text variant="bodyMd" as="label">
                      Project description
                    </Text>
                    <div className="tinymce-wrapper">
                      {isMounted ? (
                        <Editor
                          apiKey="0hqtu2qjf9v1ybvcpw3hib8doiart5u1xflmude8lgyl7ys7"
                          onInit={(_evt, editor) => editorRef.current = editor}
                          value={projectDescription}
                          onEditorChange={(content) => setProjectDescription(content)}
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
                            placeholder: 'Enter project description...',
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

                  {/* RERA / Municipality Number */}
                  <TextField
                    label="RERA / Municipality number"
                    type="text"
                    value={reraNumber}
                    onChange={setReraNumber}
                    autoComplete="off"
                    placeholder="Enter RERA or Municipality number"
                  />

                  {/* Masterplan Upload */}
                  <BlockStack gap="200">
                    <Text variant="bodyMd" as="span">
                      Masterplan
                    </Text>
                    {masterplanFile ? (
                      <Card>
                        {masterplanUploadedContent}
                      </Card>
                    ) : (
                      <DropZone
                        accept="image/*,.pdf"
                        type="file"
                        onDrop={handleMasterplanDrop}
                        allowMultiple={false}
                      >
                        <BlockStack gap="200" inlineAlign="center">
                          <InlineStack gap="200" align="center">
                            <Button onClick={() => {}}>Upload new</Button>
                            <Button variant="plain">Select existing</Button>
                          </InlineStack>
                          <Text variant="bodySm" as="p" tone="subdued">
                            Accepts images or PDF
                          </Text>
                        </BlockStack>
                      </DropZone>
                    )}
                  </BlockStack>

                  {/* Floor Plan Upload */}
                  <BlockStack gap="200">
                    <Text variant="bodyMd" as="span">
                      Floor plan
                    </Text>
                    {floorPlanFile ? (
                      <Card>
                        {floorPlanUploadedContent}
                      </Card>
                    ) : (
                      <DropZone
                        accept="image/*,.pdf"
                        type="file"
                        onDrop={handleFloorPlanDrop}
                        allowMultiple={false}
                      >
                        <BlockStack gap="200" inlineAlign="center">
                          <InlineStack gap="200" align="center">
                            <Button onClick={() => {}}>Upload new</Button>
                            <Button variant="plain">Select existing</Button>
                          </InlineStack>
                          <Text variant="bodySm" as="p" tone="subdued">
                            Accepts images or PDF
                          </Text>
                        </BlockStack>
                      </DropZone>
                    )}
                  </BlockStack>

                  {/* Project Images Upload */}
                  <BlockStack gap="200">
                    <Text variant="bodyMd" as="span">
                      Project images
                    </Text>
                    {projectImages.length > 0 ? (
                      <Card>
                        {projectImagesContent}
                        <Box paddingBlockStart="300">
                          <DropZone
                            accept="image/*"
                            type="file"
                            onDrop={handleProjectImagesDrop}
                            allowMultiple
                            variableHeight
                          >
                            <DropZone.FileUpload actionTitle="Add more images" />
                          </DropZone>
                        </Box>
                      </Card>
                    ) : (
                      <DropZone
                        accept="image/*"
                        type="file"
                        onDrop={handleProjectImagesDrop}
                        allowMultiple
                      >
                        <BlockStack gap="200" inlineAlign="center">
                          <InlineStack gap="200" align="center">
                            <Button onClick={() => {}}>Upload new</Button>
                            <Button variant="plain">Select existing</Button>
                          </InlineStack>
                          <Text variant="bodySm" as="p" tone="subdued">
                            Accepts images
                          </Text>
                        </BlockStack>
                      </DropZone>
                    )}
                  </BlockStack>

                  {/* Project Video Upload */}
                  <BlockStack gap="200">
                    <Text variant="bodyMd" as="span">
                      Project video
                    </Text>
                    {projectVideo ? (
                      <Card>
                        {projectVideoContent}
                      </Card>
                    ) : (
                      <DropZone
                        accept="video/*"
                        type="file"
                        onDrop={handleProjectVideoDrop}
                        allowMultiple={false}
                      >
                        <BlockStack gap="200" inlineAlign="center">
                          <InlineStack gap="200" align="center">
                            <Button onClick={() => {}}>Upload new</Button>
                            <Button variant="plain">Select existing</Button>
                          </InlineStack>
                          <Text variant="bodySm" as="p" tone="subdued">
                            Accepts video files
                          </Text>
                        </BlockStack>
                      </DropZone>
                    )}
                  </BlockStack>
                </BlockStack>
              </Card>

              {/* Location Details card */}
              <Card>
                <BlockStack gap="400">
                  <Text variant="headingMd" as="h2">
                    Location details
                  </Text>

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

                  {/* Community and Sub-Community */}
                  <InlineStack gap="400" wrap={false}>
                    <Box width="50%">
                      <Select
                        label="Community"
                        options={communityOptions}
                        value={community}
                        onChange={setCommunity}
                      />
                    </Box>
                    <Box width="50%">
                      <TextField
                        label="Sub-community"
                        value={subCommunity}
                        onChange={setSubCommunity}
                        autoComplete="off"
                        placeholder="Enter sub-community"
                      />
                    </Box>
                  </InlineStack>

                  {/* Google Map Coordinates */}
                  <TextField
                    label="Google map coordinates"
                    value={mapCoordinates}
                    onChange={setMapCoordinates}
                    autoComplete="off"
                    placeholder="e.g., 25.2048, 55.2708"
                    helpText="Enter latitude and longitude separated by comma, or use the map below to search and select a location"
                  />

                  {/* Google Map Picker */}
                  <GoogleMapPicker
                    coordinates={mapCoordinates}
                    onCoordinatesChange={setMapCoordinates}
                    apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
                  />
                </BlockStack>
              </Card>

              {/* Amenities Details card */}
              <Card>
                <BlockStack gap="400">
                  <Text variant="headingMd" as="h2">
                    Amenities details
                  </Text>

                  <Box>
                    <div className="amenities-list">
                      <div className="amenity-item">
                        <div className="amenity-content">
                          <Checkbox
                            label="Park"
                            checked={amenities.park}
                            onChange={() => handleAmenityChange('park')}
                          />
                        </div>
                      </div>
                      <div className="amenity-item">
                        <div className="amenity-content">
                          <Checkbox
                            label="Gym"
                            checked={amenities.gym}
                            onChange={() => handleAmenityChange('gym')}
                          />
                        </div>
                      </div>
                      <div className="amenity-item">
                        <div className="amenity-content">
                          <Checkbox
                            label="Pool"
                            checked={amenities.pool}
                            onChange={() => handleAmenityChange('pool')}
                          />
                        </div>
                      </div>
                      <div className="amenity-item">
                        <div className="amenity-content">
                          <Checkbox
                            label="Security"
                            checked={amenities.security}
                            onChange={() => handleAmenityChange('security')}
                          />
                        </div>
                      </div>
                      <div className="amenity-item">
                        <div className="amenity-content">
                          <Checkbox
                            label="Parking"
                            checked={amenities.parking}
                            onChange={() => handleAmenityChange('parking')}
                          />
                        </div>
                      </div>
                    </div>
                  </Box>
                </BlockStack>
              </Card>

              {/* Developer Incentives card */}
              <Card>
                <BlockStack gap="400">
                  <Text variant="headingMd" as="h2">
                    Developer incentives
                  </Text>

                  <Box>
                    <div className="amenities-list">
                      <div className="amenity-item">
                        <div className="amenity-content">
                          <Checkbox
                            label="DLD Waiver"
                            checked={dldWaiver}
                            onChange={setDldWaiver}
                          />
                        </div>
                      </div>
                      <div className="amenity-item">
                        <div className="amenity-content">
                          <Checkbox
                            label="Post-handover plan"
                            checked={postHandoverPlan}
                            onChange={setPostHandoverPlan}
                          />
                        </div>
                      </div>
                    </div>
                  </Box>
                </BlockStack>
              </Card>

              {/* Financial Details card */}
              <Card>
                <BlockStack gap="400">
                  <Text variant="headingMd" as="h2">
                    Financial details
                  </Text>

                  {/* Price Range */}
                  <InlineStack gap="400" wrap={false}>
                    <Box width="50%">
                      <TextField
                        label="Price range (Min)"
                        type="number"
                        value={priceMin}
                        onChange={setPriceMin}
                        autoComplete="off"
                        placeholder="Minimum price"
                        prefix="$"
                      />
                    </Box>
                    <Box width="50%">
                      <TextField
                        label="Price range (Max)"
                        type="number"
                        value={priceMax}
                        onChange={setPriceMax}
                        autoComplete="off"
                        placeholder="Maximum price"
                        prefix="$"
                      />
                    </Box>
                  </InlineStack>

                  {/* Service Charge Per Sqft */}
                  <TextField
                    label="Service charge per sqft"
                    type="number"
                    value={serviceChargePerSqft}
                    onChange={setServiceChargePerSqft}
                    autoComplete="off"
                    placeholder="Enter service charge"
                    prefix="$"
                    suffix="/sqft"
                  />

                  {/* Estimated ROI */}
                  <TextField
                    label="Estimated ROI (%)"
                    type="number"
                    value={estimatedROI}
                    onChange={setEstimatedROI}
                    autoComplete="off"
                    placeholder="Enter estimated ROI"
                    suffix="%"
                  />

                  {/* Payment Plans */}
                  <BlockStack gap="200">
                    <Text variant="bodyMd" as="span">
                      Payment plans
                    </Text>
                    <Select
                      label="Payment plan type"
                      labelHidden
                      options={[
                        { label: 'Set plan', value: 'set' },
                        { label: 'Upload PDF', value: 'upload' },
                      ]}
                      value={paymentPlanType}
                      onChange={setPaymentPlanType}
                    />
                    {paymentPlanType === 'upload' ? (
                      <Box paddingBlockStart="200">
                        {paymentPlanPdf ? (
                          <Card>
                            {paymentPlanPdfContent}
                          </Card>
                        ) : (
                          <DropZone
                            accept=".pdf"
                            type="file"
                            onDrop={handlePaymentPlanPdfDrop}
                            allowMultiple={false}
                          >
                            <BlockStack gap="200" inlineAlign="center">
                              <InlineStack gap="200" align="center">
                                <Button onClick={() => {}}>Upload PDF</Button>
                                <Button variant="plain">Select existing</Button>
                              </InlineStack>
                              <Text variant="bodySm" as="p" tone="subdued">
                                Accepts PDF files
                              </Text>
                            </BlockStack>
                          </DropZone>
                        )}
                      </Box>
                    ) : (
                      <Box paddingBlockStart="200">
                        <TextField
                          label="Payment plan details"
                          multiline={4}
                          value={paymentPlanDetails}
                          onChange={setPaymentPlanDetails}
                          autoComplete="off"
                          placeholder="Enter payment plan details..."
                        />
                      </Box>
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

              {/* Developer card */}
              <Card>
                <BlockStack gap="200">
                  <Text variant="headingMd" as="h2">
                    Developer
                  </Text>
                  <Select
                    label="Developer"
                    labelHidden
                    options={developerOptions}
                    value={selectedDeveloper}
                    onChange={setSelectedDeveloper}
                  />
                </BlockStack>
              </Card>
            </BlockStack>
          </Layout.Section>
        </Layout>
      </Page>
      <style dangerouslySetInnerHTML={{__html: `
        .date-field-no-browser-icon input[type="date"]::-webkit-calendar-picker-indicator,
        .date-field-no-browser-icon .Polaris-TextField__Input[type="date"]::-webkit-calendar-picker-indicator,
        .date-field-no-browser-icon input::-webkit-calendar-picker-indicator {
          display: none !important;
          -webkit-appearance: none !important;
          opacity: 0 !important;
          position: absolute !important;
          width: 0 !important;
          height: 0 !important;
          pointer-events: none !important;
        }
        .date-field-no-browser-icon input[type="date"],
        .date-field-no-browser-icon .Polaris-TextField__Input[type="date"] {
          -webkit-appearance: none !important;
          appearance: none !important;
        }
        .date-field-no-browser-icon input[type="date"]::-moz-calendar-picker-indicator {
          display: none !important;
        }
      `}} />
    </div>
  );
}

export default AddProject;

