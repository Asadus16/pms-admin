'use client';

import { useParams } from 'next/navigation';
import DeveloperViewPage from '@/components/DeveloperViewPage';

export default function DeveloperViewPageRoute() {
  const params = useParams();
  const developerId = params?.id as string;
  
  return <DeveloperViewPage developerId={developerId} />;
}

