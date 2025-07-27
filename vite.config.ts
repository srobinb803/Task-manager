import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: [
      '5bf4-49-156-81-154.ngrok-free.app', // Your current Ngrok URL
      '.ngrok-free.app', // Wildcard for all Ngrok subdomains
    ],
  },
});