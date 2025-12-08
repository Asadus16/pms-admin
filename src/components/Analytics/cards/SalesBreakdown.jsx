import { BlockStack, InlineStack, Text } from '@shopify/polaris';
import ChartHeading from '../ChartHeading';

const SalesBreakdown = () => {
    const items = [
        { label: 'Gross sales', value: '₹6,093.00', change: '59%', type: 'positive', hasBg: false },
        { label: 'Discounts', value: '-₹281.71', change: '16%', type: 'positive', hasBg: true },
        { label: 'Returns', value: '₹0.00', change: '100%', type: 'positive', hasBg: false },
        { label: 'Net sales', value: '₹5,811.29', change: '1.9K%', type: 'positive', hasBg: true },
        { label: 'Shipping charges', value: '₹198.00', change: null, type: 'neutral', hasBg: false },
        { label: 'Return fees', value: '₹0.00', change: null, type: 'neutral', hasBg: true },
        { label: 'Taxes', value: '₹0.00', change: null, type: 'neutral', hasBg: false },
    ];

    return (
        <BlockStack gap="0">
            <div style={{ marginBottom: '12px', paddingLeft: '4px' }}>
                <ChartHeading title="Total sales breakdown" variant="bodySm" />
            </div>
            {items.map((item, index) => (
                <div key={index} style={{
                    padding: '10px 4px 10px 4px',
                    margin: '1px 0',
                    borderRadius: item.hasBg ? '8px' : '0',
                    background: item.hasBg ? '#f7f7f7' : 'transparent'
                }}>
                    <InlineStack align="space-between">
                        <Text variant="bodySm" as="span" tone="magic-subdued">
                            <span style={{ color: '#005bd3', cursor: 'pointer' }}>{item.label}</span>
                        </Text>
                        <InlineStack gap="200">
                            <Text variant="bodySm" as="span">{item.value}</Text>
                            {item.change ? (
                                <span style={{ color: '#369962', fontSize: '12px' }}>
                                    ↗ {item.change}
                                </span>
                            ) : (
                                <Text variant="bodySm" as="span" tone="subdued">—</Text>
                            )}
                        </InlineStack>
                    </InlineStack>
                </div>
            ))}
            <div style={{
                padding: '10px 4px 10px 4px',
                margin: '1px 0',
                borderRadius: '8px',
                background: '#f7f7f7',
                marginTop: '4px'
            }}>
                <InlineStack align="space-between">
                    <Text variant="bodySm" as="span">
                        <span style={{ color: '#005bd3', cursor: 'pointer', fontWeight: 500 }}>Total sales</span>
                    </Text>
                    <InlineStack gap="200">
                        <Text variant="bodySm" as="span" fontWeight="semibold">₹6,009.29</Text>
                        <span style={{ color: '#369962', fontSize: '12px' }}>
                            ↗ 5.1K%
                        </span>
                    </InlineStack>
                </InlineStack>
            </div>
        </BlockStack>
    );
};

export default SalesBreakdown;

