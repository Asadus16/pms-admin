'use client';

import { useState } from 'react';
import { Text } from '@shopify/polaris';

const SimpleLineChart = ({ height = 320, color = '#12acf0', yLabels = ['60', '40', '20', '0'], data = null }) => {
    const [hoverData, setHoverData] = useState(null);

    // Generate points from data if provided
    const linePoints = data ? data.map((value, index) => {
        const x = (index / (data.length - 1)) * 300;
        const maxValue = Math.max(...data);
        const minValue = Math.min(...data);
        const y = 90 - ((value - minValue) / (maxValue - minValue)) * 70;
        return { x, y: Math.max(10, Math.min(90, y)), value };
    }) : null;

    const handleMouseMove = (e) => {
        const svg = e.currentTarget;
        const rect = svg.getBoundingClientRect();
        const svgX = ((e.clientX - rect.left) / rect.width) * 300;

        const hour = Math.round((svgX / 300) * 24);
        const clampedHour = Math.max(0, Math.min(23, hour));
        const period = clampedHour >= 12 ? 'PM' : 'AM';
        const displayHour = clampedHour % 12 || 12;
        const time = `${displayHour}:00 ${period}`;

        const mainY = linePoints ? (linePoints.find((p, i) => i === Math.round((svgX / 300) * (linePoints.length - 1)))?.y || 50) : (80 - (svgX / 300) * 60);
        const compareY = 70 - (svgX / 300) * 35;

        setHoverData({
            x: svgX,
            mainY: Math.max(15, Math.min(90, mainY)),
            compareY: Math.max(35, Math.min(75, compareY)),
            time,
            screenX: e.clientX,
            screenY: rect.top + rect.height / 2
        });
    };

    const handleMouseLeave = () => {
        setHoverData(null);
    };

    return (
        <div style={{ height: `${height}px`, position: 'relative', display: 'flex' }}>
            {/* Y-axis labels */}
            <div style={{
                width: '30px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                paddingRight: '8px',
                paddingBottom: '24px'
            }}>
                {yLabels.map((label, i) => (
                    <span key={i} style={{ fontSize: '11px', color: '#6d7175', textAlign: 'right', display: 'block' }}>
                        {label}
                    </span>
                ))}
            </div>

            {/* Chart area */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <svg
                    width="100%"
                    height={height - 24}
                    viewBox="0 0 300 100"
                    preserveAspectRatio="none"
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
                    style={{ cursor: 'pointer', flex: 1 }}
                >
                    <line x1="0" y1="0" x2="300" y2="0" stroke="#f3f3f3" strokeWidth="1" />
                    <line x1="0" y1="33" x2="300" y2="33" stroke="#f3f3f3" strokeWidth="1" />
                    <line x1="0" y1="66" x2="300" y2="66" stroke="#f3f3f3" strokeWidth="1" />
                    <line x1="0" y1="100" x2="300" y2="100" stroke="#f3f3f3" strokeWidth="1" />

                    <path
                        d="M 0 70 C 50 65, 100 55, 150 50 S 250 42, 300 38"
                        fill="none"
                        stroke="#c4c4c4"
                        strokeWidth="1.5"
                        strokeDasharray="4 3"
                    />

                    <path
                        d={linePoints ? linePoints.map((point, i) => 
                            `${i === 0 ? 'M' : 'L'} ${point.x} ${point.y}`
                        ).join(' ') : "M 0 80 C 40 75, 80 60, 120 50 S 200 35, 250 28 S 280 22, 300 18"}
                        fill="none"
                        stroke={color}
                        strokeWidth="2"
                    />

                    {hoverData && (
                        <>
                            <line
                                x1={hoverData.x}
                                y1="0"
                                x2={hoverData.x}
                                y2="100"
                                stroke="#c4c4c4"
                                strokeWidth="1"
                                strokeDasharray="4 4"
                            />
                            <circle cx={hoverData.x} cy={hoverData.mainY} r="5" fill={color} stroke="white" strokeWidth="2" />
                            <circle cx={hoverData.x} cy={hoverData.compareY} r="4" fill="#c4c4c4" stroke="white" strokeWidth="2" />
                        </>
                    )}
                </svg>

                <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '4px' }}>
                    <span style={{ fontSize: '11px', color: '#6d7175' }}>12 AM</span>
                    <span style={{ fontSize: '11px', color: '#6d7175' }}>5 AM</span>
                    <span style={{ fontSize: '11px', color: '#6d7175' }}>10 AM</span>
                    <span style={{ fontSize: '11px', color: '#6d7175' }}>3 PM</span>
                    <span style={{ fontSize: '11px', color: '#6d7175' }}>8 PM</span>
                </div>
            </div>
        </div>
    );
};

export default SimpleLineChart;

