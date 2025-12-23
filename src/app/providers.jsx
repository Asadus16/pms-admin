'use client';

import { AppProvider } from '@shopify/polaris';
import { StoreProvider } from '@/store/StoreProvider';
import { AuthSync } from '@/components/auth/AuthSync';
import GlobalProgressBar from '@/components/GlobalProgressBar';

export default function Providers({ children }) {
    return (
        <AppProvider i18n={{}}>
            <StoreProvider>
                <AuthSync>
                    <GlobalProgressBar />
                    {children}
                </AuthSync>
            </StoreProvider>
        </AppProvider>
    );
}

