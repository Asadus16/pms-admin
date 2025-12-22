'use client';

import { Page, Layout, Card, Text, Button, BlockStack } from '@shopify/polaris';

export default function InventoryPage() {
  return (
    <Page title="Inventory">
      <Layout>
        <Layout.Section>
          <Card>
            <BlockStack gap="200">
              <Text variant="headingMd" as="h2">
                Inventory
              </Text>
              <Text as="p" tone="subdued">
                Manage your inventory.
              </Text>
              <Button variant="primary">Manage Inventory</Button>
            </BlockStack>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}

