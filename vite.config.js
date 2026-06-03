import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        menu: resolve(__dirname, 'pages/menu.html'),
        about: resolve(__dirname, 'pages/about.html'),
        news: resolve(__dirname, 'pages/news.html'),
        reservation: resolve(__dirname, 'pages/reservation.html'),
      },
    },
  },
});
