'use client';

import { useParams } from 'next/navigation';
import ProjectViewPage from '@/components/ProjectViewPage';

export default function ProjectViewPageRoute() {
  const params = useParams();
  const projectId = params?.id as string;
  
  return <ProjectViewPage projectId={projectId} />;
}

