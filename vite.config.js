import { fileURLToPath, URL } from 'node:url'
import GlobalsPolyfills from '@esbuild-plugins/node-globals-polyfill'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      http: 'rollup-plugin-node-polyfills/polyfills/http',      
      https: 'rollup-plugin-node-polyfills/polyfills/http',
      _stream_readable:
      'rollup-plugin-node-polyfills/polyfills/readable-stream/readable',
      _stream_writable:
      'rollup-plugin-node-polyfills/polyfills/readable-stream/writable',

    }
  },
  optimizeDeps: {
    esbuildOptions: {
      // Node.js global to browser globalThis
      define: {
        global: 'globalThis',
      },
      // Enable esbuild polyfill plugins
      plugins: [
        GlobalsPolyfills({
          process: true,
          buffer: true,
        }),
      ]
    },
  },
  server: {    
    port: 4200
  },
  define: {
    'process.env': {}
  },
  
})
