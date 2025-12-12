'use client';

import { useState } from 'react';
import { BlockStack, Text, InlineStack } from '@shopify/polaris';
import ChartHeading from '../ChartHeading';

const ProductSalesList = () => {
    const [hoveredIndex, setHoveredIndex] = useState(null);

    const products = [
        { name: 'CLEAR COMPLEXION 15-DAY CHALLENGE - Ayurvedic 50+ Herbs...', value: '₹2,849.05', compare: '₹0.00', change: null, barWidth: 100 },
        { name: 'Lip Stain – 50+ Ayurvedic Herbs infused · skshafeen · None', value: '₹2,356.05', compare: '₹2,279.19', change: '3%', changeType: 'positive', barWidth: 82 },
        { name: 'Icy Drips Tinted Lip Oil – 50 + Ayurvedic Herbs infused · skshafee...', value: '₹1,233.10', compare: '₹585.73', change: null, barWidth: 43 },
        { name: 'Clear Complexion Soap – Infused with 50+ Ayurvedic Herbs · sksh...', value: '₹888.00', compare: '₹0.00', change: null, barWidth: 31 },
    ];

    return (
        <BlockStack gap="300">
            <ChartHeading title="Total sales by product" />
            <div style={{ maxHeight: '220px', overflowY: 'auto' }}>
                <BlockStack gap="300">
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
                            <BlockStack gap="50">
                                <Text variant="bodySm" as="p">{product.name}</Text>

                                {/* Main bar row */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <div style={{
                                        flex: 1,
                                        height: '10px',
                                        background: '#e8e8e8',
                                        borderRadius: '2px',
                                        overflow: 'hidden'
                                    }}>
                                        <div style={{
                                            width: `${product.barWidth}%`,
                                            height: '100%',
                                            background: '#12acf0',
                                            borderRadius: '2px',
                                        }} />
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: '120px', justifyContent: 'flex-end' }}>
                                        <Text variant="bodySm" as="span" fontWeight="medium">{product.value}</Text>
                                        {product.change ? (
                                            <Text variant="bodySm" as="span" tone="success">↗ {product.change}</Text>
                                        ) : (
                                            <Text variant="bodySm" as="span" tone="subdued">—</Text>
                                        )}
                                    </div>
                                </div>

                                {/* Compare bar row - 2px gap from main bar */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '-2px' }}>
                                    <div style={{
                                        flex: 1,
                                        height: '10px',
                                        background: 'transparent',
                                        borderRadius: '2px',
                                        overflow: 'hidden'
                                    }}>
                                        <div style={{
                                            width: `${product.barWidth * 0.8}%`,
                                            height: '100%',
                                            background: '#9bcdea',
                                            borderRadius: '2px',
                                        }} />
                                    </div>
                                    <div style={{ minWidth: '120px', textAlign: 'right' }}>
                                        <Text variant="bodySm" as="span" tone="subdued">{product.compare}</Text>
                                    </div>
                                </div>
                            </BlockStack>
                        </div>
                    ))}
                </BlockStack>
            </div>
        </BlockStack>
    );
};

export default ProductSalesList;

