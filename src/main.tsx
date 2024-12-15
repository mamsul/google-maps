import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import GoogleMapsProvider from './google-maps/gmaps-provider'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GoogleMapsProvider>
      <App />
    </GoogleMapsProvider>
  </StrictMode>,
)
