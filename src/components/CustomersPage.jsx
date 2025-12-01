import { useState, useCallback } from 'react';
import {
  Page,
  Card,
  IndexTable,
  Text,
  Badge,
  TextField,
  Button,
  ButtonGroup,
  InlineStack,
  BlockStack,
  Box,
  Pagination,
  useIndexResourceState,
  Icon,
  Popover,
  ChoiceList,
  Divider,
  Modal,
  DropZone,
  Banner,
  Link,
  Checkbox,
} from '@shopify/polaris';
import { 
  SearchIcon, 
  PersonIcon,
  LayoutColumns3Icon,
  SortIcon,
  ViewIcon,
  HideIcon,
  PlusIcon,
} from '@shopify/polaris-icons';
import AddCustomer from './AddCustomer';

// Extended customer data with all fields from screenshots
const customersData = [
  {
    id: '1',
    name: 'sumaiya .',
    note: '',
    emailSubscription: 'subscribed',
    location: 'Kanchipuram TN, India',
    orders: 1,
    amountSpent: 819.19,
    currency: '₹',
    odooId: '9458000232492',
    firstName: 'sumaiya',
    lastName: '.',
    email: 'sumaiyaf708@gmail.com',
    phone: '+91 81488 48980',
    smsSubscription: false,
    postalCode: '600088',
    taxExempt: false,
    mergeable: true,
    deletable: false,
    customerLanguage: 'en',
    customerAddedDate: 'Today at 3:26 pm',
    dateCustomerUpdated: 'Today at 3:26 pm',
  },
  {
    id: '2',
    name: 'Nihal ji',
    note: '',
    emailSubscription: 'subscribed',
    location: 'Bangalore KA, India',
    orders: 4,
    amountSpent: 498.00,
    currency: '₹',
    odooId: '9208396021804',
    firstName: 'Nihal',
    lastName: 'ji',
    email: 'khannihal99@gmail.com',
    phone: '',
    smsSubscription: false,
    postalCode: '560030',
    taxExempt: false,
    mergeable: true,
    deletable: false,
    customerLanguage: 'en',
    customerAddedDate: 'Oct 1 at 10:52 pm',
    dateCustomerUpdated: 'Today at 1:01 pm',
  },
  {
    id: '3',
    name: 'Shifa .',
    note: '',
    emailSubscription: 'not_subscribed',
    location: 'Davangere KA, India',
    orders: 1,
    amountSpent: 0.00,
    currency: '₹',
    odooId: '9452893732908',
    firstName: 'Shifa',
    lastName: '.',
    email: '',
    phone: '+91 72597 42751',
    smsSubscription: false,
    postalCode: '577601',
    taxExempt: false,
    mergeable: true,
    deletable: false,
    customerLanguage: 'en',
    customerAddedDate: 'Yesterday at 11:18 pm',
    dateCustomerUpdated: 'Today at 11:44 am',
  },
  {
    id: '4',
    name: 'Shadab Hussain',
    note: '',
    emailSubscription: 'subscribed',
    location: 'Bangalore KA, India',
    orders: 2,
    amountSpent: 5462.76,
    currency: '₹',
    odooId: '9031154761772',
    firstName: 'Shadab',
    lastName: 'Hussain',
    email: 'dolly18.dd@gmail.com',
    phone: '+91 78299 97414',
    smsSubscription: false,
    postalCode: '560051',
    taxExempt: false,
    mergeable: true,
    deletable: false,
    customerLanguage: 'en',
    customerAddedDate: 'Aug 29 at 7:56 pm',
    dateCustomerUpdated: 'Today at 9:55 am',
  },
  {
    id: '5',
    name: 'Huda1028.h@gmail.com',
    note: '',
    emailSubscription: 'not_subscribed',
    location: '',
    orders: 0,
    amountSpent: 0.00,
    currency: '₹',
    odooId: '9453058949164',
    firstName: '',
    lastName: '',
    email: 'Huda1028.h@gmail.com',
    phone: '+91 73378 66837',
    smsSubscription: false,
    postalCode: '',
    taxExempt: false,
    mergeable: true,
    deletable: true,
    customerLanguage: 'en',
    customerAddedDate: 'Yesterday at 11:43 pm',
    dateCustomerUpdated: 'Yesterday at 11:43 pm',
  },
  {
    id: '6',
    name: 'Uzma T',
    note: '',
    emailSubscription: 'subscribed',
    location: 'Bangalore KA, India',
    orders: 15,
    amountSpent: 19019.50,
    currency: '₹',
    odooId: '8729144098860',
    firstName: 'Uzma',
    lastName: 'T',
    email: 'uzmat1410@gmail.com',
    phone: '+91 77953 76748',
    smsSubscription: false,
    postalCode: '560077',
    taxExempt: false,
    mergeable: true,
    deletable: false,
    customerLanguage: 'en',
    customerAddedDate: 'Jun 20 at 12:22 am',
    dateCustomerUpdated: 'Yesterday at 11:26 pm',
  },
  {
    id: '7',
    name: 'Shifa .',
    note: '',
    emailSubscription: 'not_subscribed',
    location: 'Davangere KA, India',
    orders: 1,
    amountSpent: 2660.00,
    currency: '₹',
    odooId: '9452910805036',
    firstName: 'Shifa',
    lastName: '.',
    email: '',
    phone: '',
    smsSubscription: false,
    postalCode: '577601',
    taxExempt: false,
    mergeable: true,
    deletable: false,
    customerLanguage: 'en',
    customerAddedDate: 'Yesterday at 11:20 pm',
    dateCustomerUpdated: 'Yesterday at 11:20 pm',
  },
  {
    id: '8',
    name: 'Syed younus',
    note: '',
    emailSubscription: 'subscribed',
    location: 'Hyderabad TG, India',
    orders: 1,
    amountSpent: 1198.00,
    currency: '₹',
    odooId: '9452467814444',
    firstName: 'Syed',
    lastName: 'younus',
    email: 'lishabawazeer23@gmail.com',
    phone: '+91 79810 50878',
    smsSubscription: false,
    postalCode: '500028',
    taxExempt: false,
    mergeable: true,
    deletable: false,
    customerLanguage: 'en',
    customerAddedDate: 'Yesterday at 10:11 pm',
    dateCustomerUpdated: 'Yesterday at 10:11 pm',
  },
  {
    id: '9',
    name: 'Sana .',
    note: '',
    emailSubscription: 'subscribed',
    location: 'Bangalore KA, India',
    orders: 1,
    amountSpent: 2849.05,
    currency: '₹',
    odooId: '9451810324524',
    firstName: 'Sana',
    lastName: '.',
    email: 'sanasuhail92@gmail.com',
    phone: '+91 97421 17800',
    smsSubscription: false,
    postalCode: '560005',
    taxExempt: false,
    mergeable: true,
    deletable: false,
    customerLanguage: 'en',
    customerAddedDate: 'Yesterday at 8:16 pm',
    dateCustomerUpdated: 'Yesterday at 8:16 pm',
  },
  {
    id: '10',
    name: 'Bharti Sharma',
    note: '',
    emailSubscription: 'subscribed',
    location: 'Gurgaon HR, India',
    orders: 1,
    amountSpent: 892.00,
    currency: '₹',
    odooId: '9451555651628',
    firstName: 'Bharti',
    lastName: 'Sharma',
    email: 'bhartiyuvaan16@gmail.com',
    phone: '+91 87002 30998',
    smsSubscription: false,
    postalCode: '122002',
    taxExempt: false,
    mergeable: true,
    deletable: false,
    customerLanguage: 'en',
    customerAddedDate: 'Yesterday at 7:26 pm',
    dateCustomerUpdated: 'Yesterday at 7:26 pm',
  },
  {
    id: '11',
    name: 'Chandani Khan',
    note: '',
    emailSubscription: 'subscribed',
    location: 'Jharsuguda OR, India',
    orders: 3,
    amountSpent: 969.75,
    currency: '₹',
    odooId: '9207741415468',
    firstName: 'Chandani',
    lastName: 'Khan',
    email: 'zk5757601@gmail.com',
    phone: '+91 87099 19554',
    smsSubscription: false,
    postalCode: '768201',
    taxExempt: false,
    mergeable: true,
    deletable: false,
    customerLanguage: 'en',
    customerAddedDate: 'Oct 1 at 6:15 pm',
    dateCustomerUpdated: 'Yesterday at 6:59 pm',
  },
  {
    id: '12',
    name: 'sara dastagir',
    note: '',
    emailSubscription: 'not_subscribed',
    location: 'Bangalore KA, India',
    orders: 1,
    amountSpent: 421.05,
    currency: '₹',
    odooId: '9451200544812',
    firstName: 'sara',
    lastName: 'dastagir',
    email: '',
    phone: '',
    smsSubscription: false,
    postalCode: '560047',
    taxExempt: false,
    mergeable: true,
    deletable: false,
    customerLanguage: 'en',
    customerAddedDate: 'Yesterday at 5:59 pm',
    dateCustomerUpdated: 'Yesterday at 5:59 pm',
  },
  {
    id: '13',
    name: 'Rakshitha Naveen',
    note: '',
    emailSubscription: 'subscribed',
    location: 'Bangalore KA, India',
    orders: 1,
    amountSpent: 1198.00,
    currency: '₹',
    odooId: '9450878664748',
    firstName: 'Rakshitha',
    lastName: 'Naveen',
    email: 'raksharakshitha035@gmail.com',
    phone: '',
    smsSubscription: false,
    postalCode: '562106',
    taxExempt: false,
    mergeable: true,
    deletable: false,
    customerLanguage: 'en',
    customerAddedDate: 'Yesterday at 4:22 pm',
    dateCustomerUpdated: 'Yesterday at 4:22 pm',
  },
  {
    id: '14',
    name: '+91 9611 668 459',
    note: '',
    emailSubscription: 'not_subscribed',
    location: '',
    orders: 0,
    amountSpent: 0.00,
    currency: '₹',
    odooId: '9450877222956',
    firstName: '',
    lastName: '',
    email: '',
    phone: '+91 96116 68459',
    smsSubscription: false,
    postalCode: '',
    taxExempt: false,
    mergeable: true,
    deletable: true,
    customerLanguage: 'en',
    customerAddedDate: 'Yesterday at 4:20 pm',
    dateCustomerUpdated: 'Yesterday at 4:20 pm',
  },
  {
    id: '15',
    name: 'rakshithasriraksha0@gmail.com',
    note: '',
    emailSubscription: 'subscribed',
    location: 'India',
    orders: 0,
    amountSpent: 0.00,
    currency: '₹',
    odooId: '9450874601516',
    firstName: '',
    lastName: '',
    email: 'rakshithasriraksha0@gmail.com',
    phone: '',
    smsSubscription: false,
    postalCode: '',
    taxExempt: false,
    mergeable: true,
    deletable: true,
    customerLanguage: 'en',
    customerAddedDate: 'Yesterday at 4:19 pm',
    dateCustomerUpdated: 'Yesterday at 4:19 pm',
  },
];

// All available columns
const allColumns = [
  { id: 'name', title: 'Customer name', default: true },
  { id: 'note', title: 'Note', default: false },
  { id: 'emailSubscription', title: 'Email subscription', default: true },
  { id: 'location', title: 'Location', default: true },
  { id: 'orders', title: 'Orders', default: true },
  { id: 'amountSpent', title: 'Amount spent', default: true, alignment: 'end' },
  { id: 'odooId', title: 'Id', default: false },
  { id: 'firstName', title: 'First name', default: false },
  { id: 'lastName', title: 'Last name', default: false },
  { id: 'email', title: 'Email', default: false },
  { id: 'phone', title: 'Phone', default: false },
  { id: 'smsSubscription', title: 'SMS subscription', default: false },
  { id: 'postalCode', title: 'Postal code', default: false },
  { id: 'taxExempt', title: 'Tax exempt', default: false },
  { id: 'mergeable', title: 'Mergeable', default: false },
  { id: 'deletable', title: 'Deletable', default: false },
  { id: 'customerLanguage', title: 'Customer language', default: false },
  { id: 'customerAddedDate', title: 'Customer added date', default: false },
  { id: 'dateCustomerUpdated', title: 'Date customer updated', default: false },
];

// Sort options
const sortOptions = [
  { value: 'lastUpdate', label: 'Last update' },
  { value: 'amountSpent', label: 'Amount spent' },
  { value: 'totalOrders', label: 'Total orders' },
  { value: 'lastOrderDate', label: 'Last order date' },
  { value: 'firstOrderDate', label: 'First order date' },
  { value: 'dateAdded', label: 'Date added as customer' },
  { value: 'lastAbandonedOrderDate', label: 'Last abandoned order date' },
];

// LocalStorage keys
const STORAGE_KEYS = {
  VISIBLE_COLUMNS: 'shopify_customers_visible_columns',
  SORT_BY: 'shopify_customers_sort_by',
  SORT_DIRECTION: 'shopify_customers_sort_direction',
};

// Helper functions for localStorage
const getStoredColumns = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.VISIBLE_COLUMNS);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Ensure 'name' is always included
      if (!parsed.includes('name')) {
        parsed.unshift('name');
      }
      return parsed;
    }
  } catch (e) {
    console.error('Error reading from localStorage:', e);
  }
  return null;
};

const getStoredSort = () => {
  try {
    const sortBy = localStorage.getItem(STORAGE_KEYS.SORT_BY);
    const sortDir = localStorage.getItem(STORAGE_KEYS.SORT_DIRECTION);
    return {
      sortBy: sortBy || 'lastUpdate',
      sortDirection: sortDir || 'desc',
    };
  } catch (e) {
    console.error('Error reading from localStorage:', e);
  }
  return { sortBy: 'lastUpdate', sortDirection: 'desc' };
};

function CustomersPage() {
  const [searchValue, setSearchValue] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortPopoverActive, setSortPopoverActive] = useState(false);
  const [editColumnsMode, setEditColumnsMode] = useState(false);
  
  // Modal states
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [addCustomerOpen, setAddCustomerOpen] = useState(false);
  const [exportOption, setExportOption] = useState(['all']);
  const [exportFormat, setExportFormat] = useState(['csv_excel']);
  const [importFile, setImportFile] = useState(null);
  const [includeCustomerTags, setIncludeCustomerTags] = useState(true);
  const [includeCustomerMetafields, setIncludeCustomerMetafields] = useState(true);
  
  // Initialize sort from localStorage
  const storedSort = getStoredSort();
  const [selectedSort, setSelectedSort] = useState(storedSort.sortBy);
  const [sortDirection, setSortDirection] = useState(storedSort.sortDirection);
  
  // Default visible columns (name is always visible)
  const defaultColumns = allColumns.filter(col => col.default).map(col => col.id);
  
  // Initialize visible columns from localStorage or use defaults
  const [visibleColumns, setVisibleColumns] = useState(() => {
    const stored = getStoredColumns();
    return stored || defaultColumns;
  });
  const [tempVisibleColumns, setTempVisibleColumns] = useState(() => {
    const stored = getStoredColumns();
    return stored || defaultColumns;
  });
  
  const itemsPerPage = 50;
  
  const resourceName = {
    singular: 'customer',
    plural: 'customers',
  };

  const { selectedResources, allResourcesSelected, handleSelectionChange } =
    useIndexResourceState(customersData);

  const handleSearchChange = useCallback((value) => {
    setSearchValue(value);
  }, []);

  const handleSearchClear = useCallback(() => {
    setSearchValue('');
  }, []);

  const toggleSortPopover = useCallback(() => {
    setSortPopoverActive((active) => !active);
  }, []);

  const handleEditColumnsClick = useCallback(() => {
    setTempVisibleColumns([...visibleColumns]);
    setEditColumnsMode(true);
  }, [visibleColumns]);

  const handleCancelEditColumns = useCallback(() => {
    setTempVisibleColumns([...visibleColumns]);
    setEditColumnsMode(false);
  }, [visibleColumns]);

  const handleSaveColumns = useCallback(() => {
    setVisibleColumns([...tempVisibleColumns]);
    // Save to localStorage
    try {
      localStorage.setItem(STORAGE_KEYS.VISIBLE_COLUMNS, JSON.stringify(tempVisibleColumns));
    } catch (e) {
      console.error('Error saving to localStorage:', e);
    }
    setEditColumnsMode(false);
  }, [tempVisibleColumns]);

  const toggleColumnVisibility = useCallback((columnId) => {
    // Don't allow toggling 'name' column - it's always visible
    if (columnId === 'name') return;
    
    setTempVisibleColumns(prev => {
      if (prev.includes(columnId)) {
        return prev.filter(id => id !== columnId);
      } else {
        return [...prev, columnId];
      }
    });
  }, []);

  const handleSortChange = useCallback((value) => {
    setSelectedSort(value[0]);
    // Save to localStorage
    try {
      localStorage.setItem(STORAGE_KEYS.SORT_BY, value[0]);
    } catch (e) {
      console.error('Error saving to localStorage:', e);
    }
  }, []);

  const handleSortDirectionChange = useCallback((value) => {
    setSortDirection(value[0]);
    // Save to localStorage
    try {
      localStorage.setItem(STORAGE_KEYS.SORT_DIRECTION, value[0]);
    } catch (e) {
      console.error('Error saving to localStorage:', e);
    }
  }, []);

  // Export modal handlers
  const handleExportModalOpen = useCallback(() => {
    setExportModalOpen(true);
  }, []);

  const handleExportModalClose = useCallback(() => {
    setExportModalOpen(false);
  }, []);

  const handleExportOptionChange = useCallback((value) => {
    setExportOption(value);
  }, []);

  const handleExportFormatChange = useCallback((value) => {
    setExportFormat(value);
  }, []);

  const handleExport = useCallback(() => {
    console.log('Exporting:', { 
      option: exportOption[0], 
      format: exportFormat[0],
      includeCustomerTags,
      includeCustomerMetafields 
    });
    setExportModalOpen(false);
  }, [exportOption, exportFormat, includeCustomerTags, includeCustomerMetafields]);

  // Import modal handlers
  const handleImportModalOpen = useCallback(() => {
    setImportModalOpen(true);
  }, []);

  const handleImportModalClose = useCallback(() => {
    setImportModalOpen(false);
    setImportFile(null);
  }, []);

  const handleDropZoneDrop = useCallback((files) => {
    setImportFile(files[0]);
  }, []);

  const handleImport = useCallback(() => {
    console.log('Importing file:', importFile);
    setImportModalOpen(false);
    setImportFile(null);
  }, [importFile]);

  // Filter customers based on search
  const filteredCustomers = customersData.filter((customer) =>
    customer.name.toLowerCase().includes(searchValue.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchValue.toLowerCase()) ||
    customer.location.toLowerCase().includes(searchValue.toLowerCase())
  );

  // Sort customers
  const sortedCustomers = [...filteredCustomers].sort((a, b) => {
    let comparison = 0;
    switch (selectedSort) {
      case 'amountSpent':
        comparison = a.amountSpent - b.amountSpent;
        break;
      case 'totalOrders':
        comparison = a.orders - b.orders;
        break;
      default:
        comparison = 0;
    }
    return sortDirection === 'desc' ? -comparison : comparison;
  });

  const totalCustomers = 6132;

  const formatCurrency = (amount, currency) => {
    return `${currency}${amount.toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const formatOrders = (count) => {
    if (count === 0) return '0 orders';
    return count === 1 ? '1 order' : `${count} orders`;
  };

  // Get current visible columns for normal view
  const currentVisibleColumns = allColumns.filter(col => visibleColumns.includes(col.id));

  // Render cell content based on column id
  const renderCellContent = (customer, columnId) => {
    switch (columnId) {
      case 'name':
        return (
          <Text variant="bodyMd" fontWeight="semibold" as="span">
            {customer.name}
          </Text>
        );
      case 'note':
        return (
          <Text variant="bodyMd" as="span" tone="subdued">
            {customer.note || ''}
          </Text>
        );
      case 'emailSubscription':
        return customer.emailSubscription === 'subscribed' ? (
          <Badge tone="success">Subscribed</Badge>
        ) : (
          <Badge tone="subdued">Not subscribed</Badge>
        );
      case 'location':
        return (
          <Text variant="bodyMd" as="span" tone="subdued">
            {customer.location || ''}
          </Text>
        );
      case 'orders':
        return (
          <Text variant="bodyMd" as="span">
            {formatOrders(customer.orders)}
          </Text>
        );
      case 'amountSpent':
        return (
          <Text variant="bodyMd" as="span">
            {formatCurrency(customer.amountSpent, customer.currency)}
          </Text>
        );
      case 'odooId':
        return (
          <Text variant="bodyMd" as="span" tone="subdued">
            {customer.odooId}
          </Text>
        );
      case 'firstName':
        return (
          <Text variant="bodyMd" as="span">
            {customer.firstName}
          </Text>
        );
      case 'lastName':
        return (
          <Text variant="bodyMd" as="span">
            {customer.lastName}
          </Text>
        );
      case 'email':
        return (
          <Text variant="bodyMd" as="span" tone="subdued">
            {customer.email}
          </Text>
        );
      case 'phone':
        return (
          <Text variant="bodyMd" as="span" tone="subdued">
            {customer.phone}
          </Text>
        );
      case 'smsSubscription':
        return (
          <Text variant="bodyMd" as="span" tone="subdued">
            {customer.smsSubscription ? '✓' : ''}
          </Text>
        );
      case 'postalCode':
        return (
          <Text variant="bodyMd" as="span">
            {customer.postalCode}
          </Text>
        );
      case 'taxExempt':
        return (
          <Text variant="bodyMd" as="span" tone="subdued">
            {customer.taxExempt ? '✓' : '✕'}
          </Text>
        );
      case 'mergeable':
        return (
          <Text variant="bodyMd" as="span" tone="subdued">
            {customer.mergeable ? '✓' : '✕'}
          </Text>
        );
      case 'deletable':
        return (
          <Text variant="bodyMd" as="span" tone="subdued">
            {customer.deletable ? '✓' : '✕'}
          </Text>
        );
      case 'customerLanguage':
        return (
          <Text variant="bodyMd" as="span" tone="subdued">
            {customer.customerLanguage}
          </Text>
        );
      case 'customerAddedDate':
        return (
          <Text variant="bodyMd" as="span" tone="subdued">
            {customer.customerAddedDate}
          </Text>
        );
      case 'dateCustomerUpdated':
        return (
          <Text variant="bodyMd" as="span" tone="subdued">
            {customer.dateCustomerUpdated}
          </Text>
        );
      default:
        return null;
    }
  };

  const rowMarkup = sortedCustomers.map((customer, index) => (
    <IndexTable.Row
      id={customer.id}
      key={customer.id}
      selected={selectedResources.includes(customer.id)}
      position={index}
    >
      {currentVisibleColumns.map((column) => (
        <IndexTable.Cell key={column.id}>
          {renderCellContent(customer, column.id)}
      </IndexTable.Cell>
      ))}
    </IndexTable.Row>
  ));

  // Render a single column as a mini table for edit mode
  const renderColumnBlock = (column) => {
    const isVisible = tempVisibleColumns.includes(column.id);
    const isNameColumn = column.id === 'name';
    
    return (
      <div 
        key={column.id}
        style={{
          minWidth: 'fit-content',
          opacity: isVisible ? 1 : 0.4,
          transition: 'opacity 0.2s ease',
          border: '1px solid #e1e3e5',
          borderRadius: '8px',
          overflow: 'hidden',
        }}
      >
        {/* Column Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
            padding: '12px 16px',
            backgroundColor: '#f6f6f7',
            borderBottom: '1px solid #e1e3e5',
            whiteSpace: 'nowrap',
          }}
        >
          <Text variant="bodySm" as="span" fontWeight="medium">
            {column.title}
          </Text>
          {!isNameColumn && (
            <button
              onClick={() => toggleColumnVisibility(column.id)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '4px',
                color: isVisible ? '#5c5f62' : '#8c9196',
              }}
              aria-label={isVisible ? `Hide ${column.title}` : `Show ${column.title}`}
            >
              <Icon source={isVisible ? ViewIcon : HideIcon} tone="subdued" />
            </button>
          )}
        </div>
        
        {/* Column Data */}
        <div style={{ backgroundColor: isVisible ? 'white' : '#f9fafb' }}>
          {sortedCustomers.slice(0, 15).map((customer, index) => (
            <div
              key={customer.id}
              style={{
                padding: '12px 16px',
                borderBottom: index < 14 ? '1px solid #f1f1f1' : 'none',
                minHeight: '44px',
                display: 'flex',
                alignItems: 'center',
                whiteSpace: 'nowrap',
              }}
            >
              {renderCellContent(customer, column.id)}
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Sort popover activator
  const sortActivator = (
    <Button
      icon={SortIcon}
      onClick={toggleSortPopover}
      accessibilityLabel="Sort customers"
    />
  );

  // If AddCustomer is open, show it instead of the customers list
  if (addCustomerOpen) {
    return (
      <>
        <style>{`
          .customers-page-wrapper .Polaris-Page {
            max-width: 100% !important;
            width: 100% !important;
          }
        `}</style>
        <div className="customers-page-wrapper" style={{ width: '100%' }}>
          <AddCustomer onClose={() => setAddCustomerOpen(false)} />
        </div>
      </>
    );
  }

  return (
    <>
      <style>{`
        /* Fix modal backdrop and dialog styling */
        .Polaris-Backdrop {
          background-color: rgba(0, 0, 0, 0.5) !important;
          z-index: 599 !important;
        }
        
        .Polaris-Modal-Dialog {
          z-index: 600 !important;
          position: relative !important;
        }
        
        .Polaris-Modal-Dialog__Container {
          z-index: 600 !important;
        }
        
        .customers-page-wrapper .Polaris-Page {
          max-width: 100% !important;
          width: 100% !important;
        }
        
        .customers-page-wrapper .Polaris-Page__Content {
          max-width: 100% !important;
          width: 100% !important;
        }
        
        .customers-page-wrapper .Polaris-Card {
          width: 100% !important;
        }
        
        .customers-page-wrapper .Polaris-TextField__Backdrop {
          border: none !important;
          background: transparent !important;
        }
        
        .customers-page-wrapper .Polaris-TextField:focus-within .Polaris-TextField__Backdrop {
          border: none !important;
          box-shadow: none !important;
        }
        
        .customers-page-wrapper .Polaris-IndexTable__Table thead {
          border-top: 1px solid #e1e3e5 !important;
        }
        
        .customers-page-wrapper .Polaris-IndexTable-ScrollContainer {
          overflow-x: auto !important;
        }
        
        /* Add scrolling to the table wrapper - only vertical scroll in table */
        .customers-page-wrapper .table-scroll-container {
          max-height: 600px;
          overflow-y: auto !important;
          overflow-x: auto !important;
        }
        
        /* Edit columns mode scrollbar */
        .customers-page-wrapper ::-webkit-scrollbar {
          height: 8px;
        }
        
        .customers-page-wrapper ::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 4px;
        }
        
        .customers-page-wrapper ::-webkit-scrollbar-thumb {
          background: #c1c1c1;
          border-radius: 4px;
        }
        
        .customers-page-wrapper ::-webkit-scrollbar-thumb:hover {
          background: #a1a1a1;
        }
        
        /* Remove title from ChoiceList */
        .sort-popover-content .Polaris-ChoiceList__Title {
          display: none;
        }
        
        /* Style the ChoiceList items with reduced padding */
        .sort-popover-content .Polaris-ChoiceList {
          padding: 0;
        }
        
        .sort-popover-content .Polaris-ChoiceList__Choices {
          padding: 0;
        }
        
        .sort-popover-content .Polaris-Choice {
          padding: 6px 16px;
        }
        
        .sort-popover-content .Polaris-Choice:hover {
          background-color: #f6f6f7;
        }
        
        /* Sort direction items */
        .sort-direction-item {
          padding: 8px 16px;
          cursor: pointer;
        }
        
        .sort-direction-item:hover {
          background-color: #f6f6f7;
        }
        
        .sort-direction-item.selected {
          background-color: #f1f1f1;
        }
      `}</style>
      <div className="customers-page-wrapper" style={{ width: '100%' }}>
    <Page
          title={
            <InlineStack gap="200" blockAlign="center">
              <Icon source={PersonIcon} />
              <span>Customers</span>
            </InlineStack>
          }
      primaryAction={{
        content: 'Add customer',
            onAction: () => setAddCustomerOpen(true),
      }}
      secondaryActions={[
        {
          content: 'Export',
          onAction: handleExportModalOpen,
        },
        {
          content: 'Import',
          onAction: handleImportModalOpen,
        },
      ]}
    >
      {/* Customer count stats bar */}
      <Box paddingBlockEnd="400">
        <Card padding="400">
          <InlineStack gap="200" align="start">
            <Text variant="bodyMd" as="span" fontWeight="semibold">
              {totalCustomers.toLocaleString()} customers
            </Text>
            <Text variant="bodyMd" as="span" tone="subdued">
              |
            </Text>
            <Text variant="bodyMd" as="span" tone="subdued">
              100% of your customer base
            </Text>
          </InlineStack>
        </Card>
      </Box>

      {/* Main table card */}
      <Card padding="0">
            {/* Search bar with Edit Columns and Sort buttons */}
            <Box padding="400" paddingBlockEnd="200">
              <InlineStack align="space-between" blockAlign="center">
                <div style={{ flex: 1, maxWidth: editColumnsMode ? '100%' : '400px' }}>
          <TextField
            placeholder="Search customers"
            value={searchValue}
            onChange={handleSearchChange}
            clearButton
            onClearButtonClick={handleSearchClear}
                    prefix={<Icon source={SearchIcon} tone="subdued" />}
            autoComplete="off"
          />
                </div>
                
                <InlineStack gap="200" blockAlign="center">
                  {editColumnsMode ? (
                    <ButtonGroup>
                      <Button onClick={handleCancelEditColumns}>Cancel</Button>
                      <Button variant="primary" onClick={handleSaveColumns}>Save</Button>
                    </ButtonGroup>
                  ) : (
                    <>
                      {/* Edit Columns Button */}
                      <Button
                        icon={LayoutColumns3Icon}
                        onClick={handleEditColumnsClick}
                        accessibilityLabel="Edit columns"
                      />
                      
                      {/* Sort Button with Popover */}
                      <Popover
                        active={sortPopoverActive}
                        activator={sortActivator}
                        onClose={toggleSortPopover}
                        preferredAlignment="right"
                        preferredPosition="below"
                      >
                        <div className="sort-popover-content" style={{ width: '220px' }}>
                          <Box padding="300" paddingBlockEnd="100">
                            <Text variant="headingSm" as="h3">
                              Sort by
                            </Text>
                          </Box>
                          
                          {/* Sort by options using ChoiceList for radio buttons */}
                          <Box paddingInline="100">
                            <ChoiceList
                              choices={sortOptions}
                              selected={[selectedSort]}
                              onChange={handleSortChange}
                            />
                          </Box>
                          
                          <Box paddingInline="300" paddingBlock="150">
                            <Divider />
        </Box>

                          {/* Sort Direction Options - plain clickable items */}
                          <div style={{ paddingBottom: '8px' }}>
                            <div
                              className={`sort-direction-item ${sortDirection === 'asc' ? 'selected' : ''}`}
                              onClick={() => handleSortDirectionChange(['asc'])}
                            >
                              <Text variant="bodyMd" as="span">
                                ↑ Lowest to highest
                              </Text>
                            </div>
                            <div
                              className={`sort-direction-item ${sortDirection === 'desc' ? 'selected' : ''}`}
                              onClick={() => handleSortDirectionChange(['desc'])}
                            >
                              <Text variant="bodyMd" as="span">
                                ↓ Highest to lowest
                              </Text>
                            </div>
                          </div>
                        </div>
                      </Popover>
                    </>
                  )}
                </InlineStack>
              </InlineStack>
            </Box>

            {/* Index Table or Edit Columns View */}
            {editColumnsMode ? (
              // Edit Columns Mode - Show columns as separate blocks
              <div 
                style={{ 
                  display: 'flex', 
                  gap: '12px', 
                  overflowX: 'auto',
                  padding: '16px',
                  paddingTop: '16px',
                  backgroundColor: '#f6f6f7',
                }}
              >
                {allColumns.map((column) => renderColumnBlock(column))}
              </div>
            ) : (
              // Normal Mode - Show regular IndexTable
              <div className="table-scroll-container">
        <IndexTable
          resourceName={resourceName}
                  itemCount={sortedCustomers.length}
          selectedItemsCount={
            allResourcesSelected ? 'All' : selectedResources.length
          }
          onSelectionChange={handleSelectionChange}
                  headings={currentVisibleColumns.map((column) => ({
                    title: column.title,
                    alignment: column.alignment || 'start',
                  }))}
          selectable
        >
          {rowMarkup}
        </IndexTable>
              </div>
            )}

            {/* Pagination - Hide in edit mode */}
            {!editColumnsMode && (
        <Box padding="400" borderBlockStartWidth="025" borderColor="border">
          <InlineStack align="space-between" blockAlign="center">
            <Pagination
              hasPrevious={currentPage > 1}
              onPrevious={() => setCurrentPage(currentPage - 1)}
              hasNext={currentPage * itemsPerPage < totalCustomers}
              onNext={() => setCurrentPage(currentPage + 1)}
            />
            <Text variant="bodySm" as="span" tone="subdued">
              {`${(currentPage - 1) * itemsPerPage + 1}-${Math.min(
                currentPage * itemsPerPage,
                totalCustomers
              )}`}
            </Text>
          </InlineStack>
        </Box>
            )}
      </Card>
    </Page>

        {/* Export Modal */}
        <Modal
          open={exportModalOpen}
          onClose={handleExportModalClose}
          title="Export customers"
          primaryAction={{
            content: 'Export customers',
            onAction: handleExport,
          }}
          secondaryActions={[
            {
              content: 'Cancel',
              onAction: handleExportModalClose,
            },
          ]}
        >
          <Modal.Section>
            <BlockStack gap="500">
              {/* Customers selected section */}
              <BlockStack gap="300">
                <Text variant="headingSm" as="h3">
                  Customers selected
                </Text>
                <ChoiceList
                  choices={[
                    { label: 'Current page', value: 'current' },
                    { label: 'All customers', value: 'all' },
                  ]}
                  selected={exportOption}
                  onChange={handleExportOptionChange}
                />
              </BlockStack>
              
              {/* Fields included section */}
              <BlockStack gap="300">
                <Text variant="headingSm" as="h3">
                  Fields included
                </Text>
                <Text variant="bodyMd" as="p" tone="subdued">
                  By default, all exports include: full name, ID, address, email, phone number, company, marketing consent, orders, tax exempts.
                </Text>
                <BlockStack gap="200">
                  <Checkbox
                    label="Customer tags"
                    checked={includeCustomerTags}
                    onChange={setIncludeCustomerTags}
                  />
                  <Checkbox
                    label="Customer metafields"
                    checked={includeCustomerMetafields}
                    onChange={setIncludeCustomerMetafields}
                  />
                </BlockStack>
              </BlockStack>
              
              {/* File format section */}
              <BlockStack gap="300">
                <Text variant="headingSm" as="h3">
                  File format
                </Text>
                <ChoiceList
                  choices={[
                    { label: 'CSV for Excel, Numbers, or other spreadsheet programs', value: 'csv_excel' },
                    { label: 'Plain CSV file', value: 'plain_csv' },
                  ]}
                  selected={exportFormat}
                  onChange={handleExportFormatChange}
                />
              </BlockStack>
            </BlockStack>
          </Modal.Section>
        </Modal>

        {/* Import Modal */}
        <Modal
          open={importModalOpen}
          onClose={handleImportModalClose}
          title="Import customers by CSV"
          primaryAction={{
            content: 'Import customers',
            onAction: handleImport,
            disabled: !importFile,
          }}
          secondaryActions={[
            {
              content: 'Cancel',
              onAction: handleImportModalClose,
            },
          ]}
          preventCloseOnClickOutside={false}
          footer={
            <Box paddingBlockStart="400">
              <Link url="#">
                Download a sample CSV
              </Link>
            </Box>
          }
        >
          <Modal.Section>
            <DropZone
              accept=".csv"
              type="file"
              onDrop={handleDropZoneDrop}
            >
              {importFile ? (
                <Box padding="1000">
                  <BlockStack gap="200" inlineAlign="center">
                    <Text variant="bodyMd" as="p" fontWeight="semibold">
                      {importFile.name}
                    </Text>
                    <Text variant="bodySm" as="p" tone="subdued">
                      {(importFile.size / 1024).toFixed(2)} KB
                    </Text>
                    <Button onClick={() => setImportFile(null)} size="slim">
                      Remove file
                    </Button>
                  </BlockStack>
                </Box>
              ) : (
                <Box padding="1000">
                  <BlockStack inlineAlign="center">
                    <Button icon={PlusIcon}>Add file</Button>
                  </BlockStack>
                </Box>
              )}
            </DropZone>
          </Modal.Section>
        </Modal>
      </div>
    </>
  );
}

export default CustomersPage;