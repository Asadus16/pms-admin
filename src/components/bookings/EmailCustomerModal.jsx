'use client';

import {
  Modal,
  Text,
  TextField,
  Button,
  InlineStack,
  BlockStack,
  Icon,
  Select,
  Checkbox,
} from '@shopify/polaris';
import { ArrowLeftIcon, AlertCircleIcon } from '@shopify/polaris-icons';

function EmailCustomerModal({ isOpen, onClose, order }) {
  if (!order) return null;

  // Handle both existing orders and draft orders
  const orderId = order.orderId || order.id || 'Draft';
  const customerName = order.customer || order.name || '';
  const customerEmail = order.customerEmail || order.email || '';
  const customerPhone = order.customerPhone || order.phone || '';
  const customerLocation = order.customerLocation || '';
  const shippingAddress = order.shippingAddress || null;

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      title={
        <InlineStack gap="200" blockAlign="center">
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Icon source={ArrowLeftIcon} tone="base" />
          </button>
          <Text variant="headingMd" as="span">Email customer</Text>
        </InlineStack>
      }
    >
      <Modal.Section>
        <BlockStack gap="300">
          {/* Address Issues Section */}
          <div style={{
            background: '#f7f7f7',
            border: '1px solid #e3e3e3',
            borderRadius: '8px',
            padding: '16px'
          }}>
            <BlockStack gap="200">
              <Text variant="headingMd" as="h3" fontWeight="semibold">
                Address issues
              </Text>
              <Text variant="bodyMd" as="p">
                {customerName}
              </Text>
              <div style={{
                background: '#fef3ea',
                padding: '12px 16px',
                borderRadius: '8px',
                lineHeight: '1.5',
                color: '#b98900',
                fontSize: '14px'
              }}>
                {shippingAddress ? (
                  <>
                    {shippingAddress.line1} {shippingAddress.line2 && `${shippingAddress.line2} `}
                    LANDMARK : {shippingAddress.city} District: {shippingAddress.city} City: {shippingAddress.city} State: {shippingAddress.state}
                    <br />
                    {shippingAddress.state} Pincode:
                    <br />
                    {shippingAddress.zip} {shippingAddress.city} {shippingAddress.state}
                    <br />
                    {shippingAddress.country}
                    <br />
                    {customerPhone}
                  </>
                ) : (
                  <>
                    {customerLocation || 'No address provided'}
                    <br />
                    {customerPhone || 'No phone provided'}
                  </>
                )}
              </div>

              <InlineStack gap="200" blockAlign="start">
                <div style={{ flexShrink: 0, marginTop: '2px' }}>
                  <Icon source={AlertCircleIcon} tone="warning" />
                </div>
                <Text variant="bodySm" as="p" tone="subdued">
                  Address line 1 is recommended to have less than 15 words
                </Text>
              </InlineStack>
            </BlockStack>
          </div>

          {/* Email Form */}
          <BlockStack gap="300">
            <InlineStack gap="300" wrap={false}>
              <div style={{ flex: 1 }}>
                <Text variant="bodyMd" as="label" fontWeight="medium">
                  To
                </Text>
                <div style={{ marginTop: '4px' }}>
                  <TextField
                    value={customerEmail}
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
                    value="orders@skshafeen.com"
                    onChange={() => {}}
                  />
                </div>
              </div>
            </InlineStack>

            <div>
              <Text variant="bodyMd" as="label" fontWeight="medium">
                Send bcc to:
              </Text>
              <div style={{ marginTop: '4px' }}>
                <BlockStack gap="050">
                  <Checkbox
                    label="skshafeen2022@gmail.com"
                    checked={false}
                    onChange={() => {}}
                  />
                  <Checkbox
                    label="orders@skshafeen.com"
                    checked={false}
                    onChange={() => {}}
                  />
                </BlockStack>
              </div>
            </div>

            <div>
              <Text variant="bodyMd" as="label" fontWeight="medium">
                Subject
              </Text>
              <div style={{ marginTop: '4px' }}>
                <TextField
                  value={`Confirm shipping address for booking ${orderId}`}
                  autoComplete="off"
                />
              </div>
            </div>

            <div>
              <Text variant="bodyMd" as="label" fontWeight="medium">
                Custom message (optional)
              </Text>
              <div style={{ marginTop: '4px' }}>
                <TextField
                  multiline={3}
                  value=""
                  autoComplete="off"
                />
              </div>
            </div>
          </BlockStack>
        </BlockStack>
      </Modal.Section>
      <Modal.Section>
        <InlineStack align="end" gap="200">
          <Button onClick={onClose}>Cancel</Button>
          <Button variant="primary" onClick={onClose}>Review email</Button>
        </InlineStack>
      </Modal.Section>
    </Modal>
  );
}

export default EmailCustomerModal;
