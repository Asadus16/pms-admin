'use client';

import { AppProvider } from '@shopify/polaris';
import PropertyOwnersPage from '@/components/PropertyOwnersPage';

export default function DevelopersPageRoute() {
  return (
    <AppProvider i18n={{}}>
      <PropertyOwnersPage />
    </AppProvider>
  );
}

