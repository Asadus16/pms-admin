'use client';

import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useAuth } from '@/composables/useAuth';
import { useAppSelector } from '@/store';
import { selectIsAuthenticated, selectCurrentRole } from '@/store/slices/authSlice';
import { ROLE_DASHBOARD_PATHS } from '@/composables/roles';
import LoginComponent from '@/components/auth/LoginComponent';
import '@/styles/login-component.css';

export default function PropertyManagerLoginPage() {
    const router = useRouter();
    const isAuthenticated = useAppSelector(selectIsAuthenticated);
    const currentRole = useAppSelector(selectCurrentRole);
    const auth = useAuth('property-manager');

    // Redirect if already authenticated (only check once on mount)
    useEffect(() => {
        // Small delay to ensure auth context is initialized
        const timer = setTimeout(() => {
            if (isAuthenticated && currentRole) {
                const dashboardPath = ROLE_DASHBOARD_PATHS[currentRole];
                const redirect = router.query.redirect || dashboardPath;
                router.push(redirect);
            }
        }, 50);

        return () => clearTimeout(timer);
    }, []); // Only run once on mount

    // If authenticated, show redirecting message (redirect will happen via useEffect)
    if (isAuthenticated && currentRole) {
        return (
            <div style={{ padding: '20px', textAlign: 'center' }}>
                <p>Redirecting...</p>
            </div>
        );
    }

    // Show login form immediately
    return <LoginComponent userType="property-manager" auth={auth} />;
}

