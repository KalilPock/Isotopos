// view/astro.config.mjs
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind'; // <-- A ponte!

// https://astro.build/config
export default defineConfig({
  // Importante: adicione o tailwind à lista de integrações
  integrations: [tailwind()],
});