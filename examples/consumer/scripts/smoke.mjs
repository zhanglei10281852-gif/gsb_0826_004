// 运行时冒烟测试：在 Node 中真实 SSR 渲染安装后的 nexa-ui，
// 覆盖统一入口、按组件引入、插件全局注册、样式产物解析四条链路。
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { createSSRApp, h, resolveComponent } from "vue";
import { renderToString } from "@vue/server-renderer";
import NexaUI, { NButton, NInput } from "nexa-ui";
import DeepButton from "nexa-ui/components/Button";

const require = createRequire(import.meta.url);

// 1. 样式产物可通过包 exports 解析，且包含编译后的变量与原子类
const cssPath = require.resolve("nexa-ui/style.css");
const css = readFileSync(cssPath, "utf8");
assert.ok(css.includes("--nexa-primary-500"), "style.css 缺少 CSS 变量");
assert.ok(css.includes("bg-primary-600"), "style.css 缺少原子类");
console.log("✓ nexa-ui/style.css 可解析，且包含编译后的样式");

// 2. 统一入口
const html1 = await renderToString(
  createSSRApp({ render: () => h(NButton, null, () => "统一入口按钮") }),
);
assert.ok(html1.includes("<button") && html1.includes("统一入口按钮"), "统一入口 NButton 渲染失败");
const html2 = await renderToString(
  createSSRApp({ render: () => h(NInput, { label: "邮箱" }) }),
);
assert.ok(html2.includes("<input") && html2.includes("邮箱"), "统一入口 NInput 渲染失败");
console.log("✓ 统一入口 import { NButton, NInput } from 'nexa-ui' 渲染通过");

// 3. 按组件引入（深路径）
const html3 = await renderToString(
  createSSRApp({ render: () => h(DeepButton, { variant: "outline" }, () => "按需引入按钮") }),
);
assert.ok(html3.includes("按需引入按钮"), "按需引入 NButton 渲染失败");
console.log("✓ 按需引入 import NButton from 'nexa-ui/components/Button' 渲染通过");

// 4. 插件安装后全局组件可用
const app = createSSRApp({
  render() {
    return h(resolveComponent("NButton"), null, () => "插件注册按钮");
  },
});
app.use(NexaUI);
const html4 = await renderToString(app);
assert.ok(html4.includes("插件注册按钮"), "插件全局注册 NButton 渲染失败");
console.log("✓ app.use(NexaUI) 全局注册渲染通过");

console.log("\n[smoke] 全部通过");
