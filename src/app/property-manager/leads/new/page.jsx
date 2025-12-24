'use client';

import { useRouter } from 'next/navigation';
import AddLead from '@/components/AddLead';

export default function NewLeadPage() {
  const router = useRouter();
  const basePath = '/property-manager';

  return <AddLead onClose={() => router.push(`${basePath}/leads`)} />;
}

