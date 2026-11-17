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
        name: 'shellApp',
        remotes: {
          virtualizationApp: env.VITE_VIRTUALIZATION_REMOTE_URL || 'http://localhost:3001/assets/remoteEntry.js',
          bookingHubApp: env.VITE_BOOKING_HUB_REMOTE_URL || 'http://localhost:3002/assets/remoteEntry.js',
        },
        shared: ['react', 'react-dom'],
      }),
    ],
    server: { port: 5173, strictPort: true, proxy },
    preview: { port: 5173, strictPort: true, proxy },
    build: { target: 'esnext' },
  };
});
