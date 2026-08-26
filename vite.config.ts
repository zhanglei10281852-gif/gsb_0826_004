import { readdirSync } from "node:fs";
import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import UnoCSS from "unocss/vite";
import dts from "vite-plugin-dts";

const srcDir = fileURLToPath(new URL("./src", import.meta.url));

function componentEntries(): Record<string, string> {
  const entries: Record<string, string> = {};
  for (const dirent of readdirSync(new URL("./src/components", import.meta.url), {
    withFileTypes: true,
  })) {
    if (!dirent.isDirectory()) continue;
    entries[`components/${dirent.name}/index`] = fileURLToPath(
      new URL(`./src/components/${dirent.name}/index.ts`, import.meta.url),
    );
  }
  return entries;
}

export default defineConfig({
  resolve: {
    alias: {
      "@": srcDir,
    },
  },
  plugins: [
    vue(),
    UnoCSS(),
    dts({
      entryRoot: "src",
      outDir: "dist",
      include: ["src/**/*.ts", "src/**/*.vue"],
      exclude: ["src/main.ts", "src/App.vue", "src/env.d.ts"],
      tsconfigPath: "./tsconfig.json",
    }),
  ],
  build: {
    lib: {
      entry: {
        index: fileURLToPath(new URL("./src/index.ts", import.meta.url)),
        ...componentEntries(),
      },
    },
    rollupOptions: {
      external: ["vue"],
      output: [
        {
          format: "es",
          entryFileNames: "[name].js",
          chunkFileNames: "chunks/[name]-[hash].js",
          assetFileNames: "[name][extname]",
        },
        {
          format: "cjs",
          exports: "named",
          entryFileNames: "[name].cjs",
          chunkFileNames: "chunks/[name]-[hash].cjs",
          assetFileNames: "[name][extname]",
        },
      ],
    },
  },
});
