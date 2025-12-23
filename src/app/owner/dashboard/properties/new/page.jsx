'use client';

import { AppProvider } from '@shopify/polaris';
import { useRouter } from 'next/navigation';
import AddProperty from '@/components/AddProperty';

export default function AddPropertyPage() {
  const router = useRouter();
  
  return (
    <AppProvider i18n={{}}>
      <AddProperty onClose={() => router.push('/owner/dashboard/properties')} />
    </AppProvider>
  );
}

