'use client';

import { useEffect, useState } from 'react';
import { useAppSelector } from '@/store';
import { selectIsLoading, selectProgress } from '@/store/slices/loadingSlice';
import './GlobalProgressBar.css';

/**
 * GlobalProgressBar Component
 * Displays a progress bar at the top of the page for API calls and loading states
 */
export default function GlobalProgressBar() {
  const isLoading = useAppSelector(selectIsLoading);
  const progress = useAppSelector(selectProgress);
  const [showProgress, setShowProgress] = useState(false);
  const [displayProgress, setDisplayProgress] = useState(0);

  useEffect(() => {
    if (isLoading) {
      setShowProgress(true);
    } else {
      // Hide after a delay to allow completion animation
      const timer = setTimeout(() => {
        setShowProgress(false);
        setDisplayProgress(0);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  useEffect(() => {
    if (isLoading) {
      // Smooth progress animation - ensure minimum 2% width so it's visible
      setDisplayProgress(Math.max(progress, 2));
    }
  }, [progress, isLoading]);

  if (!showProgress) {
    return null;
  }

  return (
    <div className="global-progress-bar-container">
      <div 
        className="global-progress-bar" 
        style={{ 
          width: `${Math.max(displayProgress, 2)}%`,
          transition: 'width 0.3s ease-out'
        }}
      />
    </div>
  );
}

