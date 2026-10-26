import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { aiMiddlewarePlugin } from './server/ai.ts';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react(), aiMiddlewarePlugin(env)],
    server: {
      host: '0.0.0.0',
      port: 3000,
      strictPort: false,
      allowedHosts: true,
    },
    preview: {
      host: '0.0.0.0',
      port: 3000,
      strictPort: false,
      allowedHosts: true,
    },
  };
});
