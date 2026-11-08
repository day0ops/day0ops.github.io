import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://day0ops.github.io',
  base: '/',
  output: 'static',
  trailingSlash: 'always',
  integrations: [mdx(), sitemap()],
});
