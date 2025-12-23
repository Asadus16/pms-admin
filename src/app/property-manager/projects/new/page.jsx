'use client';

import { useRouter } from 'next/navigation';
import AddProject from '@/components/AddProject';

export default function NewProjectPage() {
  const router = useRouter();
  const basePath = '/property-manager';
  
  return <AddProject onClose={() => router.push(`${basePath}/projects`)} />;
}

