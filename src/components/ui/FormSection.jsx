import { Card, BlockStack, Text } from '@shopify/polaris';
import './ui.css';

/**
 * FormSection - Reusable form section with title and content
 */
export const FormSection = ({
  title,
  description,
  children,
  collapsible = false,
  defaultCollapsed = false,
  className = '',
  ...props
}) => {
  return (
    <Card className={`form-section ${className}`} {...props}>
      <BlockStack gap="300">
        {(title || description) && (
          <BlockStack gap="100">
            {title && (
              typeof title === 'string' ? (
                <Text variant="headingMd" as="h3" fontWeight="semibold">
                  {title}
                </Text>
              ) : (
                title
              )
            )}
            {description && (
              <Text variant="bodySm" as="p" tone="subdued">
                {description}
              </Text>
            )}
          </BlockStack>
        )}
        <div className="form-section__content">
          {children}
        </div>
      </BlockStack>
    </Card>
  );
};

export default FormSection;

