'use client';

import { useRouter } from 'next/navigation';
import AddInventory from '@/components/AddInventory';

export default function NewInventoryPage() {
  const router = useRouter();
  const basePath = '/property-manager';

  return <AddInventory onClose={() => router.push(`${basePath}/inventory`)} />;
}
