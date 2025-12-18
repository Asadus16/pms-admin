'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
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
  Banner,
  Popover,
  ActionList,
} from '@shopify/polaris';
import {
  SearchIcon,
  EditIcon,
  DeleteIcon,
  PlusCircleIcon,
  SortIcon,
  CirclePlusIcon,
  ChevronRightIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  OrderIcon,
  ChevronLeftIcon,
  CalendarIcon,
  ClockIcon,
} from '@shopify/polaris-icons';
import { SendInvoiceModal } from './bookings';
import './styles/CreateOrder.css';

function CreateOrder({ onClose }) {
  const router = useRouter();

  const handleBack = useCallback(() => {
    if (onClose) {
      onClose();
    } else {
      router.push('/dashboard/bookings');
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

  // Products state
  const [products, setProducts] = useState([]);
  const [productSearchValue, setProductSearchValue] = useState('');
  const [browseModalOpen, setBrowseModalOpen] = useState(false);
  const [customItemModalOpen, setCustomItemModalOpen] = useState(false);
  const [selectedBrowseProducts, setSelectedBrowseProducts] = useState([]);
  const [filterPopoverActive, setFilterPopoverActive] = useState(false);

  // Custom item state
  const [customItemName, setCustomItemName] = useState('');
  const [customItemPrice, setCustomItemPrice] = useState('0.00');
  const [customItemQuantity, setCustomItemQuantity] = useState('1');
  const [customItemTaxable, setCustomItemTaxable] = useState(true);
  const [customItemPhysical, setCustomItemPhysical] = useState(true);
  const [customItemWeight, setCustomItemWeight] = useState('0');
  const [customItemWeightUnit, setCustomItemWeightUnit] = useState('kg');

  // Payment state
  const [discount, setDiscount] = useState('');
  const [shipping, setShipping] = useState('');
  const [paymentDueLater, setPaymentDueLater] = useState(false);
  const [paymentTerms, setPaymentTerms] = useState('due_on_receipt');
  const [showPaymentReminderBanner, setShowPaymentReminderBanner] = useState(true);

  // Customer state
  const [customerSearchValue, setCustomerSearchValue] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  // Markets and Currency state
  const [selectedMarket, setSelectedMarket] = useState('India');
  const [selectedCurrency, setSelectedCurrency] = useState('AED');

  // Notes and Tags state
  const [notes, setNotes] = useState('');
  const [tempNotes, setTempNotes] = useState('');
  const [notesModalOpen, setNotesModalOpen] = useState(false);
  const [tags, setTags] = useState('');
  const [tagsModalOpen, setTagsModalOpen] = useState(false);
  const [tagSearchValue, setTagSearchValue] = useState('');

  // Tags selection state
  const [selectedTags, setSelectedTags] = useState([]);

  // Email modal state
  const [emailModalOpen, setEmailModalOpen] = useState(false);

  // Guests state
  const [guestsSectionOpen, setGuestsSectionOpen] = useState(true);
  const [numberOfGuests, setNumberOfGuests] = useState('');
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [checkInDate, setCheckInDate] = useState('');
  const [checkInTime, setCheckInTime] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  const [checkOutTime, setCheckOutTime] = useState('');
  const [tempCheckInDate, setTempCheckInDate] = useState('');
  const [tempCheckInTime, setTempCheckInTime] = useState('');
  const [tempCheckOutDate, setTempCheckOutDate] = useState('');
  const [tempCheckOutTime, setTempCheckOutTime] = useState('');
  const [calendarMonth, setCalendarMonth] = useState(0);
  const [calendarYear, setCalendarYear] = useState(2025);
  const [timePickerOpen, setTimePickerOpen] = useState(null); // 'checkin' or 'checkout' or null
  const datePickerRef = useRef(null);
  const [isMounted, setIsMounted] = useState(false);
  const checkInTimeRef = useRef(null);
  const checkOutTimeRef = useRef(null);

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

  const modalContentRef = useRef(null);
  const clickStartedInsideModal = useRef(false);

  // Mock property data
  const availableProducts = [
    {
      id: '1',
      name: 'Oceanview Resort & Spa',
      available: 12,
      price: 8500.00,
      image: '/images/properties/dillon-kydd-2keCPb73aQY-unsplash.jpg',
    },
    {
      id: '2',
      name: 'Mountain View Lodge',
      available: 24,
      price: 4500.00,
      image: '/images/properties/frames-for-your-heart-mR1CIDduGLc-unsplash.jpg',
    },
    {
      id: '3',
      name: 'Bavaria Countryside Inn',
      available: 6,
      price: 15000.00,
      image: '/images/properties/germany-bg.jpg',
    },
    {
      id: '4',
      name: 'Urban City Hotel',
      available: 18,
      price: 6200.00,
      image: '/images/properties/marcin-nowak-iXqTqC-f6jI-unsplash.jpg',
    },
  ];

  // Mock customer data
  const mockCustomers = [
    { id: '1', name: '123HannahOunengtibgffocfbvuz.dpn', email: '123HannahOunengtibgffocfbvuz.dpn@inscrlab.com', orders: [] },
    { id: '2', name: '123HannahOunengtltibgffo.dpn', email: '123HannahOunengtltibgffo.dpn@inscrlab.com', orders: [] },
    {
      id: '3',
      name: '13_Falak Naaz_XA',
      email: 'falaknaaz6345@gmail.com',
      phone: '+91 77953 55202',
      address: {
        street: '#76/1, 5 th d cross new gudaddhalli',
        apartment: '',
        city: 'manjunathnagar',
        state: 'KA',
        pinCode: '560026',
        country: 'IN',
        phone: '+91 77953 55202',
      },
      orders: [],
    },
    { id: '4', name: '', email: '3poojasethi@gmail.com', orders: [] },
    { id: '5', name: 'Ayesha Sultana', email: 'Nadeemkhan9153@gmail.com', phone: '8105558574', orders: [] },
    { id: '6', name: 'Mariya', email: 'ridamariya1234@gmail.com', phone: '8310436549', orders: [] },
    { id: '7', name: 'A .', email: '8825743434@fastrr.com', orders: [] },
    { id: '8', name: 'A.haseena A.haseena', phone: '+917358875201', orders: [] },
  ];

  // Add Customer Modal state
  const [addCustomerModalOpen, setAddCustomerModalOpen] = useState(false);
  const [customerDropdownOpen, setCustomerDropdownOpen] = useState(false);
  const customerDropdownRef = useRef(null);
  const customerDropdownElementRef = useRef(null);

  // New customer form state
  const [newCustomerFirstName, setNewCustomerFirstName] = useState('');
  const [newCustomerLastName, setNewCustomerLastName] = useState('');
  const [newCustomerLanguage, setNewCustomerLanguage] = useState('en');
  const [newCustomerEmail, setNewCustomerEmail] = useState('');
  const [newCustomerEmailMarketing, setNewCustomerEmailMarketing] = useState(false);
  const [newCustomerTaxExempt, setNewCustomerTaxExempt] = useState(false);
  const [newCustomerCountry, setNewCustomerCountry] = useState('IN');
  const [newCustomerCompany, setNewCustomerCompany] = useState('');
  const [newCustomerAddress, setNewCustomerAddress] = useState('');
  const [newCustomerApartment, setNewCustomerApartment] = useState('');
  const [newCustomerCity, setNewCustomerCity] = useState('');
  const [newCustomerState, setNewCustomerState] = useState('');
  const [newCustomerPinCode, setNewCustomerPinCode] = useState('');
  const [newCustomerPhoneCountry, setNewCustomerPhoneCountry] = useState('IN');
  const [newCustomerPhone, setNewCustomerPhone] = useState('');

  // Language options
  const languageOptions = [
    { label: 'English [Default]', value: 'en' },
    { label: 'Hindi', value: 'hi' },
    { label: 'Tamil', value: 'ta' },
    { label: 'Telugu', value: 'te' },
    { label: 'Kannada', value: 'kn' },
  ];

  // Country options
  const countryOptions = [
    { label: 'India', value: 'IN' },
    { label: 'United States', value: 'US' },
    { label: 'United Kingdom', value: 'GB' },
    { label: 'United Arab Emirates', value: 'AE' },
    { label: 'Saudi Arabia', value: 'SA' },
    { label: 'Canada', value: 'CA' },
    { label: 'Australia', value: 'AU' },
  ];

  // Indian states
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

  // Country code options for phone
  const countryCodeOptions = [
    { label: '🇮🇳', value: 'IN' },
    { label: '🇺🇸', value: 'US' },
    { label: '🇬🇧', value: 'GB' },
    { label: '🇦🇪', value: 'AE' },
    { label: '🇸🇦', value: 'SA' },
  ];

  // Currency options
  const currencyOptions = [
    { label: ' AED ', value: 'AED' },
    { label: 'US Dollar (USD $)', value: 'USD' },
    { label: 'Euro (EUR €)', value: 'EUR' },
    { label: 'British Pound (GBP £)', value: 'GBP' },
  ];

  // Calculate totals
  const calculateSubtotal = useCallback(() => {
    return products.reduce((sum, product) => {
      return sum + (product.price * product.quantity);
    }, 0);
  }, [products]);

  const calculateDiscount = useCallback(() => {
    return discount ? parseFloat(discount) : 0;
  }, [discount]);

  const calculateShipping = useCallback(() => {
    return shipping ? parseFloat(shipping) : 0;
  }, [shipping]);

  const calculateTax = useCallback(() => {
    const subtotal = calculateSubtotal();
    const discountAmount = calculateDiscount();
    const shippingAmount = calculateShipping();
    const taxableAmount = subtotal - discountAmount + shippingAmount;

    // CGST 9% calculation
    return taxableAmount > 0 ? taxableAmount * 0.09 : 0;
  }, [calculateSubtotal, calculateDiscount, calculateShipping]);

  const calculateTotal = useCallback(() => {
    const subtotal = calculateSubtotal();
    const discountAmount = calculateDiscount();
    const shippingAmount = calculateShipping();
    const tax = calculateTax();

    return subtotal - discountAmount + shippingAmount + tax;
  }, [calculateSubtotal, calculateDiscount, calculateShipping, calculateTax]);

  // Product handlers
  const handleToggleBrowseProduct = useCallback((product) => {
    setSelectedBrowseProducts(prev => {
      const isSelected = prev.find(p => p.id === product.id);
      if (isSelected) {
        return prev.filter(p => p.id !== product.id);
      }
      return [...prev, product];
    });
  }, []);

  const handleAddSelectedProducts = useCallback(() => {
    selectedBrowseProducts.forEach(product => {
      setProducts(prev => {
        const existing = prev.find(p => p.id === product.id);
        if (existing) {
          return prev.map(p =>
            p.id === product.id
              ? { ...p, quantity: p.quantity + 1 }
              : p
          );
        }
        return [...prev, { ...product, quantity: 1 }];
      });
    });
    setSelectedBrowseProducts([]);
    setBrowseModalOpen(false);
  }, [selectedBrowseProducts]);

  const handleCloseBrowseModal = useCallback(() => {
    setSelectedBrowseProducts([]);
    setBrowseModalOpen(false);
  }, []);

  const handleRemoveProduct = useCallback((productId) => {
    setProducts(prev => prev.filter(p => p.id !== productId));
  }, []);

  const handleUpdateQuantity = useCallback((productId, quantity) => {
    const qty = parseInt(quantity) || 1;
    setProducts(prev => prev.map(p =>
      p.id === productId ? { ...p, quantity: qty } : p
    ));
  }, []);


  // Customer dropdown handlers
  const handleCustomerInputFocus = useCallback(() => {
    setCustomerDropdownOpen(true);
  }, []);

  const handleCustomerDropdownSelect = useCallback((customer) => {
    setSelectedCustomer(customer);
    setCustomerSearchValue(customer.name || customer.email);
    setCustomerDropdownOpen(false);
  }, []);

  const handleOpenAddCustomerModal = useCallback(() => {
    setCustomerDropdownOpen(false);
    setAddCustomerModalOpen(true);
  }, []);

  const handleCloseAddCustomerModal = useCallback(() => {
    setAddCustomerModalOpen(false);
    // Reset form
    setNewCustomerFirstName('');
    setNewCustomerLastName('');
    setNewCustomerLanguage('en');
    setNewCustomerEmail('');
    setNewCustomerEmailMarketing(false);
    setNewCustomerTaxExempt(false);
    setNewCustomerCountry('IN');
    setNewCustomerCompany('');
    setNewCustomerAddress('');
    setNewCustomerApartment('');
    setNewCustomerCity('');
    setNewCustomerState('');
    setNewCustomerPinCode('');
    setNewCustomerPhoneCountry('IN');
    setNewCustomerPhone('');
  }, []);

  const handleSaveNewCustomer = useCallback(() => {
    const fullName = `${newCustomerFirstName} ${newCustomerLastName}`.trim();
    const newCustomer = {
      id: Date.now().toString(),
      name: fullName,
      firstName: newCustomerFirstName,
      lastName: newCustomerLastName,
      email: newCustomerEmail,
      phone: newCustomerPhone,
      phoneCountry: newCustomerPhoneCountry,
      language: newCustomerLanguage,
      emailMarketing: newCustomerEmailMarketing,
      taxExempt: newCustomerTaxExempt,
      country: newCustomerCountry,
      company: newCustomerCompany,
      address: {
        street: newCustomerAddress,
        apartment: newCustomerApartment,
        city: newCustomerCity,
        state: newCustomerState,
        pinCode: newCustomerPinCode,
        country: newCustomerCountry,
        phone: newCustomerPhone,
        phoneCountry: newCustomerPhoneCountry,
      },
      orders: [],
    };
    // Add to mock customers and select it
    mockCustomers.push(newCustomer);
    setSelectedCustomer(newCustomer);
    setCustomerSearchValue(fullName || newCustomerEmail);
    handleCloseAddCustomerModal();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    newCustomerFirstName,
    newCustomerLastName,
    newCustomerEmail,
    newCustomerPhone,
    newCustomerPhoneCountry,
    newCustomerLanguage,
    newCustomerEmailMarketing,
    newCustomerTaxExempt,
    newCustomerCountry,
    newCustomerCompany,
    newCustomerAddress,
    newCustomerApartment,
    newCustomerCity,
    newCustomerState,
    newCustomerPinCode,
    handleCloseAddCustomerModal,
  ]);

  // Filter customers based on search
  const filteredCustomers = customerSearchValue
    ? mockCustomers.filter(customer =>
      (customer.name && customer.name.toLowerCase().includes(customerSearchValue.toLowerCase())) ||
      (customer.email && customer.email.toLowerCase().includes(customerSearchValue.toLowerCase())) ||
      (customer.phone && customer.phone.includes(customerSearchValue))
    )
    : mockCustomers;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      const target = event.target;
      const isInsideDropdown = customerDropdownElementRef.current && customerDropdownElementRef.current.contains(target);
      const isInsideWrapper = customerDropdownRef.current && customerDropdownRef.current.contains(target);
      const isCreateCustomerButton = target.closest('.create-customer-option');
      const isCustomerOption = target.closest('.customer-option');

      // Don't close if clicking inside dropdown, wrapper, or any button inside dropdown
      if (!isInsideWrapper && !isInsideDropdown && !isCreateCustomerButton && !isCustomerOption) {
        setCustomerDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Tags handlers
  const handleTagsModalOpen = useCallback(() => {
    setTagsModalOpen(true);
  }, []);

  const handleTagsModalClose = useCallback(() => {
    if (!clickStartedInsideModal.current) {
      setTagsModalOpen(false);
      setTagSearchValue('');
    }
    clickStartedInsideModal.current = false;
  }, []);

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

  // Filter tags based on search
  const filteredAvailableTags = availableTags.filter(tag =>
    tag.toLowerCase().includes(tagSearchValue.toLowerCase()) &&
    !selectedTags.includes(tag)
  );

  const handleSave = useCallback(() => {
    console.log('Saving booking:', {
      products,
      discount,
      shipping,
      customer: selectedCustomer,
      market: selectedMarket,
      currency: selectedCurrency,
      notes,
      tags,
      paymentDueLater,
    });
  }, [products, discount, shipping, selectedCustomer, selectedMarket, selectedCurrency, notes, tags, paymentDueLater]);

  const handleSendInvoice = useCallback(() => {
    // Open email modal instead of directly sending
    setEmailModalOpen(true);
  }, []);

  const handleCloseEmailModal = useCallback(() => {
    setEmailModalOpen(false);
  }, []);

  // Create draft order object for EmailCustomerModal
  const getDraftOrder = useCallback(() => {
    if (!selectedCustomer) return null;

    return {
      id: 'draft',
      orderId: 'Draft',
      customer: selectedCustomer.name || selectedCustomer.email || 'Customer',
      customerEmail: selectedCustomer.email || '',
      customerPhone: selectedCustomer.phone || '',
      customerLocation: '',
      shippingAddress: null,
    };
  }, [selectedCustomer]);

  const handleMarkAsPaid = useCallback(() => {
    console.log('Marking as paid');
    handleSave();
  }, [handleSave]);

  // Guests date/time picker handlers
  const handleOpenDatePicker = useCallback(() => {
    setDatePickerOpen(true);
    setTempCheckInDate(checkInDate);
    setTempCheckInTime(checkInTime);
    setTempCheckOutDate(checkOutDate);
    setTempCheckOutTime(checkOutTime);
  }, [checkInDate, checkInTime, checkOutDate, checkOutTime]);

  const handleCloseDatePicker = useCallback(() => {
    setDatePickerOpen(false);
    setTimePickerOpen(null);
  }, []);

  const handleSaveDates = useCallback(() => {
    setCheckInDate(tempCheckInDate);
    setCheckInTime(tempCheckInTime);
    setCheckOutDate(tempCheckOutDate);
    setCheckOutTime(tempCheckOutTime);
    setDatePickerOpen(false);
    setTimePickerOpen(null);
  }, [tempCheckInDate, tempCheckInTime, tempCheckOutDate, tempCheckOutTime]);

  const getDaysInMonth = useCallback((month, year) => {
    return new Date(year, month + 1, 0).getDate();
  }, []);

  const getFirstDayOfMonth = useCallback((month, year) => {
    return new Date(year, month, 1).getDay();
  }, []);

  const formatDateForInput = useCallback((date) => {
    if (!date) return '';
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }, []);

  const parseDateFromInput = useCallback((dateString) => {
    if (!dateString) return null;
    const parts = dateString.split('-');
    if (parts.length !== 3) return null;
    return new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
  }, []);

  const handleDateSelect = useCallback((day, month, year) => {
    const selectedDate = new Date(year, month, day);
    const dateString = formatDateForInput(selectedDate);

    // If no check-in date is set, or both dates are set, start fresh with check-in
    if (!tempCheckInDate || (tempCheckInDate && tempCheckOutDate)) {
      setTempCheckInDate(dateString);
      setTempCheckOutDate('');
    } else {
      // Check-in is set, so this is check-out
      const checkIn = parseDateFromInput(tempCheckInDate);
      if (checkIn && selectedDate > checkIn) {
        setTempCheckOutDate(dateString);
      } else {
        // If selected date is before check-in, make it the new check-in
        setTempCheckInDate(dateString);
        setTempCheckOutDate('');
      }
    }
  }, [formatDateForInput, parseDateFromInput, tempCheckInDate, tempCheckOutDate]);

  const handlePrevMonth = useCallback(() => {
    if (calendarMonth === 0) {
      setCalendarMonth(11);
      setCalendarYear(calendarYear - 1);
    } else {
      setCalendarMonth(calendarMonth - 1);
    }
  }, [calendarMonth, calendarYear]);

  const handleNextMonth = useCallback(() => {
    if (calendarMonth === 11) {
      setCalendarMonth(0);
      setCalendarYear(calendarYear + 1);
    } else {
      setCalendarMonth(calendarMonth + 1);
    }
  }, [calendarMonth, calendarYear]);

  // Generate time options (30-minute increments)
  const generateTimeOptions = useCallback(() => {
    const times = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time24 = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
        const period = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
        const time12 = `${displayHour}:${String(minute).padStart(2, '0')} ${period}`;
        times.push({ value: time24, label: time12 });
      }
    }
    return times;
  }, []);

  const timeOptions = generateTimeOptions();

  const handleTimeSelect = useCallback((time, type) => {
    if (type === 'checkin') {
      setTempCheckInTime(time);
    } else if (type === 'checkout') {
      setTempCheckOutTime(time);
    }
    setTimePickerOpen(null);
  }, []);

  const formatTimeForDisplay = useCallback((time24) => {
    if (!time24) return '';
    const [hours, minutes] = time24.split(':');
    const hour = parseInt(hours);
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${displayHour}:${minutes} ${period}`;
  }, []);

  // Tags modal effect
  useEffect(() => {
    if (!tagsModalOpen) {
      document.body.removeAttribute('data-tags-modal-open');
      return;
    }

    document.body.setAttribute('data-tags-modal-open', 'true');

    const handleGlobalMouseDown = (e) => {
      const target = e.target;

      if (modalContentRef.current && modalContentRef.current.contains(target)) {
        clickStartedInsideModal.current = true;
        e.stopPropagation();
        return;
      }

      const isBackdrop = target.closest('.Polaris-Modal-Dialog__Backdrop') ||
        target.closest('[class*="Modal__Backdrop"]') ||
        (target.classList && target.classList.contains('Polaris-Modal-Dialog__Backdrop'));

      const modalDialog = target.closest('.Polaris-Modal-Dialog');
      const isModalDialog = modalDialog &&
        !target.closest('.Polaris-Modal-Section') &&
        !target.closest('[class*="Modal-Section"]') &&
        !modalContentRef.current?.contains(target);

      if (isBackdrop || isModalDialog) {
        clickStartedInsideModal.current = false;
      } else if (modalContentRef.current && modalContentRef.current.contains(target)) {
        clickStartedInsideModal.current = true;
        e.stopPropagation();
      } else {
        clickStartedInsideModal.current = true;
      }
    };

    document.addEventListener('mousedown', handleGlobalMouseDown, true);
    document.addEventListener('click', handleGlobalMouseDown, true);

    return () => {
      document.removeEventListener('mousedown', handleGlobalMouseDown, true);
      document.removeEventListener('click', handleGlobalMouseDown, true);
      document.body.removeAttribute('data-tags-modal-open');
    };
  }, [tagsModalOpen]);

  // Set isMounted flag and initialize calendar dates on client-side only
  useEffect(() => {
    setIsMounted(true);
    const now = new Date();
    setCalendarMonth(now.getMonth());
    setCalendarYear(now.getFullYear());
  }, []);

  // Set data attribute on body when CreateOrder is mounted
  useEffect(() => {
    if (!isMounted) return;
    document.body.setAttribute('data-create-order-open', 'true');
    return () => {
      document.body.removeAttribute('data-create-order-open');
    };
  }, [isMounted]);

  // Close time picker when clicking outside or scrolling
  useEffect(() => {
    if (!timePickerOpen) return;

    const handleClickOutside = (event) => {
      // Don't close if clicking inside the time picker dropdown
      if (event.target.closest('.time-picker-dropdown')) {
        return;
      }
      if (datePickerRef.current && !datePickerRef.current.contains(event.target)) {
        setTimePickerOpen(null);
      }
    };

    const handleScroll = () => {
      setTimePickerOpen(null);
    };

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('scroll', handleScroll, true);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('scroll', handleScroll, true);
    };
  }, [timePickerOpen]);

  // Listen for custom events from header
  useEffect(() => {
    const handleClose = () => {
      handleBack();
    };

    const handleSaveEvent = () => {
      handleSave();
    };

    window.addEventListener('closeCreateOrder', handleClose);
    window.addEventListener('saveCreateOrder', handleSaveEvent);

    return () => {
      window.removeEventListener('closeCreateOrder', handleClose);
      window.removeEventListener('saveCreateOrder', handleSaveEvent);
    };
  }, [handleBack, handleSave]);

  // Overlay effect - backdrop for modals
  useEffect(() => {
    if (tagsModalOpen || browseModalOpen || customItemModalOpen || notesModalOpen || addCustomerModalOpen || emailModalOpen) {
      const overlay = document.createElement('div');
      overlay.id = 'custom-modal-overlay';
      overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.5);
        z-index: 500;
        pointer-events: auto;
      `;
      document.body.appendChild(overlay);

      return () => {
        const existingOverlay = document.getElementById('custom-modal-overlay');
        if (existingOverlay) {
          existingOverlay.remove();
        }
      };
    }
  }, [tagsModalOpen, browseModalOpen, customItemModalOpen, notesModalOpen, addCustomerModalOpen, emailModalOpen]);

  // Force modal width for browse products modal
  useEffect(() => {
    if (browseModalOpen) {
      const style = document.createElement('style');
      style.id = 'browse-modal-style';
      style.textContent = `
        .Polaris-Modal-Dialog--sizeLarge .Polaris-Modal-Dialog__Modal {
          max-width: 720px !important;
          width: 720px !important;
          min-width: 720px !important;
          max-height: 600px !important;
        }
        .Polaris-Modal-Dialog--sizeLarge .Polaris-Modal-Section:first-of-type {
          max-height: 420px !important;
          overflow-y: auto !important;
        }
      `;
      document.head.appendChild(style);

      return () => {
        const existingStyle = document.getElementById('browse-modal-style');
        if (existingStyle) {
          existingStyle.remove();
        }
      };
    }
  }, [browseModalOpen]);

  const subtotal = calculateSubtotal();
  const discountAmount = calculateDiscount();
  const shippingAmount = calculateShipping();
  const tax = calculateTax();
  const total = calculateTotal();

  return (
    <>
      <div className="create-order-wrapper">
        <Page
          title={
            <InlineStack gap="050" blockAlign="center">
              <Icon source={OrderIcon} tone="base" />
              <Icon source={ChevronRightIcon} tone="subdued" />
              <span className="create-booking-title">Create Booking</span>
            </InlineStack>
          }
        >
          <Layout>
            {/* Main content - Left column */}
            <Layout.Section>
              <BlockStack gap="400">
                {/* Properties card */}
                <Card>
                  <BlockStack gap="400">
                    <div className="products-header">
                      <Text variant="headingMd" as="h2">
                        Properties
                      </Text>
                      <button className="more-actions-button" aria-label="More actions">
                        <span>⋯</span>
                      </button>
                    </div>

                    {/* Search and action buttons */}
                    <InlineStack gap="300" wrap={false}>
                      <div className="flex-1">
                        <TextField
                          label="Search properties"
                          labelHidden
                          placeholder="Search properties"
                          value={productSearchValue}
                          onChange={setProductSearchValue}
                          prefix={<Icon source={SearchIcon} tone="subdued" />}
                          autoComplete="off"
                        />
                      </div>
                      <Button onClick={() => setBrowseModalOpen(true)}>Browse</Button>
                    </InlineStack>

                    {/* Properties list */}
                    {products.length > 0 && (
                      <>
                        <div className="products-table">
                          <div className="products-table-header">
                            <div className="product-col">Property</div>
                            <div className="quantity-col">Nights</div>
                            <div className="total-col">Total</div>
                          </div>
                          {products.map((product) => (
                            <div key={product.id} className="product-row">
                              <div className="product-info">
                                {product.image && (
                                  <div className="product-image">
                                    <img src={product.image} alt={product.name} />
                                  </div>
                                )}
                                <div className="product-details">
                                  <Text variant="bodyMd" as="p" fontWeight="medium">
                                    {product.name}
                                  </Text>
                                  <Text variant="bodySm" as="p" tone="subdued">
                                    {product.variant}
                                  </Text>
                                  <Text variant="bodySm" as="p" tone="base" fontWeight="semibold">
                                    {product.price.toFixed(2)}
                                  </Text>
                                </div>
                              </div>
                              <div className="product-quantity">
                                <TextField
                                  label="Quantity"
                                  labelHidden
                                  type="number"
                                  value={product.quantity.toString()}
                                  onChange={(value) => handleUpdateQuantity(product.id, value)}
                                  min="1"
                                  autoComplete="off"
                                />
                              </div>
                              <div className="product-total">
                                <InlineStack gap="200" align="end">
                                  <Text variant="bodyMd" as="span" fontWeight="medium">
                                    {(product.price * product.quantity).toFixed(2)}
                                  </Text>
                                  <button
                                    className="remove-product-button"
                                    onClick={() => handleRemoveProduct(product.id)}
                                    aria-label="Remove property"
                                  >
                                    <Icon source={DeleteIcon} tone="subdued" />
                                  </button>
                                </InlineStack>
                              </div>
                            </div>
                          ))}
                        </div>
                      </>
                    )}


                  </BlockStack>
                </Card>

                {/* Guests card */}
                <Card>
                  <BlockStack gap="400">
                    <div
                      className="guests-section-header"
                      onClick={() => setGuestsSectionOpen(!guestsSectionOpen)}
                    >
                      <Text variant="headingMd" as="h2">
                        Guests
                      </Text>
                      <Icon
                        source={guestsSectionOpen ? ChevronUpIcon : ChevronDownIcon}
                        tone="subdued"
                      />
                    </div>

                    <div className={`guests-section-content ${guestsSectionOpen ? 'open' : ''}`}>
                      <BlockStack gap="300">
                        <InlineStack gap="300" wrap={false} align="center">
                          <Box width="70%">
                            <TextField
                              label="Number of guests"
                              labelHidden
                              type="number"
                              placeholder="Number of guests"
                              value={numberOfGuests}
                              onChange={setNumberOfGuests}
                              min="1"
                              autoComplete="off"
                            />
                          </Box>
                          <Box width="30%">
                            <Button onClick={handleOpenDatePicker} fullWidth>Select dates</Button>
                          </Box>
                        </InlineStack>

                        {/* Date picker section */}
                        {datePickerOpen && (
                          <div className="guests-date-picker" ref={datePickerRef}>
                            <BlockStack gap="400">
                              <div className="date-picker-calendar-wrapper">
                                <div className="calendar-header-nav">
                                  <button
                                    type="button"
                                    className="calendar-nav-button"
                                    onClick={handlePrevMonth}
                                    aria-label="Previous month"
                                  >
                                    <Icon source={ChevronLeftIcon} tone="base" />
                                  </button>
                                  <Text variant="headingMd" as="h3">
                                    {new Date(calendarYear, calendarMonth).toLocaleString('default', { month: 'long', year: 'numeric' })}
                                  </Text>
                                  <button
                                    type="button"
                                    className="calendar-nav-button"
                                    onClick={handleNextMonth}
                                    aria-label="Next month"
                                  >
                                    <Icon source={ChevronRightIcon} tone="base" />
                                  </button>
                                </div>

                                {/* Calendar */}
                                <div className="date-picker-calendar">
                                  <div className="calendar-weekdays">
                                    {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map((day) => (
                                      <div key={day} className="calendar-weekday">{day}</div>
                                    ))}
                                  </div>
                                  <div className="calendar-days-grid">
                                    {(() => {
                                      const daysInMonth = getDaysInMonth(calendarMonth, calendarYear);
                                      const firstDay = getFirstDayOfMonth(calendarMonth, calendarYear);
                                      const days = [];
                                      const checkInDateObj = tempCheckInDate ? parseDateFromInput(tempCheckInDate) : null;
                                      const checkOutDateObj = tempCheckOutDate ? parseDateFromInput(tempCheckOutDate) : null;

                                      // Adjust first day (Monday = 0 instead of Sunday = 0)
                                      const adjustedFirstDay = firstDay === 0 ? 6 : firstDay - 1;

                                      for (let i = 0; i < adjustedFirstDay; i++) {
                                        days.push(<div key={`empty-${i}`} className="calendar-day empty" />);
                                      }

                                      for (let day = 1; day <= daysInMonth; day++) {
                                        const currentDate = new Date(calendarYear, calendarMonth, day);
                                        const isCheckIn = checkInDateObj &&
                                          currentDate.getDate() === checkInDateObj.getDate() &&
                                          currentDate.getMonth() === checkInDateObj.getMonth() &&
                                          currentDate.getFullYear() === checkInDateObj.getFullYear();
                                        const isCheckOut = checkOutDateObj &&
                                          currentDate.getDate() === checkOutDateObj.getDate() &&
                                          currentDate.getMonth() === checkOutDateObj.getMonth() &&
                                          currentDate.getFullYear() === checkOutDateObj.getFullYear();
                                        const isInRange = checkInDateObj && checkOutDateObj &&
                                          currentDate > checkInDateObj && currentDate < checkOutDateObj;

                                        days.push(
                                          <div
                                            key={day}
                                            className={`calendar-day ${isCheckIn ? 'selected checkin' : ''} ${isCheckOut ? 'selected checkout' : ''} ${isInRange ? 'in-range' : ''}`}
                                            onClick={() => {
                                              handleDateSelect(day, calendarMonth, calendarYear);
                                            }}
                                          >
                                            {day}
                                          </div>
                                        );
                                      }

                                      return days;
                                    })()}
                                  </div>
                                </div>
                              </div>

                              {/* Date and time inputs */}
                              <BlockStack gap="300">
                                <InlineStack gap="300" wrap={false}>
                                  <Box width="100%">
                                    <BlockStack gap="100">
                                      <Text variant="bodyMd" as="span">Check in date</Text>
                                      <div className="date-input-wrapper">
                                        <Icon source={CalendarIcon} tone="subdued" />
                                        <input
                                          type="date"
                                          value={tempCheckInDate}
                                          onChange={(e) => setTempCheckInDate(e.target.value)}
                                          className="date-input"
                                        />
                                      </div>
                                    </BlockStack>
                                  </Box>
                                  <Box width="100%">
                                    <BlockStack gap="100">
                                      <Text variant="bodyMd" as="span">Check in time (IST)</Text>
                                      <div
                                        ref={checkInTimeRef}
                                        className="time-input-wrapper"
                                        style={{ position: 'relative' }}
                                        data-dropdown-open={timePickerOpen === 'checkin'}
                                      >
                                        <Icon source={ClockIcon} tone="subdued" />
                                        <input
                                          type="text"
                                          value={formatTimeForDisplay(tempCheckInTime)}
                                          onClick={() => setTimePickerOpen(timePickerOpen === 'checkin' ? null : 'checkin')}
                                          readOnly
                                          className="time-input"
                                          placeholder="Select time"
                                        />
                                        {timePickerOpen === 'checkin' && checkInTimeRef.current && createPortal(
                                          <div
                                            className="time-picker-dropdown"
                                            style={{
                                              position: 'fixed',
                                              bottom: window.innerHeight - checkInTimeRef.current.getBoundingClientRect().top + 4,
                                              left: checkInTimeRef.current.getBoundingClientRect().left,
                                              width: checkInTimeRef.current.getBoundingClientRect().width,
                                            }}
                                          >
                                            {timeOptions.map((time) => (
                                              <div
                                                key={time.value}
                                                className={`time-option ${tempCheckInTime === time.value ? 'selected' : ''}`}
                                                onClick={() => handleTimeSelect(time.value, 'checkin')}
                                              >
                                                {time.label}
                                              </div>
                                            ))}
                                          </div>,
                                          document.body
                                        )}
                                      </div>
                                    </BlockStack>
                                  </Box>
                                </InlineStack>

                                <InlineStack gap="300" wrap={false}>
                                  <Box width="100%">
                                    <BlockStack gap="100">
                                      <Text variant="bodyMd" as="span">Check out date</Text>
                                      <div className="date-input-wrapper">
                                        <Icon source={CalendarIcon} tone="subdued" />
                                        <input
                                          type="date"
                                          value={tempCheckOutDate}
                                          onChange={(e) => setTempCheckOutDate(e.target.value)}
                                          className="date-input"
                                        />
                                      </div>
                                    </BlockStack>
                                  </Box>
                                  <Box width="100%">
                                    <BlockStack gap="100">
                                      <Text variant="bodyMd" as="span">Check out time (IST)</Text>
                                      <div
                                        ref={checkOutTimeRef}
                                        className="time-input-wrapper"
                                        style={{ position: 'relative' }}
                                        data-dropdown-open={timePickerOpen === 'checkout'}
                                      >
                                        <Icon source={ClockIcon} tone="subdued" />
                                        <input
                                          type="text"
                                          value={formatTimeForDisplay(tempCheckOutTime)}
                                          onClick={() => setTimePickerOpen(timePickerOpen === 'checkout' ? null : 'checkout')}
                                          readOnly
                                          className="time-input"
                                          placeholder="Select time"
                                        />
                                        {timePickerOpen === 'checkout' && checkOutTimeRef.current && createPortal(
                                          <div
                                            className="time-picker-dropdown"
                                            style={{
                                              position: 'fixed',
                                              bottom: window.innerHeight - checkOutTimeRef.current.getBoundingClientRect().top + 4,
                                              left: checkOutTimeRef.current.getBoundingClientRect().left,
                                              width: checkOutTimeRef.current.getBoundingClientRect().width,
                                            }}
                                          >
                                            {timeOptions.map((time) => (
                                              <div
                                                key={time.value}
                                                className={`time-option ${tempCheckOutTime === time.value ? 'selected' : ''}`}
                                                onClick={() => handleTimeSelect(time.value, 'checkout')}
                                              >
                                                {time.label}
                                              </div>
                                            ))}
                                          </div>,
                                          document.body
                                        )}
                                      </div>
                                    </BlockStack>
                                  </Box>
                                </InlineStack>
                              </BlockStack>

                              {/* Save button */}
                              <Button
                                variant="primary"
                                onClick={handleSaveDates}
                              >
                                Save
                              </Button>
                            </BlockStack>
                          </div>
                        )}
                      </BlockStack>
                    </div>
                  </BlockStack>
                </Card>

                {/* Payment card */}
                <Card>
                  <BlockStack gap="400">
                    <Text variant="headingMd" as="h2">
                      Payment
                    </Text>

                    <div className="payment-summary">
                      <div className="payment-row">
                        <Text variant="bodyMd" as="span" tone="base" fontWeight="semibold">
                          Subtotal
                        </Text>
                        <Text variant="bodyMd" as="span">
                          {products.length > 0 ? `${products.length} item${products.length !== 1 ? 's' : ''}` : ''}
                        </Text>
                        <Text variant="bodyMd" as="span" alignment="end">
                          {subtotal.toFixed(2)} AED
                        </Text>
                      </div>

                      <div className="payment-row">
                        <button className="payment-link-button">
                          <span className="payment-link-text">Add discount</span>
                        </button>
                        <Text variant="bodyMd" as="span" tone="subdued">
                          —
                        </Text>
                        <Text variant="bodyMd" as="span" alignment="end">
                          {discountAmount.toFixed(2)}
                        </Text>
                      </div>

                      <div className="payment-row">
                        <button className="payment-link-button">
                          <span className="payment-link-text">Add shipping or delivery</span>
                        </button>
                        <Text variant="bodyMd" as="span" tone="subdued">
                          —
                        </Text>
                        <Text variant="bodyMd" as="span" alignment="end">
                          {shippingAmount.toFixed(2)}
                        </Text>
                      </div>

                      <div className="payment-row">
                        <InlineStack gap="100" blockAlign="center">
                          <span className="payment-link-text">Estimated tax</span>
                          <button className="info-button" aria-label="Tax information">
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                              <circle cx="8" cy="8" r="7" stroke="currentColor" fill="none" strokeWidth="1.5" />
                              <path d="M7.5 7h1v4h-1z" fill="currentColor" />
                              <circle cx="8" cy="5" r="0.75" fill="currentColor" />
                            </svg>
                          </button>
                        </InlineStack>
                        <Text variant="bodyMd" as="span">
                          {products.length > 0 ? 'CGST 9% (Included)' : 'Not calculated'}
                        </Text>
                        <Text variant="bodyMd" as="span" alignment="end">
                          {products.length > 0 ? `${tax.toFixed(2)}` : ''}
                        </Text>
                      </div>

                      <Divider />

                      <div className="payment-row total-row">
                        <Text variant="bodyMd" as="span" fontWeight="semibold">
                          Total
                        </Text>
                        <span></span>
                        <Text variant="bodyMd" as="span" fontWeight="semibold" alignment="end">
                          {total.toFixed(2)} AED
                        </Text>
                      </div>
                    </div>

                    {products.length > 0 ? (
                      <>
                        <Checkbox
                          label="Payment due later"
                          checked={paymentDueLater}
                          onChange={setPaymentDueLater}
                        />

                        {paymentDueLater && (
                          <>
                            <BlockStack gap="200">
                              <Text variant="bodyMd" as="span">
                                Payment terms
                              </Text>
                              <Select
                                label="Payment terms"
                                labelHidden
                                options={[
                                  { label: 'Due on receipt', value: 'due_on_receipt' },
                                  { label: 'Due on fulfillment', value: 'due_on_fulfillment' },
                                  { label: 'Within 7 days', value: 'within_7_days' },
                                  { label: 'Within 15 days', value: 'within_15_days' },
                                  { label: 'Within 30 days', value: 'within_30_days' },
                                  { label: 'Within 45 days', value: 'within_45_days' },
                                  { label: 'Within 60 days', value: 'within_60_days' },
                                  { label: 'Within 90 days', value: 'within_90_days' },
                                  { label: 'Fixed date', value: 'fixed_date' },
                                ]}
                                value={paymentTerms}
                                onChange={setPaymentTerms}
                              />
                            </BlockStack>

                            <Text variant="bodyMd" as="p">
                              <Text as="span" fontWeight="semibold">Payment due when invoice is sent.</Text>{' '}
                              You&apos;ll be able to collect the balance from the booking page.
                            </Text>

                            {showPaymentReminderBanner && (
                              <Banner
                                tone="info"
                                onDismiss={() => setShowPaymentReminderBanner(false)}
                              >
                                <BlockStack gap="200">
                                  <Text variant="bodyMd" as="p">
                                    Customers can receive automatic reminders for their bookings when payment is due at a later date
                                  </Text>
                                  <div>
                                    <Button size="slim">Set up payment reminders</Button>
                                  </div>
                                </BlockStack>
                              </Banner>
                            )}
                          </>
                        )}

                        <InlineStack gap="300" align="end">
                          <Button onClick={handleSendInvoice} disabled={!selectedCustomer}>
                            Send invoice
                          </Button>
                          <Button variant="primary" onClick={paymentDueLater ? handleSave : handleMarkAsPaid}>
                            {paymentDueLater ? 'Create booking' : 'Mark as paid'}
                          </Button>
                        </InlineStack>
                      </>
                    ) : (
                      <div className="payment-footer-message">
                        <Text variant="bodyMd" as="p" tone="subdued">
                          Add a property to calculate total and view payment options.
                        </Text>
                      </div>
                    )}
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
                        onClick={() => {
                          setTempNotes(notes);
                          setNotesModalOpen(true);
                        }}
                        aria-label="Edit notes"
                      >
                        <Icon source={EditIcon} tone="subdued" />
                      </button>
                    </div>
                    {notes ? (
                      <Text variant="bodyMd" as="p">
                        {notes}
                      </Text>
                    ) : (
                      <Text variant="bodyMd" as="p" tone="subdued">
                        No notes
                      </Text>
                    )}
                  </BlockStack>
                </Card>

                {/* Customer card */}
                <Card>
                  <BlockStack gap="300">
                    <Text variant="headingMd" as="h2">
                      Customer
                    </Text>

                    <div className="customer-dropdown-wrapper" ref={customerDropdownRef}>
                      <TextField
                        label="Customer"
                        labelHidden
                        value={customerSearchValue}
                        onChange={(value) => {
                          setCustomerSearchValue(value);
                          setCustomerDropdownOpen(true);
                        }}
                        onFocus={handleCustomerInputFocus}
                        placeholder="Search or create a customer"
                        prefix={<Icon source={SearchIcon} tone="subdued" />}
                        autoComplete="off"
                      />
                      {customerDropdownOpen && customerDropdownRef.current && createPortal(
                        <div
                          ref={customerDropdownElementRef}
                          className="customer-dropdown"
                          style={{
                            position: 'fixed',
                            top: customerDropdownRef.current.getBoundingClientRect().bottom + 4,
                            left: customerDropdownRef.current.getBoundingClientRect().left,
                            width: customerDropdownRef.current.getBoundingClientRect().width,
                          }}
                          onClick={(e) => {
                            // Prevent clicks inside dropdown from closing it
                            e.stopPropagation();
                          }}
                        >
                          <button
                            className="create-customer-option"
                            onMouseDown={(e) => {
                              // Prevent mousedown from triggering click-outside handler
                              e.stopPropagation();
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenAddCustomerModal();
                            }}
                          >
                            <Icon source={PlusCircleIcon} tone="base" />
                            <span>Create a new customer</span>
                          </button>
                          <div className="customer-list">
                            {filteredCustomers.map((customer) => (
                              <button
                                key={customer.id}
                                className="customer-option"
                                onMouseDown={(e) => {
                                  // Prevent mousedown from triggering click-outside handler
                                  e.stopPropagation();
                                }}
                                onClick={() => handleCustomerDropdownSelect(customer)}
                              >
                                <div className="customer-option-content">
                                  {customer.phone && customer.name && (
                                    <span className="customer-name-phone">
                                      {customer.phone} {customer.name}
                                    </span>
                                  )}
                                  {!customer.phone && customer.name && (
                                    <span className="customer-name">{customer.name}</span>
                                  )}
                                  {!customer.name && customer.phone && (
                                    <span className="customer-name">{customer.phone}</span>
                                  )}
                                  {customer.email && (
                                    <span className="customer-email">{customer.email}</span>
                                  )}
                                  {!customer.email && customer.phone && !customer.name && (
                                    <span className="customer-phone">{customer.phone}</span>
                                  )}
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>,
                        document.body
                      )}
                    </div>

                    {selectedCustomer && (
                      <div className="selected-customer-info">
                        <BlockStack gap="400">
                          {/* Customer Name and Orders */}
                          <div>
                            <Text variant="bodyMd" as="p" fontWeight="medium">
                              <a href="#" className="customer-name-link">
                                {selectedCustomer.name || selectedCustomer.email}
                              </a>
                            </Text>
                            <Text variant="bodySm" as="p" tone="subdued">
                              {selectedCustomer.orders && selectedCustomer.orders.length > 0
                                ? `${selectedCustomer.orders.length} order${selectedCustomer.orders.length !== 1 ? 's' : ''}`
                                : 'No orders'}
                            </Text>
                          </div>

                          {/* Contact Information */}
                          {(selectedCustomer.email || selectedCustomer.phone) && (
                            <div className="customer-section">
                              <div className="customer-section-header">
                                <Text variant="bodyMd" as="p" fontWeight="semibold">
                                  Contact information
                                </Text>
                                <button className="edit-section-button" aria-label="Edit contact information">
                                  <Icon source={EditIcon} tone="subdued" />
                                </button>
                              </div>
                              <BlockStack gap="100">
                                {selectedCustomer.email && (
                                  <Text variant="bodyMd" as="p">
                                    <a href={`mailto:${selectedCustomer.email}`} className="customer-email-link">
                                      {selectedCustomer.email}
                                    </a>
                                  </Text>
                                )}
                                {selectedCustomer.phone && (
                                  <Text variant="bodyMd" as="p">
                                    {selectedCustomer.phone}
                                  </Text>
                                )}
                              </BlockStack>
                            </div>
                          )}

                          {/* Shipping Address */}
                          {selectedCustomer.address && (
                            <div className="customer-section">
                              <div className="customer-section-header">
                                <Text variant="bodyMd" as="p" fontWeight="semibold">
                                  Shipping address
                                </Text>
                                <button className="edit-section-button" aria-label="Edit shipping address">
                                  <Icon source={EditIcon} tone="subdued" />
                                </button>
                              </div>
                              <div className="customer-address">
                                {selectedCustomer.name && (
                                  <Text variant="bodyMd" as="p">
                                    {selectedCustomer.name}
                                  </Text>
                                )}
                                {selectedCustomer.address.street && (
                                  <Text variant="bodyMd" as="p">
                                    {selectedCustomer.address.street}
                                  </Text>
                                )}
                                {selectedCustomer.address.apartment && (
                                  <Text variant="bodyMd" as="p">
                                    {selectedCustomer.address.apartment}
                                  </Text>
                                )}
                                {selectedCustomer.address.city && (
                                  <Text variant="bodyMd" as="p">
                                    {selectedCustomer.address.city}
                                  </Text>
                                )}
                                {(selectedCustomer.address.pinCode || selectedCustomer.address.city || selectedCustomer.address.state) && (
                                  <Text variant="bodyMd" as="p">
                                    {[
                                      selectedCustomer.address.pinCode,
                                      selectedCustomer.address.city,
                                      selectedCustomer.address.state ? (indianStates.find(s => s.value === selectedCustomer.address.state)?.label || selectedCustomer.address.state).replace('Select a state', '').trim() : null,
                                    ].filter(Boolean).join(' ')}
                                  </Text>
                                )}
                                {selectedCustomer.address.country && (
                                  <Text variant="bodyMd" as="p">
                                    {countryOptions.find(c => c.value === selectedCustomer.address.country)?.label || selectedCustomer.address.country}
                                  </Text>
                                )}
                                {selectedCustomer.address.phone && (
                                  <Text variant="bodyMd" as="p">
                                    {selectedCustomer.address.phone}
                                  </Text>
                                )}
                                <Text variant="bodyMd" as="p">
                                  <a href="#" className="view-map-link">View map</a>
                                </Text>
                              </div>
                            </div>
                          )}

                          {/* Billing Address */}
                          <div className="customer-section">
                            <div className="customer-section-header">
                              <Text variant="bodyMd" as="p" fontWeight="semibold">
                                Billing address
                              </Text>
                              <button className="edit-section-button" aria-label="Edit billing address">
                                <Icon source={EditIcon} tone="subdued" />
                              </button>
                            </div>
                            <Text variant="bodyMd" as="p" tone="subdued">
                              Same as shipping address
                            </Text>
                          </div>
                        </BlockStack>
                      </div>
                    )}
                  </BlockStack>
                </Card>

                {/* Markets card */}
                <Card>
                  <BlockStack gap="300">
                    <div className="card-header-with-action">
                      <Text variant="headingMd" as="h2">
                        Markets
                      </Text>
                      <button
                        className="edit-button"
                        aria-label="Edit markets"
                      >
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                          <path d="M10 5L15 10L10 15M5 5L10 10L5 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </button>
                    </div>

                    <div className="market-country-badge">
                      <div className="country-flag-icon">
                        <IndiaFlagIcon />
                      </div>
                      <Text variant="bodyMd" as="span">
                        {selectedMarket}
                      </Text>
                    </div>

                    <BlockStack gap="100">
                      <Text variant="bodyMd" as="span">
                        Currency
                      </Text>
                      <Select
                        label="Currency"
                        labelHidden
                        options={currencyOptions}
                        value={selectedCurrency}
                        onChange={setSelectedCurrency}
                      />
                    </BlockStack>
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
                      labelHidden
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

        {/* Browse Properties Modal */}
        <Modal
          open={browseModalOpen}
          onClose={handleCloseBrowseModal}
          title="Select properties"
          large
        >
          <Modal.Section>
            <BlockStack gap="400">
              <InlineStack gap="300" wrap={false}>
                <Box width="70%">
                  <TextField
                    label="Search properties"
                    labelHidden
                    placeholder="Search properties"
                    prefix={<Icon source={SearchIcon} tone="subdued" />}
                    autoComplete="off"
                  />
                </Box>
                <Box width="30%">
                  <Select
                    label="Search by"
                    labelHidden
                    options={[
                      { label: 'All', value: 'all' },
                      { label: 'Available', value: 'available' },
                      { label: 'Unavailable', value: 'unavailable' },
                    ]}
                    value="all"
                    onChange={() => { }}
                  />
                </Box>
              </InlineStack>

              <Popover
                active={filterPopoverActive}
                activator={
                  <button
                    className="add-filter-button"
                    onClick={() => setFilterPopoverActive(true)}
                  >
                    <Icon source={PlusCircleIcon} />
                    <Text variant="bodyMd" as="span">
                      Add filter
                    </Text>
                  </button>
                }
                onClose={() => setFilterPopoverActive(false)}
                preferredAlignment="left"
              >
                <ActionList
                  items={[
                    { content: 'Categories', onAction: () => setFilterPopoverActive(false) },
                    { content: 'Collection', onAction: () => setFilterPopoverActive(false) },
                    { content: 'Types', onAction: () => setFilterPopoverActive(false) },
                    { content: 'Tags', onAction: () => setFilterPopoverActive(false) },
                    { content: 'Vendors', onAction: () => setFilterPopoverActive(false) },
                  ]}
                />
              </Popover>

              <div className="browse-products-table">
                <div className="browse-products-header">
                  <div className="header-checkbox"></div>
                  <div className="header-product">Property</div>
                  <div className="header-available">Rooms</div>
                  <div className="header-price">Price</div>
                </div>
                {availableProducts.map((product) => (
                  <div key={product.id} className="browse-product-item">
                    <div className="browse-product-row">
                      <div className="product-checkbox">
                        <Checkbox
                          label=""
                          labelHidden
                          checked={selectedBrowseProducts.some(p => p.id === product.id)}
                          onChange={() => handleToggleBrowseProduct(product)}
                        />
                      </div>
                      <div className="product-image-col">
                        {product.image && (
                          <div className="browse-product-image">
                            <img src={product.image} alt={product.name} />
                          </div>
                        )}
                      </div>
                      <div className="product-name-col">
                        <Text variant="bodyMd" as="p" fontWeight="medium">
                          {product.name}
                        </Text>
                      </div>
                      <div className="product-available-col">
                        <Text variant="bodyMd" as="span">
                          {product.available}
                        </Text>
                      </div>
                      <div className="product-price-col">
                        <Text variant="bodyMd" as="span">
                          {product.price.toFixed(2)} AED
                        </Text>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

            </BlockStack>
          </Modal.Section>
          <Modal.Section>
            <InlineStack align="space-between" blockAlign="center">
              <Text variant="bodyMd" as="span" tone="subdued">
                {selectedBrowseProducts.length}/{availableProducts.length} rooms selected
              </Text>
              <InlineStack gap="300">
                <Button onClick={handleCloseBrowseModal}>Cancel</Button>
                <Button
                  variant="primary"
                  onClick={handleAddSelectedProducts}
                  disabled={selectedBrowseProducts.length === 0}
                >
                  Add
                </Button>
              </InlineStack>
            </InlineStack>
          </Modal.Section>
        </Modal>

        {/* Add Custom Item Modal */}
        <Modal
          open={customItemModalOpen}
          onClose={() => setCustomItemModalOpen(false)}
          title="Add custom item"
        >
          <Modal.Section>
            <BlockStack gap="400">
              <InlineStack gap="400" wrap={false}>
                <Box width="100%">
                  <TextField
                    label="Item name"
                    value={customItemName}
                    onChange={setCustomItemName}
                    autoComplete="off"
                  />
                </Box>
                <Box width="50%">
                  <TextField
                    label="Price"
                    type="number"
                    value={customItemPrice}
                    onChange={setCustomItemPrice}
                    prefix=""
                    autoComplete="off"
                  />
                </Box>
                <Box width="50%">
                  <TextField
                    label="Quantity"
                    type="number"
                    value={customItemQuantity}
                    onChange={setCustomItemQuantity}
                    min="1"
                    autoComplete="off"
                  />
                </Box>
              </InlineStack>

              <Checkbox
                label="Item is taxable"
                checked={customItemTaxable}
                onChange={setCustomItemTaxable}
              />

              <Checkbox
                label="Item is a physical product"
                checked={customItemPhysical}
                onChange={setCustomItemPhysical}
              />

              <BlockStack gap="100">
                <Text variant="bodyMd" as="span">
                  Item weight (optional)
                </Text>
                <InlineStack gap="200" wrap={false}>
                  <Box width="70%">
                    <TextField
                      label="Weight"
                      labelHidden
                      type="number"
                      value={customItemWeight}
                      onChange={setCustomItemWeight}
                      autoComplete="off"
                    />
                  </Box>
                  <Box width="30%">
                    <Select
                      label="Unit"
                      labelHidden
                      options={[
                        { label: 'kg', value: 'kg' },
                        { label: 'g', value: 'g' },
                        { label: 'lb', value: 'lb' },
                        { label: 'oz', value: 'oz' },
                      ]}
                      value={customItemWeightUnit}
                      onChange={setCustomItemWeightUnit}
                    />
                  </Box>
                </InlineStack>
                <Text variant="bodySm" as="p" tone="subdued">
                  Used to calculate shipping rates accurately
                </Text>
              </BlockStack>
            </BlockStack>
          </Modal.Section>
          <Modal.Section>
            <InlineStack gap="300" align="end">
              <Button onClick={() => setCustomItemModalOpen(false)}>Cancel</Button>

            </InlineStack>
          </Modal.Section>
        </Modal>

        {/* Notes Modal */}
        <Modal
          open={notesModalOpen}
          onClose={() => setNotesModalOpen(false)}
          title="Edit note"
          primaryAction={{
            content: 'Done',
            onAction: () => {
              setNotes(tempNotes);
              setNotesModalOpen(false);
            },
          }}
          secondaryActions={[
            {
              content: 'Cancel',
              onAction: () => {
                setNotesModalOpen(false);
              },
            },
          ]}
        >
          <Modal.Section>
            <BlockStack gap="200">
              <div className="notes-textarea-wrapper">
                <TextField
                  label="Note"
                  labelHidden
                  value={tempNotes}
                  onChange={setTempNotes}
                  multiline={4}
                  autoComplete="off"
                  showCharacterCount
                  maxLength={5000}
                />
              </div>
              <Text variant="bodySm" as="p" tone="subdued">
                To comment on a draft order or mention a staff member, use Timeline instead
              </Text>
            </BlockStack>
          </Modal.Section>
        </Modal>

        {/* Add Customer Modal */}
        <Modal
          open={addCustomerModalOpen}
          onClose={handleCloseAddCustomerModal}
          title="Create a new customer"
          primaryAction={{
            content: 'Save',
            onAction: handleSaveNewCustomer,
          }}
          secondaryActions={[
            {
              content: 'Cancel',
              onAction: handleCloseAddCustomerModal,
            },
          ]}
        >
          <Modal.Section>
            <BlockStack gap="400">
              {/* First name and Last name */}
              <InlineStack gap="400" wrap={false}>
                <Box width="50%">
                  <TextField
                    label="First name"
                    value={newCustomerFirstName}
                    onChange={setNewCustomerFirstName}
                    autoComplete="given-name"
                  />
                </Box>
                <Box width="50%">
                  <TextField
                    label="Last name"
                    value={newCustomerLastName}
                    onChange={setNewCustomerLastName}
                    autoComplete="family-name"
                  />
                </Box>
              </InlineStack>

              {/* Language */}
              <BlockStack gap="100">
                <Select
                  label="Language"
                  options={languageOptions}
                  value={newCustomerLanguage}
                  onChange={setNewCustomerLanguage}
                />
                <Text variant="bodySm" as="p" tone="subdued">
                  This customer will receive notifications in this language.
                </Text>
              </BlockStack>

              {/* Email */}
              <TextField
                label="Email"
                type="email"
                value={newCustomerEmail}
                onChange={setNewCustomerEmail}
                autoComplete="email"
              />

              {/* Marketing checkboxes */}
              <Checkbox
                label="Customer accepts email marketing"
                checked={newCustomerEmailMarketing}
                onChange={setNewCustomerEmailMarketing}
              />

              <Checkbox
                label="Customer is tax exempt"
                checked={newCustomerTaxExempt}
                onChange={setNewCustomerTaxExempt}
              />

              {/* Country/region */}
              <Select
                label="Country/region"
                options={countryOptions}
                value={newCustomerCountry}
                onChange={setNewCustomerCountry}
              />

              {/* Company */}
              <TextField
                label="Company"
                value={newCustomerCompany}
                onChange={setNewCustomerCompany}
                autoComplete="organization"
              />

              {/* Address */}
              <TextField
                label="Address"
                value={newCustomerAddress}
                onChange={setNewCustomerAddress}
                prefix={<Icon source={SearchIcon} tone="subdued" />}
                autoComplete="street-address"
              />

              {/* Apartment */}
              <TextField
                label="Apartment, suite, etc"
                value={newCustomerApartment}
                onChange={setNewCustomerApartment}
                autoComplete="address-line2"
              />

              {/* City and State */}
              <InlineStack gap="400" wrap={false}>
                <Box width="50%">
                  <TextField
                    label="City"
                    value={newCustomerCity}
                    onChange={setNewCustomerCity}
                    autoComplete="address-level2"
                  />
                </Box>
                <Box width="50%">
                  <Select
                    label="State"
                    options={indianStates}
                    value={newCustomerState}
                    onChange={setNewCustomerState}
                  />
                </Box>
              </InlineStack>

              {/* PIN code */}
              <TextField
                label="PIN code"
                value={newCustomerPinCode}
                onChange={setNewCustomerPinCode}
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
                      value={newCustomerPhoneCountry}
                      onChange={setNewCustomerPhoneCountry}
                    />
                  </div>
                  <div className="phone-field">
                    <TextField
                      label="Phone"
                      labelHidden
                      type="tel"
                      value={newCustomerPhone}
                      onChange={setNewCustomerPhone}
                      autoComplete="tel"
                    />
                  </div>
                </div>
              </BlockStack>
            </BlockStack>
          </Modal.Section>
        </Modal>

        {/* Tags Modal */}
        <Modal
          open={tagsModalOpen}
          onClose={() => { }}
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

        {/* Send Invoice Modal */}
        {selectedCustomer && (
          <SendInvoiceModal
            isOpen={emailModalOpen}
            onClose={handleCloseEmailModal}
            customer={selectedCustomer}
          />
        )}
      </div>
    </>
  );
}

export default CreateOrder;
