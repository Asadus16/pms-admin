'use client';

import { useState } from 'react';
import { Text, Button, Icon } from '@shopify/polaris';
import { ChevronLeftIcon, ChevronRightIcon, ChevronDownIcon, ClockIcon } from '@shopify/polaris-icons';

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

export default ComparisonDatePickerModal;

