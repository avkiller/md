import path from 'node:path'
import process from 'node:process'

// import { cloudflare } from '@cloudflare/vite-plugin'
import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import { visualizer } from 'rollup-plugin-visualizer'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { defineConfig, loadEnv } from 'vite'
import vueDevTools from 'vite-plugin-vue-devtools'
import { utoolsLocalAssetsPlugin } from './plugins/vite-plugin-utools-local-assets'

const isNetlify = process.env.SERVER_ENV === `NETLIFY`
const isUTools = process.env.SERVER_ENV === `UTOOLS`
const isCfWorkers = process.env.CF_WORKERS === `1`
const isCfPages = process.env.CF_PAGES === `1`

const base = isNetlify || isCfWorkers || isCfPages ? `/` : isUTools ? `./` : `/md/`

// const PKG_NAME_SPECIAL_CHARS = /[^\w-]/g
const WINDOWS_PATH_REG = /\\/g
// const PNPM_PATH_REG = /node_modules\/(?:\.pnpm\/)?((?:@[^/]+[+/])?[^/]+)/

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd())

  return {
    base,
    define: { process },
    envPrefix: [`VITE_`, `CF_`],
    plugins: [
      vue(),
      // isCfWorkers && cloudflare(),
      tailwindcss(),
      mode === 'development' && vueDevTools({
        launchEditor: env.VITE_LAUNCH_EDITOR ?? `code`,
      }),

      visualizer({
        emitFile: true,
        // gzipSize: true,
        filename: `stats.html`,
        template: `treemap`,
        // template: `list`,
        open: true,
        gzipSize: true,
      }),
      AutoImport({
        imports: [`vue`, `pinia`, `@vueuse/core`],
        dirs: [`./src/stores`, `./src/utils/toast`, `./src/composables`],
        dts: 'src/auto-imports.d.ts',
      }),
      Components({
        resolvers: [],
      }),
      isUTools && utoolsLocalAssetsPlugin(),
    ],
    resolve: {
      alias: { '@': path.resolve(__dirname, `./src`) },
      dedupe: [`@codemirror/state`, `@codemirror/view`],
    },
    css: { devSourcemap: true },
    build: {
      chunkSizeWarningLimit: 1500,
      cssCodeSplit: false,
      minify: 'oxc',
      rolldownOptions: {
        external: [`mermaid`],
        output: {
          chunkFileNames: `static/js/md-[name]-[hash].js`,
          entryFileNames: `static/js/md-[name]-[hash].js`,
          // assetFileNames: `static/[ext]/md-[name]-[hash].[ext]`,
          globals: { mermaid: `mermaid` },

          manualChunks(id) {
            const normalizedId = id.replace(WINDOWS_PATH_REG, '/')
            if (normalizedId.includes(`node_modules`)) {
              if (normalizedId.includes('@vue/')
                || normalizedId.includes('vue')
                || normalizedId.includes('@vueuse')
                || normalizedId.includes('pinia')
                || normalizedId.includes('axios')) {
                return 'vue-bundle'
              }
              if (
                normalizedId.includes('radix-vue')
                || normalizedId.includes('reka-ui')
                || normalizedId.includes('lucide-vue-next')
              ) {
                return 'ui' // 它们都会被打包进 ui.js
              }
              if (normalizedId.includes(`juice`)) {
                return `juice`
              }
              if (normalizedId.includes('@aws-sdk+client-s3') || normalizedId.includes('@aws-sdk/client-s3')) {
                return 'aws-s3'
              }
              if (
                normalizedId.includes('smithy')
                || normalizedId.includes('@aws-crypto')
              ) {
                return 'aws-infra'
              }
              if (normalizedId.includes('@codemirror/lang-')) {
                return 'editor-langs'
              }
              if (normalizedId.includes('codemirror') || normalizedId.includes('@codemirror') || normalizedId.includes('@lezer')) {
                return 'codemirror'
              }
              // if (id.includes(`codemirror`))
              //   return `codemirror`
              if (normalizedId.includes(`katex`))
                return `katex`
              if (normalizedId.includes(`prettier`))
                return `prettier`
              if (normalizedId.includes(`highlight.js`))
                return `highlight`
              // Skip automatic vendor splitting for pnpm virtual store to avoid circular deps
              if (
                normalizedId.includes('html-to-image')
                || normalizedId.includes('yup')
                || normalizedId.includes('vee-validate')
                || normalizedId.includes('tailwind-merge')
                || normalizedId.includes('highlight.js')
              ) {
                return `utils`
              }
              if (normalizedId.includes(`/.pnpm/`)) {
                // if (
                //   normalizedId.includes(`/@vue/`)
                //   || normalizedId.includes(`/@vue+`)
                //   || normalizedId.includes(`/node_modules/vue/`)
                //   || normalizedId.includes(`/node_modules/pinia/`)
                // ) {
                //   return `vendor_vue`
                // }
                // if (normalizedId.includes(`/@vueuse+`) || normalizedId.includes(`/@vueuse/`))
                //   return `vendor_vueuse`

                // Extract actual package name from the real package path within .pnpm store
                // Format: .pnpm/<outer>@version/node_modules/<actual-pkg>/...
                // const nmIndex = normalizedId.lastIndexOf(`/node_modules/`)
                // if (nmIndex !== -1) {
                //   const afterNm = normalizedId.slice(nmIndex + `/node_modules/`.length)
                //   const parts = afterNm.split(`/`)
                //   const pkgName = afterNm.startsWith(`@`)
                //     ? `${parts[0].slice(1)}_${parts[1]}`
                //     : parts[0]
                //   return `vendor_${pkgName.replace(PKG_NAME_SPECIAL_CHARS, `_`)}`
                // }
                return
              }

              const pkg = normalizedId
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
