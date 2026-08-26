# nexa-ui

基于 Vue 3 + TypeScript 的组件库。组件内部使用 UnoCSS 原子类开发，但发布产物是纯 JS + CSS，**消费方不需要安装 UnoCSS**。

## 环境要求

- Node.js >= 18
- npm（或 pnpm / yarn，下文以 npm 为例）

## 快速开始

```bash
npm install        # 安装仓库依赖
npm run dev        # 启动本地演示（组件演练场），默认 http://localhost:5173
```

## 常用命令

| 命令 | 说明 |
| --- | --- |
| `npm run dev` | 启动 Vite 本地演示（所有组件在 `src/App.vue` 中演示） |
| `npm run typecheck` | 对全部源码做类型检查（vue-tsc），构建问题会在这里暴露 |
| `npm run build` | 构建组件库到 `dist/`（ESM + CJS + 类型声明 + 样式） |
| `npm run verify` | 一键验证：类型检查 → 构建 → `npm pack` → 外部示例项目安装/类型检查/构建/SSR 冒烟 |
| `npm pack` | 产出发布用 tarball（内容由 package.json 的 `files` 字段限定为 `dist/`） |

## 目录结构

```
src/
  index.ts              库统一入口（命名导出全部组件 + 默认 Vue 插件）
  main.ts / App.vue      本地演练场入口与演示页（不发布）
  components/<Name>/     每个组件一个目录：N<Name>.vue + index.ts
  styles/                变量与全局 reset（构建时打包进 dist/style.css）
  types/  utils/  composables/
dist/                    构建产物（不入库）：index.js/index.cjs/index.d.ts/style.css + components/<Name>/
examples/consumer/       外部示例项目：以 tarball 方式安装本库，模拟真实业务项目
scripts/verify.mjs       验证流水线脚本
```

## 发布产物与消费方式

`npm run build` 产出（入口在 [vite.config.ts](vite.config.ts) 中自动扫描，新增组件目录即自动成为入口，无需改配置）：

- `dist/index.js` / `dist/index.cjs`：ESM 与 CJS 双格式统一入口
- `dist/index.d.ts`：统一入口类型声明（含每个组件的 `.d.ts`）
- `dist/components/<Name>/index.{js,cjs,d.ts}`：按组件子路径入口
- `dist/style.css`：全部样式（UnoCSS 工具类、图标、scoped 样式、CSS 变量与 reset）

业务项目安装后：

```ts
// 方式一：统一入口 + 全量注册
import NexaUI from "nexa-ui";
import "nexa-ui/style.css";
app.use(NexaUI);

// 方式二：统一入口按需引入（命名导出，可被打包器 tree-shake）
import { NButton } from "nexa-ui";

// 方式三：按组件子路径引入（不会拉入主入口）
import NCard from "nexa-ui/components/Card";
```

> 注意：组件样式全部在 `nexa-ui/style.css` 中，使用任意一种方式都需要引入一次。

## 新增组件

1. 新建目录 `src/components/<Name>/`，包含 `N<Name>.vue` 和导出它的 `index.ts`（参考现有组件）；
2. 在 [src/index.ts](src/index.ts) 的导入、导出与 `components` 清单中登记该组件（这是唯一需要手动登记的地方）；
3. `npm run typecheck && npm run build` —— Vite 会自动把它打包为 `dist/components/<Name>/`，子路径导出由 package.json 的通配映射 `./components/*` 自动覆盖。

## 验证流水线

`npm run verify` 覆盖「源码 → 产物 → 外部项目」完整链路：

1. 源码类型检查；
2. 构建 `dist/` 并校验关键产物存在（JS/CJS/d.ts/CSS、子路径、泛型组件声明）；
3. `npm pack` 生成与正式发布完全相同的 tarball（仅含 `files` 声明的文件）；
4. `examples/consumer`（一个独立的 Vite + Vue + TS 项目，且未安装 UnoCSS）以 `file:` 依赖安装该 tarball；
5. 对消费方做类型检查（验证 d.ts 与子路径 types 解析）；
6. 对消费方做生产构建（验证 JS 与 CSS 都能正确打包）；
7. SSR 冒烟：用 `@vue/server-renderer` 从已安装的包渲染真实组件，并校验发布 CSS 内容。

消费方示例的手动操作：

```bash
cd examples/consumer
npm install       # 需要先在仓库根目录跑过 npm pack（verify 会自动完成）
npm run typecheck
npm run build
npm run smoke
```
