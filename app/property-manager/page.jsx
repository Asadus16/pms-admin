'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function PropertyManagerRootPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/property-manager/dashboard');
  }, [router]);

  return null;
}

