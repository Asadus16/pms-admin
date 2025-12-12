'use client';

import { useState, useCallback, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
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
import OrdersPage from '../../components/OrdersPage'
import AnalyticsPage from '../../components/AnalyticsPage'
import SidekickPanel from '../../components/SidekickPanel'
import AddCustomer from '../../components/AddCustomer'
import CreateOrder from '../../components/CreateOrder'
import SettingsPage from '../Settings/SettingsPage'
import './dashboard.css'

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
  const router = useRouter()
  const pathname = usePathname()
  const [mobileNavigationActive, setMobileNavigationActive] = useState(false)
  const [sidekickOpen, setSidekickOpen] = useState(false)
  const [sidekickExpanded, setSidekickExpanded] = useState(false)
  const [hoveredSalesChannel, setHoveredSalesChannel] = useState(null)
  const [hoveredApp, setHoveredApp] = useState(null)

  // Get selected page from URL path
  const getSelectedFromPath = () => {
    const path = pathname.replace('/dashboard', '').replace(/^\//, '') || 'dashboard'
    if (path === '') return 'dashboard'
    if (path === 'customers/new' || path.startsWith('customers/new')) return 'customers/new'
    if (path === 'bookings/new' || path.startsWith('bookings/new')) return 'bookings/new'
    if (path === 'customers/segments' || path.startsWith('customers/segments')) return 'segments'
    if (path === 'analytics/reports' || path.startsWith('analytics/reports')) return 'reports'
    if (path === 'analytics/live-view' || path.startsWith('analytics/live-view')) return 'live-view'
    return path
  }

  const [selected, setSelected] = useState(getSelectedFromPath())

  // Update selected when URL changes
  useEffect(() => {
    setSelected(getSelectedFromPath())
  }, [pathname])

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
      router.push('/dashboard')
    } else if (page === 'segments') {
      router.push('/dashboard/customers/segments')
    } else if (page === 'reports') {
      router.push('/dashboard/analytics/reports')
    } else if (page === 'live-view') {
      router.push('/dashboard/analytics/live-view')
    } else {
      router.push(`/dashboard/${page}`)
    }
  }, [router])

  // Check if analytics section is selected (including sub-items)
  const isAnalyticsSelected = selected === 'analytics' || selected === 'reports' || selected === 'live-view'

  const navigationMarkup = (
    <Navigation location={pathname}>
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
    if (selected === 'customers/new' || pathname.includes('/customers/new')) {
      return <AddCustomer onClose={() => router.push('/dashboard/customers')} />
    }

    // Check for bookings/new route
    if (selected === 'bookings/new' || pathname.includes('/bookings/new')) {
      return <CreateOrder onClose={() => router.push('/dashboard/bookings')} />
    }

    // Dashboard shows AnalyticsPage
    if (selected === 'dashboard') {
      return <AnalyticsPage />
    }

    // Owner and Guests show CustomersPage
    if (selected === 'owner' || selected === 'guests') {
      return <CustomersPage />
    }

    // Bookings shows OrdersPage
    if (selected === 'bookings') {
      return <OrdersPage />
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