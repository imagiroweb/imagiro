import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

/**
 * Configuration Vite pour le frontend Imagiro.
 * Proxy `/api` vers le backend (dev).
 */
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
    proxy: {
      '/api': {
        target: process.env.VITE_API_URL || 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
})
