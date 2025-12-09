import { Button } from '@shopify/polaris';
import './ui.css';

/**
 * CustomButton - Wrapper around Polaris Button with consistent styling
 */
export const CustomButton = ({ 
  children, 
  variant = 'primary', 
  size = 'medium',
  fullWidth = false,
  className = '',
  ...props 
}) => {
  const sizeClass = size !== 'medium' ? `custom-button--${size}` : '';
  const widthClass = fullWidth ? 'custom-button--full-width' : '';
  
  return (
    <Button
      variant={variant}
      className={`custom-button ${sizeClass} ${widthClass} ${className}`}
      {...props}
    >
      {children}
    </Button>
  );
};

export default CustomButton;

