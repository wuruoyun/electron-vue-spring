import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    port: 9000,
    proxy: {
      '^/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
      '^/actuator/health': {
        target: 'http://localhost:8080',
      },
    },
  },
})
