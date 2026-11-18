// ============================================================
// main.jsx — titik awal aplikasi React
// Tugas: menempelkan aplikasi ke <div id="root"> di index.html.
// ============================================================
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  // StrictMode: membantu menemukan kesalahan saat pengembangan
  <StrictMode>
    {/* BrowserRouter: membuat aplikasi bisa pindah halaman lewat URL tanpa reload */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
