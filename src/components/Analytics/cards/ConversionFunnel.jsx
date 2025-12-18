'use client';

import { useState } from 'react';
import { BlockStack, Text, InlineStack } from '@shopify/polaris';
import ChartHeading from '../ChartHeading';

const ConversionFunnel = () => {
    const [hoveredIndex, setHoveredIndex] = useState(null);

    const stages = [
        { label: 'Leads Created', value: '100%', count: '143', change: '23%', changeType: 'positive' },
        { label: 'Contacted', value: '75%', count: '107', change: '18%', changeType: 'positive' },
        { label: 'Qualified', value: '60%', count: '86', change: '15%', changeType: 'positive' },
        { label: 'Viewing Sched.', value: '45%', count: '64', change: '12%', changeType: 'positive' },
        { label: 'Offers Made', value: '32%', count: '46', change: '10%', changeType: 'positive' },
        { label: 'Closed Won', value: '28%', count: '40', change: '8%', changeType: 'positive' },
    ];

    return (
        <BlockStack gap="200">
            <ChartHeading title="Lead Funnel" />
            <InlineStack gap="200" blockAlign="baseline">
                <Text variant="headingLg" as="p" fontWeight="semibold">28%</Text>
                <Text variant="bodySm" as="span" tone="success">↗ 8%</Text>
            </InlineStack>

            {/* Stats row with dividers */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(6, 1fr)',
                borderTop: '1px solid #e3e3e3',
            }}>
                {stages.map((stage, index) => (
                    <div
                        key={index}
                        style={{
                            padding: '8px 4px',
                            borderRight: index < 5 ? '1px solid #e3e3e3' : 'none',
                            opacity: hoveredIndex !== null && hoveredIndex !== index ? 0.4 : 1,
                            transition: 'opacity 0.2s ease',
                            cursor: 'pointer'
                        }}
                        onMouseEnter={() => setHoveredIndex(index)}
                        onMouseLeave={() => setHoveredIndex(null)}
                    >
                        <BlockStack gap="050">
                            <Text variant="bodySm" as="p" fontWeight="medium">{stage.label}</Text>
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

            {/* Funnel visualization - aligned with 6 columns */}
            <div style={{ position: 'relative', height: '140px' }}>
                <svg width="100%" height="140" viewBox="0 0 600 140" preserveAspectRatio="none">
                    {/* First bar - Leads Created */}
                    <g
                        style={{
                            opacity: hoveredIndex !== null && hoveredIndex !== 0 ? 0.4 : 1,
                            transition: 'opacity 0.2s ease',
                            cursor: 'pointer'
                        }}
                        onMouseEnter={() => setHoveredIndex(0)}
                        onMouseLeave={() => setHoveredIndex(null)}
                    >
                        <rect x="10" y="0" width="75" height="140" fill="#2563eb" />
                        <line x1="10" y1="28" x2="85" y2="28" stroke="#1d4ed8" strokeWidth="2" />
                        <line x1="10" y1="56" x2="85" y2="56" stroke="#1d4ed8" strokeWidth="2" />
                        <polygon points="85,0 110,35 110,140 85,140" fill="#60a5fa" />
                    </g>

                    {/* Second bar - Contacted */}
                    <g
                        style={{
                            opacity: hoveredIndex !== null && hoveredIndex !== 1 ? 0.4 : 1,
                            transition: 'opacity 0.2s ease',
                            cursor: 'pointer'
                        }}
                        onMouseEnter={() => setHoveredIndex(1)}
                        onMouseLeave={() => setHoveredIndex(null)}
                    >
                        <rect x="110" y="35" width="75" height="105" fill="#2563eb" />
                        <polygon points="185,35 210,56 210,140 185,140" fill="#60a5fa" />
                    </g>

                    {/* Third bar - Qualified */}
                    <g
                        style={{
                            opacity: hoveredIndex !== null && hoveredIndex !== 2 ? 0.4 : 1,
                            transition: 'opacity 0.2s ease',
                            cursor: 'pointer'
                        }}
                        onMouseEnter={() => setHoveredIndex(2)}
                        onMouseLeave={() => setHoveredIndex(null)}
                    >
                        <rect x="210" y="56" width="75" height="84" fill="#2563eb" />
                        <polygon points="285,56 310,77 310,140 285,140" fill="#60a5fa" />
                    </g>

                    {/* Fourth bar - Viewing Scheduled */}
                    <g
                        style={{
                            opacity: hoveredIndex !== null && hoveredIndex !== 3 ? 0.4 : 1,
                            transition: 'opacity 0.2s ease',
                            cursor: 'pointer'
                        }}
                        onMouseEnter={() => setHoveredIndex(3)}
                        onMouseLeave={() => setHoveredIndex(null)}
                    >
                        <rect x="310" y="77" width="75" height="63" fill="#2563eb" />
                        <polygon points="385,77 410,98 410,140 385,140" fill="#60a5fa" />
                    </g>

                    {/* Fifth bar - Offers Made */}
                    <g
                        style={{
                            opacity: hoveredIndex !== null && hoveredIndex !== 4 ? 0.4 : 1,
                            transition: 'opacity 0.2s ease',
                            cursor: 'pointer'
                        }}
                        onMouseEnter={() => setHoveredIndex(4)}
                        onMouseLeave={() => setHoveredIndex(null)}
                    >
                        <rect x="410" y="98" width="75" height="42" fill="#2563eb" />
                        <polygon points="485,98 510,112 510,140 485,140" fill="#60a5fa" />
                    </g>

                    {/* Sixth bar - Closed Won */}
                    <g
                        style={{
                            opacity: hoveredIndex !== null && hoveredIndex !== 5 ? 0.4 : 1,
                            transition: 'opacity 0.2s ease',
                            cursor: 'pointer'
                        }}
                        onMouseEnter={() => setHoveredIndex(5)}
                        onMouseLeave={() => setHoveredIndex(null)}
                    >
                        <rect x="510" y="112" width="75" height="28" fill="#2563eb" />
                        <polygon points="585,112 590,140 585,140" fill="#60a5fa" />
                    </g>
                </svg>
            </div>
        </BlockStack>
    );
};

export default ConversionFunnel;

