'use client';

import { AppProvider } from '@shopify/polaris';
import CustomersPageComponent from '@components/CustomersPage';

export default function CustomersPage() {
    return (
        <AppProvider i18n={{}}>
            <CustomersPageComponent />
        </AppProvider>
    );
}

