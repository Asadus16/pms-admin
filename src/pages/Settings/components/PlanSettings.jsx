'use client';

import { Icon, Button } from '@shopify/polaris';
import { ChevronRightIcon } from '@shopify/polaris-icons';
import './styles/PlanSettings.css';

function PlanSettings() {
  return (
    <>
      {/* Plan Details */}
      <div className="settings-card">
        <div className="plan-details-header">
          <h2 className="settings-card-title">Plan details</h2>
          <Button>Change plan</Button>
        </div>
        <div className="settings-card-content">
          <div className="plan-details-bordered-content">
            <div className="plan-info-section">
              <div className="plan-name">Basic</div>
              <div className="plan-pricing">
                <span className="plan-price">₹17,988</span>
                <span className="plan-period">INR/year</span>
              </div>
              <a href="#" className="plan-switch-link">Switch to monthly</a>
              <div className="plan-features">
                <div className="plan-feature-item">
                  <span className="plan-feature-check">✓</span>
                  <span className="plan-feature-text">Shipping discounts</span>
                </div>
              </div>
            </div>
            <div className="plan-details-divider"></div>
            <div className="plan-view-features">
              <span className="plan-view-features-text">View all features</span>
              <div className="plan-view-features-arrow">
                <Icon source={ChevronRightIcon} />
              </div>
            </div>
          </div>
          <div className="plan-footer">
            <span className="plan-footer-text">
              View the <a href="#">terms of service</a> and <a href="#">privacy policy</a>
            </span>
            <Button tone="critical" variant="plain">Cancel plan</Button>
          </div>
        </div>
      </div>

      {/* Subscriptions */}
      <div className="settings-card">
        <div className="settings-card-header-no-border">
          <h2 className="settings-card-title">Subscriptions</h2>
        </div>
        <div className="subscriptions-description">
          Additional items you're billed for on a recurring basis
        </div>
        <div className="settings-card-content">
          <div className="subscriptions-bordered-content">
            <div className="subscription-item">
              <div className="subscription-icon">
                <img src="/images/meter.png" alt="TinySEO" />
              </div>
              <div className="subscription-content">
                <div className="subscription-name">TinySEO</div>
                <div className="subscription-details">
                  $14.00 (estimated ₹1,259.39 INR*) every 30 days, plus usage charges. Renews on December 27, 2025.
                </div>
              </div>
            </div>
            <div className="subscription-divider"></div>
            <div className="subscription-item">
              <div className="subscription-icon">
                <img src="/images/cart.png" alt="Advanced COD" />
              </div>
              <div className="subscription-content">
                <div className="subscription-name">Advanced COD</div>
                <div className="subscription-details">
                  $11.99 (estimated ₹1,078.58 INR*) every 30 days. Renews on January 1, 2026.
                </div>
              </div>
            </div>
            <div className="subscription-divider"></div>
            <div className="subscription-view-all">
              <span className="subscription-view-all-text">View all subscriptions</span>
              <div className="subscription-view-all-arrow">
                <Icon source={ChevronRightIcon} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default PlanSettings;
