import { Card } from '@shopify/polaris';
import './ui.css';

/**
 * CustomCard - Wrapper around Polaris Card with consistent padding/shadows
 */
export const CustomCard = ({ 
  children, 
  padding = 'md',
  shadow = 'default',
  className = '',
  ...props 
}) => {
  const paddingClass = `custom-card--padding-${padding}`;
  const shadowClass = shadow !== 'default' ? `custom-card--shadow-${shadow}` : '';
  
  return (
    <Card
      className={`custom-card ${paddingClass} ${shadowClass} ${className}`}
      {...props}
    >
      {children}
    </Card>
  );
};

export default CustomCard;

