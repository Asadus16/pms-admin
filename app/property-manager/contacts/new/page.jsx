'use client';

import { useRouter } from 'next/navigation';
import AddContact from '@/components/AddContact';

export default function NewContactPage() {
  const router = useRouter();
  const basePath = '/property-manager';

  return <AddContact onClose={() => router.push(`${basePath}/contacts`)} />;
}
