import { Select } from '@shopify/polaris';
import './ui.css';

/**
 * CustomSelect - Wrapper around Polaris Select with consistent styles
 */
export const CustomSelect = ({ 
  label,
  labelHidden = false,
  helpText,
  error,
  className = '',
  ...props 
}) => {
  return (
    <Select
      label={label}
      labelHidden={labelHidden}
      helpText={helpText}
      error={error}
      className={`custom-select ${className}`}
      {...props}
    />
  );
};

export default CustomSelect;

