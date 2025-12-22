'use client';

import { AppProvider } from '@shopify/polaris';
import AnalyticsPageComponent from '@components/AnalyticsPage';

export default function AnalyticsPage() {
    return (
        <AppProvider i18n={{}}>
            <AnalyticsPageComponent />
        </AppProvider>
    );
}

