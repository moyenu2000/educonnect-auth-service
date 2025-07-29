import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import * as path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 3000,
    proxy: {
      '/api/auth': {
        target: process.env.VITE_AUTH_URL || 'http://34.136.116.244:8081',
        changeOrigin: true,
      },
      '/api/assessment': {
        target: process.env.VITE_ASSESSMENT_URL || 'http://34.136.116.244:8083',
        changeOrigin: true,
      },
      '/api/discussion': {
        target: process.env.VITE_DISCUSSION_URL || 'http://34.136.116.244:8082',
        changeOrigin: true,
      }
    }
  }
})
