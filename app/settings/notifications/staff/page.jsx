'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Icon, AppProvider, Button } from '@shopify/polaris';
import {
  XIcon,
  ChevronRightIcon,
  NotificationIcon,
  EmailIcon,
  MobileIcon,
  PlusCircleIcon,
  MenuHorizontalIcon,
  ArrowLeftIcon,
} from '@shopify/polaris-icons';
import ShopifyHeader from '../../../../src/components/Shopifyheader';
import SettingsNavigation from '../../../../src/pages/Settings/components/SettingsNavigation';
import '../../../../src/pages/Settings/settings.css';
import '../../../../src/pages/Settings/components/styles/SettingsLayout.css';
import '../../../../src/pages/Settings/components/styles/SettingsResponsive.css';
import '../../../../src/pages/Settings/components/styles/TransactionsSettings.css';
import '../../../../src/pages/Settings/components/styles/StaffNotifications.css';

// Notification Item Component
const NotificationItem = ({ title, description, hasToggle, toggleValue, onToggleChange, hasEdit }) => {
  return (
    <div className="staff-notification-item">
      <div className="staff-notification-item-content">
        <span className="staff-notification-item-title">
          {title}
          {hasEdit && (
            <span className="staff-notification-edit-icon">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10.5 1.5L12.5 3.5L4 12H2V10L10.5 1.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
          )}
        </span>
        <span className="staff-notification-item-description">{description}</span>
      </div>
      <div className="staff-notification-item-actions">
        {hasToggle && (
          <label className="transactions-toggle" onClick={(e) => e.stopPropagation()}>
            <input
              type="checkbox"
              checked={toggleValue}
              onChange={onToggleChange}
            />
            <span className="transactions-toggle-slider"></span>
          </label>
        )}
        <div className="staff-notification-item-arrow">
          <Icon source={ChevronRightIcon} />
        </div>
      </div>
    </div>
  );
};

// Recipient Item Component
const RecipientItem = ({ icon, name, description, showOffBadge, isLast }) => {
  return (
    <>
      <div className="staff-recipient-item">
        <div className="staff-recipient-icon">
          <Icon source={icon} />
        </div>
        <div className="staff-recipient-content">
          <span className="staff-recipient-name">{name}</span>
          <span className="staff-recipient-description">{description}</span>
        </div>
        <div className="staff-recipient-actions">
          {showOffBadge && <span className="staff-recipient-off-badge">Off</span>}
          <button className="staff-recipient-menu-btn">
            <Icon source={MenuHorizontalIcon} />
          </button>
        </div>
      </div>
      {!isLast && <div className="staff-recipient-divider" />}
    </>
  );
};

function StaffNotificationsPage() {
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

  // Toggle states for notifications
  const [toggleStates, setToggleStates] = useState({
    storeOrderSummary: false,
    newOrder: true,
    newReturnRequest: true,
    salesAttributionEdited: true,
    newDraftOrder: true,
  });

  const handleToggle = (key) => {
    setToggleStates(prev => ({ ...prev, [key]: !prev[key] }));
  };

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

  // Recipients data
  const recipients = [
    { icon: EmailIcon, name: 'skshafeen2022@gmail.com', description: 'All orders', showOffBadge: true },
    { icon: EmailIcon, name: 'orders@skshafeen.com', description: 'All orders', showOffBadge: false },
    { icon: MobileIcon, name: "Shafeen Khaan's iPhone 14 Plus", description: 'All orders', showOffBadge: false },
    { icon: MobileIcon, name: "Shafeen Khaan's A015", description: 'All orders', showOffBadge: false },
    { icon: MobileIcon, name: "Shafeen Khaan's iPhone 15 Pro Max", description: 'All orders', showOffBadge: false },
    { icon: MobileIcon, name: "Shafeen Khaan's A015", description: 'All orders', showOffBadge: false },
    { icon: MobileIcon, name: "Shafeen Khaan's iPhone 15 Pro Max", description: 'All orders', showOffBadge: false },
  ];

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
                <div className="staff-notifications-page-header">
                  <div className="staff-notifications-page-title">
                    <span className="staff-notifications-page-icon">
                      <Icon source={NotificationIcon} />
                    </span>
                    <span className="staff-notifications-breadcrumb-separator">›</span>
                    <h1 className="staff-notifications-breadcrumb-title">Staff notifications</h1>
                  </div>
                </div>

                {/* Notifications Card */}
                <div className="settings-card">
                  {/* Store order summary - single item box */}
                  <div className="staff-notification-box">
                    <NotificationItem
                      title="Store order summary"
                      description="Sent every Monday 9:30 AM GMT+5:30"
                      hasToggle={true}
                      toggleValue={toggleStates.storeOrderSummary}
                      onToggleChange={() => handleToggle('storeOrderSummary')}
                      hasEdit={true}
                    />
                  </div>

                  {/* Group of 3 notifications */}
                  <div className="staff-notification-box">
                    <NotificationItem
                      title="New order"
                      description="Sent when a customer places an order"
                      hasToggle={true}
                      toggleValue={toggleStates.newOrder}
                      onToggleChange={() => handleToggle('newOrder')}
                    />
                    <div className="staff-notification-divider" />
                    <NotificationItem
                      title="New return request"
                      description="Sent when a customer requests a return on an order"
                      hasToggle={true}
                      toggleValue={toggleStates.newReturnRequest}
                      onToggleChange={() => handleToggle('newReturnRequest')}
                    />
                    <div className="staff-notification-divider" />
                    <NotificationItem
                      title="Sales attribution edited"
                      description="Sent to order notification subscribers when the attributed staff on an order is edited."
                      hasToggle={true}
                      toggleValue={toggleStates.salesAttributionEdited}
                      onToggleChange={() => handleToggle('salesAttributionEdited')}
                    />
                  </div>

                  {/* New draft order - single item box */}
                  <div className="staff-notification-box">
                    <NotificationItem
                      title="New draft order"
                      description="Sent when a customer submits a draft order. Only sent to store owner"
                      hasToggle={true}
                      toggleValue={toggleStates.newDraftOrder}
                      onToggleChange={() => handleToggle('newDraftOrder')}
                    />
                  </div>
                </div>

                {/* Recipients Card */}
                <div className="settings-card">
                  <div className="staff-recipients-header">
                    <h2 className="staff-recipients-title">Recipients</h2>
                  </div>
                  <div className="staff-recipients-box">
                    {recipients.map((recipient, index) => (
                      <RecipientItem
                        key={index}
                        icon={recipient.icon}
                        name={recipient.name}
                        description={recipient.description}
                        showOffBadge={recipient.showOffBadge}
                        isLast={index === recipients.length - 1}
                      />
                    ))}
                  </div>
                  <div className="staff-add-recipient-wrapper">
                    <div className="staff-add-recipient-content">
                      <Icon source={PlusCircleIcon} />
                      <span>Add recipient</span>
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

export default StaffNotificationsPage;
