import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './App.css'
import App from './App.jsx'
import { TermProvider } from './lib/terms.jsx'
import { initCloud } from './lib/cloud.js'

// 구글 로그인·기록 동기화(설정했을 때만)
initCloud()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <TermProvider>
      <App />
    </TermProvider>
  </StrictMode>,
)
