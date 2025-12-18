'use client';

import { useState } from 'react';
import { BlockStack, Text } from '@shopify/polaris';
import ChartHeading from '../ChartHeading';

const SessionsBySocialReferrer = () => {
    const [hoveredIndex, setHoveredIndex] = useState(null);

    const referrers = [
        { label: 'Direct', value: 85, compare: 70, change: '21%', changeType: 'positive', barWidth: 60 },
        { label: 'Partner Broker', value: 52, compare: 45, change: '16%', changeType: 'positive', barWidth: 37 },
        { label: 'Owner Referral', value: 28, compare: 22, change: '27%', changeType: 'positive', barWidth: 20 },
        { label: 'Repeat Client', value: 18, compare: 12, change: '50%', changeType: 'positive', barWidth: 13 },
    ];

    return (
        <BlockStack gap="300">
            <ChartHeading title="Leads by Referral Type" />
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
            </div>
        </BlockStack>
    );
};

export default SessionsBySocialReferrer;

