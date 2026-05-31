import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import federation from '@originjs/vite-plugin-federation';

const projectRoot = process.cwd();

const logProxyRequest = (label: string, target: string) => (proxy: any) => {
  proxy.on('proxyReq', (_proxyReq: any, req: any) => {
    const method = req.method || 'GET';
    const url = req.url || '/';
    console.info(`[vite-proxy] ${label} ${method} ${url} -> ${target}${url}`);
  });
};

const spaFallbackPlugin = {
  name: 'spa-fallback-user-mfe',
  configureServer(server: any) {
    server.middlewares.use((req: any, res: any, next: any) => {
      if (req.method !== 'GET') {
        return next();
      }

      const accept = String(req.headers.accept || '');
      const url = String(req.url || '');

      if (!accept.includes('text/html')) {
        return next();
      }

      if (
        url.startsWith('/@') ||
        url.startsWith('/node_modules') ||
        url.startsWith('/src/') ||
        url.startsWith('/assets/') ||
        url.startsWith('/api-user') ||
        url.includes('.')
      ) {
        return next();
      }

      req.url = '/index.html';
      return next();
    });
  },
};

export default defineConfig({
  root: projectRoot,
  plugins: [
    react(),
    spaFallbackPlugin,
    federation({
      name: 'user_mfe',
      filename: 'remoteEntry.js',
      exposes: {
        './UserManagement': './src/app/App.tsx',
      },
      shared: ['react', 'react-dom', '@tanstack/react-query'],
    }),
  ],
  build: {
    modulePreload: false,
    target: 'esnext',
    minify: false,
    cssCodeSplit: false,
  },
  server: {
    port: 5173,
    strictPort: true,
    proxy: {
      '/api-user': {
        target: process.env.VITE_API_GATEWAY_URL || 'https://igkhi0x0hd.execute-api.ap-southeast-1.amazonaws.com',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/api-user/, ''),
          configure: (proxy: any) => {
            logProxyRequest('/api-user', process.env.VITE_API_GATEWAY_URL || 'https://igkhi0x0hd.execute-api.ap-southeast-1.amazonaws.com')(proxy);
            proxy.on('proxyRes', (proxyRes: any, req: any) => {
              const url = req.url || '/';
              const method = req.method || 'GET';
              console.info(`[vite-proxy] /api-user response ${method} ${url} -> ${process.env.VITE_API_GATEWAY_URL || 'https://igkhi0x0hd.execute-api.ap-southeast-1.amazonaws.com'}${url} ${proxyRes.statusCode}`);
            });
          },
      },
      '/api/upload': {
        target: process.env.VITE_DASHBOARD_REMOTE_URL || 'http://localhost:3002',
        changeOrigin: true,
          configure: (proxy: any) => {
            logProxyRequest('/api/upload', process.env.VITE_DASHBOARD_REMOTE_URL || 'http://localhost:3002')(proxy);
            proxy.on('proxyRes', (proxyRes: any, req: any) => {
              const url = req.url || '/';
              const method = req.method || 'GET';
              console.info(`[vite-proxy] /api/upload response ${method} ${url} -> ${process.env.VITE_DASHBOARD_REMOTE_URL || 'http://localhost:3002'}${url} ${proxyRes.statusCode}`);
            });
          },
      },
    },
  },
  preview: {
    port: 5173,
  }
});
