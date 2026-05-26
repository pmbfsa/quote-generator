import { defineConfig } from 'vite';
import sitemap from 'vite-plugin-sitemap';
import webfontDownload from 'vite-plugin-webfont-dl';

export default defineConfig({
  plugins: [
    webfontDownload(),
    sitemap({
      hostname: 'https://pmbfsa.github.io/quote-generator/',
    }),
    {
      name: 'inject-preloads',
      enforce: 'post', // roda depois que o Vite/Rolldown injetou os assets
      transformIndexHtml: {
        order: 'post', // garante que o HTML já tem os <script> e <link> finais
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
    modulePreload: {
      polyfill: true,
    },
    rolldownOptions: {
      // ← era rollupOptions no Vite 7
      output: {
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
      },
    },
  },
});
