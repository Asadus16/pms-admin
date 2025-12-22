'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAppSelector } from '@/store';
import { selectIsAuthenticated, selectIsLoading, selectCurrentRole } from '@/store/slices/authSlice';
import Dashboard from '@/views/Dashboard';

export default function OwnerDashboardPage() {
    const router = useRouter();
    const isAuthenticated = useAppSelector(selectIsAuthenticated);
    const isLoading = useAppSelector(selectIsLoading);
    const currentRole = useAppSelector(selectCurrentRole);

    // Redirect to root if not authenticated or wrong role
    useEffect(() => {
        if (!isLoading) {
            if (!isAuthenticated) {
                router.push('/');
            } else if (currentRole !== 'owner') {
                // Redirect to correct role dashboard
                const { ROLE_DASHBOARD_PATHS } = require('@/lib/constants/roles');
                if (currentRole && ROLE_DASHBOARD_PATHS[currentRole]) {
                    router.push(ROLE_DASHBOARD_PATHS[currentRole]);
                } else {
                    router.push('/');
                }
            }
        }
    }, [isAuthenticated, isLoading, currentRole, router]);

    // Show loading state while checking auth
    if (isLoading) {
        return (
            <div style={{ padding: '20px', textAlign: 'center' }}>
                <p>Checking authentication...</p>
            </div>
        );
    }

    // Don't render dashboard if not authenticated or wrong role (will redirect)
    if (!isAuthenticated || currentRole !== 'owner') {
        return null;
    }

    return <Dashboard userType="owners" />;
}

