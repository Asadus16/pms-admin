'use client';

import { useState, useCallback } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import {
  Navigation,
  Frame,
  Icon,
} from '@shopify/polaris';
import {
  HomeFilledIcon,
  ProductFilledIcon,
  OrderFilledIcon,
  PersonFilledIcon,
  ChartVerticalFilledIcon,
  SettingsFilledIcon,
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
  HomeIcon,
  ProductIcon,
  OrderIcon,
  PersonIcon,
  ChartVerticalIcon,
  SettingsIcon,
  EmailIcon,
  ChatIcon,
} from '@shopify/polaris-icons';
import ShopifyHeader from '../ShopifyHeader';
import SidekickPanel from '../SidekickPanel';
import './dashboard.css';

// Valid user types
const VALID_USER_TYPES = ['real-estate-company', 'owners', 'guests', 'property-manager'];

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
);

/**
 * DashboardLayout - Provides the shell (header, navigation, sidekick) for dashboard pages
 * Accepts children which will be rendered inside the Frame
 */
export default function DashboardLayout({ 
  userType: rawUserType = 'owners', 
  children,
  showUnsavedChanges = false,
  onDiscard,
  onSave,
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [mobileNavigationActive, setMobileNavigationActive] = useState(false);
  const [sidekickOpen, setSidekickOpen] = useState(false);
  const [sidekickExpanded, setSidekickExpanded] = useState(false);
  const [hoveredSalesChannel, setHoveredSalesChannel] = useState(null);
  const [hoveredApp, setHoveredApp] = useState(null);

  // Normalize user type
  const userType = VALID_USER_TYPES.includes(rawUserType) ? rawUserType : 'owners';

  // Base path for this user type
  const rolePath = rawUserType === 'owners' ? 'owner' : rawUserType === 'guests' ? 'guest' : rawUserType;
  const basePath = `/${rolePath}`;

  // Determine selected route from pathname
  const getSelectedFromPath = () => {
    if (!pathname) return 'dashboard';
    
    let path = pathname.replace(basePath, '').replace(/^\//, '') || 'dashboard';
    
    // Remove /dashboard if present (for backward compatibility)
    if (path.startsWith('dashboard')) {
      path = path.replace(/^dashboard\/?/, '') || 'dashboard';
    }
    
    // Handle reports route - check for both /reports and /analytics/reports
    if (path === 'reports' || path.startsWith('reports/')) {
      return 'reports';
    }
    if (path === 'analytics/reports' || path.startsWith('analytics/reports')) {
      return 'reports';
    }
    
    return path || 'dashboard';
  };

  const selected = getSelectedFromPath();

  const toggleMobileNavigationActive = useCallback(
    () => setMobileNavigationActive((prev) => !prev),
    []
  );

  const toggleSidekick = useCallback(() => {
    setSidekickOpen((open) => !open);
  }, []);

  const closeSidekick = useCallback(() => {
    setSidekickOpen(false);
    setSidekickExpanded(false);
  }, []);

  const handleSidekickExpandedChange = useCallback((expanded) => {
    setSidekickExpanded(expanded);
  }, []);

  const handleNavigation = useCallback((page) => {
    if (page === 'dashboard') {
      router.push(`${basePath}/dashboard`);
    } else if (page === 'segments') {
      router.push(`${basePath}/customers/segments`);
    } else if (page === 'reports') {
      // For property-manager, route to /reports instead of /analytics/reports
      if (userType === 'property-manager') {
        router.push(`${basePath}/reports`);
      } else {
        router.push(`${basePath}/analytics/reports`);
      }
    } else if (page === 'live-view') {
      router.push(`${basePath}/analytics/live-view`);
    } else {
      router.push(`${basePath}/${page}`);
    }
  }, [router, basePath, userType]);

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
            selected: selected === 'developers' || selected.startsWith('developers/'),
          },
          {
            label: 'Projects',
            icon: selected === 'projects' ? ProductIcon : ProductFilledIcon,
            onClick: () => handleNavigation('projects'),
            selected: selected === 'projects' || selected.startsWith('projects/'),
          },
          {
            label: 'Properties',
            icon: selected === 'properties' ? HomeIcon : HomeFilledIcon,
            onClick: () => handleNavigation('properties'),
            selected: selected === 'properties' || selected.startsWith('properties/'),
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
  );

  // Navigation for Owners
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
            selected: selected === 'properties' || selected.startsWith('properties/'),
          },
          {
            label: 'Bookings',
            icon: selected === 'bookings' ? OrderIcon : OrderFilledIcon,
            onClick: () => handleNavigation('bookings'),
            selected: selected === 'bookings' || selected.startsWith('bookings/'),
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
  );

  // Select navigation based on user type
  const navigationMarkup = (userType === 'property-manager' || userType === 'real-estate-company')
    ? developerNavigation
    : ownersNavigation;

  return (
    <div className="dashboard-layout">
      {/* Header */}
      <div className="dashboard-header">
        <ShopifyHeader
          onMobileNavigationToggle={toggleMobileNavigationActive}
          onSidekickToggle={toggleSidekick}
          isSidekickOpen={sidekickOpen}
          userType={userType}
          showUnsavedChanges={showUnsavedChanges}
          onDiscard={onDiscard}
          onSave={onSave}
        />
      </div>

      {/* Body - Contains main content and sidekick */}
      <div className="dashboard-body">
        {/* Main Dashboard Content */}
        <div className={`dashboard-main ${sidekickOpen ? 'sidekick-open' : ''}`}>
          <Frame
            navigation={navigationMarkup}
            showMobileNavigation={mobileNavigationActive}
            onNavigationDismiss={toggleMobileNavigationActive}
          >
            {children}
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
  );
}

