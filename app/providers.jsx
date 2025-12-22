'use client';

import { AppProvider } from '@shopify/polaris';
import { AuthProvider } from '@/contexts/AuthContext';

export default function Providers({ children }) {
    return (
        <AppProvider i18n={{}}>
            <AuthProvider>
                {children}
            </AuthProvider>
        </AppProvider>
    );
}

