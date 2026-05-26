import { defineConfig } from 'vite';
import sitemap from 'vite-plugin-sitemap';
import webfontDownload from 'vite-plugin-webfont-dl';

export default defineConfig({
  base: '',
  plugins: [
    webfontDownload(),
    sitemap({
      hostname: 'https://pmbfsa.github.io/quote-generator/',
      outDir: 'docs',
    }),
    {
      name: 'inject-preloads',
      enforce: 'post',
      transformIndexHtml: {
        order: 'post',
        handler(html) {
          const jsMatch = html.match(/src="(\/assets\/[^"]+\.js)"/);
          const cssMatch = html.match(/href="(\/assets\/[^"]+\.css)"/);

          const jsHref = jsMatch?.[1];
          const cssHref = cssMatch?.[1];

          let preloads = '';
          if (jsHref)
            preloads += `<link rel="modulepreload" crossorigin href="${jsHref}">\n    `;
          if (cssHref)
            preloads += `<link rel="preload" as="style" crossorigin href="${cssHref}">\n    `;

          return html.replace(
            '<link rel="shortcut icon"',
            `${preloads}<link rel="shortcut icon"`,
          );
        },
      },
    },
  ],
  build: {
    outDir: 'docs',
    emptyOutDir: true,
    modulePreload: {
      polyfill: true,
    },
    rolldownOptions: {
      output: {
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
      },
    },
  },
});
