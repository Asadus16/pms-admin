'use client';

import { AppProvider } from '@shopify/polaris';
import { useRouter } from 'next/navigation';
import AddDeveloper from '@/components/AddDeveloper';

export default function AddDeveloperPage() {
  const router = useRouter();
  
  return (
    <AppProvider i18n={{}}>
      <AddDeveloper onClose={() => router.push('/owner/dashboard/developers')} />
    </AppProvider>
  );
}

