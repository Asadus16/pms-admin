'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    AppProvider,
    Card,
    Select,
    Button,
    BlockStack,
} from '@shopify/polaris';
import '../src/styles/user-type-selection.css';

export default function Home() {
    const router = useRouter();
    const [userType, setUserType] = useState('real-estate-company');

    const userTypeOptions = [
        { label: 'Real Estate Company', value: 'real-estate-company' },
        { label: 'Owners', value: 'owners' },
        { label: 'Guests', value: 'guests' },
        { label: 'Property Manager', value: 'property-manager' },
    ];

    const handleContinue = () => {
        localStorage.setItem('selectedUserType', userType);
        router.push(`/${userType}/login`);
    };

    return (
        <AppProvider i18n={{}}>
                <div className="user-type-layout">
                    <header className="user-type-header">
                        <div className="user-type-logo">
                            <img
                                src="/logos/nest-quest.svg"
                                alt="Nest Quest"
                                style={{ height: '24px', width: 'auto' }}
                            />
                        </div>
                    </header>

                    <div className="user-type-body">
                        <div className="user-type-main">
                            <div className="user-type-content">
                                <Card padding="500">
                                    <BlockStack gap="400">
                                        <span className="select-label">
                                            Select User Type
                                        </span>

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

