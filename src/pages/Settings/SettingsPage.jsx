'use client';

import { useState, useCallback, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Icon, AppProvider, Button } from '@shopify/polaris';
import {
  XIcon,
  SettingsIcon,
  CreditCardIcon,
  PersonIcon,
  AppsIcon,
  NotificationIcon,
  ArrowLeftIcon,
} from '@shopify/polaris-icons';
import ShopifyHeader from '@components/Shopifyheader';
import SettingsNavigation, { settingsNavItems } from '@components/Settings/SettingsNavigation';
import GeneralSettings from '@components/Settings/GeneralSettings';
import PlanSettings from '@components/Settings/PlanSettings';
import BillingSettings from '@components/Settings/BillingSettings';
import UsersSettings from '@components/Settings/UsersSettings';
import RolesSettings from '@components/Settings/RolesSettings';
import SecuritySettings from '@components/Settings/SecuritySettings';
import TransactionsSettings from '@components/Settings/TransactionsSettings';
import AppsSettings from '@components/Settings/AppsSettings';
import NotificationsSettings from '@components/Settings/NotificationsSettings';
import '@components/Settings/styles/SettingsLayout.css';
import '@components/Settings/styles/SettingsResponsive.css';

function SettingsPageContent({ userType = 'owners', initialPage }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mounted, setMounted] = useState(false);

  // Check if this is a developer/real-estate user type
  const isDeveloperType = userType === 'property-developer' || userType === 'real-estate-company';

  // Default to 'roles-permissions' for developer types, 'general' for others
  const defaultSection = isDeveloperType ? 'roles-permissions' : 'general';

  const [activeSection, setActiveSection] = useState(initialPage || defaultSection);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobile, setIsMobile] = useState(false);
  const [showMobileNav, setShowMobileNav] = useState(true);

  // Handle mounting and initial setup
  useEffect(() => {
    setMounted(true);
    const section = searchParams.get('section');
    if (section) {
      setActiveSection(section);
    } else if (initialPage) {
      setActiveSection(initialPage);
    } else if (isDeveloperType) {
      setActiveSection('roles-permissions');
    }
  }, [searchParams, initialPage, isDeveloperType]);

  // Check if mobile on mount and resize
  useEffect(() => {
    if (!mounted) return;

    const checkMobile = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      // On desktop, always show content (nav is sidebar)
      if (!mobile) {
        setShowMobileNav(false);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [mounted]);

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

  // Users section state
  const [showExportModal, setShowExportModal] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const handleClose = useCallback(() => {
    router.push(`/${userType}`);
  }, [router, userType]);

  const handleNavClick = useCallback((sectionId) => {
    setActiveSection(sectionId);
    // Only update URL for non-developer types (when showing full settings menu)
    // For developer types, SettingsPage is embedded in Dashboard so don't change URL
    if (!isDeveloperType) {
      router.push(`/settings?section=${sectionId}`, { scroll: false });
    }
    // On mobile, switch to content view after selecting
    if (isMobile) {
      setShowMobileNav(false);
    }
  }, [router, isMobile, isDeveloperType]);

  const handleMobileBack = useCallback(() => {
    setShowMobileNav(true);
  }, []);

  // Get current section icon
  const getSectionIcon = () => {
    const item = settingsNavItems.find(item => item.id === activeSection);
    return item?.icon || SettingsIcon;
  };

  const handleInputChange = useCallback((field, value) => {
    setFormState(prev => ({ ...prev, [field]: value }));
  }, []);

  // Helper to find label for any section (including sub-items)
  const getSectionLabel = (sectionId) => {
    for (const item of settingsNavItems) {
      if (item.id === sectionId) return item.label;
      if (item.subItems) {
        const subItem = item.subItems.find(sub => sub.id === sectionId);
        if (subItem) return subItem.label;
      }
    }
    return 'Settings';
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'general':
        return <GeneralSettings formState={formState} onInputChange={handleInputChange} />;
      case 'plan':
        return <PlanSettings />;
      case 'billing':
        return <BillingSettings />;
      case 'users':
        return (
          <UsersSettings
            showExportModal={showExportModal}
            setShowExportModal={setShowExportModal}
            showUpgradeModal={showUpgradeModal}
            setShowUpgradeModal={setShowUpgradeModal}
          />
        );
      case 'roles':
        return <RolesSettings />;
      case 'security':
        return <SecuritySettings />;
      case 'transactions':
        return <TransactionsSettings />;
      case 'apps':
        return <AppsSettings />;
      case 'notifications':
        return <NotificationsSettings />;
      case 'roles-permissions':
        return (
          <div className="settings-card">
            <div className="settings-card-header">
              <h2 className="settings-card-title">Roles & Permissions</h2>
            </div>
            <div className="settings-card-content">
              <div className="settings-row">
                <div className="settings-row-description">
                  Manage user roles and access permissions for your organization.
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return (
          <div className="settings-card">
            <div className="settings-card-header">
              <h2 className="settings-card-title">{getSectionLabel(activeSection)}</h2>
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

  // Determine mobile view state class
  const mobileStateClass = isMobile
    ? (showMobileNav ? 'mobile-nav-visible' : 'mobile-content-visible')
    : '';

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return (
      <AppProvider i18n={{}}>
        <div className="settings-page" style={{ background: '#f6f6f7', minHeight: '100vh' }} />
      </AppProvider>
    );
  }

  return (
    <AppProvider i18n={{}}>
      <div className={`settings-page ${mobileStateClass}`}>
        {/* Header */}
        <div className="settings-header">
          <ShopifyHeader userType={userType} />
        </div>

        {/* Mobile Sub-header - Shows back button when viewing content */}
        {isMobile && !showMobileNav && (
          <div className="settings-mobile-header">
            <div className="settings-mobile-header-left">
              <button className="settings-mobile-back-btn" onClick={handleMobileBack}>
                <Icon source={ArrowLeftIcon} />
                <span>Settings</span>
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
            {/* Close Button - Inside panel, top right (desktop only) */}
            <div className="settings-close-btn-container">
              <button className="settings-close-btn" onClick={handleClose}>
                <Icon source={XIcon} />
              </button>
            </div>

            {/* Sidebar - On mobile, only show when showMobileNav is true */}
            {(!isMobile || showMobileNav) && (
              <SettingsNavigation
                activeSection={activeSection}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                onNavClick={handleNavClick}
                isMobile={isMobile}
                onMobileItemClick={() => setShowMobileNav(false)}
                showRolesPermissions={isDeveloperType}
              />
            )}

            {/* Content - On mobile, only show when showMobileNav is false */}
            {(!isMobile || !showMobileNav) && (
              <div className="settings-content">
                <div className="settings-content-inner">
                  {/* Mobile Page Title */}
                  {isMobile && (
                    <div className="settings-mobile-page-header">
                      <span className="settings-mobile-page-icon">
                        <Icon source={getSectionIcon()} />
                      </span>
                      <h1 className="settings-mobile-page-title">
                        {settingsNavItems.find(item => item.id === activeSection)?.label || 'General'}
                      </h1>
                    </div>
                  )}

                  {/* Desktop Page Title */}
                  <div className="settings-page-title-row">
                    <div className="settings-page-title">
                      <span className="settings-page-title-icon">
                        <Icon source={activeSection === 'billing' ? CreditCardIcon : activeSection === 'users' ? PersonIcon : activeSection === 'apps' ? AppsIcon : activeSection === 'notifications' ? NotificationIcon : SettingsIcon} />
                      </span>
                      <h1>{settingsNavItems.find(item => item.id === activeSection)?.label || 'General'}</h1>
                    </div>
                    {activeSection === 'billing' && (
                      <Button icon={CreditCardIcon} onClick={() => router.push('/settings/billing/profile?invoiceStatus=paid')}>Billing profile</Button>
                    )}
                    {activeSection === 'users' && (
                      <div className="settings-page-title-actions">
                        <Button onClick={() => setShowExportModal(true)}>Export</Button>
                        <Button variant="primary" onClick={() => setShowUpgradeModal(true)}>Add users</Button>
                      </div>
                    )}
                    {activeSection === 'apps' && (
                      <div className="settings-page-title-actions">
                        <div className="apps-develop-btn-wrapper">
                          <Button onClick={() => router.push('/settings/app-development')}>Develop apps</Button>
                        </div>
                        <Button variant="primary">Shopify App Store</Button>
                      </div>
                    )}
                  </div>

                  {renderContent()}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppProvider>
  );
}

function SettingsPage({ userType, initialPage }) {
  return (
    <Suspense fallback={
      <AppProvider i18n={{}}>
        <div className="settings-page" style={{ background: '#f6f6f7', minHeight: '100vh' }} />
      </AppProvider>
    }>
      <SettingsPageContent userType={userType} initialPage={initialPage} />
    </Suspense>
  );
}

export default SettingsPage;
