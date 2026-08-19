import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
  },
  define: {
    // Expose VITE_API_URL so components can use import.meta.env.VITE_API_URL
    __API_URL__: JSON.stringify(process.env.VITE_API_URL || 'http://127.0.0.1:8000'),
  }
})
