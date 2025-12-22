'use client';

import { useParams } from 'next/navigation';
import OwnerViewPage from '@/components/OwnerViewPage';

export default function OwnerViewPageRoute() {
  const params = useParams();
  const ownerId = params?.id;

  return <OwnerViewPage ownerId={ownerId} />;
}
