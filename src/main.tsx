import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.js'
import ContextProvider from './contexts/ContextProvider.js'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <ContextProvider>
        <App />
      </ContextProvider>
  </StrictMode>,
)
