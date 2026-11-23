import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './App.css'
import App from './App.jsx'
import { TermProvider } from './lib/terms.jsx'
import { initCloud } from './lib/cloud.js'
import { runMigrations } from './lib/migrations.js'

// 저장 데이터 이전(시나리오 id 변경 등). 화면을 그리기 전에 한 번.
runMigrations()

// 구글 로그인·기록 동기화(설정했을 때만)
initCloud()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <TermProvider>
      <App />
    </TermProvider>
  </StrictMode>,
)
