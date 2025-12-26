'use client';

import { useRouter } from 'next/navigation';
import AddTenancyContract from '@/components/AddTenancyContract';

export default function NewTenancyContractPage() {
  const router = useRouter();
  const basePath = '/property-manager';
  
  return <AddTenancyContract onClose={() => router.push(`${basePath}/tenancy-contracts`)} />;
}


