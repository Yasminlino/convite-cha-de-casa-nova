import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import RoutesConfig from './Routes.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RoutesConfig />
  </StrictMode>,
)
