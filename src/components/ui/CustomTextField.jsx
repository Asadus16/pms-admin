import { TextField } from '@shopify/polaris';
import './ui.css';

/**
 * CustomTextField - Wrapper around Polaris TextField with consistent label styles
 */
export const CustomTextField = ({ 
  label,
  labelHidden = false,
  helpText,
  error,
  className = '',
  value,
  ...props 
}) => {
  // Ensure value is always a string to prevent Polaris TextField errors
  const normalizedValue = value == null ? '' : String(value);
  
  return (
    <TextField
      label={label}
      labelHidden={labelHidden}
      helpText={helpText}
      error={error}
      className={`custom-text-field ${className}`}
      value={normalizedValue}
      {...props}
    />
  );
};

export default CustomTextField;

