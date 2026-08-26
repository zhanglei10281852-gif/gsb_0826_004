# Nexa UI

基于 Vue 3 + TypeScript + UnoCSS 的现代化组件库。本仓库包含组件源码、本地演示、构建与发布配置，以及一套从源码到产物再到外部示例项目的可重复验证链路。

## 快速开始

```bash
npm install        # 安装依赖（Node >= 18）
npm run dev        # 启动本地演示 http://localhost:5173
npm run typecheck  # vue-tsc 全量类型检查，快速定位构建问题
npm run build      # 构建组件库产物到 dist/es（JS + 类型声明 + style.css）
npm run build:demo # 构建演示站到 dist-demo
npm run verify     # 全链路验证（见下文）
npm pack           # 生成发布 tarball（prepack 会自动先执行 build）
```

## 在业务项目中使用

安装后，同时支持统一入口与按组件引入，二者共享同一份类型声明：

```ts
// 方式一：统一入口（可配合 app.use 全量注册）
import NexaUI, { NButton, NInput } from "nexa-ui";
import "nexa-ui/style.css"; // 必须引入一次：CSS 变量 + 重置 + 编译后的原子类/图标

createApp(App).use(NexaUI).mount("#app");
```

```ts
// 方式二：按组件引入（深路径，无需库侧逐组件登记）
import { NButton } from "nexa-ui/components/Button";
import type { NTableColumn, NTableProps } from "nexa-ui/components/Table";
import "nexa-ui/style.css";
```

产物说明（`dist/es/`）：

- `index.mjs` / `index.d.ts`：统一入口（命名导出 + 默认插件）
- `components/<Name>/index.mjs` / `index.d.ts`：每个组件的独立入口
- `style.css`：变量、重置、原子类、图标（SVG data-uri）、组件 scoped 样式，消费端无需配置 UnoCSS
- ESM + `preserveModules`，可被充分 tree-shake；`vue` 为 peerDependency（^3.4.0），`@vueuse/motion` 为运行时依赖

## 新增组件

只需创建目录并具名导出组件，**不需要修改任何配置文件**：

```
src/components/Link/
  NLink.vue
  index.ts        # import NLink from "./NLink.vue"; export { NLink }; export default NLink;
```

`npm run dev` / `npm run build` 前会自动执行 `scripts/generate-entry.mjs`，扫描 `src/components/*/index.ts` 重新生成统一入口 `src/index.ts`（该文件标注 `@generated`，请勿手改）。构建入口与 `package.json` 的 `./components/*` 通配导出都按目录约定工作。

## 可重复验证：`npm run verify`

`scripts/verify.mjs` 串起完整链路，可反复执行，不依赖任何外部托管服务：

1. 构建组件库（入口生成 + JS + 样式 + 类型声明）
2. 断言 `dist/es` 产物完整、样式包含变量/原子类/图标/动画
3. `npm pack` 生成 tarball
4. 外部示例项目 `examples/consumer` 以 tarball 安装 `nexa-ui`（独立依赖、独立构建配置，刻意不装 UnoCSS）
5. 示例项目 `vue-tsc` 类型检查（验证统一入口与深路径 d.ts 均可解析）
6. 示例项目 Vite 构建
7. Node SSR 冒烟：统一入口渲染、按组件引入渲染、`app.use` 全局注册渲染、`nexa-ui/style.css` 解析

## 目录边界

| 路径 | 说明 |
| --- | --- |
| `src/` | 组件库源码（`src/index.ts` 为生成文件） |
| `src/App.vue`、`src/main.ts` | 本地演示（不进入库产物） |
| `dist/` | 库构建产物（gitignored） |
| `dist-demo/` | 演示站构建产物（gitignored） |
| `.verify/` | verify 过程中生成的 tarball（gitignored） |
| `examples/consumer/` | 外部消费示例（独立安装，其 `nexa-ui.tgz` 由 verify 生成） |

## 实现要点

- 组件内部一律使用相对导入，避免路径别名泄漏进发布的 d.ts
- `v-motion` 由组件局部注册（`MotionDirective`），统一入口与按需引入行为一致，消费端无需安装插件
- UnoCSS 主题/图标仅在库构建期使用并编译进 `style.css`；图标集来自本地 `@iconify-json/*`，离线可构建
