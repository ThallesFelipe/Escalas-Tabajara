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
        manualChunks(id) {
          if (/node_modules[\\/]date-fns/.test(id)) {
            return 'vendor';
          }

          return undefined;
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