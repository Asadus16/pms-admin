'use client';

import { Icon } from '@shopify/polaris';
import './styles/SettingsNavigation.css';
import './styles/SettingsResponsive.css';
import {
  SearchIcon,
  PersonIcon,
  PersonFilledIcon,
  AppsIcon,
  AppsFilledIcon,
  NotificationIcon,
  NotificationFilledIcon,
  FileIcon,
  FileFilledIcon,
  StoreIcon,
  StoreFilledIcon,
  CreditCardIcon,
  PaymentIcon,
  PaymentFilledIcon,
  ChevronRightIcon,
} from '@shopify/polaris-icons';

// Settings navigation items (simplified)
// icon = regular (bold) for inactive state
// iconFilled = filled (light) for active state
export const settingsNavItems = [
  {
    id: 'general',
    label: 'General',
    icon: StoreIcon,
    iconFilled: StoreFilledIcon
  },
  {
    id: 'plan',
    label: 'Plan',
    icon: FileIcon,
    iconFilled: FileFilledIcon
  },
  {
    id: 'billing',
    label: 'Billing',
    icon: CreditCardIcon,
    iconFilled: CreditCardIcon
  },
  {
    id: 'users',
    label: 'Users',
    icon: PersonIcon,
    iconFilled: PersonFilledIcon,
    subItems: [
      { id: 'roles', label: 'Roles' },
      { id: 'security', label: 'Security' },
    ]
  },
  {
    id: 'transactions',
    label: 'Payments',
    icon: PaymentIcon,
    iconFilled: PaymentFilledIcon
  },
  {
    id: 'apps',
    label: 'Apps and sales channels',
    icon: AppsIcon,
    iconFilled: AppsFilledIcon
  },
  {
    id: 'notifications',
    label: 'Notifications',
    icon: NotificationIcon,
    iconFilled: NotificationFilledIcon
  },
];

function SettingsNavigation({
  activeSection,
  searchQuery,
  setSearchQuery,
  onNavClick,
  isMobile = false,
  onMobileItemClick
}) {
  const filteredNavItems = settingsNavItems.filter(item =>
    item.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Check if a parent item or any of its sub-items is active
  const isItemOrSubItemActive = (item) => {
    if (activeSection === item.id) return true;
    if (item.subItems) {
      return item.subItems.some(subItem => activeSection === subItem.id);
    }
    return false;
  };

  const handleItemClick = (item) => {
    onNavClick(item.id);
    if (isMobile && onMobileItemClick) {
      onMobileItemClick();
    }
  };

  return (
    <div className="settings-sidebar">
      {/* Store Info */}
      <div className="settings-store-info">
        <div className="settings-store-info-content">
          <div className="settings-store-avatar">sks</div>
          <div className="settings-store-details">
            <div className="settings-store-name">skshafeen</div>
            <div className="settings-store-url">www.shafeenbeauty.com</div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="settings-search">
        <div className="settings-search-wrapper">
          <div className="settings-search-icon">
            <Icon source={SearchIcon} />
          </div>
          <input
            type="text"
            className="settings-search-input"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Navigation */}
      <nav className="settings-nav">
        {filteredNavItems.map((item) => {
          const isActive = activeSection === item.id;
          const hasSubItems = item.subItems && item.subItems.length > 0;
          const showSubItems = hasSubItems && isItemOrSubItemActive(item);
          const IconComponent = isActive || showSubItems ? (item.iconFilled || item.icon) : item.icon;

          return (
            <div key={item.id} className="settings-nav-item-wrapper">
              <button
                className={`settings-nav-item ${isActive || showSubItems ? 'active' : ''}`}
                onClick={() => handleItemClick(item)}
              >
                <span className={`settings-nav-item-icon ${isActive || showSubItems ? 'active' : ''}`}>
                  <Icon source={IconComponent} />
                </span>
                <span className="settings-nav-item-label">{item.label}</span>
                {/* Arrow for mobile */}
                <span className="settings-nav-item-arrow">
                  <Icon source={ChevronRightIcon} />
                </span>
              </button>
              {/* Sub-items - only show when parent or sub-item is active */}
              {showSubItems && (
                <div className="settings-nav-sub-items">
                  {item.subItems.map((subItem) => (
                    <button
                      key={subItem.id}
                      className={`settings-nav-sub-item ${activeSection === subItem.id ? 'active' : ''}`}
                      onClick={() => {
                        onNavClick(subItem.id);
                        if (isMobile && onMobileItemClick) {
                          onMobileItemClick();
                        }
                      }}
                    >
                      <span className="settings-nav-sub-item-label">{subItem.label}</span>
                      <span className="settings-nav-item-arrow">
                        <Icon source={ChevronRightIcon} />
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* User Info */}
      <div className="settings-user-info">
        <div className="settings-user-content">
          <div className="settings-user-avatar">SK</div>
          <div className="settings-user-details">
            <div className="settings-user-name">Shafeen Khaan</div>
            <div className="settings-user-email">skshafeen2022@gmail.com</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SettingsNavigation;
