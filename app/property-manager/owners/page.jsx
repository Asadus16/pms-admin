'use client';

import { Page, Layout, Card, Text, Button, BlockStack } from '@shopify/polaris';

export default function OwnersPage() {
  return (
    <Page title="Owners">
      <Layout>
        <Layout.Section>
          <Card>
            <BlockStack gap="200">
              <Text variant="headingMd" as="h2">
                Owners
              </Text>
              <Text as="p" tone="subdued">
                Manage property owners.
              </Text>
              <Button variant="primary">Add Owner</Button>
            </BlockStack>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}

