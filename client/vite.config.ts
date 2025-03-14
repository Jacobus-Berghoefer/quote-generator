import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,  // Runs frontend on port 3000
    open: true,  // Auto-opens browser
    proxy: {
      '/graphql': {
        target: 'http://localhost:3001',  // Sends GraphQL requests to backend
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
