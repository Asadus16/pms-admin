'use client';

import { useState, useCallback, useEffect } from 'react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import {
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
  AppsFilledIcon,
  AppsIcon,
  TeamIcon,
  LocationFilledIcon,
  LocationIcon,
  EmailIcon,
  LockIcon,
  ChatIcon,
} from '@shopify/polaris-icons'
import ShopifyHeader from '../../components/ShopifyHeader'
import CustomersPage from '../../components/CustomersPage'
import PropertyOwnersPage from '../../components/PropertyOwnersPage'
import ProjectsPage from '../../components/ProjectsPage'
import ProjectViewPage from '../../components/ProjectViewPage'
import AddProject from '../../components/AddProject'
import PropertiesPage from '../../components/PropertiesPage'
import AddProperty from '../../components/AddProperty'
import PropertyViewPage from '../../components/PropertyViewPage'
import OrdersPage from '../../components/OrdersPage'
import AnalyticsPage from '../../components/AnalyticsPage'
import SidekickPanel from '../../components/SidekickPanel'
import AddCustomer from '../../components/AddCustomer'
import AddDeveloper from '../../components/AddDeveloper'
import CreateOrder from '../../components/CreateOrder'
import DeveloperViewPage from '../../components/DeveloperViewPage'
import { developersData } from '../../data/developers'
import { projectsData } from '../../data/projects'
import { propertiesData } from '../../data/properties'
import SettingsPage from '../Settings/SettingsPage'
import PropertyDeveloperDashboard from './PropertyDeveloperDashboard'
import './dashboard.css'

// Valid user types
const VALID_USER_TYPES = ['real-estate-company', 'owners', 'guests', 'property-manager']

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

function Dashboard({ userType: rawUserType = 'owners' }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [mobileNavigationActive, setMobileNavigationActive] = useState(false)
  const [sidekickOpen, setSidekickOpen] = useState(false)
  const [sidekickExpanded, setSidekickExpanded] = useState(false)
  const [hoveredSalesChannel, setHoveredSalesChannel] = useState(null)
  const [hoveredApp, setHoveredApp] = useState(null)

  // Normalize user type - default to 'owners' if invalid
  const userType = VALID_USER_TYPES.includes(rawUserType) ? rawUserType : 'owners'

  // Base path for this user type (use the raw value from URL for navigation)
  // Routes are now /role/... instead of /role/dashboard/...
  const rolePath = rawUserType === 'owners' ? 'owner' : rawUserType === 'guests' ? 'guest' : rawUserType;
  const basePath = `/${rolePath}`

  // Get selected page from URL path - memoized to avoid recreation on every render
  const getSelectedFromPath = useCallback(() => {
    // Ensure pathname is available (client-side only)
    if (typeof window === 'undefined' || !pathname) {
      return 'dashboard'
    }
    
    // Remove the basePath prefix from pathname to get the page
    // pathname is like /property-manager or /property-manager/bookings
    // Also handle /property-manager/dashboard for backward compatibility
    let path = pathname.replace(basePath, '').replace(/^\//, '') || 'dashboard'
    
    // Remove /dashboard if present (for backward compatibility)
    if (path.startsWith('dashboard')) {
      path = path.replace(/^dashboard\/?/, '') || 'dashboard'
    }
    
    if (path === '' || path === 'dashboard') return 'dashboard'
    if (path === 'customers/new' || path.startsWith('customers/new')) return 'customers/new'
    if (path === 'bookings/new' || path.startsWith('bookings/new')) return 'bookings/new'
    if (path === 'developers/new' || path.startsWith('developers/new')) return 'developers/new'
    if (path === 'projects/new' || path.startsWith('projects/new')) return 'projects/new'
    // Developers view route
    if (path.startsWith('developers/') && !path.startsWith('developers/new')) return path
    // Projects view route
    if (path.startsWith('projects/') && !path.startsWith('projects/new')) return path
    // Properties view route
    if (path.startsWith('properties/') && !path.startsWith('properties/new')) return path
    if (path === 'customers/segments' || path.startsWith('customers/segments')) return 'segments'
    if (path === 'analytics/reports' || path.startsWith('analytics/reports')) return 'reports'
    if (path === 'analytics/live-view' || path.startsWith('analytics/live-view')) return 'live-view'
    return path
  }, [pathname, basePath])

  // Initialize with default to avoid hydration mismatch
  const [selected, setSelected] = useState('dashboard')
  const [isMounted, setIsMounted] = useState(false)

  // Update selected when URL changes, but only after mount to avoid hydration issues
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Update selected when pathname changes (separate effect to avoid re-mounting)
  useEffect(() => {
    if (isMounted) {
      setSelected(getSelectedFromPath())
    }
  }, [isMounted, getSelectedFromPath])

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
      router.push(`${basePath}/dashboard`)
    } else if (page === 'segments') {
      router.push(`${basePath}/customers/segments`)
    } else if (page === 'reports') {
      router.push(`${basePath}/analytics/reports`)
    } else if (page === 'live-view') {
      router.push(`${basePath}/analytics/live-view`)
    } else {
      router.push(`${basePath}/${page}`)
    }
  }, [router, basePath])

  // Check if analytics section is selected (including sub-items)
  const isAnalyticsSelected = selected === 'analytics' || selected === 'reports' || selected === 'live-view'

  // Navigation for Property Developers / Real Estate Company
  const developerNavigation = (
    <Navigation location={pathname}>
      <Navigation.Section
        items={[
          {
            label: 'Dashboard',
            icon: selected === 'dashboard' ? ChartVerticalIcon : ChartVerticalFilledIcon,
            onClick: () => handleNavigation('dashboard'),
            selected: selected === 'dashboard',
          },
          {
            label: 'Developers',
            icon: TeamIcon,
            onClick: () => handleNavigation('developers'),
            selected: selected === 'developers',
          },
          {
            label: 'Projects',
            icon: selected === 'projects' ? ProductIcon : ProductFilledIcon,
            onClick: () => handleNavigation('projects'),
            selected: selected === 'projects',
          },
          {
            label: 'Properties',
            icon: selected === 'properties' ? HomeIcon : HomeFilledIcon,
            onClick: () => handleNavigation('properties'),
            selected: selected === 'properties',
          },
          {
            label: 'Inventory',
            icon: InventoryIcon,
            onClick: () => handleNavigation('inventory'),
            selected: selected === 'inventory',
          },
          {
            label: 'Owners',
            icon: selected === 'owners' ? PersonIcon : PersonFilledIcon,
            onClick: () => handleNavigation('owners'),
            selected: selected === 'owners',
          },
          {
            label: 'Contacts',
            icon: ChatIcon,
            onClick: () => handleNavigation('contacts'),
            selected: selected === 'contacts',
          },
          {
            label: 'Leads',
            icon: EmailIcon,
            onClick: () => handleNavigation('leads'),
            selected: selected === 'leads',
          },
          {
            label: 'Reports',
            icon: ChartLineIcon,
            onClick: () => handleNavigation('reports'),
            selected: selected === 'reports',
          },
          {
            label: 'Integrations',
            icon: selected === 'integrations' ? AppsIcon : AppsFilledIcon,
            onClick: () => handleNavigation('integrations'),
            selected: selected === 'integrations',
          },
        ]}
      />
      <Navigation.Section
        items={[
          {
            label: 'Settings',
            icon: selected === 'settings' || selected === 'roles-permissions' ? SettingsIcon : SettingsFilledIcon,
            onClick: () => handleNavigation('settings'),
            selected: selected === 'settings' || selected === 'roles-permissions',
          },
        ]}
      />
    </Navigation>
  )

  // Navigation for Owners (existing sidebar)
  const ownersNavigation = (
    <Navigation location={pathname}>
      <Navigation.Section
        items={[
          {
            label: 'Dashboard',
            icon: selected === 'dashboard' ? ChartVerticalIcon : ChartVerticalFilledIcon,
            onClick: () => handleNavigation('dashboard'),
            selected: selected === 'dashboard',
          },
          {
            label: 'Properties',
            icon: selected === 'properties' ? HomeIcon : HomeFilledIcon,
            onClick: () => handleNavigation('properties'),
            selected: selected === 'properties',
          },
          {
            label: 'Bookings',
            icon: selected === 'bookings' ? OrderIcon : OrderFilledIcon,
            onClick: () => handleNavigation('bookings'),
            selected: selected === 'bookings',
          },
          {
            label: 'Owner',
            icon: selected === 'owner' ? PersonIcon : PersonFilledIcon,
            onClick: () => handleNavigation('owner'),
            selected: selected === 'owner',
          },
          {
            label: 'Guests',
            icon: selected === 'guests' ? PersonIcon : PersonFilledIcon,
            onClick: () => handleNavigation('guests'),
            selected: selected === 'guests',
          },
          {
            label: 'Transactions',
            icon: TransactionIcon,
            onClick: () => handleNavigation('transactions'),
            selected: selected === 'transactions',
          },
          {
            label: 'Inventory',
            icon: InventoryIcon,
            onClick: () => handleNavigation('inventory'),
            selected: selected === 'inventory',
          },
          {
            label: 'Reports',
            icon: ChartLineIcon,
            onClick: () => handleNavigation('reports'),
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
            selected: selected === 'settings',
          },
        ]}
      />
    </Navigation>
  )

  // Select navigation based on user type
  const navigationMarkup = (userType === 'property-manager' || userType === 'real-estate-company')
    ? developerNavigation
    : ownersNavigation

  // Property-manager dashboard edit mode uses the global header Save/Discard bar
  const isPropertyDeveloperDashboard = userType === 'property-manager' && selected === 'dashboard'
  const isEditingDashboard = isPropertyDeveloperDashboard && searchParams?.get('edit') === '1'

  const handleDashboardDiscard = useCallback(() => {
    window.dispatchEvent(new CustomEvent('pdDashboardDiscard'))
  }, [])

  const handleDashboardSave = useCallback(() => {
    window.dispatchEvent(new CustomEvent('pdDashboardSave'))
  }, [])

  // For customers page, we render CustomersPage directly (it has its own Page wrapper)
  // For analytics page, we render AnalyticsPage directly
  // For other pages, we wrap content in Page component
  const renderContent = () => {
    // Check for customers/new route
    if (selected === 'customers/new' || pathname.includes('/customers/new')) {
      return <AddCustomer onClose={() => router.push(`${basePath}/customers`)} />
    }

    // Check for bookings/new route
    if (selected === 'bookings/new' || pathname.includes('/bookings/new')) {
      return <CreateOrder onClose={() => router.push(`${basePath}/bookings`)} />
    }

    // Check for developers/new route
    if (selected === 'developers/new' || pathname.includes('/developers/new')) {
      return <AddDeveloper onClose={() => router.push(`${basePath}/developers`)} />
    }

    // Check for developers/:id/edit route
    if (selected.startsWith('developers/') && selected.endsWith('/edit')) {
      const developerId = selected.split('/')[1];
      const initialDeveloper = developersData.find((d) => String(d.id) === String(developerId)) || null;
      return (
        <AddDeveloper
          mode="edit"
          initialDeveloper={initialDeveloper}
          onClose={() => router.push(`${basePath}/developers`)}
        />
      );
    }

    // Check for projects/new route
    if (selected === 'projects/new' || pathname.includes('/projects/new')) {
      return <AddProject onClose={() => router.push(`${basePath}/projects`)} />
    }

    // Check for projects/:id/edit route
    if (selected.startsWith('projects/') && selected.endsWith('/edit')) {
      const projectId = selected.split('/')[1];
      const initialProject = projectsData.find((p) => String(p.id) === String(projectId)) || null;
      return (
        <AddProject
          mode="edit"
          initialProject={initialProject}
          onClose={() => router.push(`${basePath}/projects`)}
        />
      );
    }

    // Dashboard: property-manager gets its own component
    if (selected === 'dashboard') {
      if (userType === 'property-manager') {
        return <PropertyDeveloperDashboard />
      }
      return <AnalyticsPage />
    }

    // Owner and Guests show CustomersPage (for non-developer user types)
    if (selected === 'owner' || selected === 'guests') {
      return <CustomersPage />
    }

    // Developers page for property-manager/real-estate-company uses PropertyOwnersPage
    if (selected === 'developers') {
      return <PropertyOwnersPage />
    }

    // Projects page for property-manager/real-estate-company uses ProjectsPage
    if (selected === 'projects') {
      return <ProjectsPage />
    }

    // Properties page for property-manager/real-estate-company uses PropertiesPage
    if (selected === 'properties') {
      return <PropertiesPage />
    }

    // Check for properties/new route
    if (selected === 'properties/new' || pathname.includes('/properties/new')) {
      return <AddProperty onClose={() => router.push(`${basePath}/properties`)} />
    }

    // Check for properties/:id/edit route
    if (selected.startsWith('properties/') && selected.endsWith('/edit')) {
      const propertyId = selected.split('/')[1];
      const initialProperty = propertiesData.find((p) => String(p.id) === String(propertyId)) || null;
      return (
        <AddProperty
          mode="edit"
          initialProperty={initialProperty}
          onClose={() => router.push(`${basePath}/properties`)}
        />
      );
    }

    // Developer view page: /:userType/developers/:id
    if (selected.startsWith('developers/') && selected !== 'developers/new') {
      const developerId = selected.split('/')[1];
      return <DeveloperViewPage developerId={developerId} />;
    }

    // Project view page: /:userType/projects/:id
    if (selected.startsWith('projects/') && selected !== 'projects/new' && !selected.endsWith('/edit')) {
      const projectId = selected.split('/')[1];
      return <ProjectViewPage projectId={projectId} />;
    }

    // Property view page: /:userType/properties/:id
    if (selected.startsWith('properties/') && selected !== 'properties/new' && !selected.endsWith('/edit')) {
      const propertyId = selected.split('/')[1];
      return <PropertyViewPage propertyId={propertyId} />;
    }

    // Bookings shows OrdersPage
    if (selected === 'bookings') {
      return <OrdersPage />
    }

    // Render AnalyticsPage for analytics and its sub-pages
    if (isAnalyticsSelected) {
      return <AnalyticsPage />
    }

    // Render SettingsPage for settings (pass userType for conditional sidebar)
    if (selected === 'settings' || selected === 'roles-permissions') {
      return <SettingsPage userType={userType} initialPage={selected === 'roles-permissions' ? 'roles-permissions' : undefined} />
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
      // Developer-specific pages
      projects: 'Projects',
      owners: 'Owners',
      contacts: 'Contacts',
      leads: 'Leads',
      integrations: 'Integrations',
      'roles-permissions': 'Roles & Permissions',
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
      owners: (
        <Card>
          <BlockStack gap="200">
            <Text variant="headingMd" as="h2">
              Owners
            </Text>
            <Text as="p" tone="subdued">
              Manage property owners.
            </Text>
            <Button variant="primary">Add Owner</Button>
          </BlockStack>
        </Card>
      ),
      contacts: (
        <Card>
          <BlockStack gap="200">
            <Text variant="headingMd" as="h2">
              Contacts
            </Text>
            <Text as="p" tone="subdued">
              Manage your contacts and communication.
            </Text>
            <Button variant="primary">Add Contact</Button>
          </BlockStack>
        </Card>
      ),
      leads: (
        <Card>
          <BlockStack gap="200">
            <Text variant="headingMd" as="h2">
              Leads
            </Text>
            <Text as="p" tone="subdued">
              Track and manage sales leads.
            </Text>
            <Button variant="primary">Add Lead</Button>
          </BlockStack>
        </Card>
      ),
      integrations: (
        <Card>
          <BlockStack gap="200">
            <Text variant="headingMd" as="h2">
              Integrations
            </Text>
            <Text as="p" tone="subdued">
              Connect with third-party services.
            </Text>
            <Button variant="primary">Browse Integrations</Button>
          </BlockStack>
        </Card>
      ),
      'roles-permissions': (
        <Card>
          <BlockStack gap="200">
            <Text variant="headingMd" as="h2">
              Roles & Permissions
            </Text>
            <Text as="p" tone="subdued">
              Manage user roles and access permissions.
            </Text>
            <Button variant="primary">Manage Roles</Button>
          </BlockStack>
        </Card>
      ),
    }

    // If dashboard is selected, don't wrap in Page component
    if (selected === 'dashboard') {
      if (userType === 'property-manager') {
        return <PropertyDeveloperDashboard />
      }
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
    <div className="dashboard-layout">
      {/* Header - Rendered separately, outside of Frame but inside AppProvider */}
      <div className="dashboard-header">
        <ShopifyHeader
          onMobileNavigationToggle={toggleMobileNavigationActive}
          onSidekickToggle={toggleSidekick}
          isSidekickOpen={sidekickOpen}
          userType={userType}
          showUnsavedChanges={isEditingDashboard}
          onDiscard={isEditingDashboard ? handleDashboardDiscard : undefined}
          onSave={isEditingDashboard ? handleDashboardSave : undefined}
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
  )
}

export default Dashboard