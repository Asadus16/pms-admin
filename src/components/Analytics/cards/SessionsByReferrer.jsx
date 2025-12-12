'use client';

import { useState } from 'react';
import { BlockStack, Text, InlineStack } from '@shopify/polaris';
import ChartHeading from '../ChartHeading';

const SessionsByReferrer = () => {
    const [hoveredIndex, setHoveredIndex] = useState(null);

    const referrers = [
        { label: 'Social · instagram · Bengaluru', value: 53, compare: 87, change: '15%', changeType: 'positive' },
        { label: 'Direct · None · Falkenstein', value: 49, compare: 1, change: '125%', changeType: 'positive' },
        { label: 'Social · instagram · Mumbai', value: 18, compare: 19, change: '13%', changeType: 'positive' },
        { label: 'Direct · None · Bengaluru', value: 17, compare: 28, change: '100%', changeType: 'positive' },
        { label: 'Social · instagram · None', value: 16, compare: 19, change: null, changeType: 'neutral' },
    ];

    const maxValue = Math.max(...referrers.map(r => Math.max(r.value, r.compare)));

    return (
        <BlockStack gap="300">
            <ChartHeading title="Sessions by referrer" />
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
                        <BlockStack gap="50">
                            <Text variant="bodySm" as="span">{referrer.label}</Text>

                            {/* Main bar with value */}
                            <InlineStack gap="100" blockAlign="center">
                                <div style={{
                                    height: '10px',
                                    width: `${(referrer.value / maxValue) * 100}%`,
                                    maxWidth: '60%',
                                    background: '#12acf0',
                                    borderRadius: '2px',
                                }} />
                                <Text variant="bodySm" as="span" fontWeight="medium">{referrer.value}</Text>
                                {referrer.change && (
                                    <Text variant="bodySm" as="span" tone="success">↗ {referrer.change}</Text>
                                )}
                            </InlineStack>

                            {/* Compare bar with value */}
                            <InlineStack gap="100" blockAlign="center">
                                <div style={{
                                    height: '10px',
                                    width: `${(referrer.compare / maxValue) * 100}%`,
                                    maxWidth: '60%',
                                    background: '#9bcdea',
                                    borderRadius: '2px',
                                }} />
                                <Text variant="bodySm" as="span" tone="subdued">{referrer.compare}</Text>
                            </InlineStack>
                        </BlockStack>
                    </div>
                ))}
            </BlockStack>
        </BlockStack>
    );
};

export default SessionsByReferrer;

