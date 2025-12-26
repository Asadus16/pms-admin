'use client';

import { useState, useCallback, useEffect, useMemo, useRef } from 'react';
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
  Banner,
  Spinner,
  Checkbox,
} from '@shopify/polaris';
import {
  PersonIcon,
  ChevronRightIcon,
} from '@shopify/polaris-icons';
import { useAppDispatch, useAppSelector } from '@/store';
import {
  createPropertyManagerLead,
  updatePropertyManagerLead,
  fetchPropertyManagerLeadById,
  fetchPropertyManagerContacts,
} from '@/store/thunks';
import {
  selectLeadsCreating,
  selectLeadsUpdating,
  selectLeadsLoading,
  selectLeadsError,
  selectLeadsValidationErrors,
  selectCurrentLead,
  clearLeadsError,
} from '@/store/slices/property-manager/leads/slice';
import {
  selectContacts,
} from '@/store/slices/property-manager/contacts/slice';
import '../AddDeveloper/AddDeveloper.css';

function AddLead({ mode = 'create', leadId = null, onClose = null }) {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useAppDispatch();

  const isCreating = useAppSelector(selectLeadsCreating);
  const isUpdating = useAppSelector(selectLeadsUpdating);
  const isLoading = useAppSelector(selectLeadsLoading);
  const error = useAppSelector(selectLeadsError);
  const validationErrors = useAppSelector(selectLeadsValidationErrors);
  const currentLead = useAppSelector(selectCurrentLead);
  const contacts = useAppSelector(selectContacts);

  const basePath = pathname?.split('/')[1] ? `/${pathname.split('/')[1]}` : '/property-manager';

  // Store onClose in a ref to avoid recreating callbacks
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  // Common fields
  const [contactId, setContactId] = useState('');
  const [leadType, setLeadType] = useState('Monthly Rental');
  const [leadRole, setLeadRole] = useState('Tenant');
  const [leadSource, setLeadSource] = useState('');
  const [leadStatus, setLeadStatus] = useState('New');
  const [priority, setPriority] = useState('Normal');
  const [initialMessage, setInitialMessage] = useState('');

  // Monthly Rental fields
  const [targetMoveInDate, setTargetMoveInDate] = useState('');
  const [minimumContractLength, setMinimumContractLength] = useState('');
  const [maximumBudget, setMaximumBudget] = useState('');
  const [furnishingPreference, setFurnishingPreference] = useState('');
  const [bedroomsRequired, setBedroomsRequired] = useState('');
  const [preferredAreas, setPreferredAreas] = useState('');
  const [useType, setUseType] = useState('');
  const [petsAllowedRequired, setPetsAllowedRequired] = useState(false);
  const [visaWorkStatus, setVisaWorkStatus] = useState('');

  // Short-Term Rental fields
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  const [guestsAdults, setGuestsAdults] = useState('');
  const [guestsChildren, setGuestsChildren] = useState('');
  const [purposeOfStay, setPurposeOfStay] = useState('');
  const [budgetPerNight, setBudgetPerNight] = useState('');
  const [totalBudget, setTotalBudget] = useState('');
  const [cleaningPreference, setCleaningPreference] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');
  const [channelOrigin, setChannelOrigin] = useState('');

  // Sale/Purchase fields
  const [clientRole, setClientRole] = useState('');
  const [budgetMin, setBudgetMin] = useState('');
  const [budgetMax, setBudgetMax] = useState('');
  const [financeType, setFinanceType] = useState('');
  const [mortgagePreApprovalCompleted, setMortgagePreApprovalCompleted] = useState(false);
  const [propertyTypePreference, setPropertyTypePreference] = useState('');
  const [sizeRangeMin, setSizeRangeMin] = useState('');
  const [sizeRangeMax, setSizeRangeMax] = useState('');
  const [preferredDevelopers, setPreferredDevelopers] = useState('');
  const [preferredProjects, setPreferredProjects] = useState('');
  const [preferredAreasSale, setPreferredAreasSale] = useState('');
  const [investmentHorizon, setInvestmentHorizon] = useState('');
  const [roiExpectation, setRoiExpectation] = useState('');
  const [purpose, setPurpose] = useState('');
  const [sellerExpectedSellingPrice, setSellerExpectedSellingPrice] = useState('');
  const [sellerUrgencyLevel, setSellerUrgencyLevel] = useState('');

  // Fetch contacts for dropdown
  useEffect(() => {
    dispatch(fetchPropertyManagerContacts({ per_page: 100 }));
  }, [dispatch]);

  // Fetch lead if editing
  useEffect(() => {
    if (mode === 'edit' && leadId) {
      dispatch(fetchPropertyManagerLeadById(leadId));
    }
  }, [dispatch, mode, leadId]);

  // Populate form when editing
  useEffect(() => {
    if (mode === 'edit' && currentLead) {
      setContactId(currentLead.contact_id ? String(currentLead.contact_id) : '');
      setLeadType(currentLead.lead_type || 'Monthly Rental');
      setLeadRole(currentLead.lead_role || 'Tenant');
      setLeadSource(currentLead.lead_source || '');
      setLeadStatus(currentLead.lead_status || 'New');
      setPriority(currentLead.priority || 'Normal');
      setInitialMessage(currentLead.initial_message || '');

      // Monthly Rental
      setTargetMoveInDate(currentLead.target_move_in_date || '');
      setMinimumContractLength(currentLead.minimum_contract_length ? String(currentLead.minimum_contract_length) : '');
      setMaximumBudget(currentLead.maximum_budget ? String(currentLead.maximum_budget) : '');
      setFurnishingPreference(currentLead.furnishing_preference || '');
      setBedroomsRequired(currentLead.bedrooms_required ? String(currentLead.bedrooms_required) : '');
      setPreferredAreas(Array.isArray(currentLead.preferred_areas) ? currentLead.preferred_areas.join(', ') : (currentLead.preferred_areas || ''));
      setUseType(currentLead.use_type || '');
      setPetsAllowedRequired(currentLead.pets_allowed_required || false);
      setVisaWorkStatus(currentLead.visa_work_status || '');

      // Short-Term Rental
      setCheckInDate(currentLead.check_in_date || '');
      setCheckOutDate(currentLead.check_out_date || '');
      setGuestsAdults(currentLead.guests_adults ? String(currentLead.guests_adults) : '');
      setGuestsChildren(currentLead.guests_children ? String(currentLead.guests_children) : '');
      setPurposeOfStay(currentLead.purpose_of_stay || '');
      setBudgetPerNight(currentLead.budget_per_night ? String(currentLead.budget_per_night) : '');
      setTotalBudget(currentLead.total_budget ? String(currentLead.total_budget) : '');
      setCleaningPreference(currentLead.cleaning_preference || '');
      setSpecialRequests(currentLead.special_requests || '');
      setChannelOrigin(currentLead.channel_origin || '');

      // Sale/Purchase
      setClientRole(currentLead.client_role || '');
      setBudgetMin(currentLead.budget_min ? String(currentLead.budget_min) : '');
      setBudgetMax(currentLead.budget_max ? String(currentLead.budget_max) : '');
      setFinanceType(currentLead.finance_type || '');
      setMortgagePreApprovalCompleted(currentLead.mortgage_pre_approval_completed || false);
      setPropertyTypePreference(currentLead.property_type_preference || '');
      setSizeRangeMin(currentLead.size_range_min ? String(currentLead.size_range_min) : '');
      setSizeRangeMax(currentLead.size_range_max ? String(currentLead.size_range_max) : '');
      setPreferredDevelopers(Array.isArray(currentLead.preferred_developers) ? currentLead.preferred_developers.join(', ') : (currentLead.preferred_developers || ''));
      setPreferredProjects(Array.isArray(currentLead.preferred_projects) ? currentLead.preferred_projects.join(', ') : (currentLead.preferred_projects || ''));
      setPreferredAreasSale(Array.isArray(currentLead.preferred_areas_sale) ? currentLead.preferred_areas_sale.join(', ') : (currentLead.preferred_areas_sale || ''));
      setInvestmentHorizon(currentLead.investment_horizon || '');
      setRoiExpectation(currentLead.roi_expectation ? String(currentLead.roi_expectation) : '');
      setPurpose(currentLead.purpose || '');
      setSellerExpectedSellingPrice(currentLead.seller_expected_selling_price ? String(currentLead.seller_expected_selling_price) : '');
      setSellerUrgencyLevel(currentLead.seller_urgency_level || '');
    }
  }, [mode, currentLead]);

  const handleBack = useCallback(() => {
    if (onCloseRef.current) {
      onCloseRef.current();
    } else {
      router.push(`${basePath}/leads`);
    }
  }, [router, basePath]);

  const handleSave = useCallback(async () => {
    dispatch(clearLeadsError());

    // Build lead data object
    const leadData = {
      lead_type: leadType,
      lead_role: leadRole,
      ...(leadSource && { lead_source: leadSource }),
      lead_status: leadStatus,
      priority: priority,
      ...(initialMessage && { initial_message: initialMessage }),
      ...(contactId && { contact_id: parseInt(contactId, 10) }),
    };

    // Monthly Rental fields (if Monthly Rental or Multiple)
    if (leadType === 'Monthly Rental' || leadType === 'Multiple') {
      if (targetMoveInDate) leadData.target_move_in_date = targetMoveInDate;
      if (minimumContractLength) leadData.minimum_contract_length = parseInt(minimumContractLength, 10);
      if (maximumBudget) leadData.maximum_budget = parseFloat(maximumBudget);
      if (furnishingPreference) leadData.furnishing_preference = furnishingPreference;
      if (bedroomsRequired) leadData.bedrooms_required = parseInt(bedroomsRequired, 10);
      if (preferredAreas) {
        leadData.preferred_areas = preferredAreas.split(',').map(area => area.trim()).filter(area => area);
      }
      if (useType) leadData.use_type = useType;
      leadData.pets_allowed_required = petsAllowedRequired;
      if (visaWorkStatus) leadData.visa_work_status = visaWorkStatus;
    }

    // Short-Term Rental fields (if Short-Term Rental or Multiple)
    if (leadType === 'Short-Term Rental' || leadType === 'Multiple') {
      if (checkInDate) leadData.check_in_date = checkInDate;
      if (checkOutDate) leadData.check_out_date = checkOutDate;
      if (guestsAdults) leadData.guests_adults = parseInt(guestsAdults, 10);
      if (guestsChildren) leadData.guests_children = parseInt(guestsChildren, 10);
      if (purposeOfStay) leadData.purpose_of_stay = purposeOfStay;
      if (budgetPerNight) leadData.budget_per_night = parseFloat(budgetPerNight);
      if (totalBudget) leadData.total_budget = parseFloat(totalBudget);
      if (cleaningPreference) leadData.cleaning_preference = cleaningPreference;
      if (specialRequests) leadData.special_requests = specialRequests;
      if (channelOrigin) leadData.channel_origin = channelOrigin;
    }

    // Sale/Purchase fields (if Sale or Multiple)
    if (leadType === 'Sale' || leadType === 'Multiple') {
      if (clientRole) leadData.client_role = clientRole;
      if (budgetMin) leadData.budget_min = parseFloat(budgetMin);
      if (budgetMax) leadData.budget_max = parseFloat(budgetMax);
      if (financeType) leadData.finance_type = financeType;
      leadData.mortgage_pre_approval_completed = mortgagePreApprovalCompleted;
      if (propertyTypePreference) leadData.property_type_preference = propertyTypePreference;
      if (sizeRangeMin) leadData.size_range_min = parseInt(sizeRangeMin, 10);
      if (sizeRangeMax) leadData.size_range_max = parseInt(sizeRangeMax, 10);
      if (preferredDevelopers) {
        leadData.preferred_developers = preferredDevelopers.split(',').map(dev => dev.trim()).filter(dev => dev);
      }
      if (preferredProjects) {
        leadData.preferred_projects = preferredProjects.split(',').map(proj => proj.trim()).filter(proj => proj);
      }
      if (preferredAreasSale) {
        leadData.preferred_areas_sale = preferredAreasSale.split(',').map(area => area.trim()).filter(area => area);
      }
      if (investmentHorizon) leadData.investment_horizon = investmentHorizon;
      if (roiExpectation) leadData.roi_expectation = parseFloat(roiExpectation);
      if (purpose) leadData.purpose = purpose;
      if (sellerExpectedSellingPrice) leadData.seller_expected_selling_price = parseFloat(sellerExpectedSellingPrice);
      if (sellerUrgencyLevel) leadData.seller_urgency_level = sellerUrgencyLevel;
    }

    try {
      if (mode === 'edit' && leadId) {
        await dispatch(updatePropertyManagerLead({
          id: leadId,
          data: leadData,
        })).unwrap();
      } else {
        await dispatch(createPropertyManagerLead(leadData)).unwrap();
      }
      // Use onClose from ref if available, otherwise navigate
      if (onCloseRef.current) {
        onCloseRef.current();
      } else {
        router.push(`${basePath}/leads`);
      }
    } catch (err) {
      console.error('Error saving lead:', err);
    }
  }, [
    dispatch, mode, leadId, router, basePath,
    leadType, leadRole, leadSource, leadStatus, priority, initialMessage,
    contactId,
    targetMoveInDate, minimumContractLength, maximumBudget, furnishingPreference,
    bedroomsRequired, preferredAreas, useType, petsAllowedRequired, visaWorkStatus,
    checkInDate, checkOutDate, guestsAdults, guestsChildren, purposeOfStay,
    budgetPerNight, totalBudget, cleaningPreference, specialRequests, channelOrigin,
    clientRole, budgetMin, budgetMax, financeType, mortgagePreApprovalCompleted,
    propertyTypePreference, sizeRangeMin, sizeRangeMax, preferredDevelopers,
    preferredProjects, preferredAreasSale, investmentHorizon, roiExpectation,
    purpose, sellerExpectedSellingPrice, sellerUrgencyLevel,
  ]);

  // Build contacts dropdown options
  const contactOptions = useMemo(() => {
    const contactsList = Array.isArray(contacts) ? contacts : (contacts?.data || []);
    const options = [{ label: 'Select a contact', value: '' }];
    contactsList.forEach((contact) => {
      const name = contact.full_name || contact.name || `Contact ${contact.id}`;
      const displayName = contact.contact_id ? `${name} (${contact.contact_id})` : name;
      options.push({
        label: displayName,
        value: String(contact.id),
      });
    });
    return options;
  }, [contacts]);

  const getFieldError = (field) => {
    if (!validationErrors) return null;
    const errors = validationErrors[field];
    return errors ? errors[0] : null;
  };

  // Options
  const leadTypeOptions = [
    { label: 'Monthly Rental', value: 'Monthly Rental' },
    { label: 'Short-Term Rental', value: 'Short-Term Rental' },
    { label: 'Sale', value: 'Sale' },
    { label: 'Multiple', value: 'Multiple' },
  ];

  const leadRoleOptions = [
    { label: 'Buyer', value: 'Buyer' },
    { label: 'Tenant', value: 'Tenant' },
    { label: 'Seller', value: 'Seller' },
    { label: 'Landlord', value: 'Landlord' },
    { label: 'Guest', value: 'Guest' },
    { label: 'Agent', value: 'Agent' },
  ];

  const leadSourceOptions = [
    { label: 'Select source', value: '' },
    { label: 'Website', value: 'Website' },
    { label: 'PMS Public Link', value: 'PMS Public Link' },
    { label: 'Portal', value: 'Portal' },
    { label: 'WhatsApp', value: 'WhatsApp' },
    { label: 'Call', value: 'Call' },
    { label: 'Referral', value: 'Referral' },
    { label: 'Walk-in', value: 'Walk-in' },
  ];

  const leadStatusOptions = [
    { label: 'New', value: 'New' },
    { label: 'Contacted', value: 'Contacted' },
    { label: 'Qualified', value: 'Qualified' },
    { label: 'Viewing Scheduled', value: 'Viewing Scheduled' },
    { label: 'Offer', value: 'Offer' },
    { label: 'Negotiation', value: 'Negotiation' },
    { label: 'Agreement Sent', value: 'Agreement Sent' },
    { label: 'Closed–Won', value: 'Closed–Won' },
    { label: 'Closed–Lost', value: 'Closed–Lost' },
  ];

  const priorityOptions = [
    { label: 'Low', value: 'Low' },
    { label: 'Normal', value: 'Normal' },
    { label: 'High', value: 'High' },
    { label: 'Hot', value: 'Hot' },
  ];

  const furnishingOptions = [
    { label: 'Select preference', value: '' },
    { label: 'Unfurnished', value: 'Unfurnished' },
    { label: 'Semi', value: 'Semi' },
    { label: 'Fully', value: 'Fully' },
  ];

  const useTypeOptions = [
    { label: 'Select use type', value: '' },
    { label: 'Family', value: 'Family' },
    { label: 'Bachelor', value: 'Bachelor' },
    { label: 'Staff', value: 'Staff' },
    { label: 'Corporate', value: 'Corporate' },
  ];

  const purposeOfStayOptions = [
    { label: 'Select purpose', value: '' },
    { label: 'Holiday', value: 'Holiday' },
    { label: 'Business', value: 'Business' },
    { label: 'Medical', value: 'Medical' },
    { label: 'Transit', value: 'Transit' },
    { label: 'Event', value: 'Event' },
  ];

  const cleaningPreferenceOptions = [
    { label: 'Select preference', value: '' },
    { label: 'Daily', value: 'Daily' },
    { label: 'Check-out only', value: 'Check-out only' },
  ];

  const channelOriginOptions = [
    { label: 'Select channel', value: '' },
    { label: 'Direct', value: 'Direct' },
    { label: 'Airbnb', value: 'Airbnb' },
    { label: 'Booking.com', value: 'Booking.com' },
    { label: 'Other OTA', value: 'Other OTA' },
    { label: 'Corporate', value: 'Corporate' },
  ];

  const clientRoleOptions = [
    { label: 'Select role', value: '' },
    { label: 'Buyer', value: 'Buyer' },
    { label: 'Seller', value: 'Seller' },
    { label: 'Both', value: 'Both' },
  ];

  const financeTypeOptions = [
    { label: 'Select type', value: '' },
    { label: 'Cash', value: 'Cash' },
    { label: 'Mortgage', value: 'Mortgage' },
    { label: 'Mixed', value: 'Mixed' },
  ];

  const propertyTypeOptions = [
    { label: 'Select type', value: '' },
    { label: 'Apartment', value: 'Apartment' },
    { label: 'Villa', value: 'Villa' },
    { label: 'Townhouse', value: 'Townhouse' },
    { label: 'Office', value: 'Office' },
    { label: 'Plot', value: 'Plot' },
  ];

  const investmentHorizonOptions = [
    { label: 'Select horizon', value: '' },
    { label: '<1 year', value: '<1 year' },
    { label: '1–3 years', value: '1–3 years' },
    { label: '3–5+ years', value: '3–5+ years' },
  ];

  const purposeOptions = [
    { label: 'Select purpose', value: '' },
    { label: 'Own Stay', value: 'Own Stay' },
    { label: 'Investment', value: 'Investment' },
    { label: 'Holiday Home', value: 'Holiday Home' },
    { label: 'Flip', value: 'Flip' },
  ];

  const sellerUrgencyOptions = [
    { label: 'Select urgency', value: '' },
    { label: 'High', value: 'High' },
    { label: 'Medium', value: 'Medium' },
    { label: 'Low', value: 'Low' },
  ];

  // Set data attribute on body when AddLead is mounted
  useEffect(() => {
    const attr = mode === 'edit' ? 'data-edit-lead-open' : 'data-add-lead-open';
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

    const closeEvent = mode === 'edit' ? 'closeEditLead' : 'closeAddLead';
    const saveEvent = mode === 'edit' ? 'saveEditLead' : 'saveAddLead';

    window.addEventListener(closeEvent, handleClose);
    window.addEventListener(saveEvent, handleSaveEvent);

    return () => {
      window.removeEventListener(closeEvent, handleClose);
      window.removeEventListener(saveEvent, handleSaveEvent);
    };
  }, [handleBack, handleSave, mode]);

  // Determine which fields to show
  const showMonthlyRental = leadType === 'Monthly Rental' || leadType === 'Multiple';
  const showShortTermRental = leadType === 'Short-Term Rental' || leadType === 'Multiple';
  const showSale = leadType === 'Sale' || leadType === 'Multiple';

  // Show loading state if editing and data is loading
  if (isLoading && mode === 'edit') {
    return (
      <Page>
        <Box padding="1000">
          <BlockStack gap="400" inlineAlign="center">
            <Spinner size="large" />
            <Text variant="bodyMd" as="p" tone="subdued">
              Loading lead details...
            </Text>
          </BlockStack>
        </Box>
      </Page>
    );
  }

  const isSubmitting = isCreating || isUpdating;

  return (
    <div className="add-developer-wrapper">
      <Page
        title={
          <InlineStack gap="050" blockAlign="center">
            <Icon source={PersonIcon} tone="base" />
            <Icon source={ChevronRightIcon} tone="subdued" />
            <span className="new-developer-title">{mode === 'edit' ? 'Edit Lead' : 'Add New Lead'}</span>
          </InlineStack>
        }
      >
        {error && (
          <Box paddingBlockEnd="400">
            <Banner tone="critical" onDismiss={() => dispatch(clearLeadsError())}>
              <p>{error}</p>
            </Banner>
          </Box>
        )}

        <Layout>
          <Layout.Section>
            <BlockStack gap="400">
              {/* Common Fields */}
              <Card>
                <BlockStack gap="400">
                  <Text variant="headingMd" as="h2">
                    Common Information
                  </Text>

                  <Select
                    label="Contact"
                    options={contactOptions}
                    value={contactId}
                    onChange={setContactId}
                    error={getFieldError('contact_id')}
                    helpText="Optional: Link this lead to an existing contact"
                  />

                  <Select
                    label="Lead Type"
                    options={leadTypeOptions}
                    value={leadType}
                    onChange={setLeadType}
                    error={getFieldError('lead_type')}
                    requiredIndicator
                  />

                  <Select
                    label="Lead Role"
                    options={leadRoleOptions}
                    value={leadRole}
                    onChange={setLeadRole}
                    error={getFieldError('lead_role')}
                    requiredIndicator
                  />

                  <Select
                    label="Lead Source"
                    options={leadSourceOptions}
                    value={leadSource}
                    onChange={setLeadSource}
                    error={getFieldError('lead_source')}
                  />

                  <Select
                    label="Lead Status"
                    options={leadStatusOptions}
                    value={leadStatus}
                    onChange={setLeadStatus}
                    error={getFieldError('lead_status')}
                  />

                  <Select
                    label="Priority"
                    options={priorityOptions}
                    value={priority}
                    onChange={setPriority}
                    error={getFieldError('priority')}
                  />

                  <TextField
                    label="Initial Message"
                    value={initialMessage}
                    onChange={setInitialMessage}
                    multiline={4}
                    placeholder="Enter the initial inquiry or message from the lead..."
                    error={getFieldError('initial_message')}
                    helpText="This is the initial inquiry or message received from the lead"
                  />
                </BlockStack>
              </Card>

              {/* Monthly Rental Fields */}
              {showMonthlyRental && (
                <Card>
                  <BlockStack gap="400">
                    <Text variant="headingMd" as="h2">
                      Monthly Rental Details
                    </Text>

                    <TextField
                      label="Target Move-In Date"
                      value={targetMoveInDate}
                      onChange={setTargetMoveInDate}
                      type="date"
                      error={getFieldError('target_move_in_date')}
                      helpText="Must be today or a future date"
                    />

                    <TextField
                      label="Minimum Contract Length (months)"
                      value={minimumContractLength}
                      onChange={setMinimumContractLength}
                      type="number"
                      placeholder="e.g., 12"
                      error={getFieldError('minimum_contract_length')}
                    />

                    <TextField
                      label="Maximum Budget (per month)"
                      value={maximumBudget}
                      onChange={setMaximumBudget}
                      type="number"
                      step="0.01"
                      placeholder="e.g., 15000.00"
                      error={getFieldError('maximum_budget')}
                    />

                    <Select
                      label="Furnishing Preference"
                      options={furnishingOptions}
                      value={furnishingPreference}
                      onChange={setFurnishingPreference}
                      error={getFieldError('furnishing_preference')}
                    />

                    <TextField
                      label="Bedrooms Required"
                      value={bedroomsRequired}
                      onChange={setBedroomsRequired}
                      type="number"
                      placeholder="e.g., 2"
                      error={getFieldError('bedrooms_required')}
                    />

                    <TextField
                      label="Preferred Areas"
                      value={preferredAreas}
                      onChange={setPreferredAreas}
                      placeholder="e.g., Dubai Marina, JBR"
                      error={getFieldError('preferred_areas')}
                      helpText="Enter areas separated by commas"
                    />

                    <Select
                      label="Use Type"
                      options={useTypeOptions}
                      value={useType}
                      onChange={setUseType}
                      error={getFieldError('use_type')}
                    />

                    <Checkbox
                      label="Pets Allowed Required"
                      checked={petsAllowedRequired}
                      onChange={setPetsAllowedRequired}
                    />

                    <TextField
                      label="Visa/Work Status"
                      value={visaWorkStatus}
                      onChange={setVisaWorkStatus}
                      placeholder="e.g., Resident Visa"
                      error={getFieldError('visa_work_status')}
                    />
                  </BlockStack>
                </Card>
              )}

              {/* Short-Term Rental Fields */}
              {showShortTermRental && (
                <Card>
                  <BlockStack gap="400">
                    <Text variant="headingMd" as="h2">
                      Short-Term Rental Details
                    </Text>

                    <TextField
                      label="Check-In Date"
                      value={checkInDate}
                      onChange={setCheckInDate}
                      type="date"
                      error={getFieldError('check_in_date')}
                      helpText="Must be today or a future date"
                    />

                    <TextField
                      label="Check-Out Date"
                      value={checkOutDate}
                      onChange={setCheckOutDate}
                      type="date"
                      error={getFieldError('check_out_date')}
                      helpText="Must be after check-in date"
                    />

                    <TextField
                      label="Number of Adult Guests"
                      value={guestsAdults}
                      onChange={setGuestsAdults}
                      type="number"
                      placeholder="e.g., 2"
                      error={getFieldError('guests_adults')}
                    />

                    <TextField
                      label="Number of Children"
                      value={guestsChildren}
                      onChange={setGuestsChildren}
                      type="number"
                      placeholder="e.g., 1"
                      error={getFieldError('guests_children')}
                    />

                    <Select
                      label="Purpose of Stay"
                      options={purposeOfStayOptions}
                      value={purposeOfStay}
                      onChange={setPurposeOfStay}
                      error={getFieldError('purpose_of_stay')}
                    />

                    <TextField
                      label="Budget Per Night"
                      value={budgetPerNight}
                      onChange={setBudgetPerNight}
                      type="number"
                      step="0.01"
                      placeholder="e.g., 500.00"
                      error={getFieldError('budget_per_night')}
                    />

                    <TextField
                      label="Total Budget"
                      value={totalBudget}
                      onChange={setTotalBudget}
                      type="number"
                      step="0.01"
                      placeholder="e.g., 2500.00"
                      error={getFieldError('total_budget')}
                    />

                    <Select
                      label="Cleaning Preference"
                      options={cleaningPreferenceOptions}
                      value={cleaningPreference}
                      onChange={setCleaningPreference}
                      error={getFieldError('cleaning_preference')}
                    />

                    <TextField
                      label="Special Requests"
                      value={specialRequests}
                      onChange={setSpecialRequests}
                      multiline={3}
                      placeholder="e.g., High floor with sea view, early check-in preferred"
                      error={getFieldError('special_requests')}
                    />

                    <Select
                      label="Channel Origin"
                      options={channelOriginOptions}
                      value={channelOrigin}
                      onChange={setChannelOrigin}
                      error={getFieldError('channel_origin')}
                    />
                  </BlockStack>
                </Card>
              )}

              {/* Sale/Purchase Fields */}
              {showSale && (
                <Card>
                  <BlockStack gap="400">
                    <Text variant="headingMd" as="h2">
                      Sale/Purchase Details
                    </Text>

                    <Select
                      label="Client Role"
                      options={clientRoleOptions}
                      value={clientRole}
                      onChange={setClientRole}
                      error={getFieldError('client_role')}
                    />

                    <TextField
                      label="Minimum Budget"
                      value={budgetMin}
                      onChange={setBudgetMin}
                      type="number"
                      step="0.01"
                      placeholder="e.g., 3000000.00"
                      error={getFieldError('budget_min')}
                    />

                    <TextField
                      label="Maximum Budget"
                      value={budgetMax}
                      onChange={setBudgetMax}
                      type="number"
                      step="0.01"
                      placeholder="e.g., 5000000.00"
                      error={getFieldError('budget_max')}
                      helpText="Must be greater than or equal to minimum budget"
                    />

                    <Select
                      label="Finance Type"
                      options={financeTypeOptions}
                      value={financeType}
                      onChange={setFinanceType}
                      error={getFieldError('finance_type')}
                    />

                    <Checkbox
                      label="Mortgage Pre-Approval Completed"
                      checked={mortgagePreApprovalCompleted}
                      onChange={setMortgagePreApprovalCompleted}
                    />

                    <Select
                      label="Property Type Preference"
                      options={propertyTypeOptions}
                      value={propertyTypePreference}
                      onChange={setPropertyTypePreference}
                      error={getFieldError('property_type_preference')}
                    />

                    <TextField
                      label="Minimum Size (Sqft/Sqm)"
                      value={sizeRangeMin}
                      onChange={setSizeRangeMin}
                      type="number"
                      placeholder="e.g., 3000"
                      error={getFieldError('size_range_min')}
                    />

                    <TextField
                      label="Maximum Size (Sqft/Sqm)"
                      value={sizeRangeMax}
                      onChange={setSizeRangeMax}
                      type="number"
                      placeholder="e.g., 5000"
                      error={getFieldError('size_range_max')}
                      helpText="Must be greater than or equal to minimum size"
                    />

                    <TextField
                      label="Preferred Developers"
                      value={preferredDevelopers}
                      onChange={setPreferredDevelopers}
                      placeholder="e.g., Emaar, Nakheel"
                      error={getFieldError('preferred_developers')}
                      helpText="Enter developers separated by commas"
                    />

                    <TextField
                      label="Preferred Projects"
                      value={preferredProjects}
                      onChange={setPreferredProjects}
                      placeholder="e.g., Palm Jumeirah, Dubai Hills"
                      error={getFieldError('preferred_projects')}
                      helpText="Enter projects separated by commas"
                    />

                    <TextField
                      label="Preferred Areas"
                      value={preferredAreasSale}
                      onChange={setPreferredAreasSale}
                      placeholder="e.g., Palm Jumeirah, Emirates Hills"
                      error={getFieldError('preferred_areas_sale')}
                      helpText="Enter areas separated by commas"
                    />

                    <Select
                      label="Investment Horizon"
                      options={investmentHorizonOptions}
                      value={investmentHorizon}
                      onChange={setInvestmentHorizon}
                      error={getFieldError('investment_horizon')}
                    />

                    <TextField
                      label="ROI Expectation (%)"
                      value={roiExpectation}
                      onChange={setRoiExpectation}
                      type="number"
                      step="0.1"
                      placeholder="e.g., 5.5"
                      error={getFieldError('roi_expectation')}
                      helpText="Enter percentage (0-100)"
                    />

                    <Select
                      label="Purpose"
                      options={purposeOptions}
                      value={purpose}
                      onChange={setPurpose}
                      error={getFieldError('purpose')}
                    />

                    <TextField
                      label="Seller Expected Selling Price"
                      value={sellerExpectedSellingPrice}
                      onChange={setSellerExpectedSellingPrice}
                      type="number"
                      step="0.01"
                      placeholder="e.g., 4000000.00"
                      error={getFieldError('seller_expected_selling_price')}
                      helpText="For seller leads only"
                    />

                    <Select
                      label="Seller Urgency Level"
                      options={sellerUrgencyOptions}
                      value={sellerUrgencyLevel}
                      onChange={setSellerUrgencyLevel}
                      error={getFieldError('seller_urgency_level')}
                      helpText="For seller leads only"
                    />
                  </BlockStack>
                </Card>
              )}
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
                    label="Lead Status"
                    labelHidden
                    options={leadStatusOptions}
                    value={leadStatus}
                    onChange={setLeadStatus}
                    error={getFieldError('lead_status')}
                  />
                </BlockStack>
              </Card>

              {/* Priority card */}
              <Card>
                <BlockStack gap="200">
                  <Text variant="headingMd" as="h2">
                    Priority
                  </Text>
                  <Select
                    label="Priority"
                    labelHidden
                    options={priorityOptions}
                    value={priority}
                    onChange={setPriority}
                    error={getFieldError('priority')}
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

export default AddLead;
