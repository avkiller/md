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
// import { VitePluginRadar } from 'vite-plugin-radar'
import vueDevTools from 'vite-plugin-vue-devtools'

const isNetlify = process.env.SERVER_ENV === `NETLIFY`
const isUTools = process.env.SERVER_ENV === `UTOOLS`
const isCfWorkers = process.env.CF_WORKERS === `1`
const isCfPages = process.env.CF_PAGES === `1`

const base = isNetlify || isCfWorkers || isCfPages ? `/` : isUTools ? `./` : `/md/`
const WINDOWS_PATH_REG = /\\/g

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
      chunkSizeWarningLimit: 500,
      rollupOptions: {
        external: [`mermaid`],
        output: {
          chunkFileNames: `static/js/md-[name]-[hash].js`,
          entryFileNames: `static/js/md-[name]-[hash].js`,
          assetFileNames: `static/[ext]/md-[name]-[hash].[ext]`,
          globals: { mermaid: `mermaid` },
          manualChunks(id) {
            if (id.includes(`node_modules`)) {
              const normalizedId = id.replace(WINDOWS_PATH_REG, '/')
              if (normalizedId.includes('@vue/')) {
                return 'vue-bundle'
              }
              if (normalizedId.includes('@lezer/')) {
                return 'lezer-bundle'
              }
              if (
                normalizedId.includes('radix-vue')
                || normalizedId.includes('reka-ui')
                || normalizedId.includes('lucide-vue-next')
                || normalizedId.includes('/.pnpm/radix-vue')
                || normalizedId.includes('/.pnpm/reka-ui')
                || normalizedId.includes('/.pnpm/lucide-vue-next')
              ) {
                return 'ui' // 它们都会被打包进 ui.js
              }

              if (
                normalizedId.includes('@aws-sdk/s3-request-presigner')
                || normalizedId.includes('@aws-sdk/client-s3')
              ) {
                return 'aws' // 它们都会被打包进 ui.js
              }
              if (
                normalizedId.includes('html-to-image')
                || normalizedId.includes('pinia')
                || normalizedId.includes('yup')
                || normalizedId.includes('vee-validate')
                || normalizedId.includes('tailwind-merge')
                || normalizedId.includes('highlight.js')
                || normalizedId.includes('vue-sonner')
              ) {
                return `utils`
              }

              if (normalizedId.includes(`codemirror`))
                return `codemirror`
              if (normalizedId.includes(`readable-stream`))
                return `stream`
              if (normalizedId.includes(`browser-image-compression`))
                return `image-compression`
              if (normalizedId.includes(`katex`))
                return `katex`
              if (normalizedId.includes(`prettier`))
                return `prettier`
              // Skip automatic vendor splitting for pnpm virtual store to avoid circular deps
              if (normalizedId.includes(`/.pnpm/`))
                return
              const pkg = id
                .split(`node_modules/`)[1]
                .split(`/`)[0]
                .replace(`@`, `npm_`)
              return `vendor_${pkg}`
            }
          },
        },
      },
    },
  }
})
