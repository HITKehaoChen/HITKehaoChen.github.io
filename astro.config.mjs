import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://hitkehaochen.github.io',
  trailingSlash: 'always',
  outDir: 'docs',
  build: {
    format: 'directory'
  }
});
