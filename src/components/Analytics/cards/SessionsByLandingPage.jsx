import { BlockStack, Text, InlineStack } from '@shopify/polaris';
import ChartHeading from '../ChartHeading';

const SessionsByLandingPage = () => {
    const pages = [
        { label: 'Project A · DHA Phase 8', value: '120', change: '45%', changeType: 'positive' },
        { label: 'Project B · Bahria Town', value: '95', change: '32%', changeType: 'positive' },
        { label: 'Villa X · Emirates Hills', value: '70', change: '18%', changeType: 'positive' },
        { label: 'Apartment · Downtown Dubai', value: '52', change: '24%', changeType: 'positive' },
        { label: 'Tower Y · Business Bay', value: '38', change: null, changeType: 'neutral' },
        { label: 'Villa Z · Palm Jumeirah', value: '28', change: '56%', changeType: 'positive' },
        { label: 'Penthouse · Marina', value: '15', change: '12%', changeType: 'positive' },
    ];

    return (
        <BlockStack gap="300">
            <ChartHeading title="Top Viewed Properties / Projects" />
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

