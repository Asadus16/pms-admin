'use client';

import { useState } from 'react';
import { Icon, Button, IndexTable, Text, useIndexResourceState, Pagination, Box, InlineStack } from '@shopify/polaris';
import {
  XIcon,
  SearchIcon,
  FilterIcon,
  SortIcon,
  InfoIcon,
  PersonIcon,
  ChevronDownIcon,
} from '@shopify/polaris-icons';
import './styles/RolesSettings.css';

// Roles data
const rolesData = [
  { id: '1', name: 'AA - AskAshirvad x skshafeen', category: 'Store', users: 0 },
  { id: '2', name: 'Ads and Technology LLC FZ x skshafeen', category: 'Store', users: 1 },
  { id: '3', name: 'App developer', category: 'Organization', users: 0, isSystem: true },
  { id: '4', name: 'Cashier', category: 'Point of Sale', users: 0 },
  { id: '5', name: 'Customer support', category: 'Store', users: 0 },
  { id: '6', name: 'Flux Ventures x skshafeen', category: 'Store', users: 0 },
  { id: '7', name: 'Flux Ventures x skshafeen (1)', category: 'Store', users: 0 },
  { id: '8', name: 'Jhango x skshafeen', category: 'Store', users: 0 },
  { id: '9', name: 'Marketer', category: 'Store', users: 0 },
  { id: '10', name: 'Merchandiser', category: 'Store', users: 0 },
  { id: '11', name: 'NETHYPE x skshafeen', category: 'Store', users: 1 },
  { id: '12', name: 'Online store editor', category: 'Store', users: 0 },
  { id: '13', name: 'Administrator', category: 'Organization', users: 0, isSystem: true },
  { id: '14', name: 'POS administrator', category: 'Organization', users: 0, isSystem: true },
];

function RolesSettings({ showRolesExportModal, setShowRolesExportModal, showAddRoleModal, setShowAddRoleModal }) {
  const [showPosUpdateBanner, setShowPosUpdateBanner] = useState(true);
  const [newRoleName, setNewRoleName] = useState('');
  const [newRoleDescription, setNewRoleDescription] = useState('');
  const [newRoleCategory, setNewRoleCategory] = useState('');

  // Roles table resource state
  const { selectedResources: selectedRoles, allResourcesSelected: allRolesSelected, handleSelectionChange: handleRoleSelectionChange } =
    useIndexResourceState(rolesData);

  const rolesResourceName = {
    singular: 'role',
    plural: 'roles',
  };

  const roleRowMarkup = rolesData.map((role, index) => (
    <IndexTable.Row
      id={role.id}
      key={role.id}
      selected={selectedRoles.includes(role.id)}
      position={index}
      disabled={role.isSystem}
    >
      <IndexTable.Cell>
        <Text variant="bodyMd" as="span">{role.name}</Text>
      </IndexTable.Cell>
      <IndexTable.Cell>
        <Text variant="bodyMd" as="span" tone={role.isSystem ? 'subdued' : undefined}>{role.category}</Text>
      </IndexTable.Cell>
      <IndexTable.Cell>
        <Text variant="bodyMd" as="span" alignment="end">{role.users}</Text>
      </IndexTable.Cell>
    </IndexTable.Row>
  ));

  return (
    <>
      {/* POS Roles Update Banner */}
      {showPosUpdateBanner && (
        <div className="roles-info-banner">
          <div className="roles-info-banner-header">
            <div className="roles-info-banner-icon">
              <Icon source={InfoIcon} />
            </div>
            <span className="roles-info-banner-title">POS roles update</span>
            <button className="roles-banner-close" onClick={() => setShowPosUpdateBanner(false)}>
              <Icon source={XIcon} />
            </button>
          </div>
          <div className="roles-info-banner-content">
            User management and device setup permissions in previous POS roles are now replaced with new system roles. Only specific administrators can create and edit POS roles. <a href="#">Learn more</a>
          </div>
        </div>
      )}

      {/* Roles Table */}
      <div className="roles-table-container">
        <div className="roles-table-toolbar">
          <div className="roles-tabs">
            <button className="roles-tab active">All</button>
          </div>
          <div className="roles-table-actions">
            <button className="roles-action-btn">
              <Icon source={SearchIcon} />
            </button>
            <button className="roles-action-btn">
              <Icon source={FilterIcon} />
            </button>
            <button className="roles-action-btn">
              <Icon source={SortIcon} />
            </button>
          </div>
        </div>
        <div className="roles-index-table">
          <IndexTable
            resourceName={rolesResourceName}
            itemCount={rolesData.length}
            selectedItemsCount={allRolesSelected ? 'All' : selectedRoles.length}
            onSelectionChange={handleRoleSelectionChange}
            headings={[
              { title: 'Name' },
              { title: 'Category' },
              { title: 'Users', alignment: 'end' },
            ]}
            selectable
          >
            {roleRowMarkup}
          </IndexTable>
        </div>
        <Box padding="400">
          <InlineStack align="start">
            <Pagination
              hasPrevious={false}
              onPrevious={() => { }}
              hasNext={true}
              onNext={() => { }}
            />
          </InlineStack>
        </Box>
      </div>

      {/* Export Roles Modal */}
      {showRolesExportModal && (
        <div className="settings-modal-overlay" onClick={() => setShowRolesExportModal(false)}>
          <div className="settings-modal" onClick={(e) => e.stopPropagation()}>
            <div className="settings-modal-header">
              <h2 className="settings-modal-title">Export roles</h2>
              <button className="settings-modal-close" onClick={() => setShowRolesExportModal(false)}>
                <Icon source={XIcon} />
              </button>
            </div>
            <div className="settings-modal-content">
              <p>Export a CSV file of all custom roles including name, category, and permissions. You&apos;ll receive an email to download the file when it&apos;s ready.</p>
            </div>
            <div className="settings-modal-footer">
              <Button onClick={() => setShowRolesExportModal(false)}>Cancel</Button>
              <Button variant="primary" onClick={() => setShowRolesExportModal(false)}>Export</Button>
            </div>
          </div>
        </div>
      )}

      {/* Add Role Modal */}
      {showAddRoleModal && (
        <div className="settings-modal-overlay" onClick={() => setShowAddRoleModal(false)}>
          <div className="settings-modal settings-modal-large" onClick={(e) => e.stopPropagation()}>
            <div className="settings-modal-header">
              <h2 className="settings-modal-title">
                <span className="roles-breadcrumb">
                  <Icon source={PersonIcon} />
                  <span className="roles-breadcrumb-separator">›</span>
                  <span>Roles</span>
                  <span className="roles-breadcrumb-separator">›</span>
                  <span className="roles-breadcrumb-current">Add role</span>
                </span>
              </h2>
              <button className="settings-modal-close" onClick={() => setShowAddRoleModal(false)}>
                <Icon source={XIcon} />
              </button>
            </div>
            <div className="settings-modal-content">
              <div className="add-role-form">
                <div className="add-role-field">
                  <label className="add-role-label">Name</label>
                  <input
                    type="text"
                    className="add-role-input"
                    value={newRoleName}
                    onChange={(e) => setNewRoleName(e.target.value)}
                  />
                </div>
                <div className="add-role-field">
                  <label className="add-role-label">Description</label>
                  <input
                    type="text"
                    className="add-role-input"
                    value={newRoleDescription}
                    onChange={(e) => setNewRoleDescription(e.target.value)}
                  />
                </div>
                <div className="add-role-permissions-section">
                  <div className="add-role-permissions-header">
                    <h3 className="add-role-permissions-title">Permissions</h3>
                    <p className="add-role-permissions-description">Role category determines available permissions.</p>
                  </div>
                  <div className="add-role-select-wrapper">
                    <select
                      className="add-role-select"
                      value={newRoleCategory}
                      onChange={(e) => setNewRoleCategory(e.target.value)}
                    >
                      <option value="">Select a role category</option>
                      <option value="store">Store - Permissions within stores</option>
                      <option value="pos">Point of Sale - Permissions within POS</option>
                    </select>
                    <div className="add-role-select-icon">
                      <Icon source={ChevronDownIcon} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default RolesSettings;
