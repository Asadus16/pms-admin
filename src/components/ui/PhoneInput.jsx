import { useState } from 'react';
import { TextField, InlineStack } from '@shopify/polaris';
import './ui.css';

/**
 * PhoneInput - Phone input with country code selector
 */
const countryCodes = [
  { code: '+1', country: 'US', flag: '🇺🇸' },
  { code: '+91', country: 'IN', flag: '🇮🇳' },
  { code: '+44', country: 'GB', flag: '🇬🇧' },
  { code: '+86', country: 'CN', flag: '🇨🇳' },
  { code: '+81', country: 'JP', flag: '🇯🇵' },
  { code: '+49', country: 'DE', flag: '🇩🇪' },
  { code: '+33', country: 'FR', flag: '🇫🇷' },
  { code: '+61', country: 'AU', flag: '🇦🇺' },
];

export const PhoneInput = ({ 
  value = '',
  onChange,
  label = 'Phone',
  error,
  helpText,
  defaultCountryCode = '+91',
  className = '',
  ...props 
}) => {
  const [countryCode, setCountryCode] = useState(defaultCountryCode);
  const [phoneNumber, setPhoneNumber] = useState(value);

  const handleCountryCodeChange = (code) => {
    setCountryCode(code);
    if (onChange) {
      onChange(`${code}${phoneNumber}`);
    }
  };

  const handlePhoneChange = (newValue) => {
    setPhoneNumber(newValue);
    if (onChange) {
      onChange(`${countryCode}${newValue}`);
    }
  };

  return (
    <div className={`phone-input ${className}`}>
      <TextField
        label={label}
        value={phoneNumber}
        onChange={handlePhoneChange}
        error={error}
        helpText={helpText}
        prefix={
          <select
            value={countryCode}
            onChange={(e) => handleCountryCodeChange(e.target.value)}
            className="phone-input__country-code"
          >
            {countryCodes.map((country) => (
              <option key={country.code} value={country.code}>
                {country.flag} {country.code}
              </option>
            ))}
          </select>
        }
        {...props}
      />
    </div>
  );
};

export default PhoneInput;

