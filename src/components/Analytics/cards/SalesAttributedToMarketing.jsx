import { BlockStack, Text, InlineStack } from '@shopify/polaris';
import ChartHeading from '../ChartHeading';

const SalesAttributedToMarketing = () => {
    const sources = [
        { label: 'WhatsApp campaigns', value: 42, percent: 90 },
        { label: 'Google Ads', value: 28, percent: 60 },
        { label: 'Instagram', value: 18, percent: 39 },
        { label: 'Website inbound', value: 12, percent: 26 },
    ];

    return (
        <BlockStack gap="300">
            <ChartHeading title="Conversions Attributed to Source" />
            <div style={{ maxHeight: '320px', overflowY: 'auto', paddingRight: '4px' }}>
            <BlockStack gap="200">
                {sources.map((source, index) => (
                    <div key={index}>
                        <Text variant="bodySm" as="p">{source.label}</Text>
                        <div style={{ position: 'relative', marginTop: '4px', marginBottom: '8px' }}>
                            <div style={{
                                width: `${source.percent}%`,
                                height: '32px',
                                background: '#12acf0',
                                borderRadius: '4px',
                            }} />
                            <div style={{ position: 'absolute', right: '0', top: '50%', transform: 'translateY(-50%)' }}>
                                <InlineStack gap="100" blockAlign="center">
                                    <Text variant="bodySm" as="span" fontWeight="medium">{source.value}</Text>
                                </InlineStack>
                            </div>
                        </div>
                    </div>
                ))}

                {/* Y-axis indicator */}
                <div style={{ display: 'flex', alignItems: 'flex-end', height: '20px' }}>
                    <div style={{ width: '2px', height: '100%', background: '#12acf0', marginRight: '8px' }} />
                    <Text variant="bodySm" as="span" tone="subdued">0 conversions</Text>
                </div>
            </BlockStack>
            </div>
        </BlockStack>
    );
};

export default SalesAttributedToMarketing;

