import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // 공용 서버에서 계정마다 배정된 포트(user68 → 3068)를 씁니다. 포트가 사용 중이면 다른 포트로 넘어가지 않고 멈춥니다.
  server: { port: 3068, strictPort: true, host: true },
})
