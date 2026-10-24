import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource/be-vietnam-pro/400.css'
import '@fontsource/be-vietnam-pro/500.css'
import '@fontsource/be-vietnam-pro/600.css'
import '@fontsource/be-vietnam-pro/700.css'
import '@fontsource-variable/playfair-display/wght.css'
import './styles/tokens.css'
import './styles/global.css'
import './styles/components.css'
import './styles/game.css'
import './styles/ambassador.css'
import App from './App'
import { GameProvider } from './state/GameProvider'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GameProvider>
      <App />
    </GameProvider>
  </StrictMode>,
)
