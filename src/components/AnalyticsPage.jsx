import { useState, useCallback } from 'react';
import {
    Card,
    Text,
    Button,
    ButtonGroup,
    BlockStack,
    InlineStack,
    Icon,
    Badge,
} from '@shopify/polaris';
import {
    RefreshIcon,
    MaximizeIcon,
    EditIcon,
    CalendarIcon,
} from '@shopify/polaris-icons';

// Import components
import ChartHeading from './Analytics/ChartHeading';
import DatePickerModal from './Analytics/modals/DatePickerModal';
import ComparisonDatePickerModal from './Analytics/modals/ComparisonDatePickerModal';
import CurrencySelector from './Analytics/modals/CurrencySelector';
import LineChart from './Analytics/charts/LineChart';
import SimpleLineChart from './Analytics/charts/SimpleLineChart';
import DonutChartWithHover from './Analytics/charts/DonutChartWithHover';
import StatCard from './Analytics/cards/StatCard';
import SalesBreakdown from './Analytics/cards/SalesBreakdown';
import ProductSalesList from './Analytics/cards/ProductSalesList';
import ConversionFunnel from './Analytics/cards/ConversionFunnel';
import DeviceTypeChart from './Analytics/cards/DeviceTypeChart';
import SessionsByLocation from './Analytics/cards/SessionsByLocation';
import TotalSalesBySocialReferrer from './Analytics/cards/TotalSalesBySocialReferrer';
import CohortTable from './Analytics/cards/CohortTable';
import SessionsByLandingPage from './Analytics/cards/SessionsByLandingPage';
import SessionsBySocialReferrer from './Analytics/cards/SessionsBySocialReferrer';
import TotalSalesByReferrer from './Analytics/cards/TotalSalesByReferrer';
import SalesAttributedToMarketing from './Analytics/cards/SalesAttributedToMarketing';
import SessionsByReferrer from './Analytics/cards/SessionsByReferrer';
import ProductsBySellThroughRate from './Analytics/cards/ProductsBySellThroughRate';
import NoDataPlaceholder from './Analytics/cards/NoDataPlaceholder';

function AnalyticsPage() {
    const [dateModalOpen, setDateModalOpen] = useState(false);
    const [comparisonModalOpen, setComparisonModalOpen] = useState(false);
    const [currencyPopoverActive, setCurrencyPopoverActive] = useState(false);
    const [selectedCurrency, setSelectedCurrency] = useState('INR');
    const [selectedCurrencySymbol, setSelectedCurrencySymbol] = useState('₹');
    const [selectedDateLabel, setSelectedDateLabel] = useState('Today');
    const [selectedCompareLabel, setSelectedCompareLabel] = useState('Dec 1, 2025');

    const toggleDateModal = useCallback(() => setDateModalOpen((open) => !open), []);
    const toggleComparisonModal = useCallback(() => setComparisonModalOpen((open) => !open), []);
    const toggleCurrencyPopover = useCallback(() => setCurrencyPopoverActive((active) => !active), []);

    const handleCurrencyChange = useCallback((currency) => {
        setSelectedCurrency(currency.code);
        setSelectedCurrencySymbol(currency.symbol);
    }, []);

    return (
        <>
            <style>{`
      .analytics-page {
  padding: 0 20px 40px 20px;
  max-width: 100%;
  overflow-x: hidden;
  box-sizing: border-box;
}
        
        .analytics-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 0 8px 0;
        }
        
        .analytics-header-actions .Polaris-Button {
          background: #e3e3e3 !important;
          border: none !important;
          box-shadow: none !important;
        }
        
        .analytics-header-actions .Polaris-Button:hover {
          background: #d4d4d4 !important;
          border: none !important;
          box-shadow: none !important;
        }
        
        .analytics-title {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .analytics-title-icon {
          width: 20px;
          height: 20px;
        }
        
        .analytics-filters {
          display: flex;
          gap: 8px;
          margin-bottom: 16px;
          align-items: center;
        }
        
       .analytics-grid {
  display: grid;
  gap: 16px;
  max-width: 100%;
  overflow: hidden;
}
        
.analytics-row-4 {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  min-width: 0;
}

.analytics-row-2-1 {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 16px;
  min-width: 0;
}

.analytics-row-3 {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  min-width: 0;
}
        
        .analytics-card {
          background: white;
          border-radius: 12px;
          padding: 20px;
          border: 1px solid #e3e3e3;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
            overflow: hidden;
  min-width: 0;

        }
        
        .chart-legend {
          display: flex;
          gap: 16px;
          justify-content: center;
          margin-top: 12px;
        }
        
        .legend-item {
          display: flex;
          align-items: center;
          gap: 6px;
        }
        
        .legend-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
        }
        
        @media (max-width: 1200px) {
          .analytics-row-4 {
            grid-template-columns: repeat(2, 1fr);
          }
          
          .analytics-row-2-1 {
            grid-template-columns: 1fr;
          }
          
          .analytics-row-3 {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

            <div className="analytics-page">
                {/* Header */}
                <div className="analytics-header">
                    <div className="analytics-title">
                        <svg className="analytics-title-icon" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M3 11h2v6H3v-6zm4-4h2v10H7V7zm4-4h2v14h-2V3zm4 6h2v8h-2V9z" />
                        </svg>
                        <Text variant="headingLg" as="h1">Analytics</Text>
                        <Text variant="bodySm" as="span" tone="subdued">Last refreshed: 5:00 PM</Text>
                    </div>
                    <InlineStack gap="200">
                        <div className="analytics-header-actions">
                            <InlineStack gap="200">
                                <Button icon={RefreshIcon} accessibilityLabel="Refresh" />
                                <Button icon={MaximizeIcon} accessibilityLabel="Maximize" />
                                <Button icon={EditIcon} accessibilityLabel="Edit" />
                            </InlineStack>
                        </div>
                        <Button variant="primary">New exploration</Button>
                    </InlineStack>
                </div>

                {/* Filters */}
                <div className="analytics-filters">
                    <ButtonGroup>
                        <Button icon={CalendarIcon} onClick={toggleDateModal}>
                            {selectedDateLabel}
                        </Button>
                        <Button icon={CalendarIcon} onClick={toggleComparisonModal}>
                            {selectedCompareLabel}
                        </Button>
                    </ButtonGroup>

                    <div style={{ position: 'relative' }}>
                        <Button onClick={toggleCurrencyPopover}>
                            $≡ {selectedCurrency} {selectedCurrencySymbol}
                        </Button>
                        {currencyPopoverActive && (
                            <>
                                <div
                                    style={{
                                        position: 'fixed',
                                        top: 0,
                                        left: 0,
                                        right: 0,
                                        bottom: 0,
                                        zIndex: 999
                                    }}
                                    onClick={() => setCurrencyPopoverActive(false)}
                                />
                                <div style={{
                                    position: 'absolute',
                                    top: '100%',
                                    left: 0,
                                    marginTop: '4px',
                                    background: 'white',
                                    borderRadius: '12px',
                                    boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                                    zIndex: 1000,
                                    width: '320px',
                                    overflow: 'hidden'
                                }}>
                                    <CurrencySelector
                                        selectedCurrency={selectedCurrency}
                                        onCurrencyChange={handleCurrencyChange}
                                        onClose={() => setCurrencyPopoverActive(false)}
                                    />
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* Date Picker Modal */}
                <DatePickerModal
                    open={dateModalOpen}
                    onClose={toggleDateModal}
                    onApply={() => setSelectedDateLabel('Today')}
                />

                {/* Comparison Date Picker Modal */}
                <ComparisonDatePickerModal
                    open={comparisonModalOpen}
                    onClose={toggleComparisonModal}
                    onApply={() => setSelectedCompareLabel('Dec 1, 2025')}
                />

                <div className="analytics-grid">
                    {/* Top Stats Row */}
                    <div className="analytics-row-4">
                        <StatCard
                            title="Gross sales"
                            value="₹6,093"
                            change="59%"
                            changeType="positive"
                            sparklineData={[1, 3, 1, 2, 5, 2, 1, 4, 6, 3, 2, 8, 4, 2]}
                        />
                        <StatCard
                            title="Returning customer rate"
                            value="40%"
                            change="40%"
                            changeType="critical"
                            sparklineData={[1, 2, 1, 1, 4, 2, 1, 3, 5, 2, 1, 6, 3, 2]}
                            sparklineData2={[1, 1, 2, 1, 2, 3, 1, 2, 3, 1, 2, 4, 2, 1]}
                            dualLine
                        />
                        <StatCard
                            title="Orders fulfilled"
                            value="7"
                            change="61%"
                            changeType="critical"
                            sparklineData={[0, 0, 0, 0, 0, 1, 2, 1, 0, 0, 0, 1, 0, 0]}
                        />
                        <StatCard
                            title="Orders"
                            value="5"
                            change="67%"
                            changeType="positive"
                            sparklineData={[1, 2, 1, 4, 2, 1, 5, 3, 1, 6, 2, 4, 7, 3]}
                        />
                    </div>

                    {/* Main Chart Row */}
                    <div className="analytics-row-2-1">
                        <div className="analytics-card" style={{ padding: '20px 24px' }}>
                            <BlockStack gap="200">
                                <ChartHeading title="Total sales over time" />
                                <InlineStack gap="200" blockAlign="baseline">
                                    <Text variant="headingLg" as="p" fontWeight="semibold">₹6,009.29</Text>
                                    <span style={{ color: '#369962', fontSize: '13px' }}>
                                        ↗ 5.1K%
                                    </span>
                                </InlineStack>
                                <LineChart height={280} />
                                <div className="chart-legend">
                                    <div className="legend-item">
                                        <div className="legend-dot" style={{ background: '#12acf0' }} />
                                        <Text variant="bodySm" as="span" tone="subdued">Dec 2, 2025</Text>
                                    </div>
                                    <div className="legend-item">
                                        <div className="legend-dot" style={{ background: '#12acf0', opacity: 0.4 }} />
                                        <Text variant="bodySm" as="span" tone="subdued">Dec 1, 2025</Text>
                                    </div>
                                </div>
                            </BlockStack>
                        </div>
                        <div className="analytics-card" style={{ padding: '20px 24px' }}>
                            <SalesBreakdown />
                        </div>
                    </div>

                    {/* Second Row */}
                    <div className="analytics-row-3">
                        <div className="analytics-card">
                            <BlockStack gap="300">
                                <ChartHeading title="Total sales by sales channel" />
                                <InlineStack gap="400" blockAlign="center">
                                    <DonutChartWithHover
                                        totalValue="₹8.3K"
                                        totalChange="198%"
                                        changeType="positive"
                                        size={180}
                                        segments={[
                                            { label: 'FastrrV3', value: '₹7.6K', fullValue: '₹7,575.25', change: '173%', changeType: 'positive', color: '#12acf0', percentage: 92 },
                                            { label: 'Online Store', value: '₹699', fullValue: '₹699.00', color: '#8b5cf6', percentage: 8 },
                                        ]}
                                    />
                                    <BlockStack gap="200">
                                        <InlineStack gap="200" blockAlign="center">
                                            <div style={{ width: 12, height: 12, background: '#12acf0', borderRadius: 2 }} />
                                            <Text variant="bodySm" as="span">FastrrV3</Text>
                                            <Text variant="bodySm" as="span" fontWeight="medium">₹7.6K</Text>
                                            <Text variant="bodySm" as="span" tone="success">↗ 173%</Text>
                                        </InlineStack>
                                        <InlineStack gap="200" blockAlign="center">
                                            <div style={{ width: 12, height: 12, background: '#8b5cf6', borderRadius: 2 }} />
                                            <Text variant="bodySm" as="span">Online S...</Text>
                                            <Text variant="bodySm" as="span" fontWeight="medium">₹699</Text>
                                            <Text variant="bodySm" as="span" tone="subdued">—</Text>
                                        </InlineStack>
                                    </BlockStack>
                                </InlineStack>
                            </BlockStack>
                        </div>
                        <div className="analytics-card">
                            <BlockStack gap="300">
                                <ChartHeading title="Average order value over time" />
                                <InlineStack gap="200" blockAlign="baseline">
                                    <Text variant="headingLg" as="p" fontWeight="semibold">₹1,314.15</Text>
                                    <Text variant="bodySm" as="span" tone="success">↗ 47%</Text>
                                </InlineStack>
                                <SimpleLineChart height={180} />
                                <div className="chart-legend">
                                    <div className="legend-item">
                                        <div className="legend-dot" style={{ background: '#12acf0' }} />
                                        <Text variant="bodySm" as="span" tone="subdued">Dec 3, 2025</Text>
                                    </div>
                                    <div className="legend-item">
                                        <div className="legend-dot" style={{ background: '#c4c4c4' }} />
                                        <Text variant="bodySm" as="span" tone="subdued">Dec 2, 2025</Text>
                                    </div>
                                </div>
                            </BlockStack>
                        </div>
                        <div className="analytics-card">
                            <ProductSalesList />
                        </div>
                    </div>

                    {/* Third Row - Sessions */}
                    <div className="analytics-row-3">
                        <div className="analytics-card">
                            <BlockStack gap="300">
                                <ChartHeading title="Sessions over time" />
                                <InlineStack gap="200" blockAlign="baseline">
                                    <Text variant="headingLg" as="p" fontWeight="semibold">213</Text>
                                    <Text variant="bodySm" as="span" tone="success">↑ 20%</Text>
                                </InlineStack>
                                <SimpleLineChart height={180} />
                                <div className="chart-legend">
                                    <div className="legend-item">
                                        <div className="legend-dot" style={{ background: '#12acf0' }} />
                                        <Text variant="bodySm" as="span" tone="subdued">Dec 2, 2025</Text>
                                    </div>
                                    <div className="legend-item">
                                        <div className="legend-dot" style={{ background: '#c4c4c4' }} />
                                        <Text variant="bodySm" as="span" tone="subdued">Dec 1, 2025</Text>
                                    </div>
                                </div>
                            </BlockStack>
                        </div>
                        <div className="analytics-card">
                            <BlockStack gap="300">
                                <ChartHeading title="Conversion rate over time" />
                                <InlineStack gap="200" blockAlign="baseline">
                                    <Text variant="headingLg" as="p" fontWeight="semibold">0%</Text>
                                    <Text variant="bodySm" as="span" tone="subdued">—</Text>
                                </InlineStack>
                                <SimpleLineChart height={180} />
                                <div className="chart-legend">
                                    <div className="legend-item">
                                        <div className="legend-dot" style={{ background: '#12acf0' }} />
                                        <Text variant="bodySm" as="span" tone="subdued">Dec 2, 2025</Text>
                                    </div>
                                    <div className="legend-item">
                                        <div className="legend-dot" style={{ background: '#c4c4c4' }} />
                                        <Text variant="bodySm" as="span" tone="subdued">Dec 1, 2025</Text>
                                    </div>
                                </div>
                            </BlockStack>
                        </div>
                        <div className="analytics-card">
                            <ConversionFunnel />
                        </div>
                    </div>

                    {/* Fourth Row - Device, Location, Social */}
                    <div className="analytics-row-3">
                        <div className="analytics-card">
                            <DeviceTypeChart />
                        </div>
                        <div className="analytics-card">
                            <SessionsByLocation />
                        </div>
                        <div className="analytics-card">
                            <TotalSalesBySocialReferrer />
                        </div>
                    </div>

                    {/* Fifth Row - Cohort & Landing Pages */}
                    <div className="analytics-row-2-1">
                        <div className="analytics-card">
                            <CohortTable />
                        </div>
                        <div className="analytics-card">
                            <SessionsByLandingPage />
                        </div>
                    </div>

                    {/* Sixth Row - Social Referrer Charts */}
                    <div className="analytics-row-3">
                        <div className="analytics-card">
                            <SessionsBySocialReferrer />
                        </div>
                        <div className="analytics-card">
                            <TotalSalesByReferrer />
                        </div>
                        <div className="analytics-card">
                            <SalesAttributedToMarketing />
                        </div>
                    </div>

                    {/* Seventh Row */}
                    <div className="analytics-row-3">
                        <div className="analytics-card">
                            <SessionsByReferrer />
                        </div>
                        <div className="analytics-card">
                            <NoDataPlaceholder title="Total sales by POS location" />
                        </div>
                        <div className="analytics-card">
                            <ProductsBySellThroughRate />
                        </div>
                    </div>

                    {/* Last Row */}
                    <div className="analytics-row-3">
                        <div className="analytics-card">
                            <NoDataPlaceholder title="POS staff sales total" />
                        </div>
                    </div>

                    {/* Footer */}
                    <div style={{ textAlign: 'right', paddingTop: '16px' }}>
                        <Text variant="bodySm" as="p" tone="subdued">
                            Learn more about <a href="#" style={{ color: '#005bd3', textDecoration: 'none' }}>analytics</a>
                        </Text>
                    </div>
                </div>
            </div>
        </>
    );
}

export default AnalyticsPage;
