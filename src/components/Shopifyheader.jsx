import { useState, useCallback, useRef, useEffect, memo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
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

function ShopifyHeader({ onMobileNavigationToggle, onSidekickToggle, isSidekickOpen, showUnsavedChanges, onDiscard, onSave }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchExpanded, setSearchExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState(null);
  const [hoveredFilter, setHoveredFilter] = useState(null);
  const [filterDropdownOpen, setFilterDropdownOpen] = useState(false);
  const [profilePopoverActive, setProfilePopoverActive] = useState(false);
  const [notificationPopoverActive, setNotificationPopoverActive] = useState(false);
  const searchRef = useRef(null);
  const searchInputRef = useRef(null);

  // Check if we should show unsaved changes (either via prop or by checking if we're on add customer page)
  const shouldShowUnsavedChanges = showUnsavedChanges || location.pathname.includes('/customers/new');

  const handleDiscard = useCallback(() => {
    if (onDiscard) {
      onDiscard();
    } else {
      // Dispatch custom event to close AddCustomer
      window.dispatchEvent(new CustomEvent('closeAddCustomer'));
      navigate('/dashboard/customers');
    }
  }, [onDiscard, navigate]);

  const handleSave = useCallback(() => {
    if (onSave) {
      onSave();
    } else {
      // Dispatch custom event to save customer
      window.dispatchEvent(new CustomEvent('saveAddCustomer'));
    }
  }, [onSave]);

  // Inject high-priority styles for popover transparency
  useEffect(() => {
    const styleId = 'popover-transparent-styles';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.textContent = `
                /* High priority popover transparency */
                .Polaris-Popover,
                .Polaris-Popover > div,
                .Polaris-Popover > div > div,
                .Polaris-PositionedOverlay,
                .Polaris-Popover__PopoverOverlay,
                .Polaris-Popover__Wrapper,
                [class*="Polaris-Popover"]:not([class*="Content"]):not([class*="Pane"]):not([class*="Section"]):not([class*="ActionList"]) {
                    background: transparent !important;
                    background-color: transparent !important;
                    box-shadow: none !important;
                    border: none !important;
                    border-width: 0 !important;
                    border-style: none !important;
                    border-color: transparent !important;
                    outline: none !important;
                    --p-border-width-025: 0 !important;
                    --p-border-width-050: 0 !important;
                    --p-border-width-100: 0 !important;
                    --p-color-border: transparent !important;
                    --p-color-border-secondary: transparent !important;
                }
                .Polaris-Popover__Tip,
                .Polaris-Popover__TipGradient {
                    display: none !important;
                }
                /* Remove border from the Box component wrapper - very aggressive */
                .Polaris-Popover .Polaris-Box,
                .Polaris-Popover > .Polaris-Box,
                .Polaris-Popover > div > .Polaris-Box,
                .Polaris-Popover > div > div > .Polaris-Box {
                    border: 0 !important;
                    border-width: 0 !important;
                    border-style: none !important;
                    border-color: transparent !important;
                    border-top: 0 !important;
                    border-right: 0 !important;
                    border-bottom: 0 !important;
                    border-left: 0 !important;
                    border-block: 0 !important;
                    border-inline: 0 !important;
                    border-block-start: 0 !important;
                    border-block-end: 0 !important;
                    border-inline-start: 0 !important;
                    border-inline-end: 0 !important;
                    box-shadow: none !important;
                    outline: none !important;
                    --p-color-border: transparent !important;
                    --p-space-0: 0 !important;
                }
                /* Target the popover surface Box specifically */
                .Polaris-Popover .Polaris-Box:not(.Polaris-Popover__Content .Polaris-Box) {
                    border: 0 !important;
                    border-radius: 0 !important;
                }
                .Polaris-Popover__Content {
                    margin-top: 16px !important;
                    border-radius: 12px !important;
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15) !important;
                    overflow: hidden !important;
                    border: none !important;
                }
                /* Restore styling only inside content */
                .Polaris-Popover__Content .Polaris-Box {
                    --p-color-border: var(--p-color-border) !important;
                }
                /* Remove any pseudo-element borders */
                .Polaris-Popover .Polaris-Box::before,
                .Polaris-Popover .Polaris-Box::after,
                .Polaris-Popover::before,
                .Polaris-Popover::after,
                .Polaris-Popover > div::before,
                .Polaris-Popover > div::after {
                    display: none !important;
                    border: 0 !important;
                    content: none !important;
                }
            `;
      document.head.appendChild(style);
    }
  }, []);

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
      <style>{`
        /* ========================================
           GLOBAL POLARIS POPOVER RESET
           ======================================== */
        
        /* Override Polaris CSS variables specifically for popover wrappers */
        .Polaris-Popover {
          --p-color-bg-surface: transparent !important;
          --p-shadow-600: none !important;
          --p-shadow-500: none !important;
          --p-shadow-400: none !important;
        }
        
        /* But restore it for content areas */
        .Polaris-Popover__Content,
        .Polaris-Popover__Pane,
        .Polaris-ActionList {
          --p-color-bg-surface: white !important;
        }
        
        /* Force all popover-related elements to be transparent */
        [class*="Polaris-Popover"]:not([class*="Content"]):not([class*="Pane"]):not([class*="Section"]) {
          background: transparent !important;
          background-color: transparent !important;
          box-shadow: none !important;
        }
        
        /* Target portal/layer containers */
        [data-portal-id] > div,
        [data-polaris-layer] > div,
        .Polaris-Portal > div {
          background: transparent !important;
        }
        
        /* Specifically target the popover surface */
        .Polaris-Popover > div,
        .Polaris-Popover > div > div:not(.Polaris-Popover__Content) {
          background: transparent !important;
          background-color: transparent !important;
        }
        
        /* ========================================
           HEADER CONTAINER
           ======================================== */
        
        .header-container {
          position: relative;
          width: 100%;
          height: 56px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 12px 0 24px;
          box-sizing: border-box;
          background: #1a1a1a;
        }
        
        /* Glow effects - hidden to remove white shadow */
        .header-glow {
          display: none;
        }
        
        .header-glow::before {
          display: none;
        }
        
        .header-glow::after {
          display: none;
        }
        
        /* ========================================
           LOGO SECTION
           ======================================== */
        
        .logo-section {
          display: flex;
          align-items: center;
          gap: 8px;
          min-width: 120px;
        }
        
        .logo-section img {
          image-rendering: -webkit-optimize-contrast;
          image-rendering: crisp-edges;
          backface-visibility: hidden;
          transform: translateZ(0);
          will-change: auto;
        }
        
        /* ========================================
           SEARCH SECTION
           ======================================== */
        
        .search-section {
          flex: 1;
          max-width: 650px;
          margin: 0 20px 0 40px;
          padding-left: 20px;
          display: flex;
          justify-content: flex-start;
        }
        
        /* Unsaved changes container - styled like search bar */
        .unsaved-changes-container {
          width: 100%;
          height: 36px;
          background: #303030;
          border-radius: 13px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 12px;
          border-top: 1px solid #5a5a5a;
          border-left: 1px solid #5a5a5a;
          border-right: 1px solid #5a5a5a;
          border-bottom: none;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.08);
          transition: all 0.2s ease;
        }
        
        .unsaved-changes-bar {
          display: flex;
          align-items: center;
          flex: 1;
        }
        
        .unsaved-changes-bar .Polaris-Text {
          color: white !important;
        }
        
        .unsaved-changes-text {
          color: #e2e2e2 !important;
          font-size: 12px;
          font-weight: 500;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        }
        
        .unsaved-changes-bar .Polaris-Icon svg {
          color: #8a8a8a !important;
        }
        
        .unsaved-changes-actions {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-left: auto;
          margin-right: -6px;
        }
        
        .unsaved-changes-actions .Polaris-Button {
          height: 28px;
          padding: 0 12px;
          font-size: 13px;
          border-radius: 13px;
          box-shadow: none !important;
        }
        
        .unsaved-changes-actions .Polaris-Button--variantPrimary {
          background: #676767;
          color: #8a8a8a !important;
          border: none !important;
        }
        
        .unsaved-changes-actions .Polaris-Button--variantPrimary:hover {
          background: #5a5a5a;
          color: #8a8a8a !important;
          border: none !important;
        }
        
        .unsaved-changes-actions .Polaris-Button--variantPrimary .Polaris-Button__Text {
          color: #8a8a8a !important;
        }
        
        .unsaved-changes-actions .Polaris-Button:not(.Polaris-Button--variantPrimary) {
          background: #404040;
          color: #dcdcdc;
          border: none !important;
          box-shadow: none !important;
        }
        
        .unsaved-changes-actions .Polaris-Button:not(.Polaris-Button--variantPrimary):hover {
          background: #4a4a4a;
          border: none !important;
          box-shadow: none !important;
        }
        
        .search-container {
          position: relative;
          width: 100%;
        }
        
        .search-container.expanded {
          z-index: 1000;
        }
        
        /* Collapsed search bar */
        .search-bar {
          width: 100%;
          height: 36px;
          background: #303030;
          border-radius: 13px;
          display: flex;
          align-items: center;
          padding: 0 12px;
          cursor: pointer;
          border-top: 1px solid #5a5a5a;
          border-left: 1px solid #5a5a5a;
          border-right: 1px solid #5a5a5a;
          border-bottom: none;
          position: relative;
          transition: all 0.2s ease;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.08);
        }
        
        .search-bar:hover {
          background: #404040;
        }
        
        .search-bar-text {
          margin-left: 8px;
          color: #dcdcdc;
          font-size: 14px;
          flex: 1;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        }
        
        .keyboard-shortcut {
          display: flex;
          align-items: center;
          gap: 2px;
        }
        
        .key-icon {
          color: #8C9196;
          font-size: 11px;
          font-weight: 500;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          background: rgba(255, 255, 255, 0.08);
          padding: 2px 6px;
          border-radius: 4px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-width: 20px;
          height: 18px;
        }
        
        /* Expanded search bar */
        .search-bar-expanded {
          background: white;
          border-radius: 13px 13px 0 0;
          border: none;
          border-top: 1px solid #5a5a5a;
          border-left: 1px solid #5a5a5a;
          border-right: 1px solid #5a5a5a;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          cursor: text;
        }
        
        .search-bar-expanded::before {
          display: none;
        }
        
        .search-bar-expanded:hover {
          background: white;
        }
        
        .search-expanded-input {
          flex: 1;
          border: none;
          outline: none;
          font-size: 14px;
          color: #202223;
          background: transparent;
          margin-left: 8px;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        }
        
        .search-expanded-input::placeholder {
          color: #dcdcdc;
        }
        
        .search-bar-actions {
          display: flex;
          align-items: center;
          gap: 4px;
        }
        
        .settings-btn {
          padding: 6px;
          border-radius: 6px;
          background: transparent;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.15s ease;
        }
        
        .settings-btn:hover {
          background: #f6f6f7;
        }
        
        .clear-btn {
          padding: 6px;
          border-radius: 6px;
          background: transparent;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.15s ease;
        }
        
        .clear-btn:hover {
          background: #f6f6f7;
        }
        
        /* Color all icons in search bar actions to #a2a2a2 */
        .search-bar-actions .settings-btn .Polaris-Icon svg,
        .search-bar-actions .settings-btn .Polaris-Icon svg path,
        .search-bar-actions .settings-btn .Polaris-Icon svg * {
          fill: #a2a2a2 !important;
          color: #a2a2a2 !important;
        }
        
        .search-bar-actions .clear-btn svg,
        .search-bar-actions .clear-btn svg path,
        .search-bar-actions .clear-btn svg circle {
          stroke: #a2a2a2 !important;
          color: #a2a2a2 !important;
        }
        
        /* Search dropdown */
        .search-dropdown {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          background: white;
          border-radius: 0 0 12px 12px;
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.2);
          overflow: hidden;
          z-index: 1001;
        }
        
        .search-dropdown-filters {
          display: flex;
          gap: 8px;
          padding: 12px 20px;
          border-top: 1px solid #e3e3e3;
          flex-wrap: wrap;
        }
        
        .search-filter-pill {
          padding: 6px 12px;
          border-radius: 8px;
          background: #f6f6f7;
          border: 1px solid #e3e3e3;
          font-size: 13px;
          color: #202223;
          cursor: pointer;
          transition: all 0.15s ease;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        }
        
        .search-filter-pill:hover {
          background: #e9e9e9;
        }
        
        .search-filter-pill.active {
          background: #1a1a1a;
          color: white;
          border-color: #1a1a1a;
        }
        
        .search-dropdown-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 48px 24px;
        }
        
        .search-dropdown-text {
          font-size: 15px;
          color: #202223;
          margin-top: 16px;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        }
        
        /* Filter dropdown */
        .filter-dropdown {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          background: white;
          border-radius: 0 0 12px 12px;
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.2);
          overflow: hidden;
          z-index: 1002;
          max-height: 400px;
          display: flex;
          flex-direction: column;
        }
        
        .filter-dropdown-header {
          padding: 12px 16px;
          border-bottom: 1px solid #e3e3e3;
          font-size: 13px;
          color: #6d7175;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        }
        
        .filter-dropdown-list {
          flex: 1;
          overflow-y: auto;
          padding: 8px 12px;
        }
        
        .filter-dropdown-item {
          display: inline-flex;
          padding: 6px 12px;
          margin: 4px;
          border-radius: 8px;
          background: #f6f6f7;
          border: 1px solid #e3e3e3;
          font-size: 13px;
          color: #202223;
          cursor: pointer;
          transition: all 0.15s ease;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        }
        
        .filter-dropdown-item:hover {
          background: #e9e9e9;
        }
        
        .filter-dropdown-item.active {
          background: #1a1a1a;
          color: white;
          border-color: #1a1a1a;
        }
        
        /* Search overlay */
        .search-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.3);
          z-index: 999;
        }
        
        /* ========================================
           RIGHT SECTION - ICONS & PROFILE
           ======================================== */
        
        .header-right-section {
          display: flex;
          align-items: center;
          gap: 4px;
        }
        
        .header-icon-btn {
          background: transparent;
          border: none;
          padding: 8px;
          border-radius: 8px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.15s ease;
          color: white;
        }
        
        .header-icon-btn:hover {
          background: rgba(255, 255, 255, 0.1);
        }
        
        .header-icon-btn svg {
          fill: white;
        }
        
        .header-icon-btn.active {
          background: rgba(139, 92, 246, 0.3);
        }
        
        /* When sidekick/notification panel is open, keep ALL header icons dark on hover - no white background */
        .header-icon-btn.active:hover {
          background: transparent !important;
        }
        
        /* When sidekick panel is open, keep all header icons dark on hover */
        body:has(.sidekick-panel) .header-icon-btn:hover {
          background: rgba(255, 255, 255, 0.05) !important;
        }
        
        /* Profile button */
        .profile-btn {
          background: transparent;
          border: none;
          padding: 4px 8px;
          border-radius: 8px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: background 0.15s ease;
        }
        
        .profile-btn:hover {
          background: rgba(255, 255, 255, 0.1);
        }
        
        .profile-avatar {
          position: relative;
        }
        
        .profile-avatar-inner {
          width: 24px;
          height: 24px;
          border-radius: 6px;
          background: linear-gradient(135deg, #6fcf97 0%, #4caf50 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 10px;
          font-weight: 600;
          color: white;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          text-transform: lowercase;
        }
        
        .profile-status {
          position: absolute;
          bottom: -2px;
          right: -2px;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background-color: #4caf50;
          border: 2px solid #1a1812;
        }
        
        .profile-username {
          color: #E3E5E7;
          font-size: 13px;
          font-weight: 500;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        }
        
        /* ========================================
           DROPDOWN STYLES
           ======================================== */
        
        .profile-dropdown-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 16px;
          border-bottom: 1px solid #e1e3e5;
        }
        
        .profile-dropdown-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 16px;
          cursor: pointer;
          transition: background 0.1s ease;
        }
        
        .profile-dropdown-item:hover {
          background: #f6f6f7;
        }
        
        .profile-dropdown-divider {
          height: 1px;
          background: #e1e3e5;
          margin: 4px 0;
        }
        
        /* Notification styles */
        .notification-popover-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px;
          border-bottom: 1px solid #e1e3e5;
        }
        
        .notification-popover-actions {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .notification-item {
          padding: 16px;
          border-bottom: 1px solid #f1f1f1;
          cursor: pointer;
          transition: background 0.1s ease;
        }
        
        .notification-item:hover {
          background: #f9fafb;
        }
        
        .notification-item:last-child {
          border-bottom: none;
        }
        
        .notification-category {
          font-size: 12px;
          color: #6d7175;
          margin-bottom: 4px;
        }
        
        .notification-title {
          font-size: 14px;
          font-weight: 600;
          color: #202223;
          margin-bottom: 4px;
        }
        
        .notification-description {
          font-size: 13px;
          color: #6d7175;
        }
        
        .notification-footer {
          padding: 12px 16px;
          text-align: center;
          border-top: 1px solid #e1e3e5;
          margin-top: 8px;
        }
        
        .icon-btn {
          padding: 6px;
          border-radius: 6px;
          background: transparent;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #6d7175;
          transition: background 0.2s ease;
        }
        
        .icon-btn:hover {
          background: #f1f1f1;
        }
        
        /* ========================================
           MOBILE MENU BUTTON
           ======================================== */
        
        .mobile-menu-btn {
          display: none;
          align-items: center;
          justify-content: center;
          background: transparent;
          border: none;
          cursor: pointer;
          padding: 8px;
          margin-right: 8px;
          border-radius: 8px;
        }
        
        .mobile-menu-btn:hover {
          background: rgba(255, 255, 255, 0.1);
        }
        
        .mobile-menu-btn svg {
          fill: white;
          color: white;
        }
        
        /* ========================================
           POPOVER OVERRIDES - TRANSPARENT GAP
           ======================================== */
        
        /* Nuclear option: make EVERYTHING transparent except content */
        .Polaris-Popover,
        .Polaris-Popover *:not(.Polaris-Popover__Content):not(.Polaris-Popover__Content *),
        .Polaris-PositionedOverlay,
        .Polaris-PositionedOverlay > div,
        .Polaris-Popover__PopoverOverlay,
        .Polaris-Popover__Wrapper {
          background: transparent !important;
          background-color: transparent !important;
          box-shadow: none !important;
          border: 0 !important;
          border-width: 0 !important;
          border-style: none !important;
          border-color: transparent !important;
          outline: none !important;
          --p-color-border: transparent !important;
          --p-color-border-secondary: transparent !important;
        }
        
        /* Target the specific surface element that creates the gray bg */
        div[class*="Polaris-Popover"]:not([class*="Content"]):not([class*="Pane"]) {
          background: transparent !important;
          background-color: transparent !important;
          border: 0 !important;
        }
        
        /* Target Polaris Box elements in popover but not in content */
        .Polaris-Popover .Polaris-Box:not(.Polaris-Popover__Content .Polaris-Box) {
          background: transparent !important;
          background-color: transparent !important;
          border: 0 !important;
          border-width: 0 !important;
          border-style: none !important;
          border-color: transparent !important;
          border-top: 0 !important;
          border-right: 0 !important;
          border-bottom: 0 !important;
          border-left: 0 !important;
          --p-color-border: transparent !important;
        }
        
        /* Target any element with surface-like background in popover */
        .Polaris-Popover [style*="background"],
        .Polaris-Popover [style*="surface"] {
          background: transparent !important;
        }
        
        /* Hide the popover arrow/tip connector completely */
        .Polaris-Popover__Tip,
        .Polaris-Popover__TipGradient,
        .Polaris-Popover__FocusTracker,
        [class*="Tip"] {
          display: none !important;
          opacity: 0 !important;
          visibility: hidden !important;
        }
        
        /* The main popover container should be transparent */
        .Polaris-Popover {
          background: transparent !important;
          border: 0 !important;
        }
        
        /* Target the wrapper/surface that usually has the bg */
        .Polaris-Popover > div:first-child {
          background: transparent !important;
          box-shadow: none !important;
          border-radius: 0 !important;
          border: 0 !important;
        }
        
        /* Target specific Polaris class patterns */
        [class*="Polaris-Popover"][class*="Surface"],
        [class*="Polaris-Box"][class*="surface"] {
          background: transparent !important;
          border: 0 !important;
        }
        
        /* Only the content div should have white background with gap */
        .Polaris-Popover__Content {
          border-radius: 12px !important;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15) !important;
          margin-top: 16px !important;
          background: white !important;
          overflow: hidden !important;
          border: none !important;
        }
        
        /* Override inline border styles on Box */
        .Polaris-Popover [class*="Polaris-Box"][style*="border"] {
          border: 0 solid transparent !important;
          border-width: 0 !important;
        }
        
        /* Target any element with inline border styling */
        .Polaris-Popover [style*="border"]:not(.Polaris-Popover__Content):not(.Polaris-Popover__Content *) {
          border: 0 solid transparent !important;
          border-width: 0 !important;
          border-color: transparent !important;
        }
        
        /* Specifically target border-block and border-inline properties */
        .Polaris-Popover .Polaris-Box:not(.Polaris-Popover__Content .Polaris-Box) {
          border-block: 0 !important;
          border-inline: 0 !important;
          border-block-start: 0 !important;
          border-block-end: 0 !important;
          border-inline-start: 0 !important;
          border-inline-end: 0 !important;
        }
        
        /* Content pane styling */
        .Polaris-Popover__Pane {
          background: white !important;
        }
        
        /* Ensure no surface/background colors leak through */
        .Polaris-Popover__Content .Polaris-Box,
        .Polaris-Popover__Content .Polaris-Scrollable {
          background: white !important;
        }
        
        /* Ensure the section within content is white */
        .Polaris-Popover__Section {
          background: white !important;
        }
        
        /* Action list items should have white background */
        .Polaris-ActionList {
          background: white !important;
        }
        
        /* Override any inline styles on popover elements */
        [data-polaris-layer] > div {
          background: transparent !important;
        }
        
        /* ========================================
           MOBILE RESPONSIVE
           ======================================== */
        
        @media (max-width: 768px) {
          .header-container {
            padding: 0 8px;
          }
          
          .logo-section {
            display: none;
          }
          
          .search-section {
            margin: 0 8px;
            max-width: none;
            flex: 1;
          }
          
          .keyboard-shortcut {
            display: none;
          }
          
          .profile-username {
            display: none;
          }
          
          .mobile-menu-btn {
            display: flex;
          }
        }
        
        @media (max-width: 480px) {
          .header-container {
            padding: 0 6px;
          }
          
          .search-section {
            margin: 0 4px;
          }
        }
      `}</style>

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
        <div className="logo-section">
          <img
            src="/logos/shopify-logo-mono.svg"
            alt="Shopify"
            style={{ height: '24px', width: 'auto' }}
            loading="eager"
            key="shopify-logo-header"
          />
        </div>

        {/* Center section - Search bar or Unsaved changes */}
        <div className="search-section">
          {shouldShowUnsavedChanges ? (
            <div className="unsaved-changes-container">
              <div className="unsaved-changes-bar">
                <InlineStack gap="200" blockAlign="center">
                  <Icon source={AlertCircleIcon} tone="subdued" />
                  <span className="unsaved-changes-text">Unsaved changes</span>
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
                  <Scrollable style={{ maxHeight: '340px' }}>
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
                        : 'Find anything in skshafeen'
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
            <div style={{ width: '400px', maxHeight: '600px' }}>
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
              <Scrollable style={{ maxHeight: '520px' }}>
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
                  <div className="profile-avatar-inner">sks</div>
                  <div className="profile-status" />
                </div>
                <span className="profile-username">skshafeen</span>
              </button>
            }
            onClose={toggleProfilePopover}
            preferredAlignment="right"
            preferredPosition="below"
          >
            <div style={{ minWidth: '260px' }}>
              {/* Current store with checkmark */}
              <div className="profile-dropdown-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '6px',
                    background: 'linear-gradient(135deg, #6fcf97 0%, #4caf50 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '10px',
                    fontWeight: '600',
                    color: 'white',
                    textTransform: 'lowercase',
                  }}>
                    sks
                  </div>
                  <span style={{ fontWeight: '600', fontSize: '14px', color: '#202223' }}>
                    skshafeen
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
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #e91e8c 0%, #c2185b 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '12px',
                  fontWeight: '600',
                  color: 'white',
                }}>
                  SK
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontWeight: '600', fontSize: '14px', color: '#202223' }}>
                    Shafeen Khaan
                  </span>
                  <span style={{ fontSize: '12px', color: '#6d7175' }}>
                    skshafeen2022@gmail.com
                  </span>
                </div>
              </div>

              <div className="profile-dropdown-divider" />

              <ActionList
                items={[
                  {
                    content: 'Log out',
                    icon: ExitIcon,
                    onAction: () => console.log('Log out'),
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