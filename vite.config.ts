import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'


const BASE = '/Gestion-Estudiantil/'

function figmaAssetResolver() {
  return {
    name: 'figma-asset-resolver',
    resolveId(id) {
      if (id.startsWith('figma:asset/')) {
        const filename = id.replace('figma:asset/', '')
        return path.resolve(__dirname, 'src/assets', filename)
      }
    },
  }
}

// En desarrollo, entrar a "/" redirige a la base "/Gestion-Estudiantil/"
// para que el router (basename: /Gestion-Estudiantil) siempre resuelva.
function redirectRootToBase() {
  return {
    name: 'redirect-root-to-base',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = req.url || '/'
        // "/", "/index.html" o "/Gestion-Estudiantil" (sin barra final)
        // -> redirige a la base con barra para que Vite y el router resuelvan.
        if (url === '/' || url === '/index.html' || url === BASE.slice(0, -1)) {
          res.statusCode = 302
          res.setHeader('Location', BASE)
          res.end()
          return
        }
        next()
      })
    },
  }
}

export default defineConfig({
  plugins: [
    figmaAssetResolver(),
    redirectRootToBase(),
    // The React and Tailwind plugins are both required for Make, even if
    // Tailwind is not being actively used – do not remove them
    react(),
    tailwindcss(),
  ],
  base: BASE,
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@shared':    path.resolve(__dirname, './shared'),
      '@themes':    path.resolve(__dirname, './themes'),
      '@constants': path.resolve(__dirname, './constants'),
    },
  },

  // File types to support raw imports. Never add .css, .tsx, or .ts files to this.
  assetsInclude: ['**/*.svg', '**/*.csv'],
})
