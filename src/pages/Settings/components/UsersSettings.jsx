'use client';

import { useState } from 'react';
import { Icon, Button, IndexTable, Text, useIndexResourceState } from '@shopify/polaris';
import {
  XIcon,
  SearchIcon,
  FilterIcon,
  SortIcon,
  AlertCircleIcon,
} from '@shopify/polaris-icons';
import './styles/UsersSettings.css';

// Users data
const usersData = [
  { id: '1', name: 'Ads and Technology LLC FZ', status: 'Active', role: 'Ads and Technology LLC FZ x sksh...' },
  { id: '2', name: 'NETHYPE Collaborator', status: 'Active', role: 'NETHYPE x skshafeen' },
  { id: '3', name: 'Pickrr Technologies Private', status: 'Active', role: 'Pickrr Technologies Private Limited...' },
  { id: '4', name: 'Pritesh Kumar Collaborator', status: 'Active', role: 'Pritesh Kumar x skshafeen' },
  { id: '5', name: 'Shafeen Khaan', status: 'Active', role: 'Store owner', isOwner: true },
  { id: '6', name: 'The Insight Media Collabora', status: 'Active', role: 'The Insight Media x skshafeen (1)' },
  { id: '7', name: 'YourToken Collaborator', status: 'Active', role: 'YourToken x skshafeen' },
];

function UsersSettings({ showExportModal, setShowExportModal, showUpgradeModal, setShowUpgradeModal }) {
  const [usersTab, setUsersTab] = useState('all');

  // Users table resource state
  const { selectedResources: selectedUsers, allResourcesSelected: allUsersSelected, handleSelectionChange: handleUserSelectionChange } =
    useIndexResourceState(usersData);

  const usersResourceName = {
    singular: 'user',
    plural: 'users',
  };

  const userRowMarkup = usersData.map((user, index) => (
    <IndexTable.Row
      id={user.id}
      key={user.id}
      selected={selectedUsers.includes(user.id)}
      position={index}
    >
      <IndexTable.Cell>
        <Text variant="bodyMd" as="span" fontWeight="semibold">{user.name}</Text>
      </IndexTable.Cell>
      <IndexTable.Cell>
        <span className="users-status-badge active">{user.status}</span>
      </IndexTable.Cell>
      <IndexTable.Cell>
        <div className="users-role-cell">
          <Text variant="bodyMd" as="span">{user.role}</Text>
          {user.isOwner && (
            <span className="users-2fa-warning">
              <Icon source={AlertCircleIcon} />
            </span>
          )}
        </div>
      </IndexTable.Cell>
    </IndexTable.Row>
  ));

  return (
    <>
      <div className="users-table-container">
        <div className="users-table-toolbar">
          <div className="users-tabs">
            <button
              className={`users-tab ${usersTab === 'all' ? 'active' : ''}`}
              onClick={() => setUsersTab('all')}
            >
              All
            </button>
            <button
              className={`users-tab ${usersTab === 'active' ? 'active' : ''}`}
              onClick={() => setUsersTab('active')}
            >
              Active
            </button>
            <button
              className={`users-tab ${usersTab === 'pending' ? 'active' : ''}`}
              onClick={() => setUsersTab('pending')}
            >
              Pending
            </button>
            <button
              className={`users-tab ${usersTab === 'pos' ? 'active' : ''}`}
              onClick={() => setUsersTab('pos')}
            >
              POS app-only
            </button>
            <button
              className={`users-tab ${usersTab === 'requests' ? 'active' : ''}`}
              onClick={() => setUsersTab('requests')}
            >
              Requests
            </button>
          </div>
          <div className="users-table-actions">
            <button className="users-action-btn">
              <Icon source={SearchIcon} />
            </button>
            <button className="users-action-btn">
              <Icon source={FilterIcon} />
            </button>
            <button className="users-action-btn">
              <Icon source={SortIcon} />
            </button>
          </div>
        </div>
        <div className="users-index-table">
          <IndexTable
            resourceName={usersResourceName}
            itemCount={usersData.length}
            selectedItemsCount={allUsersSelected ? 'All' : selectedUsers.length}
            onSelectionChange={handleUserSelectionChange}
            headings={[
              { title: 'User' },
              { title: 'Status' },
              { title: 'Role' },
            ]}
            selectable
          >
            {userRowMarkup}
          </IndexTable>
        </div>
      </div>
      <div className="users-learn-more">
        <a href="#">Learn more about users</a>
      </div>

      {/* Export Modal */}
      {showExportModal && (
        <div className="settings-modal-overlay" onClick={() => setShowExportModal(false)}>
          <div className="settings-modal" onClick={(e) => e.stopPropagation()}>
            <div className="settings-modal-header">
              <h2 className="settings-modal-title">Export users</h2>
              <button className="settings-modal-close" onClick={() => setShowExportModal(false)}>
                <Icon source={XIcon} />
              </button>
            </div>
            <div className="settings-modal-content">
              <p>Export a CSV file of all users including their email address, name, roles, and assigned stores. You'll receive an email to download the file when it's ready. To export permissions data, go to Roles.</p>
            </div>
            <div className="settings-modal-footer">
              <Button onClick={() => setShowExportModal(false)}>Cancel</Button>
              <Button variant="primary" onClick={() => setShowExportModal(false)}>Export</Button>
            </div>
          </div>
        </div>
      )}

      {/* Upgrade Plan Modal */}
      {showUpgradeModal && (
        <div className="settings-modal-overlay" onClick={() => setShowUpgradeModal(false)}>
          <div className="settings-modal" onClick={(e) => e.stopPropagation()}>
            <div className="settings-modal-header">
              <h2 className="settings-modal-title">Upgrade your plan to add users</h2>
              <button className="settings-modal-close" onClick={() => setShowUpgradeModal(false)}>
                <Icon source={XIcon} />
              </button>
            </div>
            <div className="settings-modal-content">
              <p>Your current plan does not support having staff accounts.</p>
            </div>
            <div className="settings-modal-footer">
              <Button onClick={() => setShowUpgradeModal(false)}>Cancel</Button>
              <Button variant="primary" onClick={() => setShowUpgradeModal(false)}>View plans</Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default UsersSettings;
