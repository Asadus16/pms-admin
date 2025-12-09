import { Page, BlockStack } from '@shopify/polaris';
import './ui.css';

/**
 * PageLayout - Consistent page layout wrapper
 */
export const PageLayout = ({ 
  title,
  subtitle,
  primaryAction,
  secondaryActions,
  children,
  fullWidth = false,
  className = '',
  ...props 
}) => {
  return (
    <Page
      title={title}
      subtitle={subtitle}
      primaryAction={primaryAction}
      secondaryActions={secondaryActions}
      className={`page-layout ${fullWidth ? 'page-layout--full-width' : ''} ${className}`}
      {...props}
    >
      <BlockStack gap="400">
        {children}
      </BlockStack>
    </Page>
  );
};

export default PageLayout;

