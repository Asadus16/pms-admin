'use client';

import { useRouter } from 'next/navigation';
import AddOwner from '@/components/AddOwner';

export default function NewOwnerPage() {
  const router = useRouter();
  const basePath = '/property-manager';

  return <AddOwner onClose={() => router.push(`${basePath}/owners`)} />;
}
