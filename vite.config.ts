import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import UnoCSS from 'unocss/vite'
import dts from 'vite-plugin-dts'
import { resolve } from 'path'
import { readdirSync, existsSync, type Dirent } from 'fs'
import { fileURLToPath } from 'url'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

function getComponentEntries() {
  const componentsDir = resolve(__dirname, 'src/components')
  if (!existsSync(componentsDir)) return {}
  const entries: Record<string, string> = {}
  readdirSync(componentsDir, { withFileTypes: true })
    .filter((d: Dirent) => d.isDirectory())
    .forEach((d: Dirent) => {
      const indexPath = resolve(componentsDir, d.name, 'index.ts')
      if (existsSync(indexPath)) {
        entries[`${d.name}/index`] = indexPath
      }
    })
  return entries
}

export default defineConfig(({ command }) => {
  const alias = { '@': resolve(__dirname, 'src') }

  if (command === 'serve') {
    return {
      plugins: [vue(), UnoCSS()],
      resolve: { alias },
      server: {
        port: 5173,
        open: true,
      },
    }
  }

  const entries: Record<string, string> = {
    index: resolve(__dirname, 'src/index.ts'),
    ...getComponentEntries(),
  }

  return {
    plugins: [
      vue(),
      UnoCSS(),
      dts({
        include: [
          'src/index.ts',
          'src/components/**/*',
          'src/composables/**/*',
          'src/types/**/*',
          'src/utils/**/*',
        ],
        outDir: 'dist',
        entryRoot: 'src',
        staticImport: true,
        rollupTypes: false,
        beforeWriteFile(filePath, content) {
          const normalized = filePath.replace(/\\/g, '/')

          if (normalized.endsWith('/dist/index.d.ts')) {
            const fixed = content.replace(
              /from\s+['"]\.\/components\/([^'"]+)['"]/g,
              'from "./$1"',
            )
            return { filePath, content: fixed }
          }

          const compMatch = normalized.match(
            /dist\/components\/([^/]+)\/(.+\.d\.ts)$/,
          )
          if (compMatch) {
            const [, compName] = compMatch
            const newPath = filePath.replace(
              /components[\\/][^\\/]+[\\/]/,
              `${compName}/`,
            )
            const newContent = content.replace(
              /from\s+(['"])\.\.\/\.\.\/(composables|types|utils)/g,
              'from $1../$2',
            )
            return { filePath: newPath, content: newContent }
          }

          if (/dist\/(App\.vue|main)\.d\.ts$/.test(normalized)) {
            return { filePath, content: '' }
          }
          return { filePath, content }
        },
      }),
    ],
    resolve: { alias },
    build: {
      outDir: 'dist',
      emptyOutDir: true,
      cssCodeSplit: false,
      sourcemap: true,
      lib: {
        entry: entries,
        formats: ['es', 'cjs'],
      },
      rollupOptions: {
        external: ['vue', '@vueuse/motion'],
        output: [
          {
            format: 'es',
            entryFileNames: '[name].mjs',
            chunkFileNames: 'chunks/[name]-[hash].mjs',
            assetFileNames: '[name][extname]',
            exports: 'named',
          },
          {
            format: 'cjs',
            entryFileNames: '[name].cjs',
            chunkFileNames: 'chunks/[name]-[hash].cjs',
            assetFileNames: '[name][extname]',
            exports: 'named',
          },
        ],
      },
    },
  }
})
