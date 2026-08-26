import { readdirSync } from "node:fs";
import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import UnoCSS from "unocss/vite";

// 库构建入口 = 统一入口 + 每个组件目录的 index.ts（按目录扫描，新增组件无需改配置），
// 多入口保证每个组件都会产出独立的 components/<Name>/index.mjs，支持按需引入。
function resolveLibEntries() {
  const srcDir = fileURLToPath(new URL("./src", import.meta.url));
  const entries = { index: `${srcDir}/index.ts` };
  for (const dir of readdirSync(`${srcDir}/components`, { withFileTypes: true })) {
    if (dir.isDirectory()) {
      entries[`components/${dir.name}/index`] = `${srcDir}/components/${dir.name}/index.ts`;
    }
  }
  return entries;
}

// 默认模式：本地演示（npm run dev / npm run build:demo）
// --mode lib：组件库产物（npm run build），输出到 dist/es/
export default defineConfig(({ mode }) => ({
  plugins: [vue(), UnoCSS()],
  build:
    mode === "lib"
      ? {
          outDir: "dist/es",
          cssCodeSplit: false,
          copyPublicDir: false,
          lib: {
            entry: resolveLibEntries(),
            formats: ["es"],
            cssFileName: "style",
          },
          rollupOptions: {
            // vue 由业务项目提供；@vueuse/motion 声明为运行时依赖
            external: ["vue", "@vueuse/motion"],
            output: {
              // 保留源码目录结构，产物可按模块深路径引入并被充分 tree-shake
              preserveModules: true,
              preserveModulesRoot: "src",
              entryFileNames: "[name].mjs",
              chunkFileNames: "[name].mjs",
            },
          },
        }
      : {
          outDir: "dist-demo",
        },
}));
