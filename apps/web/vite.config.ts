import path from 'node:path'
import process from 'node:process'

import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import { visualizer } from 'rollup-plugin-visualizer'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { defineConfig, loadEnv } from 'vite'
import { nodePolyfills } from 'vite-plugin-node-polyfills'
import { VitePWA } from 'vite-plugin-pwa'
// import { VitePluginRadar } from 'vite-plugin-radar'
import vueDevTools from 'vite-plugin-vue-devtools'
import cdn from 'vite-plugin-cdn-import'

const base = process.env.SERVER_ENV === `NETLIFY` ? `/` : `/md/`

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd())

  return {
    base,
    define: { process },
    envPrefix: [`VITE_`, `CF_`],
    plugins: [
      vue(),
      tailwindcss(),
      cdn({
      // generateScriptTag: (name, url) => ({
      //   attrs:{
      //     defer: true
      //   }
      //  }),
      modules: [
        {
          name: `highlight.js`,
          var: `hljs`,
          path: `https://s4.zstatic.net/ajax/libs/highlight.js/11.11.1/highlight.min.js`,
          css: `https://s4.zstatic.net/ajax/libs/highlight.js/11.11.1/styles/default.min.css`,
        },

        {
          name: `axios`,
          var: `axios`,
          path: `https://s4.zstatic.net/ajax/libs/axios/1.8.4/axios.min.js`,
        },
        {
          name: `cytoscape`,
          var: `cytoscape`,
          path: `https://s4.zstatic.net/ajax/libs/cytoscape/3.31.1/cytoscape.min.js`,
        },
        {
          name: `katex`,
          var: `katex`,
          path: `https://s4.zstatic.net/ajax/libs/KaTeX/0.16.9/katex.min.js`,
          css: `https://s4.zstatic.net/ajax/libs/KaTeX/0.16.9/katex.min.css`,
        },

        {
          name: `lodash`,
          var: `lodash`,
          path: `https://s4.zstatic.net/ajax/libs/lodash.js/4.17.21/lodash.min.js`,
        },
      ],
      }),

      vueDevTools({
        launchEditor: env.VITE_LAUNCH_EDITOR ?? `code`,
      }),
      
      // VitePWA({
      //   registerType: `autoUpdate`,
      //   includeAssets: [`favicon.ico`],
      //   manifest: {
      //     name: `@avkiller-md`,
      //     short_name: `@avkiller-md`,
      //     theme_color: `#ffffff`,
      //     icons: [
      //       {
      //         src: `${base}pwa-192x192.png`,
      //         sizes: `192x192`,
      //         type: `image/png`,
      //       },
      //       {
      //         src: `${base}pwa-512x512.png`,
      //         sizes: `512x512`,
      //         type: `image/png`,
      //       },
      //       {
      //         src: `${base}pwa-512x512.png`,
      //         sizes: `512x512`,
      //         type: `image/png`,
      //         purpose: `any maskable`,
      //       },
      //     ],
      //   },
      //   workbox: {
      //     maximumFileSizeToCacheInBytes: 6 * 1024 * 1024,
      //   },
      //   devOptions: {
      //     enabled: true,
      //   },
      // }),
      nodePolyfills({
        include: [`path`, `util`, `timers`, `stream`, `fs`],
        overrides: {
        // Since `fs` is not supported in browsers, we can use the `memfs` package to polyfill it.
        // fs: 'memfs',
        },
      }),
      // VitePluginRadar({
      //   analytics: { id: `G-7NZL3PZ0NK` },
      // }),
      process.env.ANALYZE === `true`
      && visualizer({ emitFile: true, filename: `stats.html` }),
      AutoImport({
        imports: [`vue`, `pinia`, `@vueuse/core`],
        dirs: [`./src/stores`, `./src/utils/toast`, `./src/composables`],
      }),
      Components({
        resolvers: [],
      }),
    ],
    resolve: {
      alias: { '@': path.resolve(__dirname, `./src`) },
    },
    css: { devSourcemap: true },
    build: {
      rollupOptions: {
        output: {
          // chunkFileNames: `static/js/md-[name]-[hash].js`,
          // entryFileNames: `static/js/md-[name]-[hash].js`,
          // assetFileNames: `static/[ext]/md-[name]-[hash].[ext]`,
          manualChunks: {

          vendor: [
            `pinia`,
            `vue`,
            `yup`,
            `vee-validate`,
            `@vueuse/core`,
            `tailwind-merge`,
            `isomorphic-dompurify`,
            `unified`,
            `remark-parse`,
            `remark-stringify`,
          ],
          res: [
            `lucide-vue-next`,
            `vue-pick-colors`,
          ],
          makedown_lib: [
            `front-matter`,
            `marked`,
            // `mdast-util-from-markdown`,
          ],
          utils: [
            `reading-time`,
            `crypto-js`,
            `html-to-image`,
          ],
          cosdk: [
            `cos-js-sdk-v5`,
          ],
          awssdk: [
            `@aws-sdk/s3-request-presigner`,
            `@aws-sdk/client-s3`,
          ],
          othercloudsdk: [
            `qiniu-js`,
            `tiny-oss`,
          ],

          ui: [
            `codemirror`,
            `vue-sonner`,
            `radix-vue`,
            `reka-ui`,
          ],
          'components': [
            // path.resolve(__dirname, 'src/components/'),
            path.resolve(__dirname, 'src/components/CodemirrorEditor/UploadImgDialog.vue'),
  
          ],
        },
        },
      },
    },
  }
})
