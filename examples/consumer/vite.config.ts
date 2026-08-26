import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// 注意：这里刻意不配置 UnoCSS / 别名 / 插件，
// 用于验证 nexa-ui 产物（JS + 类型 + 样式）在安装后即可独立工作。
export default defineConfig({
  plugins: [vue()],
});
