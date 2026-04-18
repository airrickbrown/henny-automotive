import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ isSsrBuild }) => ({
  plugins: [react()],
  // Don't copy public/ into the SSR output — only the JS bundle is needed
  publicDir: isSsrBuild ? false : 'public',
  build: {
    outDir: isSsrBuild ? 'dist-ssr' : 'dist',
    sourcemap: false,
    ...(isSsrBuild
      ? {}
      : {
          rollupOptions: {
            output: {
              manualChunks: {
                vendor: ['react', 'react-dom', 'react-router-dom'],
              },
            },
          },
        }),
  },
}))
