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
    SearchIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    ChevronDownIcon,
    ClockIcon,
} from '@shopify/polaris-icons';

// ============================================
// CHART TOOLTIP DATA
// ============================================

const chartTooltipData = {
    'Gross sales': {
        title: 'Gross sales over time',
        description: 'Rough sales revenue, before discounts and returns are factored in over time',
        formula: null
    },
    'Returning customer rate': {
        title: 'Returning customer rate over time',
        description: 'Percentage of customers who placed an order that were returning customers',
        formula: { left: 'Returning customer rate', right: 'returning customers / customers' }
    },
    'Orders fulfilled': {
        title: 'Orders fulfilled over time',
        description: 'Total orders that have been marked as fulfilled',
        formula: null
    },
    'Orders': {
        title: 'Orders over time',
        description: 'Number of orders across all sales channels',
        formula: null
    },
    'Total sales over time': {
        title: 'Total sales over time',
        description: 'Amount spent (subtotal, taxes, shipping, returns, discounts, fees, etc.)',
        formula: { left: 'Total sales', right: 'net sales + additional fees + duties + shipping charges + taxes' }
    },
    'Total sales breakdown': {
        title: 'Total sales breakdown',
        description: 'Breakdown of amount spent (subtotal, taxes, shipping, returns, discounts, fees, etc.)',
        formula: { left: 'Total sales', right: 'net sales + additional fees + duties + shipping charges + taxes' }
    },
    'Total sales by sales channel': {
        title: 'Total sales by sales channel',
        description: 'Total sales, broken down by sales channel',
        formula: { left: 'Total sales', right: 'net sales + additional fees + duties + shipping charges + taxes' }
    },
    'Average order value over time': {
        title: 'Average order value over time',
        description: 'Average order value, factoring in discounts',
        formula: { left: 'Average order value', right: '(gross sales - discounts) / orders' }
    },
    'Total sales by product': {
        title: 'Total sales by product',
        description: 'Total sales, broken down by product',
        formula: { left: 'Total sales', right: 'net sales + additional fees + duties + shipping charges + taxes' }
    },
    'Sessions over time': {
        title: 'Sessions over time',
        description: 'Number of user sessions in your online store',
        formula: null
    },
    'Conversion rate over time': {
        title: 'Conversion rate over time',
        description: 'Percentage of online store sessions that result in a sale',
        formula: { left: 'Conversion rate', right: 'sessions that completed checkout / sessions' }
    },
    'Conversion rate breakdown': {
        title: 'Conversion rate breakdown',
        description: 'Breakdown of percentage of online store sessions that result in a sale',
        formula: { left: 'Conversion rate', right: 'sessions that completed checkout / sessions' }
    },
    'Sessions by device type': {
        title: 'Sessions by device type',
        description: 'Sessions in your online store, broken down by the user\'s device type',
        formula: null
    },
    'Sessions by location': {
        title: 'Sessions by location',
        description: 'Sessions in your online store, broken down by geographic location',
        formula: null
    },
    'Total sales by social referrer': {
        title: 'Total sales by social referrer',
        description: 'Total sales from social sources, broken down by name',
        formula: { left: 'Total sales', right: 'net sales + additional fees + duties + shipping charges + taxes' }
    },
    'Customer cohort analysis': {
        title: 'Customer cohort analysis',
        description: 'Returning purchase rates, with customers grouped by month of first purchase',
        formula: null
    },
    'Sessions by landing page': {
        title: 'Sessions by landing page',
        description: 'Sessions in your online store, broken down by the page the user first landed on',
        formula: null
    },
    'Sessions by social referrer': {
        title: 'Sessions by social referrer',
        description: 'Sessions in your online store from social sources, broken down by name',
        formula: null
    },
    'Total sales by referrer': {
        title: 'Total sales by referrer',
        description: 'Total sales, broken down by the name of the site that led to the order',
        formula: { left: 'Total sales', right: 'net sales + additional fees + duties + shipping charges + taxes' }
    },
    'Sales attributed to marketing': {
        title: 'Sales attributed to marketing',
        description: 'Sales from trackable marketing efforts',
        formula: { left: 'Total sales', right: 'net sales + additional fees + duties + shipping charges + taxes' }
    },
    'Sessions by referrer': {
        title: 'Sessions by referrer',
        description: 'Sessions in your online store, broken down by the name of the site that led to the session',
        formula: null
    },
    'Total sales by POS location': {
        title: 'Total sales by POS location',
        description: 'Total sales, broken down by physical store location',
        formula: { left: 'Total sales', right: 'net sales + additional fees + duties + shipping charges + taxes' }
    },
    'Products by sell-through rate': {
        title: 'Products by sell-through rate',
        description: 'Products, broken down by sell-through rate (how quickly they\'re sold)',
        formula: { left: 'Sell-through rate', right: 'inventory units sold / (inventory units sold + ending inventory units)' }
    },
    'POS staff sales total': {
        title: 'POS staff sales total',
        description: 'Number of sales made by the staff member of your retail location',
        formula: { left: 'Total sales', right: 'net sales + additional fees + duties + shipping charges + taxes' }
    },
};

// ============================================
// CHART HEADING WITH TOOLTIP COMPONENT
// ============================================

const ChartHeading = ({ title, variant = 'headingMd' }) => {
    const [showTooltip, setShowTooltip] = useState(false);
    const tooltipData = chartTooltipData[title];

    const renderFormula = (formula) => {
        if (!formula) return null;

        // Split the right side by operators
        const operators = ['+', '-', '*', '/', '(', ')'];
        const parts = formula.right.split(/(\+|\-|\*|\/|\(|\))/g).filter(p => p.trim());

        return (
            <div style={{ marginTop: '8px', fontFamily: 'monospace', fontSize: '13px' }}>
                <span style={{ color: '#0066cc' }}>{formula.left}</span>
                <span style={{ color: '#0066cc' }}> = </span>
                {parts.map((part, idx) => {
                    const trimmed = part.trim();
                    if (operators.includes(trimmed)) {
                        return <span key={idx} style={{ color: '#0066cc' }}> {trimmed} </span>;
                    }
                    return <span key={idx} style={{ color: '#1a7f4b' }}>{trimmed}</span>;
                })}
            </div>
        );
    };

    return (
        <div
            style={{ position: 'relative', display: 'inline-block' }}
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
        >
            <Text variant={variant} as="h3" fontWeight="semibold">
                <span style={{
                    borderBottom: '1.5px dotted #6d7175',
                    paddingBottom: '2px',
                    cursor: 'help'
                }}>
                    {title}
                </span>
            </Text>

            {showTooltip && tooltipData && (
                <div style={{
                    position: 'absolute',
                    top: '100%',
                    left: '0',
                    marginTop: '8px',
                    background: 'white',
                    borderRadius: '12px',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
                    padding: '16px 20px',
                    zIndex: 1000,
                    minWidth: '320px',
                    maxWidth: '400px',
                }}>
                    <Text variant="headingSm" as="p" fontWeight="bold">{tooltipData.title}</Text>
                    <Text variant="bodySm" as="p" tone="subdued" style={{ marginTop: '8px' }}>
                        {tooltipData.description}
                    </Text>
                    {tooltipData.formula && renderFormula(tooltipData.formula)}
                </div>
            )}
        </div>
    );
};

// ============================================
// DATE PICKER MODAL COMPONENT
// ============================================

const DatePickerModal = ({ open, onClose, onApply, selectedRange, onRangeChange }) => {
    const [selectedPreset, setSelectedPreset] = useState('today');
    const [activeTab, setActiveTab] = useState(0);
    const [startDate, setStartDate] = useState('December 2, 2025');
    const [endDate, setEndDate] = useState('December 2, 2025');
    const [currentMonth, setCurrentMonth] = useState(11);
    const [currentYear, setCurrentYear] = useState(2025);

    const presets = [
        { id: 'bfcm2025', label: 'BFCM 2025', badge: 'New' },
        { id: 'today', label: 'Today' },
        { id: 'yesterday', label: 'Yesterday' },
        { id: 'last30min', label: 'Last 30 minutes' },
        { id: 'last12hours', label: 'Last 12 hours' },
        { id: 'last7days', label: 'Last 7 days' },
        { id: 'last30days', label: 'Last 30 days' },
        { id: 'last90days', label: 'Last 90 days' },
        { id: 'last365days', label: 'Last 365 days' },
        { id: 'last12months', label: 'Last 12 months' },
    ];

    const getDaysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();
    const getFirstDayOfMonth = (month, year) => new Date(year, month, 1).getDay();

    const renderCalendar = (month, year) => {
        const daysInMonth = getDaysInMonth(month, year);
        const firstDay = getFirstDayOfMonth(month, year);
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'];
        const dayNames = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

        const days = [];
        for (let i = 0; i < firstDay; i++) {
            days.push(<div key={`empty-${i}`} className="calendar-day empty" />);
        }
        for (let day = 1; day <= daysInMonth; day++) {
            const isToday = day === 2 && month === 11 && year === 2025;
            const isFuture = (month === 11 && day > 2) || month > 11;
            days.push(
                <div
                    key={day}
                    className={`calendar-day ${isToday ? 'selected' : ''} ${isFuture ? 'disabled' : ''}`}
                    onClick={() => !isFuture && console.log(`Selected: ${monthNames[month]} ${day}, ${year}`)}
                >
                    {day}
                </div>
            );
        }

        return (
            <div className="calendar-month">
                <div className="calendar-header">
                    <Text variant="headingSm" as="h4">{monthNames[month]} {year}</Text>
                </div>
                <div className="calendar-weekdays">
                    {dayNames.map(day => (
                        <div key={day} className="calendar-weekday">{day}</div>
                    ))}
                </div>
                <div className="calendar-days">
                    {days}
                </div>
            </div>
        );
    };

    const prevMonth = () => {
        if (currentMonth === 0) {
            setCurrentMonth(11);
            setCurrentYear(currentYear - 1);
        } else {
            setCurrentMonth(currentMonth - 1);
        }
    };

    const nextMonth = () => {
        if (currentMonth === 11) {
            setCurrentMonth(0);
            setCurrentYear(currentYear + 1);
        } else {
            setCurrentMonth(currentMonth + 1);
        }
    };

    const prevMonthIndex = currentMonth === 0 ? 11 : currentMonth - 1;
    const prevMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;

    return (
        <>
            {open && (
                <>
                    <div
                        style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: 'rgba(0, 0, 0, 0.5)',
                            zIndex: 1000,
                        }}
                        onClick={onClose}
                    />

                    <div style={{
                        position: 'fixed',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        background: 'white',
                        borderRadius: '16px',
                        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.2)',
                        zIndex: 1001,
                        maxWidth: '900px',
                        width: '90%',
                        maxHeight: '90vh',
                        overflow: 'hidden',
                    }}>
                        <style>{`
              .date-picker-modal {
                display: flex;
                min-height: 480px;
              }
              .date-picker-sidebar {
                width: 200px;
                border-right: 1px solid #e1e3e5;
                padding: 16px 0;
                overflow-y: auto;
              }
              .date-picker-preset {
                padding: 10px 16px;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: space-between;
                transition: background 0.15s;
              }
              .date-picker-preset:hover {
                background: #f6f6f7;
              }
              .date-picker-preset.selected {
                background: #f6f6f7;
              }
              .date-picker-preset .check-icon {
                color: #303030;
              }
              .date-picker-main {
                flex: 1;
                padding: 16px 24px;
              }
              .date-picker-tabs {
                display: flex;
                gap: 0;
                margin-bottom: 20px;
                border-bottom: 1px solid #e1e3e5;
              }
              .date-picker-tab {
                padding: 8px 16px;
                cursor: pointer;
                border: none;
                background: none;
                font-size: 14px;
                color: #6d7175;
                border-bottom: 2px solid transparent;
                margin-bottom: -1px;
              }
              .date-picker-tab.active {
                color: #303030;
                border-bottom-color: #303030;
              }
              .date-inputs {
                display: flex;
                align-items: center;
                gap: 12px;
                margin-bottom: 20px;
              }
              .date-input {
                flex: 1;
                padding: 10px 12px;
                border: 1px solid #c9cccf;
                border-radius: 8px;
                font-size: 14px;
              }
              .date-input:focus {
                outline: none;
                border-color: #005bd3;
                box-shadow: 0 0 0 1px #005bd3;
              }
              .date-arrow {
                color: #6d7175;
              }
              .time-button {
                padding: 10px;
                border: 1px solid #c9cccf;
                border-radius: 8px;
                background: white;
                cursor: pointer;
              }
              .time-button:hover {
                background: #f6f6f7;
              }
              .calendars-container {
                display: flex;
                gap: 32px;
              }
              .calendar-nav {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 16px;
              }
              .calendar-nav-btn {
                padding: 4px;
                border: none;
                background: none;
                cursor: pointer;
                border-radius: 4px;
                color: #6d7175;
              }
              .calendar-nav-btn:hover {
                background: #f6f6f7;
              }
              .calendar-month {
                width: 280px;
              }
              .calendar-header {
                text-align: center;
                margin-bottom: 12px;
              }
              .calendar-weekdays {
                display: grid;
                grid-template-columns: repeat(7, 1fr);
                gap: 4px;
                margin-bottom: 8px;
              }
              .calendar-weekday {
                text-align: center;
                font-size: 12px;
                color: #6d7175;
                padding: 4px;
                font-weight: 500;
              }
              .calendar-days {
                display: grid;
                grid-template-columns: repeat(7, 1fr);
                gap: 4px;
              }
              .calendar-day {
                text-align: center;
                padding: 8px;
                font-size: 13px;
                cursor: pointer;
                border-radius: 8px;
                transition: background 0.15s;
              }
              .calendar-day:hover:not(.empty):not(.disabled) {
                background: #f6f6f7;
              }
              .calendar-day.selected {
                background: #303030;
                color: white;
              }
              .calendar-day.disabled {
                color: #c9cccf;
                cursor: default;
              }
              .calendar-day.empty {
                cursor: default;
              }
              .modal-footer {
                display: flex;
                justify-content: flex-end;
                gap: 8px;
                padding: 16px 24px;
                border-top: 1px solid #e1e3e5;
              }
            `}</style>

                        <div className="date-picker-modal">
                            <div className="date-picker-sidebar">
                                {presets.map(preset => (
                                    <div
                                        key={preset.id}
                                        className={`date-picker-preset ${selectedPreset === preset.id ? 'selected' : ''}`}
                                        onClick={() => setSelectedPreset(preset.id)}
                                    >
                                        <InlineStack gap="200" blockAlign="center">
                                            <Text variant="bodyMd" as="span">{preset.label}</Text>
                                            {preset.badge && (
                                                <Badge tone="info">{preset.badge}</Badge>
                                            )}
                                        </InlineStack>
                                        {selectedPreset === preset.id && (
                                            <span className="check-icon">✓</span>
                                        )}
                                    </div>
                                ))}
                            </div>

                            <div className="date-picker-main">
                                <div className="date-picker-tabs">
                                    <button
                                        className={`date-picker-tab ${activeTab === 0 ? 'active' : ''}`}
                                        onClick={() => setActiveTab(0)}
                                    >
                                        Fixed
                                    </button>
                                    <button
                                        className={`date-picker-tab ${activeTab === 1 ? 'active' : ''}`}
                                        onClick={() => setActiveTab(1)}
                                    >
                                        Rolling
                                    </button>
                                </div>

                                <div className="date-inputs">
                                    <input
                                        type="text"
                                        className="date-input"
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                    />
                                    <span className="date-arrow">→</span>
                                    <input
                                        type="text"
                                        className="date-input"
                                        value={endDate}
                                        onChange={(e) => setEndDate(e.target.value)}
                                    />
                                    <button className="time-button">
                                        <Icon source={ClockIcon} />
                                    </button>
                                </div>

                                <div className="calendar-nav">
                                    <button className="calendar-nav-btn" onClick={prevMonth}>
                                        <Icon source={ChevronLeftIcon} />
                                    </button>
                                    <div style={{ flex: 1 }} />
                                    <button className="calendar-nav-btn" onClick={nextMonth}>
                                        <Icon source={ChevronRightIcon} />
                                    </button>
                                </div>

                                <div className="calendars-container">
                                    {renderCalendar(prevMonthIndex, prevMonthYear)}
                                    {renderCalendar(currentMonth, currentYear)}
                                </div>
                            </div>
                        </div>

                        <div className="modal-footer">
                            <Button onClick={onClose}>Cancel</Button>
                            <Button variant="primary" onClick={() => { onApply && onApply(); onClose(); }}>Apply</Button>
                        </div>
                    </div>
                </>
            )}
        </>
    );
};

// ============================================
// COMPARISON DATE PICKER MODAL COMPONENT
// ============================================

const ComparisonDatePickerModal = ({ open, onClose, onApply }) => {
    const [selectedPreset, setSelectedPreset] = useState('yesterday');
    const [startDate, setStartDate] = useState('December 1, 2025');
    const [endDate, setEndDate] = useState('December 1, 2025');
    const [currentMonth, setCurrentMonth] = useState(11);
    const [currentYear, setCurrentYear] = useState(2025);
    const [bfcmExpanded, setBfcmExpanded] = useState(false);

    const presets = [
        { id: 'bfcm2024', label: 'BFCM 2024' },
        { id: 'none', label: 'No comparison' },
        { id: 'yesterday', label: 'Yesterday' },
        { id: 'prevweek', label: 'Previous week' },
        { id: 'prevmonth', label: 'Previous month' },
        { id: 'prevquarter', label: 'Previous quarter' },
        { id: 'prevyear', label: 'Previous year' },
        { id: 'prevyearmatch', label: 'Previous year (match day of week)' },
    ];

    const getDaysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();
    const getFirstDayOfMonth = (month, year) => new Date(year, month, 1).getDay();

    const renderCalendar = (month, year) => {
        const daysInMonth = getDaysInMonth(month, year);
        const firstDay = getFirstDayOfMonth(month, year);
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'];
        const dayNames = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

        const days = [];
        for (let i = 0; i < firstDay; i++) {
            days.push(<div key={`empty-${i}`} className="comp-calendar-day empty" />);
        }
        for (let day = 1; day <= daysInMonth; day++) {
            const isSelected = day === 1 && month === 11 && year === 2025;
            const isFuture = (month === 11 && day > 2) || month > 11;
            days.push(
                <div
                    key={day}
                    className={`comp-calendar-day ${isSelected ? 'selected' : ''} ${isFuture ? 'disabled' : ''}`}
                >
                    {day}
                </div>
            );
        }

        return (
            <div className="comp-calendar-month">
                <div className="comp-calendar-header">
                    <Text variant="headingSm" as="h4">{monthNames[month]} {year}</Text>
                </div>
                <div className="comp-calendar-weekdays">
                    {dayNames.map(day => (
                        <div key={day} className="comp-calendar-weekday">{day}</div>
                    ))}
                </div>
                <div className="comp-calendar-days">
                    {days}
                </div>
            </div>
        );
    };

    const prevMonth = () => {
        if (currentMonth === 0) {
            setCurrentMonth(11);
            setCurrentYear(currentYear - 1);
        } else {
            setCurrentMonth(currentMonth - 1);
        }
    };

    const nextMonth = () => {
        if (currentMonth === 11) {
            setCurrentMonth(0);
            setCurrentYear(currentYear + 1);
        } else {
            setCurrentMonth(currentMonth + 1);
        }
    };

    const prevMonthIndex = currentMonth === 0 ? 11 : currentMonth - 1;
    const prevMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;

    return (
        <>
            {open && (
                <>
                    <div
                        style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: 'rgba(0, 0, 0, 0.5)',
                            zIndex: 1000,
                        }}
                        onClick={onClose}
                    />

                    <div style={{
                        position: 'fixed',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        background: 'white',
                        borderRadius: '16px',
                        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.2)',
                        zIndex: 1001,
                        maxWidth: '900px',
                        width: '90%',
                        maxHeight: '90vh',
                        overflow: 'hidden',
                    }}>
                        <style>{`
              .comparison-modal {
                display: flex;
                min-height: 480px;
              }
              .comparison-sidebar {
                width: 260px;
                border-right: 1px solid #e1e3e5;
                padding: 16px 0;
                overflow-y: auto;
              }
              .comparison-preset {
                padding: 10px 16px;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: space-between;
                transition: background 0.15s;
              }
              .comparison-preset:hover {
                background: #f6f6f7;
              }
              .comparison-preset.selected {
                background: #f6f6f7;
              }
              .bfcm-header {
                padding: 10px 16px;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: space-between;
              }
              .bfcm-header:hover {
                background: #f6f6f7;
              }
              .comparison-main {
                flex: 1;
                padding: 16px 24px;
              }
              .comp-calendar-month {
                width: 280px;
              }
              .comp-calendar-header {
                text-align: center;
                margin-bottom: 12px;
              }
              .comp-calendar-weekdays {
                display: grid;
                grid-template-columns: repeat(7, 1fr);
                gap: 4px;
                margin-bottom: 8px;
              }
              .comp-calendar-weekday {
                text-align: center;
                font-size: 12px;
                color: #6d7175;
                padding: 4px;
                font-weight: 500;
              }
              .comp-calendar-days {
                display: grid;
                grid-template-columns: repeat(7, 1fr);
                gap: 4px;
              }
              .comp-calendar-day {
                text-align: center;
                padding: 8px;
                font-size: 13px;
                cursor: pointer;
                border-radius: 8px;
                transition: background 0.15s;
              }
              .comp-calendar-day:hover:not(.empty):not(.disabled) {
                background: #f6f6f7;
              }
              .comp-calendar-day.selected {
                background: #303030;
                color: white;
              }
              .comp-calendar-day.disabled {
                color: #c9cccf;
                cursor: default;
              }
              .comp-calendar-day.empty {
                cursor: default;
              }
              .comp-date-input {
                flex: 1;
                padding: 10px 12px;
                border: 1px solid #c9cccf;
                border-radius: 8px;
                font-size: 14px;
              }
              .comp-date-input:focus {
                outline: none;
                border-color: #005bd3;
                box-shadow: 0 0 0 1px #005bd3;
              }
              .comp-time-button {
                padding: 10px;
                border: 1px solid #c9cccf;
                border-radius: 8px;
                background: white;
                cursor: pointer;
              }
              .comp-time-button:hover {
                background: #f6f6f7;
              }
              .comp-nav-btn {
                padding: 4px 8px;
                border: none;
                background: none;
                cursor: pointer;
                border-radius: 4px;
                color: #6d7175;
              }
              .comp-nav-btn:hover {
                background: #f6f6f7;
              }
            `}</style>

                        <div className="comparison-modal">
                            <div className="comparison-sidebar">
                                {presets.map(preset => (
                                    <div
                                        key={preset.id}
                                        className={`comparison-preset ${selectedPreset === preset.id ? 'selected' : ''}`}
                                        onClick={() => setSelectedPreset(preset.id)}
                                    >
                                        <Text variant="bodyMd" as="span">{preset.label}</Text>
                                        {selectedPreset === preset.id && (
                                            <span style={{ color: '#303030' }}>✓</span>
                                        )}
                                    </div>
                                ))}
                                <div
                                    className="bfcm-header"
                                    onClick={() => setBfcmExpanded(!bfcmExpanded)}
                                >
                                    <Text variant="bodyMd" as="span">Black Friday Cyber Monday</Text>
                                    <Icon source={ChevronDownIcon} />
                                </div>
                            </div>

                            <div className="comparison-main">
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                                    <input
                                        type="text"
                                        className="comp-date-input"
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                    />
                                    <span style={{ color: '#6d7175' }}>→</span>
                                    <input
                                        type="text"
                                        className="comp-date-input"
                                        value={endDate}
                                        onChange={(e) => setEndDate(e.target.value)}
                                    />
                                    <button className="comp-time-button">
                                        <Icon source={ClockIcon} />
                                    </button>
                                </div>

                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                                    <button className="comp-nav-btn" onClick={prevMonth}>
                                        <Icon source={ChevronLeftIcon} />
                                    </button>
                                    <div style={{ flex: 1 }} />
                                    <button className="comp-nav-btn" onClick={nextMonth}>
                                        <Icon source={ChevronRightIcon} />
                                    </button>
                                </div>

                                <div style={{ display: 'flex', gap: '32px' }}>
                                    {renderCalendar(prevMonthIndex, prevMonthYear)}
                                    {renderCalendar(currentMonth, currentYear)}
                                </div>
                            </div>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', padding: '16px 24px', borderTop: '1px solid #e1e3e5' }}>
                            <Button onClick={onClose}>Cancel</Button>
                            <Button variant="primary" onClick={() => { onApply && onApply(); onClose(); }}>Apply</Button>
                        </div>
                    </div>
                </>
            )}
        </>
    );
};

// ============================================
// CURRENCY SELECTOR COMPONENT
// ============================================

const CurrencySelector = ({ selectedCurrency, onCurrencyChange, onClose }) => {
    const [searchQuery, setSearchQuery] = useState('');

    const currencies = [
        { code: 'INR', name: 'Indian Rupee', symbol: '₹' },
        { code: 'AED', name: 'United Arab Emirates Dirham', symbol: '' },
        { code: 'AFN', name: 'Afghan Afghani', symbol: '؋' },
        { code: 'ALL', name: 'Albanian Lek', symbol: '' },
        { code: 'AMD', name: 'Armenian Dram', symbol: '֏' },
        { code: 'ANG', name: 'Netherlands Antillean Guilder', symbol: '' },
        { code: 'AOA', name: 'Angolan Kwanza', symbol: 'Kz' },
        { code: 'ARS', name: 'Argentine Peso', symbol: '$' },
        { code: 'AUD', name: 'Australian Dollar', symbol: '$' },
        { code: 'USD', name: 'US Dollar', symbol: '$' },
        { code: 'EUR', name: 'Euro', symbol: '€' },
        { code: 'GBP', name: 'British Pound', symbol: '£' },
        { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
        { code: 'CAD', name: 'Canadian Dollar', symbol: '$' },
        { code: 'CHF', name: 'Swiss Franc', symbol: '' },
        { code: 'CNY', name: 'Chinese Yuan', symbol: '¥' },
    ];

    const filteredCurrencies = currencies.filter(currency =>
        currency.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        currency.code.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <>
            <div style={{ padding: '12px', borderBottom: '1px solid #e1e3e5' }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 12px',
                    border: '2px solid #005bd3',
                    borderRadius: '8px',
                    background: 'white',
                }}>
                    <Icon source={SearchIcon} tone="subdued" />
                    <input
                        type="text"
                        placeholder="Search for a currency"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{
                            border: 'none',
                            outline: 'none',
                            flex: 1,
                            fontSize: '14px',
                        }}
                        autoFocus
                    />
                </div>
            </div>
            <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                {filteredCurrencies.map(currency => (
                    <div
                        key={currency.code}
                        onClick={() => {
                            onCurrencyChange(currency);
                            onClose();
                        }}
                        style={{
                            padding: '12px 16px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            background: selectedCurrency === currency.code ? '#f6f6f7' : 'white',
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = '#f6f6f7'}
                        onMouseLeave={(e) => e.currentTarget.style.background = selectedCurrency === currency.code ? '#f6f6f7' : 'white'}
                    >
                        <Text variant="bodyMd" as="span">
                            {currency.name} ({currency.code} {currency.symbol})
                        </Text>
                        {selectedCurrency === currency.code && (
                            <span style={{ color: '#303030' }}>✓</span>
                        )}
                    </div>
                ))}
            </div>
        </>
    );
};

const Sparkline = ({ data, color = '#12acf0', dashed = false }) => {
    const width = 80;
    const height = 28;
    const points = data || [1, 3, 1, 2, 5, 2, 1, 4, 6, 3, 2, 8, 4, 2];
    const max = Math.max(...points) || 1;
    const baseline = height - 2;
    const maxBumpHeight = height - 6;

    const getY = (point) => baseline - (point / max) * maxBumpHeight;

    let pathData = '';

    for (let i = 0; i < points.length; i++) {
        const x = (i / (points.length - 1)) * width;
        const y = getY(points[i]);

        if (i === 0) {
            pathData = `M ${x} ${y}`;
        } else {
            const prevX = ((i - 1) / (points.length - 1)) * width;
            const prevY = getY(points[i - 1]);
            const cpx = (prevX + x) / 2;
            pathData += ` C ${cpx} ${prevY}, ${cpx} ${y}, ${x} ${y}`;
        }
    }

    return (
        <svg width={width} height={height} style={{ display: 'block' }}>
            <path
                d={pathData}
                fill="none"
                stroke={color}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray={dashed ? "4 2" : "none"}
            />
        </svg>
    );
};

const DualSparkline = ({ data1, data2, color1 = '#12acf0', color2 = '#c4c4c4' }) => {
    const width = 80;
    const height = 28;
    const baseline = height - 2;
    const maxBumpHeight = height - 6;

    const allPoints = [...(data1 || []), ...(data2 || [])];
    const max = Math.max(...allPoints) || 1;

    const createPath = (data) => {
        const getY = (point) => baseline - (point / max) * maxBumpHeight;

        let pathData = '';

        for (let i = 0; i < data.length; i++) {
            const x = (i / (data.length - 1)) * width;
            const y = getY(data[i]);

            if (i === 0) {
                pathData = `M ${x} ${y}`;
            } else {
                const prevX = ((i - 1) / (data.length - 1)) * width;
                const prevY = getY(data[i - 1]);
                const cpx = (prevX + x) / 2;
                pathData += ` C ${cpx} ${prevY}, ${cpx} ${y}, ${x} ${y}`;
            }
        }

        return pathData;
    };

    return (
        <svg width={width} height={height} style={{ display: 'block' }}>
            <path
                d={createPath(data2 || [1, 1, 2, 1, 2, 3, 1, 2, 3, 1, 2, 4, 2, 1])}
                fill="none"
                stroke={color2}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray="3 2"
            />
            <path
                d={createPath(data1 || [1, 2, 1, 1, 4, 2, 1, 3, 5, 2, 1, 6, 3, 2])}
                fill="none"
                stroke={color1}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
};

// ============================================
// STAT CARD COMPONENT (Top row)
// ============================================

const StatCard = ({ title, value, change, changeType = 'positive', sparklineData, sparklineData2, dualLine = false }) => {
    const [showTooltip, setShowTooltip] = useState(false);
    const tooltipData = chartTooltipData[title];

    const renderFormula = (formula) => {
        if (!formula) return null;
        const operators = ['+', '-', '*', '/', '(', ')'];
        const parts = formula.right.split(/(\+|\-|\*|\/|\(|\))/g).filter(p => p.trim());

        return (
            <div style={{ marginTop: '8px', fontFamily: 'monospace', fontSize: '12px' }}>
                <span style={{ color: '#0066cc' }}>{formula.left}</span>
                <span style={{ color: '#0066cc' }}> = </span>
                {parts.map((part, idx) => {
                    const trimmed = part.trim();
                    if (operators.includes(trimmed)) {
                        return <span key={idx} style={{ color: '#0066cc' }}> {trimmed} </span>;
                    }
                    return <span key={idx} style={{ color: '#1a7f4b' }}>{trimmed}</span>;
                })}
            </div>
        );
    };

    return (
        <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '12px 16px',
            border: '1px solid #e3e3e3',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)',
            height: '100%',
            position: 'relative'
        }}>
            <BlockStack gap="100">
                <div
                    style={{ position: 'relative', display: 'inline-block' }}
                    onMouseEnter={() => setShowTooltip(true)}
                    onMouseLeave={() => setShowTooltip(false)}
                >
                    <Text variant="bodySm" as="p" fontWeight="medium">
                        <span style={{
                            borderBottom: '1.5px dotted #6d7175',
                            paddingBottom: '1px',
                            cursor: 'help'
                        }}>
                            {title}
                        </span>
                    </Text>

                    {showTooltip && tooltipData && (
                        <div style={{
                            position: 'absolute',
                            top: '100%',
                            left: '0',
                            marginTop: '8px',
                            background: 'white',
                            borderRadius: '12px',
                            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
                            padding: '14px 18px',
                            zIndex: 1000,
                            minWidth: '280px',
                            maxWidth: '360px',
                        }}>
                            <Text variant="headingSm" as="p" fontWeight="bold">{tooltipData.title}</Text>
                            <div style={{ marginTop: '6px' }}>
                                <Text variant="bodySm" as="p" tone="subdued">
                                    {tooltipData.description}
                                </Text>
                            </div>
                            {tooltipData.formula && renderFormula(tooltipData.formula)}
                        </div>
                    )}
                </div>
                <InlineStack align="space-between" blockAlign="center">
                    <InlineStack gap="150" blockAlign="baseline">
                        <Text variant="headingMd" as="p" fontWeight="semibold">{value}</Text>
                        <Text
                            variant="bodySm"
                            as="span"
                            tone={changeType === 'positive' ? 'success' : changeType === 'critical' ? 'critical' : 'subdued'}
                        >
                            {changeType === 'positive' ? '↑' : changeType === 'critical' ? '↓' : ''}{change}
                        </Text>
                    </InlineStack>
                    {dualLine ? (
                        <DualSparkline data1={sparklineData} data2={sparklineData2} />
                    ) : (
                        <Sparkline data={sparklineData} color="#12acf0" />
                    )}
                </InlineStack>
            </BlockStack>
        </div>
    );
};

// ============================================
// LINE CHART COMPONENT
// ============================================

const LineChart = ({ height = 280, showYAxis = true, yAxisLabels = ['₹4K', '₹2K', '₹0', '-₹2K', '-₹4K'] }) => {
    const [hoverData, setHoverData] = useState(null);
    const xLabels = ['12 AM', '2 AM', '4 AM', '6 AM', '8 AM', '10 AM', '12 PM', '2 PM', '4 PM', '6 PM', '8 PM', '10 PM'];

    const mainLinePoints = [
        { x: 0, y: 108, value: 0 },
        { x: 35, y: 100, value: 200 },
        { x: 70, y: 80, value: 892 },
        { x: 100, y: 55, value: 1500 },
        { x: 130, y: 55, value: 1400 },
        { x: 165, y: 85, value: 600 },
        { x: 200, y: 108, value: 0 },
        { x: 280, y: 108, value: 0 },
        { x: 320, y: 100, value: 200 },
        { x: 360, y: 75, value: 1000 },
        { x: 400, y: 50, value: 1892 },
        { x: 440, y: 65, value: 1200 },
        { x: 480, y: 90, value: 498 },
        { x: 520, y: 108, value: 0 },
        { x: 560, y: 108, value: 0 },
        { x: 600, y: 100, value: 200 },
        { x: 640, y: 75, value: 1000 },
        { x: 680, y: 45, value: 2156 },
        { x: 720, y: 70, value: 1100 },
        { x: 760, y: 95, value: 445 },
        { x: 800, y: 108, value: 0 },
    ];

    const compareLinePoints = [
        { x: 0, y: 108, value: 0 },
        { x: 280, y: 108, value: 0 },
        { x: 320, y: 115, value: -200 },
        { x: 360, y: 150, value: -1500 },
        { x: 400, y: 200, value: -3807 },
        { x: 440, y: 200, value: -3500 },
        { x: 480, y: 150, value: -1500 },
        { x: 520, y: 115, value: -200 },
        { x: 560, y: 108, value: 0 },
        { x: 620, y: 105, value: 100 },
        { x: 660, y: 95, value: 320 },
        { x: 700, y: 103, value: 150 },
        { x: 800, y: 108, value: 0 },
    ];

    const getYAtX = (points, x) => {
        for (let i = 0; i < points.length - 1; i++) {
            if (x >= points[i].x && x <= points[i + 1].x) {
                const t = (x - points[i].x) / (points[i + 1].x - points[i].x);
                return {
                    y: points[i].y + t * (points[i + 1].y - points[i].y),
                    value: points[i].value + t * (points[i + 1].value - points[i].value)
                };
            }
        }
        return { y: 108, value: 0 };
    };

    const getTimeFromX = (x) => {
        const hour = Math.round((x / 800) * 24);
        const clampedHour = Math.max(0, Math.min(23, hour));
        const period = clampedHour >= 12 ? 'PM' : 'AM';
        const displayHour = clampedHour % 12 || 12;
        return `${displayHour}:00 ${period}`;
    };

    const handleMouseMove = (e) => {
        const svg = e.currentTarget;
        const rect = svg.getBoundingClientRect();
        const svgX = ((e.clientX - rect.left) / rect.width) * 800;
        const svgY = ((e.clientY - rect.top) / rect.height) * 220;

        const mainPoint = getYAtX(mainLinePoints, svgX);
        const comparePoint = getYAtX(compareLinePoints, svgX);

        const distToMain = Math.abs(svgY - mainPoint.y);
        const distToCompare = Math.abs(svgY - comparePoint.y);
        const threshold = 20;

        if (distToMain < threshold || distToCompare < threshold) {
            setHoverData({
                x: svgX,
                mainY: mainPoint.y,
                compareY: comparePoint.y,
                mainValue: Math.round(mainPoint.value),
                compareValue: Math.round(comparePoint.value),
                time: getTimeFromX(svgX),
                screenX: e.clientX,
                screenY: rect.top
            });
        } else {
            setHoverData(null);
        }
    };

    const handleMouseLeave = () => {
        setHoverData(null);
    };

    const formatValue = (val) => {
        if (val < 0) return `-₹${Math.abs(val).toLocaleString()}.00`;
        return `₹${val.toLocaleString()}.00`;
    };

    const calculateChange = (current, compare) => {
        if (compare === 0 && current === 0) return '0%';
        if (compare === 0) return '100%';
        const change = Math.round(((current - compare) / Math.abs(compare)) * 100);
        return `${Math.abs(change)}%`;
    };

    return (
        <div style={{ position: 'relative', height: `${height}px`, width: '100%' }}>
            {showYAxis && (
                <div style={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    bottom: 30,
                    width: '40px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    paddingRight: '8px'
                }}>
                    {yAxisLabels.map((label, i) => (
                        <Text key={i} variant="bodySm" as="span" tone="subdued" alignment="end">
                            {label}
                        </Text>
                    ))}
                </div>
            )}

            <div style={{
                position: 'absolute',
                left: showYAxis ? '48px' : '0',
                right: 0,
                top: 0,
                bottom: 0,
                overflow: 'hidden',  /* ADD THIS */
                minWidth: 0          /* ADD THIS */
            }}>
                <svg
                    width="100%"
                    height={height - 30}
                    viewBox="0 0 800 220"
                    preserveAspectRatio="none"
                    style={{ overflow: 'visible' }}
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
                >
                    <line x1="0" y1="0" x2="800" y2="0" stroke="#f3f3f3" strokeWidth="1" />
                    <line x1="0" y1="55" x2="800" y2="55" stroke="#f3f3f3" strokeWidth="1" />
                    <line x1="0" y1="110" x2="800" y2="110" stroke="#f3f3f3" strokeWidth="1" />
                    <line x1="0" y1="165" x2="800" y2="165" stroke="#f3f3f3" strokeWidth="1" />
                    <line x1="0" y1="220" x2="800" y2="220" stroke="#f3f3f3" strokeWidth="1" />

                    <path
                        d="M 0 108 
               L 280 108
               C 300 108, 320 115, 360 150
               C 380 180, 400 200, 420 200
               C 440 200, 460 180, 480 150
               C 500 120, 520 108, 560 108
               L 600 108
               C 620 106, 640 100, 660 95
               C 680 100, 700 106, 720 108
               L 800 108"
                        fill="none"
                        stroke="#12acf0"
                        strokeWidth="1.5"
                        strokeDasharray="4 3"
                        strokeOpacity="0.5"
                        style={{ pointerEvents: 'none' }}
                    />

                    <path
                        d="M 0 108 
               C 30 108, 50 100, 70 80
               C 90 55, 110 55, 130 55
               C 150 70, 170 100, 200 108
               L 280 108
               C 300 108, 320 100, 360 75
               C 380 60, 400 50, 420 50
               C 440 60, 460 80, 480 90
               C 500 100, 510 108, 520 108
               L 560 108
               C 580 108, 600 100, 640 75
               C 660 55, 680 45, 700 50
               C 720 60, 740 80, 760 95
               C 780 105, 790 108, 800 108"
                        fill="none"
                        stroke="#12acf0"
                        strokeWidth="2"
                        style={{ pointerEvents: 'none' }}
                    />

                    <path
                        d="M 0 108 
               C 30 108, 50 100, 70 80
               C 90 55, 110 55, 130 55
               C 150 70, 170 100, 200 108
               L 280 108
               C 300 108, 320 100, 360 75
               C 380 60, 400 50, 420 50
               C 440 60, 460 80, 480 90
               C 500 100, 510 108, 520 108
               L 560 108
               C 580 108, 600 100, 640 75
               C 660 55, 680 45, 700 50
               C 720 60, 740 80, 760 95
               C 780 105, 790 108, 800 108"
                        fill="none"
                        stroke="transparent"
                        strokeWidth="20"
                        style={{ cursor: 'pointer' }}
                    />

                    <path
                        d="M 0 108 
               L 280 108
               C 300 108, 320 115, 360 150
               C 380 180, 400 200, 420 200
               C 440 200, 460 180, 480 150
               C 500 120, 520 108, 560 108
               L 600 108
               C 620 106, 640 100, 660 95
               C 680 100, 700 106, 720 108
               L 800 108"
                        fill="none"
                        stroke="transparent"
                        strokeWidth="20"
                        style={{ cursor: 'pointer' }}
                    />

                    {hoverData && (
                        <>
                            <line
                                x1={hoverData.x}
                                y1="0"
                                x2={hoverData.x}
                                y2="220"
                                stroke="#c4c4c4"
                                strokeWidth="1"
                                strokeDasharray="4 4"
                                style={{ pointerEvents: 'none' }}
                            />

                            <circle
                                cx={hoverData.x}
                                cy={hoverData.mainY}
                                r="6"
                                fill="#12acf0"
                                stroke="white"
                                strokeWidth="2"
                                style={{ pointerEvents: 'none' }}
                            />

                            <circle
                                cx={hoverData.x}
                                cy={hoverData.compareY}
                                r="5"
                                fill="#12acf0"
                                fillOpacity="0.5"
                                stroke="white"
                                strokeWidth="2"
                                style={{ pointerEvents: 'none' }}
                            />
                        </>
                    )}
                </svg>

                {hoverData && (
                    <div style={{
                        position: 'fixed',
                        left: hoverData.screenX + 15,
                        top: hoverData.screenY + 20,
                        background: 'white',
                        borderRadius: '12px',
                        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
                        padding: '12px 16px',
                        zIndex: 1000,
                        minWidth: '200px',
                        pointerEvents: 'none'
                    }}>
                        <Text variant="headingSm" as="p" fontWeight="semibold">Total sales</Text>
                        <div style={{ marginTop: '8px' }}>
                            <InlineStack gap="100" blockAlign="center">
                                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#12acf0' }} />
                                <Text variant="bodySm" as="span" tone="subdued">Dec 2, 2025, {hoverData.time}</Text>
                            </InlineStack>
                            <Text variant="bodyMd" as="p" fontWeight="semibold" style={{ marginTop: '4px' }}>{formatValue(hoverData.mainValue)}</Text>
                            <div style={{ marginTop: '4px' }}>
                                <span style={{ color: '#369962', fontSize: '13px' }}>↗ {calculateChange(hoverData.mainValue, hoverData.compareValue)}</span>
                                <span style={{ color: '#6d7175', fontSize: '13px' }}> from comparison</span>
                            </div>
                        </div>
                        <div style={{ marginTop: '12px', paddingTop: '8px', borderTop: '1px solid #e3e3e3' }}>
                            <InlineStack gap="100" blockAlign="center">
                                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#12acf0', opacity: 0.5 }} />
                                <Text variant="bodySm" as="span" tone="subdued">Dec 1, 2025, {hoverData.time}</Text>
                            </InlineStack>
                            <Text variant="bodyMd" as="p" fontWeight="semibold" style={{ marginTop: '4px' }}>{formatValue(hoverData.compareValue)}</Text>
                        </div>
                    </div>
                )}

                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    paddingTop: '8px',
                    paddingLeft: '0',
                    paddingRight: '0'
                }}>
                    {xLabels.map((label, i) => (
                        <Text key={i} variant="bodySm" as="span" tone="subdued">
                            {label}
                        </Text>
                    ))}
                </div>
            </div>
        </div>
    );
};

// Simple line chart for smaller cards with hover
const SimpleLineChart = ({ height = 320, color = '#12acf0', yLabels = ['60', '40', '20', '0'] }) => {
    const [hoverData, setHoverData] = useState(null);

    const handleMouseMove = (e) => {
        const svg = e.currentTarget;
        const rect = svg.getBoundingClientRect();
        const svgX = ((e.clientX - rect.left) / rect.width) * 300;

        const hour = Math.round((svgX / 300) * 24);
        const clampedHour = Math.max(0, Math.min(23, hour));
        const period = clampedHour >= 12 ? 'PM' : 'AM';
        const displayHour = clampedHour % 12 || 12;
        const time = `${displayHour}:00 ${period}`;

        const mainY = 80 - (svgX / 300) * 60;
        const compareY = 70 - (svgX / 300) * 35;

        setHoverData({
            x: svgX,
            mainY: Math.max(15, Math.min(90, mainY)),
            compareY: Math.max(35, Math.min(75, compareY)),
            time,
            screenX: e.clientX,
            screenY: rect.top + rect.height / 2
        });
    };

    const handleMouseLeave = () => {
        setHoverData(null);
    };

    return (
        <div style={{ height: `${height}px`, position: 'relative', display: 'flex' }}>
            {/* Y-axis labels */}
            <div style={{
                width: '30px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                paddingRight: '8px',
                paddingBottom: '24px'
            }}>
                {yLabels.map((label, i) => (
                    <Text key={i} variant="bodySm" as="span" tone="subdued" alignment="end">
                        {label}
                    </Text>
                ))}
            </div>

            {/* Chart area */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <svg
                    width="100%"
                    height={height - 24}
                    viewBox="0 0 300 100"
                    preserveAspectRatio="none"
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
                    style={{ cursor: 'pointer', flex: 1 }}
                >
                    <line x1="0" y1="0" x2="300" y2="0" stroke="#f3f3f3" strokeWidth="1" />
                    <line x1="0" y1="33" x2="300" y2="33" stroke="#f3f3f3" strokeWidth="1" />
                    <line x1="0" y1="66" x2="300" y2="66" stroke="#f3f3f3" strokeWidth="1" />
                    <line x1="0" y1="100" x2="300" y2="100" stroke="#f3f3f3" strokeWidth="1" />

                    <path
                        d="M 0 70 C 50 65, 100 55, 150 50 S 250 42, 300 38"
                        fill="none"
                        stroke="#c4c4c4"
                        strokeWidth="1.5"
                        strokeDasharray="4 3"
                    />

                    <path
                        d="M 0 80 C 40 75, 80 60, 120 50 S 200 35, 250 28 S 280 22, 300 18"
                        fill="none"
                        stroke={color}
                        strokeWidth="2"
                    />

                    {hoverData && (
                        <>
                            <line
                                x1={hoverData.x}
                                y1="0"
                                x2={hoverData.x}
                                y2="100"
                                stroke="#c4c4c4"
                                strokeWidth="1"
                                strokeDasharray="4 4"
                            />
                            <circle cx={hoverData.x} cy={hoverData.mainY} r="5" fill={color} stroke="white" strokeWidth="2" />
                            <circle cx={hoverData.x} cy={hoverData.compareY} r="4" fill="#c4c4c4" stroke="white" strokeWidth="2" />
                        </>
                    )}
                </svg>

                <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '4px' }}>
                    <Text variant="bodySm" as="span" tone="subdued">12 AM</Text>
                    <Text variant="bodySm" as="span" tone="subdued">5 AM</Text>
                    <Text variant="bodySm" as="span" tone="subdued">10 AM</Text>
                    <Text variant="bodySm" as="span" tone="subdued">3 PM</Text>
                    <Text variant="bodySm" as="span" tone="subdued">8 PM</Text>
                </div>
            </div>
        </div>
    );
};

// ============================================
// DONUT CHART WITH HOVER COMPONENT
// ============================================

const DonutChartWithHover = ({
    totalValue,
    totalChange,
    changeType = 'positive',
    size = 180,
    segments = []
}) => {
    const [hoveredSegment, setHoveredSegment] = useState(null);
    const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

    const radius = (size - 40) / 2;
    const strokeWidth = 24;
    const circumference = 2 * Math.PI * radius;

    let currentOffset = circumference * 0.25;

    const handleSegmentHover = (segment, e) => {
        setHoveredSegment(segment);
        setTooltipPosition({ x: e.clientX, y: e.clientY });
    };

    return (
        <div style={{ position: 'relative', width: size, height: size }}>
            <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
                {/* Background circle */}
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke="#e8e8e8"
                    strokeWidth={strokeWidth}
                />

                {/* Segments */}
                {segments.map((segment, index) => {
                    const segmentLength = (segment.percentage / 100) * circumference;
                    const offset = currentOffset;
                    currentOffset += segmentLength;

                    const isHovered = hoveredSegment?.label === segment.label;
                    const opacity = hoveredSegment ? (isHovered ? 1 : 0.3) : 1;

                    return (
                        <circle
                            key={index}
                            cx={size / 2}
                            cy={size / 2}
                            r={radius}
                            fill="none"
                            stroke={segment.color}
                            strokeWidth={strokeWidth}
                            strokeDasharray={`${segmentLength} ${circumference}`}
                            strokeDashoffset={-offset + circumference * 0.25}
                            strokeLinecap="butt"
                            style={{
                                opacity,
                                transition: 'opacity 0.2s ease',
                                cursor: 'pointer'
                            }}
                            onMouseEnter={(e) => handleSegmentHover(segment, e)}
                            onMouseMove={(e) => setTooltipPosition({ x: e.clientX, y: e.clientY })}
                            onMouseLeave={() => setHoveredSegment(null)}
                        />
                    );
                })}
            </svg>

            {/* Center text */}
            <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                textAlign: 'center'
            }}>
                {hoveredSegment ? (
                    <>
                        <Text variant="bodySm" as="p" tone="subdued">{hoveredSegment.label}</Text>
                        <Text variant="headingLg" as="p" fontWeight="bold">{hoveredSegment.value}</Text>
                        {hoveredSegment.change && (
                            <Text
                                variant="bodySm"
                                as="p"
                                tone={hoveredSegment.changeType === 'positive' ? 'success' : 'critical'}
                            >
                                ↗ {hoveredSegment.change}
                            </Text>
                        )}
                    </>
                ) : (
                    <>
                        <Text variant="headingLg" as="p" fontWeight="bold">{totalValue}</Text>
                        <Text
                            variant="bodySm"
                            as="p"
                            tone={changeType === 'positive' ? 'success' : 'critical'}
                        >
                            ↗ {totalChange}
                        </Text>
                    </>
                )}
            </div>

            {/* Tooltip */}
            {hoveredSegment && (
                <div style={{
                    position: 'fixed',
                    left: tooltipPosition.x + 15,
                    top: tooltipPosition.y - 10,
                    background: 'white',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                    padding: '10px 14px',
                    zIndex: 1000,
                    pointerEvents: 'none',
                    minWidth: '120px'
                }}>
                    <Text variant="headingSm" as="p" fontWeight="semibold">Total sales</Text>
                    <InlineStack gap="100" blockAlign="center" style={{ marginTop: '6px' }}>
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: hoveredSegment.color }} />
                        <Text variant="bodySm" as="span">{hoveredSegment.label}</Text>
                    </InlineStack>
                    <Text variant="bodyMd" as="p" fontWeight="semibold" style={{ marginTop: '4px' }}>{hoveredSegment.fullValue || hoveredSegment.value}</Text>
                </div>
            )}
        </div>
    );
};

// ============================================
// SALES BREAKDOWN COMPONENT
// ============================================

const SalesBreakdown = () => {
    const items = [
        { label: 'Gross sales', value: '₹6,093.00', change: '59%', type: 'positive', hasBg: false },
        { label: 'Discounts', value: '-₹281.71', change: '16%', type: 'positive', hasBg: true },
        { label: 'Returns', value: '₹0.00', change: '100%', type: 'positive', hasBg: false },
        { label: 'Net sales', value: '₹5,811.29', change: '1.9K%', type: 'positive', hasBg: true },
        { label: 'Shipping charges', value: '₹198.00', change: null, type: 'neutral', hasBg: false },
        { label: 'Return fees', value: '₹0.00', change: null, type: 'neutral', hasBg: true },
        { label: 'Taxes', value: '₹0.00', change: null, type: 'neutral', hasBg: false },
    ];

    return (
        <BlockStack gap="0">
            <div style={{ marginBottom: '12px', paddingLeft: '4px' }}>
                <ChartHeading title="Total sales breakdown" variant="bodySm" />
            </div>
            {items.map((item, index) => (
                <div key={index} style={{
                    padding: '10px 4px 10px 4px',
                    margin: '1px 0',
                    borderRadius: item.hasBg ? '8px' : '0',
                    background: item.hasBg ? '#f7f7f7' : 'transparent'
                }}>
                    <InlineStack align="space-between">
                        <Text variant="bodySm" as="span" tone="magic-subdued">
                            <span style={{ color: '#005bd3', cursor: 'pointer' }}>{item.label}</span>
                        </Text>
                        <InlineStack gap="200">
                            <Text variant="bodySm" as="span">{item.value}</Text>
                            {item.change ? (
                                <span style={{ color: '#369962', fontSize: '12px' }}>
                                    ↗ {item.change}
                                </span>
                            ) : (
                                <Text variant="bodySm" as="span" tone="subdued">—</Text>
                            )}
                        </InlineStack>
                    </InlineStack>
                </div>
            ))}
            <div style={{
                padding: '10px 4px 10px 4px',
                margin: '1px 0',
                borderRadius: '8px',
                background: '#f7f7f7',
                marginTop: '4px'
            }}>
                <InlineStack align="space-between">
                    <Text variant="bodySm" as="span">
                        <span style={{ color: '#005bd3', cursor: 'pointer', fontWeight: 500 }}>Total sales</span>
                    </Text>
                    <InlineStack gap="200">
                        <Text variant="bodySm" as="span" fontWeight="semibold">₹6,009.29</Text>
                        <span style={{ color: '#369962', fontSize: '12px' }}>
                            ↗ 5.1K%
                        </span>
                    </InlineStack>
                </InlineStack>
            </div>
        </BlockStack>
    );
};

// ============================================
// PRODUCT SALES LIST COMPONENT (Updated)
// ============================================

const ProductSalesList = () => {
    const [hoveredIndex, setHoveredIndex] = useState(null);

    const products = [
        { name: 'CLEAR COMPLEXION 15-DAY CHALLENGE - Ayurvedic 50+ Herbs...', value: '₹2,849.05', compare: '₹0.00', change: null, barWidth: 100 },
        { name: 'Lip Stain – 50+ Ayurvedic Herbs infused · skshafeen · None', value: '₹2,356.05', compare: '₹2,279.19', change: '3%', changeType: 'positive', barWidth: 82 },
        { name: 'Icy Drips Tinted Lip Oil – 50 + Ayurvedic Herbs infused · skshafee...', value: '₹1,233.10', compare: '₹585.73', change: null, barWidth: 43 },
        { name: 'Clear Complexion Soap – Infused with 50+ Ayurvedic Herbs · sksh...', value: '₹888.00', compare: '₹0.00', change: null, barWidth: 31 },
    ];

    return (
        <BlockStack gap="300">
            <ChartHeading title="Total sales by product" />
            <div style={{ maxHeight: '220px', overflowY: 'auto' }}>
                <BlockStack gap="300">
                    {products.map((product, index) => (
                        <div
                            key={index}
                            onMouseEnter={() => setHoveredIndex(index)}
                            onMouseLeave={() => setHoveredIndex(null)}
                            style={{
                                opacity: hoveredIndex !== null && hoveredIndex !== index ? 0.4 : 1,
                                transition: 'opacity 0.2s ease'
                            }}
                        >
                            <BlockStack gap="50">
                                <Text variant="bodySm" as="p">{product.name}</Text>

                                {/* Main bar row */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <div style={{
                                        flex: 1,
                                        height: '10px',
                                        background: '#e8e8e8',
                                        borderRadius: '2px',
                                        overflow: 'hidden'
                                    }}>
                                        <div style={{
                                            width: `${product.barWidth}%`,
                                            height: '100%',
                                            background: '#12acf0',
                                            borderRadius: '2px',
                                        }} />
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: '120px', justifyContent: 'flex-end' }}>
                                        <Text variant="bodySm" as="span" fontWeight="medium">{product.value}</Text>
                                        {product.change ? (
                                            <Text variant="bodySm" as="span" tone="success">↗ {product.change}</Text>
                                        ) : (
                                            <Text variant="bodySm" as="span" tone="subdued">—</Text>
                                        )}
                                    </div>
                                </div>

                                {/* Compare bar row - 2px gap from main bar */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '-2px' }}>
                                    <div style={{
                                        flex: 1,
                                        height: '10px',
                                        background: 'transparent',
                                        borderRadius: '2px',
                                        overflow: 'hidden'
                                    }}>
                                        <div style={{
                                            width: `${product.barWidth * 0.8}%`,
                                            height: '100%',
                                            background: '#9bcdea',
                                            borderRadius: '2px',
                                        }} />
                                    </div>
                                    <div style={{ minWidth: '120px', textAlign: 'right' }}>
                                        <Text variant="bodySm" as="span" tone="subdued">{product.compare}</Text>
                                    </div>
                                </div>
                            </BlockStack>
                        </div>
                    ))}
                </BlockStack>
            </div>
        </BlockStack>
    );
};

// ============================================
// CONVERSION FUNNEL COMPONENT (Updated per Image 6)
// ============================================

const ConversionFunnel = () => {
    const [hoveredIndex, setHoveredIndex] = useState(null);

    const stages = [
        { label: 'Sessions', value: '100%', count: '143', change: '23%', changeType: 'critical', icon: true },
        { label: 'Added to cart', value: '4.9%', count: '7', change: '67%', changeType: 'critical' },
        { label: 'Reached che...', value: '0%', count: '0', change: '0%', changeType: 'critical' },
        { label: 'Complet...', value: '0%', count: '0', change: '0%', changeType: 'critical' },
    ];

    return (
        <BlockStack gap="200">
            <ChartHeading title="Conversion rate breakdown" />
            <InlineStack gap="200" blockAlign="baseline">
                <Text variant="headingLg" as="p" fontWeight="semibold">0%</Text>
                <Text variant="bodySm" as="span" tone="subdued">—</Text>
            </InlineStack>

            {/* Stats row with dividers */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                borderTop: '1px solid #e3e3e3',
            }}>
                {stages.map((stage, index) => (
                    <div
                        key={index}
                        style={{
                            padding: '8px 4px',
                            borderRight: index < 3 ? '1px solid #e3e3e3' : 'none',
                            opacity: hoveredIndex !== null && hoveredIndex !== index ? 0.4 : 1,
                            transition: 'opacity 0.2s ease',
                            cursor: 'pointer'
                        }}
                        onMouseEnter={() => setHoveredIndex(index)}
                        onMouseLeave={() => setHoveredIndex(null)}
                    >
                        <BlockStack gap="050">
                            <InlineStack gap="100" blockAlign="center">
                                {stage.icon && (
                                    <span style={{ fontSize: '10px', color: '#6b7280' }}>⚡</span>
                                )}
                                <Text variant="bodySm" as="p" fontWeight="medium">{stage.label}</Text>
                            </InlineStack>
                            <Text variant="headingSm" as="p" fontWeight="semibold">{stage.value}</Text>
                            <Text variant="bodySm" as="p">{stage.count}</Text>
                            <Text
                                variant="bodySm"
                                as="p"
                                tone={stage.changeType === 'positive' ? 'success' : 'critical'}
                            >
                                ↘ {stage.change}
                            </Text>
                        </BlockStack>
                    </div>
                ))}
            </div>

            {/* Funnel visualization - aligned with 4 columns */}
            <div style={{ position: 'relative', height: '140px' }}>
                <svg width="100%" height="140" viewBox="0 0 400 140" preserveAspectRatio="xMidYMid meet">
                    {/* First bar - Sessions (0-100) */}
                    <g
                        style={{
                            opacity: hoveredIndex !== null && hoveredIndex !== 0 ? 0.4 : 1,
                            transition: 'opacity 0.2s ease',
                            cursor: 'pointer'
                        }}
                        onMouseEnter={() => setHoveredIndex(0)}
                        onMouseLeave={() => setHoveredIndex(null)}
                    >
                        <rect x="5" y="0" width="70" height="140" fill="#2563eb" />
                        <line x1="5" y1="28" x2="75" y2="28" stroke="#1d4ed8" strokeWidth="2" />
                        <line x1="5" y1="56" x2="75" y2="56" stroke="#1d4ed8" strokeWidth="2" />
                        {/* Diagonal triangle slope */}
                        <polygon points="75,0 100,140 75,140" fill="#60a5fa" />
                    </g>

                    {/* Second bar - Added to cart (100-200) */}
                    <g
                        style={{
                            opacity: hoveredIndex !== null && hoveredIndex !== 1 ? 0.4 : 1,
                            transition: 'opacity 0.2s ease',
                            cursor: 'pointer'
                        }}
                        onMouseEnter={() => setHoveredIndex(1)}
                        onMouseLeave={() => setHoveredIndex(null)}
                    >
                        <rect x="105" y="70" width="70" height="70" fill="#2563eb" />
                        {/* Diagonal triangle slope */}
                        <polygon points="175,70 200,140 175,140" fill="#60a5fa" />
                    </g>

                    {/* Third bar - Reached checkout (200-300) */}
                    <g
                        style={{
                            opacity: hoveredIndex !== null && hoveredIndex !== 2 ? 0.4 : 1,
                            transition: 'opacity 0.2s ease',
                            cursor: 'pointer'
                        }}
                        onMouseEnter={() => setHoveredIndex(2)}
                        onMouseLeave={() => setHoveredIndex(null)}
                    >
                        <rect x="205" y="120" width="70" height="20" fill="#2563eb" />
                        {/* Diagonal triangle slope */}
                        <polygon points="275,120 295,140 275,140" fill="#60a5fa" />
                    </g>

                    {/* Fourth bar - Completed (300-400) */}
                    <g
                        style={{
                            opacity: hoveredIndex !== null && hoveredIndex !== 3 ? 0.4 : 1,
                            transition: 'opacity 0.2s ease',
                            cursor: 'pointer'
                        }}
                        onMouseEnter={() => setHoveredIndex(3)}
                        onMouseLeave={() => setHoveredIndex(null)}
                    >
                        <rect x="305" y="120" width="70" height="20" fill="#2563eb" />
                        {/* Diagonal triangle slope */}
                        <polygon points="375,120 395,140 375,140" fill="#60a5fa" />
                    </g>
                </svg>
            </div>
        </BlockStack>
    );
};

// ============================================
// DEVICE TYPE DONUT COMPONENT (Updated per Image 7)
// ============================================

const DeviceTypeChart = () => {
    const [hoveredDevice, setHoveredDevice] = useState(null);

    const devices = [
        { label: 'Mobile', count: 205, change: '39%', changeType: 'positive', color: '#12acf0', percentage: 73 },
        { label: 'Desk...', count: 73, change: '630%', changeType: 'positive', color: '#8b5cf6', percentage: 26 },
        { label: 'Tablet', count: 1, color: '#60a5fa', percentage: 0.4 },
        { label: 'Other', count: 0, color: '#f472b6', percentage: 0 },
    ];

    const size = 180;
    const radius = (size - 40) / 2;
    const strokeWidth = 24;
    const circumference = 2 * Math.PI * radius;

    let currentOffset = circumference * 0.25;

    return (
        <BlockStack gap="300">
            <ChartHeading title="Sessions by device type" />
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

                        {devices.filter(d => d.percentage > 0).map((device, index) => {
                            const segmentLength = (device.percentage / 100) * circumference;
                            const offset = currentOffset;
                            currentOffset += segmentLength;

                            const isHovered = hoveredDevice?.label === device.label;
                            const opacity = hoveredDevice ? (isHovered ? 1 : 0.3) : 1;

                            return (
                                <circle
                                    key={index}
                                    cx={size / 2}
                                    cy={size / 2}
                                    r={radius}
                                    fill="none"
                                    stroke={device.color}
                                    strokeWidth={strokeWidth}
                                    strokeDasharray={`${segmentLength} ${circumference}`}
                                    strokeDashoffset={-offset + circumference * 0.25}
                                    strokeLinecap="butt"
                                    style={{ opacity, transition: 'opacity 0.2s ease', cursor: 'pointer' }}
                                    onMouseEnter={() => setHoveredDevice(device)}
                                    onMouseLeave={() => setHoveredDevice(null)}
                                />
                            );
                        })}

                        {/* Separator lines */}
                        <line
                            x1={size / 2}
                            y1={20}
                            x2={size / 2 - 5}
                            y2={20}
                            stroke="white"
                            strokeWidth="3"
                            transform={`rotate(${devices[0].percentage * 3.6}, ${size / 2}, ${size / 2})`}
                        />
                    </svg>

                    <div style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        textAlign: 'center'
                    }}>
                        <Text variant="headingXl" as="p" fontWeight="bold">279</Text>
                        <Text variant="bodySm" as="p" tone="success">↗ 78%</Text>
                    </div>
                </div>

                <BlockStack gap="300">
                    {devices.map((device, index) => (
                        <InlineStack
                            key={index}
                            gap="200"
                            blockAlign="center"
                            style={{
                                opacity: hoveredDevice && hoveredDevice.label !== device.label ? 0.4 : 1,
                                transition: 'opacity 0.2s ease',
                                cursor: 'pointer'
                            }}
                            onMouseEnter={() => setHoveredDevice(device)}
                            onMouseLeave={() => setHoveredDevice(null)}
                        >
                            <div style={{ width: 12, height: 12, background: device.color, borderRadius: 2 }} />
                            <Text variant="bodySm" as="span" style={{ minWidth: '50px' }}>{device.label}</Text>
                            <Text variant="bodySm" as="span" fontWeight="medium" style={{ minWidth: '30px' }}>{device.count}</Text>
                            {device.change && (
                                <Text variant="bodySm" as="span" tone="success">↗ {device.change}</Text>
                            )}
                        </InlineStack>
                    ))}
                </BlockStack>
            </InlineStack>
        </BlockStack>
    );
};

// ============================================
// SESSIONS BY LOCATION COMPONENT (Updated per Image 8)
// ============================================

const SessionsByLocation = () => {
    const [hoveredIndex, setHoveredIndex] = useState(null);

    const locations = [
        { label: 'India · Karnataka · Bengaluru', value: 70, compare: 121, change: '21%', changeType: 'positive' },
        { label: 'Germany · Saxony · Falkenstein', value: 49, compare: 1, change: '80%', changeType: 'positive' },
        { label: 'India · Maharashtra · Mumbai', value: 18, compare: 23, change: '7%', changeType: 'positive' },
        { label: 'India · Telangana · Hyderabad', value: 15, compare: 28, change: '56%', changeType: 'positive' },
        { label: 'India · None · None', value: 14, compare: 22, change: null, changeType: 'neutral' },
    ];

    const maxValue = Math.max(...locations.map(l => Math.max(l.value, l.compare)));

    return (
        <BlockStack gap="300">
            <ChartHeading title="Sessions by location" />
            <BlockStack gap="300">
                {locations.map((location, index) => (
                    <div
                        key={index}
                        onMouseEnter={() => setHoveredIndex(index)}
                        onMouseLeave={() => setHoveredIndex(null)}
                        style={{
                            opacity: hoveredIndex !== null && hoveredIndex !== index ? 0.4 : 1,
                            transition: 'opacity 0.2s ease'
                        }}
                    >
                        <BlockStack gap="50">
                            <Text variant="bodySm" as="span">{location.label}</Text>

                            {/* Main bar with value */}
                            <InlineStack gap="100" blockAlign="center">
                                <div style={{
                                    height: '10px',
                                    width: `${(location.value / maxValue) * 100}%`,
                                    maxWidth: '60%',
                                    background: '#12acf0',
                                    borderRadius: '2px',
                                }} />
                                <Text variant="bodySm" as="span" fontWeight="medium">{location.value}</Text>
                                {location.change && (
                                    <Text variant="bodySm" as="span" tone="success">↗ {location.change}</Text>
                                )}
                            </InlineStack>

                            {/* Compare bar with value */}
                            <InlineStack gap="100" blockAlign="center">
                                <div style={{
                                    height: '10px',
                                    width: `${(location.compare / maxValue) * 100}%`,
                                    maxWidth: '60%',
                                    background: '#9bcdea',
                                    borderRadius: '2px',
                                }} />
                                <Text variant="bodySm" as="span" tone="subdued">{location.compare}</Text>
                            </InlineStack>
                        </BlockStack>
                    </div>
                ))}
            </BlockStack>
        </BlockStack>
    );
};

// ============================================
// TOTAL SALES BY SOCIAL REFERRER (Updated per Image 9)
// ============================================

const TotalSalesBySocialReferrer = () => {
    return (
        <BlockStack gap="300">
            <ChartHeading title="Total sales by social referrer" />
            <BlockStack gap="200">
                <Text variant="bodySm" as="p">instagram</Text>
                <div style={{ position: 'relative' }}>
                    <div style={{
                        width: '80%',
                        height: '140px',
                        background: '#12acf0',
                        borderRadius: '4px',
                    }} />
                    <div style={{ position: 'absolute', right: '0', top: '50%', transform: 'translateY(-50%)' }}>
                        <InlineStack gap="100" blockAlign="center">
                            <Text variant="bodySm" as="span" fontWeight="medium">₹699.00</Text>
                            <Text variant="bodySm" as="span" tone="subdued">—</Text>
                        </InlineStack>
                    </div>
                </div>

                {/* Y-axis indicator */}
                <div style={{ display: 'flex', alignItems: 'flex-end', height: '20px' }}>
                    <div style={{ width: '2px', height: '100%', background: '#12acf0', marginRight: '8px' }} />
                    <Text variant="bodySm" as="span" tone="subdued">₹0.00</Text>
                </div>
            </BlockStack>
        </BlockStack>
    );
};

// ============================================
// COHORT TABLE COMPONENT (Updated per Image 10)
// ============================================

const CohortTable = () => {
    const cohorts = [
        { cohort: 'All cohorts', customers: '4,053', retention: '6.3%', months: ['6.9%', '6.1%', '4.5%', '2.9%', '3.9%', '2.8%', '2.1%', '1.5%', '1.2%', '0.9%', '0.6%', '0.4%'], isHeader: true },
        { cohort: 'Dec 2024', customers: '48', retention: '6.3%', months: ['4.2%', '12.5%', '10.4%', '8.3%', '6.3%', '4.2%', '2.1%', '2.1%', '2.1%', '2.1%', '2.1%', '6.3%'] },
        { cohort: 'Jan 2025', customers: '128', retention: '3.1%', months: ['9.4%', '8.6%', '10.9%', '3.9%', '8.6%', '5.5%', '3.1%', '2.3%', '1.6%', '0.8%', '3.1%', ''] },
        { cohort: 'Feb 2025', customers: '83', retention: '2.4%', months: ['6.0%', '13.3%', '6.0%', '9.6%', '9.6%', '4.8%', '2.4%', '1.2%', '1.2%', '2.4%', '', ''] },
        { cohort: 'Mar 2025', customers: '373', retention: '1.9%', months: ['9.9%', '4.6%', '7.2%', '3.5%', '6.7%', '3.2%', '2.4%', '1.9%', '1.9%', '', '', ''] },
        { cohort: 'Apr 2025', customers: '115', retention: '0.0%', months: ['7.8%', '4.3%', '2.6%', '0.9%', '0.9%', '0.0%', '0.0%', '0.0%', '', '', '', ''] },
        { cohort: 'May 2025', customers: '180', retention: '2.2%', months: ['11.1%', '10.0%', '9.4%', '4.4%', '2.8%', '2.2%', '2.2%', '', '', '', '', ''] },
        { cohort: 'Jun 2025', customers: '135', retention: '1.5%', months: ['8.1%', '14.1%', '6.7%', '3.7%', '1.5%', '1.5%', '', '', '', '', '', ''] },
        { cohort: 'Jul 2025', customers: '599', retention: '1.7%', months: ['8.5%', '7.7%', '3.5%', '1.2%', '1.7%', '', '', '', '', '', '', ''] },
        { cohort: 'Aug 2025', customers: '412', retention: '1.5%', months: ['7.3%', '5.8%', '2.7%', '1.5%', '', '', '', '', '', '', '', ''] },
        { cohort: 'Sep 2025', customers: '523', retention: '1.3%', months: ['6.5%', '4.2%', '1.3%', '', '', '', '', '', '', '', '', ''] },
        { cohort: 'Oct 2025', customers: '687', retention: '0.9%', months: ['5.1%', '0.9%', '', '', '', '', '', '', '', '', '', ''] },
        { cohort: 'Nov 2025', customers: '722', retention: '0.4%', months: ['0.4%', '', '', '', '', '', '', '', '', '', '', ''] },
    ];

    const monthHeaders = ['Month 0', 'Month 1', 'Month 2', 'Month 3', 'Month 4', 'Month 5', 'Month 6', 'Month 7', 'Month 8', 'Month 9', 'Month 10', 'Month 11'];

    const getHeatmapColor = (value) => {
        if (!value) return { bg: 'transparent', text: '#6d7175' };
        const num = parseFloat(value);
        if (num >= 12) return { bg: '#1e40af', text: 'white' };
        if (num >= 9) return { bg: '#3b82f6', text: 'white' };
        if (num >= 6) return { bg: '#60a5fa', text: 'white' };
        if (num >= 3) return { bg: '#93c5fd', text: '#1e3a5f' };
        if (num > 0) return { bg: '#dbeafe', text: '#1e3a5f' };
        return { bg: 'transparent', text: '#6d7175' };
    };

    return (
        <BlockStack gap="300">
            <ChartHeading title="Customer cohort analysis" />
            <div style={{ overflowX: 'auto', maxHeight: '370px', overflowY: 'auto' }}>
                <table style={{ borderCollapse: 'collapse', fontSize: '12px', minWidth: '1100px' }}>
                    <thead style={{ position: 'sticky', top: 0, background: 'white', zIndex: 1 }}>
                        <tr>
                            <th style={{ textAlign: 'left', padding: '8px 12px', color: '#6b7280', fontWeight: 500, borderBottom: '1px solid #e5e7eb', minWidth: '100px', whiteSpace: 'nowrap', position: 'sticky', left: 0, background: 'white' }}>Cohort</th>
                            <th style={{ textAlign: 'right', padding: '8px 12px', color: '#6b7280', fontWeight: 500, borderBottom: '1px solid #e5e7eb', minWidth: '90px', whiteSpace: 'nowrap' }}>Customers</th>
                            <th style={{ textAlign: 'right', padding: '8px 12px', color: '#6b7280', fontWeight: 500, borderBottom: '1px solid #e5e7eb', minWidth: '110px', whiteSpace: 'nowrap' }}>Retention rate</th>
                            {monthHeaders.map((month, i) => (
                                <th key={i} style={{ textAlign: 'center', padding: '8px 12px', color: '#6b7280', fontWeight: 500, borderBottom: '1px solid #e5e7eb', minWidth: '75px', whiteSpace: 'nowrap' }}>{month}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {cohorts.map((row, index) => (
                            <tr key={index} style={{ background: row.isHeader ? '#f3f3f3' : 'transparent' }}>
                                <td style={{ padding: '8px 12px', borderBottom: '1px solid #f3f3f3', fontWeight: row.isHeader ? 600 : 400, whiteSpace: 'nowrap', position: 'sticky', left: 0, background: row.isHeader ? '#f3f3f3' : 'white' }}>{row.cohort}</td>
                                <td style={{ padding: '8px 12px', textAlign: 'right', borderBottom: '1px solid #f3f3f3', fontWeight: row.isHeader ? 600 : 400, whiteSpace: 'nowrap' }}>{row.customers}</td>
                                <td style={{ padding: '8px 12px', textAlign: 'right', borderBottom: '1px solid #f3f3f3', fontWeight: row.isHeader ? 600 : 400, whiteSpace: 'nowrap' }}>{row.retention}</td>
                                {row.months.map((month, mIndex) => {
                                    const colors = getHeatmapColor(month);
                                    return (
                                        <td key={mIndex} style={{ padding: '8px 12px', textAlign: 'center', background: colors.bg, color: colors.text, borderBottom: '1px solid #f3f3f3', fontWeight: row.isHeader ? 600 : 400, whiteSpace: 'nowrap' }}>{month}</td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </BlockStack>
    );
};

// ============================================
// SESSIONS BY LANDING PAGE COMPONENT (Updated per Image 10)
// ============================================

const SessionsByLandingPage = () => {
    const pages = [
        { label: 'Homepage · /', value: '185', change: '43%', changeType: 'positive' },
        { label: 'Product · /products/lip-stain-50-ayurvedic-herbs-infused', value: '24', change: '118%', changeType: 'positive' },
        { label: 'Product · /products/tinted-lip-oil-with-50-herbs-colour-meets-care', value: '7', change: null, changeType: 'neutral' },
        { label: 'Product · /products/clear-complexion-essence-40-herbs', value: '5', change: '67%', changeType: 'positive' },
        { label: 'Product · /products/buttercream-blush-infused-with-50-ayurvedic-herbs', value: '5', change: null, changeType: 'neutral' },
        { label: 'Collection · /collections/ayurvedic-skin-care-products', value: '4', change: '300%', changeType: 'positive' },
        { label: 'Product · /products/clear-complexion-brightening-elixir-powered-by-50-...', value: '4', change: '33%', changeType: 'critical' },
    ];

    return (
        <BlockStack gap="300">
            <ChartHeading title="Sessions by landing page" />
            <BlockStack gap="0">
                {pages.map((page, index) => (
                    <div
                        key={index}
                        style={{
                            padding: '12px 8px',
                            background: index % 2 === 1 ? '#f7f7f7' : 'transparent',
                            borderRadius: index % 2 === 1 ? '6px' : '0',
                        }}
                    >
                        <InlineStack align="space-between" blockAlign="start" wrap={false}>
                            <div style={{ flex: 1, minWidth: 0, paddingRight: '16px' }}>
                                <Text variant="bodySm" as="p" breakWord>{page.label}</Text>
                            </div>
                            <InlineStack gap="100" blockAlign="center" wrap={false}>
                                <Text variant="bodySm" as="span" fontWeight="medium">{page.value}</Text>
                                {page.change ? (
                                    <Text
                                        variant="bodySm"
                                        as="span"
                                        tone={page.changeType === 'positive' ? 'success' : 'critical'}
                                    >
                                        {page.changeType === 'positive' ? '↗' : '↘'} {page.change}
                                    </Text>
                                ) : (
                                    <Text variant="bodySm" as="span" tone="subdued">—</Text>
                                )}
                            </InlineStack>
                        </InlineStack>
                    </div>
                ))}
            </BlockStack>
        </BlockStack>
    );
};

// ============================================
// SESSIONS BY SOCIAL REFERRER (Updated per Image 11)
// ============================================

const SessionsBySocialReferrer = () => {
    const [hoveredIndex, setHoveredIndex] = useState(null);

    const referrers = [
        { label: 'instagram', value: 161, compare: 249, change: '34%', changeType: 'positive', barWidth: 65 },
        { label: 'facebook', value: 21, compare: 14, change: '200%', changeType: 'positive', barWidth: 8 },
    ];

    return (
        <BlockStack gap="300">
            <ChartHeading title="Sessions by social referrer" />
            <BlockStack gap="300">
                {referrers.map((referrer, index) => (
                    <div
                        key={index}
                        onMouseEnter={() => setHoveredIndex(index)}
                        onMouseLeave={() => setHoveredIndex(null)}
                        style={{
                            opacity: hoveredIndex !== null && hoveredIndex !== index ? 0.4 : 1,
                            transition: 'opacity 0.2s ease'
                        }}
                    >
                        <BlockStack gap="100">
                            <Text variant="bodySm" as="p">{referrer.label}</Text>

                            {/* Main bar */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <div style={{
                                    width: `${referrer.barWidth}%`,
                                    height: '48px',
                                    background: '#12acf0',
                                    borderRadius: '3px',
                                }} />
                                <Text variant="bodySm" as="span" fontWeight="medium">{referrer.value}</Text>
                                <Text variant="bodySm" as="span" tone="success">↗ {referrer.change}</Text>
                            </div>

                            {/* Compare bar */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <div style={{
                                    width: `${(referrer.compare / 249) * 100}%`,
                                    height: '48px',
                                    background: '#9bcdea',
                                    borderRadius: '3px',
                                }} />
                                <Text variant="bodySm" as="span" tone="subdued">{referrer.compare}</Text>
                            </div>
                        </BlockStack>
                    </div>
                ))}
            </BlockStack>
        </BlockStack>
    );
};

// ============================================
// TOTAL SALES BY REFERRER (Updated per Image 11)
// ============================================

const TotalSalesByReferrer = () => {
    const [hoveredIndex, setHoveredIndex] = useState(null);

    const referrers = [
        { label: 'None · None', value: '₹8,432.35', compare: '₹10,940.46', change: '204%', barWidth: 75, compareWidth: 100 },
        { label: 'social · instagram', value: '₹699.00', compare: '₹0.00', change: null, barWidth: 6, compareWidth: 0 },
    ];

    return (
        <BlockStack gap="300">
            <ChartHeading title="Total sales by referrer" />
            <BlockStack gap="300">
                {referrers.map((referrer, index) => (
                    <div
                        key={index}
                        onMouseEnter={() => setHoveredIndex(index)}
                        onMouseLeave={() => setHoveredIndex(null)}
                        style={{
                            opacity: hoveredIndex !== null && hoveredIndex !== index ? 0.4 : 1,
                            transition: 'opacity 0.2s ease'
                        }}
                    >
                        <BlockStack gap="100">
                            <Text variant="bodySm" as="p">{referrer.label}</Text>

                            {/* Main bar */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <div style={{
                                    width: `${referrer.barWidth}%`,
                                    height: '48px',
                                    background: '#12acf0',
                                    borderRadius: '3px',
                                }} />
                                <Text variant="bodySm" as="span" fontWeight="medium">{referrer.value}</Text>
                                {referrer.change ? (
                                    <Text variant="bodySm" as="span" tone="success">↗ {referrer.change}</Text>
                                ) : (
                                    <Text variant="bodySm" as="span" tone="subdued">—</Text>
                                )}
                            </div>

                            {/* Compare bar */}
                            {referrer.compareWidth > 0 && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <div style={{
                                        width: `${referrer.compareWidth}%`,
                                        height: '48px',
                                        background: '#9bcdea',
                                        borderRadius: '3px',
                                    }} />
                                    <Text variant="bodySm" as="span" tone="subdued">{referrer.compare}</Text>
                                </div>
                            )}
                        </BlockStack>
                    </div>
                ))}

                {/* Y-axis line */}
                <div style={{ display: 'flex', alignItems: 'flex-end', height: '20px', marginTop: '8px' }}>
                    <div style={{ width: '2px', height: '100%', background: '#12acf0', marginRight: '8px' }} />
                    <Text variant="bodySm" as="span" tone="subdued">₹0.00</Text>
                </div>
            </BlockStack>
        </BlockStack>
    );
};

// ============================================
// SALES ATTRIBUTED TO MARKETING (Updated per Image 11)
// ============================================

const SalesAttributedToMarketing = () => {
    return (
        <BlockStack gap="300">
            <ChartHeading title="Sales attributed to marketing" />
            <BlockStack gap="200">
                <Text variant="bodySm" as="p">instagram · social</Text>
                <div style={{ position: 'relative' }}>
                    <div style={{
                        width: '80%',
                        height: '140px',
                        background: '#12acf0',
                        borderRadius: '4px',
                    }} />
                    <div style={{ position: 'absolute', right: '0', top: '50%', transform: 'translateY(-50%)' }}>
                        <InlineStack gap="100" blockAlign="center">
                            <Text variant="bodySm" as="span" fontWeight="medium">₹699.00</Text>
                            <Text variant="bodySm" as="span" tone="subdued">—</Text>
                        </InlineStack>
                    </div>
                </div>

                {/* Y-axis indicator */}
                <div style={{ display: 'flex', alignItems: 'flex-end', height: '20px' }}>
                    <div style={{ width: '2px', height: '100%', background: '#12acf0', marginRight: '8px' }} />
                    <Text variant="bodySm" as="span" tone="subdued">₹0.00</Text>
                </div>
            </BlockStack>
        </BlockStack>
    );
};

// ============================================
// SESSIONS BY REFERRER (Updated per Image 12)
// ============================================

const SessionsByReferrer = () => {
    const [hoveredIndex, setHoveredIndex] = useState(null);

    const referrers = [
        { label: 'Social · instagram · Bengaluru', value: 53, compare: 87, change: '15%', changeType: 'positive' },
        { label: 'Direct · None · Falkenstein', value: 49, compare: 1, change: '125%', changeType: 'positive' },
        { label: 'Social · instagram · Mumbai', value: 18, compare: 19, change: '13%', changeType: 'positive' },
        { label: 'Direct · None · Bengaluru', value: 17, compare: 28, change: '100%', changeType: 'positive' },
        { label: 'Social · instagram · None', value: 16, compare: 19, change: null, changeType: 'neutral' },
    ];

    const maxValue = Math.max(...referrers.map(r => Math.max(r.value, r.compare)));

    return (
        <BlockStack gap="300">
            <ChartHeading title="Sessions by referrer" />
            <BlockStack gap="300">
                {referrers.map((referrer, index) => (
                    <div
                        key={index}
                        onMouseEnter={() => setHoveredIndex(index)}
                        onMouseLeave={() => setHoveredIndex(null)}
                        style={{
                            opacity: hoveredIndex !== null && hoveredIndex !== index ? 0.4 : 1,
                            transition: 'opacity 0.2s ease'
                        }}
                    >
                        <BlockStack gap="50">
                            <Text variant="bodySm" as="span">{referrer.label}</Text>

                            {/* Main bar with value */}
                            <InlineStack gap="100" blockAlign="center">
                                <div style={{
                                    height: '10px',
                                    width: `${(referrer.value / maxValue) * 100}%`,
                                    maxWidth: '60%',
                                    background: '#12acf0',
                                    borderRadius: '2px',
                                }} />
                                <Text variant="bodySm" as="span" fontWeight="medium">{referrer.value}</Text>
                                {referrer.change && (
                                    <Text variant="bodySm" as="span" tone="success">↗ {referrer.change}</Text>
                                )}
                            </InlineStack>

                            {/* Compare bar with value */}
                            <InlineStack gap="100" blockAlign="center">
                                <div style={{
                                    height: '10px',
                                    width: `${(referrer.compare / maxValue) * 100}%`,
                                    maxWidth: '60%',
                                    background: '#9bcdea',
                                    borderRadius: '2px',
                                }} />
                                <Text variant="bodySm" as="span" tone="subdued">{referrer.compare}</Text>
                            </InlineStack>
                        </BlockStack>
                    </div>
                ))}
            </BlockStack>
        </BlockStack>
    );
};

// ============================================
// PRODUCTS BY SELL-THROUGH RATE (Updated per Image 12)
// ============================================

const ProductsBySellThroughRate = () => {
    const [hoveredIndex, setHoveredIndex] = useState(null);

    const products = [
        { name: 'Clear Complexion Skin Softener Serum - 50+ herbs infused · 50 m...', rate: '1.05%', compare: '1.04%', change: '1%', changeType: 'positive', barWidth: 100 },
        { name: 'Lip Stain – 50+ Ayurvedic Herbs infused · Pink · None', rate: '0.61%', compare: '0.2%', change: '205%', changeType: 'positive', barWidth: 58 },
        { name: 'Clear Complexion Ayurvedic Body Lotion – Infused with 50+ Rare ...', rate: '0.5%', compare: '0%', change: null, barWidth: 48 },
        { name: 'Clear Complexion Soap – Infused with 50+ Ayurvedic Herbs · 120 ...', rate: '0.42%', compare: '0.42%', change: null, barWidth: 40 },
        { name: 'CLEAR COMPLEXION 15-DAY CHALLENGE - Ayurvedic 50+ Herbs...', rate: '0.21%', compare: '0%', change: null, barWidth: 20 },
    ];

    return (
        <BlockStack gap="300">
            <ChartHeading title="Products by sell-through rate" />
            <BlockStack gap="200">
                {products.map((product, index) => (
                    <div
                        key={index}
                        onMouseEnter={() => setHoveredIndex(index)}
                        onMouseLeave={() => setHoveredIndex(null)}
                        style={{
                            opacity: hoveredIndex !== null && hoveredIndex !== index ? 0.4 : 1,
                            transition: 'opacity 0.2s ease'
                        }}
                    >
                        <div>
                            <Text variant="bodySm" as="p" truncate>{product.name}</Text>

                            {/* Main bar */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                                <div style={{
                                    height: '12px',
                                    width: `${product.barWidth}%`,
                                    maxWidth: '60%',
                                    background: '#12acf0',
                                    borderRadius: '2px',
                                }} />
                                <Text variant="bodySm" as="span" fontWeight="medium">{product.rate}</Text>
                                {product.change ? (
                                    <Text variant="bodySm" as="span" tone="success">↗ {product.change}</Text>
                                ) : (
                                    <Text variant="bodySm" as="span" tone="subdued">—</Text>
                                )}
                            </div>

                            {/* Compare bar */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '1px' }}>
                                <div style={{
                                    height: '12px',
                                    width: `${product.barWidth * 0.9}%`,
                                    maxWidth: '54%',
                                    background: '#9bcdea',
                                    borderRadius: '2px',
                                }} />
                                <Text variant="bodySm" as="span" tone="subdued">{product.compare}</Text>
                            </div>
                        </div>
                    </div>
                ))}
            </BlockStack>
        </BlockStack>
    );
};

// ============================================
// NO DATA PLACEHOLDER COMPONENT
// ============================================

const NoDataPlaceholder = ({ title }) => (
    <BlockStack gap="300">
        <ChartHeading title={title} />
        <div style={{
            height: '150px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#f9f9f9',
            borderRadius: '8px'
        }}>
            <Text variant="bodySm" as="p" tone="subdued">No data for this date range</Text>
        </div>
    </BlockStack>
);

// ============================================
// MAIN ANALYTICS PAGE COMPONENT
// ============================================

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
  max-width: 100%;      /* ADD THIS */
  overflow-x: hidden;   /* ADD THIS */
  box-sizing: border-box; /* ADD THIS */
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
  max-width: 100%;   /* ADD THIS */
  overflow: hidden;  /* ADD THIS */
}
        
.analytics-row-4 {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  min-width: 0;  /* ADD THIS */
}

.analytics-row-2-1 {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 16px;
  min-width: 0;  /* ADD THIS */
}

.analytics-row-3 {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  min-width: 0;  /* ADD THIS */
}
        
        .analytics-card {
          background: white;
          border-radius: 12px;
          padding: 20px;
          border: 1px solid #e3e3e3;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
            overflow: hidden;  /* ADD THIS */
  min-width: 0;      /* ADD THIS */

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