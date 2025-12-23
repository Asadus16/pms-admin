'use client';

import { useParams, useRouter } from 'next/navigation';
import AddContact from '@/components/AddContact';

export default function EditContactPage() {
  const params = useParams();
  const router = useRouter();
  const contactId = params?.id;
  const basePath = '/property-manager';

  return (
    <AddContact
      mode="edit"
      contactId={contactId}
      onClose={() => router.push(`${basePath}/contacts/${contactId}`)}
    />
  );
}
