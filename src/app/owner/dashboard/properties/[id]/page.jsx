'use client';

import { AppProvider } from '@shopify/polaris';
import { useParams } from 'next/navigation';
import PropertyViewPage from '@/components/PropertyViewPage';

export default function PropertyViewPageRoute() {
  const params = useParams();
  const propertyId = params?.id;

  return (
    <AppProvider i18n={{}}>
      <PropertyViewPage propertyId={propertyId} />
    </AppProvider>
  );
}

