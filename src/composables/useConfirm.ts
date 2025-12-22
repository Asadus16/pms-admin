/**
 * Global Confirm Dialog Composable
 * Manages global confirm dialog state for confirmation dialogs
 */

export interface ConfirmOptions {
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  confirmButtonClass?: string;
  cancelButtonClass?: string;
}

export interface ConfirmState {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText: string;
  cancelText: string;
  confirmButtonClass: string;
  cancelButtonClass: string;
  resolve: ((value: boolean) => void) | null;
}

const defaultOptions: Required<Omit<ConfirmOptions, 'message'>> = {
  title: 'Confirm Action',
  confirmText: 'Confirm',
  cancelText: 'Cancel',
  confirmButtonClass: 'bg-red-600 hover:bg-red-700 text-white',
  cancelButtonClass: 'bg-gray-200 hover:bg-gray-300 text-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200',
}

export const useConfirm = () => {
  const state = useState<ConfirmState>('confirm.dialog', () => ({
    isOpen: false,
    title: defaultOptions.title,
    message: '',
    confirmText: defaultOptions.confirmText,
    cancelText: defaultOptions.cancelText,
    confirmButtonClass: defaultOptions.confirmButtonClass,
    cancelButtonClass: defaultOptions.cancelButtonClass,
    resolve: null,
  }))

  /**
   * Show confirm dialog
   * @param options - Confirm dialog options
   * @returns Promise that resolves to true if confirmed, false if cancelled
   */
  const confirm = (options: ConfirmOptions): Promise<boolean> => {
    if (!process.client) return Promise.resolve(false)

    return new Promise((resolve) => {
      state.value = {
        isOpen: true,
        title: options.title || defaultOptions.title,
        message: options.message,
        confirmText: options.confirmText || defaultOptions.confirmText,
        cancelText: options.cancelText || defaultOptions.cancelText,
        confirmButtonClass: options.confirmButtonClass || defaultOptions.confirmButtonClass,
        cancelButtonClass: options.cancelButtonClass || defaultOptions.cancelButtonClass,
        resolve,
      }
    })
  }

  /**
   * Confirm the dialog
   */
  const confirmAction = () => {
    if (state.value.resolve) {
      state.value.resolve(true)
    }
    close()
  }

  /**
   * Cancel the dialog
   */
  const cancelAction = () => {
    if (state.value.resolve) {
      state.value.resolve(false)
    }
    close()
  }

  /**
   * Close the dialog
   */
  const close = () => {
    state.value.isOpen = false
    state.value.resolve = null
  }

  return {
    state: readonly(state),
    confirm,
    confirmAction,
    cancelAction,
    close,
  }
}

