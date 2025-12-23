'use client';

import { AppProvider } from '@shopify/polaris';
import PropertiesPage from '@/components/PropertiesPage';

export default function PropertiesPageRoute() {
  return (
    <AppProvider i18n={{}}>
      <PropertiesPage />
    </AppProvider>
  );
}

