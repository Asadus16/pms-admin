/**
 * Property Manager Transaction Composable
 * 
 * Provides utilities and convenience methods for transaction management.
 * All state management is handled by the Pinia store (useTransactionStore).
 * 
 * @module composables/usePropertyManagerTransaction
 * 
 * @example
 * ```typescript
 * // Use store directly for state management
 * const store = useTransactionStore();
 * await store.fetchTransactions();
 * 
 * // Use composable for utilities
 * const { formatFileSize, validateFile } = usePropertyManagerTransaction();
 * const size = formatFileSize(1024); // "1 KB"
 * ```
 */

import {
  useTransactionStore,
  type UploadedFile,
} from '~/stores/transaction.store';

// Types should be imported directly from stores:
// import type { TransactionForm, UploadedFile, Transaction } from '~/stores/transaction.store';

// ============================================================================
// Constants
// ============================================================================

/**
 * Maximum file size in bytes (5MB)
 */
const MAX_FILE_SIZE = 5 * 1024 * 1024;

/**
 * File size units for formatting
 */
const FILE_SIZE_UNITS = ['Bytes', 'KB', 'MB'] as const;

/**
 * Base for file size calculation (1024 bytes = 1 KB)
 */
const FILE_SIZE_BASE = 1024;

// ============================================================================
// Composable
// ============================================================================

export const usePropertyManagerTransaction = () => {
  const store = useTransactionStore();

  // ==========================================================================
  // Utilities
  // ==========================================================================

  /**
   * Format file size in bytes to human-readable string
   * 
   * @param bytes - File size in bytes
   * @returns Formatted file size string (e.g., "1.5 MB")
   * 
   * @example
   * ```typescript
   * formatFileSize(1024) // "1 KB"
   * formatFileSize(5242880) // "5 MB"
   * ```
   */
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';

    const unitIndex = Math.floor(Math.log(bytes) / Math.log(FILE_SIZE_BASE));
    const size = Math.round(
      (bytes / Math.pow(FILE_SIZE_BASE, unitIndex)) * 100
    ) / 100;

    return `${size} ${FILE_SIZE_UNITS[unitIndex]}`;
  };

  /**
   * Validate file before upload
   * 
   * @param file - File object to validate
   * @returns True if file is valid, false otherwise
   * 
   * @example
   * ```typescript
   * if (validateFile(file)) {
   *   // Proceed with upload
   * }
   * ```
   */
  const validateFile = (file: File): boolean => {
    if (file.size > MAX_FILE_SIZE) {
      alert(`${file.name} is too large. Maximum size is 5MB.`);
      return false;
    }
    return true;
  };

  /**
   * Create file upload handler with store integration
   * 
   * @returns Object with file handling methods
   * 
   * @example
   * ```typescript
   * const { handleBillFile, handlePaymentProofFile } = createFileUploadHandler();
   * handleBillFile(selectedFile);
   * ```
   */
  const createFileUploadHandler = () => {
    /**
     * Handle bill file upload
     * 
     * @param file - File to upload
     * @returns Uploaded file object or null if validation fails
     */
    const handleBillFile = (file: File): UploadedFile | null => {
      if (!validateFile(file)) return null;

      const uploadedFile: UploadedFile = {
        name: file.name,
        size: formatFileSize(file.size),
        file: file,
      };

      store.setUploadedBill(uploadedFile);
      return uploadedFile;
    };

    /**
     * Handle payment proof file upload
     * 
     * @param file - File to upload
     * @returns Uploaded file object or null if validation fails
     */
    const handlePaymentProofFile = (file: File): UploadedFile | null => {
      if (!validateFile(file)) return null;

      const uploadedFile: UploadedFile = {
        name: file.name,
        size: formatFileSize(file.size),
        file: file,
      };

      store.setUploadedPaymentProof(uploadedFile);
      return uploadedFile;
    };

    return {
      handleBillFile,
      handlePaymentProofFile,
      formatFileSize,
      validateFile,
    };
  };

  /**
   * Watch transaction type changes and reset dependent fields
   * 
   * @param callback - Optional callback to execute after reset
   * @returns Watch stop function
   * 
   * @example
   * ```typescript
   * watchTransactionType(() => {
   *   console.log('Transaction type changed');
   * });
   * ```
   */
  const watchTransactionType = (callback?: () => void) => {
    return watch(
      () => store.form.transactionType,
      () => {
        store.resetTransactionTypeDependentFields();
        callback?.();
      }
    );
  };

  // ==========================================================================
  // Return
  // ==========================================================================

  return {
    // Pinia Store (use this for all state management)
    store,

    // Utilities
    formatFileSize,
    validateFile,
    createFileUploadHandler,
    watchTransactionType,

    // Convenience methods that delegate to store
    // (These are optional - you can use store methods directly)
    fetchTransactions: (params?: Record<string, any>) =>
      store.fetchTransactions(params),
    fetchTransactionById: (id: string | number) =>
      store.fetchTransactionById(id),
    saveTransaction: (id?: string | number) => store.saveTransaction(id),
    deleteTransaction: (id: string | number) => store.deleteTransaction(id),
    fetchProperties: () => store.fetchProperties(),
  };
};
