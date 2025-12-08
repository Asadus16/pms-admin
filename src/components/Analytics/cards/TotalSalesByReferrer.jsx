import { useState } from 'react';
import { BlockStack, Text } from '@shopify/polaris';
import ChartHeading from '../ChartHeading';

const TotalSalesByReferrer = () => {
    const [hoveredIndex, setHoveredIndex] = useState(null);

    const referrers = [
        { label: 'None · None', value: '₹8,432.35', compare: '₹10,940.46', change: '204%', barWidth: 75, compareWidth: 100 },
        { label: 'social · instagram', value: '₹699.00', compare: '₹0.00', change: null, barWidth: 6, compareWidth: 0 },
    ];

    return (
        <BlockStack gap="300">
            <ChartHeading title="Total sales by referrer" />
            <BlockStack gap="300">
                {referrers.map((referrer, index) => (
                    <div
                        key={index}
                        onMouseEnter={() => setHoveredIndex(index)}
                        onMouseLeave={() => setHoveredIndex(null)}
                        style={{
                            opacity: hoveredIndex !== null && hoveredIndex !== index ? 0.4 : 1,
                            transition: 'opacity 0.2s ease'
                        }}
                    >
                        <BlockStack gap="100">
                            <Text variant="bodySm" as="p">{referrer.label}</Text>

                            {/* Main bar */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <div style={{
                                    width: `${referrer.barWidth}%`,
                                    height: '48px',
                                    background: '#12acf0',
                                    borderRadius: '3px',
                                }} />
                                <Text variant="bodySm" as="span" fontWeight="medium">{referrer.value}</Text>
                                {referrer.change ? (
                                    <Text variant="bodySm" as="span" tone="success">↗ {referrer.change}</Text>
                                ) : (
                                    <Text variant="bodySm" as="span" tone="subdued">—</Text>
                                )}
                            </div>

                            {/* Compare bar */}
                            {referrer.compareWidth > 0 && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <div style={{
                                        width: `${referrer.compareWidth}%`,
                                        height: '48px',
                                        background: '#9bcdea',
                                        borderRadius: '3px',
                                    }} />
                                    <Text variant="bodySm" as="span" tone="subdued">{referrer.compare}</Text>
                                </div>
                            )}
                        </BlockStack>
                    </div>
                ))}

                {/* Y-axis line */}
                <div style={{ display: 'flex', alignItems: 'flex-end', height: '20px', marginTop: '8px' }}>
                    <div style={{ width: '2px', height: '100%', background: '#12acf0', marginRight: '8px' }} />
                    <Text variant="bodySm" as="span" tone="subdued">₹0.00</Text>
                </div>
            </BlockStack>
        </BlockStack>
    );
};

export default TotalSalesByReferrer;

