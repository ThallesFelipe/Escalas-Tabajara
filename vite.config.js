import { defineConfig } from 'vite';

export default defineConfig({
  root: '.',
  base: './',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true,
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['date-fns']
        }
      }
    }
  },
  server: {
    port: 3000,
    host: true,
    open: true
  },
  css: {
    devSourcemap: true
  },
  esbuild: {
    target: 'es2022'
  }
});