import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import basicSsl from '@vitejs/plugin-basic-ssl'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    basicSsl() // <-- Додайте плагін сюди
  ],
  server: {
    // Вказуємо порт явно, щоб він точно був 5173
    port: 5173,
    // Включаємо HTTPS
    https: true
  }
})
