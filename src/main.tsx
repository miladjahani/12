import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { PadsProvider } from './context/PadsContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PadsProvider>
      <App />
    </PadsProvider>
  </StrictMode>,
)
