'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Icon, AppProvider } from '@shopify/polaris';
import {
  XIcon,
  NotificationIcon,
  PlusCircleIcon,
  ArrowLeftIcon,
} from '@shopify/polaris-icons';
import ShopifyHeader from '../../../../src/components/Shopifyheader';
import SettingsNavigation from '../../../../src/pages/Settings/components/SettingsNavigation';
import '../../../../src/pages/Settings/settings.css';
import '../../../../src/pages/Settings/components/styles/SettingsLayout.css';
import '../../../../src/pages/Settings/components/styles/SettingsResponsive.css';
import '../../../../src/pages/Settings/components/styles/WebhooksSettings.css';

function WebhooksPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
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
    router.push('/settings?section=notifications');
  }, [router]);

  const mobileStateClass = isMobile
    ? (showMobileNav ? 'mobile-nav-visible' : 'mobile-content-visible')
    : '';

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
                <span>Notifications</span>
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
                activeSection="notifications"
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                onNavClick={handleNavClick}
              />
            )}

            {/* Content */}
            <div className="settings-content settings-content-full">
              <div className="settings-content-inner">
                {/* Page Header */}
                <div className="webhooks-page-header">
                  <div className="webhooks-page-title">
                    <span className="webhooks-page-icon">
                      <Icon source={NotificationIcon} />
                    </span>
                    <span className="webhooks-breadcrumb-separator">›</span>
                    <h1 className="webhooks-breadcrumb-title">Webhooks</h1>
                  </div>
                </div>

                {/* Webhooks Card */}
                <div className="settings-card">
                  <div className="webhooks-card-content">
                    <p className="webhooks-description">
                      Send XML or JSON notifications about store events to a URL
                    </p>

                    {/* Create webhook button */}
                    <div className="webhooks-create-box">
                      <div className="webhooks-create-wrapper">
                        <div className="webhooks-create-content">
                          <Icon source={PlusCircleIcon} />
                          <span>Create webhook</span>
                        </div>
                      </div>
                    </div>

                    {/* Signing key section */}
                    <div className="webhooks-signing-section">
                      <p className="webhooks-signing-text">Your webhooks will be signed with</p>
                      <p className="webhooks-signing-key">a3c00c30b5019a446c14656a658c4691b8a1317dc4e2ae7c3a2a4138401f3143</p>
                    </div>
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

export default WebhooksPage;
