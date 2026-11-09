import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/tokens.css'
import './styles/base.css'
import './styles/animations.css'
import App from './App.jsx'
import { AppProvider } from './context/AppContext.jsx'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/react'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AppProvider>
      <App />
      <Analytics />
      <SpeedInsights />
    </AppProvider>
  </StrictMode>,
)
