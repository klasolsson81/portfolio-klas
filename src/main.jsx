import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import 'flag-icons/css/flag-icons.min.css';
import './index.css'

// Importera verktyg och toast-notiser
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from "@vercel/speed-insights/react"
import { registerSW } from 'virtual:pwa-register'
import { toast } from 'sonner' // Se till att sonner är installerad

// Registrera service worker med manuell prompt (fixar dubbel-refresh)
const updateSW = registerSW({
  onNeedRefresh() {
    // Visa en snygg notis istället för att tvinga fram en omladdning direkt
    toast('Ny version tillgänglig!', {
      description: 'Uppdatera för att få de senaste prestandafixarna.',
      duration: Infinity, // Stannar tills användaren agerar
      action: {
        label: 'Uppdatera',
        onClick: () => updateSW(true) // Utför uppdateringen manuellt
      },
    });

    if (import.meta.env.DEV) {
      console.log('PWA: New content available, prompt shown to user');
    }
  },
  onOfflineReady() {
    if (import.meta.env.DEV) {
      console.log('PWA: App ready to work offline');
    }
  },
  onRegistered(registration) {
    if (import.meta.env.DEV) {
      console.log('PWA: Service worker registered');
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
    <App />
    <ConditionalAnalytics />
  </React.StrictMode>,
)