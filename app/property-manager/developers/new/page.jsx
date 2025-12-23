'use client';

import { useRouter } from 'next/navigation';
import AddDeveloper from '@/components/AddDeveloper';

export default function NewDeveloperPage() {
  const router = useRouter();
  const basePath = '/property-manager';
  
  return <AddDeveloper onClose={() => router.push(`${basePath}/developers`)} />;
  
}

