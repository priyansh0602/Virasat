import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
  },
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          // Split vendor libs into separately-cached chunks
          'vendor-react':   ['react', 'react-dom'],
          'vendor-motion':  ['framer-motion'],
          'vendor-supabase':['@supabase/supabase-js'],
          'vendor-map':     ['leaflet', 'react-leaflet'],
        },
      },
    },
  },
})

