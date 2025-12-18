'use client';

import { useState } from 'react';
import { BlockStack, Text, InlineStack } from '@shopify/polaris';
import ChartHeading from '../ChartHeading';

const SessionsByLocation = () => {
    const [hoveredIndex, setHoveredIndex] = useState(null);

    const locations = [
        { label: 'Dubai', value: 85, compare: 70, change: '21%', changeType: 'positive' },
        { label: 'Lahore', value: 52, compare: 45, change: '16%', changeType: 'positive' },
        { label: 'Karachi', value: 38, compare: 30, change: '27%', changeType: 'positive' },
        { label: 'Riyadh', value: 28, compare: 20, change: '40%', changeType: 'positive' },
        { label: 'London', value: 15, compare: 12, change: '25%', changeType: 'positive' },
    ];

    const maxValue = Math.max(...locations.map(l => Math.max(l.value, l.compare)));

    return (
        <BlockStack gap="300">
            <ChartHeading title="Leads by Location (Buyer/Tenant Origin)" />
            <BlockStack gap="300">
                {locations.map((location, index) => (
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
                            <Text variant="bodySm" as="span">{location.label}</Text>

                            {/* Main bar with value */}
                            <InlineStack gap="100" blockAlign="center">
                                <div style={{
                                    height: '10px',
                                    width: `${(location.value / maxValue) * 100}%`,
                                    maxWidth: '60%',
                                    background: '#12acf0',
                                    borderRadius: '2px',
                                }} />
                                <Text variant="bodySm" as="span" fontWeight="medium">{location.value}</Text>
                                {location.change && (
                                    <Text variant="bodySm" as="span" tone="success">↗ {location.change}</Text>
                                )}
                            </InlineStack>

                            {/* Compare bar with value */}
                            <InlineStack gap="100" blockAlign="center">
                                <div style={{
                                    height: '10px',
                                    width: `${(location.compare / maxValue) * 100}%`,
                                    maxWidth: '60%',
                                    background: '#9bcdea',
                                    borderRadius: '2px',
                                }} />
                                <Text variant="bodySm" as="span" tone="subdued">{location.compare}</Text>
                            </InlineStack>
                        </BlockStack>
                    </div>
                ))}
            </BlockStack>
        </BlockStack>
    );
};

export default SessionsByLocation;

