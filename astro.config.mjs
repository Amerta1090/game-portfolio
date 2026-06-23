import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  integrations: [react(), tailwind()],
  output: 'static',
  vite: {
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules/three')) return 'vendor-three';
            if (id.includes('node_modules/@react-three')) return 'vendor-r3f';
            if (id.includes('node_modules/framer-motion')) return 'vendor-framer';
            if (id.includes('node_modules/react') || id.includes('node_modules/react-dom')) return 'vendor-react';
          },
        },
      },
    },
    ssr: {
      noExternal: ['three', '@react-three/fiber', '@react-three/drei'],
    },
  },
});
