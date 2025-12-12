'use client';

import { useState } from 'react';
import { BlockStack, Text, InlineStack } from '@shopify/polaris';
import ChartHeading from '../ChartHeading';

const DeviceTypeChart = () => {
    const [hoveredDevice, setHoveredDevice] = useState(null);

    const devices = [
        { label: 'Mobile', count: 205, change: '39%', changeType: 'positive', color: '#12acf0', percentage: 73 },
        { label: 'Desk...', count: 73, change: '630%', changeType: 'positive', color: '#8b5cf6', percentage: 26 },
        { label: 'Tablet', count: 1, color: '#60a5fa', percentage: 0.4 },
        { label: 'Other', count: 0, color: '#f472b6', percentage: 0 },
    ];

    const size = 180;
    const radius = (size - 40) / 2;
    const strokeWidth = 24;
    const circumference = 2 * Math.PI * radius;

    let currentOffset = circumference * 0.25;

    return (
        <BlockStack gap="300">
            <ChartHeading title="Sessions by device type" />
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

                        <line
                            x1={size / 2}
                            y1={20}
                            x2={size / 2 - 5}
                            y2={20}
                            stroke="white"
                            strokeWidth="3"
                            transform={`rotate(${devices[0].percentage * 3.6}, ${size / 2}, ${size / 2})`}
                        />
                    </svg>

                    <div style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        textAlign: 'center'
                    }}>
                        <Text variant="headingXl" as="p" fontWeight="bold">279</Text>
                        <Text variant="bodySm" as="p" tone="success">↗ 78%</Text>
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

