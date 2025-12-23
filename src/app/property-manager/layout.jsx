'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState, useMemo } from 'react';
import { useAppSelector } from '@/store';
import { selectIsAuthenticated, selectIsLoading, selectCurrentRole } from '@/store/slices/authSlice';
import DashboardLayout from '@/components/DashboardLayout';

export default function PropertyManagerLayout({ children }) {
    const router = useRouter();
    const pathname = usePathname();
    const isAuthenticated = useAppSelector(selectIsAuthenticated);
    const isLoading = useAppSelector(selectIsLoading);
    const currentRole = useAppSelector(selectCurrentRole);
    const [isMounted, setIsMounted] = useState(false);
    const [hasCheckedAuth, setHasCheckedAuth] = useState(false);

    // Skip auth check for login and signup pages - memoize to avoid recalculation
    const isAuthPage = useMemo(() => {
        return pathname?.includes('/login') || pathname?.includes('/signup');
    }, [pathname]);

    // Set mounted state to avoid hydration mismatch
    useEffect(() => {
        setIsMounted(true);
    }, []);

    // Redirect to root if not authenticated or wrong role (skip for auth pages)
    // Only check once after mount and when auth state changes, not on every pathname change
    useEffect(() => {
        if (isMounted && !isAuthPage && !isLoading) {
            // Only redirect if auth state has actually changed or this is the first check
            if (!hasCheckedAuth || !isAuthenticated || currentRole !== 'property-manager') {
                setHasCheckedAuth(true);
                
                if (!isAuthenticated) {
                    router.push('/');
                    return;
                } else if (currentRole !== 'property-manager') {
                    const { ROLE_DASHBOARD_PATHS } = require('@/lib/constants/roles');
                    if (currentRole && ROLE_DASHBOARD_PATHS[currentRole]) {
                        router.push(ROLE_DASHBOARD_PATHS[currentRole]);
                    } else {
                        router.push('/');
                    }
                    return;
                }
            }
        }
    }, [isMounted, isAuthenticated, isLoading, currentRole, router, isAuthPage, hasCheckedAuth]);

    // For auth pages (login, signup), just render children without DashboardLayout
    if (isAuthPage) {
        return <>{children}</>;
    }

    // Show loading state only on initial mount or during initial auth check
    // Don't show loading on subsequent navigations
    if (!isMounted || (isLoading && !hasCheckedAuth)) {
        return (
            <div style={{ padding: '20px', textAlign: 'center' }}>
                <p>Loading...</p>
            </div>
        );
    }

    // Don't render dashboard if not authenticated or wrong role (will redirect)
    if (!isAuthenticated || currentRole !== 'property-manager') {
        return null;
    }

    // For all other pages, wrap with DashboardLayout
    // Pages will render their specific content as children
    return <DashboardLayout userType="property-manager">{children}</DashboardLayout>;
}

