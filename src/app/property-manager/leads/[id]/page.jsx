'use client';

import { useParams } from 'next/navigation';
import LeadViewPage from '@/components/LeadViewPage';

export default function LeadDetailPage() {
  const params = useParams();
  const id = params?.id;

  return <LeadViewPage leadId={id} />;
}

