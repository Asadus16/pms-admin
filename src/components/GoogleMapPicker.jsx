'use client';

import { useMemo } from 'react';
import { Box } from '@shopify/polaris';

function GoogleMapPicker({ coordinates, onCoordinatesChange, apiKey }) {
    // Build iframe URL based on coordinates
    // Using standard Google Maps embed URL (works without API key)
    const mapUrl = useMemo(() => {
        if (coordinates) {
            // Use coordinates
            const coords = coordinates.replace(/\s/g, '');
            return `https://www.google.com/maps?q=${coords}&output=embed`;
        } else {
            // Default to Dubai
            return `https://www.google.com/maps?q=25.2048,55.2708&output=embed`;
        }
    }, [coordinates]);

    return (
        <Box paddingBlockStart="400">
            <div
                style={{
                    width: '100%',
                    height: '200px',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    border: '1px solid #d1d5db',
                }}
            >
                <iframe
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    loading="lazy"
                    allowFullScreen
                    referrerPolicy="no-referrer-when-downgrade"
                    src={mapUrl}
                />
            </div>
        </Box>
    );
}

export default GoogleMapPicker;

