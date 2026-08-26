import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import UnoCSS from "@unocss/vite";
import dts from "vite-plugin-dts";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig({
  plugins: [
    vue(),
    UnoCSS(),
    dts({
      outDir: "dist",
      include: ["src/**/*.ts", "src/**/*.vue"],
      exclude: [
        "src/main.ts",
        "src/App.vue",
        "src/style.ts",
        "src/vite-env.d.ts",
      ],
      tsconfigPath: "./tsconfig.json",
      cleanVueFileName: true,
    }),
  ],
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
  build: {
    cssCodeSplit: false,
    lib: {
      entry: {
        index: resolve(__dirname, "src/index.ts"),
        style: resolve(__dirname, "src/style.ts"),
      },
      formats: ["es"],
    },
    rollupOptions: {
      external: (id) => {
        if (id === "vue" || id.startsWith("vue/")) return true;
        if (id === "@vueuse/motion" || id.startsWith("@vueuse/")) return true;
        return false;
      },
      output: {
        entryFileNames: "[name].js",
        assetFileNames: (assetInfo) => {
          if (assetInfo.name && assetInfo.name.endsWith(".css")) {
            return "style.css";
          }
          return "[name][extname]";
        },
      },
    },
  },
});
