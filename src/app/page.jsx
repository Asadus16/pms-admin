'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/store';
import { selectIsAuthenticated, selectCurrentRole } from '@/store/slices/authSlice';
import { ROLE_DASHBOARD_PATHS, ROLE_LOGIN_PATHS, ROLE_DISPLAY_NAMES } from '@/lib/constants/roles';
import {
    Card,
    Select,
    Button,
    BlockStack,
} from '@shopify/polaris';
import '@/styles/user-type-selection.css';

export default function Home() {
    const router = useRouter();
    const isAuthenticated = useAppSelector(selectIsAuthenticated);
    const currentRole = useAppSelector(selectCurrentRole);
    const [userType, setUserType] = useState('property-manager');

    // Redirect if already authenticated
    useEffect(() => {
        // Small delay to ensure auth context is initialized
        const timer = setTimeout(() => {
            if (isAuthenticated && currentRole) {
                const dashboardPath = ROLE_DASHBOARD_PATHS[currentRole];
                router.push(dashboardPath);
            }
        }, 100);

        return () => clearTimeout(timer);
    }, [isAuthenticated, currentRole, router]);

    // Create user type options from roles
    const userTypeOptions = Object.entries(ROLE_DISPLAY_NAMES).map(([value, label]) => ({
        label,
        value,
    }));

    const handleContinue = () => {
        if (userType && ROLE_LOGIN_PATHS[userType]) {
            router.push(ROLE_LOGIN_PATHS[userType]);
        }
    };

    return (
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
    );
}

