import path from 'node:path'
import process from 'node:process'

import vue from '@vitejs/plugin-vue'
import { visualizer } from 'rollup-plugin-visualizer'
import UnoCSS from 'unocss/vite'
import AutoImport from 'unplugin-auto-import/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import Components from 'unplugin-vue-components/vite'
import { defineConfig } from 'vite'
import { nodePolyfills } from 'vite-plugin-node-polyfills'
import vueDevTools from 'vite-plugin-vue-devtools'
import { Plugin as importToCDN } from 'vite-plugin-cdn-import'
// import cdn from 'vite-plugin-cdn-import'

// https://vitejs.dev/config/
export default defineConfig({
  base: process.env.SERVER_ENV === `NETLIFY` ? `/` : `/md/`, // 基本路径, 建议以绝对路径跟随访问目录
  define: {
    process,
  },
  build: {
    rollupOptions: {
      // 确保外部化处理那些你不想打包进库的依赖
      //external: ['vue','element-plus'], // 注意看这里
      output: {
        // 在 UMD 构建模式下为这些外部化的依赖提供一个全局变量
        manualChunks: {
          vendor: ['vue', '@vueuse/core', 'pinia', 'radix-vue'], 
          utils: ['lodash', 'dayjs','langium', 'crypto-js', 'parse5'],
          // cryptojs: ['crypto-js'],
          vscode: [
            'vscode-languageserver-types', 
            'vscode-uri', 
            'vscode-languageserver-textdocument', 
            'vscode-jsonrpc'],
          // mermaid: ['mermaid'],
          vue: [
            //'mermaid', 
            'element-plus', 
            'prettier',
            'codemirror'
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
    }
  }
},
  plugins: [
    vue(),
    // cdn({
    //   modules: [
    //     // {
    //     //   name: "vue",
    //     //   var: "Vue",
    //     //   path: "https://cdn.jsdelivr.net/npm/vue@3.5.10/dist/vue.global.min.js",
    //     // },
    //     'vue',
    //     'axios',
    //     // {
    //     //   name: '@element-plus/icons-vue',
    //     //   var: 'ElementPlusIconsVue',
    //     //   path: 'dist/index.iife.min.js',
    //     // },
    //     // {
    //     //   name: '@element-plus/icons-vue',
    //     //   var: 'ElementPlusIconsVue', // 根据main.js中定义的来
    //     //   path: ''
    //     // },
    //    ],
    //   }),
    importToCDN({
      modules: [
        // 'vue',
        //'axios',
        // {
        //   name: 'element-plus',
        //   var: 'ElementPlus',
        //   path: 'https://cdn.jsdelivr.net/npm/element-plus@2.8.4/dist/index.full.min.js',
        //   css: 'https://cdn.jsdelivr.net/npm/element-plus@2.8.4/dist/index.css'
        // },
        {
          name: 'highlight.js',
          var: 'hljs',
          path: 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.10.0/highlight.min.js',
          css: 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.10.0/styles/default.min.css'
        },

        {
          name: 'axios',
          var: 'axios',
          path: 'https://cdnjs.cloudflare.com/ajax/libs/axios/1.7.7/axios.min.js'
        },

        // {
        //   name: 'pinia',
        //   var: 'Pinia',
        //   path: 'dist/pinia.iife.min.js'
        // },
        
      ]
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
      open:true
    }),
    AutoImport({
      imports: ['vue', 'vue-router', 'vuex'],
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
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
