# Design System Documentation

## Overview

This project uses a centralized design system to maintain consistency across all pages and components. The design system consists of:

1. **Theme Configuration** - Centralized design tokens
2. **Global Styles** - CSS variables and Polaris overrides
3. **Reusable UI Components** - Consistent component library
4. **Page-Specific Styles** - Organized by page in dedicated folders

## File Structure

```
src/
├── theme/
│   └── theme.config.js          # Theme configuration (colors, spacing, typography, etc.)
├── styles/
│   └── globals.css              # Global styles with CSS variables
├── components/
│   ├── ui/                      # Reusable UI components
│   │   ├── CustomButton.jsx
│   │   ├── CustomCard.jsx
│   │   ├── CustomModal.jsx
│   │   ├── CustomTextField.jsx
│   │   ├── CustomSelect.jsx
│   │   ├── CustomCheckbox.jsx
│   │   ├── TagBadge.jsx
│   │   ├── PhoneInput.jsx
│   │   ├── PageLayout.jsx
│   │   ├── FormSection.jsx
│   │   ├── ActionHeader.jsx
│   │   ├── ui.css               # UI component styles
│   │   └── index.js              # Component exports
│   └── [other components]
└── pages/
    ├── Dashboard/
    │   ├── index.jsx
    │   └── dashboard.css
    ├── Customers/
    │   ├── CustomersPage.jsx
    │   └── customers.css
    ├── Analytics/
    │   ├── AnalyticsPage.jsx
    │   └── analytics.css
    ├── Login/
    │   ├── LoginPage.jsx
    │   └── login.css
    └── AddCustomer/
        ├── AddCustomerPage.jsx
        └── add-customer.css
```

## Theme Configuration

The theme configuration (`src/theme/theme.config.js`) defines:

- **Colors**: Primary, secondary, success, error, warning, neutral, background, border, text
- **Spacing**: xs, sm, md, lg, xl, 2xl, 3xl
- **Typography**: Font families, sizes, weights, line heights
- **Border Radius**: sm, md, lg, xl, 2xl, full
- **Shadows**: sm, default, md, lg, xl, 2xl, inner, none
- **Breakpoints**: sm, md, lg, xl, 2xl
- **Z-Index**: Base, dropdown, sticky, fixed, modal, popover, tooltip, etc.
- **Transitions**: fast, default, slow

### Usage

```javascript
import { theme } from '../theme/theme.config';

// Access theme values
const primaryColor = theme.colors.primary.DEFAULT;
const spacing = theme.spacing.md;
const borderRadius = theme.borderRadius.lg;
```

## CSS Variables

All theme values are available as CSS variables in `src/styles/globals.css`:

```css
/* Colors */
--color-primary: #005bd3;
--color-success: #369962;
--color-error: #d72c0d;

/* Spacing */
--spacing-xs: 4px;
--spacing-sm: 8px;
--spacing-md: 16px;

/* Typography */
--font-size-sm: 14px;
--font-size-base: 16px;
--font-weight-medium: 500;

/* Border Radius */
--radius-md: 8px;
--radius-lg: 12px;

/* Shadows */
--shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
```

### Usage in CSS

```css
.my-component {
  color: var(--color-text-primary);
  padding: var(--spacing-md);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow);
}
```

## Reusable UI Components

### CustomButton

Wrapper around Polaris Button with consistent styling.

```jsx
import { CustomButton } from '../components/ui';

<CustomButton variant="primary" size="medium" fullWidth>
  Click Me
</CustomButton>
```

### CustomCard

Wrapper around Polaris Card with consistent padding/shadows.

```jsx
import { CustomCard } from '../components/ui';

<CustomCard padding="md" shadow="default">
  Card content
</CustomCard>
```

### CustomModal

Wrapper around Polaris Modal with backdrop fix and consistent sizing.

```jsx
import { CustomModal } from '../components/ui';

<CustomModal
  open={isOpen}
  onClose={handleClose}
  size="medium"
  title="Modal Title"
>
  Modal content
</CustomModal>
```

### CustomTextField

Wrapper around Polaris TextField with consistent label styles.

```jsx
import { CustomTextField } from '../components/ui';

<CustomTextField
  label="Email"
  value={email}
  onChange={setEmail}
  helpText="Enter your email address"
/>
```

### CustomSelect

Wrapper around Polaris Select with consistent styles.

```jsx
import { CustomSelect } from '../components/ui';

<CustomSelect
  label="Country"
  options={countries}
  value={selectedCountry}
  onChange={setSelectedCountry}
/>
```

### CustomCheckbox

Wrapper around Polaris Checkbox with custom styling.

```jsx
import { CustomCheckbox } from '../components/ui';

<CustomCheckbox
  label="I agree to terms"
  checked={agreed}
  onChange={setAgreed}
/>
```

### TagBadge

Reusable tag/badge component.

```jsx
import { TagBadge } from '../components/ui';

<TagBadge tone="info" size="medium" removable onRemove={handleRemove}>
  Tag Label
</TagBadge>
```

### PhoneInput

Phone input with country code selector.

```jsx
import { PhoneInput } from '../components/ui';

<PhoneInput
  label="Phone"
  value={phone}
  onChange={setPhone}
  defaultCountryCode="+91"
/>
```

### PageLayout

Consistent page layout wrapper.

```jsx
import { PageLayout } from '../components/ui';

<PageLayout
  title="Page Title"
  subtitle="Page subtitle"
  primaryAction={{ content: 'Save', onAction: handleSave }}
>
  Page content
</PageLayout>
```

### FormSection

Reusable form section with title and content.

```jsx
import { FormSection } from '../components/ui';

<FormSection
  title="Customer Information"
  description="Enter customer details"
>
  <CustomTextField label="Name" />
  <CustomTextField label="Email" />
</FormSection>
```

### ActionHeader

Page header with title and action buttons.

```jsx
import { ActionHeader } from '../components/ui';

<ActionHeader
  title="Customers"
  subtitle="Manage your customers"
  primaryAction={{ content: 'Add Customer', onAction: handleAdd }}
  secondaryActions={[
    { content: 'Import', onAction: handleImport },
    { content: 'Export', onAction: handleExport }
  ]}
/>
```

## Page Organization

Each page should have its own folder with:
- `[PageName].jsx` - The page component
- `[page-name].css` - Page-specific styles

### Example Structure

```
src/pages/Customers/
├── CustomersPage.jsx
└── customers.css
```

### Importing Page Styles

```jsx
// In CustomersPage.jsx
import './customers.css';
```

## Best Practices

1. **Use CSS Variables**: Always use CSS variables from `globals.css` instead of hardcoded values
2. **Use Reusable Components**: Prefer UI components from `components/ui/` over raw Polaris components
3. **Page-Specific Styles**: Keep page-specific styles in dedicated CSS files
4. **Theme Configuration**: Update theme config for design changes, not individual components
5. **Consistent Spacing**: Use spacing scale (xs, sm, md, lg, xl, 2xl)
6. **Consistent Colors**: Use color palette from theme config
7. **Responsive Design**: Use breakpoints from theme config

## Migration Guide

When refactoring existing pages:

1. Remove inline `<style>` tags
2. Move styles to page-specific CSS file
3. Replace hardcoded values with CSS variables
4. Replace Polaris components with custom UI components where applicable
5. Import page CSS file at the top of the component

## Example Migration

### Before

```jsx
function MyPage() {
  return (
    <>
      <style>{`
        .my-page {
          padding: 20px;
          background: #f6f6f7;
        }
      `}</style>
      <div className="my-page">
        <Button variant="primary">Click</Button>
      </div>
    </>
  );
}
```

### After

```jsx
import './my-page.css';
import { CustomButton } from '../components/ui';

function MyPage() {
  return (
    <div className="my-page">
      <CustomButton variant="primary">Click</CustomButton>
    </div>
  );
}
```

```css
/* my-page.css */
.my-page {
  padding: var(--spacing-md);
  background: var(--color-bg-secondary);
}
```

