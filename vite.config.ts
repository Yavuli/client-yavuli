import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path, { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        // Add hash to all asset files for cache busting
        entryFileNames: '[name].[hash].js',
        chunkFileNames: '[name].[hash].js',
        assetFileNames: '[name].[hash][extname]'
      }
    },
    // Optimize chunking strategy
    chunkSizeWarningLimit: 1000,
    minify: 'esbuild', // Use esbuild instead of terser (built-in with Vite)
  },
  server: {
    host: true,
    port: 3001,
    strictPort: true,
    // Add headers to prevent caching in dev
    headers: {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
      'ETag': 'W/"' + Date.now() + '"'
    },
    proxy: {
      '/api': {
        // target: 'http://localhost:5000',
        target: 'https://server-yavuli.onrender.com',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
  preview: {
    port: 3001,
    strictPort: true,
    headers: {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
    },
  },
  define: {
    'process.env': {}, 
  },
});
