'use client';

import { useState } from 'react';
import { BlockStack, Text } from '@shopify/polaris';
import ChartHeading from '../ChartHeading';

const ProductsBySellThroughRate = () => {
    const [hoveredIndex, setHoveredIndex] = useState(null);

    const products = [
        { name: 'Unit A-301 · DHA Phase 8 (Fastest-selling)', rate: '15 days', compare: '20 days', change: '25%', changeType: 'positive', barWidth: 100 },
        { name: 'Villa X · Emirates Hills (Highest ROI)', rate: '28%', compare: '22%', change: '27%', changeType: 'positive', barWidth: 85 },
        { name: 'Apartment B-205 · Business Bay (Fast-selling)', rate: '22 days', compare: '30 days', change: '27%', changeType: 'positive', barWidth: 70 },
        { name: 'Unit C-102 · Marina (Lowest Occupancy)', rate: '45%', compare: '55%', change: '18%', barWidth: 45 },
        { name: 'Penthouse D-801 · Downtown (High ROI)', rate: '24%', compare: '20%', change: '20%', barWidth: 60 },
    ];

    return (
        <BlockStack gap="300">
            <ChartHeading title="Units by Performance Metrics" />
            <BlockStack gap="200">
                {products.map((product, index) => (
                    <div
                        key={index}
                        onMouseEnter={() => setHoveredIndex(index)}
                        onMouseLeave={() => setHoveredIndex(null)}
                        style={{
                            opacity: hoveredIndex !== null && hoveredIndex !== index ? 0.4 : 1,
                            transition: 'opacity 0.2s ease'
                        }}
                    >
                        <div>
                            <Text variant="bodySm" as="p" truncate>{product.name}</Text>

                            {/* Main bar */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                                <div style={{
                                    height: '12px',
                                    width: `${product.barWidth}%`,
                                    maxWidth: '60%',
                                    background: '#12acf0',
                                    borderRadius: '2px',
                                }} />
                                <Text variant="bodySm" as="span" fontWeight="medium">{product.rate}</Text>
                                {product.change ? (
                                    <Text variant="bodySm" as="span" tone="success">↗ {product.change}</Text>
                                ) : (
                                    <Text variant="bodySm" as="span" tone="subdued">—</Text>
                                )}
                            </div>

                            {/* Compare bar */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '1px' }}>
                                <div style={{
                                    height: '12px',
                                    width: `${product.barWidth * 0.9}%`,
                                    maxWidth: '54%',
                                    background: '#9bcdea',
                                    borderRadius: '2px',
                                }} />
                                <Text variant="bodySm" as="span" tone="subdued">{product.compare}</Text>
                            </div>
                        </div>
                    </div>
                ))}
            </BlockStack>
        </BlockStack>
    );
};

export default ProductsBySellThroughRate;

