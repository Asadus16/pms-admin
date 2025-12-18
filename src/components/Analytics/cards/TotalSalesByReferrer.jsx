'use client';

import { useState } from 'react';
import { BlockStack, Text } from '@shopify/polaris';
import ChartHeading from '../ChartHeading';

const TotalSalesByReferrer = () => {
    const [hoveredIndex, setHoveredIndex] = useState(null);

    const referrers = [
        { label: 'Hashim', value: '45', compare: '38', change: '18%', barWidth: 90, compareWidth: 76 },
        { label: 'Adeel', value: '32', compare: '28', change: '14%', barWidth: 64, compareWidth: 56 },
        { label: 'Raza', value: '24', compare: '20', change: '20%', barWidth: 48, compareWidth: 40 },
        { label: 'Partner Brokers', value: '18', compare: '15', change: '20%', barWidth: 36, compareWidth: 30 },
    ];

    return (
        <BlockStack gap="300">
            <ChartHeading title="Deals Closed by Agent" />
            <div style={{ maxHeight: '320px', overflowY: 'auto', paddingRight: '4px' }}>
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
                    <Text variant="bodySm" as="span" tone="subdued">0 deals</Text>
                </div>
            </BlockStack>
            </div>
        </BlockStack>
    );
};

export default TotalSalesByReferrer;

