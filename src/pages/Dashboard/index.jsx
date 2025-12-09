import { useState, useCallback, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  AppProvider,
  Page,
  Layout,
  Card,
  Text,
  Button,
  BlockStack,
  InlineStack,
  Navigation,
  Frame,
  Icon,
} from '@shopify/polaris'
import {
  HomeFilledIcon,
  ProductFilledIcon,
  OrderFilledIcon,
  PersonFilledIcon,
  ChartVerticalFilledIcon,
  SettingsFilledIcon,
  MegaphoneFilledIcon,
  DiscountFilledIcon,
  ContentFilledIcon,
  MarketsFilledIcon,
  PlusIcon,
  HomeIcon,
  ProductIcon,
  OrderIcon,
  PersonIcon,
  ChartVerticalIcon,
  SettingsIcon,
  MegaphoneIcon,
  DiscountIcon,
  StoreFilledIcon,
  LogoGoogleIcon,
  PinIcon,
  ViewIcon,
  TransactionIcon,
  InventoryIcon,
  ChartLineIcon,
} from '@shopify/polaris-icons'
import ShopifyHeader from '../../components/Shopifyheader'
import CustomersPage from '../../components/CustomersPage'
import AnalyticsPage from '../../components/AnalyticsPage'
import SidekickPanel from '../../components/SidekickPanel'
import AddCustomer from '../../components/AddCustomer'
import SettingsPage from '../Settings/SettingsPage'

// Robot icon for TinySEO
const RobotIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
    <rect x="4" y="6" width="12" height="10" rx="2" />
    <circle cx="7" cy="10" r="1.5" />
    <circle cx="13" cy="10" r="1.5" />
    <rect x="7" y="13" width="6" height="1" rx="0.5" />
    <line x1="10" y1="3" x2="10" y2="6" stroke="currentColor" strokeWidth="1.5" />
    <circle cx="10" cy="2.5" r="1" />
  </svg>
)

function Dashboard() {
  const navigate = useNavigate()
  const location = useLocation()
  const [mobileNavigationActive, setMobileNavigationActive] = useState(false)
  const [sidekickOpen, setSidekickOpen] = useState(false)
  const [sidekickExpanded, setSidekickExpanded] = useState(false)
  const [hoveredSalesChannel, setHoveredSalesChannel] = useState(null)
  const [hoveredApp, setHoveredApp] = useState(null)

  // Get selected page from URL path
  const getSelectedFromPath = () => {
    const path = location.pathname.replace('/dashboard', '').replace(/^\//, '') || 'dashboard'
    if (path === '') return 'dashboard'
    if (path === 'customers/new' || path.startsWith('customers/new')) return 'customers/new'
    if (path === 'customers/segments' || path.startsWith('customers/segments')) return 'segments'
    if (path === 'analytics/reports' || path.startsWith('analytics/reports')) return 'reports'
    if (path === 'analytics/live-view' || path.startsWith('analytics/live-view')) return 'live-view'
    return path
  }

  const [selected, setSelected] = useState(getSelectedFromPath())

  // Update selected when URL changes
  useEffect(() => {
    setSelected(getSelectedFromPath())
  }, [location.pathname])

  const toggleMobileNavigationActive = useCallback(
    () =>
      setMobileNavigationActive(
        (mobileNavigationActive) => !mobileNavigationActive
      ),
    []
  )

  const toggleSidekick = useCallback(() => {
    setSidekickOpen((open) => !open)
  }, [])

  const closeSidekick = useCallback(() => {
    setSidekickOpen(false)
    setSidekickExpanded(false)
  }, [])

  const handleSidekickExpandedChange = useCallback((expanded) => {
    setSidekickExpanded(expanded)
  }, [])

  const handleNavigation = useCallback((page) => {
    setSelected(page)
    if (page === 'dashboard') {
      navigate('/dashboard')
    } else if (page === 'segments') {
      navigate('/dashboard/customers/segments')
    } else if (page === 'reports') {
      navigate('/dashboard/analytics/reports')
    } else if (page === 'live-view') {
      navigate('/dashboard/analytics/live-view')
    } else {
      navigate(`/dashboard/${page}`)
    }
  }, [navigate])

  // Check if analytics section is selected (including sub-items)
  const isAnalyticsSelected = selected === 'analytics' || selected === 'reports' || selected === 'live-view'

  const navigationMarkup = (
    <Navigation location={location.pathname}>
      <Navigation.Section
        items={[
          {
            label: 'Dashboard',
            icon: selected === 'dashboard' ? ChartVerticalIcon : ChartVerticalFilledIcon,
            onClick: () => handleNavigation('dashboard'),
            url: '/dashboard',
            selected: selected === 'dashboard',
          },
          {
            label: 'Properties',
            icon: selected === 'properties' ? HomeIcon : HomeFilledIcon,
            onClick: () => handleNavigation('properties'),
            url: '/dashboard/properties',
            selected: selected === 'properties',
          },
          {
            label: 'Bookings',
            icon: selected === 'bookings' ? OrderIcon : OrderFilledIcon,
            onClick: () => handleNavigation('bookings'),
            url: '/dashboard/bookings',
            selected: selected === 'bookings',
          },
          {
            label: 'Owner',
            icon: selected === 'owner' ? PersonIcon : PersonFilledIcon,
            onClick: () => handleNavigation('owner'),
            url: '/dashboard/owner',
            selected: selected === 'owner',
          },
          {
            label: 'Guests',
            icon: selected === 'guests' ? PersonIcon : PersonFilledIcon,
            onClick: () => handleNavigation('guests'),
            url: '/dashboard/guests',
            selected: selected === 'guests',
          },
          {
            label: 'Transactions',
            icon: TransactionIcon,
            onClick: () => handleNavigation('transactions'),
            url: '/dashboard/transactions',
            selected: selected === 'transactions',
          },
          {
            label: 'Inventory',
            icon: InventoryIcon,
            onClick: () => handleNavigation('inventory'),
            url: '/dashboard/inventory',
            selected: selected === 'inventory',
          },
          {
            label: 'Reports',
            icon: ChartLineIcon,
            onClick: () => handleNavigation('reports'),
            url: '/dashboard/reports',
            selected: selected === 'reports',
          },
        ]}
      />
      <Navigation.Section
        title="Sales channels"
        items={[
          {
            label: 'Google & YouTube',
            icon: LogoGoogleIcon,
            onClick: () => handleNavigation('google-youtube'),
            url: '/dashboard/google-youtube',
            selected: selected === 'google-youtube',
            badge: hoveredSalesChannel === 'google-youtube' ? (
              <Icon source={PinIcon} tone="subdued" />
            ) : '•',
            onMouseEnter: () => setHoveredSalesChannel('google-youtube'),
            onMouseLeave: () => setHoveredSalesChannel(null),
          },
          {
            label: 'Online Store',
            icon: StoreFilledIcon,
            onClick: () => handleNavigation('online-store'),
            url: '/dashboard/online-store',
            selected: selected === 'online-store',
            badge: hoveredSalesChannel === 'online-store' ? (
              <Icon source={PinIcon} tone="subdued" />
            ) : (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ fontSize: '20px', lineHeight: 1, color: '#6d7175' }}>•</span>
                <Icon source={ViewIcon} tone="subdued" />
              </span>
            ),
            onMouseEnter: () => setHoveredSalesChannel('online-store'),
            onMouseLeave: () => setHoveredSalesChannel(null),
          },
        ]}
      />
      <Navigation.Section
        title="Apps"
        items={[
          {
            label: 'TinySEO',
            icon: RobotIcon,
            onClick: () => handleNavigation('tinyseo'),
            url: '/dashboard/tinyseo',
            selected: selected === 'tinyseo',
            badge: hoveredApp === 'tinyseo' ? (
              <Icon source={PinIcon} tone="subdued" />
            ) : '•',
            onMouseEnter: () => setHoveredApp('tinyseo'),
            onMouseLeave: () => setHoveredApp(null),
          },
        ]}
      />
      <Navigation.Section
        items={[
          {
            label: 'Settings',
            icon: selected === 'settings' ? SettingsIcon : SettingsFilledIcon,
            onClick: () => handleNavigation('settings'),
            url: '/dashboard/settings',
            selected: selected === 'settings',
          },
        ]}
      />

    </Navigation>
  )

  // For customers page, we render CustomersPage directly (it has its own Page wrapper)
  // For analytics page, we render AnalyticsPage directly
  // For other pages, we wrap content in Page component
  const renderContent = () => {
    // Check for customers/new route
    if (selected === 'customers/new' || location.pathname.includes('/customers/new')) {
      return <AddCustomer onClose={() => navigate('/dashboard/customers')} />
    }

    // Dashboard shows AnalyticsPage
    if (selected === 'dashboard') {
      return <AnalyticsPage />
    }

    // Owner and Guests show CustomersPage
    if (selected === 'owner' || selected === 'guests') {
      return <CustomersPage />
    }

    // Render AnalyticsPage for analytics and its sub-pages
    if (isAnalyticsSelected) {
      return <AnalyticsPage />
    }

    // Render SettingsPage for settings
    if (selected === 'settings') {
      return <SettingsPage />
    }

    const pageTitle = {
      dashboard: 'Dashboard',
      properties: 'Properties',
      bookings: 'Bookings',
      owner: 'Owner',
      guests: 'Guests',
      transactions: 'Transactions',
      inventory: 'Inventory',
      reports: 'Reports',
      settings: 'Settings',
      'sales-channels': 'Sales channels',
      apps: 'Apps',
      'google-youtube': 'Google & YouTube',
      'online-store': 'Online Store',
      'tinyseo': 'TinySEO',
    }[selected] || 'Dashboard'

    const pageContent = {
      properties: (
        <Card>
          <BlockStack gap="200">
            <Text variant="headingMd" as="h2">
              Properties
            </Text>
            <Text as="p" tone="subdued">
              Manage your properties.
            </Text>
            <Button variant="primary">Add Property</Button>
          </BlockStack>
        </Card>
      ),
      bookings: (
        <Card>
          <BlockStack gap="200">
            <Text variant="headingMd" as="h2">
              Bookings
            </Text>
            <Text as="p" tone="subdued">
              View and manage bookings.
            </Text>
            <Button variant="primary">View All Bookings</Button>
          </BlockStack>
        </Card>
      ),
      transactions: (
        <Card>
          <BlockStack gap="200">
            <Text variant="headingMd" as="h2">
              Transactions
            </Text>
            <Text as="p" tone="subdued">
              View and manage transactions.
            </Text>
            <Button variant="primary">View All Transactions</Button>
          </BlockStack>
        </Card>
      ),
      inventory: (
        <Card>
          <BlockStack gap="200">
            <Text variant="headingMd" as="h2">
              Inventory
            </Text>
            <Text as="p" tone="subdued">
              Manage your inventory.
            </Text>
            <Button variant="primary">Manage Inventory</Button>
          </BlockStack>
        </Card>
      ),
      reports: (
        <Card>
          <BlockStack gap="200">
            <Text variant="headingMd" as="h2">
              Reports
            </Text>
            <Text as="p" tone="subdued">
              View and generate reports.
            </Text>
            <Button variant="primary">Generate Report</Button>
          </BlockStack>
        </Card>
      ),
      'sales-channels': (
        <Card>
          <BlockStack gap="200">
            <Text variant="headingMd" as="h2">
              Sales Channels
            </Text>
            <Text as="p" tone="subdued">
              Add and manage your sales channels.
            </Text>
            <Button variant="primary">Add Sales Channel</Button>
          </BlockStack>
        </Card>
      ),
      apps: (
        <Card>
          <BlockStack gap="200">
            <Text variant="headingMd" as="h2">
              Apps
            </Text>
            <Text as="p" tone="subdued">
              Install and manage apps for your store.
            </Text>
            <Button variant="primary">Browse Apps</Button>
          </BlockStack>
        </Card>
      ),
      'google-youtube': (
        <Card>
          <BlockStack gap="200">
            <Text variant="headingMd" as="h2">
              Google & YouTube
            </Text>
            <Text as="p" tone="subdued">
              Manage your Google and YouTube sales channel integration.
            </Text>
            <Button variant="primary">Configure Channel</Button>
          </BlockStack>
        </Card>
      ),
      'online-store': (
        <Card>
          <BlockStack gap="200">
            <Text variant="headingMd" as="h2">
              Online Store
            </Text>
            <Text as="p" tone="subdued">
              Customize your online store theme and settings.
            </Text>
            <Button variant="primary">Customize Theme</Button>
          </BlockStack>
        </Card>
      ),
      'tinyseo': (
        <Card>
          <BlockStack gap="200">
            <Text variant="headingMd" as="h2">
              TinySEO
            </Text>
            <Text as="p" tone="subdued">
              Optimize your store for search engines.
            </Text>
            <Button variant="primary">Run SEO Audit</Button>
          </BlockStack>
        </Card>
      ),
    }

    // If dashboard is selected, don't wrap in Page component
    if (selected === 'dashboard') {
      return <AnalyticsPage />
    }

    return (
      <Page title={pageTitle}>
        <Layout>
          <Layout.Section>{pageContent[selected] || <AnalyticsPage />}</Layout.Section>
        </Layout>
      </Page>
    )
  }

  return (
    <AppProvider i18n={{}}>
      <style>{`
        /* ========================================
           Dashboard Layout - Curved Corners Fix
           ======================================== */
        
        .dashboard-layout {
          display: flex;
          flex-direction: column;
          height: 100vh;
          overflow: hidden;
          background: #1a1812;
        }
        
        /* Header stays at top - highest z-index */
        .dashboard-header {
          flex-shrink: 0;
          z-index: 520;
          position: relative;
        }
        
        /* Container for main content and sidekick */
        .dashboard-body {
          display: flex;
          flex: 1;
          min-height: 0;
          overflow: hidden;
          position: relative;
        }
        
        .dashboard-main {
          flex: 1;
          min-width: 0;
          min-height: 0;
          height: 100%;
          overflow: hidden;
          background: #f6f6f7;
          border-top-left-radius: 14px;
          border-top-right-radius: 14px;
          transition: border-top-right-radius 0.3s ease;
          display: flex;
          flex-direction: column;
        }
        
        /* Keep right curve even when sidekick is open */
        .dashboard-main.sidekick-open {
          border-top-right-radius: 14px;
          margin-right: 1px;
        }
        
        .dashboard-main.sidekick-open .Polaris-Frame__Main {
          border-top-right-radius: 14px !important;
        }
        
        .dashboard-main.sidekick-open .Polaris-Frame__Content {
          border-top-right-radius: 14px !important;
        }
        
        .dashboard-main.sidekick-open .Polaris-Page {
          border-top-right-radius: 14px !important;
        }
        
        .dashboard-main.sidekick-open .Polaris-Page__Content {
          border-top-right-radius: 14px !important;
        }
        
        .dashboard-main .Polaris-Frame {
          background: transparent !important;
          flex: 1;
          min-height: 0;
          border-top-left-radius: 14px !important;
          border-top-right-radius: 14px !important;
          overflow: hidden;
          display: flex;
          flex-direction: row;
        }
              
        /* Navigation panel - inherits curved corner from parent */
        .dashboard-main .Polaris-Frame__Navigation {
          background: #ebebeb !important;
          border-top-left-radius: 14px;
          z-index: 100 !important;
          padding-top: 0 !important;
          margin-top: 0 !important;
          margin-right: 0 !important;
          padding-right: 0 !important;
          position: relative;
        }
        
        .dashboard-main .Polaris-Navigation {
          background: #ebebeb !important;
          padding-top: 0 !important;
          margin-top: 0 !important;
          display: flex !important;
          flex-direction: column !important;
          height: 100% !important;
        }
        
        /* Position Settings section at the bottom */
        .dashboard-main .Polaris-Navigation__Section:last-child {
          margin-top: auto !important;
          padding-top: 16px !important;
        }
        
        /* Ensure navigation icons are visible */
        .dashboard-main .Polaris-Navigation__Item .Polaris-Navigation__Icon {
          display: flex !important;
          visibility: visible !important;
          opacity: 1 !important;
        }
        
        .dashboard-main .Polaris-Navigation__Item svg {
          display: block !important;
          visibility: visible !important;
          opacity: 1 !important;
        }
        
        /* Ensure navigation sections have proper spacing */
        .dashboard-main .Polaris-Navigation__Section {
          margin-top: 0 !important;
        }
        
        /* First navigation section should have some top spacing */
        .dashboard-main .Polaris-Navigation__Section:first-child {
          padding-top: 0 !important;
        }
        
        /* Remove background from navigation badges (dots) */
        .dashboard-main .Polaris-Navigation__Item .Polaris-Badge {
          background: transparent !important;
          padding: 0 !important;
          min-width: auto !important;
          height: auto !important;
          border: none !important;
          font-size: 20px;
          line-height: 1;
          color: #6d7175;
        }
        
        /* Style badge icons */
        .dashboard-main .Polaris-Navigation__Item .Polaris-Badge svg {
          width: 16px;
          height: 16px;
          color: #6d7175;
        }
        
        /* Ensure badge container has no background */
        .dashboard-main .Polaris-Navigation__Item .Polaris-Badge__Pip {
          display: none !important;
        }
        
        /* Ensure Icon components in badges are styled correctly */
        .dashboard-main .Polaris-Navigation__Item .Polaris-Badge .Polaris-Icon {
          display: inline-flex;
        }
        
        /* Style the badge content wrapper */
        .dashboard-main .Polaris-Navigation__Item .Polaris-Badge span {
          display: inline-flex;
          align-items: center;
        }
        
        /* Align navigation items with Page header */
        .dashboard-main .Polaris-Navigation__Item {
          padding-top: 0 !important;
          margin-top: 0 !important;
        }
        
        /* Match Page header padding */
        .dashboard-main .Polaris-Page__Header {
          padding-top: 20px !important;
        }
        
        /* Main content - transparent to show parent bg */
        .dashboard-main .Polaris-Frame__Main {
          background: transparent !important;
          border-top-left-radius: 14px !important;
          border-top-right-radius: 14px !important;
          margin-left: 0 !important;
          padding-left: 0 !important;
          flex: 1;
          min-width: 0;
          min-height: 0;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }
        
        .dashboard-main .Polaris-Frame__Content {
          background: #f6f6f7 !important;
          overflow-y: auto !important;
          overflow-x: hidden !important;
          border-top-left-radius: 14px !important;
          border-top-right-radius: 14px !important;
          margin-left: 0 !important;
          padding-left: 0 !important;
          flex: 1 1 0;
          min-height: 0;
          position: relative;
          -webkit-overflow-scrolling: touch;
          width: 100% !important;
          max-width: 100% !important;
        }
        
        /* Ensure Page component allows scrolling */
        .dashboard-main .Polaris-Page {
          height: auto !important;
          min-height: 100%;
          display: block;
          width: 100% !important;
          max-width: 100% !important;
        }
        
        .dashboard-main .Polaris-Page__Content {
          overflow: visible !important;
          width: 100% !important;
          max-width: 100% !important;
        }
        
        /* Ensure AnalyticsPage takes full width when rendered directly */
        .dashboard-main .Polaris-Frame__Content > .analytics-page,
        .dashboard-main .Polaris-Frame__Content > div > .analytics-page {
          width: 100% !important;
          max-width: 100% !important;
        }
        
        /* Ensure Layout components don't constrain width */
        .dashboard-main .Polaris-Layout {
          width: 100% !important;
          max-width: 100% !important;
        }
        
        .dashboard-main .Polaris-Layout__Section {
          width: 100% !important;
          max-width: 100% !important;
        }
        
        /* Force scrolling on the Frame Content */
        .dashboard-main .Polaris-Frame__Content > * {
          min-height: fit-content;
        }
        
        /* Remove any gap between navigation and main content */
        .dashboard-main .Polaris-Frame__Layout {
          gap: 0 !important;
          margin: 0 !important;
          padding: 0 !important;
        }
        
        /* Ensure Page components also have left border radius */
        .dashboard-main .Polaris-Page {
          border-top-left-radius: 14px !important;
          border-top-right-radius: 14px !important;
        }
        
        .dashboard-main .Polaris-Page__Content {
          border-top-left-radius: 14px !important;
          border-top-right-radius: 14px !important;
        }
        
        /* Remove any TopBar styling since we're not using it */
        .dashboard-main .Polaris-Frame__TopBar {
          display: none !important;
        }
        
        /* Sidekick panel container */
        .sidekick-container {
          width: 0;
          overflow: hidden;
          transition: width 0.3s ease, opacity 0.3s ease, visibility 0.3s ease;
          background: #ffffff;
          flex-shrink: 0;
          height: 100%;
          border-top-left-radius: 14px;
          border-top-right-radius: 14px;
          border-left: none;
          opacity: 0;
          visibility: hidden;
          margin-left: 0;
        }
        
        .sidekick-container.open {
          width: 360px;
          border-left: none;
          border-top-left-radius: 14px;
          border-top-right-radius: 14px;
          opacity: 1;
          visibility: visible;
          margin-left: 1px;
        }
        
        .sidekick-container.expanded {
          width: 600px;
        }
        
        /* ========================================
           Mobile Navigation Fixes
           ======================================== */
        
        /* Mobile navigation overlay - should be below header */
        .Polaris-Frame__NavigationDismiss {
          top: 0 !important;
          z-index: 510 !important;
        }
        
        /* Mobile navigation panel - position below header */
        @media (max-width: 768px) {
          /* The mobile nav slides in - make sure it's below header */
          .Polaris-Frame__Navigation {
            position: fixed !important;
            top: 56px !important;
            left: 0 !important;
            bottom: 0 !important;
            height: auto !important;
            z-index: 515 !important;
            border-top-left-radius: 0 !important;
            border-top-right-radius: 14px !important;
          }
          
          /* Navigation dismiss overlay */
          .Polaris-Frame__NavigationDismiss {
            top: 56px !important;
            z-index: 510 !important;
          }
          
          .sidekick-container.open {
            position: fixed;
            top: 56px;
            right: 0;
            bottom: 0;
            width: 100%;
            z-index: 505;
            border-top-left-radius: 0;
          }
          
          .dashboard-main {
            border-top-right-radius: 14px !important;
          }
        }
        
        @media (max-width: 1024px) and (min-width: 769px) {
          .sidekick-container.open {
            width: 320px;
          }
          
          .sidekick-container.expanded {
            width: 480px;
          }
        }
      `}</style>

      <div className="dashboard-layout">
        {/* Header - Rendered separately, outside of Frame but inside AppProvider */}
        <div className="dashboard-header">
          <ShopifyHeader
            onMobileNavigationToggle={toggleMobileNavigationActive}
            onSidekickToggle={toggleSidekick}
            isSidekickOpen={sidekickOpen}
          />
        </div>

        {/* Body - Contains main content and sidekick */}
        <div className="dashboard-body">
          {/* Main Dashboard Content - Now has curved corners */}
          <div className={`dashboard-main ${sidekickOpen ? 'sidekick-open' : ''}`}>
            <Frame
              navigation={navigationMarkup}
              showMobileNavigation={mobileNavigationActive}
              onNavigationDismiss={toggleMobileNavigationActive}
            >
              {renderContent()}
            </Frame>
          </div>

          {/* Sidekick Panel */}
          <div className={`sidekick-container ${sidekickOpen ? 'open' : ''} ${sidekickExpanded ? 'expanded' : ''}`}>
            <SidekickPanel
              isOpen={sidekickOpen}
              onClose={closeSidekick}
              userName="Shafeen"
              onExpandedChange={handleSidekickExpandedChange}
            />
          </div>
        </div>
      </div>
    </AppProvider>
  )
}

export default Dashboard