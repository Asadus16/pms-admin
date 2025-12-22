'use client';

import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAuth } from '@/composables/useAuth';
import { useAuthContext } from '@/contexts/AuthContext';
import { ROLE_DASHBOARD_PATHS, ROLE_LOGIN_PATHS, getRoleFromPath, isValidRole, type UserRoleType } from '@/composables/roles';
import LoginComponent from '@/components/auth/LoginComponent';

export default function LoginPage() {
    const params = useParams();
    const router = useRouter();
    const searchParams = useSearchParams();
    const userType = params?.userType as string | undefined;
    const { isAuthenticated, currentRole } = useAuthContext();
    const auth = useAuth(userType as UserRoleType | undefined);
    const [isChecking, setIsChecking] = useState(true);

    // Redirect if already authenticated
    useEffect(() => {
        if (isAuthenticated && currentRole) {
            const dashboardPath = ROLE_DASHBOARD_PATHS[currentRole];
            const redirect = searchParams.get('redirect') || dashboardPath;
            router.push(redirect);
        } else {
            setIsChecking(false);
        }
    }, [isAuthenticated, currentRole, router, searchParams]);

    // Validate user type
    if (userType && !isValidRole(userType)) {
        return (
            <div style={{ padding: '20px', textAlign: 'center' }}>
                <h1>Invalid User Type</h1>
                <p>The user type "{userType}" is not valid.</p>
            </div>
        );
    }

    if (isChecking) {
        return (
            <div style={{ padding: '20px', textAlign: 'center' }}>
                <p>Checking authentication...</p>
            </div>
        );
    }

    return <LoginComponent userType={userType} auth={auth} />;
}
