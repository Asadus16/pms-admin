'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Icon, AppProvider, Button } from '@shopify/polaris';
import {
  XIcon,
  PaymentIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  EmailIcon,
  SettingsIcon,
  ArrowLeftIcon,
} from '@shopify/polaris-icons';
import ShopifyHeader from '@components/Shopifyheader';
import SettingsNavigation from '@components/Settings/SettingsNavigation';
import '@components/Settings/styles/SettingsLayout.css';
import '@components/Settings/styles/SettingsResponsive.css';
import '@components/Settings/styles/TransactionsSettings.css';

// All payment methods with toggle
const allPaymentMethods = [
  { id: 'visa', name: 'Visa', icon: '/svg/cards/imgi_10_2c2bf.svg', enabled: true },
  { id: 'mastercard', name: 'Mastercard', icon: '/svg/cards/imgi_11_cd169.svg', enabled: true },
  { id: 'maestro', name: 'Maestro', icon: '/svg/cards/imgi_15_267b2.svg', enabled: true },
  { id: 'amex', name: 'American Express', icon: '/svg/cards/imgi_12_0878f.svg', enabled: true },
  { id: 'rupay', name: 'RuPay', icon: '/svg/cards/imgi_14_6e06e.svg', enabled: true },
  { id: 'diners', name: 'Diners Club', icon: '/svg/cards/imgi_13_b34cb.svg', enabled: true },
  { id: 'upi', name: 'UPI', icon: '/svg/cards/imgi_16_26e7e.svg', enabled: true },
  { id: 'netbanking', name: 'NetBanking', icon: '/svg/cards/imgi_17_19b58.svg', enabled: true },
  { id: 'paytm', name: 'Paytm', icon: '/svg/cards/imgi_18_80897.svg', enabled: true },
  { id: 'airtel', name: 'Airtel Money', icon: '/svg/cards/imgi_19_34a1d.svg', enabled: true },
  { id: 'amazon', name: 'Amazon Pay', icon: '/svg/cards/imgi_20_a704b.svg', enabled: true },
  { id: 'ola', name: 'Ola Money', icon: '/svg/cards/imgi_21_21750.svg', enabled: true },
  { id: 'payzapp', name: 'PayZapp', icon: '/svg/cards/imgi_22_d74bd.svg', enabled: true },
  { id: 'freecharge', name: 'Freecharge', icon: '/svg/cards/imgi_23_712d9.svg', enabled: true },
  { id: 'mobikwik', name: 'MobiKwik', icon: '/svg/cards/imgi_24_95688.svg', enabled: true },
  { id: 'fpx', name: 'FPX', icon: '/svg/cards/imgi_25_889d4.svg', enabled: true },
  { id: 'grabpay', name: 'GrabPay', icon: '/svg/cards/imgi_26_df0ab.svg', enabled: true },
  { id: 'touchngo', name: "Touch 'n Go", icon: '/svg/cards/imgi_27_3486a.svg', enabled: true },
  { id: 'mcash', name: 'M Cash', icon: '/svg/cards/imgi_28_2e1b9.svg', enabled: true },
  { id: 'hsbc', name: 'HSBC Bank', icon: '/svg/cards/imgi_29_e0d85.svg', enabled: true },
  { id: 'boost', name: 'Boost', icon: '/svg/cards/imgi_30_874d2.svg', enabled: true },
];

function AlternativeProvidersPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [razorpayExpanded, setRazorpayExpanded] = useState(true);
  const [paymentMethods, setPaymentMethods] = useState(allPaymentMethods);
  const [testMode, setTestMode] = useState(false);
  const [showMoreActions, setShowMoreActions] = useState(false);
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
    router.push('/settings?section=transactions');
  }, [router]);

  const mobileStateClass = isMobile
    ? (showMobileNav ? 'mobile-nav-visible' : 'mobile-content-visible')
    : '';

  const togglePaymentMethod = (id) => {
    setPaymentMethods(prev => prev.map(method =>
      method.id === id ? { ...method, enabled: !method.enabled } : method
    ));
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
                <span>Payments</span>
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
                activeSection="transactions"
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                onNavClick={handleNavClick}
              />
            )}

            {/* Content */}
            <div className="settings-content settings-content-full">
              <div className="settings-content-inner">
                {/* Page Title - Custom for Razorpay */}
                <div className="settings-page-title-row">
                  <div className="settings-page-title">
                    <span className="settings-page-title-icon">
                      <Icon source={PaymentIcon} />
                    </span>
                    <span className="settings-page-breadcrumb-separator">›</span>
                    <h1>1Razorpay - UPI, Cards, Wallets, NB</h1>
                    <span className="transactions-status-badge active">Active</span>
                  </div>
                  <div className="transactions-more-actions">
                    <Button
                      onClick={() => setShowMoreActions(!showMoreActions)}
                      disclosure={showMoreActions ? 'up' : 'down'}
                    >
                      More actions
                    </Button>
                    {showMoreActions && (
                      <div className="transactions-dropdown">
                        <button className="transactions-dropdown-item" onClick={() => setShowMoreActions(false)}>
                          <span className="transactions-dropdown-icon">
                            <Icon source={EmailIcon} />
                          </span>
                          <span className="transactions-dropdown-text">Contact provider</span>
                        </button>
                        <button className="transactions-dropdown-item" onClick={() => setShowMoreActions(false)}>
                          <span className="transactions-dropdown-icon">
                            <Icon source={SettingsIcon} />
                          </span>
                          <span className="transactions-dropdown-text">Manage</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Razorpay Detail Content */}
                <div className="transactions-razorpay-detail">
                  {/* About Section */}
                  <div className="settings-card">
                    <div
                      className="transactions-about-header"
                      onClick={() => setRazorpayExpanded(!razorpayExpanded)}
                    >
                      <h2 className="settings-card-title">About 1Razorpay - UPI, Cards, Wallets, NB</h2>
                      <div className="transactions-about-toggle">
                        <Icon source={razorpayExpanded ? ChevronUpIcon : ChevronDownIcon} />
                      </div>
                    </div>
                    {razorpayExpanded && (
                      <div className="transactions-about-content">
                        <p>
                          A system designed to handle end-to-end payments. Accept payments via 100+ payment modes - domestic & international credit & debit cards, EMIs, paylater, net banking, UPI & mobile wallets. Get a feature-filled and easy to integrate checkout with cards saved across businesses so that customers can pay seamlessly everywhere. Boost conversions with international customers paying in their local currency. Keep your data safe with robust security that comes with PCI DSS Level 1 compliance.
                        </p>
                        <p>
                          Learn more about <a href="#">1Razorpay - UPI, Cards, Wallets, NB</a>
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Payment Capture */}
                  <div className="transactions-capture-bordered">
                    <div className="transactions-capture-row">
                      <div className="transactions-capture-icon">
                        <Icon source={PaymentIcon} />
                      </div>
                      <div className="transactions-capture-content">
                        <div className="transactions-capture-title">Payment capture</div>
                        <div className="transactions-capture-description">This can&apos;t be changed in your payment capture settings.</div>
                      </div>
                      <span className="transactions-status-badge automatic">Automatic</span>
                    </div>
                  </div>

                  {/* Payment Methods List */}
                  <div className="settings-card">
                    <div className="transactions-methods-list">
                      {paymentMethods.map((method, index) => (
                        <div key={method.id}>
                          <div className="transactions-method-row">
                            <div className="transactions-method-icon">
                              <img src={method.icon} alt={method.name} />
                            </div>
                            <span className="transactions-method-name">{method.name}</span>
                            <label className="transactions-toggle">
                              <input
                                type="checkbox"
                                checked={method.enabled}
                                onChange={() => togglePaymentMethod(method.id)}
                              />
                              <span className="transactions-toggle-slider"></span>
                            </label>
                          </div>
                          {index < paymentMethods.length - 1 && <div className="transactions-method-divider"></div>}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Test Mode */}
                  <div className="settings-card">
                    <div className="transactions-test-mode-row">
                      <div className="transactions-test-mode-content">
                        <div className="transactions-test-mode-title">Test mode</div>
                        <div className="transactions-test-mode-description">See how payments and orders work on your store</div>
                      </div>
                      <label className="transactions-toggle">
                        <input
                          type="checkbox"
                          checked={testMode}
                          onChange={() => setTestMode(!testMode)}
                        />
                        <span className="transactions-toggle-slider"></span>
                      </label>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="transactions-detail-actions">
                    <div className="transactions-deactivate-btn-wrapper">
                      <Button>Deactivate</Button>
                    </div>
                    <Button disabled>Save</Button>
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

export default AlternativeProvidersPage;
