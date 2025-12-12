'use client';

import { useState } from 'react';
import { Text, Icon } from '@shopify/polaris';
import { SearchIcon } from '@shopify/polaris-icons';

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

export default CurrencySelector;

