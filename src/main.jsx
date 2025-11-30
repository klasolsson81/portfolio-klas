import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import 'flag-icons/css/flag-icons.min.css';
import './index.css'

// Importera Vercels verktyg
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from "@vercel/speed-insights/react"

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
    
    {/* Här laddas statistiken och prestandamätningen */}
    <Analytics />
    <SpeedInsights />
    
  </React.StrictMode>,
)