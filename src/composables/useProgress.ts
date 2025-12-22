/**
 * Progress Bar Composable
 * Manages global progress bar state for API calls
 */

export const useProgress = () => {
  const isLoading = useState<boolean>('progress.isLoading', () => false)
  const progress = useState<number>('progress.percentage', () => 0)

  /**
   * Start progress bar
   */
  const startProgress = () => {
    if (!process.client) return
    
    isLoading.value = true
    progress.value = 0
    
    // Simulate progress for better UX
    const interval = setInterval(() => {
      if (progress.value < 90) {
        progress.value += Math.random() * 15
      }
    }, 100)
    
    // Store interval ID to clear later
    ;(window as any).__progressInterval = interval
  }

  /**
   * Finish progress bar
   */
  const finishProgress = () => {
    progress.value = 100
    if (process.client && (window as any).__progressInterval) {
      clearInterval((window as any).__progressInterval)
      delete (window as any).__progressInterval
    }
    
    // Hide after animation
    setTimeout(() => {
      isLoading.value = false
      progress.value = 0
    }, 300)
  }

  /**
   * Set progress percentage manually
   */
  const setProgress = (percentage: number) => {
    progress.value = Math.min(100, Math.max(0, percentage))
  }

  return {
    isLoading: readonly(isLoading),
    progress: readonly(progress),
    startProgress,
    finishProgress,
    setProgress,
  }
}

