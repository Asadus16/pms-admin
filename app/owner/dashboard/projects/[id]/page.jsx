'use client';

import { AppProvider } from '@shopify/polaris';
import { useParams } from 'next/navigation';
import ProjectViewPage from '@/components/ProjectViewPage';

export default function ProjectViewPageRoute() {
  const params = useParams();
  const projectId = params?.id as string;
  
  return (
    <AppProvider i18n={{}}>
      <ProjectViewPage projectId={projectId} />
    </AppProvider>
  );
}

