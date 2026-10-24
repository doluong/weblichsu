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
  },
})
