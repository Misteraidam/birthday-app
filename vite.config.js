import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import basicSsl from '@vitejs/plugin-basic-ssl'
import { config as forHer } from './src/for-her/content/config.ts'

const escapeHtml = (text) =>
  text.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

// Fills %HER_NAME% / %SITE_URL% in for-her/index.html from config.ts. Link previews
// (WhatsApp, iMessage) read the raw HTML without running JavaScript, so these have to be baked in.
function forHerMeta() {
  return {
    name: 'for-her-meta',
    transformIndexHtml: {
      order: 'pre',
      handler(html, ctx) {
        if (!ctx.filename.replace(/\\/g, '/').endsWith('for-her/index.html')) return html
        return html
          .replaceAll('%HER_NAME%', escapeHtml(forHer.herName))
          .replaceAll('%SITE_URL%', forHer.siteUrl.replace(/\/$/, ''))
      },
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  // `npm run dev:https` uses a self-signed certificate, so phones on the same Wi-Fi
  // can test the gyroscope and microphone (both need HTTPS)
  plugins: [react(), forHerMeta(), ...(mode === 'https' ? [basicSsl()] : [])],
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
