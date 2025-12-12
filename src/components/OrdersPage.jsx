'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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
  Link,
} from '@shopify/polaris';
import {
  SearchIcon,
  OrderIcon,
  LayoutColumns3Icon,
  SortIcon,
  ViewIcon,
  HideIcon,
  AlertCircleIcon,
  PackageIcon,
  EditIcon,
} from '@shopify/polaris-icons';
import { EmailCustomerModal, BookingsStats } from './bookings';
import './styles/CustomersPage.css';

// Mock orders data based on screenshots
const ordersData = [
  {
    id: '1',
    orderId: '#SK6172',
    hasFlag: true,
    date: 'Today at 11:04 am',
    customer: 'Sabreen Khan',
    customerEmail: 'sabreenkhan200@gmail.com',
    customerPhone: '8287258240',
    customerLocation: 'South Delhi DL, India',
    shippingAddress: {
      line1: '114, 5th floor, front side, gali no. 18 near bhat brothers, landmark- property point Zakir nagar okhla Near bhat brothers New Delhi, Zakir',
      line2: 'nagar gali 18',
      city: 'South Delhi',
      state: 'DL',
      zip: '110025',
      country: 'India'
    },
    orderCount: 1,
    channel: 'FastrV3',
    total: 1387.00,
    currency: '₹',
    paymentStatus: 'Paid',
    fulfillmentStatus: 'Fulfilled',
    items: 2,
    itemsDetails: [
      { name: 'Clear Complexion Moisturizer – 50+ Herbs Ayurvedic Radiance Cream', variant: '30g', quantity: 1, image: '/images/product1.jpg' },
      { name: 'Clear Complexion Brightening Elixir – Powered by 50+ Ayurvedic Herbs', variant: '5 ml', quantity: 1, image: '/images/product2.jpg' }
    ],
    deliveryStatus: 'In transit',
    deliveryMethod: 'Standard (Prepaid)',
    tags: ['fastrr', 'low', 'SR_STANDARD', 'Standard'],
    destination: 'South Delhi, DL, IN',
    labelStatus: 'No label',
    poNumber: '',
    returnStatus: '',
    fulfillmentId: '#SK6172-F1',
    trackingNumber: '35232310038150',
  },
  {
    id: '2',
    orderId: '#SK6171',
    hasFlag: false,
    date: 'Today at 11:02 am',
    customer: 'Harika Reddy',
    customerEmail: 'harikasagamreddy@gmail.com',
    customerPhone: '+917013062599',
    customerLocation: 'Guntur AP, India',
    orderCount: 1,
    channel: 'FastrV3',
    total: 698.00,
    currency: '₹',
    paymentStatus: 'Payment pending',
    fulfillmentStatus: 'Fulfilled',
    items: 1,
    itemsDetails: [
      { name: 'Product Item 1', variant: 'Default', quantity: 1, image: '/images/product.jpg' }
    ],
    deliveryStatus: 'In transit',
    deliveryMethod: 'Standard (COD)',
    tags: ['fastrr', 'high', 'rto_prediction_high', 'SR_STANDARD', 'Standard'],
    destination: 'Guntur, AP, IN',
    labelStatus: 'No label',
    poNumber: '',
    returnStatus: '',
    fulfillmentId: '',
    trackingNumber: '',
  },
  {
    id: '3',
    orderId: '#SK6170',
    hasFlag: false,
    date: 'Today at 10:36 am',
    customer: 'Faira Febin',
    customerEmail: 'faira@example.com',
    customerPhone: '+91 98765 43211',
    customerLocation: 'MALAPPURAM KL, India',
    orderCount: 1,
    channel: 'FastrV3',
    total: 698.00,
    currency: '₹',
    paymentStatus: 'Payment pending',
    fulfillmentStatus: 'Fulfilled',
    items: 1,
    itemsDetails: [
      { name: 'Product Item 1', variant: 'Default', quantity: 1, image: '/images/product.jpg' }
    ],
    deliveryStatus: 'In transit',
    deliveryMethod: 'Standard (COD)',
    tags: ['fastrr', 'low', 'Order_Recovery', 'SR_STANDARD', 'Standard'],
    destination: 'MALAPPURAM, KL, IN',
    labelStatus: 'No label',
    poNumber: '',
    returnStatus: '',
    fulfillmentId: '',
    trackingNumber: '',
  },
  {
    id: '4',
    orderId: '#SK6169',
    hasFlag: false,
    date: 'Today at 10:36 am',
    customer: 'Preksha Pawar',
    customerEmail: 'preksha@example.com',
    customerPhone: '+91 98765 43212',
    customerLocation: 'Thane MH, India',
    orderCount: 1,
    channel: 'FastrV3',
    total: 698.00,
    currency: '₹',
    paymentStatus: 'Payment pending',
    fulfillmentStatus: 'Fulfilled',
    items: 1,
    itemsDetails: [
      { name: 'Product Item 1', variant: 'Default', quantity: 1, image: '/images/product.jpg' }
    ],
    deliveryStatus: 'In transit',
    deliveryMethod: 'Standard (COD)',
    tags: ['fastrr', 'high', 'rto_prediction_high', 'SR_STANDARD', 'Standard'],
    destination: 'Thane, MH, IN',
    labelStatus: 'No label',
    poNumber: '',
    returnStatus: '',
    fulfillmentId: '',
    trackingNumber: '',
  },
  {
    id: '5',
    orderId: '#SK6168',
    hasFlag: false,
    date: 'Today at 4:20 am',
    customer: 'Rano Rano',
    customerEmail: 'rano@example.com',
    customerPhone: '+91 98765 43213',
    customerLocation: 'Aligarh UP, India',
    orderCount: 1,
    channel: 'FastrV3',
    total: 668.05,
    currency: '₹',
    paymentStatus: 'Payment pending',
    fulfillmentStatus: 'Fulfilled',
    items: 1,
    itemsDetails: [
      { name: 'Product Item 1', variant: 'Default', quantity: 1, image: '/images/product.jpg' }
    ],
    deliveryStatus: 'In transit',
    deliveryMethod: 'Standard (COD)',
    tags: ['fastrr', 'Fomo', 'low', 'SR_STANDARD', 'Standard'],
    destination: 'Aligarh, UP, IN',
    labelStatus: 'No label',
    poNumber: '',
    returnStatus: '',
    fulfillmentId: '',
    trackingNumber: '',
  },
  {
    id: '6',
    orderId: '#SK6167',
    hasFlag: true,
    date: 'Today at 12:39 am',
    customer: 'Taiminah Taiminah',
    customerEmail: 'taiminah@example.com',
    customerPhone: '+91 98765 43214',
    customerLocation: 'Sangli MH, India',
    orderCount: 1,
    channel: 'FastrV3',
    total: 2095.70,
    currency: '₹',
    paymentStatus: 'Paid',
    fulfillmentStatus: 'Fulfilled',
    items: 10,
    itemsDetails: [
      { name: 'Product Item 1', variant: 'Default', quantity: 10, image: '/images/product.jpg' }
    ],
    deliveryStatus: 'In transit',
    deliveryMethod: 'Standard (Prepaid)',
    tags: ['fastrr', 'low', 'SR_STANDARD', 'Standard'],
    destination: 'Sangli, MH, IN',
    labelStatus: 'No label',
    poNumber: '',
    returnStatus: '',
    fulfillmentId: '',
    trackingNumber: '',
  },
  {
    id: '7',
    orderId: '#SK6166',
    hasFlag: true,
    date: 'Today at 12:17 am',
    customer: 'Umme Kulsum',
    customerEmail: 'umme@example.com',
    customerPhone: '+91 98765 43215',
    customerLocation: 'Bangalore KA, India',
    orderCount: 1,
    channel: 'FastrV3',
    total: 949.05,
    currency: '₹',
    paymentStatus: 'Paid',
    fulfillmentStatus: 'Fulfilled',
    items: 1,
    itemsDetails: [
      { name: 'Product Item 1', variant: 'Default', quantity: 1, image: '/images/product.jpg' }
    ],
    deliveryStatus: 'In transit',
    deliveryMethod: 'Standard (Prepaid)',
    tags: ['fastrr', 'high', 'SR_STANDARD', 'Standard'],
    destination: 'Bangalore, KA, IN',
    labelStatus: 'No label',
    poNumber: '',
    returnStatus: '',
    fulfillmentId: '',
    trackingNumber: '',
  },
  {
    id: '8',
    orderId: '#SK6165',
    hasFlag: false,
    date: 'Yesterday at 11:37 pm',
    customer: 'Sumi Chumi',
    customerEmail: 'sumi@example.com',
    customerPhone: '+91 98765 43216',
    customerLocation: 'Kasargod KL, India',
    orderCount: 1,
    channel: 'FastrV3',
    total: 698.00,
    currency: '₹',
    paymentStatus: 'Payment pending',
    fulfillmentStatus: 'Fulfilled',
    items: 1,
    itemsDetails: [
      { name: 'Product Item 1', variant: 'Default', quantity: 1, image: '/images/product.jpg' }
    ],
    deliveryStatus: 'In transit',
    deliveryMethod: 'Standard (COD)',
    tags: ['fastrr', 'low', 'SR_STANDARD', 'Standard'],
    destination: 'Kasargod, KL, IN',
    labelStatus: 'No label',
    poNumber: '',
    returnStatus: '',
    fulfillmentId: '',
    trackingNumber: '',
  },
  {
    id: '9',
    orderId: '#SK6164',
    hasFlag: false,
    date: 'Yesterday at 10:49 pm',
    customer: 'Samreen .',
    customerEmail: 'samreen@example.com',
    customerPhone: '+91 98765 43217',
    customerLocation: 'Bhopal MP, India',
    orderCount: 1,
    channel: 'FastrV3',
    total: 1123.85,
    currency: '₹',
    paymentStatus: 'Paid',
    fulfillmentStatus: 'Fulfilled',
    items: 2,
    itemsDetails: [
      { name: 'Product Item 1', variant: 'Default', quantity: 2, image: '/images/product.jpg' }
    ],
    deliveryStatus: 'Tracking added',
    deliveryMethod: 'Standard (Prepaid)',
    tags: ['fastrr', 'low', 'SR_STANDARD', 'Standard'],
    destination: 'Bhopal, MP, IN',
    labelStatus: 'No label',
    poNumber: '',
    returnStatus: '',
    fulfillmentId: '',
    trackingNumber: '',
  },
  {
    id: '10',
    orderId: '#SK6163',
    hasFlag: false,
    date: 'Yesterday at 4:41 pm',
    customer: 'Zuha Khanum',
    customerEmail: 'zuha@example.com',
    customerPhone: '+91 98765 43218',
    customerLocation: 'Bangalore KA, India',
    orderCount: 1,
    channel: 'FastrV3',
    total: 498.00,
    currency: '₹',
    paymentStatus: 'Payment pending',
    fulfillmentStatus: 'Fulfilled',
    items: 1,
    itemsDetails: [
      { name: 'Product Item 1', variant: 'Default', quantity: 1, image: '/images/product.jpg' }
    ],
    deliveryStatus: 'In transit',
    deliveryMethod: 'Standard (COD)',
    tags: ['fastrr', 'low', 'SR_STANDARD', 'Standard'],
    destination: 'Bangalore, KA, IN',
    labelStatus: 'No label',
    poNumber: '',
    returnStatus: '',
    fulfillmentId: '',
    trackingNumber: '',
  },
  {
    id: '11',
    orderId: '#SK6162',
    hasFlag: false,
    date: 'Yesterday at 10:58 am',
    customer: 'Syeda Nafeesa',
    customerEmail: 'syeda@example.com',
    customerPhone: '+91 98765 43219',
    customerLocation: 'Bangalore KA, India',
    orderCount: 1,
    channel: 'FastrV3',
    total: 1021.00,
    currency: '₹',
    paymentStatus: 'Payment pending',
    fulfillmentStatus: 'Fulfilled',
    items: 2,
    itemsDetails: [
      { name: 'Product Item 1', variant: 'Default', quantity: 2, image: '/images/product.jpg' }
    ],
    deliveryStatus: 'In transit',
    deliveryMethod: 'Standard (COD)',
    tags: ['fastrr', 'low', 'SR_STANDARD', 'Standard'],
    destination: 'Bangalore, KA, IN',
    labelStatus: 'No label',
    poNumber: '',
    returnStatus: '',
    fulfillmentId: '',
    trackingNumber: '',
  },
  {
    id: '12',
    orderId: '#SK6161',
    hasFlag: false,
    date: 'Tuesday at 11:53 pm',
    customer: 'Musheera -',
    customerEmail: 'musheera@example.com',
    customerPhone: '+91 98765 43220',
    customerLocation: 'Bangalore KA, India',
    orderCount: 1,
    channel: 'FastrV3',
    total: 688.00,
    currency: '₹',
    paymentStatus: 'Paid',
    fulfillmentStatus: 'Fulfilled',
    items: 1,
    itemsDetails: [
      { name: 'Product Item 1', variant: 'Default', quantity: 1, image: '/images/product.jpg' }
    ],
    deliveryStatus: 'Out for delivery',
    deliveryMethod: 'Standard (Prepaid)',
    tags: ['fastrr', 'low', 'loyaltyTag', 'SR_STANDARD', 'Standard'],
    destination: 'Bangalore, KA, IN',
    labelStatus: 'No label',
    poNumber: '',
    returnStatus: '',
    fulfillmentId: '',
    trackingNumber: '',
  },
  {
    id: '13',
    orderId: '#SK6160',
    hasFlag: true,
    date: 'Tuesday at 10:22 pm',
    customer: 'shefali .',
    customerEmail: 'shefali@example.com',
    customerPhone: '+91 98765 43221',
    customerLocation: 'Raigarh MH, India',
    orderCount: 1,
    channel: 'FastrV3',
    total: 688.00,
    currency: '₹',
    paymentStatus: 'Payment pending',
    fulfillmentStatus: 'Fulfilled',
    items: 1,
    itemsDetails: [
      { name: 'Product Item 1', variant: 'Default', quantity: 1, image: '/images/product.jpg' }
    ],
    deliveryStatus: 'In transit',
    deliveryMethod: 'Standard (COD)',
    tags: ['fastrr', 'low', 'loyaltyTag', 'SR_STANDARD', 'Standard'],
    destination: 'Raigarh, MH, IN',
    labelStatus: 'No label',
    poNumber: '',
    returnStatus: '',
    fulfillmentId: '',
    trackingNumber: '',
  },
  {
    id: '14',
    orderId: '#SK6159',
    hasFlag: true,
    date: 'Tuesday at 08:40 pm',
    customer: 'Musharath Khan',
    customerEmail: 'musharath@example.com',
    customerPhone: '+91 98765 43222',
    customerLocation: 'Bangalore KA, India',
    orderCount: 1,
    channel: 'FastrV3',
    total: 1781.00,
    currency: '₹',
    paymentStatus: 'Payment pending',
    fulfillmentStatus: 'Fulfilled',
    items: 6,
    itemsDetails: [
      { name: 'Product Item 1', variant: 'Default', quantity: 6, image: '/images/product.jpg' }
    ],
    deliveryStatus: 'Delivered',
    deliveryMethod: 'Standard (COD)',
    tags: ['fastrr', 'low', 'loyaltyTag', 'SR_STANDARD', 'Standard'],
    destination: 'Bangalore, KA, IN',
    labelStatus: 'No label',
    poNumber: '',
    returnStatus: '',
    fulfillmentId: '',
    trackingNumber: '',
  },
  {
    id: '15',
    orderId: '#SK6158',
    hasFlag: true,
    date: 'Tuesday at 06:10 pm',
    customer: 'Shaimaa zain',
    customerEmail: 'shaimaa@example.com',
    customerPhone: '+91 98765 43223',
    customerLocation: 'Bangalore KA, India',
    orderCount: 1,
    channel: 'FastrV3',
    total: 737.00,
    currency: '₹',
    paymentStatus: 'Paid',
    fulfillmentStatus: 'Fulfilled',
    items: 1,
    itemsDetails: [
      { name: 'Product Item 1', variant: 'Default', quantity: 1, image: '/images/product.jpg' }
    ],
    deliveryStatus: 'Delivered',
    deliveryMethod: 'Standard (Prepaid)',
    tags: ['fastrr', 'low', 'loyaltyTag', 'SR_STANDARD', 'Standard'],
    destination: 'Bangalore, KA, IN',
    labelStatus: 'No label',
    poNumber: '',
    returnStatus: '',
    fulfillmentId: '',
    trackingNumber: '',
  },
  {
    id: '16',
    orderId: '#SK6157',
    hasFlag: false,
    date: 'Tuesday at 05:45 pm',
    customer: 'Aarav Sharma',
    customerEmail: 'aarav@example.com',
    customerPhone: '+91 98765 43224',
    customerLocation: 'Delhi DL, India',
    orderCount: 2,
    channel: 'FastrV3',
    total: 899.00,
    currency: '₹',
    paymentStatus: 'Payment pending',
    fulfillmentStatus: 'Unfulfilled',
    items: 1,
    itemsDetails: [
      { name: 'Product Item 1', variant: 'Default', quantity: 1, image: '/images/product.jpg' }
    ],
    deliveryStatus: 'Pending',
    deliveryMethod: 'Standard (COD)',
    tags: ['fastrr', 'high', 'SR_STANDARD'],
    destination: 'Delhi, DL, IN',
    labelStatus: 'No label',
    poNumber: '',
    returnStatus: '',
    fulfillmentId: '',
    trackingNumber: '',
  },
  {
    id: '17',
    orderId: '#SK6156',
    hasFlag: false,
    date: 'Tuesday at 05:30 pm',
    customer: 'Priya Patel',
    customerEmail: 'priya@example.com',
    customerPhone: '+91 98765 43225',
    customerLocation: 'Mumbai MH, India',
    orderCount: 1,
    channel: 'FastrV3',
    total: 1250.00,
    currency: '₹',
    paymentStatus: 'Paid',
    fulfillmentStatus: 'Unfulfilled',
    items: 2,
    itemsDetails: [
      { name: 'Product Item 1', variant: 'Default', quantity: 2, image: '/images/product.jpg' }
    ],
    deliveryStatus: 'Pending',
    deliveryMethod: 'Standard (Prepaid)',
    tags: ['fastrr', 'low', 'SR_STANDARD'],
    destination: 'Mumbai, MH, IN',
    labelStatus: 'No label',
    poNumber: '',
    returnStatus: '',
    fulfillmentId: '',
    trackingNumber: '',
  },
  {
    id: '18',
    orderId: '#SK6155',
    hasFlag: false,
    date: 'Tuesday at 05:15 pm',
    customer: 'Rahul Kumar',
    customerEmail: 'rahul@example.com',
    customerPhone: '+91 98765 43226',
    customerLocation: 'Chennai TN, India',
    orderCount: 3,
    channel: 'FastrV3',
    total: 675.00,
    currency: '₹',
    paymentStatus: 'Payment pending',
    fulfillmentStatus: 'Unfulfilled',
    items: 1,
    itemsDetails: [
      { name: 'Product Item 1', variant: 'Default', quantity: 1, image: '/images/product.jpg' }
    ],
    deliveryStatus: 'Pending',
    deliveryMethod: 'Standard (COD)',
    tags: ['fastrr', 'medium', 'SR_STANDARD'],
    destination: 'Chennai, TN, IN',
    labelStatus: 'No label',
    poNumber: '',
    returnStatus: '',
    fulfillmentId: '',
    trackingNumber: '',
  },
  {
    id: '19',
    orderId: '#SK6154',
    hasFlag: true,
    date: 'Tuesday at 04:50 pm',
    customer: 'Ananya Singh',
    customerEmail: 'ananya@example.com',
    customerPhone: '+91 98765 43227',
    customerLocation: 'Pune MH, India',
    orderCount: 1,
    channel: 'FastrV3',
    total: 1450.00,
    currency: '₹',
    paymentStatus: 'Paid',
    fulfillmentStatus: 'Unfulfilled',
    items: 3,
    itemsDetails: [
      { name: 'Product Item 1', variant: 'Default', quantity: 3, image: '/images/product.jpg' }
    ],
    deliveryStatus: 'Pending',
    deliveryMethod: 'Standard (Prepaid)',
    tags: ['fastrr', 'high', 'SR_STANDARD'],
    destination: 'Pune, MH, IN',
    labelStatus: 'No label',
    poNumber: '',
    returnStatus: '',
    fulfillmentId: '',
    trackingNumber: '',
  },
  {
    id: '20',
    orderId: '#SK6153',
    hasFlag: false,
    date: 'Tuesday at 04:30 pm',
    customer: 'Vikram Reddy',
    customerEmail: 'vikram@example.com',
    customerPhone: '+91 98765 43228',
    customerLocation: 'Hyderabad TG, India',
    orderCount: 2,
    channel: 'FastrV3',
    total: 798.00,
    currency: '₹',
    paymentStatus: 'Payment pending',
    fulfillmentStatus: 'Unfulfilled',
    items: 1,
    itemsDetails: [
      { name: 'Product Item 1', variant: 'Default', quantity: 1, image: '/images/product.jpg' }
    ],
    deliveryStatus: 'Pending',
    deliveryMethod: 'Standard (COD)',
    tags: ['fastrr', 'low', 'SR_STANDARD'],
    destination: 'Hyderabad, TG, IN',
    labelStatus: 'No label',
    poNumber: '',
    returnStatus: '',
    fulfillmentId: '',
    trackingNumber: '',
  },
  {
    id: '21',
    orderId: '#SK6152',
    hasFlag: false,
    date: 'Tuesday at 04:00 pm',
    customer: 'Kavya Iyer',
    customerEmail: 'kavya@example.com',
    customerPhone: '+91 98765 43229',
    customerLocation: 'Kochi KL, India',
    orderCount: 1,
    channel: 'FastrV3',
    total: 1125.00,
    currency: '₹',
    paymentStatus: 'Paid',
    fulfillmentStatus: 'Unfulfilled',
    items: 2,
    itemsDetails: [
      { name: 'Product Item 1', variant: 'Default', quantity: 2, image: '/images/product.jpg' }
    ],
    deliveryStatus: 'Pending',
    deliveryMethod: 'Standard (Prepaid)',
    tags: ['fastrr', 'medium', 'SR_STANDARD'],
    destination: 'Kochi, KL, IN',
    labelStatus: 'No label',
    poNumber: '',
    returnStatus: '',
    fulfillmentId: '',
    trackingNumber: '',
  },
  {
    id: '22',
    orderId: '#SK6151',
    hasFlag: false,
    date: 'Tuesday at 03:45 pm',
    customer: 'Arjun Verma',
    customerEmail: 'arjun@example.com',
    customerPhone: '+91 98765 43230',
    customerLocation: 'Jaipur RJ, India',
    orderCount: 1,
    channel: 'FastrV3',
    total: 545.00,
    currency: '₹',
    paymentStatus: 'Payment pending',
    fulfillmentStatus: 'Unfulfilled',
    items: 1,
    itemsDetails: [
      { name: 'Product Item 1', variant: 'Default', quantity: 1, image: '/images/product.jpg' }
    ],
    deliveryStatus: 'Pending',
    deliveryMethod: 'Standard (COD)',
    tags: ['fastrr', 'low', 'SR_STANDARD'],
    destination: 'Jaipur, RJ, IN',
    labelStatus: 'No label',
    poNumber: '',
    returnStatus: '',
    fulfillmentId: '',
    trackingNumber: '',
  },
  {
    id: '23',
    orderId: '#SK6150',
    hasFlag: true,
    date: 'Tuesday at 03:20 pm',
    customer: 'Neha Gupta',
    customerEmail: 'neha@example.com',
    customerPhone: '+91 98765 43231',
    customerLocation: 'Kolkata WB, India',
    orderCount: 4,
    channel: 'FastrV3',
    total: 2100.00,
    currency: '₹',
    paymentStatus: 'Paid',
    fulfillmentStatus: 'Unfulfilled',
    items: 5,
    itemsDetails: [
      { name: 'Product Item 1', variant: 'Default', quantity: 5, image: '/images/product.jpg' }
    ],
    deliveryStatus: 'Pending',
    deliveryMethod: 'Standard (Prepaid)',
    tags: ['fastrr', 'high', 'SR_STANDARD'],
    destination: 'Kolkata, WB, IN',
    labelStatus: 'No label',
    poNumber: '',
    returnStatus: '',
    fulfillmentId: '',
    trackingNumber: '',
  },
  {
    id: '24',
    orderId: '#SK6149',
    hasFlag: false,
    date: 'Tuesday at 02:55 pm',
    customer: 'Rohan Mehta',
    customerEmail: 'rohan@example.com',
    customerPhone: '+91 98765 43232',
    customerLocation: 'Ahmedabad GJ, India',
    orderCount: 1,
    channel: 'FastrV3',
    total: 825.00,
    currency: '₹',
    paymentStatus: 'Payment pending',
    fulfillmentStatus: 'Unfulfilled',
    items: 1,
    itemsDetails: [
      { name: 'Product Item 1', variant: 'Default', quantity: 1, image: '/images/product.jpg' }
    ],
    deliveryStatus: 'Pending',
    deliveryMethod: 'Standard (COD)',
    tags: ['fastrr', 'medium', 'SR_STANDARD'],
    destination: 'Ahmedabad, GJ, IN',
    labelStatus: 'No label',
    poNumber: '',
    returnStatus: '',
    fulfillmentId: '',
    trackingNumber: '',
  },
  {
    id: '25',
    orderId: '#SK6148',
    hasFlag: false,
    date: 'Tuesday at 02:30 pm',
    customer: 'Diya Nair',
    customerEmail: 'diya@example.com',
    customerPhone: '+91 98765 43233',
    customerLocation: 'Surat GJ, India',
    orderCount: 2,
    channel: 'FastrV3',
    total: 995.00,
    currency: '₹',
    paymentStatus: 'Paid',
    fulfillmentStatus: 'Unfulfilled',
    items: 2,
    itemsDetails: [
      { name: 'Product Item 1', variant: 'Default', quantity: 2, image: '/images/product.jpg' }
    ],
    deliveryStatus: 'Pending',
    deliveryMethod: 'Standard (Prepaid)',
    tags: ['fastrr', 'low', 'SR_STANDARD'],
    destination: 'Surat, GJ, IN',
    labelStatus: 'No label',
    poNumber: '',
    returnStatus: '',
    fulfillmentId: '',
    trackingNumber: '',
  },
  {
    id: '26',
    orderId: '#SK6147',
    hasFlag: false,
    date: 'Tuesday at 02:10 pm',
    customer: 'Karan Joshi',
    customerEmail: 'karan@example.com',
    customerPhone: '+91 98765 43234',
    customerLocation: 'Lucknow UP, India',
    orderCount: 1,
    channel: 'FastrV3',
    total: 635.00,
    currency: '₹',
    paymentStatus: 'Payment pending',
    fulfillmentStatus: 'Unfulfilled',
    items: 1,
    itemsDetails: [
      { name: 'Product Item 1', variant: 'Default', quantity: 1, image: '/images/product.jpg' }
    ],
    deliveryStatus: 'Pending',
    deliveryMethod: 'Standard (COD)',
    tags: ['fastrr', 'high', 'SR_STANDARD'],
    destination: 'Lucknow, UP, IN',
    labelStatus: 'No label',
    poNumber: '',
    returnStatus: '',
    fulfillmentId: '',
    trackingNumber: '',
  },
  {
    id: '27',
    orderId: '#SK6146',
    hasFlag: true,
    date: 'Tuesday at 01:45 pm',
    customer: 'Ishita Das',
    customerEmail: 'ishita@example.com',
    customerPhone: '+91 98765 43235',
    customerLocation: 'Bhubaneswar OR, India',
    orderCount: 1,
    channel: 'FastrV3',
    total: 1575.00,
    currency: '₹',
    paymentStatus: 'Paid',
    fulfillmentStatus: 'Unfulfilled',
    items: 3,
    itemsDetails: [
      { name: 'Product Item 1', variant: 'Default', quantity: 3, image: '/images/product.jpg' }
    ],
    deliveryStatus: 'Pending',
    deliveryMethod: 'Standard (Prepaid)',
    tags: ['fastrr', 'medium', 'SR_STANDARD'],
    destination: 'Bhubaneswar, OR, IN',
    labelStatus: 'No label',
    poNumber: '',
    returnStatus: '',
    fulfillmentId: '',
    trackingNumber: '',
  },
  {
    id: '28',
    orderId: '#SK6145',
    hasFlag: false,
    date: 'Tuesday at 01:20 pm',
    customer: 'Aditya Rao',
    customerEmail: 'aditya@example.com',
    customerPhone: '+91 98765 43236',
    customerLocation: 'Indore MP, India',
    orderCount: 2,
    channel: 'FastrV3',
    total: 715.00,
    currency: '₹',
    paymentStatus: 'Payment pending',
    fulfillmentStatus: 'Unfulfilled',
    items: 1,
    itemsDetails: [
      { name: 'Product Item 1', variant: 'Default', quantity: 1, image: '/images/product.jpg' }
    ],
    deliveryStatus: 'Pending',
    deliveryMethod: 'Standard (COD)',
    tags: ['fastrr', 'low', 'SR_STANDARD'],
    destination: 'Indore, MP, IN',
    labelStatus: 'No label',
    poNumber: '',
    returnStatus: '',
    fulfillmentId: '',
    trackingNumber: '',
  },
  {
    id: '29',
    orderId: '#SK6144',
    hasFlag: false,
    date: 'Tuesday at 12:55 pm',
    customer: 'Meera Pillai',
    customerEmail: 'meera@example.com',
    customerPhone: '+91 98765 43237',
    customerLocation: 'Chandigarh CH, India',
    orderCount: 1,
    channel: 'FastrV3',
    total: 1350.00,
    currency: '₹',
    paymentStatus: 'Paid',
    fulfillmentStatus: 'Unfulfilled',
    items: 2,
    itemsDetails: [
      { name: 'Product Item 1', variant: 'Default', quantity: 2, image: '/images/product.jpg' }
    ],
    deliveryStatus: 'Pending',
    deliveryMethod: 'Standard (Prepaid)',
    tags: ['fastrr', 'high', 'SR_STANDARD'],
    destination: 'Chandigarh, CH, IN',
    labelStatus: 'No label',
    poNumber: '',
    returnStatus: '',
    fulfillmentId: '',
    trackingNumber: '',
  },
  {
    id: '30',
    orderId: '#SK6143',
    hasFlag: false,
    date: 'Tuesday at 12:30 pm',
    customer: 'Siddharth Kapoor',
    customerEmail: 'siddharth@example.com',
    customerPhone: '+91 98765 43238',
    customerLocation: 'Nagpur MH, India',
    orderCount: 1,
    channel: 'FastrV3',
    total: 575.00,
    currency: '₹',
    paymentStatus: 'Payment pending',
    fulfillmentStatus: 'Unfulfilled',
    items: 1,
    itemsDetails: [
      { name: 'Product Item 1', variant: 'Default', quantity: 1, image: '/images/product.jpg' }
    ],
    deliveryStatus: 'Pending',
    deliveryMethod: 'Standard (COD)',
    tags: ['fastrr', 'medium', 'SR_STANDARD'],
    destination: 'Nagpur, MH, IN',
    labelStatus: 'No label',
    poNumber: '',
    returnStatus: '',
    fulfillmentId: '',
    trackingNumber: '',
  },
];

// All available columns
const allColumns = [
  { id: 'order', title: 'Booking', default: true },
  { id: 'flags', title: 'Flags', default: true },
  { id: 'date', title: 'Date', default: true },
  { id: 'customer', title: 'Customer', default: true },
  { id: 'channel', title: 'Channel', default: true },
  { id: 'total', title: 'Total', default: true, alignment: 'end' },
  { id: 'paymentStatus', title: 'Payment status', default: true },
  { id: 'fulfillmentStatus', title: 'Fulfillment status', default: true },
  { id: 'items', title: 'Items', default: true },
  { id: 'deliveryStatus', title: 'Delivery status', default: true },
  { id: 'deliveryMethod', title: 'Delivery method', default: false },
  { id: 'tags', title: 'Tags', default: false },
  { id: 'destination', title: 'Destination', default: false },
  { id: 'labelStatus', title: 'Label status', default: false },
  { id: 'poNumber', title: 'PO number', default: false },
  { id: 'returnStatus', title: 'Return status', default: false },
];

// Sort options
const sortOptions = [
  { value: 'date', label: 'Date' },
  { value: 'total', label: 'Total' },
  { value: 'customer', label: 'Customer name' },
  { value: 'paymentStatus', label: 'Payment status' },
  { value: 'fulfillmentStatus', label: 'Fulfillment status' },
];

// LocalStorage keys
const STORAGE_KEYS = {
  VISIBLE_COLUMNS: 'shopify_orders_visible_columns',
  SORT_BY: 'shopify_orders_sort_by',
  SORT_DIRECTION: 'shopify_orders_sort_direction',
  ACTIVE_TAB: 'shopify_orders_active_tab',
};

// Helper functions for localStorage
const getStoredColumns = () => {
  if (typeof window === 'undefined') return null;
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.VISIBLE_COLUMNS);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (!parsed.includes('order')) {
        parsed.unshift('order');
      }
      return parsed;
    }
  } catch (e) {
    console.error('Error reading from localStorage:', e);
  }
  return null;
};

const getStoredSort = () => {
  if (typeof window === 'undefined') {
    return { sortBy: 'date', sortDirection: 'desc' };
  }
  try {
    const sortBy = localStorage.getItem(STORAGE_KEYS.SORT_BY);
    const sortDir = localStorage.getItem(STORAGE_KEYS.SORT_DIRECTION);
    return {
      sortBy: sortBy || 'date',
      sortDirection: sortDir || 'desc',
    };
  } catch (e) {
    console.error('Error reading from localStorage:', e);
  }
  return { sortBy: 'date', sortDirection: 'desc' };
};

const getStoredTab = () => {
  if (typeof window === 'undefined') return 'all';
  try {
    const tab = localStorage.getItem(STORAGE_KEYS.ACTIVE_TAB);
    return tab || 'all';
  } catch (e) {
    console.error('Error reading from localStorage:', e);
  }
  return 'all';
};

function OrdersPage() {
  const router = useRouter();
  const [searchValue, setSearchValue] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortPopoverActive, setSortPopoverActive] = useState(false);
  const [editColumnsMode, setEditColumnsMode] = useState(false);
  const [activeTab, setActiveTab] = useState(getStoredTab());
  const [searchActive, setSearchActive] = useState(false);

  // Popover states for customer and items
  const [customerPopoverActive, setCustomerPopoverActive] = useState(null);
  const [itemsPopoverActive, setItemsPopoverActive] = useState(null);
  const [flagPopoverActive, setFlagPopoverActive] = useState(null);
  const [emailModalActive, setEmailModalActive] = useState(false);
  const [emailModalOrder, setEmailModalOrder] = useState(null);
  const [selectedAddressOption, setSelectedAddressOption] = useState('current');

  // Initialize sort from localStorage
  const storedSort = getStoredSort();
  const [selectedSort, setSelectedSort] = useState(storedSort.sortBy);
  const [sortDirection, setSortDirection] = useState(storedSort.sortDirection);

  // Default visible columns
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
    singular: 'booking',
    plural: 'bookings',
  };

  const { selectedResources, allResourcesSelected, handleSelectionChange } =
    useIndexResourceState(ordersData);

  const handleSearchChange = useCallback((value) => {
    setSearchValue(value);
  }, []);

  const handleSearchClear = useCallback(() => {
    setSearchValue('');
  }, []);

  // Handle email modal backdrop
  useEffect(() => {
    if (emailModalActive) {
      // Add backdrop overlay
      const overlay = document.createElement('div');
      overlay.id = 'email-modal-overlay';
      overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.5);
        z-index: 399;
      `;
      document.body.appendChild(overlay);

      return () => {
        const existingOverlay = document.getElementById('email-modal-overlay');
        if (existingOverlay) {
          existingOverlay.remove();
        }
      };
    }
  }, [emailModalActive]);

  const handleSearchOpen = useCallback(() => {
    setSearchActive(true);
  }, []);

  const handleSearchCancel = useCallback(() => {
    setSearchActive(false);
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
    try {
      localStorage.setItem(STORAGE_KEYS.VISIBLE_COLUMNS, JSON.stringify(tempVisibleColumns));
    } catch (e) {
      console.error('Error saving to localStorage:', e);
    }
    setEditColumnsMode(false);
  }, [tempVisibleColumns]);

  const toggleColumnVisibility = useCallback((columnId) => {
    if (columnId === 'order') return;

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
    try {
      localStorage.setItem(STORAGE_KEYS.SORT_BY, value[0]);
    } catch (e) {
      console.error('Error saving to localStorage:', e);
    }
  }, []);

  const handleSortDirectionChange = useCallback((value) => {
    setSortDirection(value[0]);
    try {
      localStorage.setItem(STORAGE_KEYS.SORT_DIRECTION, value[0]);
    } catch (e) {
      console.error('Error saving to localStorage:', e);
    }
  }, []);

  const handleTabChange = useCallback((tab) => {
    setActiveTab(tab);
    try {
      localStorage.setItem(STORAGE_KEYS.ACTIVE_TAB, tab);
    } catch (e) {
      console.error('Error saving to localStorage:', e);
    }
  }, []);

  // Filter orders based on search
  const filteredOrders = ordersData.filter((order) =>
    order.orderId.toLowerCase().includes(searchValue.toLowerCase()) ||
    order.customer.toLowerCase().includes(searchValue.toLowerCase()) ||
    order.destination.toLowerCase().includes(searchValue.toLowerCase())
  );

  // Filter by tab
  const tabFilteredOrders = filteredOrders.filter((order) => {
    switch (activeTab) {
      case 'unfulfilled':
        return order.fulfillmentStatus !== 'Fulfilled';
      case 'unpaid':
        return order.paymentStatus === 'Payment pending';
      case 'open':
        return order.deliveryStatus === 'In transit' || order.deliveryStatus === 'Out for delivery';
      case 'archived':
        return order.deliveryStatus === 'Delivered';
      default:
        return true;
    }
  });

  // Sort orders
  const sortedOrders = [...tabFilteredOrders].sort((a, b) => {
    let comparison = 0;
    switch (selectedSort) {
      case 'total':
        comparison = a.total - b.total;
        break;
      case 'customer':
        comparison = a.customer.localeCompare(b.customer);
        break;
      case 'date':
        // Simple date comparison based on string (works for "Today", "Yesterday", etc.)
        comparison = a.id.localeCompare(b.id); // Use ID as proxy for date order
        break;
      default:
        comparison = 0;
    }
    return sortDirection === 'desc' ? -comparison : comparison;
  });

  const totalOrders = ordersData.length;

  const formatCurrency = (amount, currency) => {
    return `${currency}${amount.toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const formatItems = (count) => {
    return count === 1 ? '1 item' : `${count} items`;
  };

  // Get current visible columns for normal view
  const currentVisibleColumns = allColumns.filter(col => visibleColumns.includes(col.id));

  // Toggle customer popover
  const toggleCustomerPopover = useCallback((orderId) => {
    setCustomerPopoverActive(prev => prev === orderId ? null : orderId);
  }, []);

  // Toggle items popover
  const toggleItemsPopover = useCallback((orderId) => {
    setItemsPopoverActive(prev => prev === orderId ? null : orderId);
  }, []);

  // Toggle flag popover
  const toggleFlagPopover = useCallback((orderId) => {
    setFlagPopoverActive(prev => prev === orderId ? null : orderId);
  }, []);

  // Open email modal
  const openEmailModal = useCallback((order) => {
    setEmailModalOrder(order);
    setEmailModalActive(true);
    setFlagPopoverActive(null);
  }, []);

  // Close email modal
  const closeEmailModal = useCallback(() => {
    setEmailModalActive(false);
    setEmailModalOrder(null);
  }, []);

  // Render cell content based on column id
  const renderCellContent = (order, columnId) => {
    switch (columnId) {
      case 'order':
        return (
          <div style={{ minWidth: '90px' }}>
            <Text variant="bodySm" fontWeight="semibold" as="span" tone="subdued">
              {order.orderId}
            </Text>
          </div>
        );
      case 'flags':
        return order.hasFlag ? (
          <Popover
            active={flagPopoverActive === order.id}
            activator={
              <div
                onClick={() => toggleFlagPopover(order.id)}
                style={{ cursor: 'pointer', display: 'inline-flex' }}
              >
                <Icon source={AlertCircleIcon} tone="warning" />
              </div>
            }
            onClose={() => setFlagPopoverActive(null)}
            preferredPosition="below"
            preferredAlignment="left"
            fluidContent
            fixed={false}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              onMouseDown={(e) => e.stopPropagation()}
              style={{ padding: '16px', width: '340px', maxWidth: '340px', maxHeight: '70vh', overflowY: 'auto', overflowX: 'hidden' }}
            >
              <BlockStack gap="200">
                <InlineStack align="space-between" blockAlign="center">
                  <Text variant="headingMd" as="h3" fontWeight="bold">
                    Shipping address
                  </Text>
                  <button style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}>
                    <Icon source={EditIcon} tone="base" />
                  </button>
                </InlineStack>

                {/* Option 1: Current Address with Warning */}
                <label
                  style={{
                    display: 'block',
                    background: '#fef3ea',
                    padding: '12px',
                    borderRadius: '8px',
                    border: selectedAddressOption === 'current' ? '2px solid #000' : '1px solid #f0e5d8',
                    cursor: 'pointer'
                  }}
                >
                  {/* Current Address Section */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '8px',
                    marginBottom: '10px'
                  }}>
                    <input
                      type="radio"
                      name={`addressOption-${order.id}`}
                      value="current"
                      checked={selectedAddressOption === 'current'}
                      onChange={() => setSelectedAddressOption('current')}
                      style={{
                        width: '18px',
                        height: '18px',
                        marginTop: '2px',
                        flexShrink: 0,
                        accentColor: '#000',
                        cursor: 'pointer'
                      }}
                    />
                    <div style={{ flex: 1, overflow: 'hidden', minWidth: 0 }}>
                      <Text variant="bodyMd" as="p" fontWeight="semibold" style={{ color: '#8b6f47', marginBottom: '4px' }}>
                        Current
                      </Text>
                      <Text variant="bodySm" as="p" style={{ color: '#8b6f47', lineHeight: '1.4', wordBreak: 'break-word', whiteSpace: 'normal' }}>
                        Flat No. 602, Building No. 11F, Indiabulls Greens, Panvel, Kon
                      </Text>
                      <Text variant="bodySm" as="p" style={{ color: '#8b6f47' }}>
                        Maharashtra, 410206, India
                      </Text>
                    </div>
                  </div>

                  {/* Warning Message (part of Current option) */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '6px',
                    paddingTop: '10px',
                    borderTop: '1px solid #f0e5d8'
                  }}>
                    <div style={{ flexShrink: 0, marginTop: '2px' }}>
                      <Icon source={AlertCircleIcon} tone="warning" />
                    </div>
                    <Text variant="bodySm" as="p" style={{ color: '#8b6f47', flex: 1 }}>
                      Address line 1 should have less than 15 words
                    </Text>
                  </div>
                </label>

                {/* Option 2: Suggestion */}
                <label
                  style={{
                    display: 'block',
                    background: 'white',
                    padding: '12px',
                    borderRadius: '8px',
                    border: selectedAddressOption === 'suggestion' ? '2px solid #000' : '1px solid #c9cccf',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '8px'
                  }}>
                    <input
                      type="radio"
                      name={`addressOption-${order.id}`}
                      value="suggestion"
                      checked={selectedAddressOption === 'suggestion'}
                      onChange={() => setSelectedAddressOption('suggestion')}
                      style={{
                        width: '18px',
                        height: '18px',
                        marginTop: '2px',
                        flexShrink: 0,
                        accentColor: '#000',
                        cursor: 'pointer'
                      }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <Text variant="bodyMd" as="p" fontWeight="semibold" style={{ marginBottom: '4px' }}>
                        Suggestion
                      </Text>
                      <Text variant="bodySm" as="p" tone="subdued">
                        Contact customer or use <Link url="#">address checker</Link>
                      </Text>
                    </div>
                  </div>
                </label>

                {/* Email Customer Button */}
                <div style={{
                  borderTop: '1px solid #e3e3e3',
                  marginTop: '12px',
                  paddingTop: '12px',
                  display: 'flex',
                  justifyContent: 'flex-end'
                }}>
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      openEmailModal(order);
                    }}
                    variant="primary"
                  >
                    Email customer
                  </Button>
                </div>
              </BlockStack>
            </div>
          </Popover>
        ) : null;
      case 'date':
        return (
          <Text variant="bodySm" as="span" tone="subdued">
            {order.date}
          </Text>
        );
      case 'customer':
        return (
          <Popover
            active={customerPopoverActive === order.id}
            activator={
              <div
                onClick={() => toggleCustomerPopover(order.id)}
                className="clickable-cell"
                style={{
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <Text variant="bodySm" as="span" tone="subdued">
                  {order.customer}
                </Text>
                <svg className="dropdown-arrow" width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6 8L3 5h6l-3 3z" fill="#575757" />
                </svg>
              </div>
            }
            onClose={() => setCustomerPopoverActive(null)}
            fixed={false}
          >
            <div style={{ padding: '16px', minWidth: '280px' }}>
              <BlockStack gap="300">
                <Text variant="headingMd" as="h3">
                  {order.customer}
                </Text>
                <Text variant="bodyMd" as="p" tone="subdued">
                  {order.customerLocation}
                </Text>
                <Link>
                  {order.orderCount} order
                </Link>
                <Divider />
                <Link>
                  {order.customerEmail}
                </Link>
                <Text variant="bodyMd" as="p">
                  {order.customerPhone}
                </Text>
                <Divider />
                <Button fullWidth>View customer</Button>
              </BlockStack>
            </div>
          </Popover>
        );
      case 'channel':
        return (
          <Text variant="bodySm" as="span" tone="subdued">
            {order.channel}
          </Text>
        );
      case 'total':
        return (
          <Text variant="bodySm" as="span">
            {formatCurrency(order.total, order.currency)}
          </Text>
        );
      case 'paymentStatus':
        return order.paymentStatus === 'Paid' ? (
          <Badge tone="success">
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 12" width="12" height="12">
                <path d="M2 5a3 3 0 0 1 3-3h2a3 3 0 0 1 3 3v2a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3zm3-2a3 3 0 0 0-3 3h2a3 3 0 0 1 3-3z" fill="currentColor" />
              </svg>
              Paid
            </span>
          </Badge>
        ) : (
          <span style={{
            background: '#ffd6a4',
            padding: '4px 8px',
            borderRadius: '6px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 12" width="12" height="12">
              <path fillRule="evenodd" d="M2 5.125c0-1.726 1.4-3.125 3.125-3.125h1.75c0 3.125-3.125 3.125-3.125h1.75c0 1.726-1.4 3.125-3.125 3.125-3.125m3.125-1.875c-1.036 0-1.875.84-1.875 1.875v1.75c0 1.036.84 1.875 1.875 1.875h1.75c1.036 0 1.875-.84 1.875-1.875V5.125c0-1.036-.84-1.875-1.875-1.875z" fill="#bf5000" />
            </svg>
            <Text variant="bodySm" as="span" fontWeight="medium">
              Payment pending
            </Text>
          </span>
        );
      case 'fulfillmentStatus':
        return order.fulfillmentStatus === 'Fulfilled' ? (
          <Badge tone="success">
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#000' }}></span>
              Fulfilled
            </span>
          </Badge>
        ) : (
          <span style={{
            background: '#ffeb78',
            padding: '4px 8px',
            borderRadius: '6px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#a67c00' }}></span>
            <Text variant="bodySm" as="span" fontWeight="medium">
              Unfulfilled
            </Text>
          </span>
        );
      case 'items':
        return (
          <Popover
            active={itemsPopoverActive === order.id}
            activator={
              <div
                onClick={() => toggleItemsPopover(order.id)}
                className="clickable-cell"
                style={{
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <Text variant="bodySm" as="span" tone="subdued">
                  {formatItems(order.items)}
                </Text>
                <svg className="dropdown-arrow" width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6 8L3 5h6l-3 3z" fill="#575757" />
                </svg>
              </div>
            }
            onClose={() => setItemsPopoverActive(null)}
            fixed={false}
          >
            <div style={{ padding: '16px', minWidth: '350px' }}>
              <BlockStack gap="300">
                <InlineStack gap="200" blockAlign="center">
                  <Icon source={PackageIcon} />
                  <Badge tone="success">Fulfilled</Badge>
                </InlineStack>
                {order.fulfillmentId && (
                  <>
                    <Text variant="bodyMd" as="p" fontWeight="semibold">
                      {order.fulfillmentId}
                    </Text>
                    {order.trackingNumber && (
                      <InlineStack gap="200" blockAlign="center">
                        <Icon source={OrderIcon} />
                        <Link>{order.trackingNumber}</Link>
                      </InlineStack>
                    )}
                    <Text variant="bodySm" as="p" tone="subdued">
                      Delhivery
                    </Text>
                    <Divider />
                  </>
                )}
                {order.itemsDetails.map((item, idx) => (
                  <InlineStack key={idx} gap="300" blockAlign="start">
                    <div style={{ width: '50px', height: '50px', background: '#f1f1f1', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Icon source={PackageIcon} tone="subdued" />
                    </div>
                    <BlockStack gap="100">
                      <Text variant="bodyMd" as="p">
                        {item.name}
                      </Text>
                      <Text variant="bodySm" as="p" tone="subdued">
                        {item.variant}
                      </Text>
                    </BlockStack>
                    <Text variant="bodyMd" as="span">
                      × {item.quantity}
                    </Text>
                  </InlineStack>
                ))}
              </BlockStack>
            </div>
          </Popover>
        );
      case 'deliveryStatus':
        const hasTracking = order.fulfillmentId && order.trackingNumber;

        if (order.deliveryStatus === 'Delivered') {
          return (
            <Badge tone="success">
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#000' }}></span>
                Delivered
              </span>
            </Badge>
          );
        } else if (order.deliveryStatus === 'Out for delivery') {
          if (hasTracking) {
            return (
              <Popover
                active={itemsPopoverActive === `${order.id}-delivery`}
                activator={
                  <div
                    onClick={() => toggleItemsPopover(`${order.id}-delivery`)}
                    className="clickable-cell"
                    style={{ cursor: 'pointer' }}
                  >
                    <span style={{
                      background: '#d5ebfe',
                      padding: '4px 8px',
                      borderRadius: '6px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#0066cc' }}></span>
                      <Text variant="bodySm" as="span" fontWeight="medium">
                        Out for delivery
                      </Text>
                      <svg className="dropdown-arrow" width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M6 8L3 5h6l-3 3z" fill="#575757" />
                      </svg>
                    </span>
                  </div>
                }
                onClose={() => setItemsPopoverActive(null)}
                fixed={false}
              >
                <div style={{ padding: '16px', minWidth: '280px' }}>
                  <BlockStack gap="200">
                    <Text variant="bodyMd" as="p" fontWeight="semibold">
                      {order.fulfillmentId}
                    </Text>
                    <InlineStack gap="200" blockAlign="center">
                      <Icon source={OrderIcon} />
                      <Link>{order.trackingNumber}</Link>
                    </InlineStack>
                    <Text variant="bodySm" as="p" tone="subdued">
                      Delhivery
                    </Text>
                  </BlockStack>
                </div>
              </Popover>
            );
          }
          return (
            <span style={{
              background: '#d5ebfe',
              padding: '4px 8px',
              borderRadius: '6px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#0066cc' }}></span>
              <Text variant="bodySm" as="span" fontWeight="medium">
                Out for delivery
              </Text>
            </span>
          );
        } else if (order.deliveryStatus === 'Tracking added') {
          return (
            <Badge tone="subdued">Tracking added</Badge>
          );
        } else {
          if (hasTracking) {
            return (
              <Popover
                active={itemsPopoverActive === `${order.id}-delivery`}
                activator={
                  <div
                    onClick={() => toggleItemsPopover(`${order.id}-delivery`)}
                    className="clickable-cell"
                    style={{ cursor: 'pointer' }}
                  >
                    <span style={{
                      background: '#d5ebfe',
                      padding: '4px 8px',
                      borderRadius: '6px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#0066cc' }}></span>
                      <Text variant="bodySm" as="span" fontWeight="medium">
                        In transit
                      </Text>
                      <svg className="dropdown-arrow" width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M6 8L3 5h6l-3 3z" fill="#575757" />
                      </svg>
                    </span>
                  </div>
                }
                onClose={() => setItemsPopoverActive(null)}
                fixed={false}
              >
                <div style={{ padding: '16px', minWidth: '280px' }}>
                  <BlockStack gap="200">
                    <Text variant="bodyMd" as="p" fontWeight="semibold">
                      {order.fulfillmentId}
                    </Text>
                    <InlineStack gap="200" blockAlign="center">
                      <Icon source={OrderIcon} />
                      <Link>{order.trackingNumber}</Link>
                    </InlineStack>
                    <Text variant="bodySm" as="p" tone="subdued">
                      Delhivery
                    </Text>
                  </BlockStack>
                </div>
              </Popover>
            );
          }
          return (
            <span style={{
              background: '#d5ebfe',
              padding: '4px 8px',
              borderRadius: '6px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#0066cc' }}></span>
              <Text variant="bodySm" as="span" fontWeight="medium">
                In transit
              </Text>
            </span>
          );
        }
      case 'deliveryMethod':
        return (
          <Text variant="bodySm" as="span" tone="subdued">
            {order.deliveryMethod}
          </Text>
        );
      case 'tags':
        return (
          <InlineStack gap="100" wrap={false}>
            {order.tags.map((tag, idx) => (
              <span key={idx} style={{
                background: '#e3e3e3',
                padding: '2px 6px',
                borderRadius: '6px',
                whiteSpace: 'nowrap'
              }}>
                <Text variant="bodySm" as="span">
                  {tag}
                </Text>
              </span>
            ))}
          </InlineStack>
        );
      case 'destination':
        return (
          <Text variant="bodySm" as="span" tone="subdued">
            {order.destination}
          </Text>
        );
      case 'labelStatus':
        return (
          <Badge tone="warning">No label</Badge>
        );
      case 'poNumber':
        return (
          <Text variant="bodySm" as="span" tone="subdued">
            {order.poNumber}
          </Text>
        );
      case 'returnStatus':
        return (
          <Text variant="bodySm" as="span" tone="subdued">
            {order.returnStatus}
          </Text>
        );
      default:
        return null;
    }
  };

  const rowMarkup = sortedOrders.map((order, index) => (
    <IndexTable.Row
      id={order.id}
      key={order.id}
      selected={selectedResources.includes(order.id)}
      position={index}
    >
      {currentVisibleColumns.map((column) => (
        <IndexTable.Cell key={column.id}>
          {renderCellContent(order, column.id)}
        </IndexTable.Cell>
      ))}
    </IndexTable.Row>
  ));

  // Render a single column as a mini table for edit mode
  const renderColumnBlock = (column) => {
    const isVisible = tempVisibleColumns.includes(column.id);
    const isOrderColumn = column.id === 'order';

    return (
      <div
        key={column.id}
        className={`edit-column-item ${!isVisible ? 'hidden' : ''}`}
      >
        <div className="edit-column-header">
          <Text variant="bodySm" as="span" fontWeight="medium">
            {column.title}
          </Text>
          {!isOrderColumn && (
            <button
              onClick={() => toggleColumnVisibility(column.id)}
              className={`edit-column-toggle-btn ${!isVisible ? 'hidden' : ''}`}
              aria-label={isVisible ? `Hide ${column.title}` : `Show ${column.title}`}
            >
              <Icon source={isVisible ? ViewIcon : HideIcon} tone="subdued" />
            </button>
          )}
        </div>

        <div className={`edit-column-data ${!isVisible ? 'hidden' : ''}`}>
          {sortedOrders.slice(0, 15).map((order, index) => (
            <div
              key={order.id}
              className="edit-column-row"
              style={{
                borderBottom: index < 14 ? '1px solid #f1f1f1' : 'none',
              }}
            >
              {renderCellContent(order, column.id)}
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
      accessibilityLabel="Sort orders"
    />
  );

  // Tab styles
  const getTabButtonStyle = (tab) => {
    const isActive = activeTab === tab;
    return {
      background: isActive ? '#f1f1f1' : 'transparent',
      border: 'none',
      padding: '4px 8px',
      cursor: 'pointer',
      fontWeight: isActive ? '600' : '400',
      fontSize: '12px',
      borderRadius: '6px',
    };
  };

  return (
    <>
      <style>{`
        .orders-page-wrapper .Polaris-IndexTable__TableCell {
          padding: 8px 12px !important;
        }
        .orders-page-wrapper .Polaris-IndexTable__TableRow {
          min-height: 36px !important;
        }
        .orders-page-wrapper .search-field-wrapper .Polaris-TextField__Backdrop {
          border: 1px solid #c9cccf !important;
          border-radius: 8px !important;
          background: white !important;
        }
        .orders-page-wrapper .search-field-wrapper .Polaris-TextField:focus-within .Polaris-TextField__Backdrop {
          border: 1px solid #c9cccf !important;
          box-shadow: none !important;
        }
        .orders-page-wrapper .search-field-wrapper .Polaris-TextField__Input:focus {
          outline: none !important;
          box-shadow: none !important;
        }
        .clickable-cell .dropdown-arrow {
          opacity: 0;
          transition: opacity 0.2s;
        }
        .clickable-cell:hover .dropdown-arrow {
          opacity: 1;
        }
        .stats-cards-container > div > div > div {
          border: none !important;
          border-radius: 0 !important;
          box-shadow: none !important;
        }
      `}</style>
      <div className="orders-page-wrapper customers-page-wrapper width-full">
        <Page
          title={
            <InlineStack gap="200" blockAlign="center">
              <Icon source={OrderIcon} />
              <span className="customers-page-title">Bookings</span>
            </InlineStack>
          }
          primaryAction={{
            content: 'Create booking',
            onAction: () => router.push('/dashboard/bookings/new'),
          }}
          secondaryActions={[
            {
              content: 'Export',
              onAction: () => console.log('Export'),
            },
            {
              content: 'More actions',
              onAction: () => console.log('More actions'),
            },
          ]}
        >
          {/* Stats bar with metrics */}
          <BookingsStats />

          {/* Main table card */}
          <Card padding="0">
            {/* Header with tabs and buttons OR search bar */}
            {searchActive ? (
              <>
                <Box padding="300" paddingBlockEnd="200" borderBlockEndWidth="025" borderColor="border">
                  <InlineStack align="space-between" blockAlign="center" gap="200">
                    <div style={{ flex: 1 }} className="search-field-wrapper">
                      <TextField
                        placeholder="Searching all bookings"
                        value={searchValue}
                        onChange={handleSearchChange}
                        clearButton
                        onClearButtonClick={handleSearchClear}
                        prefix={<Icon source={SearchIcon} tone="subdued" />}
                        autoComplete="off"
                        autoFocus
                      />
                    </div>
                    <InlineStack gap="200" blockAlign="center">
                      <button
                        onClick={handleSearchCancel}
                        style={{
                          border: 'none',
                          background: 'transparent',
                          padding: '6px 12px',
                          cursor: 'pointer',
                          fontSize: '14px',
                          borderRadius: '6px',
                          transition: 'background 0.2s'
                        }}
                        onMouseEnter={(e) => e.target.style.background = '#f1f1f1'}
                        onMouseLeave={(e) => e.target.style.background = 'transparent'}
                      >
                        Cancel
                      </button>
                      <Button>Save as</Button>
                      <Button icon={SortIcon} accessibilityLabel="Sort" />
                    </InlineStack>
                  </InlineStack>
                </Box>
                <Box padding="300" paddingBlockStart="0" paddingBlockEnd="200">
                  <div style={{ paddingTop: '1px' }}>
                    <button style={{
                      border: '1px dashed #c9cccf',
                      borderRadius: '8px',
                      padding: '6px 12px',
                      background: 'transparent',
                      cursor: 'pointer',
                      fontSize: '14px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      <span style={{ fontSize: '16px' }}>+</span>
                      Add filter
                    </button>
                  </div>
                </Box>
              </>
            ) : (
              <Box padding="200" paddingBlockEnd="150" borderBlockEndWidth="025" borderColor="border">
                <InlineStack align="space-between" blockAlign="center">
                  <InlineStack gap="100">
                    <button onClick={() => handleTabChange('all')} style={getTabButtonStyle('all')}>
                      All
                    </button>
                    <button onClick={() => handleTabChange('unfulfilled')} style={getTabButtonStyle('unfulfilled')}>
                      Unfulfilled
                    </button>
                    <button onClick={() => handleTabChange('unpaid')} style={getTabButtonStyle('unpaid')}>
                      Unpaid
                    </button>
                    <button onClick={() => handleTabChange('open')} style={getTabButtonStyle('open')}>
                      Open
                    </button>
                    <button onClick={() => handleTabChange('archived')} style={getTabButtonStyle('archived')}>
                      Archived
                    </button>
                    <button onClick={() => console.log('Add tab')} style={{ ...getTabButtonStyle(''), fontSize: '18px' }}>
                      +
                    </button>
                  </InlineStack>

                  <InlineStack gap="200" blockAlign="center">
                    {editColumnsMode ? (
                      <ButtonGroup>
                        <Button onClick={handleCancelEditColumns}>Cancel</Button>
                        <Button variant="primary" onClick={handleSaveColumns}>Save</Button>
                      </ButtonGroup>
                    ) : (
                      <>
                        <Button
                          icon={SearchIcon}
                          onClick={handleSearchOpen}
                          accessibilityLabel="Search"
                        />
                        <Button
                          icon={LayoutColumns3Icon}
                          onClick={handleEditColumnsClick}
                          accessibilityLabel="Edit columns"
                        />

                        <Popover
                          active={sortPopoverActive}
                          activator={sortActivator}
                          onClose={toggleSortPopover}
                          preferredAlignment="right"
                          preferredPosition="below"
                          fixed={false}
                        >
                          <div className="sort-popover-content width-220">
                            <Box padding="300" paddingBlockEnd="100">
                              <Text variant="headingSm" as="h3">
                                Sort by
                              </Text>
                            </Box>

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

                            <div className="padding-bottom-8">
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
            )}

            {/* Index Table or Edit Columns View */}
            {editColumnsMode ? (
              <div className="edit-columns-container">
                {allColumns.map((column) => renderColumnBlock(column))}
              </div>
            ) : (
              <div className="table-scroll-container">
                <IndexTable
                  resourceName={resourceName}
                  itemCount={sortedOrders.length}
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

            {/* Pagination */}
            {!editColumnsMode && (
              <Box padding="300" borderBlockStartWidth="025" borderColor="border">
                <InlineStack align="space-between" blockAlign="center">
                  <Pagination
                    hasPrevious={currentPage > 1}
                    onPrevious={() => setCurrentPage(currentPage - 1)}
                    hasNext={currentPage * itemsPerPage < totalOrders}
                    onNext={() => setCurrentPage(currentPage + 1)}
                  />
                  <Text variant="bodySm" as="span" tone="subdued">
                    {`${(currentPage - 1) * itemsPerPage + 1}-${Math.min(
                      currentPage * itemsPerPage,
                      totalOrders
                    )}`}
                  </Text>
                </InlineStack>
              </Box>
            )}
          </Card>

          {/* Email Customer Modal */}
          <EmailCustomerModal
            isOpen={emailModalActive}
            onClose={closeEmailModal}
            order={emailModalOrder}
          />
        </Page>
      </div>
    </>
  );
}

export default OrdersPage;
