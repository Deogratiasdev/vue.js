import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: {
        enabled: true
      },
      manifest: {
        name: 'Vue Vite PWA',
        short_name: 'VuePWA',
        start_url: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#42b883',
        description: 'Template Vue 3 + Vite avec PWA',
        icons: [
          // Ajoutez vos icônes plus tard dans /public et mettez à jour ces chemins
          // {
          //   src: '/pwa-192x192.png',
          //   sizes: '192x192',
          //   type: 'image/png'
          // },
          // {
          //   src: '/pwa-512x512.png',
          //   sizes: '512x512',
          //   type: 'image/png'
          // }
        ]
      }
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
})
