// ============================================================
// vite.config.js — pengaturan alat build (Vite) dan PWA
// Di sinilah aplikasi dijadikan PWA (bisa di-install) dan
// diatur cache-nya lewat Workbox (Service Worker).
// ============================================================
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(), // mengaktifkan React
    VitePWA({
      registerType: 'autoUpdate', // Service Worker memperbarui dirinya otomatis saat ada versi baru
      devOptions: { enabled: true }, // PWA juga aktif saat mode pengembangan
      // Manifest = "kartu identitas" aplikasi saat dipasang di HP
      manifest: {
        name: 'WastraKu',
        short_name: 'WastraKu', // nama pendek di bawah ikon
        description: 'Katalog Batik Nusantara dan Filosofi Motif.',
        start_url: '/',
        scope: '/',
        display: 'standalone', // tampil seperti aplikasi, tanpa bar alamat browser
        background_color: '#ffffff',
        theme_color: '#ffffff',
        icons: [
          { src: '/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
          { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' },
        ],
      },
      workbox: {
        // File-file ini disimpan di awal supaya aplikasi bisa dibuka saat offline
        globPatterns: ['**/*.{js,css,html,svg,png,webmanifest}'],
        // Alamat apa pun dialihkan ke index.html (karena aplikasi satu halaman / SPA)
        navigateFallback: '/index.html',
        // Aturan cache untuk permintaan yang terjadi saat aplikasi berjalan
        runtimeCaching: [
          {
            // DISK CACHE: foto batik & landmark dari Wikimedia disimpan di penyimpanan browser
            urlPattern: /^https:\/\/(commons|upload|thumb)\.wikimedia\.org\/.*/i,
            handler: 'CacheFirst', // utamakan yang tersimpan; ambil dari internet hanya jika belum ada
            options: {
              cacheName: 'batik-images-disk-cache',
              expiration: {
                maxEntries: 200, // maksimal 200 foto tersimpan
                maxAgeSeconds: 60 * 60 * 24 * 30, // disimpan 30 hari
              },
              cacheableResponse: {
                statuses: [0, 200], // hanya simpan jawaban yang berhasil
              },
            },
          },
          {
            // QUERY CACHE: utamakan data terbaru dari server; jika offline/lambat pakai cache
            urlPattern: /\/api\/(motifs|regions).*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'wastraku-api-query-cache',
              networkTimeoutSeconds: 4,
              expiration: {
                maxEntries: 60,
                maxAgeSeconds: 60 * 60 * 24, // disimpan 24 jam
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
        ],
      },
    }),
  ],
})
