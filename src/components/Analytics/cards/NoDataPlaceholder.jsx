import { BlockStack, Text } from '@shopify/polaris';
import ChartHeading from '../ChartHeading';

const NoDataPlaceholder = ({ title }) => (
    <BlockStack gap="300">
        <ChartHeading title={title} />
        <div style={{
            height: '150px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#f9f9f9',
            borderRadius: '8px'
        }}>
            <Text variant="bodySm" as="p" tone="subdued">No data for this date range</Text>
        </div>
    </BlockStack>
);

export default NoDataPlaceholder;

