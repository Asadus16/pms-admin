/**
 * Issue Service Composable
 * 
 * Provides a convenient interface for working with the issue store.
 * This composable wraps the Pinia store and provides type-safe methods.
 * 
 * @module composables
 */

import { useIssueStore } from '~/stores/issue.store';
import { storeToRefs } from 'pinia';

// Types should be imported directly from stores:
// import type { Issue, IssueForm, IssueImage, ValidationResult } from '~/stores/issue.store';

export const useIssueService = () => {
  const store = useIssueStore();

  return {
    // Pinia Store (use this for all state management)
    store,

    // Convenience methods that delegate to store
    fetchIssues: (params?: Record<string, any>) =>
      store.fetchIssues(params),
    fetchIssueById: (id: string | number) => store.fetchIssueById(id),
    createIssue: (formData: FormData) => store.createIssue(formData),
    updateIssue: (id: string | number, formData: FormData) =>
      store.updateIssue(id, formData),
    deleteIssue: (id: string | number) => store.deleteIssue(id),
    saveIssue: (id?: string | number) => store.saveIssue(id),
    prepareFormData: () => store.prepareFormData(),
    validateForm: () => store.validateForm(),
    loadFormFromIssue: (issue: any) => store.loadFormFromIssue(issue),
    setUploadedImages: (images: File[]) => store.setUploadedImages(images),
    addUploadedImage: (image: File) => store.addUploadedImage(image),
    removeUploadedImage: (index: number) => store.removeUploadedImage(index),
    clearUploadedImages: () => store.clearUploadedImages(),
    resetForm: () => store.resetForm(),
  };
};

