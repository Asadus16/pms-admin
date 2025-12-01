import { useState, useCallback } from 'react';
import { 
  Icon, 
  Button, 
  ButtonGroup, 
  Popover, 
  ActionList, 
  Text,
  BlockStack,
  InlineStack,
  Scrollable,
  Badge,
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
} from '@shopify/polaris-icons';

function ShopifyHeader({ onMobileNavigationToggle, onSidekickToggle, isSidekickOpen }) {
  const [searchFocused, setSearchFocused] = useState(false);
  const [profilePopoverActive, setProfilePopoverActive] = useState(false);
  const [notificationPopoverActive, setNotificationPopoverActive] = useState(false);

  const toggleProfilePopover = useCallback(
    () => setProfilePopoverActive((active) => !active),
    []
  );

  const toggleNotificationPopover = useCallback(
    () => setNotificationPopoverActive((active) => !active),
    []
  );

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

  // Search icon
  const SearchIcon = () => (
    <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path 
        d="M9 17C13.4183 17 17 13.4183 17 9C17 4.58172 13.4183 1 9 1C4.58172 1 1 4.58172 1 9C1 13.4183 4.58172 17 9 17Z" 
        stroke="#8C9196" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      <path 
        d="M19 19L14.65 14.65" 
        stroke="#8C9196" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    </svg>
  );

  const notificationActivator = (
    <Button
      variant="tertiary"
      size="medium"
      icon={NotificationIcon}
      ariaLabel="Notifications"
      onClick={toggleNotificationPopover}
      pressed={notificationPopoverActive}
    />
  );

  return (
    <>
      <style>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        
        .header-container {
          position: relative;
        }
        
        .header-glow {
          position: absolute;
          inset: 0;
          border-radius: 0;
          pointer-events: none;
        }
        
        .header-glow::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(90deg, 
            transparent 0%, 
            rgba(255, 255, 255, 0.05) 10%,
            rgba(255, 255, 255, 0.1) 30%,
            rgba(255, 255, 255, 0.15) 50%,
            rgba(255, 255, 255, 0.1) 70%,
            rgba(255, 255, 255, 0.05) 90%,
            transparent 100%
          );
        }
        
        .header-glow::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(90deg, 
            transparent 0%, 
            rgba(255, 255, 255, 0.03) 10%,
            rgba(255, 255, 255, 0.08) 30%,
            rgba(255, 255, 255, 0.12) 50%,
            rgba(255, 255, 255, 0.08) 70%,
            rgba(255, 255, 255, 0.03) 90%,
            transparent 100%
          );
          box-shadow: 0 1px 2px rgba(255, 255, 255, 0.05);
        }
        
        .search-bar {
          transition: all 0.2s ease;
        }
        
        .search-bar:hover {
          background: #404040 !important;
        }
        
        .search-bar:focus-within {
          background: #404040 !important;
          box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.1);
        }
        
        .search-bar-gradient {
          z-index: 1;
        }
        
        .search-bar-input::placeholder {
          color: #8C9196;
        }
        
        .search-bar-input:focus::placeholder {
          color: #8C9196;
        }
        
        /* Polaris ButtonGroup styling for header */
        .header-container .Polaris-ButtonGroup {
          gap: 8px;
        }
        
        .header-container .Polaris-ButtonGroup__Item:first-child {
          margin-right: 4px;
        }
        
        .header-container .Polaris-ButtonGroup__Item:nth-child(2) {
          margin-left: 4px;
        }
        
        .header-container .Polaris-ButtonGroup__Item .Polaris-Button {
          background: transparent !important;
          border: none !important;
          outline: none !important;
          box-shadow: none !important;
          color: white !important;
        }
        
        .header-container .Polaris-ButtonGroup__Item .Polaris-Button:hover {
          background: rgba(255, 255, 255, 0.1) !important;
          border: none !important;
          outline: none !important;
          box-shadow: none !important;
        }
        
        .header-container .Polaris-ButtonGroup__Item .Polaris-Button:focus {
          border: none !important;
          outline: none !important;
          box-shadow: none !important;
        }
        
        .header-container .Polaris-ButtonGroup__Item .Polaris-Button:active {
          border: none !important;
          outline: none !important;
          box-shadow: none !important;
        }
        
        .header-container .Polaris-ButtonGroup__Item .Polaris-Button svg {
          fill: white !important;
          color: white !important;
        }
        
        .header-container .Polaris-ButtonGroup__Item .Polaris-Button svg path {
          fill: white !important;
        }
        
        .header-container .sidekick-btn-active .Polaris-Button {
          background: rgba(139, 92, 246, 0.3) !important;
        }
        
        /* Popover dropdown styling */
        .Polaris-Popover__Content {
          border-radius: 12px !important;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15) !important;
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
        
        .profile-dropdown-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 16px;
          border-bottom: 1px solid #e1e3e5;
        }
        
        .profile-dropdown-divider {
          height: 1px;
          background: #e1e3e5;
          margin: 4px 0;
        }
        
        /* Notification popover styles */
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
        
        /* Mobile responsive styles */
        @media (max-width: 768px) {
          .header-container {
            padding: 0 8px !important;
          }
          
          .header-container .logo-section {
            display: none !important;
          }
          
          .header-container .search-section {
            margin: 0 8px !important;
            max-width: none !important;
            flex: 1 !important;
          }
          
          .header-container .search-bar {
            width: 100% !important;
            min-width: auto !important;
          }
          
          .header-container .search-bar .search-placeholder {
            display: none !important;
          }
          
          .header-container .search-bar .keyboard-shortcut {
            display: none !important;
          }
          
          .header-container .profile-username {
            display: none !important;
          }
          
          .header-container .Polaris-ButtonGroup {
            gap: 4px !important;
          }
          
          .header-container .mobile-menu-btn {
            display: flex !important;
          }
          
          .header-container .Polaris-ButtonGroup__Item:first-child {
            display: flex !important;
          }
        }
        
        @media (min-width: 769px) {
          .header-container .mobile-menu-btn {
            display: none !important;
          }
        }
        
        @media (max-width: 480px) {
          .header-container {
            padding: 0 6px !important;
          }
          
          .header-container .search-section {
            margin: 0 4px !important;
          }
          
          .header-container .search-bar {
            padding: 0 8px !important;
          }
        }
        
        .mobile-menu-btn {
          display: none;
          align-items: center;
          justify-content: center;
          background: transparent;
          border: none;
          cursor: pointer;
          padding: 8px;
          margin-right: 8px;
        }
        
        .mobile-menu-btn:hover {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 8px;
        }
        
        .mobile-menu-btn svg {
          fill: white;
          color: white;
        }
      `}</style>
      
      <header className="header-container" style={{
        width: '100%',
        height: '56px',
        backgroundColor: '#1a1a1a',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 12px',
        boxSizing: 'border-box',
        position: 'relative',
        background: 'linear-gradient(180deg, #2d2a24 0%, #1a1812 100%)',

      }}>
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
        <div className="logo-section" style={{ 
          display: 'flex', 
          alignItems: 'center',
          gap: '8px',
          minWidth: '120px',
        }}>
          <img 
            src="/logos/shopify-logo-mono.svg" 
            alt="Shopify" 
            style={{ height: '24px', width: 'auto' }}
          />
        </div>

        {/* Center section - Search bar */}
        <div className="search-section" style={{
          flex: 1,
          maxWidth: '680px',
          margin: '0 20px',
          display: 'flex',
          justifyContent: 'center',
        }}>
          <div 
            className="search-bar"
            style={{
              width: '100%',
              height: '32px',
              backgroundColor: '#303030',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              padding: '0 10px',
              cursor: 'text',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              position: 'relative',
            }}
            onClick={() => {
              const input = document.querySelector('.search-bar-input');
              if (input) input.focus();
            }}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            tabIndex={0}
          >
            {/* White gradient shadow on top */}
            <div className="search-bar-gradient" style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '1px',
              background: 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.2) 50%, transparent 100%)',
              pointerEvents: 'none',
            }}></div>
            <SearchIcon />
            <input
              type="text"
              className="search-bar-input"
              placeholder="Search"
              style={{
                marginLeft: '8px',
                color: '#ffffff',
                fontSize: '13px',
                flex: 1,
                background: 'transparent',
                border: 'none',
                outline: 'none',
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
              }}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
            />
            <div className="keyboard-shortcut" style={{
              display: 'flex',
              alignItems: 'center',
              gap: '2px',
              marginLeft: '8px',
            }}>
              <span className="key-icon" style={{
                color: '#8C9196',
                fontSize: '11px',
                fontWeight: '500',
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                padding: '2px 6px',
                borderRadius: '4px',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                minWidth: '20px',
                height: '18px',
              }}>
                ⌘
              </span>
              <span className="key-icon" style={{
                color: '#8C9196',
                fontSize: '11px',
                fontWeight: '500',
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                padding: '2px 6px',
                borderRadius: '4px',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                minWidth: '20px',
                height: '18px',
              }}>
                K
              </span>
            </div>
          </div>
        </div>

        {/* Right section - Icons and Profile */}
        <ButtonGroup>
          {/* Sidekick icon */}
          <div className={isSidekickOpen ? 'sidekick-btn-active' : ''}>
            <Button
              variant="tertiary"
              size="medium"
              icon={SidekickIcon}
              ariaLabel="Sidekick"
              onClick={onSidekickToggle}
              pressed={isSidekickOpen}
            />
          </div>

          {/* Notification bell with Popover */}
          <Popover
            active={notificationPopoverActive}
            activator={notificationActivator}
            onClose={toggleNotificationPopover}
            preferredAlignment="right"
            preferredPosition="below"
            fluidContent
          >
            <div style={{ width: '400px', maxHeight: '500px' }}>
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
              <Scrollable style={{ maxHeight: '380px' }}>
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
              </Scrollable>
              
              {/* Footer */}
              <div className="notification-footer">
                <Text variant="bodySm" tone="subdued">
                  No more alerts
                </Text>
              </div>
            </div>
          </Popover>

          {/* User profile with Popover */}
          <Popover
            active={profilePopoverActive}
            activator={
              <Button
                variant="tertiary"
                size="medium"
                onClick={toggleProfilePopover}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ position: 'relative' }}>
                    <div style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '6px',
                      background: 'linear-gradient(135deg, #6fcf97 0%, #4caf50 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '10px',
                      fontWeight: '600',
                      color: 'white',
                      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                      textTransform: 'lowercase',
                    }}>
                      sks
                    </div>
                    <div style={{
                      position: 'absolute',
                      bottom: '-2px',
                      right: '-2px',
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor: '#4caf50',
                      border: '2px solid #1a1812',
                    }} />
                  </div>
                  <span className="profile-username" style={{
                    color: '#E3E5E7',
                    fontSize: '13px',
                    fontWeight: '500',
                    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                  }}>
                    skshafeen
                  </span>
                </div>
              </Button>
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
        </ButtonGroup>
      </header>
    </>
  );
}

export default ShopifyHeader;