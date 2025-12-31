import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import vueDevTools from "vite-plugin-vue-devtools";
import Components from "unplugin-vue-components/vite"
import UnoCSS from "unocss/vite";
import viteCompression from "vite-plugin-compression";

// https://vite.dev/config/
// export default defineConfig((mode) => {
export default defineConfig(() => {
  // const root = process.cwd();
  // const viteEnv = loadEnv(mode, root)
  return {
    plugins: [
      vue(),
      vueJsx(),
      vueDevTools(),
      UnoCSS(),
      Components({
        dirs: [
          'src/components'
        ],
        include: [
          /\.vue$/,
          /\.vue\?vue/,
          /\.md$/,
        ],
      }),
      viteCompression({
        verbose: true,
        disable: false,
        deleteOriginFile: false,
        threshold: 10240,
        algorithm: 'gzip',
        ext: '.gz'
      }),
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      },
    },
    // css: {
    //   extract: true,
    //   sourceMap: false,
    //   requireModuleExtension: true
    // },
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes("node_modules")) {
              return 'vendor'
            }
          },
          chunkFileNames: 'assets/js/[name]-[hash].js',
          entryFileNames: "assets/js/[name]-[hash].js",
          assetFileNames: 'assets/[ext]/[name]-[hash].[ext]'
        }
      }
    },
    server: {
      host: '0.0.0.0',
      port: 5173,
      // https: true,
      // hotOnly: true,
      proxy: {
        '/api': {
          // target: `${viteEnv.VITE_SERVER_SSL === 'true' ? 'https' : 'http'}://${viteEnv.VITE_SERVER_URI}`,
          target: 'https://q.serv.zeeyeh.com',
          // target: 'http://localhost:32223',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
      }
    }
  }
})
