'use client';

import { Page, Layout, Card, Text, Button, BlockStack } from '@shopify/polaris';

export default function ReportsPage() {
  return (
    <Page title="Reports">
      <Layout>
        <Layout.Section>
          <Card>
            <BlockStack gap="200">
              <Text variant="headingMd" as="h2">
                Reports
              </Text>
              <Text as="p" tone="subdued">
                View and generate reports.
              </Text>
              <Button variant="primary">Generate Report</Button>
            </BlockStack>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}

