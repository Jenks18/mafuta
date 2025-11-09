import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'
import { StatusBar, Style } from '@capacitor/status-bar'

// Static pages
import HomePage from './components/pages/static/HomePage.jsx'
import PrivacyPage from './components/pages/static/PrivacyPage.jsx'
import TermsPage from './components/pages/static/TermsPage.jsx'
import DeleteAccountPage from './components/pages/static/DeleteAccountPage.jsx'

// Configure status bar for mobile
if (window.Capacitor?.isNativePlatform()) {
  StatusBar.setStyle({ style: Style.Light }).catch(() => {});
  StatusBar.setBackgroundColor({ color: '#10b981' }).catch(() => {}); // Emerald green to match your app
  StatusBar.setOverlaysWebView({ overlay: false }).catch(() => {}); // Don't overlay content
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <Routes>
          {/* Static marketing pages - no auth required */}
          <Route path="/home" element={<HomePage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/account/delete" element={<DeleteAccountPage />} />
          
          {/* Main app - handles auth and dashboard */}
          <Route path="/" element={<App />} />
          <Route path="/*" element={<App />} />
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  </StrictMode>,
)
