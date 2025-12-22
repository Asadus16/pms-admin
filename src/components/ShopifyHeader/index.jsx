'use client';

import { useState, useCallback, useRef, useEffect, memo } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import {
  Icon,
  Button,
  ButtonGroup,
  Popover,
  ActionList,
  Text,
  Scrollable,
  InlineStack,
} from '@shopify/polaris';
import {
  SidekickIcon,
  NotificationIcon,
  StoreIcon,
  CodeIcon,
  ExitIcon,
  CheckSmallIcon,
  MenuIcon,
  FilterIcon,
  CheckCircleIcon,
  XCircleIcon,
  AlertCircleIcon,
} from '@shopify/polaris-icons';
import { useAppDispatch, useAppSelector } from '@/store';
import { selectUser, clearAuth } from '@/store/slices/authSlice';
import { logout as logoutThunk } from '@/store/thunks';
import { getRoleFromPath } from '@/lib/constants/roles';
import './Shopifyheader.css';

function ShopifyHeader({ onMobileNavigationToggle, onSidekickToggle, isSidekickOpen, showUnsavedChanges, onDiscard, onSave, userType = 'owners' }) {
  const dispatch = useAppDispatch();
  const pathname = usePathname();
  const router = useRouter();
  const basePath = `/${userType}`;
  const user = useAppSelector(selectUser);
  
  // Get role from userType or pathname
  const getRole = () => {
    if (userType === 'owners') return 'owner';
    if (userType === 'guests') return 'guest';
    const roleFromPath = getRoleFromPath(pathname || '');
    return roleFromPath || 'property-manager';
  };
  const [searchExpanded, setSearchExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState(null);
  const [hoveredFilter, setHoveredFilter] = useState(null);
  const [filterDropdownOpen, setFilterDropdownOpen] = useState(false);
  const [profilePopoverActive, setProfilePopoverActive] = useState(false);
  const [notificationPopoverActive, setNotificationPopoverActive] = useState(false);
  const searchRef = useRef(null);
  const searchInputRef = useRef(null);

  // Get user display information
  const getUserName = () => {
    if (user?.name) return user.name;
    if (user?.first_name && user?.last_name) return `${user.first_name} ${user.last_name}`;
    if (user?.first_name) return user.first_name;
    return 'User';
  };

  const getUserEmail = () => {
    return user?.email || user?.email_address || '';
  };

  const getUserInitials = () => {
    const name = getUserName();
    if (!name || name === 'User') return 'U';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const getUserUsername = () => {
    const email = getUserEmail();
    if (email) {
      return email.split('@')[0];
    }
    return 'user';
  };

  const handleLogout = async () => {
    setProfilePopoverActive(false);
    try {
      const role = getRole();
      await dispatch(logoutThunk({ role }));
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      dispatch(clearAuth());
      if (typeof window !== 'undefined') {
        window.location.href = '/';
      }
    }
  };

  // Check if we should show unsaved changes (either via prop or by checking if we're on add customer page or create order page or add developer page or add project page)
  const isOnCustomerNew = pathname.includes('/customers/new');
  const isOnBookingsNew = pathname.includes('/bookings/new');
  const isOnDeveloperNew = pathname.includes('/developers/new');
  const isOnDeveloperEdit = pathname.includes('/developers/') && pathname.includes('/edit');
  const isOnProjectNew = pathname.includes('/projects/new');
  const isOnProjectEdit = pathname.includes('/projects/') && pathname.includes('/edit');
  const shouldShowUnsavedChanges = showUnsavedChanges || isOnCustomerNew || isOnBookingsNew || isOnDeveloperNew || isOnDeveloperEdit || isOnProjectNew || isOnProjectEdit;

  // Get the appropriate text based on the current page
  const getUnsavedChangesText = () => {
    if (isOnBookingsNew) return 'Unsaved draft order';
    if (isOnCustomerNew) return 'Unsaved changes';
    if (isOnDeveloperNew) return 'Unsaved changes';
    if (isOnDeveloperEdit) return 'Unsaved changes';
    if (isOnProjectNew) return 'Unsaved changes';
    if (isOnProjectEdit) return 'Unsaved changes';
    return 'Unsaved changes';
  };

  const handleDiscard = useCallback(() => {
    if (onDiscard) {
      onDiscard();
    } else if (isOnBookingsNew) {
      // Dispatch custom event to close CreateOrder
      window.dispatchEvent(new CustomEvent('closeCreateOrder'));
      router.push(`${basePath}/bookings`);
    } else if (isOnDeveloperNew) {
      // Dispatch custom event to close AddDeveloper
      window.dispatchEvent(new CustomEvent('closeAddDeveloper'));
      router.push(`${basePath}/developers`);
    } else if (isOnDeveloperEdit) {
      // Dispatch custom event to close EditDeveloper
      window.dispatchEvent(new CustomEvent('closeEditDeveloper'));
      router.push(`${basePath}/developers`);
    } else if (isOnProjectNew) {
      // Dispatch custom event to close AddProject
      window.dispatchEvent(new CustomEvent('closeAddProject'));
      router.push(`${basePath}/projects`);
    } else if (isOnProjectEdit) {
      // Dispatch custom event to close EditProject
      window.dispatchEvent(new CustomEvent('closeEditProject'));
      router.push(`${basePath}/projects`);
    } else {
      // Dispatch custom event to close AddCustomer
      window.dispatchEvent(new CustomEvent('closeAddCustomer'));
      router.push(`${basePath}/customers`);
    }
  }, [onDiscard, router, isOnBookingsNew, isOnDeveloperNew, isOnDeveloperEdit, isOnProjectNew, isOnProjectEdit, basePath]);

  const handleSave = useCallback(() => {
    if (onSave) {
      onSave();
    } else if (isOnBookingsNew) {
      // Dispatch custom event to save order
      window.dispatchEvent(new CustomEvent('saveCreateOrder'));
    } else if (isOnDeveloperNew) {
      // Dispatch custom event to save developer
      window.dispatchEvent(new CustomEvent('saveAddDeveloper'));
    } else if (isOnDeveloperEdit) {
      // Dispatch custom event to save developer edits
      window.dispatchEvent(new CustomEvent('saveEditDeveloper'));
    } else if (isOnProjectNew) {
      // Dispatch custom event to save project
      window.dispatchEvent(new CustomEvent('saveAddProject'));
    } else if (isOnProjectEdit) {
      // Dispatch custom event to save project edits
      window.dispatchEvent(new CustomEvent('saveEditProject'));
    } else {
      // Dispatch custom event to save customer
      window.dispatchEvent(new CustomEvent('saveAddCustomer'));
    }
  }, [onSave, isOnBookingsNew, isOnDeveloperNew, isOnDeveloperEdit, isOnProjectNew, isOnProjectEdit]);


  const toggleProfilePopover = useCallback(
    () => setProfilePopoverActive((active) => !active),
    []
  );

  const toggleNotificationPopover = useCallback(
    () => setNotificationPopoverActive((active) => !active),
    []
  );

  const expandSearch = useCallback(() => {
    setSearchExpanded(true);
    setTimeout(() => {
      searchInputRef.current?.focus();
    }, 50);
  }, []);

  const collapseSearch = useCallback(() => {
    setSearchExpanded(false);
    setSearchQuery('');
    setActiveFilter(null);
    setHoveredFilter(null);
    setFilterDropdownOpen(false);
  }, []);

  const toggleFilterDropdown = useCallback((e) => {
    e.stopPropagation();
    setFilterDropdownOpen((open) => !open);
  }, []);

  const handleFilterSelect = useCallback((filter) => {
    setActiveFilter(filter);
    setSearchQuery('');
    setFilterDropdownOpen(false);
    setHoveredFilter(null);
    searchInputRef.current?.focus();
  }, []);

  const clearFilter = useCallback((e) => {
    e.stopPropagation();
    setActiveFilter(null);
    setSearchQuery('');
    setHoveredFilter(null);
    searchInputRef.current?.focus();
  }, []);

  // Handle click outside to close search
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        collapseSearch();
      }
    };

    if (searchExpanded) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [searchExpanded, collapseSearch]);

  // Handle Escape key
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        if (filterDropdownOpen) {
          setFilterDropdownOpen(false);
        } else if (searchExpanded) {
          collapseSearch();
        }
      }
      // Handle Cmd+K / Ctrl+K to open search
      if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
        event.preventDefault();
        if (!searchExpanded) {
          expandSearch();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [searchExpanded, filterDropdownOpen, collapseSearch, expandSearch]);

  // All available filters matching the Shopify design
  const allFilters = [
    'Apps',
    'Articles',
    'Automations',
    'Blogs',
    'Catalogs',
    'Collections',
    'Companies',
    'Customers',
    'Discounts',
    'Draft orders',
    'Locations',
    'Markets',
    'Metafields',
    'Metaobjects',
    'Navigation',
    'Orders',
    'Pages',
    'Products',
    'Purchase orders',
    'Reports',
  ];

  // Quick filter pills shown at top
  const quickFilters = ['Apps', 'Customers', 'Orders', 'Products', 'Sales channels'];

  // Sample notifications data
  const notifications = [
    {
      id: 1,
      category: 'Permissions',
      timestamp: 'Tuesday at 4:19 PM',
      title: 'New collaborator request for your store',
      description: 'Review collaborator request from puneetsn@yourtoken.io.',
    },
    {
      id: 2,
      category: 'Permissions',
      timestamp: 'Nov 24 at 2:23 PM',
      title: 'New collaborator request for your store',
      description: 'Review collaborator request from info@nethype.co.',
    },
    {
      id: 3,
      category: 'Permissions',
      timestamp: 'Nov 24 at 12:36 PM',
      title: 'New collaborator request for your store',
      description: 'Review collaborator request from manuj@pickrr.com.',
    },
    {
      id: 4,
      category: 'Permissions',
      timestamp: 'Nov 13 at 10:23 PM',
      title: 'New collaborator request for your store',
      description: 'Review collaborator request from aryansingh882000@gmail.com.',
    },
    {
      id: 5,
      category: 'Permissions',
      timestamp: 'Sep 26 at 4:48 PM',
      title: 'New collaborator request for your store',
      description: 'Review collaborator request from manuj@pickrr.com.',
    },
    {
      id: 6,
      category: 'Permissions',
      timestamp: 'Sep 26 at 4:40 PM',
      title: 'New collaborator request for your store',
      description: 'Review collaborator request from hello@askashirvad.com.',
    },
  ];

  // Get the display value for the search input
  const getSearchDisplayValue = () => {
    if (hoveredFilter) {
      return `/${hoveredFilter}`;
    }
    if (activeFilter) {
      return `/${activeFilter}${searchQuery ? ' ' + searchQuery : ''}`;
    }
    return searchQuery;
  };

  // Handle input change
  const handleSearchInputChange = (e) => {
    const value = e.target.value;

    // If there's an active filter, only update the search part after the filter
    if (activeFilter) {
      // Remove the filter prefix if user is typing
      if (value.startsWith(`/${activeFilter}`)) {
        const searchPart = value.substring(`/${activeFilter}`.length).trimStart();
        setSearchQuery(searchPart);
      } else if (!value.startsWith('/')) {
        setSearchQuery(value);
      }
    } else {
      setSearchQuery(value);
    }
  };

  // Search icon
  const SearchIconSvg = ({ color = '#8C9196' }) => (
    <svg width="12" height="12" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M9 17C13.4183 17 17 13.4183 17 9C17 4.58172 13.4183 1 9 1C4.58172 1 1 4.58172 1 9C1 13.4183 4.58172 17 9 17Z"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M19 19L14.65 14.65"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

  // Large search icon for dropdown
  const LargeSearchIcon = () => (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M21 37C29.8366 37 37 29.8366 37 21C37 12.1634 29.8366 5 21 5C12.1634 5 5 12.1634 5 21C5 29.8366 12.1634 37 21 37Z"
        stroke="#b5b5b5"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M43 43L32.65 32.65"
        stroke="#b5b5b5"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );


  // X/Close icon
  const CloseIcon = () => (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="10" cy="10" r="8" stroke="#a2a2a2" strokeWidth="1.5" />
      <path d="M7 7L13 13M13 7L7 13" stroke="#a2a2a2" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );

  const notificationActivator = (
    <button
      className="header-icon-btn"
      onClick={toggleNotificationPopover}
      aria-label="Notifications"
    >
      <Icon source={NotificationIcon} />
    </button>
  );

  return (
    <>

      {/* Overlay when search is expanded */}
      {searchExpanded && <div className="search-overlay" />}

      <header className="header-container">
        {/* Glow effects overlay */}
        <div className="header-glow" />

        {/* Mobile hamburger menu button */}
        {onMobileNavigationToggle && (
          <button
            className="mobile-menu-btn"
            onClick={onMobileNavigationToggle}
            aria-label="Toggle navigation"
          >
            <Icon source={MenuIcon} />
          </button>
        )}

        {/* Left section - Logo */}
        <div className="logo-section" onClick={() => router.push(basePath)} style={{ cursor: 'pointer' }}>
          <img
            src="/logos/nest-quest.svg"
            alt="Nest Quest"
            className="height-24 width-auto"
            loading="eager"
            key="nest-quest-logo-header"
          />
        </div>

        {/* Center section - Search bar or Unsaved changes */}
        <div className="search-section">
          {shouldShowUnsavedChanges ? (
            <div className="unsaved-changes-container">
              <div className="unsaved-changes-bar">
                <InlineStack gap="200" blockAlign="center">
                  <Icon source={AlertCircleIcon} tone="subdued" />
                  <span className="unsaved-changes-text">{getUnsavedChangesText()}</span>
                </InlineStack>
              </div>
              <div className="unsaved-changes-actions">
                <Button onClick={handleDiscard} size="slim">Discard</Button>
                <Button variant="primary" onClick={handleSave} size="slim">Save</Button>
              </div>
            </div>
          ) : (
            <div
              className={`search-container ${searchExpanded ? 'expanded' : ''}`}
              ref={searchRef}
            >
              <div
                className={`search-bar ${searchExpanded ? 'search-bar-expanded' : ''}`}
                onClick={!searchExpanded ? expandSearch : undefined}
              >
                <SearchIconSvg color={searchExpanded ? '#8C9196' : '#ffffff'} />

                {searchExpanded ? (
                  <input
                    ref={searchInputRef}
                    type="text"
                    className="search-expanded-input"
                    placeholder="Search"
                    value={getSearchDisplayValue()}
                    onChange={handleSearchInputChange}
                    onFocus={() => setFilterDropdownOpen(false)}
                  />
                ) : (
                  <span className="search-bar-text">Search</span>
                )}

                {searchExpanded ? (
                  <div className="search-bar-actions">
                    {(activeFilter || hoveredFilter) && (
                      <button
                        className="clear-btn"
                        title="Clear filter"
                        onClick={clearFilter}
                      >
                        <CloseIcon />
                      </button>
                    )}
                    <button
                      className="settings-btn"
                      title="Filter by"
                      onClick={toggleFilterDropdown}
                    >
                      <Icon source={FilterIcon} tone="subdued" />
                    </button>
                  </div>
                ) : (
                  <div className="keyboard-shortcut">
                    <span className="key-icon">⌘</span>
                    <span className="key-icon">K</span>
                  </div>
                )}
              </div>

              {/* Filter Dropdown */}
              {searchExpanded && filterDropdownOpen && (
                <div className="filter-dropdown">
                  <div className="filter-dropdown-header">
                    Filter by
                  </div>
                  <Scrollable className="max-height-340">
                    <div className="filter-dropdown-list">
                      {allFilters.map((filter) => (
                        <button
                          key={filter}
                          className={`filter-dropdown-item ${activeFilter === filter ? 'active' : ''}`}
                          onClick={() => handleFilterSelect(filter)}
                          onMouseEnter={() => setHoveredFilter(filter)}
                          onMouseLeave={() => setHoveredFilter(null)}
                        >
                          {filter}
                        </button>
                      ))}
                    </div>
                  </Scrollable>
                </div>
              )}

              {/* Search Dropdown (when filter dropdown is not open) */}
              {searchExpanded && !filterDropdownOpen && (
                <div className="search-dropdown">
                  {/* Quick Filter Pills */}
                  <div className="search-dropdown-filters">
                    {quickFilters.map((filter) => (
                      <button
                        key={filter}
                        className={`search-filter-pill ${activeFilter === filter ? 'active' : ''}`}
                        onClick={() => handleFilterSelect(filter)}
                      >
                        {filter}
                      </button>
                    ))}
                  </div>

                  {/* Content Area */}
                  <div className="search-dropdown-content">
                    <LargeSearchIcon />
                    <div className="search-dropdown-text">
                      {activeFilter
                        ? `Search in ${activeFilter}`
                        : `Find anything in ${getUserUsername()}`
                      }
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right section - Icons and Profile */}
        <div className="header-right-section">
          {/* Sidekick button */}
          <button
            className={`header-icon-btn ${isSidekickOpen ? 'active' : ''}`}
            onClick={onSidekickToggle}
            aria-label="Sidekick"
          >
            <Icon source={SidekickIcon} />
          </button>

          {/* Notification bell with Popover */}
          <Popover
            active={notificationPopoverActive}
            activator={notificationActivator}
            onClose={toggleNotificationPopover}
            preferredAlignment="right"
            preferredPosition="below"
            fluidContent
          >
            <div className="width-400 max-height-600">
              {/* Header */}
              <div className="notification-popover-header">
                <Text variant="headingMd" as="h3">
                  Alerts
                </Text>
                <div className="notification-popover-actions">
                  <button className="icon-btn" title="Filter">
                    <Icon source={FilterIcon} tone="subdued" />
                  </button>
                  <button className="icon-btn" title="Mark all as read">
                    <Icon source={CheckCircleIcon} tone="subdued" />
                  </button>
                </div>
              </div>

              {/* Notifications List */}
              <Scrollable className="max-height-520">
                {notifications.map((notification) => (
                  <div key={notification.id} className="notification-item">
                    <div className="notification-category">
                      {notification.category} • {notification.timestamp}
                    </div>
                    <div className="notification-title">
                      {notification.title}
                    </div>
                    <div className="notification-description">
                      {notification.description}
                    </div>
                  </div>
                ))}
                {/* Footer - moved inside Scrollable */}
                <div className="notification-footer">
                  <Text variant="bodySm" tone="subdued">
                    No more alerts
                  </Text>
                </div>
              </Scrollable>
            </div>
          </Popover>

          {/* User profile with Popover */}
          <Popover
            active={profilePopoverActive}
            activator={
              <button className="profile-btn" onClick={toggleProfilePopover}>
                <div className="profile-avatar">
                  <div className="profile-avatar-inner">{getUserInitials()}</div>
                  <div className="profile-status" />
                </div>
                <span className="profile-username">{getUserUsername()}</span>
              </button>
            }
            onClose={toggleProfilePopover}
            preferredAlignment="right"
            preferredPosition="below"
          >
            <div className="min-width-260">
              {/* Current store with checkmark */}
              <div className="profile-dropdown-header">
                <div className="flex-center-gap-12">
                  <div className="store-avatar-small">
                    {getUserInitials()}
                  </div>
                  <span className="font-weight-600 font-size-14 color-202223">
                    {getUserUsername()}
                  </span>
                </div>
                <Icon source={CheckSmallIcon} tone="success" />
              </div>

              <ActionList
                items={[
                  {
                    content: 'All stores',
                    icon: StoreIcon,
                    onAction: () => console.log('All stores'),
                  },
                  {
                    content: 'Dev Dashboard',
                    icon: CodeIcon,
                    onAction: () => console.log('Dev Dashboard'),
                  },
                ]}
              />

              <div className="profile-dropdown-divider" />

              {/* User info section */}
              <div className="profile-dropdown-item" onClick={() => console.log('Profile clicked')}>
                <div className="user-avatar-large">
                  {getUserInitials()}
                </div>
                <div className="flex-column">
                  <span className="font-weight-600 font-size-14 color-202223">
                    {getUserName()}
                  </span>
                  <span className="font-size-12 color-6d7175">
                    {getUserEmail()}
                  </span>
                </div>
              </div>

              <div className="profile-dropdown-divider" />

              <ActionList
                items={[
                  {
                    content: 'Log out',
                    icon: ExitIcon,
                    onAction: handleLogout,
                    destructive: false,
                  },
                ]}
              />
            </div>
          </Popover>
        </div>
      </header>
    </>
  );
}

export default memo(ShopifyHeader);