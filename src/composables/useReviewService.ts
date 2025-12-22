/**
 * Review Service Composable
 * 
 * Provides convenience methods for review management.
 * All state management is handled by the Pinia store (useReviewStore).
 * 
 * @module composables/useReviewService
 */

import {
  useReviewStore,
} from '~/stores/review.store';

// Types should be imported directly from stores:
// import type { ReviewForm, Review } from '~/stores/review.store';

export const useReviewService = () => {
  const store = useReviewStore();

  return {
    // Pinia Store (use this for all state management)
    store,

    // Convenience methods that delegate to store
    fetchReviews: (params?: Record<string, any>) =>
      store.fetchReviews(params),
    fetchReviewById: (id: string | number) => store.fetchReviewById(id),
    createReview: (formData: FormData) => store.createReview(formData),
    updateReview: (id: string | number, formData: FormData) =>
      store.updateReview(id, formData),
    deleteReview: (id: string | number) => store.deleteReview(id),
    saveReview: (id?: string | number) => store.saveReview(id),
  };
};

