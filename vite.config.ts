import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(({ command, mode }) => {
  const isProd = mode === 'production';

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    build: {
      target: 'esnext',
      minify: 'terser',
      cssCodeSplit: true,
      rollupOptions: {
        output: {
          manualChunks: {
            'vendor': ['react', 'react-dom'],
            'ui': ['lucide-react'],
            'charts': ['recharts'],
            'motion': ['motion']
          }
        }
      },
      terserOptions: {
        compress: {
          drop_console: isProd
        }
      },
      sourcemap: !isProd,
      outDir: 'dist',
      assetsDir: 'assets'
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
      middlewareMode: process.env.NODE_ENV !== 'production'
    },
    define: {
      __DEV__: !isProd
    },
    ssr: {
      noExternal: ['lucide-react']
    }
  };
});
