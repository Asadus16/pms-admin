'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Icon, AppProvider, Button } from '@shopify/polaris';
import {
  XIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  NotificationIcon,
  ArrowLeftIcon,
} from '@shopify/polaris-icons';
import ShopifyHeader from '@components/Shopifyheader';
import SettingsNavigation from '@components/Settings/SettingsNavigation';
import '@pages/Settings/settings.css';
import '@components/Settings/styles/SettingsLayout.css';
import '@components/Settings/styles/SettingsResponsive.css';
import '@components/Settings/styles/TransactionsSettings.css';
import '@components/Settings/styles/CustomerNotifications.css';

// Notification Item Component
const NotificationItem = ({ title, description, hasToggle, toggleValue, onToggleChange, isLast }) => {
  return (
    <>
      <div className="customer-notification-item">
        <div className="customer-notification-item-content">
          <span className="customer-notification-item-title">{title}</span>
          <span className="customer-notification-item-description">{description}</span>
        </div>
        <div className="customer-notification-item-actions">
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
          <div className="customer-notification-item-arrow">
            <Icon source={ChevronRightIcon} />
          </div>
        </div>
      </div>
      {!isLast && <div className="customer-notification-divider" />}
    </>
  );
};

// Accordion Section Component
const AccordionSection = ({ title, children, defaultOpen = true }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="customer-notification-accordion">
      <div
        className="customer-notification-accordion-header"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="customer-notification-accordion-title">{title}</span>
        <div className="customer-notification-accordion-icon">
          <Icon source={isOpen ? ChevronUpIcon : ChevronDownIcon} />
        </div>
      </div>
      {isOpen && (
        <div className="customer-notification-accordion-content">
          {children}
        </div>
      )}
    </div>
  );
};

function CustomerNotificationsPage() {
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

  // Toggle states for notifications with toggles
  const [toggleStates, setToggleStates] = useState({
    orderOutForLocalDelivery: false,
    orderLocallyDelivered: false,
    orderMissedLocalDelivery: false,
    outForDelivery: false,
    delivered: false,
    customerMarketingConfirmation: false,
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

  // Notification sections data
  const notificationSections = [
    {
      title: 'Order processing',
      items: [
        { title: 'Order confirmation', description: 'Sent when a customer places an order' },
        { title: 'Draft order invoice', description: 'Sent when you create an invoice on the draft order page' },
        { title: 'Shipping confirmation', description: 'Sent when you mark an order as fulfilled' },
      ]
    },
    {
      title: 'Local pick up',
      items: [
        { title: 'Ready for local pickup', description: 'Sent when an order is ready to be picked up' },
        { title: 'Picked up by customer', description: 'Sent to confirm an order was picked up by the customer' },
      ]
    },
    {
      title: 'Local delivery',
      items: [
        { title: 'Order out for local delivery', description: 'Sent when an order is out for local delivery', hasToggle: true, toggleKey: 'orderOutForLocalDelivery' },
        { title: 'Order locally delivered', description: 'Sent to confirm the order was delivered', hasToggle: true, toggleKey: 'orderLocallyDelivered' },
        { title: 'Order missed local delivery', description: 'Sent when a customer misses a local delivery', hasToggle: true, toggleKey: 'orderMissedLocalDelivery' },
      ]
    },
    {
      title: 'Gift cards',
      items: [
        { title: 'New gift card', description: 'Sent to the customer or recipient when a gift card is fulfilled, or when you send a gift card' },
        { title: 'Gift card receipt', description: 'Sent to the customer if they add a recipient to a gift card' },
      ]
    },
    {
      title: 'Store credit',
      items: [
        { title: 'Store credit issued', description: "Sent when a store credit amount is credited to the customer's account" },
      ]
    },
    {
      title: 'Order exceptions',
      items: [
        { title: 'Order invoice', description: 'Sent when an order has an outstanding balance' },
        { title: 'Order edited', description: 'Sent when an order is edited' },
        { title: 'Order canceled', description: 'Sent if a customer cancels their order' },
        { title: 'Order payment receipt', description: "Sent after you charge a customer's saved payment method" },
        { title: 'Order refund', description: 'Sent if an order is refunded' },
        { title: 'Order link', description: 'Sent when a customer requests a new link from an expired order status page' },
      ]
    },
    {
      title: 'Payments',
      items: [
        { title: 'Payment error', description: "Sent if a customer's payment can't be processed during checkout" },
        { title: 'Pending payment error', description: "Sent when a customer's pending payment can't be processed" },
        { title: 'Pending payment success', description: "Sent after a customer's pending payment has been processed successfully" },
        { title: 'Payment reminder', description: 'Sent on or after the due date for an unpaid order' },
      ]
    },
    {
      title: 'Point of Sale',
      items: [
        { title: 'POS abandoned checkout', description: 'Sent when a POS draft order is created so a customer can complete a purchase online' },
        { title: 'POS email to customer', description: 'Sent when a POS cart is emailed to customer so it can be completed online' },
        { title: 'POS and mobile receipt', description: 'Sent when a customer places an in-person order and requests a receipt' },
        { title: 'POS exchange V2 receipt', description: 'Sent when a customer completes a POS exchange and requests a receipt' },
      ]
    },
    {
      title: 'Shipping updated',
      items: [
        { title: 'Shipping update', description: 'Sent when you add or update an order tracking number' },
        { title: 'Out for delivery', description: 'Sent when an order with a tracking number is out for delivery', hasToggle: true, toggleKey: 'outForDelivery' },
        { title: 'Delivered', description: 'Sent if an order with a tracking number is delivered', hasToggle: true, toggleKey: 'delivered' },
      ]
    },
    {
      title: 'Returns',
      items: [
        { title: 'Return created', description: 'Sent when you create a return, including any return label or tracking information' },
        { title: 'Order-level return label created', description: 'Sent when you create a return label from the order page (US only)' },
        { title: 'Return request received', description: "Sent to confirm a customer's self-serve return request was received" },
        { title: 'Return request approved', description: 'Sent when you approve a return request' },
        { title: 'Return request declined', description: 'Sent when you decline a return request' },
      ]
    },
    {
      title: 'Accounts and outreach',
      items: [
        { title: 'Customer account invite', description: 'Sent when you invite a customer to create an account' },
        { title: 'Customer account welcome', description: 'Sent when a customer completes their account activation' },
        { title: 'Customer account password reset', description: 'Sent when a customer requests to reset their account password' },
        { title: 'Contact customer', description: 'Sent when you contact a customer from the orders or customers page' },
        { title: 'Customer email address change confirmation', description: 'Sent when a customer changes their email address' },
      ]
    },
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
                <div className="customer-notifications-page-header">
                  <div className="customer-notifications-page-title">
                    <span className="customer-notifications-page-icon">
                      <Icon source={NotificationIcon} />
                    </span>
                    <span className="customer-notifications-breadcrumb-separator">›</span>
                    <h1 className="customer-notifications-breadcrumb-title">Customer notifications</h1>
                  </div>
                  <Button>Customize email templates</Button>
                </div>

                {/* All Notification Sections in one card */}
                <div className="settings-card">
                  {notificationSections.map((section, sectionIndex) => (
                    <AccordionSection key={sectionIndex} title={section.title}>
                      {section.items.map((item, itemIndex) => (
                        <NotificationItem
                          key={itemIndex}
                          title={item.title}
                          description={item.description}
                          hasToggle={item.hasToggle}
                          toggleValue={item.toggleKey ? toggleStates[item.toggleKey] : false}
                          onToggleChange={() => item.toggleKey && handleToggle(item.toggleKey)}
                          isLast={itemIndex === section.items.length - 1}
                        />
                      ))}
                    </AccordionSection>
                  ))}
                </div>

                {/* Marketing double opt-in Card with Shopify Messaging */}
                <div className="settings-card">
                  <div className="customer-notification-marketing-header">
                    <div className="customer-notification-marketing-title-row">
                      <span className="customer-notification-marketing-title">Marketing double opt-in</span>
                      <span className="customer-notification-marketing-info-icon">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5"/>
                          <path d="M8 7V11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                          <circle cx="8" cy="5" r="0.75" fill="currentColor"/>
                        </svg>
                      </span>
                    </div>
                    <p className="customer-notification-marketing-description">
                      Get explicit consent from customers to send them email and SMS marketing
                    </p>
                  </div>
                  <div className="customer-notification-marketing-content">
                    <div className="customer-notification-marketing-item">
                      <div className="customer-notification-item-content">
                        <span className="customer-notification-item-title">Customer marketing confirmation</span>
                        <span className="customer-notification-item-description">Sent to subscribers so they can confirm their email or SMS subscription</span>
                      </div>
                      <div className="customer-notification-item-actions">
                        <label className="transactions-toggle" onClick={(e) => e.stopPropagation()}>
                          <input
                            type="checkbox"
                            checked={toggleStates.customerMarketingConfirmation}
                            onChange={() => handleToggle('customerMarketingConfirmation')}
                          />
                          <span className="transactions-toggle-slider"></span>
                        </label>
                        <div className="customer-notification-item-arrow">
                          <Icon source={ChevronRightIcon} />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Shopify Messaging */}
                  <div className="customer-notification-messaging-row">
                    <div className="customer-notification-messaging-icon">
                      <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect width="40" height="40" rx="8" fill="#F3F0FF"/>
                        <path d="M12 14C12 12.8954 12.8954 12 14 12H26C27.1046 12 28 12.8954 28 14V22C28 23.1046 27.1046 24 26 24H22L18 28V24H14C12.8954 24 12 23.1046 12 22V14Z" fill="#7C3AED"/>
                        <rect x="15" y="16" width="10" height="2" rx="1" fill="white"/>
                        <rect x="15" y="20" width="6" height="2" rx="1" fill="white"/>
                      </svg>
                    </div>
                    <div className="customer-notification-messaging-content">
                      <span className="customer-notification-messaging-title">Shopify Messaging</span>
                      <span className="customer-notification-messaging-status">Installed</span>
                    </div>
                    <Button>Open</Button>
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

export default CustomerNotificationsPage;
