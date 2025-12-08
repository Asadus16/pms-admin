import { useState } from 'react';
import { BlockStack, Text } from '@shopify/polaris';
import ChartHeading from '../ChartHeading';

const ProductsBySellThroughRate = () => {
    const [hoveredIndex, setHoveredIndex] = useState(null);

    const products = [
        { name: 'Clear Complexion Skin Softener Serum - 50+ herbs infused · 50 m...', rate: '1.05%', compare: '1.04%', change: '1%', changeType: 'positive', barWidth: 100 },
        { name: 'Lip Stain – 50+ Ayurvedic Herbs infused · Pink · None', rate: '0.61%', compare: '0.2%', change: '205%', changeType: 'positive', barWidth: 58 },
        { name: 'Clear Complexion Ayurvedic Body Lotion – Infused with 50+ Rare ...', rate: '0.5%', compare: '0%', change: null, barWidth: 48 },
        { name: 'Clear Complexion Soap – Infused with 50+ Ayurvedic Herbs · 120 ...', rate: '0.42%', compare: '0.42%', change: null, barWidth: 40 },
        { name: 'CLEAR COMPLEXION 15-DAY CHALLENGE - Ayurvedic 50+ Herbs...', rate: '0.21%', compare: '0%', change: null, barWidth: 20 },
    ];

    return (
        <BlockStack gap="300">
            <ChartHeading title="Products by sell-through rate" />
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

