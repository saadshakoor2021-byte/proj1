import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { aiMiddlewarePlugin } from './server/ai';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react(), aiMiddlewarePlugin(env)],
    server: {
      port: 3000,
      strictPort: false,
    },
    preview: {
      port: 3000,
      strictPort: false,
    },
  };
});
