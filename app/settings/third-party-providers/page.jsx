'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Icon, AppProvider, Button } from '@shopify/polaris';
import {
  XIcon,
  PaymentIcon,
  ChevronRightIcon,
  SearchIcon,
  FilterIcon,
  ArrowLeftIcon,
} from '@shopify/polaris-icons';
import ShopifyHeader from '@components/Shopifyheader';
import SettingsNavigation from '@components/Settings/SettingsNavigation';
import '@components/Settings/styles/SettingsLayout.css';
import '@components/Settings/styles/SettingsResponsive.css';
import '@components/Settings/styles/TransactionsSettings.css';

// Third-party payment providers data (using available SVG icons)
const thirdPartyProviders = [
  {
    id: 'bogus',
    name: '(for testing) Bogus Gateway',
    description: '',
    icons: [{ type: 'letter', value: 'B', bg: '#f97316' }],
  },
  {
    id: 'cashfree',
    name: 'Cashfree Payments - Cards',
    description: 'Supports 3DS',
    icons: [
      { type: 'img', src: '/svg/cards/imgi_10_2c2bf.svg', alt: 'Visa' },
      { type: 'img', src: '/svg/cards/imgi_11_cd169.svg', alt: 'Mastercard' },
      { type: 'img', src: '/svg/cards/imgi_12_0878f.svg', alt: 'Amex' },
      { type: 'img', src: '/svg/cards/imgi_13_b34cb.svg', alt: 'Diners' },
      { type: 'img', src: '/svg/cards/imgi_14_6e06e.svg', alt: 'RuPay' },
      { type: 'img', src: '/svg/cards/imgi_15_267b2.svg', alt: 'Maestro' },
    ],
  },
  {
    id: 'useepay',
    name: 'Integration-UseePay',
    description: 'Supports 3DS',
    icons: [
      { type: 'img', src: '/svg/cards/imgi_10_2c2bf.svg', alt: 'Visa' },
      { type: 'img', src: '/svg/cards/imgi_11_cd169.svg', alt: 'Mastercard' },
      { type: 'img', src: '/svg/cards/imgi_12_0878f.svg', alt: 'Amex' },
      { type: 'img', src: '/svg/cards/imgi_13_b34cb.svg', alt: 'Diners' },
      { type: 'img', src: '/svg/cards/imgi_15_267b2.svg', alt: 'Maestro' },
    ],
  },
  {
    id: 'onerway',
    name: 'ONERWAY (Direct)',
    description: 'Supports 3DS',
    icons: [
      { type: 'img', src: '/svg/cards/imgi_10_2c2bf.svg', alt: 'Visa' },
      { type: 'img', src: '/svg/cards/imgi_11_cd169.svg', alt: 'Mastercard' },
      { type: 'img', src: '/svg/cards/imgi_12_0878f.svg', alt: 'Amex' },
      { type: 'img', src: '/svg/cards/imgi_13_b34cb.svg', alt: 'Diners' },
      { type: 'img', src: '/svg/cards/imgi_15_267b2.svg', alt: 'Maestro' },
    ],
  },
  {
    id: 'payu',
    name: 'Onsite Card Payments by PayU India',
    description: 'Supports 3DS',
    icons: [
      { type: 'img', src: '/svg/cards/imgi_10_2c2bf.svg', alt: 'Visa' },
      { type: 'img', src: '/svg/cards/imgi_11_cd169.svg', alt: 'Mastercard' },
      { type: 'img', src: '/svg/cards/imgi_12_0878f.svg', alt: 'Amex' },
      { type: 'img', src: '/svg/cards/imgi_13_b34cb.svg', alt: 'Diners' },
      { type: 'img', src: '/svg/cards/imgi_14_6e06e.svg', alt: 'RuPay' },
      { type: 'img', src: '/svg/cards/imgi_15_267b2.svg', alt: 'Maestro' },
    ],
  },
  {
    id: 'pagbrasil',
    name: 'PagBrasil - Cartão de crédito',
    description: '',
    icons: [
      { type: 'img', src: '/svg/cards/imgi_10_2c2bf.svg', alt: 'Visa' },
      { type: 'img', src: '/svg/cards/imgi_11_cd169.svg', alt: 'Mastercard' },
      { type: 'img', src: '/svg/cards/imgi_12_0878f.svg', alt: 'Amex' },
      { type: 'img', src: '/svg/cards/imgi_13_b34cb.svg', alt: 'Diners' },
    ],
  },
  {
    id: 'payoneer',
    name: 'Payoneer Checkout Native Cards',
    description: 'Supports 3DS',
    icons: [
      { type: 'img', src: '/svg/cards/imgi_10_2c2bf.svg', alt: 'Visa' },
      { type: 'img', src: '/svg/cards/imgi_11_cd169.svg', alt: 'Mastercard' },
      { type: 'img', src: '/svg/cards/imgi_12_0878f.svg', alt: 'Amex' },
      { type: 'img', src: '/svg/cards/imgi_13_b34cb.svg', alt: 'Diners' },
    ],
  },
  {
    id: 'razorpay-direct',
    name: 'Razorpay Direct - Credit Card',
    description: 'Supports 3DS',
    icons: [
      { type: 'img', src: '/svg/cards/imgi_10_2c2bf.svg', alt: 'Visa' },
      { type: 'img', src: '/svg/cards/imgi_11_cd169.svg', alt: 'Mastercard' },
      { type: 'img', src: '/svg/cards/imgi_12_0878f.svg', alt: 'Amex' },
      { type: 'img', src: '/svg/cards/imgi_16_26e7e.svg', alt: 'UPI' },
      { type: 'img', src: '/svg/cards/imgi_17_19b58.svg', alt: 'NetBanking' },
      { type: 'img', src: '/svg/cards/imgi_18_80897.svg', alt: 'Paytm' },
    ],
  },
  {
    id: 'stripe',
    name: 'Stripe Card Payments',
    description: 'Supports 3DS',
    icons: [
      { type: 'img', src: '/svg/cards/imgi_10_2c2bf.svg', alt: 'Visa' },
      { type: 'img', src: '/svg/cards/imgi_11_cd169.svg', alt: 'Mastercard' },
      { type: 'img', src: '/svg/cards/imgi_12_0878f.svg', alt: 'Amex' },
      { type: 'img', src: '/svg/cards/imgi_13_b34cb.svg', alt: 'Diners' },
      { type: 'img', src: '/svg/cards/imgi_15_267b2.svg', alt: 'Maestro' },
    ],
  },
  {
    id: 'tap',
    name: 'Tap Payments',
    description: 'Supports 3DS',
    icons: [
      { type: 'img', src: '/svg/cards/imgi_10_2c2bf.svg', alt: 'Visa' },
      { type: 'img', src: '/svg/cards/imgi_11_cd169.svg', alt: 'Mastercard' },
      { type: 'img', src: '/svg/cards/imgi_12_0878f.svg', alt: 'Amex' },
      { type: 'img', src: '/svg/cards/imgi_20_a704b.svg', alt: 'Amazon Pay' },
      { type: 'img', src: '/svg/cards/imgi_26_df0ab.svg', alt: 'GrabPay' },
    ],
  },
];

function ThirdPartyProvidersPage() {
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
    router.push('/settings?section=transactions');
  }, [router]);

  const mobileStateClass = isMobile
    ? (showMobileNav ? 'mobile-nav-visible' : 'mobile-content-visible')
    : '';

  // Filter providers based on search
  const filteredProviders = thirdPartyProviders.filter(provider =>
    provider.name.toLowerCase().includes(filterQuery.toLowerCase())
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
                {/* Page Title */}
                <div className="settings-page-title-row">
                  <div className="settings-page-title">
                    <span className="settings-page-title-icon">
                      <Icon source={PaymentIcon} />
                    </span>
                    <span className="settings-page-breadcrumb-separator">›</span>
                    <h1>Third-party payment providers</h1>
                  </div>
                </div>

                {/* Providers List Card */}
                <div className="settings-card">
                  {/* Search/Filter Bar */}
                  <div className="third-party-search-bar">
                    <div className="third-party-search-input-wrapper">
                      <Icon source={SearchIcon} />
                      <input
                        type="text"
                        placeholder="Filter third-party payment providers"
                        value={filterQuery}
                        onChange={(e) => setFilterQuery(e.target.value)}
                        className="third-party-search-input"
                      />
                    </div>
                    <button className="third-party-filter-btn">
                      <Icon source={FilterIcon} />
                    </button>
                  </div>

                  {/* Providers List */}
                  <div className="third-party-providers-list">
                    {filteredProviders.map((provider, index) => (
                      <div key={provider.id}>
                        <div className="third-party-provider-row">
                          <div className="third-party-provider-info">
                            <div className="third-party-provider-name">{provider.name}</div>
                            {provider.description && (
                              <div className="third-party-provider-description">{provider.description}</div>
                            )}
                            <div className="third-party-provider-icons">
                              {provider.icons.map((icon, iconIndex) => (
                                <div key={iconIndex} className="third-party-payment-icon">
                                  {icon.type === 'letter' ? (
                                    <span
                                      className="third-party-icon-letter"
                                      style={{ backgroundColor: icon.bg }}
                                    >
                                      {icon.value}
                                    </span>
                                  ) : (
                                    <img src={icon.src} alt={icon.alt} />
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                          <div className="third-party-provider-action">
                            <Icon source={ChevronRightIcon} />
                          </div>
                        </div>
                        {index < filteredProviders.length - 1 && (
                          <div className="third-party-provider-divider"></div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Learn More */}
                <div className="transactions-learn-more">
                  <a href="#">Learn more about third-party payment providers</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppProvider>
  );
}

export default ThirdPartyProvidersPage;
