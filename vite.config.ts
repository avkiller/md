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
    // sourcemap: true,
    rollupOptions: {
      // 确保外部化处理那些你不想打包进库的依赖
      //external: ['vue','element-plus'], // 注意看这里
      output: {
        // 在 UMD 构建模式下为这些外部化的依赖提供一个全局变量
        manualChunks: {
  
          vendor: [
            'pinia', 
            'radix-vue',
            'vue',
            '@vueuse/core',
          ], 
          utils: [
            'lodash',
            'lodash-es',
            'dayjs',
            'langium', 
            'crypto-js', 
            'parse5', 
            'vscode-languageserver-types', 
            'vscode-uri', 
            'vscode-languageserver-textdocument', 
            'vscode-jsonrpc',
          ],
          res: ['lucide-vue-next'],
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
            'element-plus', 
            'codemirror',
            '@element-plus/icons-vue',
          ]
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
    importToCDN({
      modules: [
        // 'vue',
        //'axios',
        // {
        //   name: 'element-plus',
        //   var: 'ElementPlus',
        //   path: 'https://mirrors.sustech.edu.cn/cdnjs/ajax/libs/element-plus/2.8.4/index.full.min.js',
        //   css: 'https://mirrors.sustech.edu.cn/cdnjs/ajax/libs/element-plus/2.8.4/index.min.cssx.css'
        // },
        // {
        //   name: '@element-plus/icons-vue',
        //   var: 'ElementPlusIconsVue',
        //   path: 'https://mirrors.sustech.edu.cn/cdnjs/ajax/libs/element-plus-icons-vue/2.3.1/index.iife.min.js',
        // },
        {
          name: 'highlight.js',
          var: 'hljs',
          path: 'https://mirrors.sustech.edu.cn/cdnjs/ajax/libs/highlight.js/11.10.0/highlight.min.js',
          css: 'https://mirrors.sustech.edu.cn/cdnjs/ajax/libs/highlight.js/11.10.0/styles/default.min.css'
        },

        {
          name: 'axios',
          var: 'axios',
          path: 'https://mirrors.sustech.edu.cn/cdnjs/ajax/libs/axios/1.7.7/axios.min.js'
        },
        {
          name: 'cytoscape',
          var: 'cytoscape',
          path: 'https://mirrors.sustech.edu.cn/cdnjs/ajax/libs/cytoscape/3.29.2/cytoscape.min.js'
        },{
          name: 'katex',
          var: 'katex',
          path: 'https://mirrors.sustech.edu.cn/cdnjs/ajax/libs/KaTeX/0.16.9/katex.min.js'
        },

        {
          name: 'prettier/standalone',
          var: 'prettier',
          path: 'https://mirrors.sustech.edu.cn/cdnjs/ajax/libs/prettier/3.3.3/standalone.js'
        },
        // {
        //   name: 'mermaid',
        //   var: 'mermaid',
        //   path: 'https://mirrors.sustech.edu.cn/cdnjs/ajax/libs/mermaid/11.2.1/mermaid.min.js'
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
