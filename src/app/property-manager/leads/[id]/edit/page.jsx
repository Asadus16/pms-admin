'use client';

import { useParams, useRouter } from 'next/navigation';
import AddLead from '@/components/AddLead';

export default function EditLeadPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id;
  const basePath = '/property-manager';

  return <AddLead mode="edit" leadId={id} onClose={() => router.push(`${basePath}/leads`)} />;
}

