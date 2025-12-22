'use client';

import { AppProvider } from '@shopify/polaris';
import { useRouter } from 'next/navigation';
import AddCustomer from '@/components/AddCustomer';

export default function AddCustomerPage() {
  const router = useRouter();
  
  return (
    <AppProvider i18n={{}}>
      <AddCustomer onClose={() => router.push('/owner/dashboard/customers')} />
    </AppProvider>
  );
}

