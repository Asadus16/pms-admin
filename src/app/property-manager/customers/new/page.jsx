'use client';

import { useRouter } from 'next/navigation';
import AddCustomer from '@/components/AddCustomer';

export default function NewCustomerPage() {
  const router = useRouter();
  const basePath = '/property-manager';
  
  return <AddCustomer onClose={() => router.push(`${basePath}/owners`)} />;
}

