import { InlineStack, BlockStack, Text, ButtonGroup } from '@shopify/polaris';
import './ui.css';

/**
 * ActionHeader - Page header with title and action buttons
 */
export const ActionHeader = ({ 
  title,
  subtitle,
  primaryAction,
  secondaryActions = [],
  breadcrumbs,
  className = '',
  ...props 
}) => {
  return (
    <div className={`action-header ${className}`} {...props}>
      <InlineStack align="space-between" blockAlign="center">
        <BlockStack gap="050">
          {breadcrumbs && (
            <div className="action-header__breadcrumbs">
              {breadcrumbs}
            </div>
          )}
          {title && (
            <Text variant="headingLg" as="h1" fontWeight="semibold">
              {title}
            </Text>
          )}
          {subtitle && (
            <Text variant="bodySm" as="p" tone="subdued">
              {subtitle}
            </Text>
          )}
        </BlockStack>
        {(primaryAction || secondaryActions.length > 0) && (
          <ButtonGroup>
            {secondaryActions.map((action, index) => (
              <Button key={index} {...action}>
                {action.content}
              </Button>
            ))}
            {primaryAction && (
              <Button variant="primary" {...primaryAction}>
                {primaryAction.content}
              </Button>
            )}
          </ButtonGroup>
        )}
      </InlineStack>
    </div>
  );
};

export default ActionHeader;

