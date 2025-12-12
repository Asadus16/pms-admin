'use client';

import { useState } from 'react';
import { Text } from '@shopify/polaris';
import { chartTooltipData } from './constants';

const ChartHeading = ({ title, variant = 'headingMd' }) => {
    const [showTooltip, setShowTooltip] = useState(false);
    const tooltipData = chartTooltipData[title];

    const renderFormula = (formula) => {
        if (!formula) return null;

        // Split the right side by operators
        const operators = ['+', '-', '*', '/', '(', ')'];
        const parts = formula.right.split(/(\+|\-|\*|\/|\(|\))/g).filter(p => p.trim());

        return (
            <div style={{ marginTop: '8px', fontFamily: 'monospace', fontSize: '13px' }}>
                <span style={{ color: '#0066cc' }}>{formula.left}</span>
                <span style={{ color: '#0066cc' }}> = </span>
                {parts.map((part, idx) => {
                    const trimmed = part.trim();
                    if (operators.includes(trimmed)) {
                        return <span key={idx} style={{ color: '#0066cc' }}> {trimmed} </span>;
                    }
                    return <span key={idx} style={{ color: '#1a7f4b' }}>{trimmed}</span>;
                })}
            </div>
        );
    };

    return (
        <div
            style={{ position: 'relative', display: 'inline-block' }}
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
        >
            <Text variant={variant} as="h3" fontWeight="semibold">
                <span style={{
                    borderBottom: '1.5px dotted #6d7175',
                    paddingBottom: '2px',
                    cursor: 'help'
                }}>
                    {title}
                </span>
            </Text>

            {showTooltip && tooltipData && (
                <div style={{
                    position: 'absolute',
                    top: '100%',
                    left: '0',
                    marginTop: '8px',
                    background: 'white',
                    borderRadius: '12px',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
                    padding: '16px 20px',
                    zIndex: 1000,
                    minWidth: '320px',
                    maxWidth: '400px',
                }}>
                    <Text variant="headingSm" as="p" fontWeight="bold">{tooltipData.title}</Text>
                    <Text variant="bodySm" as="p" tone="subdued" style={{ marginTop: '8px' }}>
                        {tooltipData.description}
                    </Text>
                    {tooltipData.formula && renderFormula(tooltipData.formula)}
                </div>
            )}
        </div>
    );
};

export default ChartHeading;

