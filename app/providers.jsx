'use client';

import { AppProvider } from '@shopify/polaris';

export default function Providers({ children }) {
    return (
        <AppProvider i18n={{}}>
            {children}
        </AppProvider>
    );
}

