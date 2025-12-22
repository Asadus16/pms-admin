/**
 * Contact Service Composable
 * 
 * Provides convenience methods for contact management.
 * All state management is handled by the Pinia store (useContactStore).
 * 
 * @module composables/useContactService
 */

import {
  useContactStore,
} from '~/stores/contact.store';

// Types should be imported directly from stores:
// import type { Contact, ContactForm, ContactFilters, ContactType, ContactStatus, ContactTag } from '~/stores/contact.store';

export const useContactService = () => {
  const store = useContactStore();

  return {
    // Pinia Store (use this for all state management)
    store,

    // Convenience methods that delegate to store
    setRole: (role: 'property-manager' | 'owner') => store.setRole(role),
    fetchContacts: (params?: Record<string, any>) => store.fetchContacts(params),
    fetchContactById: (id: string | number) => store.fetchContactById(id),
    createContact: (formData: FormData | Record<string, any>) => store.createContact(formData),
    updateContact: (id: string | number, formData: FormData | Record<string, any>) =>
      store.updateContact(id, formData),
    deleteContact: (id: string | number) => store.deleteContact(id),
    prepareFormData: () => store.prepareFormData(),
    loadFormFromContact: (contact: any) => store.loadFormFromContact(contact),
    resetForm: () => store.resetForm(),
    updateFilters: (filters: Partial<any>) => store.updateFilters(filters),
    clearFilters: () => store.clearFilters(),
  };
};


