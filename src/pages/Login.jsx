import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AppProvider,
  Card,
  TextField,
  BlockStack,
  InlineStack,
  Text,
} from '@shopify/polaris';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState('email'); // 'email' or 'password'
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  const handleEmailLogin = () => {
    if (email) {
      setStep('password');
    }
  };

  const handlePasswordLogin = () => {
    if (password) {
      navigate('/dashboard');
    }
  };

  const handleChangeEmail = () => {
    setStep('email');
    setPassword('');
  };

  const handlePasskeyLogin = () => {
    // handle passkey login
  };

  const handleSocialLogin = (provider) => {
    console.log(`Login with ${provider}`);
  };

  const PasskeyIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2C9.24 2 7 4.24 7 7C7 9.76 9.24 12 12 12C14.76 12 17 9.76 17 7C17 4.24 14.76 2 12 2ZM12 10C10.34 10 9 8.66 9 7C9 5.34 10.34 4 12 4C13.66 4 15 5.34 15 7C15 8.66 13.66 10 12 10Z" fill="currentColor"/>
      <path d="M12 14C7.58 14 4 17.58 4 22H6C6 18.69 8.69 16 12 16C15.31 16 18 18.69 18 22H20C20 17.58 16.42 14 12 14Z" fill="currentColor"/>
    </svg>
  );

  const AppleIcon = () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
    </svg>
  );

  const FacebookIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="#1877F2" xmlns="http://www.w3.org/2000/svg">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  );

  const GoogleIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );

  const EyeIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" fill="#6d7175"/>
    </svg>
  );

  const EyeOffIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z" fill="#6d7175"/>
    </svg>
  );

  return (
    <>
      <style>{`
        .Polaris-TextField__Input,
        input[type="email"],
        input[type="password"],
        input[type="text"],
        .Polaris-TextField input {
          border-radius: 8px !important;
          border: 1px solid #8a8a8a !important;
        }
        .Polaris-TextField__Input:focus,
        .Polaris-TextField input:focus {
          border-color: #8a8a8a !important;
          box-shadow: none !important;
        }
      `}</style>
      <div style={{
        minHeight: '100vh',
        width: '100vw',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        position: 'relative',
        overflow: 'hidden',
        background: '#0a0e27',
      }}>
        {/* Dark base liquid gradient layers */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: `
            radial-gradient(ellipse 90% 60% at 0% 0%, rgba(84, 80, 149, 0.7) 0%, rgba(84, 80, 149, 0.4) 40%, transparent 70%),
            radial-gradient(ellipse 90% 60% at 100% 100%, rgba(37, 111, 107, 0.7) 0%, rgba(37, 111, 107, 0.4) 40%, transparent 70%),
            radial-gradient(ellipse 70% 90% at 25% 30%, rgba(84, 80, 149, 0.5) 0%, transparent 60%),
            radial-gradient(ellipse 80% 70% at 75% 70%, rgba(37, 111, 107, 0.5) 0%, transparent 60%),
            radial-gradient(ellipse 60% 60% at 50% 50%, rgba(84, 80, 149, 0.3) 0%, transparent 70%)
          `,
          filter: 'blur(50px)',
        }} />

        {/* Glassy shine layer */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: `
            radial-gradient(ellipse 150% 100% at 20% 0%, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0.2) 20%, transparent 50%),
            radial-gradient(ellipse 140% 110% at 80% 100%, rgba(255, 255, 255, 0.35) 0%, rgba(255, 255, 255, 0.15) 20%, transparent 50%),
            radial-gradient(ellipse 100% 120% at 40% 40%, rgba(255, 255, 255, 0.25) 0%, transparent 40%),
            radial-gradient(ellipse 110% 100% at 60% 20%, rgba(255, 255, 255, 0.2) 0%, transparent 40%),
            linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, transparent 30%, transparent 70%, rgba(255, 255, 255, 0.12) 100%)
          `,
          backdropFilter: 'blur(120px) saturate(180%)',
          WebkitBackdropFilter: 'blur(120px) saturate(180%)',
          mixBlendMode: 'overlay',
        }} />

        {/* Strong glassy reflection highlights */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: `
            linear-gradient(180deg, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0.1) 15%, transparent 40%, transparent 60%, rgba(255, 255, 255, 0.05) 100%),
            linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.15) 50%, transparent 100%),
            radial-gradient(ellipse at 30% 10%, rgba(255, 255, 255, 0.4) 0%, transparent 45%),
            radial-gradient(ellipse at 70% 90%, rgba(255, 255, 255, 0.3) 0%, transparent 45%)
          `,
          mixBlendMode: 'screen',
          opacity: 0.7,
        }} />

        {/* Liquid flow effect */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: `
            radial-gradient(ellipse 50% 120% at 0% 50%, rgba(84, 80, 149, 0.4) 0%, transparent 60%),
            radial-gradient(ellipse 50% 120% at 100% 50%, rgba(37, 111, 107, 0.4) 0%, transparent 60%),
            radial-gradient(ellipse 120% 50% at 50% 0%, rgba(84, 80, 149, 0.3) 0%, transparent 60%),
            radial-gradient(ellipse 120% 50% at 50% 100%, rgba(37, 111, 107, 0.3) 0%, transparent 60%)
          `,
          filter: 'blur(60px)',
          opacity: 0.6,
        }} />

        {/* Additional glassy shine streaks */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: `
            linear-gradient(135deg, transparent 0%, rgba(255, 255, 255, 0.2) 20%, transparent 40%),
            linear-gradient(225deg, transparent 0%, rgba(255, 255, 255, 0.15) 25%, transparent 50%),
            linear-gradient(45deg, transparent 60%, rgba(255, 255, 255, 0.1) 80%, transparent 100%)
          `,
          mixBlendMode: 'overlay',
          opacity: 0.5,
        }} />

        <AppProvider i18n={{}}>
          <div style={{ width: '100%', maxWidth: '460px', position: 'relative', zIndex: 1 }}>
            <Card padding="1000">
              {step === 'email' ? (
                // EMAIL STEP
                <BlockStack gap="500">
                  {/* Logo */}
                  <div>
                    <img 
                      src="/src/assets/shopify-logo.svg" 
                      alt="Shopify" 
                      style={{ height: '28px', width: 'auto' }}
                    />
                  </div>

                  {/* Header */}
                  <BlockStack gap="100">
                    <Text variant="headingXl" as="h1" fontWeight="semibold">
                      Log in
                    </Text>
                    <Text as="p" tone="subdued">
                      Continue to Shopify
                    </Text>
                  </BlockStack>

                  {/* Email Input */}
                  <BlockStack gap="300">
                    <TextField
                      label="Email"
                      type="email"
                      value={email}
                      onChange={setEmail}
                      autoComplete="email"
                    />

                    {/* Continue with email button */}
                    <div style={{ position: 'relative' }}>
                      <button
                        onClick={handleEmailLogin}
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                        style={{
                          width: '100%',
                          padding: '14px 20px',
                          backgroundColor: '#424242',
                          color: 'white',
                          border: 'none',
                          borderRadius: '8px',
                          fontSize: '14px',
                          fontWeight: '500',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '8px',
                          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                        }}
                      >
                        <span>Continue with email</span>
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          style={{
                            transform: isHovered ? 'translateX(0)' : 'translateX(-10px)',
                            opacity: isHovered ? 1 : 0,
                            transition: 'all 0.3s ease',
                          }}
                        >
                          <path
                            d="M9 18L15 12L9 6"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </button>
                      <div style={{
                        position: 'absolute',
                        right: '-8px',
                        top: '-8px',
                        fontSize: '10px',
                        color: '#616161',
                        background: '#d5ebfe',
                        padding: '0.5px 6px',
                        borderRadius: '12px',
                        fontWeight: '500',
                        border: '0.5px solid white',
                      }}>
                        Last used
                      </div>
                    </div>
                  </BlockStack>

                  {/* Divider */}
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '12px',
                    color: '#616161',
                    fontSize: '14px'
                  }}>
                    <div style={{ flex: 1, height: '1px', background: '#e1e1e1' }} />
                    <span>or</span>
                    <div style={{ flex: 1, height: '1px', background: '#e1e1e1' }} />
                  </div>

                  {/* Passkey Button */}
                  <button
                    onClick={handlePasskeyLogin}
                    style={{
                      width: '100%',
                      padding: '10px 20px',
                      backgroundColor: '#f1f1f1',
                      color: '#303030',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: '500',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                    }}
                  >
                    <PasskeyIcon />
                    <span>Sign in with passkey</span>
                  </button>

                  {/* Social Login Buttons */}
                  <InlineStack gap="300" align="center">
                    <button
                      onClick={() => handleSocialLogin('apple')}
                      style={{
                        flex: 1,
                        padding: '8px',
                        border: 'none',
                        borderRadius: '8px',
                        background: '#f1f1f1',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <AppleIcon />
                    </button>
                    <button
                      onClick={() => handleSocialLogin('facebook')}
                      style={{
                        flex: 1,
                        padding: '8px',
                        border: 'none',
                        borderRadius: '8px',
                        background: '#f1f1f1',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <FacebookIcon />
                    </button>
                    <button
                      onClick={() => handleSocialLogin('google')}
                      style={{
                        flex: 1,
                        padding: '8px',
                        border: 'none',
                        borderRadius: '8px',
                        background: '#f1f1f1',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <GoogleIcon />
                    </button>
                  </InlineStack>

                  {/* Get Started Link */}
                  <div>
                    <Text as="span" variant="bodyMd">
                      New to Shopify?{' '}
                      <a href="#" style={{ color: '#005bd3', textDecoration: 'none', fontWeight: '500' }}>
                        Get started →
                      </a>
                    </Text>
                  </div>

                  {/* Footer Links */}
                  <InlineStack gap="300" align="start">
                    <a href="#" style={{ color: '#616161', textDecoration: 'none', fontSize: '13px' }}>
                      Help
                    </a>
                    <a href="#" style={{ color: '#616161', textDecoration: 'none', fontSize: '13px' }}>
                      Privacy
                    </a>
                    <a href="#" style={{ color: '#616161', textDecoration: 'none', fontSize: '13px' }}>
                      Terms
                    </a>
                  </InlineStack>
                </BlockStack>
              ) : (
                // PASSWORD STEP
                <BlockStack gap="500">
                  {/* Logo */}
                  <div>
                    <img 
                      src="/src/assets/shopify-logo.svg" 
                      alt="Shopify" 
                      style={{ height: '28px', width: 'auto' }}
                    />
                  </div>

                  {/* Header */}
                  <BlockStack gap="100">
                    <Text variant="headingXl" as="h1" fontWeight="semibold">
                      Log in
                    </Text>
                    <Text as="p" tone="subdued">
                      Continue to Shopify
                    </Text>
                  </BlockStack>

                  {/* Email Display */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '14px 16px',
                    border: '1px solid #8a8a8a',
                    borderRadius: '8px',
                    backgroundColor: '#fff',
                  }}>
                    <span style={{ color: '#303030', fontSize: '14px' }}>{email}</span>
                    <button
                      onClick={handleChangeEmail}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#005bd3',
                        fontSize: '14px',
                        fontWeight: '500',
                        cursor: 'pointer',
                        padding: 0,
                      }}
                    >
                      Change email
                    </button>
                  </div>

                  {/* Password Input */}
                  <BlockStack gap="200">
                    <div style={{ position: 'relative' }}>
                      <TextField
                        label="Password"
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={setPassword}
                        autoComplete="current-password"
                      />
                      <button
                        onClick={() => setShowPassword(!showPassword)}
                        style={{
                          position: 'absolute',
                          right: '12px',
                          top: '36px',
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          padding: '4px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                      </button>
                    </div>
                    <a 
                      href="#" 
                      style={{ 
                        color: '#005bd3', 
                        textDecoration: 'none', 
                        fontSize: '14px',
                        fontWeight: '400',
                      }}
                    >
                      Forgot password?
                    </a>
                  </BlockStack>

                  {/* Log in Button */}
                  <button
                    onClick={handlePasswordLogin}
                    style={{
                      width: '100%',
                      padding: '14px 20px',
                      backgroundColor: '#424242',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: '500',
                      cursor: 'pointer',
                    }}
                  >
                    Log in
                  </button>

                  {/* Footer Links */}
                  <InlineStack gap="300" align="start">
                    <a href="#" style={{ color: '#616161', textDecoration: 'none', fontSize: '13px' }}>
                      Help
                    </a>
                    <a href="#" style={{ color: '#616161', textDecoration: 'none', fontSize: '13px' }}>
                      Privacy
                    </a>
                    <a href="#" style={{ color: '#616161', textDecoration: 'none', fontSize: '13px' }}>
                      Terms
                    </a>
                  </InlineStack>
                </BlockStack>
              )}
            </Card>
          </div>
        </AppProvider>
      </div>
    </>
  );
}

export default Login;