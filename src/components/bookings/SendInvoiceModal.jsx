'use client';

import { useState, useCallback } from 'react';
import {
  Modal,
  Text,
  TextField,
  Button,
  InlineStack,
  BlockStack,
  Icon,
  Select,
  Divider,
} from '@shopify/polaris';
import { ArrowLeftIcon, LockIcon, DiscountIcon, AppsIcon, ChevronDownIcon, AlertTriangleIcon } from '@shopify/polaris-icons';
import '@components/Settings/styles/TransactionsSettings.css';

function SendInvoiceModal({ isOpen, onClose, customer }) {
  const [toEmail, setToEmail] = useState(customer?.email || '');
  const [fromEmail, setFromEmail] = useState('orders@skshafeen.com');
  const [subject, setSubject] = useState(`Invoice ${customer?.name || '{{name}}'}`);
  const [customMessage, setCustomMessage] = useState('');
  const [ccBccExpanded, setCcBccExpanded] = useState(false);
  const [ccEmails, setCcEmails] = useState('');
  const [bccEmails, setBccEmails] = useState('');

  // Toggle states
  const [lockProductPrices, setLockProductPrices] = useState(false);
  const [allowDiscountCodes, setAllowDiscountCodes] = useState(false);
  const [ignoreCheckoutRules, setIgnoreCheckoutRules] = useState(false);

  const handleClose = useCallback(() => {
    // Reset form when closing
    setToEmail(customer?.email || '');
    setSubject(`Invoice ${customer?.name || '{{name}}'}`);
    setCustomMessage('');
    setCcBccExpanded(false);
    setCcEmails('');
    setBccEmails('');
    setLockProductPrices(false);
    setAllowDiscountCodes(false);
    setIgnoreCheckoutRules(false);
    onClose();
  }, [customer, onClose]);

  const handleReviewInvoice = useCallback(() => {
    // Handle review invoice action
    console.log('Review invoice', {
      to: toEmail,
      from: fromEmail,
      cc: ccEmails,
      bcc: bccEmails,
      subject,
      customMessage,
      lockProductPrices,
      allowDiscountCodes,
      ignoreCheckoutRules,
    });
    // You can navigate to review page or show preview here
    handleClose();
  }, [toEmail, fromEmail, ccEmails, bccEmails, subject, customMessage, lockProductPrices, allowDiscountCodes, ignoreCheckoutRules, handleClose]);

  if (!customer) return null;

  return (
    <Modal
      open={isOpen}
      onClose={handleClose}
      title="Send invoice"
    >
      <Modal.Section>
        <BlockStack gap="400">
          {/* Warning banner */}
          <div style={{
            backgroundColor: '#fff1e3',
            borderRadius: '8px',
            padding: '12px 16px',
          }}>
            <InlineStack gap="200" blockAlign="start">
              <div style={{ color: '#5e4206', marginTop: '2px' }}>
                <Icon source={AlertTriangleIcon} />
              </div>
              <div>
                <Text variant="bodyMd" as="p" fontWeight="semibold">
                  <span style={{ color: '#5e4206' }}>Before the customer can complete checkout, these changes need to be made:</span>
                </Text>
                <ul style={{ margin: '4px 0 0 16px', padding: 0, color: '#5e4206' }}>
                  <li style={{ fontSize: '13px' }}>There are no shipping and delivery options for the customer&apos;s address.</li>
                </ul>
              </div>
            </InlineStack>
          </div>

          {/* To and From fields */}
          <InlineStack gap="300" wrap={false}>
            <div style={{ flex: 1 }}>
              <Text variant="bodyMd" as="label" fontWeight="medium">
                To
              </Text>
              <div style={{ marginTop: '4px' }}>
                <TextField
                  value={toEmail}
                  onChange={setToEmail}
                  autoComplete="off"
                />
              </div>
            </div>
            <div style={{ flex: 1 }}>
              <Text variant="bodyMd" as="label" fontWeight="medium">
                From
              </Text>
              <div style={{ marginTop: '4px' }}>
                <Select
                  label="From"
                  labelHidden
                  options={[
                    { label: '"skshafeen" <orders@skshafeen.com>', value: 'orders@skshafeen.com' }
                  ]}
                  value={fromEmail}
                  onChange={setFromEmail}
                />
              </div>
            </div>
          </InlineStack>

          {/* Cc and Bcc recipients */}
          <div>
            <button
              onClick={() => setCcBccExpanded(!ccBccExpanded)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                color: 'rgb(0, 91, 211)',
                fontSize: '13px',
                fontFamily: 'Inter, -apple-system, "system-ui", "San Francisco", "Segoe UI", Roboto, "Helvetica Neue", sans-serif',
              }}
            >
              <span>Cc and Bcc recipients</span>
              <Icon source={ChevronDownIcon} tone="base" />
            </button>
            {ccBccExpanded && (
              <BlockStack gap="200" style={{ marginTop: '12px' }}>
                <div>
                  <Text variant="bodyMd" as="label" fontWeight="medium">
                    Cc
                  </Text>
                  <div style={{ marginTop: '4px' }}>
                    <TextField
                      value={ccEmails}
                      onChange={setCcEmails}
                      placeholder="Enter email addresses"
                      autoComplete="off"
                    />
                  </div>
                </div>
                <div>
                  <Text variant="bodyMd" as="label" fontWeight="medium">
                    Bcc
                  </Text>
                  <div style={{ marginTop: '4px' }}>
                    <TextField
                      value={bccEmails}
                      onChange={setBccEmails}
                      placeholder="Enter email addresses"
                      autoComplete="off"
                    />
                  </div>
                </div>
              </BlockStack>
            )}
          </div>

          {/* Subject */}
          <div>
            <Text variant="bodyMd" as="label" fontWeight="medium">
              Subject
            </Text>
            <div style={{ marginTop: '4px' }}>
              <TextField
                value={subject}
                onChange={setSubject}
                placeholder="Invoice {{name}}"
                autoComplete="off"
              />
            </div>
          </div>

          {/* Custom message */}
          <div>
            <Text variant="bodyMd" as="label" fontWeight="medium">
              Custom message (optional)
            </Text>
            <div style={{ marginTop: '4px' }}>
              <TextField
                multiline={3}
                value={customMessage}
                onChange={setCustomMessage}
                autoComplete="off"
              />
            </div>
          </div>

          {/* Toggle switches - bordered container */}
          <div style={{
            border: '1px solid #e3e3e3',
            borderRadius: '10px',
            overflow: 'hidden',
          }}>
            {/* Product prices toggle */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '16px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  color: '#5c5f62',
                }}>
                  <Icon source={LockIcon} tone="base" />
                </div>
                <div>
                  <Text variant="bodyMd" as="span" fontWeight="medium">
                    Product prices
                  </Text>
                  <div style={{ fontSize: '13px', color: 'rgb(97, 97, 97)', marginTop: '2px' }}>
                    Lock all product prices so they don&apos;t change
                  </div>
                </div>
              </div>
              <label className="transactions-toggle">
                <input
                  type="checkbox"
                  checked={lockProductPrices}
                  onChange={(e) => setLockProductPrices(e.target.checked)}
                />
                <span className="transactions-toggle-slider"></span>
              </label>
            </div>

            <Divider />

            {/* Discount codes toggle */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '16px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  color: '#5c5f62',
                }}>
                  <Icon source={DiscountIcon} tone="base" />
                </div>
                <div>
                  <Text variant="bodyMd" as="span" fontWeight="medium">
                    Discount codes
                  </Text>
                  <div style={{ fontSize: '13px', color: 'rgb(97, 97, 97)', marginTop: '2px' }}>
                    Allow your customer to enter discount codes
                  </div>
                </div>
              </div>
              <label className="transactions-toggle">
                <input
                  type="checkbox"
                  checked={allowDiscountCodes}
                  onChange={(e) => setAllowDiscountCodes(e.target.checked)}
                />
                <span className="transactions-toggle-slider"></span>
              </label>
            </div>

            <Divider />

            {/* Checkout rules toggle */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '16px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  color: '#5c5f62',
                }}>
                  <Icon source={AppsIcon} tone="base" />
                </div>
                <div>
                  <Text variant="bodyMd" as="span" fontWeight="medium">
                    Checkout rules
                  </Text>
                  <div style={{ fontSize: '13px', color: 'rgb(97, 97, 97)', marginTop: '2px' }}>
                    Ignore all checkout rules to let your customer check out without validations
                  </div>
                </div>
              </div>
              <label className="transactions-toggle">
                <input
                  type="checkbox"
                  checked={ignoreCheckoutRules}
                  onChange={(e) => setIgnoreCheckoutRules(e.target.checked)}
                />
                <span className="transactions-toggle-slider"></span>
              </label>
            </div>
          </div>
        </BlockStack>
      </Modal.Section>
      <Modal.Section>
        <InlineStack align="end" gap="200">
          <Button onClick={handleClose}>Cancel</Button>
          <Button variant="primary" onClick={handleReviewInvoice}>Review invoice</Button>
        </InlineStack>
      </Modal.Section>
    </Modal>
  );
}

export default SendInvoiceModal;

