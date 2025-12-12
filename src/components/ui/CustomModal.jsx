import { Modal } from '@shopify/polaris';
'use client';

import { useRef, useEffect } from 'react';
import './ui.css';

/**
 * CustomModal - Wrapper around Polaris Modal with backdrop fix and consistent sizing
 */
export const CustomModal = ({
  children,
  size = 'medium',
  className = '',
  onClose,
  ...props
}) => {
  const modalContentRef = useRef(null);
  const clickStartedInsideModal = useRef(false);

  useEffect(() => {
    const handleMouseDown = (e) => {
      if (modalContentRef.current?.contains(e.target)) {
        clickStartedInsideModal.current = true;
      } else {
        clickStartedInsideModal.current = false;
      }
    };

    const handleMouseUp = (e) => {
      if (!clickStartedInsideModal.current && !modalContentRef.current?.contains(e.target)) {
        if (onClose) {
          onClose();
        }
      }
      clickStartedInsideModal.current = false;
    };

    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [onClose]);

  const sizeClass = size !== 'medium' ? `custom-modal--${size}` : '';

  return (
    <Modal
      className={`custom-modal ${sizeClass} ${className}`}
      onClose={onClose}
      {...props}
    >
      <div ref={modalContentRef}>
        {children}
      </div>
    </Modal>
  );
};

export default CustomModal;

