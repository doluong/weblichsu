import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

// GitHub Pages: https://<user>.github.io/weblichsu/
export default defineConfig({
  base: '/weblichsu/',
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    css: false,
    // Các test luồng nhiều bước (Chặng 3-4) có nhiều thao tác người dùng nên cần thời gian dài hơn mặc định.
    testTimeout: 30000,
  },
})
