import { BlockStack, InlineStack, Text } from '@shopify/polaris';
import ChartHeading from '../ChartHeading';

const SalesBreakdown = () => {
    const items = [
        { label: 'Sales Transactions Value', value: 'AED 4,200.00', change: '45%', type: 'positive', hasBg: false },
        { label: 'Long-Term Rent Collected', value: 'AED 850.00', change: '12%', type: 'positive', hasBg: true },
        { label: 'Short-Term Booking Revenue', value: 'AED 320.00', change: '8%', type: 'positive', hasBg: false },
        { label: 'Agency Fees Earned', value: 'AED 580.00', change: '22%', type: 'positive', hasBg: true },
        { label: 'Owner Payouts (last period)', value: '-AED 450.00', change: null, type: 'neutral', hasBg: false },
        { label: 'Expenses / Maintenance Costs', value: '-AED 290.00', change: null, type: 'neutral', hasBg: true },
    ];

    return (
        <BlockStack gap="0">
            <div style={{ marginBottom: '12px', paddingLeft: '4px' }}>
                <ChartHeading title="Total Revenue Breakdown" variant="bodySm" />
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
                marginTop: '12px'
            }}>
                <InlineStack align="space-between">
                    <Text variant="bodySm" as="span">
                        <span style={{ color: '#005bd3', cursor: 'pointer', fontWeight: 500 }}>Net Income</span>
                    </Text>
                    <InlineStack gap="200">
                        <Text variant="bodySm" as="span" fontWeight="semibold">AED 5,210.00</Text>
                        <span style={{ color: '#369962', fontSize: '12px' }}>
                            ↗ 35%
                        </span>
                    </InlineStack>
                </InlineStack>
            </div>
        </BlockStack>
    );
};

export default SalesBreakdown;

