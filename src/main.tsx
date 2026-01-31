import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import ThemeProvider from './contexts/ThemeProvider.tsx'
import { ColorProvider } from './contexts/ColorProvider.tsx'
import { DefaultTextProvider } from './contexts/DefaultTextProvider.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <ColorProvider>
        <DefaultTextProvider>
          <App />
        </DefaultTextProvider>
      </ColorProvider>
    </ThemeProvider>
  </StrictMode>,
)
