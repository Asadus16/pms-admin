import { BlockStack, Text, InlineStack } from '@shopify/polaris';
import ChartHeading from '../ChartHeading';

const TotalSalesBySocialReferrer = () => {
    return (
        <BlockStack gap="300">
            <ChartHeading title="Total sales by social referrer" />
            <BlockStack gap="200">
                <Text variant="bodySm" as="p">instagram</Text>
                <div style={{ position: 'relative' }}>
                    <div style={{
                        width: '80%',
                        height: '140px',
                        background: '#12acf0',
                        borderRadius: '4px',
                    }} />
                    <div style={{ position: 'absolute', right: '0', top: '50%', transform: 'translateY(-50%)' }}>
                        <InlineStack gap="100" blockAlign="center">
                            <Text variant="bodySm" as="span" fontWeight="medium">₹699.00</Text>
                            <Text variant="bodySm" as="span" tone="subdued">—</Text>
                        </InlineStack>
                    </div>
                </div>

                {/* Y-axis indicator */}
                <div style={{ display: 'flex', alignItems: 'flex-end', height: '20px' }}>
                    <div style={{ width: '2px', height: '100%', background: '#12acf0', marginRight: '8px' }} />
                    <Text variant="bodySm" as="span" tone="subdued">₹0.00</Text>
                </div>
            </BlockStack>
        </BlockStack>
    );
};

export default TotalSalesBySocialReferrer;

