'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuthContext } from '@/contexts/AuthContext';
import Dashboard from '@/pages/Dashboard';

export default function DashboardPage() {
    const router = useRouter();
    const { isAuthenticated, isLoading } = useAuthContext();

    // Redirect to root if not authenticated
    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push('/');
        }
    }, [isAuthenticated, isLoading, router]);

    // Show loading state while checking auth
    if (isLoading) {
        return (
            <div style={{ padding: '20px', textAlign: 'center' }}>
                <p>Checking authentication...</p>
            </div>
        );
    }

    // Don't render dashboard if not authenticated (will redirect)
    if (!isAuthenticated) {
        return null;
    }

    return <Dashboard />;
}

