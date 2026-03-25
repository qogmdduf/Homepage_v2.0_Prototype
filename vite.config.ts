import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

/** GitHub Pages 등 서브패스 배포 시 CI에서 `VITE_BASE=/리포지토리이름/` 설정 */
const base =
  process.env.VITE_BASE && process.env.VITE_BASE !== '/'
    ? `/${process.env.VITE_BASE.replace(/^\/+|\/+$/g, '')}/`
    : '/'

export default defineConfig({
  base,
  plugins: [
    // The React and Tailwind plugins are both required for Make, even if
    // Tailwind is not being actively used – do not remove them
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      // Alias @ to the src directory
      '@': path.resolve(__dirname, './src'),
    },
  },

  build: {
    sourcemap: false,
  },

  // File types to support raw imports. Never add .css, .tsx, or .ts files to this.
  assetsInclude: ['**/*.svg', '**/*.csv'],

  /**
   * - HMR: localhost:5173 고정 (내장 미리보기·WebSocket 주소 혼선 완화)
   * - 폴링: `pnpm dev`가 VITE_USE_POLLING=1 로 실행됨 (iCloud/Downloads 등에서 저장 감지 안정화)
   * - `pnpm dev:fast`: 네이티브 watch만 사용(더 가벼움)
   * - `server.open`: 시작 시 기본 브라우저로 열어 Cursor 내장 브라우저 대신 외부 탭에서 HMR 사용 권장
   */
  server: {
    port: 5173,
    strictPort: true,
    host: 'localhost',
    open: true,
    hmr: {
      protocol: 'ws',
      host: 'localhost',
      port: 5173,
    },
    watch: {
      usePolling: process.env.VITE_USE_POLLING === '1',
      interval: 200,
    },
  },
})
