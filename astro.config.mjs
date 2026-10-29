// @ts-check
import { defineConfig } from 'astro/config';

// Set SITE_URL when the production domain is known so canonical and Open Graph URLs are absolute.
const site = process.env.SITE_URL || undefined;

export default defineConfig({
  site,
  trailingSlash: 'ignore',
  build: {
    format: 'directory',
    inlineStylesheets: 'auto',
  },
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'hover',
  },
  devToolbar: { enabled: false },
});
