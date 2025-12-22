'use client';

import { Page, Layout, Card, Text, Button, BlockStack } from '@shopify/polaris';

export default function ContactsPage() {
  return (
    <Page title="Contacts">
      <Layout>
        <Layout.Section>
          <Card>
            <BlockStack gap="200">
              <Text variant="headingMd" as="h2">
                Contacts
              </Text>
              <Text as="p" tone="subdued">
                Manage your contacts and communication.
              </Text>
              <Button variant="primary">Add Contact</Button>
            </BlockStack>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}

