'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  AppProvider,
  Card,
  TextField,
  Button,
  Text,
  BlockStack,
  Select,
  InlineStack,
} from '@shopify/polaris';
import './PropertyManagerSignup.css';

// Country codes for phone input
const countryCodes = [
  { label: 'AE +971', value: '+971' },
  { label: 'US +1', value: '+1' },
  { label: 'UK +44', value: '+44' },
  { label: 'IN +91', value: '+91' },
  { label: 'SA +966', value: '+966' },
  { label: 'QA +974', value: '+974' },
];

// Plan data
const plans = {
  monthly: [
    {
      name: 'Basic',
      price: '$4.50',
      period: '/ month',
      features: [
        '50 Image generations',
        '500 Credits',
        'Monthly 100 Credits Free',
        'Customer Support',
        'Dedicated Server',
        'Priority Generations',
        '50GB Cloud Storage',
      ],
    },
    {
      name: 'Startup',
      price: '$14.50',
      period: '/ month',
      features: [
        '200 Image generations',
        '1200 Credits',
        'Monthly 1000 Credits Free',
        'Customer Support',
        'Dedicated Server',
        'Priority Generations',
        '150GB Cloud Storage',
      ],
    },
    {
      name: 'Enterprise',
      price: '$24.50',
      period: '/ month',
      features: [
        '400 Image generations',
        '2000 Credits',
        'Monthly 1500 Credits Free',
        'Customer Support',
        'Dedicated Server',
        'Priority Generations',
        '500GB Cloud Storage',
      ],
    },
  ],
  yearly: [
    {
      name: 'Basic',
      price: '$45.00',
      period: '/ year',
      features: [
        '50 Image generations',
        '500 Credits',
        'Monthly 100 Credits Free',
        'Customer Support',
        'Dedicated Server',
        'Priority Generations',
        '50GB Cloud Storage',
      ],
    },
    {
      name: 'Startup',
      price: '$145.00',
      period: '/ year',
      features: [
        '200 Image generations',
        '1200 Credits',
        'Monthly 1000 Credits Free',
        'Customer Support',
        'Dedicated Server',
        'Priority Generations',
        '150GB Cloud Storage',
      ],
    },
    {
      name: 'Enterprise',
      price: '$245.00',
      period: '/ year',
      features: [
        '400 Image generations',
        '2000 Credits',
        'Monthly 1500 Credits Free',
        'Customer Support',
        'Dedicated Server',
        'Priority Generations',
        '500GB Cloud Storage',
      ],
    },
  ],
};

const steps = [
  { id: 1, title: 'Account Details' },
  { id: 2, title: 'Company Details' },
  { id: 3, title: 'Plan' },
  { id: 4, title: 'Verify Phone' },
];

function PropertyManagerSignup() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);

  // Account Details state
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // Company Details state
  const [companyName, setCompanyName] = useState('');
  const [companyPhone, setCompanyPhone] = useState('');
  const [companyCountryCode, setCompanyCountryCode] = useState('+971');
  const [companyLogo, setCompanyLogo] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  // Plan state
  const [billingPeriod, setBillingPeriod] = useState('monthly');
  const [selectedPlan, setSelectedPlan] = useState(null);

  // Verify Phone state
  const [verificationCode, setVerificationCode] = useState('');
  const [resendTimer, setResendTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  // Success state
  const [showSuccess, setShowSuccess] = useState(false);

  // Resend timer effect
  useEffect(() => {
    if (currentStep === 4 && resendTimer > 0) {
      const timer = setInterval(() => {
        setResendTimer((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [currentStep, resendTimer]);

  const handleLogoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setCompanyLogo(file);
      const reader = new FileReader();
      reader.onload = (e) => setLogoPreview(e.target?.result);
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setCompanyLogo(file);
      const reader = new FileReader();
      reader.onload = (e) => setLogoPreview(e.target?.result);
      reader.readAsDataURL(file);
    }
  };

  const handleResendCode = () => {
    if (canResend) {
      setResendTimer(60);
      setCanResend(false);
    }
  };

  const handleNextStep = () => {
    // Validate step 1
    if (currentStep === 1) {
      if (password !== confirmPassword) {
        setPasswordError('Passwords do not match');
        return;
      }
      if (password.length < 8) {
        setPasswordError('Password must be at least 8 characters');
        return;
      }
      setPasswordError('');
    }

    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleCompleteSignup = () => {
    setShowSuccess(true);
  };

  const handleSignIn = () => {
    router.push('/property-manager/login');
  };

  const progressPercent = ((currentStep - 1) / (steps.length - 1)) * 100;

  const UploadIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M9 16h6v-6h4l-7-7-7 7h4v6zm-4 2h14v2H5v-2z" fill="#616161"/>
    </svg>
  );

  const CheckIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" fill="currentColor"/>
    </svg>
  );

  const SuccessCheckIcon = () => (
    <svg className="success-checkmark" width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle className="success-circle" cx="12" cy="12" r="10" stroke="#303030" strokeWidth="2" fill="none"/>
      <path className="success-check" d="M7 12l3 3 7-7" stroke="#303030" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <Card padding="600">
            <BlockStack gap="400">
              <Text variant="headingLg" as="h2" fontWeight="bold">
                Create Account
              </Text>

              <TextField
                label="Full Name"
                type="text"
                value={fullName}
                onChange={setFullName}
                placeholder="Enter your full name"
                requiredIndicator
                autoComplete="name"
              />

              <TextField
                label="Email Address"
                type="email"
                value={email}
                onChange={setEmail}
                placeholder="Enter your email"
                requiredIndicator
                autoComplete="email"
              />

              <TextField
                label="Phone Number"
                type="tel"
                inputMode="numeric"
                pattern="[0-9]*"
                value={phone}
                onChange={(val) => setPhone(val.replace(/\D/g, ''))}
                placeholder="Enter your phone number"
                requiredIndicator
                autoComplete="tel"
              />

              <TextField
                label="Password"
                type="password"
                value={password}
                onChange={setPassword}
                placeholder="Create a password"
                requiredIndicator
                autoComplete="new-password"
                helpText="Must be at least 8 characters"
              />

              <TextField
                label="Confirm Password"
                type="password"
                value={confirmPassword}
                onChange={(val) => {
                  setConfirmPassword(val);
                  if (passwordError) setPasswordError('');
                }}
                placeholder="Confirm your password"
                requiredIndicator
                autoComplete="new-password"
                error={passwordError}
              />

              <div className="pm-signup-button">
                <Button onClick={handleNextStep} variant="primary" fullWidth>
                  Continue
                </Button>
              </div>
            </BlockStack>
          </Card>
        );

      case 2:
        return (
          <Card padding="600">
            <BlockStack gap="400">
              <Text variant="headingLg" as="h2" fontWeight="bold">
                Company Details
              </Text>

              <TextField
                label="Company Name"
                type="text"
                value={companyName}
                onChange={setCompanyName}
                placeholder="Enter your company name"
                requiredIndicator
                autoComplete="organization"
              />

              <div className="phone-field-wrapper">
                <Text variant="bodyMd" as="label" fontWeight="medium">
                  Phone <span style={{ color: '#bf0711' }}>*</span>
                </Text>
                <div className="phone-field-group">
                  <div className="country-code-field">
                    <Select
                      label=""
                      labelHidden
                      options={countryCodes}
                      value={companyCountryCode}
                      onChange={setCompanyCountryCode}
                    />
                  </div>
                  <div className="phone-number-field">
                    <TextField
                      label=""
                      labelHidden
                      type="tel"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      value={companyPhone}
                      onChange={(val) => setCompanyPhone(val.replace(/\D/g, ''))}
                      placeholder="Enter your phone number"
                      autoComplete="tel"
                    />
                  </div>
                </div>
              </div>

              <div className="logo-upload-field">
                <Text variant="bodyMd" as="p" fontWeight="medium">
                  Company Logo
                </Text>
                <div
                  className={`logo-upload-area ${isDragging ? 'dragging' : ''} ${logoPreview ? 'has-preview' : ''}`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleLogoUpload}
                    accept="image/svg+xml,image/png,image/jpeg,image/gif"
                    style={{ display: 'none' }}
                  />
                  {logoPreview ? (
                    <img src={logoPreview} alt="Company logo preview" className="logo-preview" />
                  ) : (
                    <>
                      <UploadIcon />
                      <p className="upload-text">
                        <span className="upload-link">Click to upload</span> or drag and drop
                      </p>
                      <p className="upload-hint">SVG, PNG, JPG or GIF (max. 800x400px)</p>
                    </>
                  )}
                </div>
              </div>

              <div className="pm-signup-button">
                <Button onClick={handleNextStep} variant="primary" fullWidth>
                  Next
                </Button>
              </div>

              <button className="back-link" onClick={handlePrevStep}>
                Back to Account Details
              </button>
            </BlockStack>
          </Card>
        );

      case 3:
        return (
          <Card padding="600">
            <BlockStack gap="400">
              <Text variant="headingLg" as="h2" fontWeight="bold" alignment="center">
                Select Your Plan
              </Text>

              <div className="billing-toggle">
                <button
                  className={`billing-option ${billingPeriod === 'monthly' ? 'active' : ''}`}
                  onClick={() => setBillingPeriod('monthly')}
                >
                  Monthly
                </button>
                <button
                  className={`billing-option ${billingPeriod === 'yearly' ? 'active' : ''}`}
                  onClick={() => setBillingPeriod('yearly')}
                >
                  Yearly
                </button>
              </div>

              <div className="plans-grid">
                {plans[billingPeriod].map((plan) => (
                  <div
                    key={plan.name}
                    className={`plan-card ${selectedPlan === plan.name ? 'selected' : ''}`}
                    onClick={() => setSelectedPlan(plan.name)}
                  >
                    <div className="plan-header">
                      <Text variant="headingMd" as="h3" fontWeight="bold">
                        {plan.name}
                      </Text>
                      <div className="plan-price">
                        <span className="price">{plan.price}</span>
                        <span className="period">{plan.period}</span>
                      </div>
                    </div>
                    <ul className="plan-features">
                      {plan.features.map((feature, index) => (
                        <li key={index}>
                          <CheckIcon />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <button className="plan-trial-btn">
                      Free Trial
                    </button>
                  </div>
                ))}
              </div>

              <div className="pm-signup-button">
                <Button
                  onClick={handleNextStep}
                  variant="primary"
                  fullWidth
                  disabled={!selectedPlan}
                >
                  Continue
                </Button>
              </div>

              <button className="back-link" onClick={handlePrevStep}>
                Back to Company Details
              </button>
            </BlockStack>
          </Card>
        );

      case 4:
        return (
          <Card padding="600">
            <BlockStack gap="400">
              <div style={{ textAlign: 'center' }}>
                <Text variant="headingLg" as="h2" fontWeight="bold">
                  Verify Phone
                </Text>
                <Text variant="bodyMd" as="p" tone="subdued">
                  Please Enter the 4 Digit Code Sent To Your Phone
                </Text>
              </div>

              <TextField
                label=""
                labelHidden
                type="text"
                value={verificationCode}
                onChange={(val) => setVerificationCode(val.slice(0, 4))}
                placeholder="Enter Code"
                maxLength={4}
                autoComplete="one-time-code"
              />

              <div style={{ textAlign: 'center' }}>
                <button
                  className={`resend-code-btn ${canResend ? 'active' : ''}`}
                  onClick={handleResendCode}
                  disabled={!canResend}
                >
                  {canResend ? 'Resend Code' : `Resend Code in ${Math.floor(resendTimer / 60)}:${(resendTimer % 60).toString().padStart(2, '0')}`}
                </button>
              </div>

              <div className="pm-signup-button complete-btn">
                <Button onClick={handleCompleteSignup} variant="primary" fullWidth>
                  Complete Sign Up
                </Button>
              </div>

              <button className="back-link" onClick={handlePrevStep}>
                Back to Plan
              </button>
            </BlockStack>
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    <AppProvider i18n={{}}>
      <div className="pm-signup-layout">
        {/* Header */}
        <header className="pm-signup-header">
          <div className="pm-signup-logo">
            <img
              src="/logos/nest-quest.svg"
              alt="Nest Quest"
              style={{ height: '24px', width: 'auto' }}
            />
          </div>
          <div style={{ marginLeft: 'auto' }}>
            <Button
              onClick={() => router.push('/property-manager/login')}
              variant="secondary"
              style={{
                backgroundColor: '#ffffff',
                color: '#202223',
                border: '1px solid #d1d5db'
              }}
            >
              Back to login
            </Button>
          </div>
        </header>

        {/* Main content */}
        <div className="pm-signup-body">
          <div className="pm-signup-main">
            {/* Progress bar */}
            <div className="progress-container">
              <div className="progress-steps">
                {steps.map((step, index) => (
                  <div
                    key={step.id}
                    className={`progress-step ${currentStep >= step.id ? 'active' : ''} ${currentStep > step.id ? 'completed' : ''}`}
                  >
                    <div className="step-number">
                      {currentStep > step.id ? <CheckIcon /> : step.id}
                    </div>
                    <span className="step-title">{step.title}</span>
                  </div>
                ))}
              </div>
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* Form content */}
            <div className="pm-signup-content">
              {showSuccess ? (
                <Card padding="600">
                  <div className="success-container">
                    <SuccessCheckIcon />
                    <Text variant="headingLg" as="h2" fontWeight="bold">
                      Account Created Successfully!
                    </Text>
                    <Text variant="bodyMd" as="p" tone="subdued" alignment="center">
                      Your account has been created. You can now sign in to access your dashboard.
                    </Text>
                    <div className="pm-signup-button" style={{ marginTop: '24px' }}>
                      <Button onClick={handleSignIn} variant="primary" fullWidth>
                        Sign In
                      </Button>
                    </div>
                  </div>
                </Card>
              ) : (
                renderStepContent()
              )}
            </div>
          </div>
        </div>
      </div>
    </AppProvider>
  );
}

export default PropertyManagerSignup;
