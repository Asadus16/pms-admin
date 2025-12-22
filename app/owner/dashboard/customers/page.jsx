'use client';

import { AppProvider } from '@shopify/polaris';
import CustomersPage from '@/components/CustomersPage';

export default function CustomersPageRoute() {
  return (
    <AppProvider i18n={{}}>
      <CustomersPage />
    </AppProvider>
  );
}

