'use client';

import { useState } from 'react';
import { BlockStack, Text } from '@shopify/polaris';
import ChartHeading from '../ChartHeading';

const SessionsBySocialReferrer = () => {
    const [hoveredIndex, setHoveredIndex] = useState(null);

    const referrers = [
        { label: 'instagram', value: 161, compare: 249, change: '34%', changeType: 'positive', barWidth: 65 },
        { label: 'facebook', value: 21, compare: 14, change: '200%', changeType: 'positive', barWidth: 8 },
    ];

    return (
        <BlockStack gap="300">
            <ChartHeading title="Sessions by social referrer" />
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
                                <Text variant="bodySm" as="span" tone="success">↗ {referrer.change}</Text>
                            </div>

                            {/* Compare bar */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <div style={{
                                    width: `${(referrer.compare / 249) * 100}%`,
                                    height: '48px',
                                    background: '#9bcdea',
                                    borderRadius: '3px',
                                }} />
                                <Text variant="bodySm" as="span" tone="subdued">{referrer.compare}</Text>
                            </div>
                        </BlockStack>
                    </div>
                ))}
            </BlockStack>
        </BlockStack>
    );
};

export default SessionsBySocialReferrer;

