'use client';

import { Page, Layout, Card, Text, Button, BlockStack } from '@shopify/polaris';

export default function IntegrationsPage() {
  return (
    <Page title="Integrations">
      <Layout>
        <Layout.Section>
          <Card>
            <BlockStack gap="200">
              <Text variant="headingMd" as="h2">
                Integrations
              </Text>
              <Text as="p" tone="subdued">
                Connect with third-party services.
              </Text>
              <Button variant="primary">Browse Integrations</Button>
            </BlockStack>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}

