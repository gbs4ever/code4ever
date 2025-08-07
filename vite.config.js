import { defineConfig } from 'vite'

export default defineConfig({
  // Build configuration
  build: {
    outDir: 'dist',
    emptyOutDir: true
  },
  
  // Server configuration for development
  server: {
    port: 3000,
    host: true
  }
})
