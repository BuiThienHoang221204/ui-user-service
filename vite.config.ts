import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import federation from '@originjs/vite-plugin-federation';

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'user_mfe',
      filename: 'remoteEntry.js',
      exposes: {
        './App': './src/app/App.tsx',
      },
      shared: ['react', 'react-dom', '@tanstack/react-query', 'react-router-dom'],
    }),
  ],
  build: {
    modulePreload: false,
    target: 'esnext',
    minify: false,
    cssCodeSplit: false,
  },
  server: {
    port: 3003,
    host: true,
  },
  preview: {
    port: 3003,
  }
});
