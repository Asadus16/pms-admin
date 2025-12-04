import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    AppProvider,
    Card,
    TextField,
    BlockStack,
    InlineStack,
    Text,
    Button,
    Icon,

} from '@shopify/polaris';
import { ChevronRightIcon, ViewIcon, HideIcon } from '@shopify/polaris-icons';

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
            <path d="M12 2C9.24 2 7 4.24 7 7C7 9.76 9.24 12 12 12C14.76 12 17 9.76 17 7C17 4.24 14.76 2 12 2ZM12 10C10.34 10 9 8.66 9 7C9 5.34 10.34 4 12 4C13.66 4 15 5.34 15 7C15 8.66 13.66 10 12 10Z" fill="currentColor" />
            <path d="M12 14C7.58 14 4 17.58 4 22H6C6 18.69 8.69 16 12 16C15.31 16 18 18.69 18 22H20C20 17.58 16.42 14 12 14Z" fill="currentColor" />
        </svg>
    );

    const AppleIcon = () => (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="#616161" xmlns="http://www.w3.org/2000/svg">
            <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
        </svg>
    );

    const FacebookIcon = () => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="#1877F2" xmlns="http://www.w3.org/2000/svg">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
    );

    const GoogleIcon = () => (
        <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
        </svg>
    );

    const EyeIcon = () => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" fill="#6d7175" />
        </svg>
    );

    const EyeOffIcon = () => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z" fill="#6d7175" />
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
          height: 36px !important;
          padding: 10px 16px !important;
        }
        .Polaris-TextField__Input:focus,
        .Polaris-TextField input:focus {
          border-color: #8a8a8a !important;
          box-shadow: none !important;
        }
        .continue-email-button .Polaris-Button {
          background-color: #424242 !important;
          padding: 14px 20px !important;
          height: auto !important;
          min-height: auto !important;
          font-size: 14px !important;
          font-weight: 500 !important;
          display: flex !important;
          justify-content: center !important;
          align-items: center !important;
          
        }
        .continue-email-button .Polaris-Button span,
        .continue-email-button .Polaris-Button .Polaris-InlineStack span {
          font-size: 14px !important;
          font-weight: 500 !important;
        }
        .continue-email-button .Polaris-Button:hover {
          background-color: #4a4a4a !important;
        }
        .continue-email-button .Polaris-Button:active {
          background-color: #3a3a3a !important;
        }
        .continue-email-button {
          position: relative;
        }
        .continue-email-button .Polaris-Button .Polaris-InlineStack {
          justify-content: center !important;
          width: 100% !important;
        }
        .continue-email-button .Polaris-Button .Polaris-InlineStack {
          justify-content: center !important;
          align-items: center !important;
          width: 100% !important;
          margin: 0 auto !important;
        }
.continue-email-button .button-arrow {
  position: absolute;
  left: calc(50% + 70px);
  top: 50%;
  transform: translateY(-50%);
  transition: opacity 0.3s ease, transform 0.3s ease;
  opacity: 0;
  pointer-events: none;
  color: white;
  display: flex;
  align-items: center;
}

.continue-email-button:hover .button-arrow {
  opacity: 1;
  transform: translateY(-50%) translateX(4px);
}
        .continue-email-button .Polaris-Button {
          text-align: center !important;
           
        }
        .login-button-wrapper .Polaris-Button {
          background-color: #424242 !important;
          padding: 14px 20px !important;
          height: auto !important;
          min-height: auto !important;
          font-size: 14px !important;
          font-weight: 500 !important;
        }
        .login-button-wrapper .Polaris-Button:hover {
          background-color: #4a4a4a !important;
        }
        .login-button-wrapper .Polaris-Button:active {
          background-color: #3a3a3a !important;
        }
        .passkey-button:active,
        .social-button:active {
          background-color: #d1d1d1 !important;
        }
        .footer-link:hover {
          text-decoration: underline !important;
        }
        .footer-links-container {
          padding-top: 16px !important;
          padding-bottom: 16px !important;
          margin-top: 16px !important;
        }
        /* Target all possible Polaris Card/Box elements */
        .login-card-container .Polaris-Card,
        .login-card-container .Polaris-Card > div,
        .login-card-container .Polaris-Card > .Polaris-Box,
        .login-card-container .Polaris-Box,
        .login-card-container [class*="Polaris-Box"],
        .login-card-container *[class*="Polaris-Box"] {
          box-sizing: border-box !important;
        }
        /* Email step - 588px height */
        .login-card-container.email-step .Polaris-Card,
        .login-card-container.email-step .Polaris-Card > div,
        .login-card-container.email-step .Polaris-Card > .Polaris-Box,
        .login-card-container.email-step .Polaris-Box {
          height: 588px !important;
          min-height: 588px !important;
          max-height: 588px !important;
        }
        /* Password step - 500px height */
        .login-card-container.password-step .Polaris-Card,
        .login-card-container.password-step .Polaris-Card > div,
        .login-card-container.password-step .Polaris-Card > .Polaris-Box,
        .login-card-container.password-step .Polaris-Box {
          height: 500px !important;
          min-height: 500px !important;
          max-height: 500px !important;
        }
        /* Even more specific - target any Box inside Card */
        .login-card-container .Polaris-Card .Polaris-Box,
        .login-card-container .Polaris-Card > .Polaris-Box,
        .login-card-container .Polaris-Card div.Polaris-Box {
        }
        .login-card-container .Polaris-Card__Section {
          flex: 1 !important;
          display: flex !important;
          flex-direction: column !important;
        }
          .login-card-container .Polaris-Card > .Polaris-Box {
            display: flex !important;
            flex-direction: column !important;
            }

            .login-card-container .Polaris-Card .Polaris-BlockStack {
            flex: 1 !important;
            display: flex !important;
            flex-direction: column !important;
            }

        .footer-links-container {
          margin-top: auto !important;
          padding-bottom: 24px !important;
        }
        .continue-to-shopify-text,
        .continue-to-shopify-text .Polaris-Text,
        .continue-to-shopify-text p,
        .continue-to-shopify-text span,
        .login-card-container .continue-to-shopify-text,
        .login-card-container .continue-to-shopify-text * {
          font-size: 14px !important;
        }
          .login-card-container .Polaris-TextField {
  overflow: visible !important;
}
.login-card-container .Polaris-TextField__Backdrop {
  overflow: visible !important;
}
  .login-card-container .Polaris-TextField__Suffix {
  position: absolute !important;
  right: 12px !important;
  top: 50% !important;
  transform: translateY(-50%) !important;
  background: transparent !important;
  border: none !important;
  margin: 0 !important;
  padding: 0 !important;
}

.login-card-container .Polaris-TextField--hasValue .Polaris-TextField__Suffix,
.login-card-container .Polaris-TextField .Polaris-TextField__Suffix {
  border-left: none !important;
}

.login-card-container .Polaris-TextField__Input {
  padding-right: 40px !important;
}

/* Mobile responsive styles */
@media (max-width: 768px) {
  /* Make the entire page white */
  .login-page-container {
    background: #ffffff !important;
    padding: 0 !important;
    padding-top: 40px !important;
    align-items: flex-start !important;
    min-height: 100vh !important;
    height: auto !important;
  }
  
  /* Hide all background gradient layers */
  .login-bg-gradient-1,
  .login-bg-gradient-2,
  .login-bg-gradient-3,
  .login-bg-noise {
    display: none !important;
  }
  
  .login-card-container {
    width: 100% !important;
    height: auto !important;
    min-height: auto !important;
    max-width: 100% !important;
    margin: 0 !important;
    padding: 0 !important;
  }
  
  /* Override the fixed heights for mobile */
  .login-card-container.email-step,
  .login-card-container.password-step {
    height: auto !important;
    min-height: auto !important;
    max-height: none !important;
  }
  
  /* NUCLEAR OPTION - Remove ALL borders from everything inside login-card-container */
  .login-card-container *,
  .login-card-container *::before,
  .login-card-container *::after {
    border: none !important;
    border-top: none !important;
    border-bottom: none !important;
    border-left: none !important;
    border-right: none !important;
    box-shadow: none !important;
    outline: none !important;
  }
  
  .login-card-container .Polaris-Card {
    width: 100% !important;
    height: auto !important;
    min-height: auto !important;
    max-height: none !important;
    max-width: 100% !important;
    border-radius: 0 !important;
    margin: 0 !important;
    padding: 0 !important;
    background: #ffffff !important;
  }
  
  /* Explicitly target the Box padding wrapper */
  .login-card-container .Polaris-Card > .Polaris-Box,
  .login-card-container .Polaris-Card > div,
  .login-card-container .Polaris-Card > div > div {
    background: #ffffff !important;
    border: none !important;
    box-shadow: none !important;
  }
  
  /* Footer links container - position at bottom left on mobile */
  .footer-links-container {
    position: fixed !important;
    bottom: 16px !important;
    left: 16px !important;
    margin: 0 !important;
    padding: 0 !important;
    z-index: 10 !important;
    display: block !important;
    background: transparent !important;
  }
  
  .footer-links-container .Polaris-InlineStack {
    margin-bottom: 0 !important;
  }
  
  /* Override the fixed heights */
  .login-card-container.email-step .Polaris-Card,
  .login-card-container.email-step .Polaris-Box,
  .login-card-container.password-step .Polaris-Card,
  .login-card-container.password-step .Polaris-Box {
    height: auto !important;
    min-height: auto !important;
    max-height: none !important;
    background: #ffffff !important;
  }
  
  /* BlockStack */
  .login-card-container .Polaris-BlockStack {
    height: auto !important;
    min-height: auto !important;
    max-height: none !important;
  }
  
  /* Hide mobile spacer */
  .mobile-padding-spacer {
    display: none !important;
  }
  
  /* Re-add borders ONLY for input fields */
  .login-card-container .Polaris-TextField__Input,
  .login-card-container input[type="email"],
  .login-card-container input[type="password"],
  .login-card-container input[type="text"] {
    border: 1px solid #8a8a8a !important;
  }
}
      `}</style>

            {/* SVG Noise Filter Definition */}
            <svg style={{ position: 'absolute', width: 0, height: 0 }}>
                <defs>
                    <filter id="noise">
                        <feTurbulence
                            type="fractalNoise"
                            baseFrequency="0.80"
                            numOctaves="4"
                            stitchTiles="stitch"
                        />
                        <feColorMatrix type="saturate" values="0" />
                    </filter>
                </defs>
            </svg>

            <div className="login-page-container" style={{
                minHeight: '100vh',
                width: '100vw',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '20px',
                position: 'relative',
                overflow: 'hidden',
                background: '#1a1a2e',
            }}>
                {/* Main gradient background - matching Shopify colors */}
                <div className="login-bg-gradient-1" style={{
                    position: 'absolute',
                    inset: 0,
                    background: `
            radial-gradient(ellipse 80% 80% at 0% 0%, rgba(123, 97, 255, 0.9) 0%, rgba(90, 70, 180, 0.6) 40%, transparent 70%),
            radial-gradient(ellipse 80% 80% at 100% 100%, rgba(45, 180, 180, 0.85) 0%, rgba(35, 140, 140, 0.5) 40%, transparent 70%),
            radial-gradient(ellipse 60% 80% at 20% 80%, rgba(90, 70, 180, 0.5) 0%, transparent 60%),
            radial-gradient(ellipse 60% 80% at 80% 20%, rgba(60, 190, 190, 0.5) 0%, transparent 60%),
            radial-gradient(ellipse 100% 100% at 50% 50%, rgba(80, 60, 150, 0.4) 0%, transparent 70%)
          `,
                    filter: 'blur(40px)',
                }} />

                {/* Secondary gradient layer for smoother blending */}
                <div className="login-bg-gradient-2" style={{
                    position: 'absolute',
                    inset: 0,
                    background: `
            linear-gradient(135deg, 
              rgba(107, 78, 194, 0.8) 0%, 
              rgba(75, 100, 160, 0.6) 25%,
              rgba(50, 130, 150, 0.5) 50%,
              rgba(45, 160, 160, 0.7) 75%,
              rgba(40, 170, 170, 0.8) 100%
            )
          `,
                    opacity: 0.7,
                }} />

                {/* Subtle color variations */}
                <div className="login-bg-gradient-3" style={{
                    position: 'absolute',
                    inset: 0,
                    background: `
            radial-gradient(ellipse 50% 50% at 30% 30%, rgba(130, 100, 220, 0.4) 0%, transparent 50%),
            radial-gradient(ellipse 50% 50% at 70% 70%, rgba(50, 180, 170, 0.4) 0%, transparent 50%),
            radial-gradient(ellipse 40% 40% at 10% 60%, rgba(100, 80, 180, 0.3) 0%, transparent 50%),
            radial-gradient(ellipse 40% 40% at 90% 40%, rgba(55, 165, 160, 0.3) 0%, transparent 50%)
          `,
                }} />

                {/* Noise overlay */}
                <div className="login-bg-noise" style={{
                    position: 'absolute',
                    inset: 0,
                    opacity: 0.035,
                    filter: 'url(#noise)',
                    pointerEvents: 'none',
                }} />

                {/* Alternative noise using background image (more reliable) */}
                <div className="login-bg-noise" style={{
                    position: 'absolute',
                    inset: 0,
                    opacity: 0.15,
                    mixBlendMode: 'overlay',
                    pointerEvents: 'none',
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                }} />

                <AppProvider i18n={{}}>
                    <div className={`login-card-container ${step === 'email' ? 'email-step' : 'password-step'}`} style={{
                        width: '476px',
                        height: step === 'email' ? '588px' : '500px',
                        position: 'relative',
                        zIndex: 1
                    }}>
                        <Card padding="1000" style={{ height: step === 'email' ? '588px' : '500px', minHeight: step === 'email' ? '588px' : '500px', maxHeight: step === 'email' ? '588px' : '500px' }}>
                            {step === 'email' ? (
                                // EMAIL STEP
                                <BlockStack gap="500">
                                    {/* Spacer for mobile padding-top */}
                                    <div className="mobile-padding-spacer" style={{ display: 'none' }}></div>

                                    {/* Logo */}
                                    <div className="login-logo-container-mobile" style={{ paddingTop: '1px', paddingBottom: '8px' }}>
                                        <img
                                            src="/logos/shopify-logo.svg"
                                            alt="Shopify"
                                            style={{ height: '26px', width: 'auto' }}
                                        />
                                    </div>

                                    {/* Header */}
                                    <BlockStack gap="100">
                                        <Text variant="headingXl" as="h1" fontWeight="bold">
                                            Log in
                                        </Text>
                                        <p style={{ fontSize: '14px', color: '#6d7175', margin: 0 }}>
                                            Continue to Shopify
                                        </p>
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
                                        <div style={{ position: 'relative' }} className="continue-email-button">
                                            <Button
                                                onClick={handleEmailLogin}
                                                fullWidth
                                                variant="primary"
                                            >
                                                <span>Continue with email</span>
                                            </Button>
                                            {/* Arrow moved outside the Button */}
                                            <span className="button-arrow">
                                                <Icon source={ChevronRightIcon} />
                                            </span>
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

                                    {/* Passkey and Social Buttons */}
                                    <BlockStack gap="200">
                                        {/* Passkey Button */}
                                        <button
                                            onClick={handlePasskeyLogin}
                                            className="passkey-button"
                                            style={{
                                                width: '100%',
                                                padding: '10px 20px',
                                                backgroundColor: '#f1f1f1',
                                                color: '#303030',
                                                border: 'none',
                                                borderRadius: '8px',
                                                fontSize: '14px',
                                                fontWeight: '400',
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                gap: '8px',
                                                transition: 'background-color 0.2s ease',
                                            }}
                                        >
                                            <PasskeyIcon />
                                            <span>Sign in with passkey</span>
                                        </button>

                                        {/* Social Login Buttons */}
                                        <InlineStack gap="200" align="center">
                                            <button
                                                onClick={() => handleSocialLogin('apple')}
                                                className="social-button"
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
                                                    transition: 'background-color 0.2s ease',
                                                }}
                                            >
                                                <AppleIcon />
                                            </button>
                                            <button
                                                onClick={() => handleSocialLogin('facebook')}
                                                className="social-button"
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
                                                    transition: 'background-color 0.2s ease',
                                                }}
                                            >
                                                <FacebookIcon />
                                            </button>
                                            <button
                                                onClick={() => handleSocialLogin('google')}
                                                className="social-button"
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
                                                    transition: 'background-color 0.2s ease',
                                                }}
                                            >
                                                <GoogleIcon />
                                            </button>
                                        </InlineStack>
                                    </BlockStack>

                                    {/* Get Started Link */}
                                    <div style={{ paddingTop: '16px' }}>
                                        <Text as="span" variant="bodyMd">
                                            New to Shopify?{' '}
                                            <a href="#" style={{ color: '#005bd3', textDecoration: 'none', fontWeight: '500' }}>
                                                Get started →
                                            </a>
                                        </Text>
                                    </div>

                                    {/* Footer Links */}
                                    <div className="footer-links-container" style={{ paddingTop: '16px', marginTop: '16px', marginBottom: '16px', display: 'block' }}>
                                        <InlineStack gap="200" align="start" style={{ marginBottom: '16px' }}>
                                            <a href="#" className="footer-link" style={{ color: '#616161', textDecoration: 'none', fontSize: '12px' }}>
                                                Help
                                            </a>
                                            <a href="#" className="footer-link" style={{ color: '#616161', textDecoration: 'none', fontSize: '12px' }}>
                                                Privacy
                                            </a>
                                            <a href="#" className="footer-link" style={{ color: '#616161', textDecoration: 'none', fontSize: '12px' }}>
                                                Terms
                                            </a>
                                        </InlineStack>
                                    </div>
                                </BlockStack>
                            ) : (
                                // PASSWORD STEP
                                <BlockStack gap="500">
                                    {/* Spacer for mobile padding-top */}
                                    <div className="mobile-padding-spacer" style={{ display: 'none' }}></div>

                                    {/* Logo */}
                                    <div className="login-logo-container-mobile" style={{ paddingTop: '4px' }}>
                                        <img
                                            src="/logos/shopify-logo.svg"
                                            alt="Shopify"
                                            style={{ height: '26px', width: 'auto' }}
                                        />
                                    </div>

                                    {/* Header */}
                                    <BlockStack gap="100">
                                        <Text variant="headingXl" as="h1" fontWeight="bold">
                                            Log in
                                        </Text>
                                        <Text as="p" tone="subdued" fontWeight="regular" className="continue-to-shopify-text" style={{ fontSize: '14px' }}>
                                            Continue to Shopify
                                        </Text>
                                    </BlockStack>

                                    {/* Email Display */}
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        padding: '14px 16px',
                                        border: '1px solid #f1f1f1',
                                        borderRadius: '8px',
                                        backgroundColor: '#f7f7f7',
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
                                    {/* Password Input */}
                                    <BlockStack gap="200">
                                        <TextField
                                            label="Password"
                                            type={showPassword ? 'text' : 'password'}
                                            value={password}
                                            onChange={setPassword}
                                            autoComplete="current-password"
                                            suffix={
                                                <button
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    type="button"
                                                    style={{
                                                        background: 'none',
                                                        border: 'none',
                                                        cursor: 'pointer',
                                                        padding: '0',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                    }}
                                                >
                                                    {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                                                </button>
                                            }
                                        />
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
                                    <div className="login-button-wrapper">
                                        <Button
                                            onClick={handlePasswordLogin}
                                            fullWidth
                                            variant="primary"
                                        >
                                            Log in
                                        </Button>
                                    </div>

                                    {/* Footer Links */}
                                    <div className="footer-links-container" style={{ paddingTop: '16px', marginTop: '16px', marginBottom: '16px', display: 'block' }}>
                                        <InlineStack gap="200" align="start" style={{ marginBottom: '16px' }}>
                                            <a href="#" className="footer-link" style={{ color: '#616161', textDecoration: 'none', fontSize: '12px' }}>
                                                Help
                                            </a>
                                            <a href="#" className="footer-link" style={{ color: '#616161', textDecoration: 'none', fontSize: '12px' }}>
                                                Privacy
                                            </a>
                                            <a href="#" className="footer-link" style={{ color: '#616161', textDecoration: 'none', fontSize: '12px' }}>
                                                Terms
                                            </a>
                                        </InlineStack>
                                    </div>
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