'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Icon, AppProvider, Button } from '@shopify/polaris';
import {
  XIcon,
  AppsIcon,
  SearchIcon,
  ChevronDownIcon,
  AlertTriangleIcon,
  ArrowLeftIcon,
} from '@shopify/polaris-icons';
import ShopifyHeader from '../../../src/components/Shopifyheader';
import SettingsNavigation from '../../../src/pages/Settings/components/SettingsNavigation';
import '../../../src/pages/Settings/components/styles/SettingsLayout.css';
import '../../../src/pages/Settings/components/styles/SettingsResponsive.css';
import '../../../src/pages/Settings/components/styles/AppDevelopment.css';

// Legacy custom apps data
const legacyApps = [
  { id: 'fastrr', name: 'FastrrV3' },
  { id: 'shafeen', name: 'Shafeen Products Import' },
];

function AppDevelopmentPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterQuery, setFilterQuery] = useState('');
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

  const handleClose = useCallback(() => {
    router.push('/dashboard');
  }, [router]);

  const handleNavClick = useCallback((sectionId) => {
    router.push(`/settings?section=${sectionId}`);
  }, [router]);

  const handleMobileBack = useCallback(() => {
    router.push('/settings?section=apps');
  }, [router]);

  const mobileStateClass = isMobile
    ? (showMobileNav ? 'mobile-nav-visible' : 'mobile-content-visible')
    : '';

  // Filter apps based on search
  const filteredApps = legacyApps.filter(app =>
    app.name.toLowerCase().includes(filterQuery.toLowerCase())
  );

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
                <span>Apps and sales channels</span>
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
            {/* Close Button */}
            <div className="settings-close-btn-container">
              <button className="settings-close-btn" onClick={handleClose}>
                <Icon source={XIcon} />
              </button>
            </div>

            {/* Sidebar - Hidden on mobile for sub-pages */}
            {!isMobile && (
              <SettingsNavigation
                activeSection="apps"
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                onNavClick={handleNavClick}
              />
            )}

            {/* Content */}
            <div className="settings-content settings-content-full">
              <div className="settings-content-inner">
                {/* Page Title */}
                <div className="settings-page-title-row">
                  <div className="settings-page-title">
                    <span className="settings-page-title-icon">
                      <Icon source={AppsIcon} />
                    </span>
                    <span className="settings-page-breadcrumb-separator">›</span>
                    <h1>App development</h1>
                  </div>
                </div>

                {/* Dev Dashboard Promo Card */}
                <div className="settings-card app-dev-promo-card">
                  <div className="app-dev-promo-content">
                    <div className="app-dev-promo-text">
                      <h2 className="app-dev-promo-title">Build and manage apps in your Dev Dashboard</h2>
                      <p className="app-dev-promo-description">
                        Dev Dashboard is your new app development home, with more capabilities and tools than legacy custom apps offer.
                      </p>
                      <div className="app-dev-promo-actions">
                        <Button variant="primary">Build apps in Dev Dashboard</Button>
                        <a href="#" className="app-dev-learn-more-link">Learn more</a>
                      </div>
                    </div>
                    <div className="app-dev-promo-illustration">
                      <img src="/svg/settingsSvg/news.svg" alt="App development illustration" />
                    </div>
                  </div>
                </div>

                {/* Legacy Custom Apps Card */}
                <div className="settings-card">
                  <div className="app-dev-legacy-header">
                    <h2 className="app-dev-legacy-title">Legacy custom apps</h2>
                    <Button>Create an app</Button>
                  </div>

                  {/* Warning Banner */}
                  <div className="app-dev-warning-banner">
                    <div className="app-dev-warning-icon">
                      <Icon source={AlertTriangleIcon} />
                    </div>
                    <p className="app-dev-warning-text">
                      Starting January 1, 2026, you will not be able to create new legacy custom apps. This will not impact any existing apps.
                    </p>
                  </div>

                  {/* Filter Bar */}
                  <div className="app-dev-filter-bar">
                    <div className="app-dev-filter-input-wrapper">
                      <Icon source={SearchIcon} />
                      <input
                        type="text"
                        placeholder="Filter items"
                        value={filterQuery}
                        onChange={(e) => setFilterQuery(e.target.value)}
                        className="app-dev-filter-input"
                      />
                    </div>
                    <button className="app-dev-sort-btn">
                      <span>Sort</span>
                      <Icon source={ChevronDownIcon} />
                    </button>
                  </div>

                  {/* Apps List */}
                  <div className="app-dev-apps-list">
                    {filteredApps.map((app, index) => (
                      <div key={app.id}>
                        <div className="app-dev-app-row">
                          <div className="app-dev-app-icon">
                            <img src="/images/app.png" alt={app.name} />
                          </div>
                          <span className="app-dev-app-name">{app.name}</span>
                        </div>
                        {index < filteredApps.length - 1 && <div className="app-dev-app-divider"></div>}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Develop apps with caution Card */}
                <div className="settings-card">
                  <h2 className="app-dev-caution-title">Develop apps with caution</h2>
                  <p className="app-dev-caution-text">
                    All apps are subject to the <a href="#">Shopify API License and Terms of Use</a>. In addition, you should not use apps to customize checkout.
                  </p>
                  <p className="app-dev-caution-info">
                    Legacy custom app development allowed on November 28, 2024 by Ashank Bekkam (ashank@thesolidcorp.com).
                  </p>
                </div>

                {/* Protected customer data access Card */}
                <div className="settings-card">
                  <h2 className="app-dev-protected-title">Protected customer data access</h2>
                  <p className="app-dev-protected-text">
                    Access shipping rates, events, webhooks and meta fields, orders, checkouts, shipping and fulfillment, online store, and gift cards.
                  </p>
                  <div className="app-dev-upgrade-box">
                    <div className="app-dev-upgrade-content">
                      <h3 className="app-dev-upgrade-title">Additional access available</h3>
                      <p className="app-dev-upgrade-description">
                        API access to personally identifiable information (PII) like customer names, addresses, emails, phone numbers is available on Shopify, Advanced, and Plus plans
                      </p>
                    </div>
                    <Button>Upgrade plan</Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppProvider>
  );
}

export default AppDevelopmentPage;
