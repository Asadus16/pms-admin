'use client';

import { useParams } from 'next/navigation';
import PropertyReportsPage from '@/components/PropertyReportsPage';

export default function PropertyReportsPageRoute() {
  const params = useParams();
  const propertyId = params?.id;

  return <PropertyReportsPage propertyId={propertyId} />;
}
