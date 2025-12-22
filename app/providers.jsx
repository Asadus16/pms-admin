'use client';

import { AppProvider } from '@shopify/polaris';
import { StoreProvider } from '@/store/StoreProvider';
import { AuthSync } from '@/components/auth/AuthSync';

export default function Providers({ children }) {
    return (
        <AppProvider i18n={{}}>
            <StoreProvider>
                <AuthSync>
                    {children}
                </AuthSync>
            </StoreProvider>
        </AppProvider>
    );
}

