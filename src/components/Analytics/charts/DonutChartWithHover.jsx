import { useState } from 'react';
import { Text, InlineStack } from '@shopify/polaris';

const DonutChartWithHover = ({
    totalValue,
    totalChange,
    changeType = 'positive',
    size = 180,
    segments = []
}) => {
    const [hoveredSegment, setHoveredSegment] = useState(null);
    const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

    const radius = (size - 40) / 2;
    const strokeWidth = 24;
    const circumference = 2 * Math.PI * radius;

    let currentOffset = circumference * 0.25;

    const handleSegmentHover = (segment, e) => {
        setHoveredSegment(segment);
        setTooltipPosition({ x: e.clientX, y: e.clientY });
    };

    return (
        <div style={{ position: 'relative', width: size, height: size }}>
            <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
                {/* Background circle */}
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke="#e8e8e8"
                    strokeWidth={strokeWidth}
                />

                {/* Segments */}
                {segments.map((segment, index) => {
                    const segmentLength = (segment.percentage / 100) * circumference;
                    const offset = currentOffset;
                    currentOffset += segmentLength;

                    const isHovered = hoveredSegment?.label === segment.label;
                    const opacity = hoveredSegment ? (isHovered ? 1 : 0.3) : 1;

                    return (
                        <circle
                            key={index}
                            cx={size / 2}
                            cy={size / 2}
                            r={radius}
                            fill="none"
                            stroke={segment.color}
                            strokeWidth={strokeWidth}
                            strokeDasharray={`${segmentLength} ${circumference}`}
                            strokeDashoffset={-offset + circumference * 0.25}
                            strokeLinecap="butt"
                            style={{
                                opacity,
                                transition: 'opacity 0.2s ease',
                                cursor: 'pointer'
                            }}
                            onMouseEnter={(e) => handleSegmentHover(segment, e)}
                            onMouseMove={(e) => setTooltipPosition({ x: e.clientX, y: e.clientY })}
                            onMouseLeave={() => setHoveredSegment(null)}
                        />
                    );
                })}
            </svg>

            {/* Center text */}
            <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                textAlign: 'center'
            }}>
                {hoveredSegment ? (
                    <>
                        <Text variant="bodySm" as="p" tone="subdued">{hoveredSegment.label}</Text>
                        <Text variant="headingLg" as="p" fontWeight="bold">{hoveredSegment.value}</Text>
                        {hoveredSegment.change && (
                            <Text
                                variant="bodySm"
                                as="p"
                                tone={hoveredSegment.changeType === 'positive' ? 'success' : 'critical'}
                            >
                                ↗ {hoveredSegment.change}
                            </Text>
                        )}
                    </>
                ) : (
                    <>
                        <Text variant="headingLg" as="p" fontWeight="bold">{totalValue}</Text>
                        <Text
                            variant="bodySm"
                            as="p"
                            tone={changeType === 'positive' ? 'success' : 'critical'}
                        >
                            ↗ {totalChange}
                        </Text>
                    </>
                )}
            </div>

            {/* Tooltip */}
            {hoveredSegment && (
                <div style={{
                    position: 'fixed',
                    left: tooltipPosition.x + 15,
                    top: tooltipPosition.y - 10,
                    background: 'white',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                    padding: '10px 14px',
                    zIndex: 1000,
                    pointerEvents: 'none',
                    minWidth: '120px'
                }}>
                    <Text variant="headingSm" as="p" fontWeight="semibold">Total sales</Text>
                    <InlineStack gap="100" blockAlign="center" style={{ marginTop: '6px' }}>
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: hoveredSegment.color }} />
                        <Text variant="bodySm" as="span">{hoveredSegment.label}</Text>
                    </InlineStack>
                    <Text variant="bodyMd" as="p" fontWeight="semibold" style={{ marginTop: '4px' }}>{hoveredSegment.fullValue || hoveredSegment.value}</Text>
                </div>
            )}
        </div>
    );
};

export default DonutChartWithHover;

