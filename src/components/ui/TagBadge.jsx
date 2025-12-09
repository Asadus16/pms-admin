import { Badge } from '@shopify/polaris';
import './ui.css';

/**
 * TagBadge - Reusable tag/badge component with consistent styling
 */
export const TagBadge = ({ 
  children, 
  tone = 'info',
  size = 'medium',
  removable = false,
  onRemove,
  className = '',
  ...props 
}) => {
  const sizeClass = size !== 'medium' ? `tag-badge--${size}` : '';
  
  return (
    <Badge
      tone={tone}
      onRemove={removable ? onRemove : undefined}
      className={`tag-badge ${sizeClass} ${className}`}
      {...props}
    >
      {children}
    </Badge>
  );
};

export default TagBadge;

