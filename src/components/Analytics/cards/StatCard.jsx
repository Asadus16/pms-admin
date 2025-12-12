'use client';

import { useState } from 'react';
import { Text, BlockStack, InlineStack } from '@shopify/polaris';
import { chartTooltipData } from '../constants';
import Sparkline, { DualSparkline } from '../charts/Sparkline';

const StatCard = ({ title, value, change, changeType = 'positive', sparklineData, sparklineData2, dualLine = false, compact = false }) => {
    const [showTooltip, setShowTooltip] = useState(false);
    const tooltipData = chartTooltipData[title];

    const renderFormula = (formula) => {
        if (!formula) return null;
        const operators = ['+', '-', '*', '/', '(', ')'];
        const parts = formula.right.split(/(\+|\-|\*|\/|\(|\))/g).filter(p => p.trim());

        return (
            <div style={{ marginTop: '8px', fontFamily: 'monospace', fontSize: '12px' }}>
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

    // Compact mode styles for inline stats strip
    if (compact) {
        return (
            <div style={{
                background: 'transparent',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
            }}>
                <div
                    style={{ position: 'relative', display: 'inline-block', marginBottom: '2px' }}
                    onMouseEnter={() => setShowTooltip(true)}
                    onMouseLeave={() => setShowTooltip(false)}
                >
                    <Text variant="bodySm" as="p" tone="subdued">
                        {title}
                    </Text>
                </div>
                <InlineStack align="space-between" blockAlign="center" gap="300">
                    <InlineStack gap="100" blockAlign="baseline" wrap={false}>
                        <Text variant="bodyMd" as="p" fontWeight="semibold">{value}</Text>
                        <span style={{
                            fontFamily: 'Inter, -apple-system, "system-ui", "San Francisco", "Segoe UI", Roboto, "Helvetica Neue", sans-serif',
                            fontSize: '11px',
                            fontWeight: '600',
                            color: changeType === 'positive' ? 'rgb(7, 141, 78)' : changeType === 'critical' || changeType === 'negative' ? 'rgb(191, 38, 0)' : 'rgb(97, 97, 97)'
                        }}>
                            {changeType === 'positive' ? '↑' : changeType === 'critical' || changeType === 'negative' ? '↓' : ''}{change}
                        </span>
                    </InlineStack>
                    <Sparkline data={sparklineData} color="#12acf0" height={24} width={70} />
                </InlineStack>
            </div>
        );
    }

    return (
        <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '12px 16px',
            border: '1px solid #e3e3e3',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)',
            height: '100%',
            position: 'relative'
        }}>
            <BlockStack gap="100">
                <div
                    style={{ position: 'relative', display: 'inline-block' }}
                    onMouseEnter={() => setShowTooltip(true)}
                    onMouseLeave={() => setShowTooltip(false)}
                >
                    <Text variant="bodySm" as="p" fontWeight="medium">
                        <span style={{
                            borderBottom: '1.5px dotted #6d7175',
                            paddingBottom: '1px',
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
                            padding: '14px 18px',
                            zIndex: 1000,
                            minWidth: '280px',
                            maxWidth: '360px',
                        }}>
                            <Text variant="headingSm" as="p" fontWeight="bold">{tooltipData.title}</Text>
                            <div style={{ marginTop: '6px' }}>
                                <Text variant="bodySm" as="p" tone="subdued">
                                    {tooltipData.description}
                                </Text>
                            </div>
                            {tooltipData.formula && renderFormula(tooltipData.formula)}
                        </div>
                    )}
                </div>
                <InlineStack align="space-between" blockAlign="center">
                    <InlineStack gap="150" blockAlign="baseline">
                        <Text variant="headingMd" as="p" fontWeight="semibold">{value}</Text>
                        <span style={{
                            fontFamily: 'Inter, -apple-system, "system-ui", "San Francisco", "Segoe UI", Roboto, "Helvetica Neue", sans-serif',
                            fontSize: '11px',
                            fontWeight: '650',
                            lineHeight: '20px',
                            color: changeType === 'positive' ? 'rgb(7, 141, 78)' : changeType === 'critical' ? 'rgb(191, 38, 0)' : 'rgb(97, 97, 97)'
                        }}>
                            {changeType === 'positive' ? '↑' : changeType === 'critical' ? '↓' : ''}{change}
                        </span>
                    </InlineStack>
                    {dualLine ? (
                        <DualSparkline data1={sparklineData} data2={sparklineData2} />
                    ) : (
                        <Sparkline data={sparklineData} color="#12acf0" />
                    )}
                </InlineStack>
            </BlockStack>
        </div>
    );
};

export default StatCard;

