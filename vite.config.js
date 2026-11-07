import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import basicSsl from '@vitejs/plugin-basic-ssl'

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  // `npm run dev:https` uses a self-signed certificate, so phones on the same Wi-Fi
  // can test the gyroscope and microphone (both need HTTPS)
  plugins: [react(), ...(mode === 'https' ? [basicSsl()] : [])],
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
}))
