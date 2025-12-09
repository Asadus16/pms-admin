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
  ...props 
}) => {
  return (
    <TextField
      label={label}
      labelHidden={labelHidden}
      helpText={helpText}
      error={error}
      className={`custom-text-field ${className}`}
      {...props}
    />
  );
};

export default CustomTextField;

