import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 1200, // reduce noise; we still lazy-load heavy libs
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('mapbox-gl')) return 'vendor-mapbox';
            if (id.includes('react') || id.includes('scheduler')) return 'vendor-react';
            if (id.includes('zustand')) return 'vendor-zustand';
            if (id.includes('@supabase')) return 'vendor-supabase';
            if (id.includes('daisyui') || id.includes('tailwindcss')) return 'vendor-style';
          }
          if (id.includes('/src/components/pages/FindFuel/')) return 'chunk-findfuel';
          if (id.includes('/src/components/pages/')) return 'chunk-pages';
          if (id.includes('/src/store/')) return 'chunk-store';
          if (id.includes('/src/utils/')) return 'chunk-utils';
        },
      },
    },
  },
})
