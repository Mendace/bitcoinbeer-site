// vite.config.js
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'url'

export default defineConfig(({ mode }) => {
  // Legge .env (es: .env.development / .env.production)
  const env = loadEnv(mode, process.cwd(), '')
  const BACKEND = env.VITE_BACKEND || 'https://api.bitcoinbeer.events'

  return {
    base: '/',
    plugins: [vue()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
        'vue': 'vue/dist/vue.esm-bundler.js',
      },
    },
    assetsInclude: ['**/*.JPG', '**/*.jpg', '**/*.png', '**/*.webp', '**/*.svg'],
    define: {
      'process.env': {},
      __BACKEND__: JSON.stringify(BACKEND),
    },
    build: {
      rollupOptions: { external: [] },
    },
    server: {
      host: true,
      strictPort: true,
      proxy: {
        // Simple PHP proxy for API calls
        '/proxy-api.php': {
          target: 'http://localhost:8080',  // Assuming you have a local PHP server
          changeOrigin: true,
          secure: false,
        },
        // Generic API proxy as fallback
        '^/web/api/.*': {
          target: BACKEND,
          changeOrigin: true,
          secure: false,
        },
        '^/api/.*': {
          target: BACKEND,
          changeOrigin: true,
          secure: false,
        },
        '^/get_events\\.php$': {
          target: BACKEND,
          changeOrigin: true,
          secure: false,
        },
      },
    },
  }
})
