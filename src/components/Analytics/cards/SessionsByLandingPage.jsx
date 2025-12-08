import { BlockStack, Text, InlineStack } from '@shopify/polaris';
import ChartHeading from '../ChartHeading';

const SessionsByLandingPage = () => {
    const pages = [
        { label: 'Homepage · /', value: '185', change: '43%', changeType: 'positive' },
        { label: 'Product · /products/lip-stain-50-ayurvedic-herbs-infused', value: '24', change: '118%', changeType: 'positive' },
        { label: 'Product · /products/tinted-lip-oil-with-50-herbs-colour-meets-care', value: '7', change: null, changeType: 'neutral' },
        { label: 'Product · /products/clear-complexion-essence-40-herbs', value: '5', change: '67%', changeType: 'positive' },
        { label: 'Product · /products/buttercream-blush-infused-with-50-ayurvedic-herbs', value: '5', change: null, changeType: 'neutral' },
        { label: 'Collection · /collections/ayurvedic-skin-care-products', value: '4', change: '300%', changeType: 'positive' },
        { label: 'Product · /products/clear-complexion-brightening-elixir-powered-by-50-...', value: '4', change: '33%', changeType: 'critical' },
    ];

    return (
        <BlockStack gap="300">
            <ChartHeading title="Sessions by landing page" />
            <BlockStack gap="0">
                {pages.map((page, index) => (
                    <div
                        key={index}
                        style={{
                            padding: '12px 8px',
                            background: index % 2 === 1 ? '#f7f7f7' : 'transparent',
                            borderRadius: index % 2 === 1 ? '6px' : '0',
                        }}
                    >
                        <InlineStack align="space-between" blockAlign="start" wrap={false}>
                            <div style={{ flex: 1, minWidth: 0, paddingRight: '16px' }}>
                                <Text variant="bodySm" as="p" breakWord>{page.label}</Text>
                            </div>
                            <InlineStack gap="100" blockAlign="center" wrap={false}>
                                <Text variant="bodySm" as="span" fontWeight="medium">{page.value}</Text>
                                {page.change ? (
                                    <Text
                                        variant="bodySm"
                                        as="span"
                                        tone={page.changeType === 'positive' ? 'success' : 'critical'}
                                    >
                                        {page.changeType === 'positive' ? '↗' : '↘'} {page.change}
                                    </Text>
                                ) : (
                                    <Text variant="bodySm" as="span" tone="subdued">—</Text>
                                )}
                            </InlineStack>
                        </InlineStack>
                    </div>
                ))}
            </BlockStack>
        </BlockStack>
    );
};

export default SessionsByLandingPage;

