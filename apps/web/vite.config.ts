import path from 'node:path'
import process from 'node:process'

import { cloudflare } from '@cloudflare/vite-plugin'
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
const isNetlify = process.env.SERVER_ENV === `NETLIFY`
const isUTools = process.env.SERVER_ENV === `UTOOLS`
const isCfWorkers = process.env.CF_WORKERS === `1`
const isCfPages = process.env.CF_PAGES === `1`

const base = isNetlify || isCfWorkers || isCfPages ? `/` : isUTools ? `./` : `/md/`

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd())

  return {
    base,
    define: { process },
    envPrefix: [`VITE_`, `CF_`],
    plugins: [
      vue(),
      isCfWorkers && cloudflare(),
      tailwindcss(),
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
      !isCfWorkers && nodePolyfills({
        include: [`path`, `util`, `timers`, `stream`, `fs`],
        overrides: {
          // Since `fs` is not supported in browsers, we can use the `memfs` package to polyfill it.
          // fs: 'memfs',
        },
      }),
      // VitePluginRadar({
      //   analytics: { id: `G-7NZL3PZ0NK` },
      // }),
      // process.env.ANALYZE === `true`
      // && visualizer({ emitFile: true, filename: `stats.html` }),
      visualizer({
        emitFile: true,
        // gzipSize: true,
        filename: `stats.html`,
        // template: `treemap`,
        open: true,
      }),
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
              // `prettier`,
            //  `@lezer/markdown`,
              `vue-sonner`,
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
              `axios`,
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
            codemirror: [
              `codemirror`,
            ],
            hljs: [
              `highlight.js`
            ],

            ui: [
              // `codemirror`,
              `radix-vue`,
              `reka-ui`,
            ],
            'components': [
              path.resolve(__dirname, 'src/components/editor/UploadImgDialog.vue'),

            ],

          },
        },
      },
    },
  }
})
