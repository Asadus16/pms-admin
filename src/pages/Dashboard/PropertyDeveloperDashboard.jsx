'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { Button, InlineStack, Text, Icon, BlockStack, Select } from '@shopify/polaris'
import { EditIcon, DragHandleIcon, XIcon } from '@shopify/polaris-icons'

import ChartHeading from '../../components/Analytics/ChartHeading'
import CurrencySelector from '../../components/Analytics/modals/CurrencySelector'
import LineChart from '../../components/Analytics/charts/LineChart'
import SimpleLineChart from '../../components/Analytics/charts/SimpleLineChart'
import DonutChartWithHover from '../../components/Analytics/charts/DonutChartWithHover'
import StatCard from '../../components/Analytics/cards/StatCard'
import SalesBreakdown from '../../components/Analytics/cards/SalesBreakdown'
import ProductSalesList from '../../components/Analytics/cards/ProductSalesList'
import ConversionFunnel from '../../components/Analytics/cards/ConversionFunnel'
import DeviceTypeChart from '../../components/Analytics/cards/DeviceTypeChart'
import SessionsByLocation from '../../components/Analytics/cards/SessionsByLocation'
import TotalSalesBySocialReferrer from '../../components/Analytics/cards/TotalSalesBySocialReferrer'
import CohortTable from '../../components/Analytics/cards/CohortTable'
import SessionsByLandingPage from '../../components/Analytics/cards/SessionsByLandingPage'
import SessionsBySocialReferrer from '../../components/Analytics/cards/SessionsBySocialReferrer'
import TotalSalesByReferrer from '../../components/Analytics/cards/TotalSalesByReferrer'
import SalesAttributedToMarketing from '../../components/Analytics/cards/SalesAttributedToMarketing'
import SessionsByReferrer from '../../components/Analytics/cards/SessionsByReferrer'
import ProductsBySellThroughRate from '../../components/Analytics/cards/ProductsBySellThroughRate'
import NoDataPlaceholder from '../../components/Analytics/cards/NoDataPlaceholder'

import '../../pages/Analytics/analytics.css'
import './propertyDeveloperDashboard.css'

/**
 * Property Manager specific dashboard.
 * Safe place to customize the dashboard for `/property-manager` without affecting other user types.
 */
export default function PropertyDeveloperDashboard() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [currencyPopoverActive, setCurrencyPopoverActive] = useState(false)
  const [selectedCurrency, setSelectedCurrency] = useState('AED')
  const [selectedCurrencySymbol, setSelectedCurrencySymbol] = useState('AED')
  
  // Chart dropdown states
  const [leadsTimeframe, setLeadsTimeframe] = useState('daily')
  const [dealValueType, setDealValueType] = useState('selling_price')
  const [engagementType, setEngagementType] = useState('calls')
  const [conversionStage, setConversionStage] = useState('inquiry_qualified')
  
  // Hover states for charts
  const [hoveredSource, setHoveredSource] = useState(null)
  const [hoveredPropertyIndex, setHoveredPropertyIndex] = useState(null)

  const dragFromIdRef = useRef(null)

  const isEditing = searchParams?.get('edit') === '1'

  const widgets = useMemo(
    () => [
      { id: 'stat-total-sales-volume', span: 3, render: () => <StatCard title="Total Sales Volume (AED / PKR)" value="AED 6,093" change="59%" changeType="positive" sparklineData={[1, 3, 1, 2, 5, 2, 1, 4, 6, 3, 2, 8, 4, 2]} /> },
      { id: 'stat-conversion-rate', span: 3, render: () => <StatCard title="Conversion Rate (Lead → Won)" value="40%" change="40%" changeType="critical" sparklineData={[1, 2, 1, 1, 4, 2, 1, 3, 5, 2, 1, 6, 3, 2]} sparklineData2={[1, 1, 2, 1, 2, 3, 1, 2, 3, 1, 2, 4, 2, 1]} dualLine /> },
      { id: 'stat-contracts-executed', span: 3, render: () => <StatCard title="Contracts Executed" value="7" change="61%" changeType="critical" sparklineData={[0, 0, 0, 0, 0, 1, 2, 1, 0, 0, 0, 1, 0, 0]} /> },
      { id: 'stat-total-leads', span: 3, render: () => <StatCard title="Total Leads Created" value="5" change="67%" changeType="positive" sparklineData={[1, 2, 1, 4, 2, 1, 5, 3, 1, 6, 2, 4, 7, 3]} /> },

      {
        id: 'leads-revenue-over-time',
        span: 8,
        render: () => {
          // Different data for each timeframe
          const chartData = {
            daily: { value: '143', change: '23%', data: [20, 35, 28, 42, 38, 55, 48, 62, 58, 75, 82, 95, 88, 103, 98, 118, 125, 135, 143] },
            weekly: { value: '892', change: '18%', data: [120, 185, 220, 265, 310, 368, 425, 478, 532, 598, 655, 718, 782, 845, 892] },
            monthly: { value: '3,245', change: '15%', data: [850, 1120, 1450, 1680, 1920, 2180, 2450, 2680, 2890, 3050, 3245] },
          };
          const current = chartData[leadsTimeframe];
          
          return (
          <div className="analytics-card" style={{ padding: '20px 24px' }}>
            <BlockStack gap="200">
              <InlineStack align="space-between" blockAlign="center">
                <ChartHeading title="Leads Created Over Time" />
                <div style={{ minWidth: '100px', fontSize: '12px' }} className="compact-select">
                  <Select
                    label=""
                    labelHidden
                    options={[
                      { label: 'Daily', value: 'daily' },
                      { label: 'Weekly', value: 'weekly' },
                      { label: 'Monthly', value: 'monthly' },
                    ]}
                    value={leadsTimeframe}
                    onChange={setLeadsTimeframe}
                  />
                </div>
              </InlineStack>
              <InlineStack gap="200" blockAlign="baseline">
                  <Text variant="headingLg" as="p" fontWeight="semibold">{current.value}</Text>
                  <span style={{ color: '#369962', fontSize: '13px' }}>↗ {current.change}</span>
              </InlineStack>
                <LineChart height={280} data={current.data} yAxisLabels={['4K', '3K', '2K', '1K', '0']} />
            </BlockStack>
          </div>
          );
        },
      },
      { id: 'revenue-breakdown', span: 4, render: () => <div className="analytics-card" style={{ padding: '20px 24px' }}><SalesBreakdown /></div> },
      {
        id: 'leads-by-source',
        span: 4,
        render: () => {
          const sources = [
            { label: 'Website', count: 70, change: '12%', color: '#1e40af', percentage: 30 },
            { label: 'WhatsApp', count: 58, change: '8%', color: '#3b82f6', percentage: 25 },
            { label: 'Walk-in', count: 35, color: '#60a5fa', percentage: 15 },
            { label: 'Referral', count: 35, color: '#2563eb', percentage: 15 },
            { label: 'Partner Agent', count: 23, color: '#93c5fd', percentage: 10 },
            { label: 'Property Portal', count: 12, color: '#bfdbfe', percentage: 5 },
          ];
          
          const size = 180;
          const radius = (size - 40) / 2;
          const strokeWidth = 24;
          const circumference = 2 * Math.PI * radius;
          let currentOffset = circumference * 0.25;

          return (
          <div className="analytics-card">
              <BlockStack gap="300">
                <ChartHeading title="Leads by Source (%)" />
                <InlineStack gap="500" blockAlign="center">
                  <div style={{ position: 'relative', width: size, height: size }}>
                    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
                      <circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        fill="none"
                        stroke="#e8e8e8"
                        strokeWidth={strokeWidth}
                      />
                      {sources.filter(s => s.percentage > 0).map((source, index) => {
                        const segmentLength = (source.percentage / 100) * circumference;
                        const offset = currentOffset;
                        currentOffset += segmentLength;
                        const isHovered = hoveredSource?.label === source.label;
                        const opacity = hoveredSource ? (isHovered ? 1 : 0.3) : 1;

                        return (
                          <circle
                            key={index}
                            cx={size / 2}
                            cy={size / 2}
                            r={radius}
                            fill="none"
                            stroke={source.color}
                            strokeWidth={strokeWidth}
                            strokeDasharray={`${segmentLength} ${circumference}`}
                            strokeDashoffset={-offset + circumference * 0.25}
                            strokeLinecap="butt"
                            style={{ opacity, transition: 'opacity 0.2s ease', cursor: 'pointer' }}
                            onMouseEnter={() => setHoveredSource(source)}
                            onMouseLeave={() => setHoveredSource(null)}
                          />
                        );
                      })}
                    </svg>
                    <div style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      textAlign: 'center'
                    }}>
                      <Text variant="headingXl" as="p" fontWeight="bold">233</Text>
                      <Text variant="bodySm" as="p" tone="success">↗ 18%</Text>
                    </div>
                  </div>
                  <BlockStack gap="300">
                    {sources.map((source, index) => (
                      <InlineStack
                        key={index}
                        gap="200"
                        blockAlign="center"
                        style={{
                          opacity: hoveredSource && hoveredSource.label !== source.label ? 0.4 : 1,
                          transition: 'opacity 0.2s ease',
                          cursor: 'pointer'
                        }}
                        onMouseEnter={() => setHoveredSource(source)}
                        onMouseLeave={() => setHoveredSource(null)}
                      >
                        <div style={{ width: 12, height: 12, background: source.color, borderRadius: 2 }} />
                        <Text variant="bodySm" as="span" style={{ minWidth: '80px' }}>{source.label}</Text>
                        <Text variant="bodySm" as="span" fontWeight="medium" style={{ minWidth: '30px' }}>{source.count}</Text>
                        {source.change && (
                          <Text variant="bodySm" as="span" tone="success">↗ {source.change}</Text>
                        )}
                      </InlineStack>
                    ))}
                  </BlockStack>
              </InlineStack>
              </BlockStack>
            </div>
          );
        },
      },
      {
        id: 'average-deal-value',
        span: 4,
        render: () => {
          // Different data for each deal type
          const chartData = {
            selling_price: { value: 'AED 1,850,000', change: '12%', data: [1500000, 1550000, 1600000, 1620000, 1680000, 1720000, 1750000, 1780000, 1820000, 1850000] },
            long_term_rent: { value: 'AED 45,000', change: '8%', data: [38000, 39000, 40000, 41000, 41500, 42000, 43000, 43500, 44000, 45000] },
            nightly_rate: { value: 'AED 8,500', change: '15%', data: [6800, 7000, 7200, 7400, 7600, 7800, 8000, 8200, 8300, 8500] },
          };
          const current = chartData[dealValueType];
          
          return (
            <div className="analytics-card" style={{ padding: '20px 24px' }}>
              <BlockStack gap="200">
                <InlineStack align="space-between" blockAlign="center">
                  <ChartHeading title="Average Deal Value" />
                  <div style={{ minWidth: '120px', fontSize: '12px' }} className="compact-select">
                    <Select
                      label=""
                      labelHidden
                      options={[
                        { label: 'Selling Price', value: 'selling_price' },
                        { label: 'Long-term Rent', value: 'long_term_rent' },
                        { label: 'Nightly Rate', value: 'nightly_rate' },
                      ]}
                      value={dealValueType}
                      onChange={setDealValueType}
                    />
                  </div>
                </InlineStack>
              <InlineStack gap="200" blockAlign="baseline">
                  <Text variant="headingLg" as="p" fontWeight="semibold">{current.value}</Text>
                  <Text variant="bodySm" as="span" tone="success">↗ {current.change}</Text>
              </InlineStack>
                <LineChart height={180} data={current.data} yAxisLabels={['AED 2M', 'AED 1.5M', 'AED 1M', 'AED 500K', 'AED 0']} />
              </BlockStack>
            </div>
          );
        },
      },
      {
        id: 'lead-engagement-over-time',
        span: 4,
        render: () => {
          // Different data for each engagement type
          const chartData = {
            calls: { value: '213', change: '20%', data: [120, 135, 145, 152, 165, 178, 185, 195, 205, 213] },
            whatsapp: { value: '487', change: '35%', data: [280, 310, 340, 365, 395, 420, 445, 460, 475, 487] },
            viewings: { value: '156', change: '18%', data: [95, 105, 115, 122, 130, 138, 145, 150, 154, 156] },
          };
          const current = chartData[engagementType];
          
          return (
            <div className="analytics-card" style={{ padding: '20px 24px' }}>
              <BlockStack gap="200">
                <InlineStack align="space-between" blockAlign="center" wrap={false}>
                  <div className="compact-chart-heading" style={{ flex: '1', minWidth: 0 }}>
                    <ChartHeading title="Lead Engagement Over Time" variant="headingSm" />
                  </div>
                  <div style={{ minWidth: '115px', flexShrink: 0 }} className="compact-select">
                    <Select
                      label=""
                      labelHidden
                      options={[
                        { label: 'Calls', value: 'calls' },
                        { label: 'WhatsApp Msgs', value: 'whatsapp' },
                        { label: 'Viewings', value: 'viewings' },
                      ]}
                      value={engagementType}
                      onChange={setEngagementType}
                    />
                  </div>
                </InlineStack>
              <InlineStack gap="200" blockAlign="baseline">
                  <Text variant="headingLg" as="p" fontWeight="semibold">{current.value}</Text>
                  <Text variant="bodySm" as="span" tone="success">↑ {current.change}</Text>
              </InlineStack>
                <LineChart height={180} data={current.data} yAxisLabels={['600', '450', '300', '150', '0']} />
              </BlockStack>
            </div>
          );
        },
      },
      {
        id: 'lead-conversion-over-time',
        span: 4,
        render: () => {
          return (
            <div className="analytics-card" style={{ padding: '20px 24px' }}>
              <BlockStack gap="200">
                <ChartHeading title="Lead Conversion % Over Time" />
              <InlineStack gap="200" blockAlign="baseline">
                  <Text variant="headingLg" as="p" fontWeight="semibold">75%</Text>
                  <Text variant="bodySm" as="span" tone="success">↗ 8%</Text>
              </InlineStack>
                <LineChart height={180} data={[65, 67, 68, 70, 71, 72, 73, 73.5, 74, 75]} yAxisLabels={['100', '80', '60', '40', '20', '0']} />
              </BlockStack>
            </div>
          );
        },
      },
      { id: 'lead-funnel', span: 8, render: () => <div className="analytics-card"><ConversionFunnel /></div> },

      { id: 'occupancy-rate', span: 4, render: () => <div className="analytics-card"><DeviceTypeChart /></div> },
      { id: 'leads-by-location', span: 4, render: () => <div className="analytics-card"><SessionsByLocation /></div> },
      { id: 'leads-by-referral', span: 4, render: () => <div className="analytics-card"><TotalSalesBySocialReferrer /></div> },

      { id: 'lead-cohort', span: 8, render: () => <div className="analytics-card"><CohortTable /></div> },
      { id: 'top-properties', span: 4, render: () => <div className="analytics-card"><SessionsByLandingPage /></div> },

      { id: 'leads-by-referral-type', span: 4, render: () => <div className="analytics-card"><SessionsBySocialReferrer /></div> },
      { id: 'deals-by-agent', span: 4, render: () => <div className="analytics-card"><TotalSalesByReferrer /></div> },
      { id: 'conversions-by-source', span: 4, render: () => <div className="analytics-card"><SalesAttributedToMarketing /></div> },

      { 
        id: 'revenue-by-property', 
        span: 4, 
        render: () => {
          const properties = [
            { label: 'Project A', value: 'AED 1.2M', compare: 'AED 980K', change: '22%', barWidth: 100 },
            { label: 'Project B', value: 'AED 950K', compare: 'AED 800K', change: '19%', barWidth: 79 },
            { label: 'DHA Villas', value: 'AED 780K', compare: 'AED 650K', change: '20%', barWidth: 65 },
            { label: 'Bahria Apartments', value: 'AED 520K', compare: 'AED 450K', change: '16%', barWidth: 43 },
          ];
          
          return (
            <div className="analytics-card">
              <BlockStack gap="300">
                <ChartHeading title="Revenue by Property / Project" />
                <div style={{ maxHeight: '320px', overflowY: 'auto', paddingRight: '4px' }}>
                <BlockStack gap="300">
                  {properties.map((property, index) => (
                    <div
                      key={index}
                      onMouseEnter={() => setHoveredPropertyIndex(index)}
                      onMouseLeave={() => setHoveredPropertyIndex(null)}
                      style={{
                        opacity: hoveredPropertyIndex !== null && hoveredPropertyIndex !== index ? 0.4 : 1,
                        transition: 'opacity 0.2s ease'
                      }}
                    >
                      <BlockStack gap="100">
                        <Text variant="bodySm" as="p">{property.label}</Text>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div style={{
                            width: `${property.barWidth}%`,
                            height: '48px',
                            background: '#12acf0',
                            borderRadius: '3px',
                          }} />
                          <Text variant="bodySm" as="span" fontWeight="medium">{property.value}</Text>
                          <Text variant="bodySm" as="span" tone="success">↗ {property.change}</Text>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div style={{
                            width: `${property.barWidth * 0.82}%`,
                            height: '48px',
                            background: '#9bcdea',
                            borderRadius: '3px',
                          }} />
                          <Text variant="bodySm" as="span" tone="subdued">{property.compare}</Text>
                        </div>
                      </BlockStack>
                    </div>
                  ))}
                  <div style={{ display: 'flex', alignItems: 'flex-end', height: '20px', marginTop: '8px' }}>
                    <div style={{ width: '2px', height: '100%', background: '#12acf0', marginRight: '8px' }} />
                    <Text variant="bodySm" as="span" tone="subdued">₹0</Text>
                  </div>
                </BlockStack>
                </div>
              </BlockStack>
            </div>
          );
        }
      },
      { id: 'units-performance', span: 4, render: () => <div className="analytics-card"><ProductsBySellThroughRate /></div> },
    ],
    [leadsTimeframe, dealValueType, engagementType, conversionStage, hoveredSource, hoveredPropertyIndex]
  )

  const storageKey = 'propertyDeveloperDashboardLayout_v1'

  const defaultLayout = useMemo(() => widgets.map((w) => w.id), [widgets])
  const [layout, setLayout] = useState(defaultLayout)
  const [draftLayout, setDraftLayout] = useState(defaultLayout)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey)
      if (!raw) return
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed) && parsed.every((id) => typeof id === 'string')) {
        // Filter out widgets that no longer exist (e.g. removed charts)
        const valid = parsed.filter((id) => widgets.some((w) => w.id === id))
        setLayout(valid)
        setDraftLayout(valid)
      }
    } catch {
      // ignore
    }
  }, [widgets])

  useEffect(() => {
    if (!isEditing) {
      setDraftLayout(layout)
    }
  }, [isEditing, layout])

  const orderedWidgets = useMemo(() => {
    const byId = new Map(widgets.map((w) => [w.id, w]))
    const ids = isEditing ? draftLayout : layout
    return ids.map((id) => byId.get(id)).filter(Boolean)
  }, [widgets, layout, draftLayout, isEditing])


  const toggleCurrencyPopover = useCallback(
    () => setCurrencyPopoverActive((active) => !active),
    []
  )

  const handleCurrencyChange = useCallback((currency) => {
    setSelectedCurrency(currency.code)
    setSelectedCurrencySymbol(currency.symbol)
  }, [])

  const setEditQuery = useCallback(
    (nextEditing) => {
      const params = new URLSearchParams(searchParams?.toString() || '')
      if (nextEditing) params.set('edit', '1')
      else params.delete('edit')
      const qs = params.toString()
      router.push(qs ? `${pathname}?${qs}` : pathname)
    },
    [router, pathname, searchParams]
  )

  const onEdit = useCallback(() => setEditQuery(true), [setEditQuery])
  const onCancel = useCallback(() => {
    setDraftLayout(layout)
    setEditQuery(false)
  }, [layout, setEditQuery])

  const onSave = useCallback(() => {
    setLayout(draftLayout)
    try {
      localStorage.setItem(storageKey, JSON.stringify(draftLayout))
    } catch {
      // ignore
    }
    setEditQuery(false)
  }, [draftLayout, setEditQuery])

  const move = useCallback((arr, from, to) => {
    const copy = [...arr]
    const [item] = copy.splice(from, 1)
    copy.splice(to, 0, item)
    return copy
  }, [])

  const handleDragStart = useCallback((id) => {
    dragFromIdRef.current = id
  }, [])

  const handleDropOn = useCallback(
    (targetId) => {
      const fromId = dragFromIdRef.current
      dragFromIdRef.current = null
      if (!fromId || fromId === targetId) return
      setDraftLayout((current) => {
        const fromIdx = current.indexOf(fromId)
        const toIdx = current.indexOf(targetId)
        if (fromIdx === -1 || toIdx === -1) return current
        return move(current, fromIdx, toIdx)
      })
    },
    [move]
  )

  const hasUnsavedChanges = isEditing && draftLayout.join('|') !== layout.join('|')

  const handleRemoveWidget = useCallback((id) => {
    setDraftLayout((current) => current.filter((x) => x !== id))
  }, [])

  // Listen for header Save/Discard (same pattern used by other pages like developers/new)
  useEffect(() => {
    const handleSaveEvent = () => onSave()
    const handleDiscardEvent = () => onCancel()

    window.addEventListener('pdDashboardSave', handleSaveEvent)
    window.addEventListener('pdDashboardDiscard', handleDiscardEvent)

    return () => {
      window.removeEventListener('pdDashboardSave', handleSaveEvent)
      window.removeEventListener('pdDashboardDiscard', handleDiscardEvent)
    }
  }, [onSave, onCancel])

  return (
    <div className="analytics-page">
      {/* Header */}
      <div className="analytics-header">
        <div className="analytics-title">
          <Text variant="headingLg" as="h1">Dashboard</Text>
          <Text variant="bodySm" as="span" tone="subdued">Last refreshed: 5:00 PM</Text>
        </div>
        <InlineStack gap="200">
          <div className="analytics-header-actions">
            <InlineStack gap="200">
              {/* Property-developer: remove Expand (maximize). Keep Edit. */}
              <Button
                icon={EditIcon}
                accessibilityLabel="Edit dashboard"
                onClick={onEdit}
                disabled={isEditing}
              />
            </InlineStack>
          </div>
        </InlineStack>
      </div>

      {/* Filters: property-manager removes Today/date buttons, keeps currency */}
      <div className="analytics-filters">
        <div style={{ position: 'relative' }}>
          <Button onClick={toggleCurrencyPopover}>
            $≡ {selectedCurrency}
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
                  zIndex: 999,
                }}
                onClick={() => setCurrencyPopoverActive(false)}
              />
              <div
                style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  marginTop: '4px',
                  background: 'white',
                  borderRadius: '12px',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                  zIndex: 1000,
                  width: '320px',
                  overflow: 'hidden',
                }}
              >
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

      {/* Dashboard grid */}
      <div className={`pd-grid ${isEditing ? 'is-editing' : ''}`}>
        {orderedWidgets.map((w) => {
          const span = typeof w.span === 'number' ? w.span : 4
          return (
            <div
              key={w.id}
              className={`pd-widget span-${span}`}
              draggable={isEditing}
              onDragStart={() => handleDragStart(w.id)}
              onDragOver={(e) => {
                if (!isEditing) return
                e.preventDefault()
              }}
              onDrop={() => handleDropOn(w.id)}
            >
              {isEditing && (
                <>
                  <div className="pd-drag-handle" title="Drag to reorder">
                    <Icon source={DragHandleIcon} tone="subdued" />
                  </div>
                  <div className="pd-remove-btn">
                    <Button
                      icon={XIcon}
                      accessibilityLabel="Remove chart"
                      onClick={() => handleRemoveWidget(w.id)}
                      size="micro"
                      variant="tertiary"
                    />
                  </div>
                </>
              )}
              {w.render()}
            </div>
          )
        })}
      </div>
    </div>
  )
}


