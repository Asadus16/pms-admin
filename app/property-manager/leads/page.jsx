'use client';

import { Page, Layout, Card, Text, Button, BlockStack } from '@shopify/polaris';

export default function LeadsPage() {
  return (
    <Page title="Leads">
      <Layout>
        <Layout.Section>
          <Card>
            <BlockStack gap="200">
              <Text variant="headingMd" as="h2">
                Leads
              </Text>
              <Text as="p" tone="subdued">
                Track and manage sales leads.
              </Text>
              <Button variant="primary">Add Lead</Button>
            </BlockStack>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}

