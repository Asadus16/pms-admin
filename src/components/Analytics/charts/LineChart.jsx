'use client';

import { useState } from 'react';
import { Text, InlineStack } from '@shopify/polaris';

const LineChart = ({ height = 280, showYAxis = true, yAxisLabels = ['₹4K', '₹2K', '₹0', '-₹2K', '-₹4K'] }) => {
    const [hoverData, setHoverData] = useState(null);
    const xLabels = ['12 AM', '2 AM', '4 AM', '6 AM', '8 AM', '10 AM', '12 PM', '2 PM', '4 PM', '6 PM', '8 PM', '10 PM'];

    const mainLinePoints = [
        { x: 0, y: 108, value: 0 },
        { x: 35, y: 100, value: 200 },
        { x: 70, y: 80, value: 892 },
        { x: 100, y: 55, value: 1500 },
        { x: 130, y: 55, value: 1400 },
        { x: 165, y: 85, value: 600 },
        { x: 200, y: 108, value: 0 },
        { x: 280, y: 108, value: 0 },
        { x: 320, y: 100, value: 200 },
        { x: 360, y: 75, value: 1000 },
        { x: 400, y: 50, value: 1892 },
        { x: 440, y: 65, value: 1200 },
        { x: 480, y: 90, value: 498 },
        { x: 520, y: 108, value: 0 },
        { x: 560, y: 108, value: 0 },
        { x: 600, y: 100, value: 200 },
        { x: 640, y: 75, value: 1000 },
        { x: 680, y: 45, value: 2156 },
        { x: 720, y: 70, value: 1100 },
        { x: 760, y: 95, value: 445 },
        { x: 800, y: 108, value: 0 },
    ];

    const compareLinePoints = [
        { x: 0, y: 108, value: 0 },
        { x: 280, y: 108, value: 0 },
        { x: 320, y: 115, value: -200 },
        { x: 360, y: 150, value: -1500 },
        { x: 400, y: 200, value: -3807 },
        { x: 440, y: 200, value: -3500 },
        { x: 480, y: 150, value: -1500 },
        { x: 520, y: 115, value: -200 },
        { x: 560, y: 108, value: 0 },
        { x: 620, y: 105, value: 100 },
        { x: 660, y: 95, value: 320 },
        { x: 700, y: 103, value: 150 },
        { x: 800, y: 108, value: 0 },
    ];

    const getYAtX = (points, x) => {
        for (let i = 0; i < points.length - 1; i++) {
            if (x >= points[i].x && x <= points[i + 1].x) {
                const t = (x - points[i].x) / (points[i + 1].x - points[i].x);
                return {
                    y: points[i].y + t * (points[i + 1].y - points[i].y),
                    value: points[i].value + t * (points[i + 1].value - points[i].value)
                };
            }
        }
        return { y: 108, value: 0 };
    };

    const getTimeFromX = (x) => {
        const hour = Math.round((x / 800) * 24);
        const clampedHour = Math.max(0, Math.min(23, hour));
        const period = clampedHour >= 12 ? 'PM' : 'AM';
        const displayHour = clampedHour % 12 || 12;
        return `${displayHour}:00 ${period}`;
    };

    const handleMouseMove = (e) => {
        const svg = e.currentTarget;
        const rect = svg.getBoundingClientRect();
        const svgX = ((e.clientX - rect.left) / rect.width) * 800;
        const svgY = ((e.clientY - rect.top) / rect.height) * 220;

        const mainPoint = getYAtX(mainLinePoints, svgX);
        const comparePoint = getYAtX(compareLinePoints, svgX);

        const distToMain = Math.abs(svgY - mainPoint.y);
        const distToCompare = Math.abs(svgY - comparePoint.y);
        const threshold = 20;

        if (distToMain < threshold || distToCompare < threshold) {
            setHoverData({
                x: svgX,
                mainY: mainPoint.y,
                compareY: comparePoint.y,
                mainValue: Math.round(mainPoint.value),
                compareValue: Math.round(comparePoint.value),
                time: getTimeFromX(svgX),
                screenX: e.clientX,
                screenY: rect.top
            });
        } else {
            setHoverData(null);
        }
    };

    const handleMouseLeave = () => {
        setHoverData(null);
    };

    const formatValue = (val) => {
        if (val < 0) return `-₹${Math.abs(val).toLocaleString()}.00`;
        return `₹${val.toLocaleString()}.00`;
    };

    const calculateChange = (current, compare) => {
        if (compare === 0 && current === 0) return '0%';
        if (compare === 0) return '100%';
        const change = Math.round(((current - compare) / Math.abs(compare)) * 100);
        return `${Math.abs(change)}%`;
    };

    return (
        <div style={{ position: 'relative', height: `${height}px`, width: '100%' }}>
            {showYAxis && (
                <div style={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    bottom: 30,
                    width: '40px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    paddingRight: '8px'
                }}>
                    {yAxisLabels.map((label, i) => (
                        <Text key={i} variant="bodySm" as="span" tone="subdued" alignment="end">
                            {label}
                        </Text>
                    ))}
                </div>
            )}

            <div style={{
                position: 'absolute',
                left: showYAxis ? '48px' : '0',
                right: 0,
                top: 0,
                bottom: 0,
                overflow: 'hidden',
                minWidth: 0
            }}>
                <svg
                    width="100%"
                    height={height - 30}
                    viewBox="0 0 800 220"
                    preserveAspectRatio="none"
                    style={{ overflow: 'visible' }}
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
                >
                    <line x1="0" y1="0" x2="800" y2="0" stroke="#f3f3f3" strokeWidth="1" />
                    <line x1="0" y1="55" x2="800" y2="55" stroke="#f3f3f3" strokeWidth="1" />
                    <line x1="0" y1="110" x2="800" y2="110" stroke="#f3f3f3" strokeWidth="1" />
                    <line x1="0" y1="165" x2="800" y2="165" stroke="#f3f3f3" strokeWidth="1" />
                    <line x1="0" y1="220" x2="800" y2="220" stroke="#f3f3f3" strokeWidth="1" />

                    <path
                        d="M 0 108 
               L 280 108
               C 300 108, 320 115, 360 150
               C 380 180, 400 200, 420 200
               C 440 200, 460 180, 480 150
               C 500 120, 520 108, 560 108
               L 600 108
               C 620 106, 640 100, 660 95
               C 680 100, 700 106, 720 108
               L 800 108"
                        fill="none"
                        stroke="#12acf0"
                        strokeWidth="1.5"
                        strokeDasharray="4 3"
                        strokeOpacity="0.5"
                        style={{ pointerEvents: 'none' }}
                    />

                    <path
                        d="M 0 108 
               C 30 108, 50 100, 70 80
               C 90 55, 110 55, 130 55
               C 150 70, 170 100, 200 108
               L 280 108
               C 300 108, 320 100, 360 75
               C 380 60, 400 50, 420 50
               C 440 60, 460 80, 480 90
               C 500 100, 510 108, 520 108
               L 560 108
               C 580 108, 600 100, 640 75
               C 660 55, 680 45, 700 50
               C 720 60, 740 80, 760 95
               C 780 105, 790 108, 800 108"
                        fill="none"
                        stroke="#12acf0"
                        strokeWidth="2"
                        style={{ pointerEvents: 'none' }}
                    />

                    <path
                        d="M 0 108 
               C 30 108, 50 100, 70 80
               C 90 55, 110 55, 130 55
               C 150 70, 170 100, 200 108
               L 280 108
               C 300 108, 320 100, 360 75
               C 380 60, 400 50, 420 50
               C 440 60, 460 80, 480 90
               C 500 100, 510 108, 520 108
               L 560 108
               C 580 108, 600 100, 640 75
               C 660 55, 680 45, 700 50
               C 720 60, 740 80, 760 95
               C 780 105, 790 108, 800 108"
                        fill="none"
                        stroke="transparent"
                        strokeWidth="20"
                        style={{ cursor: 'pointer' }}
                    />

                    <path
                        d="M 0 108 
               L 280 108
               C 300 108, 320 115, 360 150
               C 380 180, 400 200, 420 200
               C 440 200, 460 180, 480 150
               C 500 120, 520 108, 560 108
               L 600 108
               C 620 106, 640 100, 660 95
               C 680 100, 700 106, 720 108
               L 800 108"
                        fill="none"
                        stroke="transparent"
                        strokeWidth="20"
                        style={{ cursor: 'pointer' }}
                    />

                    {hoverData && (
                        <>
                            <line
                                x1={hoverData.x}
                                y1="0"
                                x2={hoverData.x}
                                y2="220"
                                stroke="#c4c4c4"
                                strokeWidth="1"
                                strokeDasharray="4 4"
                                style={{ pointerEvents: 'none' }}
                            />

                            <circle
                                cx={hoverData.x}
                                cy={hoverData.mainY}
                                r="6"
                                fill="#12acf0"
                                stroke="white"
                                strokeWidth="2"
                                style={{ pointerEvents: 'none' }}
                            />

                            <circle
                                cx={hoverData.x}
                                cy={hoverData.compareY}
                                r="5"
                                fill="#12acf0"
                                fillOpacity="0.5"
                                stroke="white"
                                strokeWidth="2"
                                style={{ pointerEvents: 'none' }}
                            />
                        </>
                    )}
                </svg>

                {hoverData && (
                    <div style={{
                        position: 'fixed',
                        left: hoverData.screenX + 15,
                        top: hoverData.screenY + 20,
                        background: 'white',
                        borderRadius: '12px',
                        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
                        padding: '12px 16px',
                        zIndex: 1000,
                        minWidth: '200px',
                        pointerEvents: 'none'
                    }}>
                        <Text variant="headingSm" as="p" fontWeight="semibold">Total sales</Text>
                        <div style={{ marginTop: '8px' }}>
                            <InlineStack gap="100" blockAlign="center">
                                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#12acf0' }} />
                                <Text variant="bodySm" as="span" tone="subdued">Dec 2, 2025, {hoverData.time}</Text>
                            </InlineStack>
                            <Text variant="bodyMd" as="p" fontWeight="semibold" style={{ marginTop: '4px' }}>{formatValue(hoverData.mainValue)}</Text>
                            <div style={{ marginTop: '4px' }}>
                                <span style={{ color: '#369962', fontSize: '13px' }}>↗ {calculateChange(hoverData.mainValue, hoverData.compareValue)}</span>
                                <span style={{ color: '#6d7175', fontSize: '13px' }}> from comparison</span>
                            </div>
                        </div>
                        <div style={{ marginTop: '12px', paddingTop: '8px', borderTop: '1px solid #e3e3e3' }}>
                            <InlineStack gap="100" blockAlign="center">
                                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#12acf0', opacity: 0.5 }} />
                                <Text variant="bodySm" as="span" tone="subdued">Dec 1, 2025, {hoverData.time}</Text>
                            </InlineStack>
                            <Text variant="bodyMd" as="p" fontWeight="semibold" style={{ marginTop: '4px' }}>{formatValue(hoverData.compareValue)}</Text>
                        </div>
                    </div>
                )}

                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    paddingTop: '8px',
                    paddingLeft: '0',
                    paddingRight: '0'
                }}>
                    {xLabels.map((label, i) => (
                        <Text key={i} variant="bodySm" as="span" tone="subdued">
                            {label}
                        </Text>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default LineChart;

