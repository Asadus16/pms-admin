'use client';

import { AppProvider } from '@shopify/polaris';
import { useRouter } from 'next/navigation';
import CreateOrder from '@/components/CreateOrder';

export default function CreateBookingPage() {
  const router = useRouter();
  
  return (
    <AppProvider i18n={{}}>
      <CreateOrder onClose={() => router.push('/owner/dashboard/bookings')} />
    </AppProvider>
  );
}

