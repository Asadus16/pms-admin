'use client';

import { useState, useCallback, useEffect } from 'react';
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
  Checkbox,
  DropZone,
  Thumbnail,
  Banner,
  Divider,
  LegacyStack,
} from '@shopify/polaris';
import {
  HomeIcon,
  ChevronRightIcon,
  DeleteIcon,
  PlusIcon,
  NoteIcon,
} from '@shopify/polaris-icons';
import { useAppDispatch } from '@/store';
import {
  fetchPropertyManagerProjects,
  fetchPropertyManagerDevelopers,
  fetchPropertyManagerOwners,
  createPropertyManagerProperty,
  updatePropertyManagerProperty,
} from '@/store/thunks';
import './AddProperty.css';

// Generate a unique property ID
const generatePropertyId = () => {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `PRP-${timestamp}-${random}`;
};

// Helper component for form rows - defined outside to prevent re-renders
const FormRow = ({ label, children }) => (
  <InlineStack gap="300" align="start" blockAlign="center" wrap={false}>
    <Box minWidth="200px" width="200px">
      <Text variant="bodyMd" as="span" fontWeight="medium">
        {label}
      </Text>
    </Box>
    <Box minWidth="0" width="100%">
      {children}
    </Box>
  </InlineStack>
);

function AddProperty({ onClose, mode = 'create', initialProperty = null }) {
  const router = useRouter();
  const dispatch = useAppDispatch();

  // Generate property ID on mount (or use existing for edit)
  const [propertyId] = useState(() => initialProperty?.propertyId || generatePropertyId());

  // ========== DYNAMIC DATA STATE ==========
  const [projects, setProjects] = useState([]);
  const [developers, setDevelopers] = useState([]);
  const [owners, setOwners] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);

  // ========== PROPERTY DETAILS STATE ==========
  const [selectedProject, setSelectedProject] = useState('');
  const [selectedDeveloper, setSelectedDeveloper] = useState('');
  const [selectedOwner, setSelectedOwner] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [unitNumber, setUnitNumber] = useState('');
  const [buildingTowerName, setBuildingTowerName] = useState('');
  const [floorNumber, setFloorNumber] = useState('');
  const [areaSize, setAreaSize] = useState('');
  const [rooms, setRooms] = useState('');
  const [bedrooms, setBedrooms] = useState('');
  const [bathrooms, setBathrooms] = useState('');
  const [maxGuests, setMaxGuests] = useState('');
  const [maidRoom, setMaidRoom] = useState('');
  const [balcony, setBalcony] = useState('');
  const [parkingSpace, setParkingSpace] = useState('');
  const [view, setView] = useState('');
  const [furnished, setFurnished] = useState('');
  const [ceilingHeight, setCeilingHeight] = useState('');
  const [smartHomeEnabled, setSmartHomeEnabled] = useState('');

  // ========== PROPERTY ADDRESS STATE ==========
  const [address1, setAddress1] = useState('');
  const [address2, setAddress2] = useState('');
  const [country, setCountry] = useState('');
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [longitude, setLongitude] = useState('');
  const [latitude, setLatitude] = useState('');

  // ========== PROPERTY MISC INFO STATE ==========
  const [uniqueId, setUniqueId] = useState('');
  const [externalId, setExternalId] = useState('');
  const [accounting, setAccounting] = useState('');
  const [rentalLicenseNumber, setRentalLicenseNumber] = useState('');
  const [licenseExpirationDate, setLicenseExpirationDate] = useState('');
  const [wifiNetwork, setWifiNetwork] = useState('');
  const [wifiPassword, setWifiPassword] = useState('');

  // ========== BOOKING SETTINGS STATE ==========
  const [bookingType, setBookingType] = useState('');
  const [bookingWindow, setBookingWindow] = useState('');
  const [turnover, setTurnover] = useState('');
  const [bookingLeadTime, setBookingLeadTime] = useState('');
  const [checkInTime, setCheckInTime] = useState('');
  const [checkOutTime, setCheckOutTime] = useState('');
  const [minimumStay, setMinimumStay] = useState('');
  const [maximumStay, setMaximumStay] = useState('');
  const [maximumWeekendStay, setMaximumWeekendStay] = useState('');
  const [collectBalanceAt, setCollectBalanceAt] = useState('');
  const [percentAtReservation, setPercentAtReservation] = useState('');

  // ========== DESCRIPTION STATE ==========
  const [publicName, setPublicName] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [longDescription, setLongDescription] = useState('');
  const [notes, setNotes] = useState('');
  const [interaction, setInteraction] = useState('');
  const [neighbourhood, setNeighbourhood] = useState('');
  const [access, setAccess] = useState('');
  const [space, setSpace] = useState('');
  const [transit, setTransit] = useState('');
  const [houseManual, setHouseManual] = useState('');

  // ========== PHOTOS STATE ==========
  const [photos, setPhotos] = useState([]);

  // ========== AMENITIES STATE ==========
  const [amenitiesPopular, setAmenitiesPopular] = useState([]);
  const [amenitiesIndoor, setAmenitiesIndoor] = useState([]);
  const [amenitiesOutdoor, setAmenitiesOutdoor] = useState([]);

  // ========== PRICING STATE ==========
  const [propertyUsage, setPropertyUsage] = useState('');
  const [currency, setCurrency] = useState('AED');
  const [commissionStructure, setCommissionStructure] = useState('');
  const [commissionAmount, setCommissionAmount] = useState('');

  // For Sale fields
  const [sellingPrice, setSellingPrice] = useState('');
  const [pricePerSqft, setPricePerSqft] = useState('');
  const [serviceChargesSale, setServiceChargesSale] = useState('');
  const [dldRegistrationFee, setDldRegistrationFee] = useState('');

  // For Monthly Rent fields
  const [rentalAmount, setRentalAmount] = useState('');
  const [currentlyRented, setCurrentlyRented] = useState('');
  const [depositRequired, setDepositRequired] = useState('');
  const [serviceChargesRent, setServiceChargesRent] = useState('');

  // For Short Term Rent fields
  const [nightlyBasePrice, setNightlyBasePrice] = useState('');
  const [securityDeposit, setSecurityDeposit] = useState('');
  const [cleaningFee, setCleaningFee] = useState('');
  const [cleaningFeeTax, setCleaningFeeTax] = useState('');
  const [taxRate, setTaxRate] = useState('');
  const [weekendRateAdjustment, setWeekendRateAdjustment] = useState('');

  // ========== POLICIES STATE ==========
  const [policies, setPolicies] = useState([]);

  // ========== AGREEMENT STATE ==========
  const [agreementType, setAgreementType] = useState('');
  const [tenancyAgreementFile, setTenancyAgreementFile] = useState(null);
  const [tenancyAgreementExpiry, setTenancyAgreementExpiry] = useState('');
  const [ejariFile, setEjariFile] = useState(null);
  const [ejariExpiry, setEjariExpiry] = useState('');
  const [dctmLetterFile, setDctmLetterFile] = useState(null);
  const [dctmLetterExpiry, setDctmLetterExpiry] = useState('');
  const [rentalStartDate, setRentalStartDate] = useState('');
  const [rentalEndDate, setRentalEndDate] = useState('');
  const [purchasePrice, setPurchasePrice] = useState('');
  const [purchaseDate, setPurchaseDate] = useState('');
  const [numberOfSchedulePayments, setNumberOfSchedulePayments] = useState('');

  // Booking Details (for Leased)
  const [bookingDetailsPercentage, setBookingDetailsPercentage] = useState('');
  const [bookingDetailsPrice, setBookingDetailsPrice] = useState('');
  const [bookingDetailsPaidDate, setBookingDetailsPaidDate] = useState('');
  const [bookingDetailsStatus, setBookingDetailsStatus] = useState('');
  const [bookingDetailsProof, setBookingDetailsProof] = useState(null);

  // Down Payment (for Leased)
  const [downPaymentPercentage, setDownPaymentPercentage] = useState('');
  const [downPaymentPrice, setDownPaymentPrice] = useState('');
  const [downPaymentPaidDate, setDownPaymentPaidDate] = useState('');
  const [downPaymentStatus, setDownPaymentStatus] = useState('');
  const [downPaymentProof, setDownPaymentProof] = useState(null);

  // Installments (for Leased)
  const [installments, setInstallments] = useState([
    { percentage: '', price: '', paidDate: '', status: '', proof: null },
  ]);

  // DLD (for Leased)
  const [dldType, setDldType] = useState('');
  const [dldPercentage, setDldPercentage] = useState('');
  const [dldPrice, setDldPrice] = useState('');
  const [dldPaidDate, setDldPaidDate] = useState('');
  const [dldStatus, setDldStatus] = useState('');
  const [dldProof, setDldProof] = useState(null);

  // Oqood + Admin Charges (for Leased)
  const [oqoodType, setOqoodType] = useState('');
  const [oqoodPercentage, setOqoodPercentage] = useState('');
  const [oqoodPrice, setOqoodPrice] = useState('');
  const [oqoodPaidDate, setOqoodPaidDate] = useState('');
  const [oqoodStatus, setOqoodStatus] = useState('');
  const [oqoodProof, setOqoodProof] = useState(null);

  // Other Charges (for Leased)
  const [otherChargesPercentage, setOtherChargesPercentage] = useState('');
  const [otherChargesPrice, setOtherChargesPrice] = useState('');
  const [otherChargesPaidDate, setOtherChargesPaidDate] = useState('');
  const [otherChargesStatus, setOtherChargesStatus] = useState('');
  const [otherChargesProof, setOtherChargesProof] = useState(null);

  // Bill Arrangement
  const [billArrangements, setBillArrangements] = useState({
    dewa: false,
    internet: false,
    gas: false,
    chiller: false,
  });
  const [dewaNumber, setDewaNumber] = useState('');
  const [internetNumber, setInternetNumber] = useState('');
  const [gasNumber, setGasNumber] = useState('');

  // ========== STATUS STATE ==========
  const [currentStatus, setCurrentStatus] = useState('available');
  const [listingVisibility, setListingVisibility] = useState('internal_only');

  // ========== FETCH DYNAMIC DATA ==========
  useEffect(() => {
    const fetchData = async () => {
      setLoadingData(true);
      try {
        // Fetch projects, developers, and owners in parallel
        const [projectsResult, developersResult, ownersResult] = await Promise.all([
          dispatch(fetchPropertyManagerProjects({ per_page: 100 })),
          dispatch(fetchPropertyManagerDevelopers({ per_page: 100 })),
          dispatch(fetchPropertyManagerOwners({ per_page: 100 })),
        ]);

        // Extract data from results (handle nested data structure from Laravel pagination)
        if (projectsResult.payload) {
          const payload = projectsResult.payload;
          const projectsData = payload?.data?.data || payload?.data || payload;
          if (Array.isArray(projectsData)) {
            setProjects(projectsData);
          }
        }

        if (developersResult.payload) {
          const payload = developersResult.payload;
          const developersData = payload?.data?.data || payload?.data || payload;
          if (Array.isArray(developersData)) {
            setDevelopers(developersData);
          }
        }

        if (ownersResult.payload) {
          const payload = ownersResult.payload;
          const ownersData = payload?.data?.data || payload?.data || payload;
          if (Array.isArray(ownersData)) {
            setOwners(ownersData);
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoadingData(false);
      }
    };

    fetchData();
  }, [dispatch]);

  // ========== POPULATE FORM FOR EDIT MODE ==========
  useEffect(() => {
    if (mode === 'edit' && initialProperty) {
      // Property Details
      setSelectedProject(initialProperty.project_id ? String(initialProperty.project_id) : '');
      setSelectedDeveloper(initialProperty.developer_id ? String(initialProperty.developer_id) : '');
      setSelectedOwner(initialProperty.owner_id ? String(initialProperty.owner_id) : '');
      setPropertyType(initialProperty.type || '');
      setUnitNumber(initialProperty.unit_number || '');
      setBuildingTowerName(initialProperty.building_tower_name || '');
      setFloorNumber(initialProperty.floor_number || '');
      setAreaSize(initialProperty.area_size || '');
      setRooms(initialProperty.rooms || '');
      setBedrooms(initialProperty.bedrooms || '');
      setBathrooms(initialProperty.bathrooms || '');
      setMaxGuests(initialProperty.max_guests || '');
      setMaidRoom(initialProperty.maid_room ? 'yes' : 'no');
      setBalcony(initialProperty.balcony ? 'yes' : 'no');
      setParkingSpace(initialProperty.parking_space || '');
      setView(initialProperty.view || '');
      setFurnished(initialProperty.furnished || '');
      setCeilingHeight(initialProperty.ceiling_height || '');
      setSmartHomeEnabled(initialProperty.smart_home_enabled ? 'yes' : 'no');

      // Address
      setAddress1(initialProperty.address_1 || '');
      setAddress2(initialProperty.address_2 || '');
      setCountry(initialProperty.country || '');
      setState(initialProperty.state || '');
      setCity(initialProperty.city || '');
      setZipCode(initialProperty.zip_code || '');
      setLatitude(initialProperty.latitude || '');
      setLongitude(initialProperty.longitude || '');

      // Misc Info
      setUniqueId(initialProperty.unique_id || '');
      setExternalId(initialProperty.external_id || '');
      setAccounting(initialProperty.accounting || '');
      setRentalLicenseNumber(initialProperty.rental_license_number || '');
      setLicenseExpirationDate(initialProperty.rental_license_expiration_date || '');
      setWifiNetwork(initialProperty.wifi_name || '');
      setWifiPassword(initialProperty.wifi_password || '');

      // Booking Settings
      setBookingType(initialProperty.booking_type || '');
      setBookingWindow(initialProperty.booking_window || '');
      setTurnover(initialProperty.turnover || '');
      setBookingLeadTime(initialProperty.booking_lead_time || '');
      // Strip seconds from time values if present (DB stores as HH:MM:SS, select options are HH:MM)
      const formatTime = (time) => time ? time.substring(0, 5) : '';
      setCheckInTime(formatTime(initialProperty.check_in_time));
      setCheckOutTime(formatTime(initialProperty.check_out_time));
      setMinimumStay(initialProperty.minimum_stay || '');
      setMaximumStay(initialProperty.maximum_stay || '');
      setMaximumWeekendStay(initialProperty.maximum_weekend_stay || '');
      setCollectBalanceAt(initialProperty.collect_balance_at || '');
      setPercentAtReservation(initialProperty.percentage_at_reservation || '');

      // Description (from nested description object)
      const desc = initialProperty.description || {};
      setPublicName(desc.public_name || '');
      setShortDescription(desc.short_description || '');
      setLongDescription(desc.long_description || '');
      setNotes(desc.notes || '');
      setInteraction(desc.interaction || '');
      setNeighbourhood(desc.neighborhood || desc.neighbourhood || '');
      setAccess(desc.access || '');
      setSpace(desc.space || '');
      setTransit(desc.transit || '');
      setHouseManual(desc.house_manual || '');

      // Photos
      if (initialProperty.photos && Array.isArray(initialProperty.photos)) {
        setPhotos(initialProperty.photos.map(photo => ({
          id: photo.id,
          url: photo.url,
          type: photo.type || 'gallery',
          file: null,
        })));
      }

      // Amenities - match by value (lowercase)
      if (initialProperty.amenities && Array.isArray(initialProperty.amenities)) {
        const amenityNames = initialProperty.amenities.map(a => a.name?.toLowerCase() || a.name);
        // Popular amenities (pool, gym, parking, kitchen, wifi, ac)
        const popularList = ['pool', 'gym', 'parking', 'kitchen', 'wifi', 'ac'];
        setAmenitiesPopular(amenityNames.filter(name => popularList.includes(name)));
        // Indoor amenities (heating, washer, dryer, dishwasher, fireplace, smart_tv)
        const indoorList = ['heating', 'washer', 'dryer', 'dishwasher', 'fireplace', 'smart_tv'];
        setAmenitiesIndoor(amenityNames.filter(name => indoorList.includes(name)));
        // Outdoor amenities (balcony, garden, bbq_area, patio, rooftop_access, tennis_court)
        const outdoorList = ['balcony', 'garden', 'bbq_area', 'patio', 'rooftop_access', 'tennis_court'];
        setAmenitiesOutdoor(amenityNames.filter(name => outdoorList.includes(name)));
      }

      // Pricing (from nested pricings array - take first item)
      const pricing = initialProperty.pricings?.[0] || {};
      setPropertyUsage(pricing.property_usage ? `for_${pricing.property_usage}` : '');
      setCurrency(pricing.currency || 'AED');
      setCommissionStructure(pricing.commission_structure || '');
      setCommissionAmount(pricing.commission_amount || '');
      // For Sale
      setSellingPrice(pricing.selling_price || '');
      setPricePerSqft(pricing.price_per_sqft || '');
      setServiceChargesSale(pricing.service_charges_sale || '');
      setDldRegistrationFee(pricing.dld_registration_fee || '');
      // For Monthly Rent
      setRentalAmount(pricing.rental_amount || '');
      setCurrentlyRented(pricing.currently_rented ? 'yes' : 'no');
      setDepositRequired(pricing.deposit_required || '');
      setServiceChargesRent(pricing.service_charges_rent || '');
      // For Short Term Rent
      setNightlyBasePrice(pricing.nightly_base_price || '');
      setSecurityDeposit(pricing.security_deposit || '');
      setCleaningFee(pricing.cleaning_fee || '');
      setCleaningFeeTax(pricing.cleaning_fee_tax_percentage || '');
      setTaxRate(pricing.tax_percentage || '');
      setWeekendRateAdjustment(pricing.weekend_rate_adjustment_percentage || '');

      // Policies
      if (initialProperty.policies && Array.isArray(initialProperty.policies)) {
        setPolicies(initialProperty.policies.map(p => ({
          id: p.id,
          name: p.name || '',
          description: p.description || '',
        })));
      }

      // Agreement
      const agreement = initialProperty.agreement || {};
      setAgreementType(agreement.type || '');
      setTenancyAgreementExpiry(agreement.tenancy_agreement_expiration_date || '');
      setEjariExpiry(agreement.ejari_expiration_date || '');
      setDctmLetterExpiry(agreement.dtcm_letter_expiration_date || '');
      setRentalStartDate(agreement.rental_start_date || '');
      setRentalEndDate(agreement.rental_end_date || '');
      setPurchasePrice(agreement.purchase_price || '');
      setPurchaseDate(agreement.purchase_date || '');
      setNumberOfSchedulePayments(agreement.number_of_schedule_payments || '');
      setDewaNumber(agreement.dewa_number || '');
      setInternetNumber(agreement.internet_number || '');
      setGasNumber(agreement.gas_number || '');

      // Agreement files - set existing URLs
      if (agreement.tenancy_agreement) {
        setTenancyAgreementFile({
          name: 'Tenancy Agreement',
          url: agreement.tenancy_agreement,
          type: agreement.tenancy_agreement.endsWith('.pdf') ? 'application/pdf' : 'image/jpeg',
          file: null, // No new file, just the existing URL
        });
      }
      if (agreement.ejari) {
        setEjariFile({
          name: 'Ejari Document',
          url: agreement.ejari,
          type: agreement.ejari.endsWith('.pdf') ? 'application/pdf' : 'image/jpeg',
          file: null,
        });
      }
      if (agreement.dtcm_letter) {
        setDctmLetterFile({
          name: 'DTCM Letter',
          url: agreement.dtcm_letter,
          type: agreement.dtcm_letter.endsWith('.pdf') ? 'application/pdf' : 'image/jpeg',
          file: null,
        });
      }

      // Bill Arrangements
      if (agreement.bill_arrangements && typeof agreement.bill_arrangements === 'object') {
        setBillArrangements({
          dewa: agreement.bill_arrangements.dewa || false,
          internet: agreement.bill_arrangements.internet || false,
          gas: agreement.bill_arrangements.gas || false,
          chiller: agreement.bill_arrangements.chiller || false,
        });
      }

      // Installments
      if (initialProperty.installments && Array.isArray(initialProperty.installments) && initialProperty.installments.length > 0) {
        setInstallments(initialProperty.installments.map(inst => ({
          percentage: inst.percentage || '',
          price: inst.amount || '',
          paidDate: inst.paid_date || '',
          status: inst.status || '',
          proof: null,
        })));
      }

      // Status & Listing Visibility
      setCurrentStatus(initialProperty.status || 'draft');
      setListingVisibility(initialProperty.listing_visibility || 'internal_only');
    }
  }, [mode, initialProperty]);

  // ========== OPTIONS ==========
  // Project options (dynamic from API)
  const projectOptions = [
    { label: loadingData ? 'Loading projects...' : 'Select project', value: '' },
    ...projects.map((project) => ({
      label: project.name || project.title || `Project ${project.id}`,
      value: String(project.id),
    })),
  ];

  // Developer options (dynamic from API)
  const developerOptions = [
    { label: loadingData ? 'Loading developers...' : 'Select developer', value: '' },
    ...developers.map((developer) => ({
      label: developer.name || developer.company_name || `Developer ${developer.id}`,
      value: String(developer.id),
    })),
  ];

  // Owner options (dynamic from API)
  const ownerOptions = [
    { label: loadingData ? 'Loading owners...' : 'Select owner', value: '' },
    ...owners.map((owner) => ({
      label: owner.name || `${owner.first_name || ''} ${owner.last_name || ''}`.trim() || `Owner ${owner.id}`,
      value: String(owner.id),
    })),
  ];

  // Property Type options (static)
  const propertyTypeOptions = [
    { label: 'Select property type', value: '' },
    { label: 'Apartment', value: 'apartment' },
    { label: 'Villa', value: 'villa' },
    { label: 'Townhouse', value: 'townhouse' },
    { label: 'Penthouse', value: 'penthouse' },
    { label: 'Studio', value: 'studio' },
    { label: 'Office', value: 'office' },
    { label: 'Shop', value: 'shop' },
    { label: 'Plot', value: 'plot' },
  ];

  // Rooms options
  const roomsOptions = [
    { label: 'Select rooms', value: '' },
    { label: '1', value: '1' },
    { label: '2', value: '2' },
    { label: '3', value: '3' },
    { label: '4', value: '4' },
    { label: '5', value: '5' },
    { label: '6', value: '6' },
    { label: '7', value: '7' },
    { label: '8+', value: '8+' },
  ];

  // Bedrooms options
  const bedroomsOptions = [
    { label: 'Select bedrooms', value: '' },
    { label: 'Studio', value: '0' },
    { label: '1', value: '1' },
    { label: '2', value: '2' },
    { label: '3', value: '3' },
    { label: '4', value: '4' },
    { label: '5', value: '5' },
    { label: '6+', value: '6+' },
  ];

  // Bathrooms options
  const bathroomsOptions = [
    { label: 'Select bathrooms', value: '' },
    { label: '1', value: '1' },
    { label: '2', value: '2' },
    { label: '3', value: '3' },
    { label: '4', value: '4' },
    { label: '5+', value: '5+' },
  ];

  // Yes/No options
  const yesNoOptions = [
    { label: 'Select', value: '' },
    { label: 'Yes', value: 'yes' },
    { label: 'No', value: 'no' },
  ];

  // Parking Space options
  const parkingSpaceOptions = [
    { label: 'Select parking space', value: '' },
    { label: 'No', value: 'no' },
    { label: 'Basement', value: 'basement' },
    { label: 'Podium', value: 'podium' },
    { label: 'Street', value: 'street' },
  ];

  // View options
  const viewOptions = [
    { label: 'Select view', value: '' },
    { label: 'Community', value: 'community' },
    { label: 'Park', value: 'park' },
    { label: 'Sea', value: 'sea' },
    { label: 'Marina', value: 'marina' },
    { label: 'City', value: 'city' },
    { label: 'Burj', value: 'burj' },
  ];

  // Furnished options
  const furnishedOptions = [
    { label: 'Select furnished status', value: '' },
    { label: 'Fully Furnished', value: 'fully_furnished' },
    { label: 'Unfurnished', value: 'unfurnished' },
    { label: 'Semi-Furnished', value: 'semi_furnished' },
  ];

  // Country options
  const countryOptions = [
    { label: 'Select country', value: '' },
    { label: 'United Arab Emirates', value: 'UAE' },
    { label: 'Saudi Arabia', value: 'SA' },
    { label: 'Qatar', value: 'QA' },
  ];

  // State options
  const stateOptions = [
    { label: 'Select state', value: '' },
    { label: 'Dubai', value: 'dubai' },
    { label: 'Abu Dhabi', value: 'abu_dhabi' },
    { label: 'Sharjah', value: 'sharjah' },
  ];

  // City options
  const cityOptions = [
    { label: 'Select city', value: '' },
    { label: 'Dubai', value: 'dubai' },
    { label: 'Abu Dhabi', value: 'abu_dhabi' },
    { label: 'Sharjah', value: 'sharjah' },
  ];

  // Booking Type options
  const bookingTypeOptions = [
    { label: 'Select type', value: '' },
    { label: 'Instant', value: 'instant' },
    { label: 'Request', value: 'request' },
  ];

  // Booking Window options
  const bookingWindowOptions = [
    { label: 'Select window', value: '' },
    { label: '30 days', value: '30' },
    { label: '60 days', value: '60' },
    { label: '90 days', value: '90' },
  ];

  // Turnover options
  const turnoverOptions = [
    { label: 'Select', value: '' },
    { label: '0 days', value: '0' },
    { label: '1 day', value: '1' },
    { label: '2 days', value: '2' },
  ];

  // Booking Lead Time options
  const bookingLeadTimeOptions = [
    { label: 'Select', value: '' },
    { label: 'Same day', value: 'same_day' },
    { label: '1 day', value: '1' },
    { label: '2 days', value: '2' },
  ];

  // Check-in Time options
  const checkInTimeOptions = [
    { label: 'Select', value: '' },
    { label: '14:00', value: '14:00' },
    { label: '15:00', value: '15:00' },
    { label: '16:00', value: '16:00' },
  ];

  // Check-out Time options
  const checkOutTimeOptions = [
    { label: 'Select', value: '' },
    { label: '10:00', value: '10:00' },
    { label: '11:00', value: '11:00' },
    { label: '12:00', value: '12:00' },
  ];

  // Min Stay options
  const minStayOptions = [
    { label: 'Select', value: '' },
    { label: '1 night', value: '1' },
    { label: '2 nights', value: '2' },
    { label: '3 nights', value: '3' },
  ];

  // Max Stay options
  const maxStayOptions = [
    { label: 'Select', value: '' },
    { label: '30 nights', value: '30' },
    { label: '60 nights', value: '60' },
    { label: '90 nights', value: '90' },
  ];

  // Max Weekend Stay options
  const maxWeekendStayOptions = [
    { label: 'Select', value: '' },
    { label: '2 nights', value: '2' },
    { label: '3 nights', value: '3' },
  ];

  // Collect Balance At options
  const collectBalanceAtOptions = [
    { label: 'Select', value: '' },
    { label: 'Check-in', value: 'checkin' },
    { label: 'Check-out', value: 'checkout' },
  ];

  // Percent At Reservation options
  const percentAtReservationOptions = [
    { label: 'Select', value: '' },
    { label: '25%', value: '25' },
    { label: '50%', value: '50' },
    { label: '75%', value: '75' },
    { label: '100%', value: '100' },
  ];

  // Property Usage options
  const propertyUsageOptions = [
    { label: 'Select property usage', value: '' },
    { label: 'For Sale', value: 'for_sale' },
    { label: 'For Monthly Rent', value: 'for_monthly_rent' },
    { label: 'For Short Term Rent', value: 'for_short_term_rent' },
  ];

  // Currency options
  const currencyOptions = [
    { label: 'AED', value: 'AED' },
    { label: 'USD', value: 'USD' },
    { label: 'EUR', value: 'EUR' },
  ];

  // Commission Structure options
  const commissionStructureOptions = [
    { label: 'Select commission structure', value: '' },
    { label: 'Percentage', value: 'percentage' },
    { label: 'Fixed Amount', value: 'fixed_amount' },
  ];

  // Agreement Type options
  const agreementTypeOptions = [
    { label: 'Select agreement type', value: '' },
    { label: 'Rented', value: 'rented' },
    { label: 'Owned', value: 'owned' },
    { label: 'Leased', value: 'leased' },
  ];

  // Payment Status options
  const paymentStatusOptions = [
    { label: 'Select status', value: '' },
    { label: 'Paid', value: 'paid' },
    { label: 'Pending', value: 'pending' },
    { label: 'Overdue', value: 'overdue' },
    { label: 'Partial', value: 'partial' },
  ];

  // DLD/Oqood Type options
  const chargeTypeOptions = [
    { label: 'Select type', value: '' },
    { label: 'Fixed', value: 'fixed' },
    { label: 'Percentage', value: 'percentage' },
  ];

  // Current Status options
  const currentStatusOptions = [
    { label: 'Available', value: 'available' },
    { label: 'Reserved', value: 'reserved' },
    { label: 'Sold', value: 'sold' },
    { label: 'Rented', value: 'rented' },
    { label: 'Under Maintenance', value: 'under_maintenance' },
    { label: 'Owner Occupied', value: 'owner_occupied' },
  ];

  // Listing Visibility options
  const listingVisibilityOptions = [
    { label: 'Internal Only', value: 'internal_only' },
    { label: 'Shared with Partners', value: 'shared_with_partners' },
    { label: 'Public', value: 'public' },
  ];

  // Amenities options
  const amenitiesPopularOptions = [
    { label: 'Pool', value: 'pool' },
    { label: 'Gym', value: 'gym' },
    { label: 'Parking', value: 'parking' },
    { label: 'Kitchen', value: 'kitchen' },
    { label: 'Wi-Fi', value: 'wifi' },
    { label: 'AC', value: 'ac' },
  ];

  const amenitiesIndoorOptions = [
    { label: 'Heating', value: 'heating' },
    { label: 'Washer', value: 'washer' },
    { label: 'Dryer', value: 'dryer' },
    { label: 'Dishwasher', value: 'dishwasher' },
    { label: 'Fireplace', value: 'fireplace' },
    { label: 'Smart TV', value: 'smart_tv' },
  ];

  const amenitiesOutdoorOptions = [
    { label: 'Balcony', value: 'balcony' },
    { label: 'Garden', value: 'garden' },
    { label: 'BBQ Area', value: 'bbq_area' },
    { label: 'Patio', value: 'patio' },
    { label: 'Rooftop Access', value: 'rooftop_access' },
    { label: 'Tennis Court', value: 'tennis_court' },
  ];

  // ========== HANDLERS ==========
  const handleBack = useCallback(() => {
    if (onClose) {
      onClose();
    } else {
      router.push('/property-manager/properties');
    }
  }, [onClose, router]);

  // Photo handlers
  const handlePhotosDrop = useCallback((_dropFiles, acceptedFiles) => {
    const validFiles = acceptedFiles.filter((file) => {
      if (file.size > 2 * 1024 * 1024) {
        return false;
      }
      return true;
    });

    const newPhotos = validFiles.map((file) => ({
      file,
      url: URL.createObjectURL(file),
      name: file.name,
      size: `${(file.size / 1024).toFixed(2)} KB`,
    }));
    setPhotos((prev) => [...prev, ...newPhotos]);
  }, []);


  // Policy handlers
  const handleAddPolicy = useCallback(() => {
    setPolicies((prev) => [...prev, { name: '', description: '' }]);
  }, []);

  const handleRemovePolicy = useCallback((index) => {
    setPolicies((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const handlePolicyChange = useCallback((index, field, value) => {
    setPolicies((prev) =>
      prev.map((policy, i) =>
        i === index ? { ...policy, [field]: value } : policy
      )
    );
  }, []);

  // Amenity toggle handlers
  const toggleAmenity = useCallback((type, value) => {
    const setters = {
      popular: setAmenitiesPopular,
      indoor: setAmenitiesIndoor,
      outdoor: setAmenitiesOutdoor,
    };
    setters[type]((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  }, []);

  // Save handler
  const handleSave = useCallback(async () => {
    setSaving(true);
    setSaveError(null);

    try {
      // Create FormData for file uploads
      const formData = new FormData();

      // Step indicator for backend
      formData.append('step', 'property_details');

      // Property Details
      if (selectedProject) formData.append('project_id', selectedProject);
      if (selectedDeveloper) formData.append('developer_id', selectedDeveloper);
      if (selectedOwner) formData.append('owner_id', selectedOwner);
      if (propertyType) formData.append('type', propertyType);
      if (unitNumber) formData.append('unit_number', unitNumber);
      if (buildingTowerName) formData.append('building_tower_name', buildingTowerName);
      if (floorNumber) formData.append('floor_number', floorNumber);
      if (areaSize) formData.append('area_size', areaSize);
      if (rooms) formData.append('rooms', rooms);
      if (bedrooms) formData.append('bedrooms', bedrooms);
      if (bathrooms) formData.append('bathrooms', bathrooms);
      if (maxGuests) formData.append('max_guests', maxGuests);
      if (maidRoom) formData.append('maid_room', maidRoom);
      if (balcony) formData.append('balcony', balcony);
      if (parkingSpace) formData.append('parking_space', parkingSpace);
      if (view) formData.append('view', view);
      if (furnished) formData.append('furnished', furnished);
      if (ceilingHeight) formData.append('ceiling_height', ceilingHeight);
      if (smartHomeEnabled) formData.append('smart_home_enabled', smartHomeEnabled);

      // Address
      if (address1) formData.append('address_1', address1);
      if (address2) formData.append('address_2', address2);
      if (country) formData.append('country', country);
      if (state) formData.append('state', state);
      if (city) formData.append('city', city);
      if (zipCode) formData.append('zip_code', zipCode);
      if (longitude) formData.append('longitude', longitude);
      if (latitude) formData.append('latitude', latitude);

      // Misc Info
      if (uniqueId) formData.append('unique_id', uniqueId);
      if (externalId) formData.append('external_id', externalId);
      if (accounting) formData.append('accounting', accounting);
      if (rentalLicenseNumber) formData.append('rental_license_number', rentalLicenseNumber);
      if (licenseExpirationDate) formData.append('rental_license_expiration_date', licenseExpirationDate);
      if (wifiNetwork) formData.append('wifi_name', wifiNetwork);
      if (wifiPassword) formData.append('wifi_password', wifiPassword);

      // Booking Settings
      if (bookingType) formData.append('booking_type', bookingType);
      if (bookingWindow) formData.append('booking_window', bookingWindow);
      if (turnover) formData.append('turnover', turnover);
      if (bookingLeadTime) formData.append('booking_lead_time', bookingLeadTime);
      if (checkInTime) formData.append('check_in_time', checkInTime);
      if (checkOutTime) formData.append('check_out_time', checkOutTime);
      if (minimumStay) formData.append('minimum_stay', minimumStay);
      if (maximumStay) formData.append('maximum_stay', maximumStay);
      if (maximumWeekendStay) formData.append('maximum_weekend_stay', maximumWeekendStay);
      if (collectBalanceAt) formData.append('collect_balance_at', collectBalanceAt);
      if (percentAtReservation) formData.append('percentage_at_reservation', percentAtReservation);

      // Description
      if (publicName) formData.append('public_name', publicName);
      if (shortDescription) formData.append('short_description', shortDescription);
      if (longDescription) formData.append('long_description', longDescription);
      if (notes) formData.append('notes', notes);
      if (interaction) formData.append('interaction', interaction);
      if (neighbourhood) formData.append('neighbourhood', neighbourhood);
      if (access) formData.append('access', access);
      if (space) formData.append('space', space);
      if (transit) formData.append('transit', transit);
      if (houseManual) formData.append('house_manual', houseManual);

      // Photos - upload actual files
      photos.forEach((photo, index) => {
        if (photo.file) {
          formData.append(`photos[${index}]`, photo.file);
        }
      });

      // Amenities - combine all amenity arrays
      const allAmenities = [...amenitiesPopular, ...amenitiesIndoor, ...amenitiesOutdoor];
      allAmenities.forEach((amenity, index) => {
        formData.append(`amenities[${index}]`, amenity);
      });

      // Pricing
      if (propertyUsage) formData.append('property_usage', propertyUsage);
      if (currency) formData.append('currency', currency);
      if (commissionStructure) formData.append('commission_structure', commissionStructure);
      if (commissionAmount) formData.append('commission_amount', commissionAmount);
      if (sellingPrice) formData.append('selling_price', sellingPrice);
      if (pricePerSqft) formData.append('price_per_sqft', pricePerSqft);
      if (serviceChargesSale) formData.append('service_charges_sale', serviceChargesSale);
      if (dldRegistrationFee) formData.append('dld_registration_fee', dldRegistrationFee);
      if (rentalAmount) formData.append('rental_amount', rentalAmount);
      if (currentlyRented) formData.append('currently_rented', currentlyRented);
      if (depositRequired) formData.append('deposit_required', depositRequired);
      if (serviceChargesRent) formData.append('service_charges_rent', serviceChargesRent);
      if (nightlyBasePrice) formData.append('nightly_base_price', nightlyBasePrice);
      if (securityDeposit) formData.append('security_deposit', securityDeposit);
      if (cleaningFee) formData.append('cleaning_fee', cleaningFee);
      if (cleaningFeeTax) formData.append('cleaning_fee_tax', cleaningFeeTax);
      if (taxRate) formData.append('tax_rate', taxRate);
      if (weekendRateAdjustment) formData.append('weekend_rate_adjustment', weekendRateAdjustment);

      // Policies
      if (policies.length > 0) {
        formData.append('policies', JSON.stringify(policies));
      }

      // Agreement
      if (agreementType) formData.append('agreement_type', agreementType);
      if (tenancyAgreementExpiry) formData.append('tenancy_agreement_expiry', tenancyAgreementExpiry);
      if (ejariExpiry) formData.append('ejari_expiry', ejariExpiry);
      if (dctmLetterExpiry) formData.append('dctm_letter_expiry', dctmLetterExpiry);
      if (rentalStartDate) formData.append('rental_start_date', rentalStartDate);
      if (rentalEndDate) formData.append('rental_end_date', rentalEndDate);
      if (numberOfSchedulePayments) formData.append('number_of_schedule_payments', numberOfSchedulePayments);

      // Agreement Document Files
      console.log('Agreement files state:', {
        tenancyAgreementFile,
        ejariFile,
        dctmLetterFile,
      });
      if (tenancyAgreementFile?.file) {
        console.log('Appending tenancy_agreement file:', tenancyAgreementFile.file.name);
        formData.append('tenancy_agreement', tenancyAgreementFile.file);
      }
      if (ejariFile?.file) {
        console.log('Appending ejari file:', ejariFile.file.name);
        formData.append('ejari', ejariFile.file);
      }
      if (dctmLetterFile?.file) {
        console.log('Appending dtcm_letter file:', dctmLetterFile.file.name);
        formData.append('dtcm_letter', dctmLetterFile.file);
      }

      // Bill Arrangements
      if (billArrangements) {
        formData.append('bill_arrangements', JSON.stringify(billArrangements));
      }
      if (dewaNumber) formData.append('dewa_number', dewaNumber);
      if (internetNumber) formData.append('internet_number', internetNumber);
      if (gasNumber) formData.append('gas_number', gasNumber);

      // Status
      if (currentStatus) formData.append('status', currentStatus);
      if (listingVisibility) formData.append('listing_visibility', listingVisibility);

      let result;
      if (mode === 'edit' && initialProperty?.id) {
        result = await dispatch(updatePropertyManagerProperty({
          id: initialProperty.id,
          data: formData
        }));
      } else {
        result = await dispatch(createPropertyManagerProperty(formData));
      }

      // Check if the action was fulfilled
      if (result.type.endsWith('/fulfilled')) {
        setSaving(false);
        // Success - redirect or close
        if (onClose) {
          onClose();
        } else {
          router.push('/property-manager/properties');
        }
      } else {
        // Handle rejection
        const errorMessage = result.error?.message || 'Failed to save property. Please try again.';
        setSaveError(errorMessage);
        setSaving(false);
      }
    } catch (err) {
      console.error('Error saving property:', err);
      setSaveError(err.message || 'Failed to save property. Please try again.');
      setSaving(false);
    }
  }, [
    dispatch, mode, initialProperty, onClose, router,
    selectedProject, selectedDeveloper, selectedOwner, propertyType,
    unitNumber, buildingTowerName, floorNumber, areaSize, rooms, bedrooms, bathrooms,
    maxGuests, maidRoom, balcony, parkingSpace, view, furnished, ceilingHeight,
    smartHomeEnabled, address1, address2, country, state, city, zipCode,
    longitude, latitude, uniqueId, externalId, accounting, rentalLicenseNumber,
    licenseExpirationDate, wifiNetwork, wifiPassword, bookingType, bookingWindow,
    turnover, bookingLeadTime, checkInTime, checkOutTime, minimumStay, maximumStay,
    maximumWeekendStay, collectBalanceAt, percentAtReservation, publicName,
    shortDescription, longDescription, notes, interaction, neighbourhood, access,
    space, transit, houseManual, photos, amenitiesPopular, amenitiesIndoor,
    amenitiesOutdoor, propertyUsage, currency, commissionStructure, commissionAmount,
    sellingPrice, pricePerSqft, serviceChargesSale, dldRegistrationFee, rentalAmount,
    currentlyRented, depositRequired, serviceChargesRent, nightlyBasePrice,
    securityDeposit, cleaningFee, cleaningFeeTax, taxRate, weekendRateAdjustment,
    policies, agreementType, tenancyAgreementExpiry, ejariExpiry, dctmLetterExpiry,
    rentalStartDate, rentalEndDate, numberOfSchedulePayments, currentStatus,
    listingVisibility, tenancyAgreementFile, ejariFile, dctmLetterFile,
    billArrangements, dewaNumber, internetNumber, gasNumber,
  ]);

  // Set data attribute on body when AddProperty is mounted
  useEffect(() => {
    const attr = mode === 'edit' ? 'data-edit-property-open' : 'data-add-property-open';
    document.body.setAttribute(attr, 'true');
    return () => {
      document.body.removeAttribute(attr);
    };
  }, [mode]);

  // Listen for custom events from header
  useEffect(() => {
    const handleClose = () => handleBack();
    const handleSaveEvent = () => handleSave();

    const closeEvent = mode === 'edit' ? 'closeEditProperty' : 'closeAddProperty';
    const saveEvent = mode === 'edit' ? 'saveEditProperty' : 'saveAddProperty';

    window.addEventListener(closeEvent, handleClose);
    window.addEventListener(saveEvent, handleSaveEvent);

    return () => {
      window.removeEventListener(closeEvent, handleClose);
      window.removeEventListener(saveEvent, handleSaveEvent);
    };
  }, [handleBack, handleSave, mode]);

  return (
    <div className="add-developer-wrapper">
      <Page
        title={
          <InlineStack gap="050" blockAlign="center">
            <Icon source={HomeIcon} tone="base" />
            <Icon source={ChevronRightIcon} tone="subdued" />
            <span className="new-developer-title">{mode === 'edit' ? 'Edit property' : 'New property'}</span>
          </InlineStack>
        }
      >
        <Layout>
          {/* Error Banner */}
          {saveError && (
            <Layout.Section>
              <Banner
                title="Error saving property"
                tone="critical"
                onDismiss={() => setSaveError(null)}
              >
                <p>{saveError}</p>
              </Banner>
            </Layout.Section>
          )}

          {/* Main content - Left column */}
          <Layout.Section>
            <BlockStack gap="400">

              {/* ========== PROPERTY DETAILS CARD ========== */}
              <Card>
                <BlockStack gap="400">
                  <Text variant="headingMd" as="h2">Property details</Text>

                  <TextField
                    label="Property ID"
                    value={propertyId}
                    disabled
                    helpText="System generated ID"
                    autoComplete="off"
                  />

                  <BlockStack gap="300">
                    <FormRow label="Property Type">
                      <Select
                        label="Property Type"
                        labelHidden
                        options={propertyTypeOptions}
                        value={propertyType}
                        onChange={setPropertyType}
                      />
                    </FormRow>

                    <FormRow label="Unit Number">
                      <TextField
                        label="Unit Number"
                        labelHidden
                        value={unitNumber}
                        onChange={setUnitNumber}
                        autoComplete="off"
                        placeholder="Enter unit number"
                      />
                    </FormRow>

                    <FormRow label="Building / Tower Name">
                      <TextField
                        label="Building / Tower Name"
                        labelHidden
                        value={buildingTowerName}
                        onChange={setBuildingTowerName}
                        autoComplete="off"
                        placeholder="Enter building or tower name"
                      />
                    </FormRow>

                    <FormRow label="Floor Number">
                      <TextField
                        label="Floor Number"
                        labelHidden
                        type="number"
                        value={floorNumber}
                        onChange={setFloorNumber}
                        autoComplete="off"
                        placeholder="Enter floor number"
                      />
                    </FormRow>

                    <FormRow label="Area Size (Sqft)">
                      <TextField
                        label="Area Size"
                        labelHidden
                        type="number"
                        value={areaSize}
                        onChange={setAreaSize}
                        autoComplete="off"
                        placeholder="Enter area size"
                        suffix="sqft"
                      />
                    </FormRow>

                    <FormRow label="Number of Rooms">
                      <Select
                        label="Number of Rooms"
                        labelHidden
                        options={roomsOptions}
                        value={rooms}
                        onChange={setRooms}
                      />
                    </FormRow>

                    <FormRow label="Bedrooms">
                      <Select
                        label="Bedrooms"
                        labelHidden
                        options={bedroomsOptions}
                        value={bedrooms}
                        onChange={setBedrooms}
                      />
                    </FormRow>

                    <FormRow label="Bathrooms">
                      <Select
                        label="Bathrooms"
                        labelHidden
                        options={bathroomsOptions}
                        value={bathrooms}
                        onChange={setBathrooms}
                      />
                    </FormRow>

                    <FormRow label="Maximum Guests">
                      <TextField
                        label="Maximum Guests"
                        labelHidden
                        type="number"
                        value={maxGuests}
                        onChange={setMaxGuests}
                        autoComplete="off"
                        placeholder="e.g. 4"
                      />
                    </FormRow>

                    <FormRow label="Maid Room">
                      <Select
                        label="Maid Room"
                        labelHidden
                        options={yesNoOptions}
                        value={maidRoom}
                        onChange={setMaidRoom}
                      />
                    </FormRow>

                    <FormRow label="Balcony">
                      <Select
                        label="Balcony"
                        labelHidden
                        options={yesNoOptions}
                        value={balcony}
                        onChange={setBalcony}
                      />
                    </FormRow>

                    <FormRow label="Parking Space">
                      <Select
                        label="Parking Space"
                        labelHidden
                        options={parkingSpaceOptions}
                        value={parkingSpace}
                        onChange={setParkingSpace}
                      />
                    </FormRow>

                    <FormRow label="View">
                      <Select
                        label="View"
                        labelHidden
                        options={viewOptions}
                        value={view}
                        onChange={setView}
                      />
                    </FormRow>

                    <FormRow label="Furnished">
                      <Select
                        label="Furnished"
                        labelHidden
                        options={furnishedOptions}
                        value={furnished}
                        onChange={setFurnished}
                      />
                    </FormRow>

                    <FormRow label="Ceiling Height">
                      <TextField
                        label="Ceiling Height"
                        labelHidden
                        type="number"
                        value={ceilingHeight}
                        onChange={setCeilingHeight}
                        autoComplete="off"
                        placeholder="Enter ceiling height"
                        suffix="ft"
                      />
                    </FormRow>

                    <FormRow label="Smart Home Enabled">
                      <Select
                        label="Smart Home Enabled"
                        labelHidden
                        options={yesNoOptions}
                        value={smartHomeEnabled}
                        onChange={setSmartHomeEnabled}
                      />
                    </FormRow>
                  </BlockStack>
                </BlockStack>
              </Card>

              {/* ========== PROPERTY ADDRESS CARD ========== */}
              <Card>
                <BlockStack gap="400">
                  <Text variant="headingMd" as="h2">Property address</Text>

                  <BlockStack gap="300">
                    <FormRow label="Address Line 1">
                      <TextField
                        label="Address Line 1"
                        labelHidden
                        value={address1}
                        onChange={setAddress1}
                        autoComplete="off"
                        placeholder="Enter street address"
                      />
                    </FormRow>

                    <FormRow label="Address Line 2">
                      <TextField
                        label="Address Line 2"
                        labelHidden
                        value={address2}
                        onChange={setAddress2}
                        autoComplete="off"
                        placeholder="Apartment, suite, etc. (optional)"
                      />
                    </FormRow>

                    <FormRow label="Country">
                      <Select
                        label="Country"
                        labelHidden
                        options={countryOptions}
                        value={country}
                        onChange={setCountry}
                      />
                    </FormRow>

                    <FormRow label="State">
                      <Select
                        label="State"
                        labelHidden
                        options={stateOptions}
                        value={state}
                        onChange={setState}
                      />
                    </FormRow>

                    <FormRow label="City">
                      <Select
                        label="City"
                        labelHidden
                        options={cityOptions}
                        value={city}
                        onChange={setCity}
                      />
                    </FormRow>

                    <FormRow label="Zip Code">
                      <TextField
                        label="Zip Code"
                        labelHidden
                        value={zipCode}
                        onChange={setZipCode}
                        autoComplete="off"
                        placeholder="Enter zip code"
                      />
                    </FormRow>

                    <FormRow label="Latitude">
                      <TextField
                        label="Latitude"
                        labelHidden
                        value={latitude}
                        onChange={setLatitude}
                        autoComplete="off"
                        placeholder="e.g. 25.2048"
                      />
                    </FormRow>

                    <FormRow label="Longitude">
                      <TextField
                        label="Longitude"
                        labelHidden
                        value={longitude}
                        onChange={setLongitude}
                        autoComplete="off"
                        placeholder="e.g. 55.2708"
                      />
                    </FormRow>
                  </BlockStack>
                </BlockStack>
              </Card>

              {/* ========== PROPERTY MISC INFO CARD ========== */}
              <Card>
                <BlockStack gap="400">
                  <Text variant="headingMd" as="h2">Property Misc Info</Text>

                  <BlockStack gap="300">
                    <FormRow label="Unique ID">
                      <TextField
                        label="Unique ID"
                        labelHidden
                        value={uniqueId}
                        onChange={setUniqueId}
                        autoComplete="off"
                        placeholder="Enter unique ID"
                      />
                    </FormRow>

                    <FormRow label="External ID">
                      <TextField
                        label="External ID"
                        labelHidden
                        value={externalId}
                        onChange={setExternalId}
                        autoComplete="off"
                        placeholder="Enter external ID"
                      />
                    </FormRow>

                    <FormRow label="Accounting">
                      <TextField
                        label="Accounting"
                        labelHidden
                        value={accounting}
                        onChange={setAccounting}
                        autoComplete="off"
                        placeholder="Enter accounting reference"
                      />
                    </FormRow>

                    <FormRow label="Rental License Number">
                      <TextField
                        label="Rental License Number"
                        labelHidden
                        value={rentalLicenseNumber}
                        onChange={setRentalLicenseNumber}
                        autoComplete="off"
                        placeholder="Enter license number"
                      />
                    </FormRow>

                    <FormRow label="License Expiration Date">
                      <TextField
                        label="License Expiration Date"
                        labelHidden
                        type="date"
                        value={licenseExpirationDate}
                        onChange={setLicenseExpirationDate}
                        autoComplete="off"
                      />
                    </FormRow>

                    <FormRow label="WiFi Network Name">
                      <TextField
                        label="WiFi Network Name"
                        labelHidden
                        value={wifiNetwork}
                        onChange={setWifiNetwork}
                        autoComplete="off"
                        placeholder="Enter WiFi network name"
                      />
                    </FormRow>

                    <FormRow label="WiFi Password">
                      <TextField
                        label="WiFi Password"
                        labelHidden
                        type="password"
                        value={wifiPassword}
                        onChange={setWifiPassword}
                        autoComplete="off"
                        placeholder="Enter WiFi password"
                      />
                    </FormRow>
                  </BlockStack>
                </BlockStack>
              </Card>

              {/* ========== BOOKING SETTINGS CARD ========== */}
              <Card>
                <BlockStack gap="400">
                  <Text variant="headingMd" as="h2">Booking settings</Text>

                  <BlockStack gap="300">
                    <FormRow label="Booking Type">
                      <Select
                        label="Booking Type"
                        labelHidden
                        options={bookingTypeOptions}
                        value={bookingType}
                        onChange={setBookingType}
                      />
                    </FormRow>

                    <FormRow label="Booking Window">
                      <Select
                        label="Booking Window"
                        labelHidden
                        options={bookingWindowOptions}
                        value={bookingWindow}
                        onChange={setBookingWindow}
                      />
                    </FormRow>

                    <FormRow label="Turnover">
                      <Select
                        label="Turnover"
                        labelHidden
                        options={turnoverOptions}
                        value={turnover}
                        onChange={setTurnover}
                      />
                    </FormRow>

                    <FormRow label="Booking Lead Time">
                      <Select
                        label="Booking Lead Time"
                        labelHidden
                        options={bookingLeadTimeOptions}
                        value={bookingLeadTime}
                        onChange={setBookingLeadTime}
                      />
                    </FormRow>

                    <FormRow label="Check-in Time">
                      <Select
                        label="Check-in Time"
                        labelHidden
                        options={checkInTimeOptions}
                        value={checkInTime}
                        onChange={setCheckInTime}
                      />
                    </FormRow>

                    <FormRow label="Check-out Time">
                      <Select
                        label="Check-out Time"
                        labelHidden
                        options={checkOutTimeOptions}
                        value={checkOutTime}
                        onChange={setCheckOutTime}
                      />
                    </FormRow>

                    <FormRow label="Minimum Stay">
                      <Select
                        label="Minimum Stay"
                        labelHidden
                        options={minStayOptions}
                        value={minimumStay}
                        onChange={setMinimumStay}
                      />
                    </FormRow>

                    <FormRow label="Maximum Stay">
                      <Select
                        label="Maximum Stay"
                        labelHidden
                        options={maxStayOptions}
                        value={maximumStay}
                        onChange={setMaximumStay}
                      />
                    </FormRow>

                    <FormRow label="Max Weekend Stay">
                      <Select
                        label="Max Weekend Stay"
                        labelHidden
                        options={maxWeekendStayOptions}
                        value={maximumWeekendStay}
                        onChange={setMaximumWeekendStay}
                      />
                    </FormRow>

                    <FormRow label="Collect Balance At">
                      <Select
                        label="Collect Balance At"
                        labelHidden
                        options={collectBalanceAtOptions}
                        value={collectBalanceAt}
                        onChange={setCollectBalanceAt}
                      />
                    </FormRow>

                    <FormRow label="% At Reservation">
                      <Select
                        label="% At Reservation"
                        labelHidden
                        options={percentAtReservationOptions}
                        value={percentAtReservation}
                        onChange={setPercentAtReservation}
                      />
                    </FormRow>
                  </BlockStack>
                </BlockStack>
              </Card>

              {/* ========== DESCRIPTION CARD ========== */}
              <Card>
                <BlockStack gap="400">
                  <Text variant="headingMd" as="h2">Description</Text>

                  <BlockStack gap="300">
                    <TextField
                      label="Public Name"
                      value={publicName}
                      onChange={setPublicName}
                      autoComplete="off"
                      placeholder="Enter public listing name"
                    />

                    <TextField
                      label="Short Description"
                      value={shortDescription}
                      onChange={setShortDescription}
                      autoComplete="off"
                      multiline={3}
                      placeholder="Brief description of the property"
                    />

                    <TextField
                      label="Long Description"
                      value={longDescription}
                      onChange={setLongDescription}
                      autoComplete="off"
                      multiline={6}
                      placeholder="Detailed description of the property"
                    />

                    <TextField
                      label="Notes"
                      value={notes}
                      onChange={setNotes}
                      autoComplete="off"
                      multiline={3}
                      placeholder="Internal notes"
                    />

                    <TextField
                      label="Guest Interaction"
                      value={interaction}
                      onChange={setInteraction}
                      autoComplete="off"
                      multiline={3}
                      placeholder="How guests can interact with host"
                    />

                    <TextField
                      label="Neighbourhood"
                      value={neighbourhood}
                      onChange={setNeighbourhood}
                      autoComplete="off"
                      multiline={3}
                      placeholder="Describe the neighbourhood"
                    />

                    <TextField
                      label="Access"
                      value={access}
                      onChange={setAccess}
                      autoComplete="off"
                      multiline={3}
                      placeholder="Guest access details"
                    />

                    <TextField
                      label="Space"
                      value={space}
                      onChange={setSpace}
                      autoComplete="off"
                      multiline={3}
                      placeholder="Describe the space"
                    />

                    <TextField
                      label="Transit"
                      value={transit}
                      onChange={setTransit}
                      autoComplete="off"
                      multiline={3}
                      placeholder="Public transit options nearby"
                    />

                    <TextField
                      label="House Manual"
                      value={houseManual}
                      onChange={setHouseManual}
                      autoComplete="off"
                      multiline={4}
                      placeholder="Instructions for guests"
                    />
                  </BlockStack>
                </BlockStack>
              </Card>

              {/* ========== PHOTOS CARD ========== */}
              <Card>
                <BlockStack gap="400">
                  <Text variant="headingMd" as="h2">Photos</Text>

                  {photos.length > 0 && (
                    <BlockStack gap="300">
                      {photos.map((photo, index) => (
                        <Card key={index}>
                          <LegacyStack alignment="center">
                            <Thumbnail
                              source={photo.url}
                              alt={photo.name || `Photo ${index + 1}`}
                              size="small"
                            />
                            <LegacyStack.Item fill>
                              <Text variant="bodyMd" as="p">{photo.name || `Photo ${index + 1}`}</Text>
                              <Text variant="bodySm" as="p" tone="subdued">
                                {photo.size || 'Uploaded'}
                              </Text>
                            </LegacyStack.Item>
                            <Button
                              variant="plain"
                              tone="critical"
                              onClick={() => setPhotos(photos.filter((_, i) => i !== index))}
                            >
                              Remove
                            </Button>
                          </LegacyStack>
                        </Card>
                      ))}
                    </BlockStack>
                  )}

                  <DropZone
                    accept="image/*"
                    type="image"
                    onDrop={handlePhotosDrop}
                    allowMultiple
                  >
                    <BlockStack gap="200" inlineAlign="center">
                      <InlineStack gap="200" align="center">
                        <Button onClick={() => {}}>Upload images</Button>
                      </InlineStack>
                      <Text variant="bodySm" as="p" tone="subdued">
                        Accepts JPG, PNG. Max 2MB per image
                      </Text>
                    </BlockStack>
                  </DropZone>
                </BlockStack>
              </Card>

              {/* ========== AMENITIES CARD ========== */}
              <Card>
                <BlockStack gap="400">
                  <Text variant="headingMd" as="h2">Amenities</Text>

                  <BlockStack gap="400">
                    <Text variant="headingSm" as="h3">Popular</Text>
                    <Box>
                      <div className="amenities-list">
                        {amenitiesPopularOptions.map((amenity) => (
                          <div key={amenity.value} className="amenity-item">
                            <div className="amenity-content">
                              <Checkbox
                                label={amenity.label}
                                checked={amenitiesPopular.includes(amenity.value)}
                                onChange={() => toggleAmenity('popular', amenity.value)}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </Box>

                    <Divider />

                    <Text variant="headingSm" as="h3">Indoor</Text>
                    <Box>
                      <div className="amenities-list">
                        {amenitiesIndoorOptions.map((amenity) => (
                          <div key={amenity.value} className="amenity-item">
                            <div className="amenity-content">
                              <Checkbox
                                label={amenity.label}
                                checked={amenitiesIndoor.includes(amenity.value)}
                                onChange={() => toggleAmenity('indoor', amenity.value)}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </Box>

                    <Divider />

                    <Text variant="headingSm" as="h3">Outdoor</Text>
                    <Box>
                      <div className="amenities-list">
                        {amenitiesOutdoorOptions.map((amenity) => (
                          <div key={amenity.value} className="amenity-item">
                            <div className="amenity-content">
                              <Checkbox
                                label={amenity.label}
                                checked={amenitiesOutdoor.includes(amenity.value)}
                                onChange={() => toggleAmenity('outdoor', amenity.value)}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </Box>
                  </BlockStack>
                </BlockStack>
              </Card>

              {/* ========== PRICING & FINANCIALS CARD ========== */}
              <Card>
                <BlockStack gap="400">
                  <Text variant="headingMd" as="h2">Pricing & financials</Text>

                  <BlockStack gap="300">
                    <FormRow label="Property Usage">
                      <Select
                        label="Property Usage"
                        labelHidden
                        options={propertyUsageOptions}
                        value={propertyUsage}
                        onChange={setPropertyUsage}
                      />
                    </FormRow>

                    <FormRow label="Currency">
                      <Select
                        label="Currency"
                        labelHidden
                        options={currencyOptions}
                        value={currency}
                        onChange={setCurrency}
                      />
                    </FormRow>

                    <FormRow label="Commission Structure">
                      <Select
                        label="Commission Structure"
                        labelHidden
                        options={commissionStructureOptions}
                        value={commissionStructure}
                        onChange={setCommissionStructure}
                      />
                    </FormRow>

                    {commissionStructure && (
                      <FormRow label={commissionStructure === 'percentage' ? 'Commission %' : 'Commission Amount'}>
                        <TextField
                          label="Commission"
                          labelHidden
                          type="number"
                          value={commissionAmount}
                          onChange={setCommissionAmount}
                          autoComplete="off"
                          placeholder={commissionStructure === 'percentage' ? 'Enter percentage' : 'Enter amount'}
                          suffix={commissionStructure === 'percentage' ? '%' : currency}
                        />
                      </FormRow>
                    )}

                    {/* For Sale Fields */}
                    {propertyUsage === 'for_sale' && (
                      <>
                        <Divider />
                        <Text variant="headingSm" as="h3">Sale Details</Text>

                        <FormRow label="Selling Price">
                          <TextField
                            label="Selling Price"
                            labelHidden
                            type="number"
                            value={sellingPrice}
                            onChange={setSellingPrice}
                            autoComplete="off"
                            placeholder="Enter selling price"
                            prefix={currency}
                          />
                        </FormRow>

                        <FormRow label="Price Per Sqft">
                          <TextField
                            label="Price Per Sqft"
                            labelHidden
                            type="number"
                            value={pricePerSqft}
                            onChange={setPricePerSqft}
                            autoComplete="off"
                            placeholder="Enter price per sqft"
                            prefix={currency}
                            suffix="/sqft"
                          />
                        </FormRow>

                        <FormRow label="Service Charges">
                          <TextField
                            label="Service Charges"
                            labelHidden
                            type="number"
                            value={serviceChargesSale}
                            onChange={setServiceChargesSale}
                            autoComplete="off"
                            placeholder="Enter service charges"
                            prefix={currency}
                          />
                        </FormRow>

                        <FormRow label="DLD/Registration Fee">
                          <TextField
                            label="DLD/Registration Fee"
                            labelHidden
                            type="number"
                            value={dldRegistrationFee}
                            onChange={setDldRegistrationFee}
                            autoComplete="off"
                            placeholder="Enter DLD fee"
                            prefix={currency}
                          />
                        </FormRow>
                      </>
                    )}

                    {/* For Monthly Rent Fields */}
                    {propertyUsage === 'for_monthly_rent' && (
                      <>
                        <Divider />
                        <Text variant="headingSm" as="h3">Monthly Rent Details</Text>

                        <FormRow label="Rental Amount">
                          <TextField
                            label="Rental Amount"
                            labelHidden
                            type="number"
                            value={rentalAmount}
                            onChange={setRentalAmount}
                            autoComplete="off"
                            placeholder="Enter rental amount"
                            prefix={currency}
                          />
                        </FormRow>

                        <FormRow label="Currently Rented">
                          <Select
                            label="Currently Rented"
                            labelHidden
                            options={yesNoOptions}
                            value={currentlyRented}
                            onChange={setCurrentlyRented}
                          />
                        </FormRow>

                        <FormRow label="Deposit Required">
                          <TextField
                            label="Deposit Required"
                            labelHidden
                            type="number"
                            value={depositRequired}
                            onChange={setDepositRequired}
                            autoComplete="off"
                            placeholder="Enter deposit amount"
                            prefix={currency}
                          />
                        </FormRow>

                        <FormRow label="Service Charges">
                          <TextField
                            label="Service Charges"
                            labelHidden
                            type="number"
                            value={serviceChargesRent}
                            onChange={setServiceChargesRent}
                            autoComplete="off"
                            placeholder="Enter service charges"
                            prefix={currency}
                          />
                        </FormRow>
                      </>
                    )}

                    {/* For Short Term Rent Fields */}
                    {propertyUsage === 'for_short_term_rent' && (
                      <>
                        <Divider />
                        <Text variant="headingSm" as="h3">Short Term Rent Pricing</Text>

                        <FormRow label="Nightly Base Price">
                          <TextField
                            label="Nightly Base Price"
                            labelHidden
                            type="number"
                            value={nightlyBasePrice}
                            onChange={setNightlyBasePrice}
                            autoComplete="off"
                            placeholder="Enter nightly price"
                            prefix={currency}
                          />
                        </FormRow>

                        <FormRow label="Security Deposit">
                          <TextField
                            label="Security Deposit"
                            labelHidden
                            type="number"
                            value={securityDeposit}
                            onChange={setSecurityDeposit}
                            autoComplete="off"
                            placeholder="Enter security deposit"
                            prefix={currency}
                          />
                        </FormRow>

                        <FormRow label="Cleaning Fee">
                          <TextField
                            label="Cleaning Fee"
                            labelHidden
                            type="number"
                            value={cleaningFee}
                            onChange={setCleaningFee}
                            autoComplete="off"
                            placeholder="Enter cleaning fee"
                            prefix={currency}
                          />
                        </FormRow>

                        <FormRow label="Cleaning Fee Tax %">
                          <TextField
                            label="Cleaning Fee Tax"
                            labelHidden
                            type="number"
                            value={cleaningFeeTax}
                            onChange={setCleaningFeeTax}
                            autoComplete="off"
                            placeholder="Enter tax percentage"
                            suffix="%"
                          />
                        </FormRow>

                        <FormRow label="Tax Rate %">
                          <TextField
                            label="Tax Rate"
                            labelHidden
                            type="number"
                            value={taxRate}
                            onChange={setTaxRate}
                            autoComplete="off"
                            placeholder="Enter tax rate"
                            suffix="%"
                          />
                        </FormRow>

                        <FormRow label="Weekend Rate Adjustment %">
                          <TextField
                            label="Weekend Rate Adjustment"
                            labelHidden
                            type="number"
                            value={weekendRateAdjustment}
                            onChange={setWeekendRateAdjustment}
                            autoComplete="off"
                            placeholder="Enter adjustment percentage"
                            suffix="%"
                          />
                        </FormRow>
                      </>
                    )}
                  </BlockStack>
                </BlockStack>
              </Card>

              {/* ========== POLICIES CARD ========== */}
              <Card>
                <BlockStack gap="400">
                  <InlineStack align="space-between" blockAlign="center">
                    <Text variant="headingMd" as="h2">Policies</Text>
                    <Button icon={PlusIcon} onClick={handleAddPolicy}>
                      Add Policy
                    </Button>
                  </InlineStack>

                  {policies.length === 0 ? (
                    <Banner tone="info">
                      <p>No policies defined yet. Click &quot;Add Policy&quot; to create one.</p>
                    </Banner>
                  ) : (
                    <BlockStack gap="300">
                      {policies.map((policy, index) => (
                        <Card key={index}>
                          <BlockStack gap="200">
                            <TextField
                              label="Policy Name"
                              value={policy.name}
                              onChange={(value) => handlePolicyChange(index, 'name', value)}
                              autoComplete="off"
                              placeholder="e.g., Cancellation Policy"
                            />
                            <TextField
                              label="Description"
                              value={policy.description}
                              onChange={(value) => handlePolicyChange(index, 'description', value)}
                              autoComplete="off"
                              multiline={3}
                              placeholder="Policy details..."
                            />
                            <Button
                              icon={DeleteIcon}
                              tone="critical"
                              onClick={() => handleRemovePolicy(index)}
                            >
                              Remove Policy
                            </Button>
                          </BlockStack>
                        </Card>
                      ))}
                    </BlockStack>
                  )}
                </BlockStack>
              </Card>

              {/* ========== AGREEMENT & DOCUMENTS CARD ========== */}
              <Card>
                <BlockStack gap="400">
                  <Text variant="headingMd" as="h2">Agreement & documents</Text>

                  <BlockStack gap="300">
                    <FormRow label="Agreement Type">
                      <Select
                        label="Agreement Type"
                        labelHidden
                        options={agreementTypeOptions}
                        value={agreementType}
                        onChange={setAgreementType}
                      />
                    </FormRow>

                    {agreementType && (
                      <>
                        <Divider />

                        <Text variant="headingSm" as="h3">
                          {agreementType === 'owned' || agreementType === 'leased'
                            ? 'Sale/Purchase Agreement'
                            : 'Tenancy Agreement'}
                        </Text>

                        {tenancyAgreementFile && (
                          <Card>
                            <LegacyStack alignment="center">
                              {tenancyAgreementFile.type?.startsWith('image/') && tenancyAgreementFile.url ? (
                                <Thumbnail source={tenancyAgreementFile.url} alt={tenancyAgreementFile.name} size="small" />
                              ) : (
                                <Icon source={NoteIcon} tone="base" />
                              )}
                              <LegacyStack.Item fill>
                                <Text variant="bodyMd" as="p">{tenancyAgreementFile.name || 'Document'}</Text>
                                <Text variant="bodySm" as="p" tone="subdued">
                                  {tenancyAgreementFile.size ? `${(tenancyAgreementFile.size / 1024).toFixed(1)} KB` : 'Uploaded'}
                                </Text>
                              </LegacyStack.Item>
                              <Button variant="plain" tone="critical" onClick={() => setTenancyAgreementFile(null)}>
                                Remove
                              </Button>
                            </LegacyStack>
                          </Card>
                        )}

                        <DropZone
                          onDrop={(files) => {
                            const file = files[0];
                            if (file) {
                              const fileWithUrl = {
                                ...file,
                                name: file.name,
                                size: file.size,
                                type: file.type,
                                url: file.type?.startsWith('image/') ? URL.createObjectURL(file) : null,
                                file: file,
                              };
                              setTenancyAgreementFile(fileWithUrl);
                            }
                          }}
                          accept=".pdf,.doc,.docx,.jpg,.png"
                          allowMultiple={false}
                        >
                          <BlockStack gap="200" inlineAlign="center">
                            <InlineStack gap="200" align="center">
                              <Button onClick={() => {}}>Upload document</Button>
                            </InlineStack>
                            <Text variant="bodySm" as="p" tone="subdued">
                              Accepts PDF, DOC, DOCX, JPG, PNG
                            </Text>
                          </BlockStack>
                        </DropZone>

                        <FormRow label={agreementType === 'owned' || agreementType === 'leased' ? 'Purchase Date' : 'Tenancy Agreement Expiry'}>
                          <TextField
                            label="Date"
                            labelHidden
                            type="date"
                            value={tenancyAgreementExpiry}
                            onChange={setTenancyAgreementExpiry}
                            autoComplete="off"
                          />
                        </FormRow>

                        <Divider />
                        <Text variant="headingSm" as="h3">Ejari</Text>

                        {ejariFile && (
                          <Card>
                            <LegacyStack alignment="center">
                              {ejariFile.type?.startsWith('image/') && ejariFile.url ? (
                                <Thumbnail source={ejariFile.url} alt={ejariFile.name} size="small" />
                              ) : (
                                <Icon source={NoteIcon} tone="base" />
                              )}
                              <LegacyStack.Item fill>
                                <Text variant="bodyMd" as="p">{ejariFile.name || 'Document'}</Text>
                                <Text variant="bodySm" as="p" tone="subdued">
                                  {ejariFile.size ? `${(ejariFile.size / 1024).toFixed(1)} KB` : 'Uploaded'}
                                </Text>
                              </LegacyStack.Item>
                              <Button variant="plain" tone="critical" onClick={() => setEjariFile(null)}>
                                Remove
                              </Button>
                            </LegacyStack>
                          </Card>
                        )}

                        <DropZone
                          onDrop={(files) => {
                            const file = files[0];
                            if (file) {
                              const fileWithUrl = {
                                ...file,
                                name: file.name,
                                size: file.size,
                                type: file.type,
                                url: file.type?.startsWith('image/') ? URL.createObjectURL(file) : null,
                                file: file,
                              };
                              setEjariFile(fileWithUrl);
                            }
                          }}
                          accept=".pdf,.doc,.docx,.jpg,.png"
                          allowMultiple={false}
                        >
                          <BlockStack gap="200" inlineAlign="center">
                            <InlineStack gap="200" align="center">
                              <Button onClick={() => {}}>Upload document</Button>
                            </InlineStack>
                            <Text variant="bodySm" as="p" tone="subdued">
                              Accepts PDF, DOC, DOCX, JPG, PNG
                            </Text>
                          </BlockStack>
                        </DropZone>

                        <FormRow label="Ejari Expiry">
                          <TextField
                            label="Ejari Expiry"
                            labelHidden
                            type="date"
                            value={ejariExpiry}
                            onChange={setEjariExpiry}
                            autoComplete="off"
                          />
                        </FormRow>

                        <Divider />
                        <Text variant="headingSm" as="h3">DCTM Letter</Text>

                        {dctmLetterFile && (
                          <Card>
                            <LegacyStack alignment="center">
                              {dctmLetterFile.type?.startsWith('image/') && dctmLetterFile.url ? (
                                <Thumbnail source={dctmLetterFile.url} alt={dctmLetterFile.name} size="small" />
                              ) : (
                                <Icon source={NoteIcon} tone="base" />
                              )}
                              <LegacyStack.Item fill>
                                <Text variant="bodyMd" as="p">{dctmLetterFile.name || 'Document'}</Text>
                                <Text variant="bodySm" as="p" tone="subdued">
                                  {dctmLetterFile.size ? `${(dctmLetterFile.size / 1024).toFixed(1)} KB` : 'Uploaded'}
                                </Text>
                              </LegacyStack.Item>
                              <Button variant="plain" tone="critical" onClick={() => setDctmLetterFile(null)}>
                                Remove
                              </Button>
                            </LegacyStack>
                          </Card>
                        )}

                        <DropZone
                          onDrop={(files) => {
                            const file = files[0];
                            if (file) {
                              const fileWithUrl = {
                                ...file,
                                name: file.name,
                                size: file.size,
                                type: file.type,
                                url: file.type?.startsWith('image/') ? URL.createObjectURL(file) : null,
                                file: file,
                              };
                              setDctmLetterFile(fileWithUrl);
                            }
                          }}
                          accept=".pdf,.doc,.docx,.jpg,.png"
                          allowMultiple={false}
                        >
                          <BlockStack gap="200" inlineAlign="center">
                            <InlineStack gap="200" align="center">
                              <Button onClick={() => {}}>Upload document</Button>
                            </InlineStack>
                            <Text variant="bodySm" as="p" tone="subdued">
                              Accepts PDF, DOC, DOCX, JPG, PNG
                            </Text>
                          </BlockStack>
                        </DropZone>

                        <FormRow label="DCTM Letter Expiry">
                          <TextField
                            label="DCTM Letter Expiry"
                            labelHidden
                            type="date"
                            value={dctmLetterExpiry}
                            onChange={setDctmLetterExpiry}
                            autoComplete="off"
                          />
                        </FormRow>

                        <Divider />

                        <FormRow label={agreementType === 'owned' || agreementType === 'leased' ? 'Purchase Price' : 'Rental Start Date'}>
                          <TextField
                            label="Date/Price"
                            labelHidden
                            type={agreementType === 'owned' || agreementType === 'leased' ? 'number' : 'date'}
                            value={agreementType === 'owned' || agreementType === 'leased' ? purchasePrice : rentalStartDate}
                            onChange={agreementType === 'owned' || agreementType === 'leased' ? setPurchasePrice : setRentalStartDate}
                            autoComplete="off"
                            placeholder={agreementType === 'owned' || agreementType === 'leased' ? 'Enter purchase price' : ''}
                            prefix={agreementType === 'owned' || agreementType === 'leased' ? currency : undefined}
                          />
                        </FormRow>

                        <FormRow label={agreementType === 'owned' || agreementType === 'leased' ? 'Purchase Date' : 'Rental End Date'}>
                          <TextField
                            label="Date"
                            labelHidden
                            type="date"
                            value={agreementType === 'owned' || agreementType === 'leased' ? purchaseDate : rentalEndDate}
                            onChange={agreementType === 'owned' || agreementType === 'leased' ? setPurchaseDate : setRentalEndDate}
                            autoComplete="off"
                          />
                        </FormRow>

                        {(agreementType === 'owned' || agreementType === 'leased') && (
                          <FormRow label="Number of Schedule Payments">
                            <TextField
                              label="Schedule Payments"
                              labelHidden
                              type="number"
                              value={numberOfSchedulePayments}
                              onChange={setNumberOfSchedulePayments}
                              autoComplete="off"
                              placeholder="Enter number of payments"
                            />
                          </FormRow>
                        )}
                      </>
                    )}
                  </BlockStack>
                </BlockStack>
              </Card>

              {/* ========== BOOKING DETAILS CARD (For Leased) ========== */}
              {agreementType === 'leased' && (
                <Card>
                  <BlockStack gap="400">
                    <Text variant="headingMd" as="h2">Booking Details</Text>

                    <BlockStack gap="300">
                      <InlineStack gap="300" wrap={false}>
                        <Box width="33%">
                          <TextField
                            label="Percentage"
                            type="number"
                            value={bookingDetailsPercentage}
                            onChange={setBookingDetailsPercentage}
                            autoComplete="off"
                            placeholder="Enter percentage"
                            suffix="%"
                          />
                        </Box>
                        <Box width="33%">
                          <TextField
                            label="Price"
                            type="number"
                            value={bookingDetailsPrice}
                            onChange={setBookingDetailsPrice}
                            autoComplete="off"
                            placeholder="Enter price"
                            prefix={currency}
                          />
                        </Box>
                        <Box width="33%">
                          <TextField
                            label="Paid Date"
                            type="date"
                            value={bookingDetailsPaidDate}
                            onChange={setBookingDetailsPaidDate}
                            autoComplete="off"
                          />
                        </Box>
                      </InlineStack>

                      <FormRow label="Payment Status">
                        <Select
                          label="Payment Status"
                          labelHidden
                          options={paymentStatusOptions}
                          value={bookingDetailsStatus}
                          onChange={setBookingDetailsStatus}
                        />
                      </FormRow>

                      <Text variant="bodySm" as="span">Payment Proof</Text>
                      {bookingDetailsProof && (
                        <Card>
                          <LegacyStack alignment="center">
                            {bookingDetailsProof.type?.startsWith('image/') && bookingDetailsProof.url ? (
                              <Thumbnail source={bookingDetailsProof.url} alt={bookingDetailsProof.name} size="small" />
                            ) : (
                              <Icon source={NoteIcon} tone="base" />
                            )}
                            <LegacyStack.Item fill>
                              <Text variant="bodyMd" as="p">{bookingDetailsProof.name || 'Document'}</Text>
                              <Text variant="bodySm" as="p" tone="subdued">
                                {bookingDetailsProof.size ? `${(bookingDetailsProof.size / 1024).toFixed(1)} KB` : 'Uploaded'}
                              </Text>
                            </LegacyStack.Item>
                            <Button variant="plain" tone="critical" onClick={() => setBookingDetailsProof(null)}>
                              Remove
                            </Button>
                          </LegacyStack>
                        </Card>
                      )}
                      <DropZone
                        onDrop={(files) => {
                          const file = files[0];
                          if (file) {
                            const fileWithUrl = {
                              name: file.name,
                              size: file.size,
                              type: file.type,
                              url: file.type?.startsWith('image/') ? URL.createObjectURL(file) : null,
                              file: file,
                            };
                            setBookingDetailsProof(fileWithUrl);
                          }
                        }}
                        accept=".pdf,.doc,.docx,.jpg,.png"
                        allowMultiple={false}
                      >
                        <BlockStack gap="200" inlineAlign="center">
                          <InlineStack gap="200" align="center">
                            <Button onClick={() => {}}>Upload document</Button>
                          </InlineStack>
                          <Text variant="bodySm" as="p" tone="subdued">
                            Accepts PDF, DOC, DOCX, JPG, PNG
                          </Text>
                        </BlockStack>
                      </DropZone>
                    </BlockStack>
                  </BlockStack>
                </Card>
              )}

              {/* ========== DOWN PAYMENT CARD (For Leased) ========== */}
              {agreementType === 'leased' && (
                <Card>
                  <BlockStack gap="400">
                    <Text variant="headingMd" as="h2">Down Payment</Text>

                    <BlockStack gap="300">
                      <InlineStack gap="300" wrap={false}>
                        <Box width="33%">
                          <TextField
                            label="Percentage"
                            type="number"
                            value={downPaymentPercentage}
                            onChange={setDownPaymentPercentage}
                            autoComplete="off"
                            placeholder="Enter percentage"
                            suffix="%"
                          />
                        </Box>
                        <Box width="33%">
                          <TextField
                            label="Price"
                            type="number"
                            value={downPaymentPrice}
                            onChange={setDownPaymentPrice}
                            autoComplete="off"
                            placeholder="Enter price"
                            prefix={currency}
                          />
                        </Box>
                        <Box width="33%">
                          <TextField
                            label="Paid Date"
                            type="date"
                            value={downPaymentPaidDate}
                            onChange={setDownPaymentPaidDate}
                            autoComplete="off"
                          />
                        </Box>
                      </InlineStack>

                      <FormRow label="Payment Status">
                        <Select
                          label="Payment Status"
                          labelHidden
                          options={paymentStatusOptions}
                          value={downPaymentStatus}
                          onChange={setDownPaymentStatus}
                        />
                      </FormRow>

                      <Text variant="bodySm" as="span">Payment Proof</Text>
                      {downPaymentProof && (
                        <Card>
                          <LegacyStack alignment="center">
                            {downPaymentProof.type?.startsWith('image/') && downPaymentProof.url ? (
                              <Thumbnail source={downPaymentProof.url} alt={downPaymentProof.name} size="small" />
                            ) : (
                              <Icon source={NoteIcon} tone="base" />
                            )}
                            <LegacyStack.Item fill>
                              <Text variant="bodyMd" as="p">{downPaymentProof.name || 'Document'}</Text>
                              <Text variant="bodySm" as="p" tone="subdued">
                                {downPaymentProof.size ? `${(downPaymentProof.size / 1024).toFixed(1)} KB` : 'Uploaded'}
                              </Text>
                            </LegacyStack.Item>
                            <Button variant="plain" tone="critical" onClick={() => setDownPaymentProof(null)}>
                              Remove
                            </Button>
                          </LegacyStack>
                        </Card>
                      )}
                      <DropZone
                        onDrop={(files) => {
                          const file = files[0];
                          if (file) {
                            const fileWithUrl = {
                              name: file.name,
                              size: file.size,
                              type: file.type,
                              url: file.type?.startsWith('image/') ? URL.createObjectURL(file) : null,
                              file: file,
                            };
                            setDownPaymentProof(fileWithUrl);
                          }
                        }}
                        accept=".pdf,.doc,.docx,.jpg,.png"
                        allowMultiple={false}
                      >
                        <BlockStack gap="200" inlineAlign="center">
                          <InlineStack gap="200" align="center">
                            <Button onClick={() => {}}>Upload document</Button>
                          </InlineStack>
                          <Text variant="bodySm" as="p" tone="subdued">
                            Accepts PDF, DOC, DOCX, JPG, PNG
                          </Text>
                        </BlockStack>
                      </DropZone>
                    </BlockStack>
                  </BlockStack>
                </Card>
              )}

              {/* ========== INSTALLMENTS CARDS (For Leased) ========== */}
              {agreementType === 'leased' && installments.map((installment, index) => (
                <Card key={index}>
                  <BlockStack gap="400">
                    <InlineStack align="space-between" blockAlign="center">
                      <Text variant="headingMd" as="h2">Installment {index + 1}</Text>
                      {installments.length > 1 && (
                        <Button
                          icon={DeleteIcon}
                          tone="critical"
                          variant="plain"
                          onClick={() => {
                            const newInstallments = installments.filter((_, i) => i !== index);
                            setInstallments(newInstallments);
                          }}
                        />
                      )}
                    </InlineStack>

                    <BlockStack gap="300">
                      <InlineStack gap="300" wrap={false}>
                        <Box width="33%">
                          <TextField
                            label="Percentage"
                            type="number"
                            value={installment.percentage}
                            onChange={(value) => {
                              const newInstallments = [...installments];
                              newInstallments[index].percentage = value;
                              setInstallments(newInstallments);
                            }}
                            autoComplete="off"
                            placeholder="Enter percentage"
                            suffix="%"
                          />
                        </Box>
                        <Box width="33%">
                          <TextField
                            label="Price"
                            type="number"
                            value={installment.price}
                            onChange={(value) => {
                              const newInstallments = [...installments];
                              newInstallments[index].price = value;
                              setInstallments(newInstallments);
                            }}
                            autoComplete="off"
                            placeholder="Enter price"
                            prefix={currency}
                          />
                        </Box>
                        <Box width="33%">
                          <TextField
                            label="Paid Date"
                            type="date"
                            value={installment.paidDate}
                            onChange={(value) => {
                              const newInstallments = [...installments];
                              newInstallments[index].paidDate = value;
                              setInstallments(newInstallments);
                            }}
                            autoComplete="off"
                          />
                        </Box>
                      </InlineStack>

                      <FormRow label="Payment Status">
                        <Select
                          label="Payment Status"
                          labelHidden
                          options={paymentStatusOptions}
                          value={installment.status}
                          onChange={(value) => {
                            const newInstallments = [...installments];
                            newInstallments[index].status = value;
                            setInstallments(newInstallments);
                          }}
                        />
                      </FormRow>

                      <Text variant="bodySm" as="span">Payment Proof</Text>
                      {installment.proof && (
                        <Card>
                          <LegacyStack alignment="center">
                            {installment.proof.type?.startsWith('image/') && installment.proof.url ? (
                              <Thumbnail source={installment.proof.url} alt={installment.proof.name} size="small" />
                            ) : (
                              <Icon source={NoteIcon} tone="base" />
                            )}
                            <LegacyStack.Item fill>
                              <Text variant="bodyMd" as="p">{installment.proof.name || 'Document'}</Text>
                              <Text variant="bodySm" as="p" tone="subdued">
                                {installment.proof.size ? `${(installment.proof.size / 1024).toFixed(1)} KB` : 'Uploaded'}
                              </Text>
                            </LegacyStack.Item>
                            <Button
                              variant="plain"
                              tone="critical"
                              onClick={() => {
                                const newInstallments = [...installments];
                                newInstallments[index].proof = null;
                                setInstallments(newInstallments);
                              }}
                            >
                              Remove
                            </Button>
                          </LegacyStack>
                        </Card>
                      )}
                      <DropZone
                        onDrop={(files) => {
                          const file = files[0];
                          if (file) {
                            const fileWithUrl = {
                              name: file.name,
                              size: file.size,
                              type: file.type,
                              url: file.type?.startsWith('image/') ? URL.createObjectURL(file) : null,
                              file: file,
                            };
                            const newInstallments = [...installments];
                            newInstallments[index].proof = fileWithUrl;
                            setInstallments(newInstallments);
                          }
                        }}
                        accept=".pdf,.doc,.docx,.jpg,.png"
                        allowMultiple={false}
                      >
                        <BlockStack gap="200" inlineAlign="center">
                          <InlineStack gap="200" align="center">
                            <Button onClick={() => {}}>Upload document</Button>
                          </InlineStack>
                          <Text variant="bodySm" as="p" tone="subdued">
                            Accepts PDF, DOC, DOCX, JPG, PNG
                          </Text>
                        </BlockStack>
                      </DropZone>
                    </BlockStack>
                  </BlockStack>
                </Card>
              ))}

              {/* Add Installment Button */}
              {agreementType === 'leased' && (
                <Button
                  icon={PlusIcon}
                  onClick={() => setInstallments([...installments, { percentage: '', price: '', paidDate: '', status: '', proof: null }])}
                >
                  Add Installment
                </Button>
              )}

              {/* ========== DLD CARD (For Leased) ========== */}
              {agreementType === 'leased' && (
                <Card>
                  <BlockStack gap="400">
                    <Text variant="headingMd" as="h2">DLD</Text>

                    <BlockStack gap="300">
                      <FormRow label="Type">
                        <Select
                          label="Type"
                          labelHidden
                          options={chargeTypeOptions}
                          value={dldType}
                          onChange={setDldType}
                        />
                      </FormRow>

                      <InlineStack gap="300" wrap={false}>
                        <Box width="33%">
                          <TextField
                            label="Percentage"
                            type="number"
                            value={dldPercentage}
                            onChange={setDldPercentage}
                            autoComplete="off"
                            placeholder="Enter percentage"
                            suffix="%"
                          />
                        </Box>
                        <Box width="33%">
                          <TextField
                            label="Price"
                            type="number"
                            value={dldPrice}
                            onChange={setDldPrice}
                            autoComplete="off"
                            placeholder="Enter price"
                            prefix={currency}
                          />
                        </Box>
                        <Box width="33%">
                          <TextField
                            label="Paid Date"
                            type="date"
                            value={dldPaidDate}
                            onChange={setDldPaidDate}
                            autoComplete="off"
                          />
                        </Box>
                      </InlineStack>

                      <FormRow label="Payment Status">
                        <Select
                          label="Payment Status"
                          labelHidden
                          options={paymentStatusOptions}
                          value={dldStatus}
                          onChange={setDldStatus}
                        />
                      </FormRow>

                      <Text variant="bodySm" as="span">Payment Proof</Text>
                      {dldProof && (
                        <Card>
                          <LegacyStack alignment="center">
                            {dldProof.type?.startsWith('image/') && dldProof.url ? (
                              <Thumbnail source={dldProof.url} alt={dldProof.name} size="small" />
                            ) : (
                              <Icon source={NoteIcon} tone="base" />
                            )}
                            <LegacyStack.Item fill>
                              <Text variant="bodyMd" as="p">{dldProof.name || 'Document'}</Text>
                              <Text variant="bodySm" as="p" tone="subdued">
                                {dldProof.size ? `${(dldProof.size / 1024).toFixed(1)} KB` : 'Uploaded'}
                              </Text>
                            </LegacyStack.Item>
                            <Button variant="plain" tone="critical" onClick={() => setDldProof(null)}>
                              Remove
                            </Button>
                          </LegacyStack>
                        </Card>
                      )}
                      <DropZone
                        onDrop={(files) => {
                          const file = files[0];
                          if (file) {
                            const fileWithUrl = {
                              name: file.name,
                              size: file.size,
                              type: file.type,
                              url: file.type?.startsWith('image/') ? URL.createObjectURL(file) : null,
                              file: file,
                            };
                            setDldProof(fileWithUrl);
                          }
                        }}
                        accept=".pdf,.doc,.docx,.jpg,.png"
                        allowMultiple={false}
                      >
                        <BlockStack gap="200" inlineAlign="center">
                          <InlineStack gap="200" align="center">
                            <Button onClick={() => {}}>Upload document</Button>
                          </InlineStack>
                          <Text variant="bodySm" as="p" tone="subdued">
                            Accepts PDF, DOC, DOCX, JPG, PNG
                          </Text>
                        </BlockStack>
                      </DropZone>
                    </BlockStack>
                  </BlockStack>
                </Card>
              )}

              {/* ========== OQOOD + ADMIN CHARGES CARD (For Leased) ========== */}
              {agreementType === 'leased' && (
                <Card>
                  <BlockStack gap="400">
                    <Text variant="headingMd" as="h2">Oqood + Admin Charges</Text>

                    <BlockStack gap="300">
                      <FormRow label="Type">
                        <Select
                          label="Type"
                          labelHidden
                          options={chargeTypeOptions}
                          value={oqoodType}
                          onChange={setOqoodType}
                        />
                      </FormRow>

                      <InlineStack gap="300" wrap={false}>
                        <Box width="33%">
                          <TextField
                            label="Percentage"
                            type="number"
                            value={oqoodPercentage}
                            onChange={setOqoodPercentage}
                            autoComplete="off"
                            placeholder="Enter percentage"
                            suffix="%"
                          />
                        </Box>
                        <Box width="33%">
                          <TextField
                            label="Price"
                            type="number"
                            value={oqoodPrice}
                            onChange={setOqoodPrice}
                            autoComplete="off"
                            placeholder="Enter price"
                            prefix={currency}
                          />
                        </Box>
                        <Box width="33%">
                          <TextField
                            label="Paid Date"
                            type="date"
                            value={oqoodPaidDate}
                            onChange={setOqoodPaidDate}
                            autoComplete="off"
                          />
                        </Box>
                      </InlineStack>

                      <FormRow label="Payment Status">
                        <Select
                          label="Payment Status"
                          labelHidden
                          options={paymentStatusOptions}
                          value={oqoodStatus}
                          onChange={setOqoodStatus}
                        />
                      </FormRow>

                      <Text variant="bodySm" as="span">Payment Proof</Text>
                      {oqoodProof && (
                        <Card>
                          <LegacyStack alignment="center">
                            {oqoodProof.type?.startsWith('image/') && oqoodProof.url ? (
                              <Thumbnail source={oqoodProof.url} alt={oqoodProof.name} size="small" />
                            ) : (
                              <Icon source={NoteIcon} tone="base" />
                            )}
                            <LegacyStack.Item fill>
                              <Text variant="bodyMd" as="p">{oqoodProof.name || 'Document'}</Text>
                              <Text variant="bodySm" as="p" tone="subdued">
                                {oqoodProof.size ? `${(oqoodProof.size / 1024).toFixed(1)} KB` : 'Uploaded'}
                              </Text>
                            </LegacyStack.Item>
                            <Button variant="plain" tone="critical" onClick={() => setOqoodProof(null)}>
                              Remove
                            </Button>
                          </LegacyStack>
                        </Card>
                      )}
                      <DropZone
                        onDrop={(files) => {
                          const file = files[0];
                          if (file) {
                            const fileWithUrl = {
                              name: file.name,
                              size: file.size,
                              type: file.type,
                              url: file.type?.startsWith('image/') ? URL.createObjectURL(file) : null,
                              file: file,
                            };
                            setOqoodProof(fileWithUrl);
                          }
                        }}
                        accept=".pdf,.doc,.docx,.jpg,.png"
                        allowMultiple={false}
                      >
                        <BlockStack gap="200" inlineAlign="center">
                          <InlineStack gap="200" align="center">
                            <Button onClick={() => {}}>Upload document</Button>
                          </InlineStack>
                          <Text variant="bodySm" as="p" tone="subdued">
                            Accepts PDF, DOC, DOCX, JPG, PNG
                          </Text>
                        </BlockStack>
                      </DropZone>
                    </BlockStack>
                  </BlockStack>
                </Card>
              )}

              {/* ========== OTHER CHARGES CARD (For Leased) ========== */}
              {agreementType === 'leased' && (
                <Card>
                  <BlockStack gap="400">
                    <Text variant="headingMd" as="h2">Other Charges</Text>

                    <BlockStack gap="300">
                      <InlineStack gap="300" wrap={false}>
                        <Box width="33%">
                          <TextField
                            label="Percentage"
                            type="number"
                            value={otherChargesPercentage}
                            onChange={setOtherChargesPercentage}
                            autoComplete="off"
                            placeholder="Enter percentage"
                            suffix="%"
                          />
                        </Box>
                        <Box width="33%">
                          <TextField
                            label="Price"
                            type="number"
                            value={otherChargesPrice}
                            onChange={setOtherChargesPrice}
                            autoComplete="off"
                            placeholder="Enter price"
                            prefix={currency}
                          />
                        </Box>
                        <Box width="33%">
                          <TextField
                            label="Paid Date"
                            type="date"
                            value={otherChargesPaidDate}
                            onChange={setOtherChargesPaidDate}
                            autoComplete="off"
                          />
                        </Box>
                      </InlineStack>

                      <FormRow label="Payment Status">
                        <Select
                          label="Payment Status"
                          labelHidden
                          options={paymentStatusOptions}
                          value={otherChargesStatus}
                          onChange={setOtherChargesStatus}
                        />
                      </FormRow>

                      <Text variant="bodySm" as="span">Payment Proof</Text>
                      {otherChargesProof && (
                        <Card>
                          <LegacyStack alignment="center">
                            {otherChargesProof.type?.startsWith('image/') && otherChargesProof.url ? (
                              <Thumbnail source={otherChargesProof.url} alt={otherChargesProof.name} size="small" />
                            ) : (
                              <Icon source={NoteIcon} tone="base" />
                            )}
                            <LegacyStack.Item fill>
                              <Text variant="bodyMd" as="p">{otherChargesProof.name || 'Document'}</Text>
                              <Text variant="bodySm" as="p" tone="subdued">
                                {otherChargesProof.size ? `${(otherChargesProof.size / 1024).toFixed(1)} KB` : 'Uploaded'}
                              </Text>
                            </LegacyStack.Item>
                            <Button variant="plain" tone="critical" onClick={() => setOtherChargesProof(null)}>
                              Remove
                            </Button>
                          </LegacyStack>
                        </Card>
                      )}
                      <DropZone
                        onDrop={(files) => {
                          const file = files[0];
                          if (file) {
                            const fileWithUrl = {
                              name: file.name,
                              size: file.size,
                              type: file.type,
                              url: file.type?.startsWith('image/') ? URL.createObjectURL(file) : null,
                              file: file,
                            };
                            setOtherChargesProof(fileWithUrl);
                          }
                        }}
                        accept=".pdf,.doc,.docx,.jpg,.png"
                        allowMultiple={false}
                      >
                        <BlockStack gap="200" inlineAlign="center">
                          <InlineStack gap="200" align="center">
                            <Button onClick={() => {}}>Upload document</Button>
                          </InlineStack>
                          <Text variant="bodySm" as="p" tone="subdued">
                            Accepts PDF, DOC, DOCX, JPG, PNG
                          </Text>
                        </BlockStack>
                      </DropZone>
                    </BlockStack>
                  </BlockStack>
                </Card>
              )}

              {/* ========== BILL ARRANGEMENT CARD (For all agreement types) ========== */}
              {agreementType && (
                <Card>
                  <BlockStack gap="400">
                    <Text variant="headingMd" as="h2">Bill Arrangement</Text>

                    <BlockStack gap="300">
                      <Box>
                        <div className="amenities-list">
                          <div className="amenity-item">
                            <div className="amenity-content">
                              <Checkbox
                                label="DEWA"
                                checked={billArrangements.dewa}
                                onChange={(checked) => setBillArrangements({ ...billArrangements, dewa: checked })}
                              />
                            </div>
                          </div>
                          <div className="amenity-item">
                            <div className="amenity-content">
                              <Checkbox
                                label="Internet"
                                checked={billArrangements.internet}
                                onChange={(checked) => setBillArrangements({ ...billArrangements, internet: checked })}
                              />
                            </div>
                          </div>
                          <div className="amenity-item">
                            <div className="amenity-content">
                              <Checkbox
                                label="Gas"
                                checked={billArrangements.gas}
                                onChange={(checked) => setBillArrangements({ ...billArrangements, gas: checked })}
                              />
                            </div>
                          </div>
                          <div className="amenity-item">
                            <div className="amenity-content">
                              <Checkbox
                                label="Chiller"
                                checked={billArrangements.chiller}
                                onChange={(checked) => setBillArrangements({ ...billArrangements, chiller: checked })}
                              />
                            </div>
                          </div>
                        </div>
                      </Box>

                      {billArrangements.dewa && (
                        <FormRow label="DEWA Number">
                          <TextField
                            label="DEWA Number"
                            labelHidden
                            value={dewaNumber}
                            onChange={setDewaNumber}
                            autoComplete="off"
                            placeholder="Enter DEWA account number"
                          />
                        </FormRow>
                      )}

                      {billArrangements.internet && (
                        <FormRow label="Internet Number">
                          <TextField
                            label="Internet Number"
                            labelHidden
                            value={internetNumber}
                            onChange={setInternetNumber}
                            autoComplete="off"
                            placeholder="Enter Internet account number"
                          />
                        </FormRow>
                      )}

                      {billArrangements.gas && (
                        <FormRow label="Gas Number">
                          <TextField
                            label="Gas Number"
                            labelHidden
                            value={gasNumber}
                            onChange={setGasNumber}
                            autoComplete="off"
                            placeholder="Enter Gas account number"
                          />
                        </FormRow>
                      )}
                    </BlockStack>
                  </BlockStack>
                </Card>
              )}

            </BlockStack>
          </Layout.Section>

          {/* ========== SIDEBAR - Right column ========== */}
          <Layout.Section variant="oneThird">
            <BlockStack gap="400">
              {/* Project card */}
              <Card>
                <BlockStack gap="200">
                  <Text variant="headingMd" as="h2">Project</Text>
                  <Select
                    label="Project"
                    labelHidden
                    options={projectOptions}
                    value={selectedProject}
                    onChange={setSelectedProject}
                  />
                </BlockStack>
              </Card>

              {/* Developer card */}
              <Card>
                <BlockStack gap="200">
                  <Text variant="headingMd" as="h2">Developer</Text>
                  <Select
                    label="Developer"
                    labelHidden
                    options={developerOptions}
                    value={selectedDeveloper}
                    onChange={setSelectedDeveloper}
                  />
                </BlockStack>
              </Card>

              {/* Owner card */}
              <Card>
                <BlockStack gap="200">
                  <Text variant="headingMd" as="h2">Owner</Text>
                  <Select
                    label="Owner"
                    labelHidden
                    options={ownerOptions}
                    value={selectedOwner}
                    onChange={setSelectedOwner}
                  />
                </BlockStack>
              </Card>

              {/* Current Status card */}
              <Card>
                <BlockStack gap="200">
                  <Text variant="headingMd" as="h2">Current status</Text>
                  <Select
                    label="Current Status"
                    labelHidden
                    options={currentStatusOptions}
                    value={currentStatus}
                    onChange={setCurrentStatus}
                  />
                </BlockStack>
              </Card>

              {/* Listing Visibility card */}
              <Card>
                <BlockStack gap="200">
                  <Text variant="headingMd" as="h2">Listing visibility</Text>
                  <Select
                    label="Listing Visibility"
                    labelHidden
                    options={listingVisibilityOptions}
                    value={listingVisibility}
                    onChange={setListingVisibility}
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

export default AddProperty;
