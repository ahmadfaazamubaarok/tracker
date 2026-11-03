import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'assets/*'],
      manifest: {
        name: 'Project Tracker',
        short_name: 'Tracker',
        description: 'Personal Kanban Project Tracker - Local & Standalone',
        theme_color: '#141414',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'any',
        icons: [
          {
            src: 'assets/icon-192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'assets/icon-512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: 'assets/icon-maskable-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
          }
        ]
      }
    })
  ],
  base: './',
  server: {
    port: 5173,
    host: true
  }
});
