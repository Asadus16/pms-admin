'use client';

import { Icon } from '@shopify/polaris';
import { Button } from '@shopify/polaris';
import './styles/GeneralSettings.css';
import {
  StoreIcon,
  LocationIcon,
  EditIcon,
  MenuHorizontalIcon,
  ChevronRightIcon,
  QuestionCircleIcon,
  FolderIcon,
  HashtagIcon,
  ListBulletedIcon,
  CodeIcon,
  KeyboardIcon,
  ClockIcon,
} from '@shopify/polaris-icons';

function GeneralSettings({ formState, onInputChange }) {
  return (
    <>
      {/* Store Details */}
      <div className="settings-card">
        <div className="settings-card-header-no-border">
          <h2 className="settings-card-title">Store details</h2>
        </div>
        <div className="settings-card-content">
          <div className="store-details-bordered-content">
            <div className="store-details-item-no-border">
              <div className="store-details-icon">
                <Icon source={StoreIcon} />
              </div>
              <div className="store-details-content">
                <div className="store-details-label">skshafeen</div>
                <div className="store-details-value-inline">
                  <span>skshafeen2022@gmail.com</span>
                  <span className="dot">•</span>
                  <span>9741113355</span>
                </div>
              </div>
              <button className="store-details-edit-btn">
                <Icon source={EditIcon} />
              </button>
            </div>
            <div className="store-details-divider"></div>
            <div className="store-details-item-no-border">
              <div className="store-details-icon">
                <Icon source={LocationIcon} />
              </div>
              <div className="store-details-content">
                <div className="store-details-label">Billing address</div>
                <div className="store-details-value">
                  Shafeen Beauty, 25th 25th Main Road 1st Sector HSR Layout, 2456 MMABS, 560102 Bengaluru Karnataka, India
                </div>
              </div>
              <button className="store-details-edit-btn">
                <Icon source={EditIcon} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Store Defaults */}
      <div className="settings-card">
        <div className="settings-card-header-no-border">
          <h2 className="settings-card-title">Store defaults</h2>
        </div>
        <div className="settings-card-content">
          {/* Currency Display - has its own border */}
          <div className="store-defaults-currency-section">
            <div className="store-defaults-row">
              <div className="store-defaults-row-content">
                <div className="store-defaults-row-label">Currency display</div>
                <div className="store-defaults-row-description">
                  To manage the currencies customers see, go to <a href="#">Markets</a>
                </div>
              </div>
              <div className="store-defaults-row-action">
                <span className="currency-badge">Indian Rupee (INR ₹)</span>
                <button className="currency-menu-btn">
                  <Icon source={MenuHorizontalIcon} />
                </button>
              </div>
            </div>
          </div>

          {/* Other Store Defaults - no border */}
          <div className="store-defaults-no-border-section">
            {/* Backup Region */}
            <div className="store-defaults-row">
              <div className="store-defaults-row-content-full">
                <div className="store-defaults-field">
                  <label className="store-defaults-field-label">Backup Region</label>
                  <div className="store-defaults-select-wrapper-full">
                    <select
                      className="store-defaults-select-input"
                      value={formState.backupRegion}
                      onChange={(e) => onInputChange('backupRegion', e.target.value)}
                    >
                      <option value="India">India</option>
                      <option value="United States">United States</option>
                      <option value="Europe">Europe</option>
                      <option value="Asia Pacific">Asia Pacific</option>
                    </select>
                    <div className="store-defaults-select-icon">
                      <Icon source={ChevronRightIcon} />
                    </div>
                  </div>
                </div>
                <div className="store-defaults-row-description">
                  Determines settings for customers outside of your markets
                </div>
              </div>
            </div>

            {/* Unit System and Weight Unit */}
            <div className="store-defaults-row-grid">
              <div className="store-defaults-field">
                <label className="store-defaults-field-label">Unit system</label>
                <div className="store-defaults-select-wrapper">
                  <select
                    className="store-defaults-select-input"
                    value={formState.unitSystem}
                    onChange={(e) => onInputChange('unitSystem', e.target.value)}
                  >
                    <option value="Metric system">Metric system</option>
                    <option value="Imperial system">Imperial system</option>
                  </select>
                  <div className="store-defaults-select-icon">
                    <Icon source={ChevronRightIcon} />
                  </div>
                </div>
              </div>
              <div className="store-defaults-field">
                <label className="store-defaults-field-label">Default weight unit</label>
                <div className="store-defaults-select-wrapper">
                  <select
                    className="store-defaults-select-input"
                    value={formState.weightUnit}
                    onChange={(e) => onInputChange('weightUnit', e.target.value)}
                  >
                    <option value="Gram (g)">Gram (g)</option>
                    <option value="Kilogram (kg)">Kilogram (kg)</option>
                    <option value="Ounce (oz)">Ounce (oz)</option>
                    <option value="Pound (lb)">Pound (lb)</option>
                  </select>
                  <div className="store-defaults-select-icon">
                    <Icon source={ChevronRightIcon} />
                  </div>
                </div>
              </div>
            </div>

            {/* Time Zone */}
            <div className="store-defaults-row">
              <div className="store-defaults-row-content-full">
                <div className="store-defaults-field">
                  <label className="store-defaults-field-label">Time zone</label>
                  <div className="store-defaults-select-wrapper-full">
                    <select
                      className="store-defaults-select-input"
                      value={formState.timeZone}
                      onChange={(e) => onInputChange('timeZone', e.target.value)}
                    >
                      <option value="(GMT+05:30) Chennai, Kolkata, Mumbai, New Delhi">(GMT+05:30) Chennai, Kolkata, Mumbai, New Delhi</option>
                      <option value="(GMT+00:00) UTC">(GMT+00:00) UTC</option>
                      <option value="(GMT-05:00) Eastern Time">(GMT-05:00) Eastern Time</option>
                      <option value="(GMT-08:00) Pacific Time">(GMT-08:00) Pacific Time</option>
                    </select>
                    <div className="store-defaults-select-icon">
                      <Icon source={ChevronRightIcon} />
                    </div>
                  </div>
                </div>
                <div className="store-defaults-row-description">
                  Sets the time for when orders and analytics are recorded
                </div>
              </div>
            </div>

            <div className="store-defaults-row-footer">
              <div className="store-defaults-row-description">
                To change your user level time zone and language visit your <a href="#">account settings</a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Order ID */}
      <div className="settings-card">
        <div className="settings-card-header-no-border">
          <h2 className="settings-card-title">Order ID</h2>
        </div>
        <div className="settings-card-content">
          <div className="order-id-content">
            <div className="order-id-description">
              Shown on the order page, customer pages, and customer order notifications to identify order
            </div>
            <div className="order-id-fields">
              <div className="order-id-field">
                <label className="order-id-field-label">Prefix</label>
                <input
                  type="text"
                  className="order-id-input"
                  value={formState.orderPrefix}
                  onChange={(e) => onInputChange('orderPrefix', e.target.value)}
                  placeholder="#"
                />
              </div>
              <div className="order-id-field">
                <label className="order-id-field-label">Suffix</label>
                <input
                  type="text"
                  className="order-id-input"
                  value={formState.orderSuffix}
                  onChange={(e) => onInputChange('orderSuffix', e.target.value)}
                  placeholder=""
                />
              </div>
            </div>
            <div className="order-id-preview">
              Your order ID will appear as {formState.orderPrefix}1001, {formState.orderPrefix}1002, {formState.orderPrefix}1003 ...
            </div>
          </div>
        </div>
      </div>

      {/* Order Processing */}
      <div className="settings-card">
        <div className="settings-card-header-no-border">
          <h2 className="settings-card-title">
            <span className="order-processing-title">
              Order processing
              <span className="order-processing-info-icon">
                <Icon source={QuestionCircleIcon} />
              </span>
            </span>
          </h2>
        </div>
        <div className="settings-card-content">
          <div className="order-processing-content">
            <div className="order-processing-section">
              <div className="order-processing-section-label">After an order has been paid</div>
              <div className="order-processing-radio-group">
                <label className="order-processing-radio-option">
                  <input
                    type="radio"
                    name="fulfillment"
                    className="order-processing-radio-input"
                    value="auto-fulfill"
                    checked={formState.fulfillmentOption === 'auto-fulfill'}
                    onChange={(e) => onInputChange('fulfillmentOption', e.target.value)}
                  />
                  <span className="order-processing-radio-label">Automatically fulfill the order's line items</span>
                </label>
                <label className="order-processing-radio-option">
                  <input
                    type="radio"
                    name="fulfillment"
                    className="order-processing-radio-input"
                    value="gift-cards"
                    checked={formState.fulfillmentOption === 'gift-cards'}
                    onChange={(e) => onInputChange('fulfillmentOption', e.target.value)}
                  />
                  <span className="order-processing-radio-label">Automatically fulfill only the gift cards of the order</span>
                </label>
                <label className="order-processing-radio-option">
                  <input
                    type="radio"
                    name="fulfillment"
                    className="order-processing-radio-input"
                    value="no-auto"
                    checked={formState.fulfillmentOption === 'no-auto'}
                    onChange={(e) => onInputChange('fulfillmentOption', e.target.value)}
                  />
                  <span className="order-processing-radio-label">Don't fulfill any of the order's line items automatically</span>
                </label>
              </div>
            </div>

            <div className="order-processing-section">
              <div className="order-processing-section-label">After an order has been fulfilled and paid, or when all items have been refunded</div>
              <label className="order-processing-checkbox-option">
                <input
                  type="checkbox"
                  className="order-processing-checkbox-input"
                  checked={formState.autoArchive}
                  onChange={(e) => onInputChange('autoArchive', e.target.checked)}
                />
                <div className="order-processing-checkbox-content">
                  <span className="order-processing-checkbox-label">Automatically archive the order</span>
                  <span className="order-processing-checkbox-description">The order will be removed from your list of open orders.</span>
                </div>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Store Assets */}
      <div className="settings-card">
        <div className="settings-card-header-no-border">
          <h2 className="settings-card-title">Store assets</h2>
        </div>
        <div className="settings-card-content">
          <div className="store-assets-bordered-content">
            <div className="store-assets-item">
              <div className="store-assets-icon">
                <Icon source={FolderIcon} />
              </div>
              <div className="store-assets-content">
                <div className="store-assets-title">Metafields</div>
                <div className="store-assets-description">Available in themes and configurable for Storefront API</div>
              </div>
              <div className="store-assets-arrow">
                <Icon source={ChevronRightIcon} />
              </div>
            </div>
            <div className="store-assets-divider"></div>
            <div className="store-assets-item">
              <div className="store-assets-icon">
                <Icon source={HashtagIcon} />
              </div>
              <div className="store-assets-content">
                <div className="store-assets-title">Brand</div>
                <div className="store-assets-description">Integrate brand assets across sales channels, themes and apps</div>
              </div>
              <div className="store-assets-arrow">
                <Icon source={ChevronRightIcon} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Resources */}
      <div className="settings-card">
        <div className="settings-card-header-no-border">
          <h2 className="settings-card-title">Resources</h2>
        </div>
        <div className="settings-card-content">
          <div className="resources-bordered-content">
            <div className="resources-item">
              <div className="resources-info">
                <div className="resources-icon">
                  <Icon source={ListBulletedIcon} />
                </div>
                <span className="resources-label">Change log</span>
              </div>
              <Button size="slim">View change log</Button>
            </div>
            <div className="resources-divider"></div>
            <div className="resources-item">
              <div className="resources-info">
                <div className="resources-icon">
                  <Icon source={QuestionCircleIcon} />
                </div>
                <span className="resources-label">Shopify Help Center</span>
              </div>
              <Button size="slim">Get help</Button>
            </div>
            <div className="resources-divider"></div>
            <div className="resources-item">
              <div className="resources-info">
                <div className="resources-icon">
                  <Icon source={CodeIcon} />
                </div>
                <span className="resources-label">Hire a Shopify Partner</span>
              </div>
              <Button size="slim">Hire a Partner</Button>
            </div>
          </div>

          <div className="resources-nav-bordered-content">
            <div className="resources-nav-item">
              <div className="resources-nav-info">
                <div className="resources-icon">
                  <Icon source={KeyboardIcon} />
                </div>
                <span className="resources-label">Keyboard shortcuts</span>
              </div>
              <div className="resources-arrow">
                <Icon source={ChevronRightIcon} />
              </div>
            </div>
            <div className="resources-divider"></div>
            <div className="resources-nav-item">
              <div className="resources-nav-info">
                <div className="resources-icon">
                  <Icon source={ClockIcon} />
                </div>
                <span className="resources-label">Store activity log</span>
              </div>
              <div className="resources-arrow">
                <Icon source={ChevronRightIcon} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default GeneralSettings;
