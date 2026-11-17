import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import federation from '@originjs/vite-plugin-federation';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const proxy = {
    '/api/bookings': {
      target: env.BOOKING_SERVICE_URL || 'http://localhost:5001',
      changeOrigin: true,
    },
  };

  return {
    plugins: [
      react(),
      federation({
        name: 'bookingHubApp',
        filename: 'remoteEntry.js',
        exposes: { './App': './src/app/App.tsx' },
        shared: ['react', 'react-dom'],
      }),
    ],
    server: { port: 3002, strictPort: true, proxy },
    preview: { port: 3002, strictPort: true, cors: true, proxy },
    build: { target: 'esnext', cssCodeSplit: false },
  };
});
