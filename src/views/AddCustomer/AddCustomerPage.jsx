'use client';

import { AppProvider } from '@shopify/polaris';
import AddCustomerComponent from '@components/AddCustomer';

export default function AddCustomerPage() {
    return (
        <AppProvider i18n={{}}>
            <AddCustomerComponent />
        </AppProvider>
    );
}

