'use client';

import { useState, useCallback, useMemo, useRef } from 'react';
import {
  Card,
  Text,
  InlineStack,
  BlockStack,
  Box,
  Popover,
  Icon,
  RadioButton,
  Button,
} from '@shopify/polaris';
import { CalendarIcon, ChevronLeftIcon, ChevronRightIcon } from '@shopify/polaris-icons';
import StatCard from '../Analytics/cards/StatCard';

// Date range options
const dateRangeOptions = [
  { label: 'Today', value: 'today', description: 'Compared to yesterday up to current hour' },
  { label: 'Last 7 days', value: 'last7days', description: 'Compared to the previous 7 days' },
  { label: 'Last 30 days', value: 'last30days', description: 'Compared to the previous 30 days' },
];

// Mock data for different date ranges
const mockDataByRange = {
  today: {
    bookings: { value: '7', change: '250%', changeType: 'positive', sparkline: [3, 4, 2, 5, 6, 4, 7] },
    items: { value: '17', change: '467%', changeType: 'positive', sparkline: [8, 12, 10, 15, 14, 16, 17] },
    returns: { value: '₹0', change: '—', changeType: 'neutral', sparkline: [0, 0, 0, 0, 0, 0, 0] },
    fulfilled: { value: '5', change: '67%', changeType: 'positive', sparkline: [2, 3, 2, 4, 3, 4, 5] },
    delivered: { value: '3', change: '50%', changeType: 'positive', sparkline: [1, 1, 2, 2, 2, 3, 3] },
  },
  last7days: {
    bookings: { value: '42', change: '35%', changeType: 'positive', sparkline: [5, 6, 4, 7, 8, 6, 6] },
    items: { value: '98', change: '28%', changeType: 'positive', sparkline: [12, 14, 10, 16, 18, 14, 14] },
    returns: { value: '₹2,450', change: '12%', changeType: 'negative', sparkline: [0, 0, 1, 0, 1, 0, 0] },
    fulfilled: { value: '38', change: '22%', changeType: 'positive', sparkline: [4, 5, 4, 6, 7, 6, 6] },
    delivered: { value: '31', change: '18%', changeType: 'positive', sparkline: [3, 4, 4, 5, 5, 5, 5] },
  },
  last30days: {
    bookings: { value: '156', change: '42%', changeType: 'positive', sparkline: [4, 5, 4, 5, 6, 5, 5, 6, 5, 6, 5, 5, 6, 5, 5] },
    items: { value: '412', change: '38%', changeType: 'positive', sparkline: [12, 13, 12, 14, 15, 14, 13, 14, 13, 14, 13, 14, 15, 14, 14] },
    returns: { value: '₹8,920', change: '5%', changeType: 'negative', sparkline: [0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0] },
    fulfilled: { value: '142', change: '45%', changeType: 'positive', sparkline: [4, 4, 4, 5, 5, 5, 4, 5, 5, 5, 5, 4, 5, 5, 5] },
    delivered: { value: '128', change: '52%', changeType: 'positive', sparkline: [3, 4, 4, 4, 4, 4, 4, 4, 4, 5, 4, 4, 5, 4, 5] },
  },
};

function BookingsStats() {
  const [dateRange, setDateRange] = useState('today');
  const [dateRangePopoverActive, setDateRangePopoverActive] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const scrollContainerRef = useRef(null);

  const handleDateRangeChange = useCallback((value) => {
    setDateRange(value);
    // Keep dropdown open so user can see data update
  }, []);

  // Get current data based on selected date range
  const currentData = useMemo(() => mockDataByRange[dateRange], [dateRange]);

  // Check scroll position to enable/disable buttons
  const checkScrollPosition = useCallback(() => {
    const container = scrollContainerRef.current;
    if (container) {
      setCanScrollLeft(container.scrollLeft > 0);
      setCanScrollRight(container.scrollLeft < container.scrollWidth - container.clientWidth - 1);
    }
  }, []);

  // Scroll left/right handlers
  const scrollLeft = useCallback(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.scrollBy({ left: -200, behavior: 'smooth' });
      setTimeout(checkScrollPosition, 300);
    }
  }, [checkScrollPosition]);

  const scrollRight = useCallback(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.scrollBy({ left: 200, behavior: 'smooth' });
      setTimeout(checkScrollPosition, 300);
    }
  }, [checkScrollPosition]);

  return (
    <Box paddingBlockEnd="300">
      <Card padding="0" borderWidth="025">
        <div
          style={{ position: 'relative' }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <InlineStack gap="0" wrap={false} blockAlign="stretch">
            {/* Date Range Selector */}
            <Box
              padding="300"
              minWidth="140px"
              borderInlineEndWidth="025"
              borderColor="border"
            >
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
              }}>
                <Popover
                  active={dateRangePopoverActive}
                  activator={
                    <div
                      onClick={() => setDateRangePopoverActive(!dateRangePopoverActive)}
                      style={{
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                      }}
                    >
                      <span style={{ display: 'flex', alignItems: 'center' }}>
                        <Icon source={CalendarIcon} tone="base" />
                      </span>
                      <Text variant="bodyMd" as="span" fontWeight="semibold">
                        {dateRangeOptions.find(opt => opt.value === dateRange)?.label || 'Today'}
                      </Text>
                    </div>
                  }
                  onClose={() => setDateRangePopoverActive(false)}
                  fixed={false}
                >
                  <div style={{ padding: '8px', minWidth: '260px' }}>
                    <BlockStack gap="0">
                      {dateRangeOptions.map((option) => (
                        <div
                          key={option.value}
                          onClick={() => handleDateRangeChange(option.value)}
                          style={{
                            cursor: 'pointer',
                            padding: '6px 8px',
                            borderRadius: '6px',
                            backgroundColor: dateRange === option.value ? '#f6f6f7' : 'transparent',
                          }}
                        >
                          <InlineStack gap="200" blockAlign="center" wrap={false}>
                            <RadioButton
                              label=""
                              checked={dateRange === option.value}
                              id={`date-range-${option.value}`}
                              name="dateRange"
                              onChange={() => handleDateRangeChange(option.value)}
                            />
                            <BlockStack gap="0">
                              <Text variant="bodySm" as="p" fontWeight="medium">
                                {option.label}
                              </Text>
                              <Text variant="bodySm" as="p" tone="subdued" fontWeight="regular">
                                {option.description}
                              </Text>
                            </BlockStack>
                          </InlineStack>
                        </div>
                      ))}
                    </BlockStack>
                  </div>
                </Popover>
              </div>
            </Box>

            {/* Stats Cards - Scrollable */}
            <div
              ref={scrollContainerRef}
              onScroll={checkScrollPosition}
              style={{
                flex: 1,
                display: 'flex',
                overflowX: 'auto',
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
              }}
              className="stats-scroll-container"
            >
              <Box
                padding="300"
                paddingInlineStart="400"
                paddingInlineEnd="400"
                minWidth="180px"
              >
                <StatCard
                  title="Orders"
                  value={currentData.bookings.value}
                  change={currentData.bookings.change}
                  changeType={currentData.bookings.changeType}
                  sparklineData={currentData.bookings.sparkline}
                  compact
                />
              </Box>
              <div style={{ width: '1px', background: '#e3e3e3', alignSelf: 'stretch', flexShrink: 0 }} />
              <Box
                padding="300"
                paddingInlineStart="400"
                paddingInlineEnd="400"
                minWidth="180px"
              >
                <StatCard
                  title="Items ordered"
                  value={currentData.items.value}
                  change={currentData.items.change}
                  changeType={currentData.items.changeType}
                  sparklineData={currentData.items.sparkline}
                  compact
                />
              </Box>
              <div style={{ width: '1px', background: '#e3e3e3', alignSelf: 'stretch', flexShrink: 0 }} />
              <Box
                padding="300"
                paddingInlineStart="400"
                paddingInlineEnd="400"
                minWidth="180px"
              >
                <StatCard
                  title="Returns"
                  value={currentData.returns.value}
                  change={currentData.returns.change}
                  changeType={currentData.returns.changeType}
                  sparklineData={currentData.returns.sparkline}
                  compact
                />
              </Box>
              <div style={{ width: '1px', background: '#e3e3e3', alignSelf: 'stretch', flexShrink: 0 }} />
              <Box
                padding="300"
                paddingInlineStart="400"
                paddingInlineEnd="400"
                minWidth="180px"
              >
                <StatCard
                  title="Orders fulfilled"
                  value={currentData.fulfilled.value}
                  change={currentData.fulfilled.change}
                  changeType={currentData.fulfilled.changeType}
                  sparklineData={currentData.fulfilled.sparkline}
                  compact
                />
              </Box>
              <div style={{ width: '1px', background: '#e3e3e3', alignSelf: 'stretch', flexShrink: 0 }} />
              <Box
                padding="300"
                paddingInlineStart="400"
                paddingInlineEnd="400"
                minWidth="180px"
              >
                <StatCard
                  title="Orders delivered"
                  value={currentData.delivered.value}
                  change={currentData.delivered.change}
                  changeType={currentData.delivered.changeType}
                  sparklineData={currentData.delivered.sparkline}
                  compact
                />
              </Box>
            </div>

            {/* Navigation Buttons */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '2px',
                padding: '0 8px',
                borderLeft: '1px solid #e3e3e3',
                opacity: isHovered ? 1 : 0,
                transition: 'opacity 0.2s ease',
                pointerEvents: isHovered ? 'auto' : 'none',
              }}
            >
              <Button
                icon={ChevronLeftIcon}
                variant="tertiary"
                size="slim"
                onClick={scrollLeft}
                disabled={!canScrollLeft}
                accessibilityLabel="Scroll left"
              />
              <Button
                icon={ChevronRightIcon}
                variant="tertiary"
                size="slim"
                onClick={scrollRight}
                disabled={!canScrollRight}
                accessibilityLabel="Scroll right"
              />
            </div>
          </InlineStack>
        </div>
      </Card>
    </Box>
  );
}

export default BookingsStats;
