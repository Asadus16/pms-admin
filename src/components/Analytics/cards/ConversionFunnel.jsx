'use client';

import { useState } from 'react';
import { BlockStack, Text, InlineStack } from '@shopify/polaris';
import ChartHeading from '../ChartHeading';

const ConversionFunnel = () => {
    const [hoveredIndex, setHoveredIndex] = useState(null);

    const stages = [
        { label: 'Sessions', value: '100%', count: '143', change: '23%', changeType: 'critical', icon: true },
        { label: 'Added to cart', value: '4.9%', count: '7', change: '67%', changeType: 'critical' },
        { label: 'Reached che...', value: '0%', count: '0', change: '0%', changeType: 'critical' },
        { label: 'Complet...', value: '0%', count: '0', change: '0%', changeType: 'critical' },
    ];

    return (
        <BlockStack gap="200">
            <ChartHeading title="Conversion rate breakdown" />
            <InlineStack gap="200" blockAlign="baseline">
                <Text variant="headingLg" as="p" fontWeight="semibold">0%</Text>
                <Text variant="bodySm" as="span" tone="subdued">—</Text>
            </InlineStack>

            {/* Stats row with dividers */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                borderTop: '1px solid #e3e3e3',
            }}>
                {stages.map((stage, index) => (
                    <div
                        key={index}
                        style={{
                            padding: '8px 4px',
                            borderRight: index < 3 ? '1px solid #e3e3e3' : 'none',
                            opacity: hoveredIndex !== null && hoveredIndex !== index ? 0.4 : 1,
                            transition: 'opacity 0.2s ease',
                            cursor: 'pointer'
                        }}
                        onMouseEnter={() => setHoveredIndex(index)}
                        onMouseLeave={() => setHoveredIndex(null)}
                    >
                        <BlockStack gap="050">
                            <InlineStack gap="100" blockAlign="center">
                                {stage.icon && (
                                    <span style={{ fontSize: '10px', color: '#6b7280' }}>⚡</span>
                                )}
                                <Text variant="bodySm" as="p" fontWeight="medium">{stage.label}</Text>
                            </InlineStack>
                            <Text variant="headingSm" as="p" fontWeight="semibold">{stage.value}</Text>
                            <Text variant="bodySm" as="p">{stage.count}</Text>
                            <Text
                                variant="bodySm"
                                as="p"
                                tone={stage.changeType === 'positive' ? 'success' : 'critical'}
                            >
                                ↘ {stage.change}
                            </Text>
                        </BlockStack>
                    </div>
                ))}
            </div>

            {/* Funnel visualization - aligned with 4 columns */}
            <div style={{ position: 'relative', height: '140px' }}>
                <svg width="100%" height="140" viewBox="0 0 400 140" preserveAspectRatio="xMidYMid meet">
                    {/* First bar - Sessions (0-100) */}
                    <g
                        style={{
                            opacity: hoveredIndex !== null && hoveredIndex !== 0 ? 0.4 : 1,
                            transition: 'opacity 0.2s ease',
                            cursor: 'pointer'
                        }}
                        onMouseEnter={() => setHoveredIndex(0)}
                        onMouseLeave={() => setHoveredIndex(null)}
                    >
                        <rect x="5" y="0" width="70" height="140" fill="#2563eb" />
                        <line x1="5" y1="28" x2="75" y2="28" stroke="#1d4ed8" strokeWidth="2" />
                        <line x1="5" y1="56" x2="75" y2="56" stroke="#1d4ed8" strokeWidth="2" />
                        <polygon points="75,0 100,140 75,140" fill="#60a5fa" />
                    </g>

                    {/* Second bar - Added to cart (100-200) */}
                    <g
                        style={{
                            opacity: hoveredIndex !== null && hoveredIndex !== 1 ? 0.4 : 1,
                            transition: 'opacity 0.2s ease',
                            cursor: 'pointer'
                        }}
                        onMouseEnter={() => setHoveredIndex(1)}
                        onMouseLeave={() => setHoveredIndex(null)}
                    >
                        <rect x="105" y="70" width="70" height="70" fill="#2563eb" />
                        <polygon points="175,70 200,140 175,140" fill="#60a5fa" />
                    </g>

                    {/* Third bar - Reached checkout (200-300) */}
                    <g
                        style={{
                            opacity: hoveredIndex !== null && hoveredIndex !== 2 ? 0.4 : 1,
                            transition: 'opacity 0.2s ease',
                            cursor: 'pointer'
                        }}
                        onMouseEnter={() => setHoveredIndex(2)}
                        onMouseLeave={() => setHoveredIndex(null)}
                    >
                        <rect x="205" y="120" width="70" height="20" fill="#2563eb" />
                        <polygon points="275,120 295,140 275,140" fill="#60a5fa" />
                    </g>

                    {/* Fourth bar - Completed (300-400) */}
                    <g
                        style={{
                            opacity: hoveredIndex !== null && hoveredIndex !== 3 ? 0.4 : 1,
                            transition: 'opacity 0.2s ease',
                            cursor: 'pointer'
                        }}
                        onMouseEnter={() => setHoveredIndex(3)}
                        onMouseLeave={() => setHoveredIndex(null)}
                    >
                        <rect x="305" y="120" width="70" height="20" fill="#2563eb" />
                        <polygon points="375,120 395,140 375,140" fill="#60a5fa" />
                    </g>
                </svg>
            </div>
        </BlockStack>
    );
};

export default ConversionFunnel;

