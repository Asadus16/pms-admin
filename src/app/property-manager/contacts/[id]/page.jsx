'use client';

import { useParams } from 'next/navigation';
import ContactViewPage from '@/components/ContactViewPage';

export default function ContactViewPageRoute() {
  const params = useParams();
  const contactId = params?.id;

  return <ContactViewPage contactId={contactId} />;
}
