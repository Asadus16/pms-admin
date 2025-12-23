'use client';

import { useParams, useRouter } from 'next/navigation';
import PropertyViewPage from '@/components/PropertyViewPage';

export default function PropertyViewPageRoute() {
  const params = useParams();
  const propertyId = params?.id as string;
  
  return <PropertyViewPage propertyId={propertyId} />;
}

