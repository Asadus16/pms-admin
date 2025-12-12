'use client';

import { useState } from 'react';
import { Icon, Button, IndexTable, Text, useIndexResourceState, Pagination, Box, InlineStack } from '@shopify/polaris';
import {
  SearchIcon,
  FilterIcon,
  SortIcon,
} from '@shopify/polaris-icons';
import './styles/SecuritySettings.css';

// Activity logs data
const activityLogsData = [
  { id: '1', event: 'Collaborator request for Pritesh Kumar Collaborator was approved.', resource: 'User', date: '12/9/2025, 3:14 PM GMT+5:30', user: 'Shafeen' },
  { id: '2', event: 'Pritesh Kumar Collaborator was edited.', resource: 'User', date: '12/9/2025, 3:14 PM GMT+5:30', user: 'Shafeen' },
  { id: '3', event: 'Pritesh Kumar x skshafeen was created.', resource: 'Role', date: '12/9/2025, 3:14 PM GMT+5:30', user: 'Shafeen' },
  { id: '4', event: 'Collaborator request for Ads and Technology LLC FZ Collab...', resource: 'User', date: '12/2/2025, 9:16 AM GMT+5:30', user: 'Shafeen' },
  { id: '5', event: 'Ads and Technology LLC FZ Collaborator was edited.', resource: 'User', date: '12/2/2025, 9:16 AM GMT+5:30', user: 'Shafeen' },
  { id: '6', event: 'Ads and Technology LLC FZ x skshafeen was created.', resource: 'Role', date: '12/2/2025, 9:16 AM GMT+5:30', user: 'Shafeen' },
  { id: '7', event: 'Collaborator request for YourToken Collaborator was appro...', resource: 'User', date: '11/25/2025, 4:20 PM GMT+5:30', user: 'Shafeen' },
  { id: '8', event: 'YourToken Collaborator was edited.', resource: 'User', date: '11/25/2025, 4:20 PM GMT+5:30', user: 'Shafeen' },
  { id: '9', event: 'YourToken x skshafeen was created.', resource: 'Role', date: '11/25/2025, 4:20 PM GMT+5:30', user: 'Shafeen' },
  { id: '10', event: 'Collaborator request for NETHYPE Collaborator was approv...', resource: 'User', date: '11/24/2025, 4:26 PM GMT+5:30', user: 'Shafeen' },
  { id: '11', event: 'NETHYPE Collaborator was edited.', resource: 'User', date: '11/24/2025, 4:26 PM GMT+5:30', user: 'Shafeen' },
  { id: '12', event: 'NETHYPE x skshafeen was created.', resource: 'Role', date: '11/24/2025, 4:26 PM GMT+5:30', user: 'Shafeen' },
  { id: '13', event: 'Collaborator request for Pickrr Technologies Private Limited...', resource: 'User', date: '11/24/2025, 12:47 PM GMT+5:30', user: 'Shafeen' },
  { id: '14', event: 'Pickrr Technologies Private Limited Collaborator was edited.', resource: 'User', date: '11/24/2025, 12:47 PM GMT+5:30', user: 'Shafeen' },
  { id: '15', event: 'Pickrr Technologies Private Limited x skshafeen (1) was cre...', resource: 'Role', date: '11/24/2025, 12:47 PM GMT+5:30', user: 'Shafeen' },
  { id: '16', event: 'Collaborator request for The Insight Media Collaborator was...', resource: 'User', date: '11/13/2025, 11:25 PM GMT+5:30', user: 'Shafeen' },
  { id: '17', event: 'The Insight Media Collaborator was edited.', resource: 'User', date: '11/13/2025, 11:25 PM GMT+5:30', user: 'Shafeen' },
  { id: '18', event: 'The Insight Media x skshafeen (1) was created.', resource: 'Role', date: '11/13/2025, 11:25 PM GMT+5:30', user: 'Shafeen' },
];

function SecuritySettings({ showActivityLogs, setShowActivityLogs }) {
  // Activity logs table resource state
  const { selectedResources: selectedLogs, allResourcesSelected: allLogsSelected, handleSelectionChange: handleLogSelectionChange } =
    useIndexResourceState(activityLogsData);

  const logsResourceName = {
    singular: 'log',
    plural: 'logs',
  };

  const logRowMarkup = activityLogsData.map((log, index) => (
    <IndexTable.Row
      id={log.id}
      key={log.id}
      selected={selectedLogs.includes(log.id)}
      position={index}
    >
      <IndexTable.Cell>
        <Text variant="bodyMd" as="span">{log.event}</Text>
      </IndexTable.Cell>
      <IndexTable.Cell>
        <Text variant="bodyMd" as="span">{log.resource}</Text>
      </IndexTable.Cell>
      <IndexTable.Cell>
        <Text variant="bodyMd" as="span">{log.date}</Text>
      </IndexTable.Cell>
      <IndexTable.Cell>
        <Text variant="bodyMd" as="span">{log.user}</Text>
      </IndexTable.Cell>
    </IndexTable.Row>
  ));

  // If showing activity logs, render that view
  if (showActivityLogs) {
    return (
      <div className="security-activity-logs">
        <div className="security-logs-table-container">
          <div className="security-logs-table-toolbar">
            <div className="security-logs-tabs">
              <button className="security-logs-tab active">All</button>
            </div>
            <div className="security-logs-table-actions">
              <button className="security-logs-action-btn">
                <Icon source={SearchIcon} />
              </button>
              <button className="security-logs-action-btn">
                <Icon source={FilterIcon} />
              </button>
              <button className="security-logs-action-btn">
                <Icon source={SortIcon} />
              </button>
            </div>
          </div>
          <div className="security-logs-index-table">
            <IndexTable
              resourceName={logsResourceName}
              itemCount={activityLogsData.length}
              selectedItemsCount={allLogsSelected ? 'All' : selectedLogs.length}
              onSelectionChange={handleLogSelectionChange}
              headings={[
                { title: 'Event' },
                { title: 'Resource' },
                { title: 'Date' },
                { title: 'User' },
              ]}
              selectable={false}
            >
              {logRowMarkup}
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
    );
  }

  // Default Security view
  return (
    <>
      {/* User Activity Logs */}
      <div className="settings-card">
        <div className="security-card-row">
          <div className="security-card-content">
            <h3 className="security-card-title">User activity logs</h3>
            <p className="security-card-description">Monitor and review user activities</p>
          </div>
          <Button onClick={() => setShowActivityLogs(true)}>View</Button>
        </div>
      </div>

      {/* Collaborators */}
      <div className="settings-card">
        <div className="security-collaborators-section">
          <h3 className="security-section-title">Collaborators</h3>
          <p className="security-section-description">
            Give designers, developers, and marketers access to this store. Collaborators don't count toward your staff limit. Learn more about <a href="#">collaborators</a>.
          </p>

          <div className="security-collaborator-row">
            <p className="security-collaborator-text">
              Anyone can send a collaborator request for skshafeen. A code is not required.
            </p>
            <Button>Require code</Button>
          </div>

          <p className="security-collaborator-note">
            You'll still need to review and approve this request from <a href="#">Users</a>.
          </p>
        </div>
      </div>
    </>
  );
}

export default SecuritySettings;
