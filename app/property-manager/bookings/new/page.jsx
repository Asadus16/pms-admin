'use client';

import { useRouter } from 'next/navigation';
import CreateOrder from '@/components/CreateOrder';

export default function NewBookingPage() {
  const router = useRouter();
  const basePath = '/property-manager';
  
  return <CreateOrder onClose={() => router.push(`${basePath}/bookings`)} />;
}

