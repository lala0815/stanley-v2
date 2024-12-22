import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    host: '0.0.0.0',
    port: 3000,
    https: {
      key: fs.readFileSync('/etc/letsencrypt/live/stanley.eastasia.cloudapp.azure.com/privkey.pem'),
      cert: fs.readFileSync('/etc/letsencrypt/live/stanley.eastasia.cloudapp.azure.com/cert.pem'),
    },
  },
});
