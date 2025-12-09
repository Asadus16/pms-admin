import { Checkbox } from '@shopify/polaris';
import './ui.css';

/**
 * CustomCheckbox - Wrapper around Polaris Checkbox with custom styling
 */
export const CustomCheckbox = ({ 
  label,
  checked,
  onChange,
  disabled = false,
  className = '',
  ...props 
}) => {
  return (
    <Checkbox
      label={label}
      checked={checked}
      onChange={onChange}
      disabled={disabled}
      className={`custom-checkbox ${className}`}
      {...props}
    />
  );
};

export default CustomCheckbox;

