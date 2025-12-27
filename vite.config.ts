import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
  define: {
    // Explicitly stringify the environment variable for replacement in the source code
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY || 'AIzaSyDuc3LRQw68kyqeE_g2peE-MGGLjyp35GU'),
  },
});