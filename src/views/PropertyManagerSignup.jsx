'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store';
import { selectIsAuthenticated, selectCurrentRole, setAuthenticated } from '@/store/slices/authSlice';
import { sendSignupOtp as sendSignupOtpThunk, verifySignupOtp as verifySignupOtpThunk } from '@/store/thunks';
import { ROLE_DASHBOARD_PATHS } from '@/lib/constants/roles';
import {
  AppProvider,
  Card,
  TextField,
  Button,
  Text,
  BlockStack,
  Select,
  InlineStack,
  Banner,
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
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const currentRole = useAppSelector(selectCurrentRole);
  const dispatch = useAppDispatch();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && currentRole) {
      const dashboardPath = ROLE_DASHBOARD_PATHS[currentRole];
      router.push(dashboardPath);
    }
  }, [isAuthenticated, currentRole, router]);

  // Account Details state
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

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

  // Validation functions
  const validateName = (name) => {
    if (!name) return 'Name is required';
    if (name.length < 2) return 'Name must be at least 2 characters';
    return '';
  };

  const validateEmail = (email) => {
    if (!email) return 'Email is required';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return 'Please enter a valid email address';
    return '';
  };

  const validatePassword = (password) => {
    if (!password) return 'Password is required';
    if (password.length < 8) return 'Password must be at least 8 characters';
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) return 'Password must contain one special character';
    return '';
  };

  const validatePhone = (phone) => {
    if (!phone) return 'Phone number is required';
    return '';
  };

  const validateCompanyName = (name) => {
    if (!name) return 'Company name is required';
    return '';
  };

  // Password requirements
  const passwordRequirements = {
    length: password.length >= 8,
    special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  };

  // Form validation
  const isFormValid = () => {
    if (currentStep === 1) {
      return (
        fullName &&
        email &&
        password &&
        confirmPassword &&
        password === confirmPassword &&
        passwordRequirements.length &&
        passwordRequirements.special &&
        !errors.name &&
        !errors.email &&
        !errors.password &&
        !errors.password_confirmation
      );
    }
    if (currentStep === 2) {
      return (
        companyName &&
        companyPhone &&
        !errors.companyName &&
        !errors.phone
      );
    }
    if (currentStep === 3) {
      return selectedPlan;
    }
    if (currentStep === 4) {
      return verificationCode && verificationCode.length === 4;
    }
    return false;
  };

  const handleResendCode = async () => {
    if (!canResend) return;

    if (!companyPhone) {
      setErrors({ ...errors, phone: 'Phone number is required' });
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const fullPhone = `${companyCountryCode}${companyPhone}`;
      const signupData = {
        name: fullName,
        email,
        password,
        password_confirmation: confirmPassword,
        phone: fullPhone,
        company_name: companyName,
        ...(companyLogo && { company_logo: companyLogo }),
        ...(selectedPlan && { plan: selectedPlan }),
        ...(billingPeriod && { billing_interval: billingPeriod }),
      };

      const result = await dispatch(sendSignupOtpThunk({ 
        role: 'property-manager', 
        userData: signupData 
      }));
      
      if (!sendSignupOtpThunk.fulfilled.match(result)) {
        throw result.error || new Error('Failed to send signup OTP');
      }
      setResendTimer(60);
      setCanResend(false);
    } catch (error) {
      if (error?.validationErrors) {
        const newErrors = {};
        if (error.validationErrors.phone) {
          newErrors.phone = error.validationErrors.phone[0];
        } else if (error.validationErrors.message) {
          newErrors.phone = error.validationErrors.message[0];
        } else {
          newErrors.phone = error?.message || 'Failed to resend OTP. Please try again.';
        }
        setErrors({ ...errors, ...newErrors });
      } else {
        setErrors({ ...errors, phone: error?.message || 'Failed to resend OTP. Please try again.' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleNextStep = async () => {
    setErrors({});

    // Step 1: Account Details
    if (currentStep === 1) {
      const nameError = validateName(fullName);
      const emailError = validateEmail(email);
      const passwordError = validatePassword(password);
      let passwordConfirmationError = '';

      if (!confirmPassword) {
        passwordConfirmationError = 'Please confirm your password';
      } else if (password !== confirmPassword) {
        passwordConfirmationError = 'Passwords do not match';
      }

      if (nameError || emailError || passwordError || passwordConfirmationError) {
        setErrors({
          name: nameError,
          email: emailError,
          password: passwordError,
          password_confirmation: passwordConfirmationError,
        });
        return;
      }

      setCurrentStep(2);
      return;
    }

    // Step 2: Company Details
    if (currentStep === 2) {
      const companyNameError = validateCompanyName(companyName);
      const phoneError = validatePhone(companyPhone);

      if (companyNameError || phoneError) {
        setErrors({
          companyName: companyNameError,
          phone: phoneError,
        });
        return;
      }

      setCurrentStep(3);
      return;
    }

    // Step 3: Plan Selection - Send OTP
    if (currentStep === 3) {
      if (!selectedPlan) {
        return;
      }

      setIsLoading(true);
      setErrors({});

      try {
        const fullPhone = `${companyCountryCode}${companyPhone}`;
        const signupData = {
          name: fullName,
          email,
          password,
          password_confirmation: confirmPassword,
          phone: fullPhone,
          company_name: companyName,
          ...(companyLogo && { company_logo: companyLogo }),
          ...(selectedPlan && { plan: selectedPlan }),
          ...(billingPeriod && { billing_interval: billingPeriod }),
        };

        const result = await dispatch(sendSignupOtpThunk({ 
        role: 'property-manager', 
        userData: signupData 
      }));
      
      if (!sendSignupOtpThunk.fulfilled.match(result)) {
        throw result.error || new Error('Failed to send signup OTP');
      }
        setCurrentStep(4);
      } catch (error) {
        if (error?.validationErrors) {
          const newErrors = {};
          if (error.validationErrors.phone) {
            newErrors.phone = error.validationErrors.phone[0];
          } else if (error.validationErrors.name) {
            newErrors.name = error.validationErrors.name[0];
          } else if (error.validationErrors.email) {
            newErrors.email = error.validationErrors.email[0];
          } else if (error.validationErrors.password) {
            newErrors.password = error.validationErrors.password[0];
          } else if (error.validationErrors.company_name) {
            newErrors.companyName = error.validationErrors.company_name[0];
          } else if (error.validationErrors.message) {
            newErrors.phone = error.validationErrors.message[0];
          } else {
            newErrors.phone = error?.message || 'Failed to send OTP. Please try again.';
          }
          setErrors(newErrors);
        } else {
          setErrors({ phone: error?.message || 'Failed to send OTP. Please try again.' });
        }
      } finally {
        setIsLoading(false);
      }
      return;
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setErrors({});
    }
  };

  const handleCompleteSignup = async () => {
    if (!verificationCode || verificationCode.length !== 4) {
      setErrors({ verificationCode: 'Please enter a valid 4-digit code' });
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const fullPhone = `${companyCountryCode}${companyPhone}`;
      const result = await dispatch(verifySignupOtpThunk({ 
        role: 'property-manager', 
        phone: fullPhone, 
        otp: verificationCode 
      }));
      
      if (verifySignupOtpThunk.fulfilled.match(result)) {
        const { response } = result.payload;
        const token = response?.token || response?.data?.token;
        const user = response?.user || response?.data?.user;
        
        if (token) {
          dispatch(setAuthenticated({ 
            userData: user || {}, 
            token, 
            role: 'property-manager' 
          }));
          // Registration successful - redirect to dashboard
          router.push('/property-manager/dashboard');
        } else {
          throw new Error('Registration failed: No token received');
        }
      } else {
        throw result.error || new Error('OTP verification failed');
      }
    } catch (error) {
      if (error?.validationErrors) {
        if (error.validationErrors.verification_code || error.validationErrors.otp) {
          setErrors({
            verificationCode: (error.validationErrors.verification_code || error.validationErrors.otp)[0],
          });
        } else if (error.validationErrors.phone) {
          setErrors({ verificationCode: error.validationErrors.phone[0] });
        } else if (error.validationErrors.message) {
          setErrors({ verificationCode: error.validationErrors.message[0] });
        } else {
          setErrors({ verificationCode: error?.message || 'Invalid OTP. Please try again.' });
        }
      } else {
        setErrors({ verificationCode: error?.message || 'Invalid OTP. Please try again.' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const progressPercent = ((currentStep - 1) / (steps.length - 1)) * 100;

  const UploadIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M9 16h6v-6h4l-7-7-7 7h4v6zm-4 2h14v2H5v-2z" fill="#616161" />
    </svg>
  );

  const CheckIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" fill="currentColor" />
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

              {errors.name && (
                <Banner status="critical">{errors.name}</Banner>
              )}
              {errors.email && (
                <Banner status="critical">{errors.email}</Banner>
              )}
              {errors.password && (
                <Banner status="critical">{errors.password}</Banner>
              )}
              {errors.password_confirmation && (
                <Banner status="critical">{errors.password_confirmation}</Banner>
              )}

              <TextField
                label="Full Name"
                type="text"
                value={fullName}
                onChange={(val) => {
                  setFullName(val);
                  if (errors.name) {
                    const error = validateName(val);
                    setErrors({ ...errors, name: error });
                  }
                }}
                placeholder="Enter your full name"
                requiredIndicator
                autoComplete="name"
                error={errors.name}
              />

              <TextField
                label="Email Address"
                type="email"
                value={email}
                onChange={(val) => {
                  setEmail(val);
                  if (errors.email) {
                    const error = validateEmail(val);
                    setErrors({ ...errors, email: error });
                  }
                }}
                placeholder="Enter your email"
                requiredIndicator
                autoComplete="email"
                error={errors.email}
              />

              <TextField
                label="Password"
                type="password"
                value={password}
                onChange={(val) => {
                  setPassword(val);
                  if (errors.password) {
                    const error = validatePassword(val);
                    setErrors({ ...errors, password: error });
                  }
                }}
                placeholder="Create a password"
                requiredIndicator
                autoComplete="new-password"
                helpText="Must be at least 8 characters with one special character"
                error={errors.password}
              />

              <TextField
                label="Confirm Password"
                type="password"
                value={confirmPassword}
                onChange={(val) => {
                  setConfirmPassword(val);
                  if (errors.password_confirmation) {
                    const error = password !== val ? 'Passwords do not match' : '';
                    setErrors({ ...errors, password_confirmation: error });
                  }
                }}
                placeholder="Confirm your password"
                requiredIndicator
                autoComplete="new-password"
                error={errors.password_confirmation}
              />

              <div className="pm-signup-button">
                <Button
                  onClick={handleNextStep}
                  variant="primary"
                  fullWidth
                  loading={isLoading}
                  disabled={!isFormValid()}
                >
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

              {errors.companyName && (
                <Banner status="critical">{errors.companyName}</Banner>
              )}
              {errors.phone && (
                <Banner status="critical">{errors.phone}</Banner>
              )}

              <TextField
                label="Company Name"
                type="text"
                value={companyName}
                onChange={(val) => {
                  setCompanyName(val);
                  if (errors.companyName) {
                    const error = validateCompanyName(val);
                    setErrors({ ...errors, companyName: error });
                  }
                }}
                placeholder="Enter your company name"
                requiredIndicator
                autoComplete="organization"
                error={errors.companyName}
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
                      onChange={(val) => {
                        setCompanyPhone(val.replace(/\D/g, ''));
                        if (errors.phone) {
                          const error = validatePhone(val.replace(/\D/g, ''));
                          setErrors({ ...errors, phone: error });
                        }
                      }}
                      placeholder="Enter your phone number"
                      autoComplete="tel"
                      error={errors.phone}
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
                <Button
                  onClick={handleNextStep}
                  variant="primary"
                  fullWidth
                  loading={isLoading}
                  disabled={!isFormValid()}
                >
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
                  loading={isLoading}
                  disabled={!isFormValid()}
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

              {errors.verificationCode && (
                <Banner status="critical">{errors.verificationCode}</Banner>
              )}

              <TextField
                label=""
                labelHidden
                type="text"
                value={verificationCode}
                onChange={(val) => {
                  setVerificationCode(val.slice(0, 4));
                  if (errors.verificationCode) {
                    setErrors({ ...errors, verificationCode: '' });
                  }
                }}
                placeholder="Enter Code"
                maxLength={4}
                autoComplete="one-time-code"
                error={errors.verificationCode}
              />

              <div style={{ textAlign: 'center' }}>
                <button
                  className={`resend-code-btn ${canResend ? 'active' : ''}`}
                  onClick={handleResendCode}
                  disabled={!canResend || isLoading}
                >
                  {canResend ? 'Resend Code' : `Resend Code in ${Math.floor(resendTimer / 60)}:${(resendTimer % 60).toString().padStart(2, '0')}`}
                </button>
              </div>

              <div className="pm-signup-button complete-btn">
                <Button
                  onClick={handleCompleteSignup}
                  variant="primary"
                  fullWidth
                  loading={isLoading}
                  disabled={!isFormValid()}
                >
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
              {renderStepContent()}
            </div>
          </div>
        </div>
      </div>
    </AppProvider>
  );
}

export default PropertyManagerSignup;
