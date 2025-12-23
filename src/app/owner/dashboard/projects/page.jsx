'use client';

import { AppProvider } from '@shopify/polaris';
import ProjectsPage from '@/components/ProjectsPage';

export default function ProjectsPageRoute() {
  return (
    <AppProvider i18n={{}}>
      <ProjectsPage />
    </AppProvider>
  );
}

