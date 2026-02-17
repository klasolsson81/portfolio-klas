import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App.jsx'
import PitchPage from './pages/PitchPage'
import 'flag-icons/css/flag-icons.min.css';
import './index.css'

// Importera verktyg
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from "@vercel/speed-insights/react"
import { registerSW } from 'virtual:pwa-register'

// Registrera service worker med autoUpdate (ny version aktiveras direkt utan prompt)
registerSW({
  onOfflineReady() {
    if (import.meta.env.DEV) {
      console.log('PWA: App ready to work offline');
    }
  },
  onRegisterError(error) {
    console.error('PWA: Service worker registration failed', error);
  }
})

const ConditionalAnalytics = () => {
  const [hasConsent, setHasConsent] = useState(false);

  useEffect(() => {
    const checkConsent = () => {
      const consent = localStorage.getItem('cookie-consent');
      setHasConsent(consent === 'accepted');
    };

    checkConsent();

    const handleConsentChange = () => checkConsent();
    window.addEventListener('cookie-consent-changed', handleConsentChange);

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
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/pitch" element={<PitchPage />} />
      </Routes>
      <ConditionalAnalytics />
    </BrowserRouter>
  </React.StrictMode>,
)