import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      // Multi-page build: the main site plus the standalone /for-her/ birthday journey
      input: {
        main: fileURLToPath(new URL('./index.html', import.meta.url)),
        forHer: fileURLToPath(new URL('./for-her/index.html', import.meta.url)),
      },
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8787',
        changeOrigin: true,
      }
    }
  }
})
