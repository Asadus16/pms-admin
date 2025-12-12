'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Icon, Button } from '@shopify/polaris';
import {
  PlusCircleIcon,
  ChevronRightIcon,
} from '@shopify/polaris-icons';
import './styles/TransactionsSettings.css';

// Payment method icons data
const paymentMethodIcons = [
  { id: 'visa', name: 'VISA', src: '/svg/cards/imgi_10_2c2bf.svg' },
  { id: 'mastercard', name: 'Mastercard', src: '/svg/cards/imgi_11_cd169.svg' },
  { id: 'amex', name: 'American Express', src: '/svg/cards/imgi_12_0878f.svg' },
  { id: 'diners', name: 'Diners Club', src: '/svg/cards/imgi_13_b34cb.svg' },
  { id: 'rupay', name: 'RuPay', src: '/svg/cards/imgi_14_6e06e.svg' },
];

// Payment customizations data
const paymentCustomizations = [
  { id: '1', name: 'COD Payment Customization', app: 'Advanced COD', status: 'Active', icon: '💳' },
  { id: '2', name: 'ACOD', app: 'Advanced COD', status: 'Active', icon: '💳' },
];

function TransactionsSettings() {
  const router = useRouter();
  const [paymentCapture, setPaymentCapture] = useState('automatic');
  const [giftCardExpiration, setGiftCardExpiration] = useState('never');

  // Navigate to Razorpay detail page
  const handleRazorpayClick = () => {
    router.push('/settings/alternative-providers');
  };

  // Navigate to third-party providers page
  const handleChooseProvider = () => {
    router.push('/settings/third-party-providers');
  };

  // Main Payments/Transactions view
  return (
    <>
      {/* Payment Providers */}
      <div className="settings-card">
        <div className="transactions-card-header">
          <h2 className="transactions-section-title">Payment providers</h2>
        </div>
        <div className="transactions-card-content">
          <p className="transactions-description">
            Providers that enable you to accept payment methods at a rate set by the third-party. A 2% fee applies to payments processed through third-party providers.
          </p>
          <Button onClick={handleChooseProvider}>Choose a provider</Button>
        </div>
      </div>

      {/* Supported Payment Methods */}
      <div className="settings-card">
        <div className="transactions-card-header">
          <h2 className="transactions-section-title">Supported payment methods</h2>
        </div>
        <div className="transactions-card-content">
          <p className="transactions-description">
            Payment methods that are available with one of Shopify&apos;s approved payment providers
          </p>

          {/* All payment methods in one bordered container */}
          <div className="transactions-providers-container">
            {/* PayPal */}
            <div className="transactions-provider-row">
              <div className="transactions-provider-info">
                <div className="transactions-provider-name">PayPal</div>
                <div className="transactions-provider-fee">2% transaction fee • PayPal processing fees apply</div>
                <div className="transactions-provider-icons">
                  <div className="transactions-payment-icon">
                    <img src="/svg/cards/paypal.svg" alt="PayPal" />
                  </div>
                </div>
              </div>
              <Button>Activate PayPal</Button>
            </div>

            <div className="transactions-provider-divider"></div>

            {/* 1Razorpay */}
            <div
              className="transactions-provider-row clickable"
              onClick={handleRazorpayClick}
            >
              <div className="transactions-provider-info">
                <div className="transactions-provider-name">1Razorpay - UPI, Cards, Wallets, NB</div>
                <div className="transactions-provider-fee">2% transaction fee • 1Razorpay - UPI, Cards, Wallets, NB processing fees apply</div>
                <div className="transactions-provider-icons">
                  {paymentMethodIcons.map(icon => (
                    <div key={icon.id} className="transactions-payment-icon">
                      <img src={icon.src} alt={icon.name} />
                    </div>
                  ))}
                  <div className="transactions-payment-icon more">+16</div>
                </div>
              </div>
              <div className="transactions-provider-action">
                <span className="transactions-status-badge active">Active</span>
                <Icon source={ChevronRightIcon} />
              </div>
            </div>

            <div className="transactions-provider-divider"></div>

            {/* Add Payment Method */}
            <div className="transactions-add-method">
              <div className="transactions-add-method-content">
                <Icon source={PlusCircleIcon} />
                <span>Add payment method</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Capture Method */}
      <div className="settings-card">
        <div className="transactions-card-header">
          <h2 className="transactions-section-title">Payment capture method</h2>
        </div>
        <div className="transactions-card-content">
          <p className="transactions-description">
            Payments are authorized when an order is placed. Select how to <a href="#">capture payments</a>:
          </p>

          <div className="transactions-radio-group">
            <label className="transactions-radio-option">
              <input
                type="radio"
                name="paymentCapture"
                value="automatic"
                checked={paymentCapture === 'automatic'}
                onChange={(e) => setPaymentCapture(e.target.value)}
                className="transactions-radio-input"
              />
              <div className="transactions-radio-content">
                <span className="transactions-radio-label">Automatically at checkout</span>
                <span className="transactions-radio-description">Capture payment when an order is placed</span>
              </div>
            </label>

            <label className="transactions-radio-option">
              <input
                type="radio"
                name="paymentCapture"
                value="fulfilled"
                checked={paymentCapture === 'fulfilled'}
                onChange={(e) => setPaymentCapture(e.target.value)}
                className="transactions-radio-input"
              />
              <div className="transactions-radio-content">
                <span className="transactions-radio-label">Automatically when the entire order is fulfilled</span>
                <span className="transactions-radio-description">Authorize payment at checkout and capture once the entire order is fulfilled</span>
              </div>
            </label>

            <label className="transactions-radio-option">
              <input
                type="radio"
                name="paymentCapture"
                value="manual"
                checked={paymentCapture === 'manual'}
                onChange={(e) => setPaymentCapture(e.target.value)}
                className="transactions-radio-input"
              />
              <div className="transactions-radio-content">
                <span className="transactions-radio-label">Manually</span>
                <span className="transactions-radio-description">Authorize payment at checkout and capture manually</span>
              </div>
            </label>
          </div>
        </div>
      </div>

      {/* Manual Payment Methods */}
      <div className="settings-card">
        <div className="transactions-card-header">
          <h2 className="transactions-section-title">Manual payment methods</h2>
        </div>
        <div className="transactions-card-content">
          <p className="transactions-description">
            Payments made outside your online store. Orders paid manually must be approved before being fulfilled
          </p>

          <div className="transactions-manual-bordered">
            <div className="transactions-manual-row">
              <span className="transactions-manual-name">Cash on Delivery (COD)</span>
              <Button size="slim">Edit</Button>
            </div>
            <div className="transactions-manual-divider"></div>
            <div className="transactions-add-method">
              <div className="transactions-add-method-content">
                <Icon source={PlusCircleIcon} />
                <span>Manual payment method</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Method Customizations */}
      <div className="settings-card">
        <div className="transactions-card-header-row">
          <div>
            <h2 className="transactions-section-title">Payment method customizations</h2>
            <p className="transactions-description">Control how payment methods appear to your customers at checkout</p>
          </div>
          <Button>Manage</Button>
        </div>
        <div className="transactions-card-content">
          <div className="transactions-customizations-bordered">
            {paymentCustomizations.map((item, index) => (
              <div key={item.id}>
                <div className="transactions-customization-row">
                  <div className="transactions-customization-icon">
                    <span>💳</span>
                  </div>
                  <div className="transactions-customization-info">
                    <div className="transactions-customization-name">{item.name}</div>
                    <div className="transactions-customization-app">by {item.app}</div>
                  </div>
                  <div className="transactions-customization-action">
                    <span className="transactions-status-badge active">{item.status}</span>
                    <Icon source={ChevronRightIcon} />
                  </div>
                </div>
                {index < paymentCustomizations.length - 1 && <div className="transactions-customization-divider"></div>}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Gift Card Expiration */}
      <div className="settings-card">
        <div className="transactions-card-header">
          <h2 className="transactions-section-title">Gift card expiration</h2>
        </div>
        <div className="transactions-card-content">
          <div className="transactions-radio-group">
            <label className="transactions-radio-option">
              <input
                type="radio"
                name="giftCard"
                value="never"
                checked={giftCardExpiration === 'never'}
                onChange={(e) => setGiftCardExpiration(e.target.value)}
                className="transactions-radio-input"
              />
              <span className="transactions-radio-label">Gift cards never expire</span>
            </label>

            <label className="transactions-radio-option">
              <input
                type="radio"
                name="giftCard"
                value="expire"
                checked={giftCardExpiration === 'expire'}
                onChange={(e) => setGiftCardExpiration(e.target.value)}
                className="transactions-radio-input"
              />
              <span className="transactions-radio-label">Gift cards expire</span>
            </label>
          </div>
        </div>
      </div>

      {/* Apple Wallet Passes */}
      <div className="settings-card">
        <div className="transactions-card-header-row">
          <div>
            <h2 className="transactions-section-title">Apple Wallet passes</h2>
            <p className="transactions-description">Give customers a digital Apple Wallet pass to use online or in your retail stores</p>
          </div>
          <Button>Customize</Button>
        </div>
      </div>

      {/* Learn More */}
      <div className="transactions-learn-more">
        <a href="#">Learn more about payments</a>
      </div>
    </>
  );
}

export default TransactionsSettings;
