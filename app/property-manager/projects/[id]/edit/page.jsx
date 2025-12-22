'use client';

import { useParams, useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import AddProject from '@/components/AddProject';
import { useAppDispatch, useAppSelector } from '@/store';
import { fetchPropertyManagerProjectById } from '@/store/thunks/property-manager/propertyManagerThunks';
import {
  selectProject,
  selectProjectsLoading,
  selectProjectsError,
} from '@/store/slices/property-manager';
import { Page, Card, Box, Text, BlockStack, Button } from '@shopify/polaris';
import { ArrowLeftIcon } from '@shopify/polaris-icons';

export default function EditProjectPage() {
  const params = useParams();
  const router = useRouter();
  const pathname = usePathname();
  const projectId = params?.id ? String(params.id) : undefined;
  
  // Get the base path (userType) from the current pathname
  const basePath = pathname?.split('/')[1] ? `/${pathname.split('/')[1]}` : '/property-manager';

  const dispatch = useAppDispatch();
  
  // Redux state
  const projectFromStore = useAppSelector(selectProject);
  const loading = useAppSelector(selectProjectsLoading);
  const error = useAppSelector(selectProjectsError);

  // Transform project data for AddProject component
  const [project, setProject] = useState(null);

  // Fetch project from API
  useEffect(() => {
    if (!projectId) return;
    dispatch(fetchPropertyManagerProjectById(projectId));
  }, [projectId, dispatch]);

  // Transform project data when it's loaded
  useEffect(() => {
    if (projectFromStore) {
      setProject(projectFromStore);
    }
  }, [projectFromStore]);

  const handleClose = () => {
    router.push(`${basePath}/projects/${projectId}`);
  };

  if (loading) {
    return (
      <Page
        title="Edit Project"
        backAction={{ content: 'Back', onAction: handleClose }}
      >
        <Card>
          <Box padding="400">
            <Text>Loading project...</Text>
          </Box>
        </Card>
      </Page>
    );
  }

  if (error || !project) {
    return (
      <Page
        title="Edit Project"
        backAction={{ content: 'Back', onAction: () => router.push(`${basePath}/projects`) }}
      >
        <Card>
          <Box padding="400">
            <BlockStack gap="200">
              <Text variant="headingMd" as="h2">
                {error ? 'Error loading project' : 'Project not found'}
              </Text>
              <Text variant="bodyMd" as="p" tone="subdued">
                {error || `We couldn't find a project with ID: ${projectId}`}
              </Text>
              <div>
                <Button icon={ArrowLeftIcon} onClick={() => router.push(`${basePath}/projects`)}>
                  Back to projects
                </Button>
              </div>
            </BlockStack>
          </Box>
        </Card>
      </Page>
    );
  }

  return (
    <AddProject
      mode="edit"
      initialProject={project}
      onClose={handleClose}
    />
  );
}

