'use client';

import { AppProvider } from '@shopify/polaris';
import AnalyticsPage from '@/components/AnalyticsPage';

export default function AnalyticsPageRoute() {
  return (
    <AppProvider i18n={{}}>
      <AnalyticsPage />
    </AppProvider>
  );
}

