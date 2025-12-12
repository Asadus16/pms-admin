'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Icon } from '@shopify/polaris';
import {
  PersonIcon,
  TeamIcon,
  CalendarIcon,
  CodeIcon,
  ChevronRightIcon,
  XSmallIcon,
  AlertTriangleIcon,
} from '@shopify/polaris-icons';
import './styles/NotificationsSettings.css';

function NotificationsSettings() {
  const router = useRouter();
  const [showWarning, setShowWarning] = useState(true);

  const mainNotifications = [
    {
      id: 'customer',
      icon: PersonIcon,
      title: 'Customer notifications',
      description: 'Notify customers about order and account events',
    },
    {
      id: 'staff',
      icon: TeamIcon,
      title: 'Staff notifications',
      description: 'Notify staff members about new order events',
    },
    {
      id: 'fulfillment',
      icon: CalendarIcon,
      title: 'Fulfillment request notification',
      description: 'Notify your fulfillment service provider when you mark an order as fulfilled',
    },
  ];

  return (
    <div className="notifications-settings">
      {/* Sender Email Card */}
      <div className="settings-card">
        <div className="notifications-card-content">
          <h2 className="notifications-section-title">Sender email</h2>
          <p className="notifications-section-description">
            The email your store uses to send emails to your customers
          </p>

          {/* Email Input */}
          <div className="notifications-email-row">
            <div className="notifications-email-input">
              <span className="notifications-email-value">orders@skshafeen.com</span>
            </div>
            <span className="notifications-email-badge">Unverified</span>
          </div>

          <p className="notifications-verify-text">
            Confirm you have access to this email. <a href="#" className="notifications-link">Resend verification</a>
          </p>

          {/* Warning Banner */}
          {showWarning && (
            <div className="notifications-warning-banner">
              <div className="notifications-warning-icon">
                <Icon source={AlertTriangleIcon} />
              </div>
              <p className="notifications-warning-text">
                Domain authentication has failed. Review your DNS configuration and try again.
              </p>
              <button
                className="notifications-warning-close"
                onClick={() => setShowWarning(false)}
              >
                <Icon source={XSmallIcon} />
              </button>
            </div>
          )}

          <div className="notifications-info-box">
            <p className="notifications-info-text">
              Because your email domain hasn&apos;t been authenticated, recipients will see your email as{' '}
              <strong>store+65242693676@shopifyemail.com</strong>. For better brand recognition,{' '}
              <a href="#" className="notifications-link">authenticate your domain</a> and ensure your domain has a{' '}
              <a href="#" className="notifications-link">DMARC record</a>.
            </p>
          </div>
        </div>
      </div>

      {/* Notification Types Card - One outer card with two inner bordered sections */}
      <div className="settings-card">
        <div className="notifications-card-inner">
          {/* First bordered section - 3 main notifications */}
          <div className="notifications-list">
            {mainNotifications.map((section, index) => (
              <div key={section.id}>
                <div
                  className="notifications-row"
                  onClick={() => {
                    if (section.id === 'customer') {
                      router.push('/settings/notifications/customer');
                    } else if (section.id === 'staff') {
                      router.push('/settings/notifications/staff');
                    }
                  }}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="notifications-row-icon">
                    <Icon source={section.icon} />
                  </div>
                  <div className="notifications-row-content">
                    <span className="notifications-row-title">{section.title}</span>
                    <span className="notifications-row-description">{section.description}</span>
                  </div>
                  <div className="notifications-row-arrow">
                    <Icon source={ChevronRightIcon} />
                  </div>
                </div>
                {index < mainNotifications.length - 1 && <div className="notifications-divider"></div>}
              </div>
            ))}
          </div>

          {/* Second bordered section - Webhooks */}
          <div className="notifications-list">
            <div
              className="notifications-row"
              onClick={() => router.push('/settings/notifications/webhooks')}
              style={{ cursor: 'pointer' }}
            >
              <div className="notifications-row-icon">
                <Icon source={CodeIcon} />
              </div>
              <div className="notifications-row-content">
                <span className="notifications-row-title">Webhooks</span>
                <span className="notifications-row-description">Send XML or JSON notifications about store events to a URL</span>
              </div>
              <div className="notifications-row-arrow">
                <Icon source={ChevronRightIcon} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NotificationsSettings;
