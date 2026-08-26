// 可重复的全链路验证入口（npm run verify）：
// 源码 → 组件库产物（JS/类型/样式）→ npm pack tarball → 外部示例项目安装 → 类型检查 → 构建 → 运行时渲染。
// 只依赖 npm 可安装的开源包与本地文件，不依赖任何外部托管服务，可反复执行。
import { spawnSync } from "node:child_process";
import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  rmSync,
} from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const exampleDir = path.join(root, "examples", "consumer");
const packDir = path.join(root, ".verify");
const isWin = process.platform === "win32";

let step = 0;
const log = (msg) => console.log(`\n[verify ${++step}/7] ${msg}`);

function run(cmd, args, cwd) {
  // Windows 上 npm 是 .cmd 脚本，必须通过 shell 执行
  const result = spawnSync(cmd, args, { cwd, stdio: "inherit", shell: isWin });
  if (result.status !== 0) {
    console.error(`\n[verify] 失败：${cmd} ${args.join(" ")}（目录 ${cwd}，退出码 ${result.status}）`);
    process.exit(result.status ?? 1);
  }
}

function assert(condition, msg) {
  if (!condition) {
    console.error(`\n[verify] 断言失败：${msg}`);
    process.exit(1);
  }
  console.log(`  ✓ ${msg}`);
}

// 1. 构建组件库（自动生成入口 + JS + 样式 + 类型声明）
log("构建组件库：npm run build");
run("npm", ["run", "build"], root);

// 2. 检查产物完整性与样式内容
log("检查 dist 产物");
const distEs = path.join(root, "dist", "es");
for (const file of [
  "index.mjs",
  "index.d.ts",
  "style.css",
  "components/Button/index.mjs",
  "components/Button/index.d.ts",
  "components/Input/index.mjs",
  "components/Table/index.mjs",
  "components/Table/types.d.ts",
  "composables/useId.mjs",
  "types/index.d.ts",
]) {
  assert(existsSync(path.join(distEs, file)), `产物存在 dist/es/${file}`);
}
const css = readFileSync(path.join(distEs, "style.css"), "utf8");
for (const token of [
  "--nexa-primary-500",
  "bg-primary-600",
  "i-mdi-loading",
  "i-carbon-user",
  "nexa-transition",
  "nexa-focus-ring",
  "z-modal",
  "@keyframes wave",
]) {
  assert(css.includes(token), `style.css 包含 ${token}`);
}

// 3. 生成发布 tarball（跳过 prepack，复用第 1 步的新鲜产物）
log("生成发布包：npm pack");
rmSync(packDir, { recursive: true, force: true });
mkdirSync(packDir, { recursive: true });
run("npm", ["pack", "--ignore-scripts", "--pack-destination", packDir], root);
const tgz = readdirSync(packDir).find((f) => f.endsWith(".tgz"));
assert(Boolean(tgz), `生成 tarball（${tgz}）`);
copyFileSync(path.join(packDir, tgz), path.join(exampleDir, "nexa-ui.tgz"));

// 4. 外部示例项目以 tarball 形式安装 nexa-ui（模拟真实消费）
log("外部示例项目安装依赖");
rmSync(path.join(exampleDir, "node_modules", "nexa-ui"), { recursive: true, force: true });
rmSync(path.join(exampleDir, "package-lock.json"), { force: true });
run("npm", ["install", "--no-audit", "--no-fund"], exampleDir);

// 5. 示例项目类型检查（验证统一入口与深路径的 d.ts 都能解析）
log("示例项目类型检查：npm run typecheck");
run("npm", ["run", "typecheck"], exampleDir);

// 6. 示例项目构建（验证 JS/样式在真实打包中可用）
log("示例项目构建：npm run build");
run("npm", ["run", "build"], exampleDir);
assert(existsSync(path.join(exampleDir, "dist", "index.html")), "示例项目构建产出 dist/index.html");

// 7. 运行时冒烟测试（SSR 渲染统一入口 / 按需引入 / 插件注册 / 样式解析）
log("运行时冒烟测试：npm run smoke");
run("npm", ["run", "smoke"], exampleDir);

console.log("\n[verify] 全部通过：源码 → 产物 → 外部示例项目完整链路验证成功");
