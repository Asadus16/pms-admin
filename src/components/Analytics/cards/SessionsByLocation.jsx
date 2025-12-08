import { useState } from 'react';
import { BlockStack, Text, InlineStack } from '@shopify/polaris';
import ChartHeading from '../ChartHeading';

const SessionsByLocation = () => {
    const [hoveredIndex, setHoveredIndex] = useState(null);

    const locations = [
        { label: 'India · Karnataka · Bengaluru', value: 70, compare: 121, change: '21%', changeType: 'positive' },
        { label: 'Germany · Saxony · Falkenstein', value: 49, compare: 1, change: '80%', changeType: 'positive' },
        { label: 'India · Maharashtra · Mumbai', value: 18, compare: 23, change: '7%', changeType: 'positive' },
        { label: 'India · Telangana · Hyderabad', value: 15, compare: 28, change: '56%', changeType: 'positive' },
        { label: 'India · None · None', value: 14, compare: 22, change: null, changeType: 'neutral' },
    ];

    const maxValue = Math.max(...locations.map(l => Math.max(l.value, l.compare)));

    return (
        <BlockStack gap="300">
            <ChartHeading title="Sessions by location" />
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

