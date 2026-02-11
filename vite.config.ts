import {fileURLToPath, URL} from 'node:url'
import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import Pages from 'vite-plugin-pages'
import {templateCompilerOptions} from '@tresjs/core'
import mkcert from 'vite-plugin-mkcert'

export default defineConfig(async ({mode}) => {
  const isDev = mode === 'development'

  const plugins = [
    vue({
      ...templateCompilerOptions,
    }),
    Pages(),
  ]

  if (isDev) {
    const {default: vueDevTools} = await import('vite-plugin-vue-devtools')
    // @ts-ignore
    plugins.push(vueDevTools())
    // @ts-ignore
    plugins.push(mkcert())
  }

  return {
    plugins,
    server: {
      proxy: {
        '/api': {
          target: 'https://localhost:8443',
          changeOrigin: false,
          secure: false,
        },
        '/ws': {
          target: 'https://localhost:8443',
          changeOrigin: false,
          secure: false,
          ws: true,
        },
        '/keycloak': {
          target: 'https://localhost:8443',
          changeOrigin: false,
          secure: false,
        },
      },
    },
    preview: {
      port: 5173,
    },
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
  }
})