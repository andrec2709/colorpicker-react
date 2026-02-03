import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import ThemeProvider from './contexts/ThemeProvider.tsx'
import { ColorProvider } from './contexts/ColorProvider.tsx'
import { DefaultTextProvider } from './contexts/DefaultTextProvider.tsx'
import { LanguageProvider } from './contexts/LanguageProvider.tsx'
import { PaletteProvider } from './contexts/PaletteProvider.tsx'
import { SettingsProvider } from './contexts/SettingsProvider.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LanguageProvider>
      <ThemeProvider>
        <SettingsProvider>
          <PaletteProvider>
            <ColorProvider>
              <DefaultTextProvider>
                <App />
              </DefaultTextProvider>
            </ColorProvider>
          </PaletteProvider>
        </SettingsProvider>
      </ThemeProvider>
    </LanguageProvider>
  </StrictMode>,
)
