'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Icon, AppProvider, Button, TextField, Select, Checkbox } from '@shopify/polaris';
import {
  XIcon,
  MenuHorizontalIcon,
  LocationIcon,
  QuestionCircleIcon,
  PlusCircleIcon,
  ReceiptDollarIcon,
  SearchIcon,
  InfoIcon,
  ArrowLeftIcon,
} from '@shopify/polaris-icons';
import ShopifyHeader from '@components/Shopifyheader';
import SettingsNavigation from '@components/Settings/SettingsNavigation';
import PhoneInput from '@components/ui/PhoneInput';
import '@/views/Settings/settings.css';
import '@components/Settings/styles/SettingsLayout.css';
import '@components/Settings/styles/SettingsResponsive.css';
import '@components/Settings/styles/BillingSettings.css';

// Indian states for dropdown
const indianStates = [
  'Andaman and Nicobar Islands',
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chandigarh',
  'Chhattisgarh',
  'Delhi',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
];

function BillingProfilePage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [showReplaceCardModal, setShowReplaceCardModal] = useState(false);
  const [showAddUPIModal, setShowAddUPIModal] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showMobileNav, setShowMobileNav] = useState(true);

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (!mobile) {
        setShowMobileNav(false);
      }
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Replace card form state
  const [cardForm, setCardForm] = useState({
    cardNumber: '',
    expires: '',
    cvv: '',
    country: 'India',
    firstName: 'Shafeen',
    lastName: 'Khaan',
    address: '25th 25th Main Road 1st Sector HSR Layout',
    apartment: '2456 MMABS',
    city: 'Bengaluru',
    state: 'Andaman and Nicobar Islands',
    pinCode: '560102',
    phone: '',
    email: '',
    consent: false,
  });

  // Add UPI form state
  const [upiForm, setUpiForm] = useState({
    paymentMethodType: 'UPI',
    upiId: '',
    firstName: 'Shafeen',
    lastName: 'Khaan',
    phone: '',
    email: 'skshafeen2022@gmail.com',
  });

  const handleClose = useCallback(() => {
    router.push('/dashboard');
  }, [router]);

  const handleNavClick = useCallback((sectionId) => {
    router.push(`/settings?section=${sectionId}`);
  }, [router]);

  const handleMobileBack = useCallback(() => {
    router.push('/settings?section=billing');
  }, [router]);

  const mobileStateClass = isMobile
    ? (showMobileNav ? 'mobile-nav-visible' : 'mobile-content-visible')
    : '';

  const handleReplaceCard = () => {
    setShowReplaceCardModal(true);
  };

  const handleAddPaymentMethod = () => {
    setShowAddUPIModal(true);
  };

  const handleManageAddress = () => {
    router.push('/settings?section=general');
  };

  const handleManageCurrency = () => {
    router.push('/settings?section=general');
  };

  // Render Replace Credit Card Modal
  const renderReplaceCardModal = () => {
    if (!showReplaceCardModal) return null;

    return (
      <div className="billing-modal-overlay" onClick={() => setShowReplaceCardModal(false)}>
        <div className="billing-modal billing-modal-wide" onClick={(e) => e.stopPropagation()}>
          <div className="billing-modal-header billing-modal-header-gray">
            <span className="billing-modal-title-small">Replace credit card</span>
            <button className="billing-modal-close" onClick={() => setShowReplaceCardModal(false)}>
              <Icon source={XIcon} />
            </button>
          </div>
          <div className="billing-modal-content">
            <div className="billing-form-group">
              <TextField
                label="Card number"
                value={cardForm.cardNumber}
                onChange={(value) => setCardForm({ ...cardForm, cardNumber: value })}
                placeholder=""
                suffix={
                  <div className="card-icon-suffix">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect x="2" y="4" width="16" height="12" rx="2" stroke="currentColor" strokeWidth="1.5"/>
                      <path d="M2 8H18" stroke="currentColor" strokeWidth="1.5"/>
                    </svg>
                  </div>
                }
              />
            </div>
            <div className="billing-form-row">
              <div className="billing-form-group billing-form-half">
                <TextField
                  label="Expires"
                  value={cardForm.expires}
                  onChange={(value) => setCardForm({ ...cardForm, expires: value })}
                  placeholder="MM / YY"
                />
              </div>
              <div className="billing-form-group billing-form-half">
                <TextField
                  label="CVV"
                  value={cardForm.cvv}
                  onChange={(value) => setCardForm({ ...cardForm, cvv: value })}
                  suffix={
                    <div className="billing-info-suffix">
                      <Icon source={InfoIcon} />
                    </div>
                  }
                />
              </div>
            </div>

            <h3 className="billing-form-section-title">Billing address</h3>

            <div className="billing-form-group">
              <Select
                label="Country/region"
                options={[
                  { label: 'India', value: 'India' },
                  { label: 'United States', value: 'United States' },
                  { label: 'United Kingdom', value: 'United Kingdom' },
                ]}
                value={cardForm.country}
                onChange={(value) => setCardForm({ ...cardForm, country: value })}
              />
            </div>

            <div className="billing-form-row">
              <div className="billing-form-group billing-form-half">
                <TextField
                  label="First name"
                  value={cardForm.firstName}
                  onChange={(value) => setCardForm({ ...cardForm, firstName: value })}
                />
              </div>
              <div className="billing-form-group billing-form-half">
                <TextField
                  label="Last name"
                  value={cardForm.lastName}
                  onChange={(value) => setCardForm({ ...cardForm, lastName: value })}
                />
              </div>
            </div>

            <div className="billing-form-group">
              <TextField
                label="Address"
                value={cardForm.address}
                onChange={(value) => setCardForm({ ...cardForm, address: value })}
                prefix={
                  <div className="address-search-prefix">
                    <Icon source={SearchIcon} />
                  </div>
                }
              />
            </div>

            <div className="billing-form-group">
              <TextField
                label="Apartment, suite, etc"
                value={cardForm.apartment}
                onChange={(value) => setCardForm({ ...cardForm, apartment: value })}
              />
            </div>

            <div className="billing-form-row">
              <div className="billing-form-group billing-form-half">
                <TextField
                  label="City"
                  value={cardForm.city}
                  onChange={(value) => setCardForm({ ...cardForm, city: value })}
                />
              </div>
              <div className="billing-form-group billing-form-half">
                <Select
                  label="State"
                  options={indianStates.map(state => ({ label: state, value: state }))}
                  value={cardForm.state}
                  onChange={(value) => setCardForm({ ...cardForm, state: value })}
                />
              </div>
            </div>

            <div className="billing-form-group">
              <TextField
                label="PIN code"
                value={cardForm.pinCode}
                onChange={(value) => setCardForm({ ...cardForm, pinCode: value })}
              />
            </div>

            <div className="billing-form-group">
              <label className="billing-phone-label">Phone</label>
              <div className="billing-phone-input-wrapper">
                <div className="billing-country-select">
                  <div className="billing-country-flag">
                    <svg width="20" height="15" viewBox="0 0 20 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect width="20" height="5" fill="#FF9933" />
                      <rect y="5" width="20" height="5" fill="#FFFFFF" />
                      <rect y="10" width="20" height="5" fill="#138808" />
                      <circle cx="10" cy="7.5" r="2" fill="#000080" />
                    </svg>
                  </div>
                  <Select
                    label="Country code"
                    labelHidden
                    options={[
                      { label: '+91', value: 'IN' },
                      { label: '+1', value: 'US' },
                      { label: '+44', value: 'GB' },
                    ]}
                    value="IN"
                    onChange={() => {}}
                  />
                </div>
                <div className="billing-phone-field">
                  <TextField
                    label="Phone"
                    labelHidden
                    value={cardForm.phone}
                    onChange={(value) => setCardForm({ ...cardForm, phone: value })}
                    type="tel"
                  />
                </div>
              </div>
            </div>

            <div className="billing-form-group">
              <TextField
                label="Email"
                value={cardForm.email}
                onChange={(value) => setCardForm({ ...cardForm, email: value })}
                type="email"
              />
            </div>

            <div className="billing-form-group">
              <Checkbox
                label="I consent to having my card saved securely for future payments"
                checked={cardForm.consent}
                onChange={(value) => setCardForm({ ...cardForm, consent: value })}
              />
            </div>
          </div>
          <div className="billing-modal-footer">
            <Button onClick={() => setShowReplaceCardModal(false)}>Cancel</Button>
            <Button variant="primary" onClick={() => setShowReplaceCardModal(false)}>Save card</Button>
          </div>
        </div>
      </div>
    );
  };

  // Render Add UPI Modal
  const renderAddUPIModal = () => {
    if (!showAddUPIModal) return null;

    return (
      <div className="billing-modal-overlay" onClick={() => setShowAddUPIModal(false)}>
        <div className="billing-modal billing-modal-upi" onClick={(e) => e.stopPropagation()}>
          <div className="billing-modal-header billing-modal-header-upi">
            <span className="billing-modal-title-upi">Add UPI account</span>
            <button className="billing-modal-close" onClick={() => setShowAddUPIModal(false)}>
              <Icon source={XIcon} />
            </button>
          </div>
          <div className="billing-modal-content">
            <div className="billing-form-group">
              <Select
                label="Payment method type"
                options={[
                  { label: 'UPI', value: 'UPI' },
                  { label: 'Credit Card', value: 'Credit Card' },
                  { label: 'Debit Card', value: 'Debit Card' },
                  { label: 'Net Banking', value: 'Net Banking' },
                ]}
                value={upiForm.paymentMethodType}
                onChange={(value) => setUpiForm({ ...upiForm, paymentMethodType: value })}
              />
            </div>

            <div className="billing-form-group">
              <TextField
                label="Enter a UPI ID"
                value={upiForm.upiId}
                onChange={(value) => setUpiForm({ ...upiForm, upiId: value })}
                placeholder=""
              />
            </div>

            <div className="billing-form-group">
              <TextField
                label="First Name"
                value={upiForm.firstName}
                onChange={(value) => setUpiForm({ ...upiForm, firstName: value })}
              />
            </div>

            <div className="billing-form-group">
              <TextField
                label="Last Name"
                value={upiForm.lastName}
                onChange={(value) => setUpiForm({ ...upiForm, lastName: value })}
              />
            </div>

            <div className="billing-form-group">
              <TextField
                label="Phone"
                value={upiForm.phone}
                onChange={(value) => setUpiForm({ ...upiForm, phone: value })}
                type="tel"
              />
            </div>

            <div className="billing-form-group">
              <TextField
                label="Email"
                value={upiForm.email}
                onChange={(value) => setUpiForm({ ...upiForm, email: value })}
                type="email"
              />
            </div>
          </div>
          <div className="billing-modal-footer">
            <Button onClick={() => setShowAddUPIModal(false)}>Cancel</Button>
            <Button variant="primary" onClick={() => setShowAddUPIModal(false)}>Submit</Button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <AppProvider i18n={{}}>
      <div className={`settings-page ${mobileStateClass}`}>
        {/* Header - Hidden on mobile */}
        <div className="settings-header">
          <ShopifyHeader />
        </div>

        {/* Mobile Header */}
        {isMobile && (
          <div className="settings-mobile-header">
            <div className="settings-mobile-header-left">
              <button className="settings-mobile-back-btn" onClick={handleMobileBack}>
                <Icon source={ArrowLeftIcon} />
                <span>Billing</span>
              </button>
            </div>
            <button className="settings-mobile-close-btn" onClick={handleClose}>
              <Icon source={XIcon} />
            </button>
          </div>
        )}

        {/* Main Body Wrapper */}
        <div className="settings-body-wrapper">
          <div className="settings-body">
            {/* Close Button - Inside panel, top right */}
            <div className="settings-close-btn-container">
              <button className="settings-close-btn" onClick={handleClose}>
                <Icon source={XIcon} />
              </button>
            </div>

            {/* Sidebar - Hidden on mobile for sub-pages */}
            {!isMobile && (
              <SettingsNavigation
                activeSection="billing"
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                onNavClick={handleNavClick}
              />
            )}

            {/* Content */}
            <div className="settings-content settings-content-full">
              <div className="settings-content-inner">
                {/* Page Header */}
                <div className="billing-profile-page-header">
                  <div className="billing-profile-page-title">
                    <span className="billing-profile-page-icon">
                      <Icon source={ReceiptDollarIcon} />
                    </span>
                    <span className="billing-profile-breadcrumb-separator">›</span>
                    <h1 className="billing-profile-breadcrumb-title">Billing profile</h1>
                  </div>
                  <p className="billing-profile-page-subtitle">Your payment methods, tax ID, billing currency and store address</p>
                </div>

                {/* Payment Methods */}
                <div className="settings-card">
                  <div className="settings-card-header-no-border">
                    <h2 className="settings-card-title">Payment methods</h2>
                  </div>
                  <div className="billing-profile-card-description">
                    For purchases and bills in Shopify
                  </div>
                  <div className="settings-card-content">
                    <div className="billing-profile-bordered-content">
                      <div className="billing-profile-payment-item">
                        <div className="billing-card-icon">
                          <div className="mastercard-icon">
                            <div className="mastercard-circles">
                              <div className="mc-circle mc-red"></div>
                              <div className="mc-circle mc-orange"></div>
                            </div>
                          </div>
                        </div>
                        <span className="billing-profile-card-text">Mastercard •••• 0095</span>
                        <span className="billing-profile-primary-badge">Primary</span>
                        <button className="billing-menu-btn" onClick={handleReplaceCard}>
                          <Icon source={MenuHorizontalIcon} />
                        </button>
                      </div>
                      <div className="billing-profile-divider"></div>
                      <div className="billing-profile-add-method" onClick={handleAddPaymentMethod}>
                        <div className="billing-profile-add-method-content">
                          <Icon source={PlusCircleIcon} />
                          <span>Add payment method</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tax ID */}
                <div className="settings-card">
                  <div className="settings-card-header-no-border">
                    <h2 className="settings-card-title">
                      <span className="billing-profile-title-with-icon">
                        Tax ID
                        <span className="billing-profile-info-icon">
                          <Icon source={QuestionCircleIcon} />
                        </span>
                      </span>
                    </h2>
                  </div>
                  <div className="billing-profile-card-description">
                    Shopify is required to charge Goods and Services Tax (GST) in India. Your Shopify bills may be exempt from Indian GST if you are GST registered in India and enter a valid GSTIN
                  </div>
                  <div className="settings-card-content">
                    <div className="billing-profile-bordered-content">
                      <div className="billing-profile-gstin-item">
                        <div className="billing-profile-gstin-icon">
                          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M10 2C5.58 2 2 5.58 2 10C2 14.42 5.58 18 10 18C14.42 18 18 14.42 18 10C18 5.58 14.42 2 10 2ZM10 16C6.69 16 4 13.31 4 10C4 6.69 6.69 4 10 4C13.31 4 16 6.69 16 10C16 13.31 13.31 16 10 16Z" fill="currentColor"/>
                            <path d="M10 6C8.9 6 8 6.9 8 8H10V10H8C8 11.1 8.9 12 10 12C11.1 12 12 11.1 12 10V8C12 6.9 11.1 6 10 6Z" fill="currentColor"/>
                          </svg>
                        </div>
                        <div className="billing-profile-gstin-content">
                          <div className="billing-profile-gstin-label">GSTIN</div>
                          <div className="billing-profile-gstin-value">29AEVFS6468K1ZS</div>
                        </div>
                        <button className="billing-menu-btn">
                          <Icon source={MenuHorizontalIcon} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Address and Currency */}
                <div className="settings-card">
                  <div className="settings-card-header-no-border">
                    <h2 className="settings-card-title">
                      <span className="billing-profile-title-with-icon">
                        Address and currency
                        <span className="billing-profile-info-icon">
                          <Icon source={QuestionCircleIcon} />
                        </span>
                      </span>
                    </h2>
                  </div>
                  <div className="billing-profile-card-description">
                    The options for your billing currency are determined by your billing address
                  </div>
                  <div className="settings-card-content">
                    <div className="billing-profile-bordered-content">
                      <div className="billing-profile-address-item">
                        <div className="billing-profile-address-icon">
                          <Icon source={LocationIcon} />
                        </div>
                        <div className="billing-profile-address-content">
                          <div className="billing-profile-address-label">Store address</div>
                          <div className="billing-profile-address-value">Shafeen Beauty, 25th 25th Main Road 1st Sector HSR Layout, 2456 MMABS, 560102 Bengaluru Karnataka, India</div>
                        </div>
                        <Button size="slim" onClick={handleManageAddress}>Manage</Button>
                      </div>
                      <div className="billing-profile-divider"></div>
                      <div className="billing-profile-address-item">
                        <div className="billing-profile-address-icon">
                          <Icon source={ReceiptDollarIcon} />
                        </div>
                        <div className="billing-profile-address-content">
                          <div className="billing-profile-address-label">Currency</div>
                          <div className="billing-profile-address-value">INR (Indian Rupee)</div>
                        </div>
                        <Button size="slim" onClick={handleManageCurrency}>Manage</Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modals */}
        {renderReplaceCardModal()}
        {renderAddUPIModal()}
      </div>
    </AppProvider>
  );
}

export default BillingProfilePage;
