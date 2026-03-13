import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Optimizaciones de build
    rollupOptions: {
      output: {
        manualChunks: {
          // Separar vendor chunks para mejor caché
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'chart-vendor': ['recharts'],
          'animation-vendor': ['framer-motion'],
        },
      },
    },
    // Aumentar límite de advertencia de chunk
    chunkSizeWarningLimit: 1000,
    // Usar esbuild en lugar de terser (más rápido y compatible)
    minify: 'esbuild',
  },
  // Optimizaciones de desarrollo
  server: {
    hmr: {
      overlay: false, // Desactivar overlay de errores para mejor performance
    },
  },
  // Optimizar dependencias
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'recharts', 'framer-motion'],
  },
})
