import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'
import { StatusBar, Style } from '@capacitor/status-bar'

// Configure status bar for mobile
if (window.Capacitor?.isNativePlatform()) {
  StatusBar.setStyle({ style: Style.Light }).catch(() => {});
  StatusBar.setBackgroundColor({ color: '#3b82f6' }).catch(() => {}); // Blue to match your app
  StatusBar.setOverlaysWebView({ overlay: false }).catch(() => {}); // Don't overlay content
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
)
