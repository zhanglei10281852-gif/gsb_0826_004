import { execSync } from "node:child_process";
import { existsSync, readFileSync, rmSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const consumer = join(root, "examples", "consumer");
const pkg = JSON.parse(readFileSync(join(root, "package.json"), "utf8"));
const tgzName = `${pkg.name.replace(/^@/, "").replace("/", "-")}-${pkg.version}.tgz`;
const tgzPath = join(root, tgzName);

function run(cmd, cwd) {
  console.log(`\n\x1b[36m$ ${cmd}\x1b[0m  (cwd: ${cwd})`);
  execSync(cmd, { cwd, stdio: "inherit", shell: true });
}

function check(cond, message) {
  if (!cond) {
    console.error(`\x1b[31mVERIFY FAILED: ${message}\x1b[0m`);
    process.exit(1);
  }
  console.log(`\x1b[32m  ok:\x1b[0m ${message}`);
}

// 1. Library sources type-check
run("npm run typecheck", root);

// 2. Library build
run("npm run build", root);

// 3. Expected published artefacts
const expected = [
  "dist/index.js",
  "dist/index.cjs",
  "dist/index.d.ts",
  "dist/style.css",
  "dist/components/Button/index.js",
  "dist/components/Button/index.cjs",
  "dist/components/Button/index.d.ts",
  "dist/components/Table/NTable.vue.d.ts",
];
for (const rel of expected) {
  check(existsSync(join(root, rel)), `artefact exists: ${rel}`);
}
const entryJs = readFileSync(join(root, "dist/index.js"), "utf8");
check(!entryJs.includes("virtual:uno"), "virtual:uno.css does not leak into published JS");

// 4. Pack the library exactly like a publish
rmSync(tgzPath, { force: true });
run(`npm pack --ignore-scripts --pack-destination "${root}"`, root);
check(existsSync(tgzPath), `tarball created: ${tgzName}`);

// 5. External example installs the tarball as a dependency
run("npm install --no-audit --no-fund", consumer);

// 6. Example type-check: declarations resolve via package exports
run("npm run typecheck", consumer);

// 7. Example production build: JS + CSS bundle from the installed package
run("npm run build", consumer);
check(
  existsSync(join(consumer, "dist", "index.html")),
  "consumer example produced dist/index.html",
);

// 8. SSR smoke against the installed package
run("npm run smoke", consumer);

console.log("\n\x1b[32m=========================================");
console.log("  VERIFY PASSED: source -> package -> consumer");
console.log("=========================================\x1b[0m");
