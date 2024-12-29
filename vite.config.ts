import path from 'node:path'
import process from 'node:process'

import vue from '@vitejs/plugin-vue'
import { visualizer } from 'rollup-plugin-visualizer'
import UnoCSS from 'unocss/vite'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { defineConfig } from 'vite'
import { Plugin as importToCDN } from 'vite-plugin-cdn-import'
import { nodePolyfills } from 'vite-plugin-node-polyfills'
import vueDevTools from 'vite-plugin-vue-devtools'
// import cdn from 'vite-plugin-cdn-import'

// https://vitejs.dev/config/
export default defineConfig({
  base: process.env.SERVER_ENV === `NETLIFY` ? `/` : `/md/`, // 基本路径, 建议以绝对路径跟随访问目录
  define: {
    process,
  },
  build: {
    // sourcemap: true,
    rollupOptions: {
      // 确保外部化处理那些你不想打包进库的依赖
      // external: ['vue','element-plus'], // 注意看这里
      output: {
        // 在 UMD 构建模式下为这些外部化的依赖提供一个全局变量
        manualChunks: {

          vendor: [
            `pinia`,
            `radix-vue`,
            `vue`,
            `@vueuse/core`,
            `tailwind-merge`,
            `marked`,
            // `juice`,
          ],
          // parse5: [
          //   `parse5`,
          // ],
          utils: [
            // `lodash`,
            // `lodash-es`,
            `dayjs`,
            `langium`,
            `crypto-js`,
            `parse5`,
            `vscode-languageserver-types`,
            `vscode-uri`,
            `vscode-languageserver-textdocument`,
            `vscode-jsonrpc`,
            `mensch`,
          ],
          res: [
            `lucide-vue-next`,
            `vue-pick-colors`,
            // `juice`,
          ],
          // cryptojs: ['crypto-js'],
          // vscode: [
          //   'vscode-languageserver-types',
          //   'vscode-uri',
          //   'vscode-languageserver-textdocument',
          //   'vscode-jsonrpc'],
          // mermaid: ['mermaid'],
          // vue: [
          //   //'mermaid',
          //   'vue',
          //   '@vueuse/core',
          // ],

          ui: [
            `codemirror`,
            `vue-sonner`,
          ],
        },
      // 打印每个包的信息
      //   manualChunks: (id: string) => {
      //     try {
      //       if (id.includes("node_modules")) {
      //         let name = id.split("node_modules/")[1].split("/");
      //         if (name[0] == ".pnpm") {
      //           return name[1];
      //         } else {
      //           return name[0]
      //         }
      //       }
      //     } catch (error) {
      //       console.error(error);
      //     }
      // }
      },
    },
  },
  plugins: [
    vue(),
    importToCDN({
      modules: [
        // 'vue',
        // 'axios',
        {
          name: `codemirror`,
          var: `CodeMirror`,
          path: `https://s4.zstatic.net/ajax/libs/codemirror/5.65.18/codemirror.min.js`,
          css: `https://s4.zstatic.net/ajax/libs/codemirror/5.65.18/codemirror.min.css`,
        },
        // {
        //   name: `juice`,
        //   var: `juice`,
        //   path: `https://cdn.jsdelivr.net/npm/juice@11.0.0/client.min.js`,
        // },

        {
          name: `highlight.js`,
          var: `hljs`,
          path: `https://mirrors.sustech.edu.cn/cdnjs/ajax/libs/highlight.js/11.10.0/highlight.min.js`,
          css: `https://mirrors.sustech.edu.cn/cdnjs/ajax/libs/highlight.js/11.10.0/styles/default.min.css`,
        },

        {
          name: `axios`,
          var: `axios`,
          path: `https://mirrors.sustech.edu.cn/cdnjs/ajax/libs/axios/1.7.7/axios.min.js`,
        },
        {
          name: `cytoscape`,
          var: `cytoscape`,
          path: `https://s4.zstatic.net/ajax/libs/cytoscape/3.29.2/cytoscape.min.js`,
        },
        {
          name: `katex`,
          var: `katex`,
          path: `https://s4.zstatic.net/ajax/libs/KaTeX/0.16.9/katex.min.js`,
          css: `https://s4.zstatic.net/ajax/libs/KaTeX/0.16.9/katex.min.css`,
        },

        // {
        //   name: `marked`,
        //   var: `marked`,
        //   path: `https://s4.zstatic.net/ajax/libs/marked/15.0.3/lib/marked.esm.min.js`,
        // },
        {
          name: `lodash`,
          var: `lodash`,
          path: `https://mirrors.sustech.edu.cn/cdnjs/ajax/libs/lodash.js/4.17.21/lodash.min.js`,
        },
        // {
        //   name: `mermaid`,
        //   var: `mermaid`,
        //   path: `https://mirrors.sustech.edu.cn/cdnjs/ajax/libs/mermaid/11.2.1/mermaid.min.js`,
        // },

      ],
    }),
    UnoCSS(),
    vueDevTools(),
    nodePolyfills({
      include: [`path`, `util`, `timers`, `stream`, `fs`],
      overrides: {
        // Since `fs` is not supported in browsers, we can use the `memfs` package to polyfill it.
        // fs: 'memfs',
      },
    }),

    // process.env.ANALYZE === `true` && visualizer({
    //   emitFile: true,
    //   filename: `stats.html`,
    //   open:true
    // }),
    visualizer({
      emitFile: true,
      filename: `stats.html`,
      open: true,
    }),
    AutoImport({
      imports: [
        `vue`,
        `pinia`,
        `@vueuse/core`,
      ],
      dirs: [
        `./src/stores`,
        `./src/utils/toast`,
      ],
    }),
    Components({
      resolvers: [],
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, `./src`),
    },
  },
  css: {
    devSourcemap: true,
  },
},
)
