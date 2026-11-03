import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { RoutineProvider } from './features/routines/RoutineContext'
import { ThemeProvider } from './contexts/ThemeContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <RoutineProvider>
        <App />
      </RoutineProvider>
    </ThemeProvider>
  </StrictMode>,
)
