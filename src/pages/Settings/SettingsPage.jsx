import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon, AppProvider } from '@shopify/polaris';
import {
  XIcon,
  SearchIcon,
  SettingsIcon,
  CreditCardIcon,
  PersonIcon,
  PaymentIcon,
  CartIcon,
  PersonFilledIcon,
  DeliveryIcon,
  TaxIcon,
  LocationIcon,
  AppsIcon,
  DomainIcon,
  NotificationIcon,
  DatabaseIcon,
  LanguageIcon,
  LockIcon,
  FileIcon,
  StoreIcon,
  ChevronRightIcon,
  MenuHorizontalIcon,
  FolderIcon,
  HashtagIcon,
  CodeIcon,
  QuestionCircleIcon,
  ClockIcon,
  KeyboardIcon,
  ListBulletedIcon,
} from '@shopify/polaris-icons';
import ShopifyHeader from '../../components/Shopifyheader';
import './settings.css';

// Settings navigation items
const settingsNavItems = [
  { id: 'general', label: 'General', icon: SettingsIcon },
  { id: 'plan', label: 'Plan', icon: FileIcon },
  { id: 'billing', label: 'Billing', icon: CreditCardIcon },
  { id: 'users', label: 'Users', icon: PersonIcon },
  { id: 'payments', label: 'Payments', icon: PaymentIcon },
  { id: 'checkout', label: 'Checkout', icon: CartIcon },
  { id: 'customer-accounts', label: 'Customer accounts', icon: PersonFilledIcon },
  { id: 'shipping', label: 'Shipping and delivery', icon: DeliveryIcon },
  { id: 'taxes', label: 'Taxes and duties', icon: TaxIcon },
  { id: 'locations', label: 'Locations', icon: LocationIcon },
  { id: 'apps', label: 'Apps and sales channels', icon: AppsIcon },
  { id: 'domains', label: 'Domains', icon: DomainIcon },
  { id: 'customer-events', label: 'Customer events', icon: NotificationIcon },
  { id: 'notifications', label: 'Notifications', icon: NotificationIcon },
  { id: 'metafields', label: 'Metafields and metaobjects', icon: DatabaseIcon },
  { id: 'languages', label: 'Languages', icon: LanguageIcon },
  { id: 'privacy', label: 'Customer privacy', icon: LockIcon },
  { id: 'policies', label: 'Policies', icon: FileIcon },
];

function SettingsPage() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('general');
  const [searchQuery, setSearchQuery] = useState('');
  const [hasChanges, setHasChanges] = useState(false);

  // Form state for General settings
  const [formState, setFormState] = useState({
    orderPrefix: '#SK',
    orderSuffix: '',
    backupRegion: 'India',
    unitSystem: 'Metric system',
    weightUnit: 'Gram (g)',
    timeZone: '(GMT+05:30) Chennai, Kolkata, Mumbai, New Delhi',
    fulfillmentOption: 'gift-cards',
    autoArchive: true,
  });

  const handleClose = useCallback(() => {
    navigate('/dashboard');
  }, [navigate]);

  const handleNavClick = useCallback((sectionId) => {
    setActiveSection(sectionId);
  }, []);

  const handleInputChange = useCallback((field, value) => {
    setFormState(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
  }, []);

  const handleSave = useCallback(() => {
    // Save logic here
    setHasChanges(false);
  }, []);

  const filteredNavItems = settingsNavItems.filter(item =>
    item.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderGeneralContent = () => (
    <>
      {/* Store Details */}
      <div className="settings-card">
        <div className="settings-card-header">
          <h2 className="settings-card-title">Store details</h2>
        </div>
        <div className="settings-card-content">
          <div className="store-details-item">
            <div className="store-details-icon">
              <Icon source={StoreIcon} />
            </div>
            <div className="store-details-content">
              <div className="store-details-label">skshafeen</div>
              <div className="store-details-value-inline">
                <span>skshafeen2022@gmail.com</span>
                <span className="dot">•</span>
                <span>9741113355</span>
              </div>
            </div>
          </div>
          <div className="store-details-item">
            <div className="store-details-icon">
              <Icon source={LocationIcon} />
            </div>
            <div className="store-details-content">
              <div className="store-details-label">Billing address</div>
              <div className="store-details-value">
                Shafeen Beauty, 25th 25th Main Road 1st Sector HSR Layout, 2456 MMABS, 560102 Bengaluru Karnataka, India
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Store Defaults */}
      <div className="settings-card">
        <div className="settings-card-header">
          <h2 className="settings-card-title">Store defaults</h2>
        </div>
        <div className="settings-card-content">
          {/* Currency Display */}
          <div className="settings-row">
            <div className="settings-row-header">
              <div className="settings-row-info">
                <div className="settings-row-label">Currency display</div>
                <div className="settings-row-description">
                  To manage the currencies customers see, go to <a href="#">Markets</a>
                </div>
              </div>
              <div className="settings-row-action">
                <span className="currency-badge">Indian Rupee (INR ₹)</span>
                <button className="currency-menu-btn">
                  <Icon source={MenuHorizontalIcon} />
                </button>
              </div>
            </div>
          </div>

          {/* Backup Region */}
          <div className="settings-row">
            <div className="settings-row-header">
              <div className="settings-row-info">
                <div className="settings-row-label">Backup Region</div>
              </div>
              <div className="settings-row-action">
                <div className="settings-select">
                  <div className="settings-select-wrapper">
                    <select
                      className="settings-select-input"
                      value={formState.backupRegion}
                      onChange={(e) => handleInputChange('backupRegion', e.target.value)}
                    >
                      <option value="India">India</option>
                      <option value="United States">United States</option>
                      <option value="Europe">Europe</option>
                      <option value="Asia Pacific">Asia Pacific</option>
                    </select>
                    <div className="settings-select-icon">
                      <Icon source={ChevronRightIcon} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="settings-helper-text" style={{ padding: '8px 0 0 0' }}>
              Determines settings for customers outside of your markets
            </div>
          </div>

          {/* Unit System and Weight Unit */}
          <div className="settings-row-inline">
            <div className="settings-field">
              <label className="settings-field-label">Unit system</label>
              <div className="settings-select-wrapper">
                <select
                  className="settings-select-input"
                  value={formState.unitSystem}
                  onChange={(e) => handleInputChange('unitSystem', e.target.value)}
                >
                  <option value="Metric system">Metric system</option>
                  <option value="Imperial system">Imperial system</option>
                </select>
                <div className="settings-select-icon">
                  <Icon source={ChevronRightIcon} />
                </div>
              </div>
            </div>
            <div className="settings-field">
              <label className="settings-field-label">Default weight unit</label>
              <div className="settings-select-wrapper">
                <select
                  className="settings-select-input"
                  value={formState.weightUnit}
                  onChange={(e) => handleInputChange('weightUnit', e.target.value)}
                >
                  <option value="Gram (g)">Gram (g)</option>
                  <option value="Kilogram (kg)">Kilogram (kg)</option>
                  <option value="Ounce (oz)">Ounce (oz)</option>
                  <option value="Pound (lb)">Pound (lb)</option>
                </select>
                <div className="settings-select-icon">
                  <Icon source={ChevronRightIcon} />
                </div>
              </div>
            </div>
          </div>

          {/* Time Zone */}
          <div className="settings-row">
            <div className="settings-field">
              <label className="settings-field-label">Time zone</label>
              <div className="settings-select-wrapper">
                <select
                  className="settings-select-input"
                  value={formState.timeZone}
                  onChange={(e) => handleInputChange('timeZone', e.target.value)}
                >
                  <option value="(GMT+05:30) Chennai, Kolkata, Mumbai, New Delhi">(GMT+05:30) Chennai, Kolkata, Mumbai, New Delhi</option>
                  <option value="(GMT+00:00) UTC">(GMT+00:00) UTC</option>
                  <option value="(GMT-05:00) Eastern Time">(GMT-05:00) Eastern Time</option>
                  <option value="(GMT-08:00) Pacific Time">(GMT-08:00) Pacific Time</option>
                </select>
                <div className="settings-select-icon">
                  <Icon source={ChevronRightIcon} />
                </div>
              </div>
            </div>
            <div className="settings-helper-text" style={{ padding: '8px 0 0 0' }}>
              Sets the time for when orders and analytics are recorded
            </div>
          </div>

          <div className="settings-row" style={{ borderBottom: 'none', paddingBottom: 0 }}>
            <div className="settings-row-description">
              To change your user level time zone and language visit your <a href="#">account settings</a>
            </div>
          </div>
        </div>
      </div>

      {/* Order ID */}
      <div className="settings-card">
        <div className="settings-card-header">
          <h2 className="settings-card-title">Order ID</h2>
        </div>
        <div className="settings-card-content">
          <div className="settings-row" style={{ borderBottom: 'none', paddingBottom: '8px' }}>
            <div className="settings-row-description" style={{ marginBottom: '16px' }}>
              Shown on the order page, customer pages, and customer order notifications to identify order
            </div>
          </div>
          <div className="settings-row-inline" style={{ paddingTop: 0 }}>
            <div className="settings-field">
              <label className="settings-field-label">Prefix</label>
              <input
                type="text"
                className="settings-text-input"
                value={formState.orderPrefix}
                onChange={(e) => handleInputChange('orderPrefix', e.target.value)}
                placeholder="#"
              />
            </div>
            <div className="settings-field">
              <label className="settings-field-label">Suffix</label>
              <input
                type="text"
                className="settings-text-input"
                value={formState.orderSuffix}
                onChange={(e) => handleInputChange('orderSuffix', e.target.value)}
                placeholder=""
              />
            </div>
          </div>
          <div className="order-id-preview">
            Your order ID will appear as {formState.orderPrefix}1001, {formState.orderPrefix}1002, {formState.orderPrefix}1003 ...
          </div>
        </div>
      </div>

      {/* Order Processing */}
      <div className="settings-card">
        <div className="settings-card-header">
          <h2 className="settings-card-title">
            <span className="settings-card-title-with-icon">
              Order processing
              <span className="settings-info-icon">
                <Icon source={QuestionCircleIcon} />
              </span>
            </span>
          </h2>
        </div>
        <div className="settings-card-content">
          <div className="settings-radio-group">
            <div className="settings-radio-group-label">After an order has been paid</div>
            <div className="settings-radio-options">
              <label className="settings-radio-option">
                <input
                  type="radio"
                  name="fulfillment"
                  className="settings-radio-input"
                  value="auto-fulfill"
                  checked={formState.fulfillmentOption === 'auto-fulfill'}
                  onChange={(e) => handleInputChange('fulfillmentOption', e.target.value)}
                />
                <span className="settings-radio-label">Automatically fulfill the order's line items</span>
              </label>
              <label className="settings-radio-option">
                <input
                  type="radio"
                  name="fulfillment"
                  className="settings-radio-input"
                  value="gift-cards"
                  checked={formState.fulfillmentOption === 'gift-cards'}
                  onChange={(e) => handleInputChange('fulfillmentOption', e.target.value)}
                />
                <span className="settings-radio-label">Automatically fulfill only the gift cards of the order</span>
              </label>
              <label className="settings-radio-option">
                <input
                  type="radio"
                  name="fulfillment"
                  className="settings-radio-input"
                  value="no-auto"
                  checked={formState.fulfillmentOption === 'no-auto'}
                  onChange={(e) => handleInputChange('fulfillmentOption', e.target.value)}
                />
                <span className="settings-radio-label">Don't fulfill any of the order's line items automatically</span>
              </label>
            </div>
          </div>

          <div className="settings-checkbox-group">
            <div className="settings-radio-group-label">After an order has been fulfilled and paid, or when all items have been refunded</div>
            <label className="settings-checkbox-option">
              <input
                type="checkbox"
                className="settings-checkbox-input"
                checked={formState.autoArchive}
                onChange={(e) => handleInputChange('autoArchive', e.target.checked)}
              />
              <div className="settings-checkbox-content">
                <span className="settings-checkbox-label">Automatically archive the order</span>
                <span className="settings-checkbox-description">The order will be removed from your list of open orders.</span>
              </div>
            </label>
          </div>
        </div>
      </div>

      {/* Store Assets */}
      <div className="settings-card">
        <div className="settings-card-header">
          <h2 className="settings-card-title">Store assets</h2>
        </div>
        <div className="settings-card-content">
          <div className="settings-link-item">
            <div className="settings-link-icon">
              <Icon source={FolderIcon} />
            </div>
            <div className="settings-link-content">
              <div className="settings-link-title">Metafields</div>
              <div className="settings-link-description">Available in themes and configurable for Storefront API</div>
            </div>
            <div className="settings-link-arrow">
              <Icon source={ChevronRightIcon} />
            </div>
          </div>
          <div className="settings-link-item">
            <div className="settings-link-icon">
              <Icon source={HashtagIcon} />
            </div>
            <div className="settings-link-content">
              <div className="settings-link-title">Brand</div>
              <div className="settings-link-description">Integrate brand assets across sales channels, themes and apps</div>
            </div>
            <div className="settings-link-arrow">
              <Icon source={ChevronRightIcon} />
            </div>
          </div>
        </div>
      </div>

      {/* Resources */}
      <div className="settings-card">
        <div className="settings-card-header">
          <h2 className="settings-card-title">Resources</h2>
        </div>
        <div className="settings-card-content">
          <div className="settings-resource-item">
            <div className="settings-resource-info">
              <div className="settings-resource-icon">
                <Icon source={ListBulletedIcon} />
              </div>
              <span className="settings-resource-label">Change log</span>
            </div>
            <button className="settings-resource-btn">View change log</button>
          </div>
          <div className="settings-resource-item">
            <div className="settings-resource-info">
              <div className="settings-resource-icon">
                <Icon source={QuestionCircleIcon} />
              </div>
              <span className="settings-resource-label">Shopify Help Center</span>
            </div>
            <button className="settings-resource-btn">Get help</button>
          </div>
          <div className="settings-resource-item">
            <div className="settings-resource-info">
              <div className="settings-resource-icon">
                <Icon source={CodeIcon} />
              </div>
              <span className="settings-resource-label">Hire a Shopify Partner</span>
            </div>
            <button className="settings-resource-btn">Hire a Partner</button>
          </div>
        </div>
      </div>

      {/* Additional Navigation Items */}
      <div className="settings-card">
        <div className="settings-card-content">
          <div className="settings-nav-item-row">
            <div className="settings-nav-item-info">
              <div className="settings-nav-item-icon-left">
                <Icon source={KeyboardIcon} />
              </div>
              <span className="settings-nav-item-label">Keyboard shortcuts</span>
            </div>
            <div className="settings-link-arrow">
              <Icon source={ChevronRightIcon} />
            </div>
          </div>
          <div className="settings-nav-item-row">
            <div className="settings-nav-item-info">
              <div className="settings-nav-item-icon-left">
                <Icon source={ClockIcon} />
              </div>
              <span className="settings-nav-item-label">Store activity log</span>
            </div>
            <div className="settings-link-arrow">
              <Icon source={ChevronRightIcon} />
            </div>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="settings-save-container">
        <button
          className={`settings-save-btn ${hasChanges ? 'active' : ''}`}
          onClick={handleSave}
          disabled={!hasChanges}
        >
          Save
        </button>
      </div>
    </>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'general':
        return renderGeneralContent();
      default:
        return (
          <div className="settings-card">
            <div className="settings-card-header">
              <h2 className="settings-card-title">{settingsNavItems.find(item => item.id === activeSection)?.label || 'Settings'}</h2>
            </div>
            <div className="settings-card-content">
              <div className="settings-row">
                <div className="settings-row-description">
                  This section is under development.
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <AppProvider i18n={{}}>
      <div className="settings-page">
        {/* Header */}
        <div className="settings-header">
          <ShopifyHeader />
        </div>

        {/* Main Body Wrapper */}
        <div className="settings-body-wrapper">
          <div className="settings-body">
            {/* Close Button - Inside panel, top right */}
            <div className="settings-close-btn-container">
              <button className="settings-close-btn" onClick={handleClose}>
                <Icon source={XIcon} />
              </button>
            </div>

            {/* Sidebar */}
            <div className="settings-sidebar">
              {/* Store Info */}
              <div className="settings-store-info">
                <div className="settings-store-info-content">
                  <div className="settings-store-avatar">sks</div>
                  <div className="settings-store-details">
                    <div className="settings-store-name">skshafeen</div>
                    <div className="settings-store-url">www.shafeenbeauty.com</div>
                  </div>
                </div>
              </div>

              {/* Search */}
              <div className="settings-search">
                <div className="settings-search-wrapper">
                  <div className="settings-search-icon">
                    <Icon source={SearchIcon} />
                  </div>
                  <input
                    type="text"
                    className="settings-search-input"
                    placeholder="Search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              {/* Navigation */}
              <nav className="settings-nav">
                {filteredNavItems.map((item) => (
                  <button
                    key={item.id}
                    className={`settings-nav-item ${activeSection === item.id ? 'active' : ''}`}
                    onClick={() => handleNavClick(item.id)}
                  >
                    <span className="settings-nav-item-icon">
                      <Icon source={item.icon} />
                    </span>
                    {item.label}
                  </button>
                ))}
              </nav>

              {/* User Info */}
              <div className="settings-user-info">
                <div className="settings-user-content">
                  <div className="settings-user-avatar">SK</div>
                  <div className="settings-user-details">
                    <div className="settings-user-name">Shafeen Khaan</div>
                    <div className="settings-user-email">skshafeen2022@gmail.com</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="settings-content">
              <div className="settings-content-inner">
                {/* Page Title */}
                <div className="settings-page-title">
                  <span className="settings-page-title-icon">
                    <Icon source={SettingsIcon} />
                  </span>
                  <h1>{settingsNavItems.find(item => item.id === activeSection)?.label || 'General'}</h1>
                </div>

                {renderContent()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppProvider>
  );
}

export default SettingsPage;