'use client';

import { AppProvider } from '@shopify/polaris';
import { useParams } from 'next/navigation';
import DeveloperViewPage from '@/components/DeveloperViewPage';

export default function DeveloperViewPageRoute() {
  const params = useParams();
  const developerId = params?.id;

  return (
    <AppProvider i18n={{}}>
      <DeveloperViewPage developerId={developerId} />
    </AppProvider>
  );
}

