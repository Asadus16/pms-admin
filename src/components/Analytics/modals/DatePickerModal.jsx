import { useState } from 'react';
import { Text, Button, InlineStack, Badge, Icon } from '@shopify/polaris';
import { ChevronLeftIcon, ChevronRightIcon, ClockIcon } from '@shopify/polaris-icons';

const DatePickerModal = ({ open, onClose, onApply }) => {
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

export default DatePickerModal;

