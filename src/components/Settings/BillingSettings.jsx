'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Icon, Button, IndexTable, Text, useIndexResourceState, Pagination, Box, InlineStack } from '@shopify/polaris';
import {
  InfoIcon,
  SearchIcon,
  FilterIcon,
  SortIcon,
  MenuHorizontalIcon,
  EditIcon,
} from '@shopify/polaris-icons';
import './styles/BillingSettings.css';

// Past bills data
const pastBills = [
  { id: '447597579', date: 'Nov 19, 2025', reason: 'Billing cycle ended', total: '₹1,243.00', status: 'Paid' },
  { id: '433460013', date: 'Oct 19, 2025', reason: 'Billing cycle ended', total: '₹3,513.76', status: 'Paid' },
  { id: '420265349', date: 'Sep 19, 2025', reason: 'Billing cycle ended', total: '₹5,687.68', status: 'Paid' },
  { id: '406520019', date: 'Aug 19, 2025', reason: 'Billing cycle ended', total: '₹5,778.28', status: 'Paid' },
  { id: '393069014', date: 'Jul 19, 2025', reason: 'Billing cycle ended', total: '₹5,822.48', status: 'Paid' },
  { id: '381682219', date: 'Jun 21, 2025', reason: 'One-time charge incurred', total: '₹88.07', status: 'Paid' },
  { id: '380398354', date: 'Jun 19, 2025', reason: 'Billing cycle ended', total: '₹2,695.14', status: 'Paid' },
  { id: '367743106', date: 'May 19, 2025', reason: 'Billing cycle ended', total: '₹3,351.88', status: 'Paid' },
  { id: '355949986', date: 'Apr 19, 2025', reason: 'Billing cycle ended', total: '₹5,287.24', status: 'Paid' },
  { id: '354577511', date: 'Apr 15, 2025', reason: 'One-time charge incurred', total: '₹34,043.54', status: 'Paid' },
];

function BillingSettings() {
  const router = useRouter();
  const [billingTab, setBillingTab] = useState('all');

  // Billing table resource state
  const { selectedResources: selectedBills, allResourcesSelected: allBillsSelected, handleSelectionChange: handleBillSelectionChange } =
    useIndexResourceState(pastBills);

  const billingResourceName = {
    singular: 'bill',
    plural: 'bills',
  };

  const billRowMarkup = pastBills.map((bill, index) => (
    <IndexTable.Row
      id={bill.id}
      key={bill.id}
      selected={selectedBills.includes(bill.id)}
      position={index}
    >
      <IndexTable.Cell>
        <Text variant="bodyMd" as="span">{bill.id}</Text>
      </IndexTable.Cell>
      <IndexTable.Cell>
        <Text variant="bodyMd" as="span">{bill.date}</Text>
      </IndexTable.Cell>
      <IndexTable.Cell>
        <Text variant="bodyMd" as="span">{bill.reason}</Text>
      </IndexTable.Cell>
      <IndexTable.Cell>
        <Text variant="bodyMd" as="span" alignment="end">{bill.total}</Text>
      </IndexTable.Cell>
      <IndexTable.Cell>
        <span className="billing-status-badge paid">{bill.status}</span>
      </IndexTable.Cell>
    </IndexTable.Row>
  ));

  const handleEditClick = () => {
    router.push('/settings/billing/profile');
  };

  return (
    <>
      {/* Info Banner */}
      <div className="billing-info-banner">
        <div className="billing-info-banner-header">
          <div className="billing-info-banner-icon">
            <Icon source={InfoIcon} />
          </div>
          <span className="billing-info-banner-title">Ensure your billing address meets India payment requirements</span>
        </div>
        <div className="billing-info-banner-content">
          Indian payment regulations require specific address formatting. <a href="#">View address guidelines</a> to see the requirements, or <a href="#">click here</a> to update your address now.
        </div>
      </div>

      {/* Upcoming Bill */}
      <div className="settings-card">
        <div className="billing-upcoming-header">
          <div className="billing-upcoming-title">Upcoming bill</div>
          <a href="#" className="billing-view-link">View bill</a>
        </div>
        <div className="settings-card-content">
          <div className="billing-upcoming-content">
            <div className="billing-amount">
              <span className="billing-amount-value">₹2,546.96</span>
              <span className="billing-amount-currency">INR</span>
            </div>
            <div className="billing-next-info">
              Next bill in 9 days or when your ~₹18,030 INR threshold is reached. You have ₹15,483 remaining.
            </div>
            <div className="billing-payment-method">
              <div className="billing-card-info">
                <div className="billing-card-icon">
                  <div className="mastercard-icon">
                    <div className="mastercard-circles">
                      <div className="mc-circle mc-red"></div>
                      <div className="mc-circle mc-orange"></div>
                    </div>
                  </div>
                </div>
                <span className="billing-card-number">Mastercard •••• 0095</span>
              </div>
              <button className="billing-edit-btn" onClick={handleEditClick}>
                <Icon source={EditIcon} />
              </button>
            </div>
          </div>
          <div className="billing-plan-link">
            To make changes to your plan, <a href="#">visit plan settings</a>
          </div>
        </div>
      </div>

      {/* Past Bills */}
      <div className="settings-card">
        <div className="billing-past-header">
          <h2 className="settings-card-title">Past bills</h2>
          <button className="billing-menu-btn">
            <Icon source={MenuHorizontalIcon} />
          </button>
        </div>
        <div className="settings-card-content">
          <div className="billing-table-container">
            <div className="billing-table-toolbar">
              <div className="billing-tabs">
                <button
                  className={`billing-tab ${billingTab === 'all' ? 'active' : ''}`}
                  onClick={() => setBillingTab('all')}
                >
                  All
                </button>
                <button
                  className={`billing-tab ${billingTab === 'paid' ? 'active' : ''}`}
                  onClick={() => setBillingTab('paid')}
                >
                  Paid
                </button>
                <button
                  className={`billing-tab ${billingTab === 'unpaid' ? 'active' : ''}`}
                  onClick={() => setBillingTab('unpaid')}
                >
                  Unpaid
                </button>
              </div>
              <div className="billing-table-actions">
                <button className="billing-action-btn">
                  <Icon source={SearchIcon} />
                </button>
                <button className="billing-action-btn">
                  <Icon source={FilterIcon} />
                </button>
                <button className="billing-action-btn">
                  <Icon source={SortIcon} />
                </button>
              </div>
            </div>
            <div className="billing-index-table">
              <IndexTable
                resourceName={billingResourceName}
                itemCount={pastBills.length}
                selectedItemsCount={allBillsSelected ? 'All' : selectedBills.length}
                onSelectionChange={handleBillSelectionChange}
                headings={[
                  { title: 'Bill number' },
                  { title: 'Date issued' },
                  { title: 'Bill reason' },
                  { title: 'Bill total', alignment: 'end' },
                  { title: 'Status' },
                ]}
                selectable
              >
                {billRowMarkup}
              </IndexTable>
            </div>
            <Box padding="400">
              <InlineStack align="start">
                <Pagination
                  hasPrevious={false}
                  onPrevious={() => {}}
                  hasNext={true}
                  onNext={() => {}}
                />
              </InlineStack>
            </Box>
          </div>
        </div>
      </div>
    </>
  );
}

export default BillingSettings;
