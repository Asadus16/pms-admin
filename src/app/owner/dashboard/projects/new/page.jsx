'use client';

import { AppProvider } from '@shopify/polaris';
import { useRouter } from 'next/navigation';
import AddProject from '@/components/AddProject';

export default function AddProjectPage() {
  const router = useRouter();
  
  return (
    <AppProvider i18n={{}}>
      <AddProject onClose={() => router.push('/owner/dashboard/projects')} />
    </AppProvider>
  );
}

