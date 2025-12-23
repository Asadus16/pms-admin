'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { useAppSelector } from '@/store';
import { selectIsAuthenticated, selectCurrentRole } from '@/store/slices/authSlice';
import { ROLE_DASHBOARD_PATHS } from '@/lib/constants/roles';
import LoginComponent from '@/components/auth/LoginComponent';
import '@/styles/login-component.css';

export default function GuestLoginPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const isAuthenticated = useAppSelector(selectIsAuthenticated);
    const currentRole = useAppSelector(selectCurrentRole);

    // Redirect if already authenticated (only check once on mount)
    useEffect(() => {
        // Small delay to ensure auth context is initialized
        const timer = setTimeout(() => {
            if (isAuthenticated && currentRole) {
                const dashboardPath = ROLE_DASHBOARD_PATHS[currentRole];
                const redirect = searchParams.get('redirect') || dashboardPath;
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
    return <LoginComponent userType="guest" />;
}

