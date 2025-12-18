import React from 'react'
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
    console.log('PWA: New content available, will update on next visit');
  },
  onOfflineReady() {
    console.log('PWA: App ready to work offline');
  },
  onRegistered(registration) {
    console.log('PWA: Service worker registered', registration);
  },
  onRegisterError(error) {
    console.error('PWA: Service worker registration failed', error);
  }
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />

    {/* Här laddas statistiken och prestandamätningen */}
    <Analytics />
    <SpeedInsights />

  </React.StrictMode>,
)