# Folder Structure Documentation

## Overview
This is a Shopify Admin Dashboard application built with Next.js 14 (App Router), React 18, and Shopify Polaris. The application provides a dashboard interface for managing properties, customers, orders, analytics, and settings.

---

## Root Directory

```
shopify-dashboard/
├── app/                          # Next.js App Router directory (main application)
├── src/                          # Source code directory (React components and pages)
├── public/                       # Static assets served directly
├── dist/                         # Build output directory
├── node_modules/                 # Dependencies
├── next.config.js                # Next.js configuration
├── vite.config.js                # Vite configuration (if used)
├── package.json                  # Project dependencies and scripts
├── package-lock.json             # Dependency lock file
├── jsconfig.json                 # JavaScript project configuration
├── eslint.config.js              # ESLint configuration
├── vercel.json                   # Vercel deployment configuration
├── index.html                    # HTML entry point
├── README.md                     # Project documentation
├── DESIGN_SYSTEM.md              # Design system documentation
└── FOLDER_STRUCTURE.md           # This file
```

---

## Core Directories

### 📁 `app/`
Next.js App Router directory. Each folder represents a route segment, and `page.jsx` files define pages.

```
app/
├── layout.jsx                    # Root layout component (wraps all pages)
├── page.jsx                      # Home/landing page
├── providers.jsx                 # React context providers wrapper
├── login/                        # Login route
│   └── page.jsx
├── property-manager-signup/      # Property manager signup route
│   └── page.jsx
├── [userType]/                   # Dynamic route segment for user types
│   ├── [[...slug]]/              # Catch-all route with optional segments
│   │   └── page.jsx
│   └── login/
│       └── page.jsx
├── dashboard/                    # Dashboard routes
│   └── [[...slug]]/              # Catch-all route for dashboard pages
│       └── page.jsx
└── settings/                     # Settings routes
    ├── page.jsx                  # Main settings page
    ├── alternative-providers/
    │   └── page.jsx
    ├── app-development/
    │   └── page.jsx
    ├── billing/
    │   └── profile/
    │       └── page.jsx
    ├── notifications/
    │   ├── customer/
    │   │   └── page.jsx
    │   ├── staff/
    │   │   └── page.jsx
    │   └── webhooks/
    │       └── page.jsx
    └── third-party-providers/
        └── page.jsx
```

**Note:** 
- `[userType]` is a dynamic route segment
- `[[...slug]]` is a catch-all route that matches zero or more path segments

---

### 📁 `src/`
Source code directory containing React components, pages, styles, and utilities.

```
src/
├── App.jsx                       # Main React application component
├── main.jsx                      # React application entry point
├── index.css                     # Global CSS styles
├── assets/                       # Static assets processed by build system
│   ├── react.svg
│   ├── shopify-logo.svg
│   └── sidekick.svg
├── components/                   # Reusable React components
│   ├── AddCustomer.jsx
│   ├── AddDeveloper.jsx
│   ├── AddProject.jsx
│   ├── AddProperty.jsx
│   ├── AnalyticsPage.jsx
│   ├── CreateOrder.jsx
│   ├── CustomersPage.jsx
│   ├── DeveloperViewPage.jsx
│   ├── GoogleMapPicker.jsx
│   ├── OrdersPage.jsx
│   ├── ProjectsPage.jsx
│   ├── ProjectViewPage.jsx
│   ├── PropertiesPage.jsx
│   ├── PropertyOwnersPage.jsx
│   ├── PropertyViewPage.jsx
│   ├── Shopifyheader.jsx
│   ├── SidekickPanel.jsx
│   ├── Analytics/                # Analytics feature components
│   │   ├── cards/                # Analytics card components
│   │   │   ├── CohortTable.jsx
│   │   │   ├── ConversionFunnel.jsx
│   │   │   ├── DeviceTypeChart.jsx
│   │   │   ├── NoDataPlaceholder.jsx
│   │   │   ├── ProductSalesList.jsx
│   │   │   ├── ProductsBySellThroughRate.jsx
│   │   │   ├── SalesAttributedToMarketing.jsx
│   │   │   ├── SalesBreakdown.jsx
│   │   │   ├── SessionsByLandingPage.jsx
│   │   │   ├── SessionsByLocation.jsx
│   │   │   ├── SessionsByReferrer.jsx
│   │   │   ├── SessionsBySocialReferrer.jsx
│   │   │   ├── StatCard.jsx
│   │   │   ├── TotalSalesByReferrer.jsx
│   │   │   └── TotalSalesBySocialReferrer.jsx
│   │   ├── ChartHeading.jsx
│   │   ├── charts/               # Chart components
│   │   │   ├── DonutChartWithHover.jsx
│   │   │   ├── LineChart.jsx
│   │   │   ├── SimpleLineChart.jsx
│   │   │   └── Sparkline.jsx
│   │   ├── constants.js          # Analytics constants
│   │   └── modals/               # Analytics modal components
│   │       ├── ComparisonDatePickerModal.jsx
│   │       ├── CurrencySelector.jsx
│   │       └── DatePickerModal.jsx
│   ├── bookings/                 # Booking-related components
│   │   ├── BookingsStats.jsx
│   │   ├── EmailCustomerModal.jsx
│   │   ├── SendInvoiceModal.jsx
│   │   └── index.js
│   ├── Settings/                 # Settings feature components
│   │   ├── AppsSettings.jsx
│   │   ├── BillingSettings.jsx
│   │   ├── GeneralSettings.jsx
│   │   ├── NotificationsSettings.jsx
│   │   ├── PlanSettings.jsx
│   │   ├── RolesSettings.jsx
│   │   ├── SecuritySettings.jsx
│   │   ├── SettingsNavigation.jsx
│   │   ├── TransactionsSettings.jsx
│   │   ├── UsersSettings.jsx
│   │   └── styles/               # Settings-specific styles
│   │       ├── AppDevelopment.css
│   │       ├── AppsSettings.css
│   │       ├── BillingSettings.css
│   │       ├── CustomerNotifications.css
│   │       ├── GeneralSettings.css
│   │       ├── NotificationsSettings.css
│   │       ├── PlanSettings.css
│   │       ├── RolesSettings.css
│   │       ├── SecuritySettings.css
│   │       ├── SettingsLayout.css
│   │       ├── SettingsNavigation.css
│   │       ├── SettingsResponsive.css
│   │       ├── StaffNotifications.css
│   │       ├── TransactionsSettings.css
│   │       ├── UsersSettings.css
│   │       └── WebhooksSettings.css
│   ├── styles/                   # Component-specific styles
│   │   ├── AddCustomer.css
│   │   ├── AddDeveloper.css
│   │   ├── CreateOrder.css
│   │   ├── CustomersPage.css
│   │   ├── Shopifyheader.css
│   │   └── SidekickPanel.css
│   └── ui/                       # Reusable UI components
│       ├── ActionHeader.jsx
│       ├── CustomButton.jsx
│       ├── CustomCard.jsx
│       ├── CustomCheckbox.jsx
│       ├── CustomModal.jsx
│       ├── CustomSelect.jsx
│       ├── CustomTextField.jsx
│       ├── FormSection.jsx
│       ├── PageLayout.jsx
│       ├── PhoneInput.jsx
│       ├── TagBadge.jsx
│       ├── ui.css
│       └── index.js
├── pages/                        # Page components (alternative routing)
│   ├── AddCustomer/
│   │   └── AddCustomerPage.jsx
│   ├── Analytics/
│   │   ├── analytics.css
│   │   └── AnalyticsPage.jsx
│   ├── Customers/
│   │   ├── customers.css
│   │   └── CustomersPage.jsx
│   ├── Dashboard/
│   │   ├── dashboard.css
│   │   ├── index.jsx
│   │   ├── propertyDeveloperDashboard.css
│   │   └── PropertyDeveloperDashboard.jsx
│   ├── Login/
│   │   ├── login.css
│   │   └── LoginPage.jsx
│   ├── Settings/
│   │   ├── settings.css
│   │   └── SettingsPage.jsx
│   ├── Login.jsx
│   ├── PropertyManagerSignup.jsx
│   ├── PropertyManagerSignup.css
│   ├── UserTypeSelection.jsx
│   └── UserTypeSelection.css
├── data/                         # Static data files
│   ├── developers.js
│   ├── projects.js
│   └── properties.js
├── styles/                       # Global styles
│   ├── globals.css
│   └── user-type-selection.css
└── theme/                        # Theme configuration
    └── theme.config.js
```

---

### 📁 `public/`
Static assets served directly without processing. Files in this directory are accessible at the root URL.

```
public/
├── images/                       # Image assets
│   ├── app.png
│   ├── cart.png
│   ├── meter.png
│   ├── Installedchannels/       # Installed channel images
│   │   ├── imgi_7_2d8d7e95e9c424cbc0ba3ca8374ef1ed_200x200.png
│   │   ├── imgi_10_9e850173749ed1fed1175c97237dc3cb_200x200.png
│   │   └── [additional channel images...]
│   ├── properties/               # Property images
│   │   ├── dillon-kydd-2keCPb73aQY-unsplash.jpg
│   │   ├── frames-for-your-heart-mR1CIDduGLc-unsplash.jpg
│   │   ├── germany-bg.jpg
│   │   └── marcin-nowak-iXqTqC-f6jI-unsplash.jpg
│   └── UninstalledChannels/     # Uninstalled channel images (empty)
├── logos/                        # Logo files
│   ├── nest-quest-black.svg
│   ├── nest-quest.svg
│   ├── shopify-logo-mono.svg
│   ├── shopify-logo.svg
│   └── sidekick.svg
├── svg/                          # SVG assets
│   ├── cards/                    # Card SVG icons
│   │   ├── imgi_10_2c2bf.svg
│   │   ├── imgi_11_cd169.svg
│   │   └── [additional card SVGs...]
│   └── settingsSvg/
│       └── news.svg
└── vite.svg                      # Vite logo
```

---

### 📁 `dist/`
Build output directory (generated during build process).

```
dist/
├── assets/                       # Compiled and bundled assets
│   ├── index-B_YjV22z.js        # Main application bundle
│   ├── index-YqT5JOFp.css       # Main styles bundle
│   ├── vendor-CE1u22g3.js       # Vendor dependencies bundle
│   └── vendor-MUildqM1.css      # Vendor styles bundle
├── index.html                    # Generated HTML entry point
├── logos/                        # Copied logo assets
│   ├── shopify-logo-mono.svg
│   ├── shopify-logo.svg
│   └── sidekick.svg
└── vite.svg
```

---

## Architecture Patterns

### Next.js App Router
- **File-based routing**: Routes are defined by the folder structure in `app/`
- **Layouts**: `layout.jsx` files wrap pages and persist across route changes
- **Pages**: `page.jsx` files define the UI for a route
- **Dynamic routes**: `[param]` syntax for dynamic segments
- **Catch-all routes**: `[[...slug]]` for optional catch-all segments

### Component Organization
- **Feature-based**: Components are organized by feature (Analytics, Settings, Bookings)
- **Reusable UI**: Generic UI components in `src/components/ui/`
- **Page components**: Full-page components in `src/components/` and `src/pages/`
- **Styles**: Component-specific styles co-located with components or in `styles/` directories

### State Management
- React Context via `providers.jsx` in the app directory
- Component-level state management
- Shopify Polaris components for UI state

---

## Key Configuration Files

- **`next.config.js`**: Next.js configuration (routing, build options, etc.)
- **`vite.config.js`**: Vite configuration (if used for development)
- **`package.json`**: Project dependencies, scripts, and metadata
- **`jsconfig.json`**: JavaScript project configuration (path aliases, etc.)
- **`eslint.config.js`**: ESLint linting rules
- **`vercel.json`**: Vercel deployment configuration

---

## Development Scripts

From `package.json`:
- `npm run dev`: Start Next.js development server
- `npm run build`: Build the application for production
- `npm run start`: Start the production server
- `npm run lint`: Run ESLint to check code quality

---

## Key Technologies

- **Next.js 14**: React framework with App Router
- **React 18**: UI library
- **Shopify Polaris**: Component library and design system
- **React Router**: Client-side routing (used in src/)
- **Vite**: Build tool (for development)

---

## Notes

- This project uses Next.js App Router for routing in the `app/` directory
- The `src/` directory contains React components that may use React Router for alternative routing
- Dynamic routes use `[param]` syntax (e.g., `[userType]`)
- Catch-all routes use `[[...slug]]` syntax for optional segments
- Static assets in `public/` are served at the root URL (e.g., `/logos/shopify-logo.svg`)
- The application uses Shopify Polaris for consistent UI components
- Build output is generated in the `dist/` directory

---

## Route Structure

### Main Routes (App Router)
- `/` - Home page
- `/login` - Login page
- `/property-manager-signup` - Property manager signup
- `/[userType]/...` - Dynamic user type routes
- `/dashboard/...` - Dashboard routes with catch-all segments
- `/settings` - Settings pages
  - `/settings/alternative-providers`
  - `/settings/app-development`
  - `/settings/billing/profile`
  - `/settings/notifications/customer`
  - `/settings/notifications/staff`
  - `/settings/notifications/webhooks`
  - `/settings/third-party-providers`
