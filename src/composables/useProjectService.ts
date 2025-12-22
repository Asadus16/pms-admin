/**
 * Project Service Composable
 * 
 * Provides convenience methods for project management.
 * All state management is handled by the Pinia store (useProjectStore).
 * 
 * @module composables/useProjectService
 * 
 * @example
 * ```typescript
 * // Use store directly for state management
 * const store = useProjectStore();
 * store.setRole('property-manager');
 * await store.fetchProjects();
 * 
 * // Use composable for convenience
 * const { fetchProjects, createProject } = useProjectService();
 * await fetchProjects();
 * ```
 */

import {
  useProjectStore,
} from '~/stores/project.store';

// Types should be imported directly from stores:
// import type { Project, ProjectForm, ProjectFilters, DeveloperOption } from '~/stores/project.store';

export const useProjectService = () => {
  const store = useProjectStore();

  return {
    // Pinia Store (use this for all state management)
    store,

    // Convenience methods that delegate to store
    setRole: (role: 'property-manager' | 'owner') => store.setRole(role),
    fetchProjects: (params?: Record<string, any>) => store.fetchProjects(params),
    fetchProjectById: (id: string | number) => store.fetchProjectById(id),
    createProject: (formData: FormData) => store.createProject(formData),
    updateProject: (id: string | number, formData: FormData) =>
      store.updateProject(id, formData),
    deleteProject: (id: string | number) => store.deleteProject(id),
    prepareFormData: () => store.prepareFormData(),
    loadFormFromProject: (project: Project) => store.loadFormFromProject(project),
    resetForm: () => store.resetForm(),
    updateFilters: (filters: Partial<ProjectFilters>) => store.updateFilters(filters),
    clearFilters: () => store.clearFilters(),
    fetchDevelopers: () => store.fetchDevelopers(),
    // File management
    setMasterplan: (file: File | null) => store.setMasterplan(file),
    addFloorPlan: (file: File) => store.addFloorPlan(file),
    removeFloorPlan: (index: number) => store.removeFloorPlan(index),
    clearFloorPlans: () => store.clearFloorPlans(),
    addImage: (file: File) => store.addImage(file),
    removeImage: (index: number) => store.removeImage(index),
    clearImages: () => store.clearImages(),
    addVideo: (file: File) => store.addVideo(file),
    removeVideo: (index: number) => store.removeVideo(index),
    clearVideos: () => store.clearVideos(),
    addDeletedMediaId: (id: number) => store.addDeletedMediaId(id),
    removeDeletedMediaId: (id: number) => store.removeDeletedMediaId(id),
    clearDeletedMediaIds: () => store.clearDeletedMediaIds(),
  };
};


