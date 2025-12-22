'use client';

import { AppProvider } from '@shopify/polaris';
import OrdersPage from '@/components/OrdersPage';

export default function BookingsPageRoute() {
  return (
    <AppProvider i18n={{}}>
      <OrdersPage />
    </AppProvider>
  );
}

