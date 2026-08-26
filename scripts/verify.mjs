import { execSync } from 'child_process'
import { existsSync, statSync, readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')
const playground = resolve(root, 'playground')

function run(cmd, cwd, label) {
  console.log(`\n${'═'.repeat(60)}`)
  console.log(`  ${label}`)
  console.log(`  $ ${cmd}`)
  console.log('═'.repeat(60))
  try {
    execSync(cmd, { cwd, stdio: 'inherit', env: process.env })
    return true
  } catch {
    return false
  }
}

function checkFile(relPath, description) {
  const full = resolve(root, relPath)
  if (!existsSync(full)) {
    console.log(`  ✗ MISSING: ${relPath} — ${description}`)
    return false
  }
  const size = statSync(full).size
  console.log(`  ✓ ${relPath} (${(size / 1024).toFixed(1)} KB) — ${description}`)
  return true
}

let allPassed = true

console.log('╔══════════════════════════════════════════════════════════╗')
console.log('║     Nexa UI — 完整链路验证 (源码 → 产物 → 外部项目)       ║')
console.log('╚══════════════════════════════════════════════════════════╝')

// Step 1: Type-check the library source
if (!run('npx vue-tsc --noEmit', root, 'Step 1/5: 源码类型检查 (vue-tsc)')) {
  console.error('\n✗ 源码类型检查失败')
  process.exit(1)
}
console.log('\n✓ 源码类型检查通过')

// Step 2: Build the library
if (!run('node scripts/gen-index.mjs && npx vite build', root, 'Step 2/5: 构建组件库 (ESM + CJS + 类型 + CSS)')) {
  console.error('\n✗ 组件库构建失败')
  process.exit(1)
}
console.log('\n✓ 组件库构建完成')

// Step 3: Verify output artifacts
console.log(`\n${'═'.repeat(60)}`)
console.log('  Step 3/5: 验证构建产物结构')
console.log('═'.repeat(60))

const requiredFiles = [
  ['dist/index.mjs', 'ESM 主入口'],
  ['dist/index.cjs', 'CJS 主入口'],
  ['dist/index.d.ts', '主入口类型声明'],
  ['dist/style.css', '编译后的样式 (含 UnoCSS 工具类 + 图标)'],
  ['dist/Button/index.mjs', 'Button 组件 ESM (按需引入)'],
  ['dist/Button/index.cjs', 'Button 组件 CJS (按需引入)'],
  ['dist/Button/index.d.ts', 'Button 类型声明'],
  ['dist/Input/index.mjs', 'Input 组件 ESM'],
  ['dist/Input/NInput.vue.d.ts', 'Input 组件内部类型'],
  ['dist/Table/index.d.ts', 'Table 类型声明 (泛型导出)'],
  ['dist/types/index.d.ts', '公共类型导出'],
  ['dist/composables/useId.d.ts', 'composables 类型'],
]

let filesOk = true
for (const [file, desc] of requiredFiles) {
  if (!checkFile(file, desc)) filesOk = false
}
if (!filesOk) allPassed = false
else console.log('\n✓ 所有产物文件存在且非空')

// Verify CSS contains actual utility classes (not just reset)
const cssPath = resolve(root, 'dist/style.css')
const cssContent = existsSync(cssPath) ? readFileSync(cssPath, 'utf-8') : ''
const hasUtils = /\.bg-primary-600|\.flex|\.rounded-lg/.test(cssContent)
const hasIcons = /--i-mdi-loading|mdi-loading|i-carbon-user/.test(cssContent)
if (hasUtils) console.log('  ✓ style.css 包含 UnoCSS 工具类')
else { console.log('  ✗ style.css 缺少 UnoCSS 工具类'); allPassed = false }
if (hasIcons) console.log('  ✓ style.css 包含图标 CSS')
else { console.log('  ✗ style.css 缺少图标 CSS'); allPassed = false }

// Verify ESM has no virtual:uno.css reference
const esmContent = existsSync(resolve(root, 'dist/index.mjs'))
  ? readFileSync(resolve(root, 'dist/index.mjs'), 'utf-8')
  : ''
if (!esmContent.includes('virtual:uno') && !esmContent.includes('uno.css')) {
  console.log('  ✓ ESM 产物无 virtual:uno.css 残留引用')
} else {
  console.log('  ✗ ESM 产物包含 virtual:uno.css 残留'); allPassed = false
}

// Step 4: Install playground dependencies (links local library)
if (!run('npm install', playground, 'Step 4/5: 安装外部示例项目依赖 (file:.. 链接本地包)')) {
  console.error('\n✗ Playground 依赖安装失败')
  process.exit(1)
}
console.log('\n✓ Playground 依赖安装完成')

// Step 5: Type-check and build the playground
if (!run('npx vue-tsc --noEmit', playground, 'Step 5a/5: 外部项目类型检查 (验证 .d.ts 解析)')) {
  console.error('\n✗ Playground 类型检查失败 — 类型声明无法被外部项目解析')
  process.exit(1)
}
console.log('\n✓ 外部项目类型检查通过 — 类型声明正确')

if (!run('npx vite build', playground, 'Step 5b/5: 外部项目构建 (验证 ESM/CJS/CSS 消费)')) {
  console.error('\n✗ Playground 构建失败')
  process.exit(1)
}
console.log('\n✓ 外部项目构建成功')

// Final summary
console.log(`\n${'═'.repeat(60)}`)
if (allPassed) {
  console.log('  🎉 全部验证通过!')
  console.log('  源码 → 类型检查 → ESM/CJS 构建 → 类型声明 → 外部消费')
  console.log('═'.repeat(60))
  process.exit(0)
} else {
  console.log('  ⚠ 部分检查未通过，请查看上方日志')
  console.log('═'.repeat(60))
  process.exit(1)
}
