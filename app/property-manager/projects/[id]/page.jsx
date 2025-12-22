'use client';

import { useParams } from 'next/navigation';
import ProjectViewPage from '@/components/ProjectViewPage';

export default function ProjectViewPageRoute() {
  const params = useParams();
  const projectId = params?.id ? String(params.id) : undefined;
  
  return <ProjectViewPage projectId={projectId} />;
}

