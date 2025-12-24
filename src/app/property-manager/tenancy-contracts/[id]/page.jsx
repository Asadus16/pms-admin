'use client';

import { useParams } from 'next/navigation';
import TenancyContractViewPage from '@/components/TenancyContractViewPage';

export default function TenancyContractViewPageRoute() {
  const params = useParams();
  const contractId = params?.id ? String(params.id) : undefined;
  
  return <TenancyContractViewPage contractId={contractId} />;
}

