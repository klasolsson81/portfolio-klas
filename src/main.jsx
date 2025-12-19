import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import 'flag-icons/css/flag-icons.min.css';
import './index.css'

// Importera Vercels verktyg
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from "@vercel/speed-insights/react"

// Importera PWA service worker registrering
import { registerSW } from 'virtual:pwa-register'

// Registrera service worker med auto-uppdatering
const updateSW = registerSW({
  onNeedRefresh() {
    // Only log in development
    if (import.meta.env.DEV) {
      console.log('PWA: New content available, will update on next visit');
    }
  },
  onOfflineReady() {
    // Only log in development
    if (import.meta.env.DEV) {
      console.log('PWA: App ready to work offline');
    }
  },
  onRegistered(registration) {
    // Only log in development
    if (import.meta.env.DEV) {
      console.log('PWA: Service worker registered', registration);
    }
  },
  onRegisterError(error) {
    // Always log errors (important for production debugging)
    console.error('PWA: Service worker registration failed', error);
  }
})

// Conditional Analytics component (only loads if consent given)
const ConditionalAnalytics = () => {
  const [hasConsent, setHasConsent] = useState(false);

  useEffect(() => {
    // Check initial consent
    const checkConsent = () => {
      const consent = localStorage.getItem('cookie-consent');
      setHasConsent(consent === 'accepted');
    };

    checkConsent();

    // Listen for consent changes (use named function for better debugging)
    const handleConsentChange = () => checkConsent();
    window.addEventListener('cookie-consent-changed', handleConsentChange);

    // Cleanup listener on unmount
    return () => {
      window.removeEventListener('cookie-consent-changed', handleConsentChange);
    };
  }, []);

  if (!hasConsent) return null;

  return (
    <>
      <Analytics />
      <SpeedInsights />
    </>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />

    {/* Här laddas statistiken och prestandamätningen (endast med samtycke) */}
    <ConditionalAnalytics />

  </React.StrictMode>,
)