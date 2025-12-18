'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  AppProvider,
  Card,
  Select,
  Button,
  Text,
  BlockStack,
} from '@shopify/polaris';
import './UserTypeSelection.css';

function UserTypeSelection() {
  const router = useRouter();
  const [userType, setUserType] = useState('real-estate-company');

  const userTypeOptions = [
    { label: 'Real Estate Company', value: 'real-estate-company' },
    { label: 'Owners', value: 'owners' },
    { label: 'Guests', value: 'guests' },
    { label: 'Property Manager', value: 'property-manager' },
    { label: 'Property Developer', value: 'property-developer' },
  ];

  const handleContinue = () => {
    // Store the selected user type in localStorage for later use
    localStorage.setItem('selectedUserType', userType);
    router.push('/login');
  };

  return (
    <AppProvider i18n={{}}>
      <div className="user-type-layout">
        {/* Header */}
        <header className="user-type-header">
          <div className="user-type-logo">
            <img
              src="/logos/nest-quest.svg"
              alt="Nest Quest"
              style={{ height: '24px', width: 'auto' }}
            />
          </div>
        </header>

        {/* Main content with rounded corners */}
        <div className="user-type-body">
          <div className="user-type-main">
            <div className="user-type-content">
              <Card padding="500">
                <BlockStack gap="400">
                  <Text variant="headingSm" as="h2" fontWeight="semibold">
                    Select User Type
                  </Text>

                  <Select
                    label=""
                    labelHidden
                    options={userTypeOptions}
                    value={userType}
                    onChange={setUserType}
                  />

                  <div className="user-type-button">
                    <Button
                      onClick={handleContinue}
                      variant="primary"
                    >
                      Continue
                    </Button>
                  </div>
                </BlockStack>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </AppProvider>
  );
}

export default UserTypeSelection;
