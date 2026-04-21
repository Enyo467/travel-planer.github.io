import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { HashRouter } from 'react-router-dom'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <HashRouter basename="/travel-planer.github.io">
          <App />
      </HashRouter>
  </StrictMode>,
)
