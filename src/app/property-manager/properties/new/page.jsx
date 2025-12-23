'use client';

import { useRouter } from 'next/navigation';
import AddProperty from '@/components/AddProperty';

export default function NewPropertyPage() {
  const router = useRouter();
  const basePath = '/property-manager';
  
  return <AddProperty onClose={() => router.push(`${basePath}/properties`)} />;
}

