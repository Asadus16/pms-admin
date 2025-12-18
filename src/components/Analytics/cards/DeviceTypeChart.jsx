'use client';

import { useState } from 'react';
import { BlockStack, Text, InlineStack } from '@shopify/polaris';
import ChartHeading from '../ChartHeading';

const DeviceTypeChart = () => {
    const [hoveredDevice, setHoveredDevice] = useState(null);

    const devices = [
        { label: 'Occupied', count: 45, change: '12%', changeType: 'positive', color: '#1e40af', percentage: 60 },
        { label: 'Vacant', count: 20, change: '5%', changeType: 'positive', color: '#3b82f6', percentage: 27 },
        { label: 'Under Maint.', count: 8, color: '#60a5fa', percentage: 10 },
        { label: 'Reserved', count: 2, color: '#93c5fd', percentage: 3 },
    ];

    const size = 180;
    const radius = (size - 40) / 2;
    const strokeWidth = 24;
    const circumference = 2 * Math.PI * radius;

    let currentOffset = circumference * 0.25;

    return (
        <BlockStack gap="300">
            <ChartHeading title="Occupancy Rate (Unit Type Breakdown)" />
            <InlineStack gap="500" blockAlign="center">
                <div style={{ position: 'relative', width: size, height: size }}>
                    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
                        <circle
                            cx={size / 2}
                            cy={size / 2}
                            r={radius}
                            fill="none"
                            stroke="#e8e8e8"
                            strokeWidth={strokeWidth}
                        />

                        {devices.filter(d => d.percentage > 0).map((device, index) => {
                            const segmentLength = (device.percentage / 100) * circumference;
                            const offset = currentOffset;
                            currentOffset += segmentLength;

                            const isHovered = hoveredDevice?.label === device.label;
                            const opacity = hoveredDevice ? (isHovered ? 1 : 0.3) : 1;

                            return (
                                <circle
                                    key={index}
                                    cx={size / 2}
                                    cy={size / 2}
                                    r={radius}
                                    fill="none"
                                    stroke={device.color}
                                    strokeWidth={strokeWidth}
                                    strokeDasharray={`${segmentLength} ${circumference}`}
                                    strokeDashoffset={-offset + circumference * 0.25}
                                    strokeLinecap="butt"
                                    style={{ opacity, transition: 'opacity 0.2s ease', cursor: 'pointer' }}
                                    onMouseEnter={() => setHoveredDevice(device)}
                                    onMouseLeave={() => setHoveredDevice(null)}
                                />
                            );
                        })}
                    </svg>

                    <div style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        textAlign: 'center'
                    }}>
                        <Text variant="headingXl" as="p" fontWeight="bold">75</Text>
                        <Text variant="bodySm" as="p" tone="success">↗ 12%</Text>
                    </div>
                </div>

                <BlockStack gap="300">
                    {devices.map((device, index) => (
                        <InlineStack
                            key={index}
                            gap="200"
                            blockAlign="center"
                            style={{
                                opacity: hoveredDevice && hoveredDevice.label !== device.label ? 0.4 : 1,
                                transition: 'opacity 0.2s ease',
                                cursor: 'pointer'
                            }}
                            onMouseEnter={() => setHoveredDevice(device)}
                            onMouseLeave={() => setHoveredDevice(null)}
                        >
                            <div style={{ width: 12, height: 12, background: device.color, borderRadius: 2 }} />
                            <Text variant="bodySm" as="span" style={{ minWidth: '50px' }}>{device.label}</Text>
                            <Text variant="bodySm" as="span" fontWeight="medium" style={{ minWidth: '30px' }}>{device.count}</Text>
                            {device.change && (
                                <Text variant="bodySm" as="span" tone="success">↗ {device.change}</Text>
                            )}
                        </InlineStack>
                    ))}
                </BlockStack>
            </InlineStack>
        </BlockStack>
    );
};

export default DeviceTypeChart;

